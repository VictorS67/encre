import {
  GoogleGenerativeAI as GoogleGenerativeAIClient,
  Content,
  ModelParams,
  GenerationConfig,
  SafetySetting,
  GenerateContentCandidate,
  GenerateContentResponse,
  GenerativeModel,
  GenerateContentRequest,
  EnhancedGenerateContentResponse,
  GenerateContentResult,
  CountTokensResponse,
  TextPart,
  Part,
} from '@google/generative-ai';

import {
  type SecretFields,
  type SerializedFields,
} from '../../../../../../load/keymap.js';
import { AsyncCallError } from '../../../../../../utils/asyncCaller.js';
import { getEnvironmentVariables } from '../../../../../../utils/environment.js';
import { BaseMessage } from '../../../../../input/load/msgs/index.js';
import {
  type Generation,
  type LLMResult,
  ChatGenerationChunk,
} from '../../../../../output/provide/index.js';
import { BaseChatLM, type BaseLLMParams } from '../../../base.js';
import { type TokenUsage } from '../../../index.js';
import { wrapGoogleGenerativeAIClientError } from '../index.js';
import {
  type GeminiCallOptions,
  type GeminiContent,
  type GeminiContentRole,
  type GeminiInput,
  type GeminiSafetySetting,
  checkModelForGemini,
  checkModelForGeminiVision,
} from '../index.js';
import {
  getContentFromMessage,
  getMessageFromContent,
  getMessageFromContentWithRole,
  isModalityRequiredInMessage,
} from './utils.js';

export interface GeminiChatParamsBase extends ModelParams {
  contents: Content[];
}

export interface GeminiChatParamsNonStreaming extends GeminiChatParamsBase {
  stream: false;
}

export interface GeminiChatParamsStreaming extends GeminiChatParamsBase {
  stream: true;
}

export type GeminiChatParams =
  | GeminiChatParamsNonStreaming
  | GeminiChatParamsStreaming;

/**
 * The `GeminiChat` class extends `BaseChatLM` to interface with Google's Gemini models.
 * It manages chat operations by configuring and controlling the generative process
 * based on the provided options and contents, including handling of streaming content.
 *
 * @example
 * ```typescript
 * const geminiAI = new GeminiChat({
 *   modelName: 'gemini-pro',
 *   googleApiKey: 'your-api-key',
 * });
 * const message = new HumanMessage("Hello, world!");
 * const response = await geminiAI.invoke([message]);
 * console.log(response);
 * ```
 */
export class GeminiChat<
    CallOptions extends GeminiCallOptions = GeminiCallOptions,
  >
  extends BaseChatLM<CallOptions>
  implements GeminiInput
{
  _isSerializable = true;

  get _secrets(): SecretFields | undefined {
    return {
      googleApiKey: 'GOOGLE_API_KEY',
    };
  }

  get _aliases(): SerializedFields | undefined {
    return {
      googleApiKey: 'apiKey',
    };
  }

  static _name(): string {
    return 'GeminiChat';
  }

  /**
   * ID of the model to use. `gemini-pro` or `gemini-pro-vision`
   */
  modelName = 'gemini-pro';

  /**
   * The temperature is used for sampling during the response generation,
   * which occurs when topP and topK are applied. Temperature controls the
   * degree of randomness in token selection. Lower temperatures are good
   * for prompts that require a more deterministic and less open-ended or
   * creative response, while higher temperatures can lead to more diverse
   * or creative results.
   *
   * A temperature of 0 is deterministic: the highest probability response
   * is always selected.
   *
   * Range: 0.0 - 1.0
   *
   * Default for gemini-pro: 0.9
   *
   * Default for gemini-pro-vision: 0.4
   */
  temperature = 0.9;

  /**
   * Top-P changes how the model selects tokens for output. Tokens are
   * selected from the most (see top-K) to least probable until the sum of
   * their probabilities equals the top-P value.
   *
   * For example, if tokens A, B, and C have a probability of 0.3, 0.2, and
   * 0.1 and the top-P value is 0.5, then the model will select either A or
   * B as the next token by using temperature and excludes C as a candidate.
   *
   * Specify a lower value for less random responses and a higher value for
   * more random responses.
   *
   * Range: 0.0 - 1.0
   *
   * Default: 1.0
   */
  topP = 1.0;

  /**
   * The number of response variations to return.
   *
   * This value must be 1.
   */
  candidateCount = 1;

  /**
   * Maximum number of tokens that can be generated in the response. A token
   * is approximately four characters. 100 tokens correspond to roughly 60-80
   * words. Specify a lower value for shorter responses and a higher value for
   * potentially longer responses.
   *
   * Range: 1-2048
   *
   * Default for gemini-pro: 2048
   *
   * Default for gemini-pro-vision: 4096
   */
  maxOutputTokens = 2048;

  /**
   * Whether the response comes with stream
   */
  streaming = true;

  /**
   * Top-K changes how the model selects tokens for output. A top-K of 1 means
   * the next selected token is the most probable among all tokens in the model's
   * vocabulary (also called greedy decoding), while a top-K of 3 means that
   * the next token is selected from among the three most probable tokens by
   * using temperature.
   *
   * For each token selection step, the top-K tokens with the highest probabilities
   * are sampled. Then tokens are further filtered based on top-P with the final
   * token selected using temperature sampling.
   *
   * Specify a lower value for less random responses and a higher value for more
   * random responses.
   *
   * Range: 1 - 40
   *
   * Default for gemini-pro: none
   *
   * Default for gemini-pro-vision: 32
   */
  topK: number;

  /**
   * API key to use when making requests to Gemini. Defaults to the value of
   * `GOOGLE_API_KEY` environment variable.
   */
  googleApiKey?: string;

  /**
   * Up to 5 sequences where the API will stop generating text if one of the
   * strings is encountered in the response. If a string appears multiple
   * times in the response, then the response truncates where it's first
   * encountered. The strings are case-sensitive.
   */
  stopSequences?: string[];

  /**
   * Holds any additional parameters that are valid to pass to
   * VertexAI models that are not explicitly specified on the class.
   */
  additionalKwargs?: Record<string, unknown>;

  /** Gemini contents to pass as a prefix to the prompt */
  contents: GeminiContent[];

  /**
   * The Vertex AI Gemini API blocks unsafe content based on a list of safety
   * attributes and their configured blocking thresholds.
   */
  safetySettings?: Array<GeminiSafetySetting>;

  /**
   * VertexAI API Client.
   * @internal
   */
  private _client: GoogleGenerativeAIClient;

  /**
   * Whether the model supports vision (i.e. multimodal)
   * @internal
   */
  private _isMultimodal = false;

  _llmType(): string {
    return 'gemini';
  }

  constructor(fields?: Partial<GeminiInput> & BaseLLMParams) {
    super(fields ?? {});

    this.googleApiKey =
      fields?.googleApiKey ?? getEnvironmentVariables('GOOGLE_API_KEY');

    if (!this.googleApiKey) {
      throw new Error('Google API Key not found');
    }

    this.modelName = fields?.modelName ?? this.modelName;

    if (!checkModelForGemini(this.modelName)) {
      throw new Error(
        'model is not valid for Gemini, please change it to `gemini-pro` or `gemini-pro-vision`'
      );
    }

    if (checkModelForGeminiVision(this.modelName)) {
      this._isMultimodal = true;
      this.temperature = 0.4;
      this.topK = fields?.topK ?? 32;
      this.maxOutputTokens = fields?.maxOutputTokens ?? 4096;

      if (this.maxOutputTokens > 4096) {
        console.warn(
          'gemini-pro-vision does not support output token larger than 4096, now using 4096 as maxOutputTokens.'
        );
        this.maxOutputTokens = 4096;
      }
    } else {
      this.topK = fields?.topK ?? 1;
      this.maxOutputTokens = fields?.maxOutputTokens ?? 2048;

      if (this.maxOutputTokens > 2048) {
        console.warn(
          'gemini-pro does not support output token larger than 2048, now using 2048 as maxOutputTokens.'
        );
        this.maxOutputTokens = 2048;
      }
    }

    this.temperature = fields?.temperature ?? this.temperature;
    this.topP = fields?.topP ?? this.topP;

    this.additionalKwargs = fields?.additionalKwargs ?? {};

    this.stopSequences = fields?.stopSequences;
    this.streaming = fields?.streaming ?? this.streaming;
  }

  /**
   * Constructs the generation configuration used for making requests to the AI model.
   * This configuration controls aspects like temperature, token sampling, and response length.
   *
   * @returns An object detailing the generation configuration for the model.
   * @internal
   */
  protected _getGenerationConfig(): GenerationConfig {
    return {
      temperature: this.temperature,
      topP: this.topP,
      topK: this.topK,
      candidateCount: this.candidateCount,
      maxOutputTokens: this.maxOutputTokens,
      stopSequences: this.stopSequences ? this.stopSequences : [],
    };
  }

  // protected _getTools(
  //   options?: this['SerializedCallOptions'] | undefined
  // ): Array<GeminiTool> {
  //   if (options && options['tools']) {
  //   }

  //   return options && options['tools'] ? options['tools'] : [];
  // }

  /**
   * Retrieves safety settings for the generative model, potentially from serialized call options.
   *
   * @param {this['SerializedCallOptions']} [options] - Optional serialized call options to retrieve safety settings from.
   * @returns {Array<SafetySetting>} Array of configured safety settings.
   * @internal
   */
  protected _getSafetySettings(
    options?: this['SerializedCallOptions'] | undefined
  ): Array<SafetySetting> {
    if (options && options['safetySettings']) {
      return options['safetySettings'].map((setting: GeminiSafetySetting) => ({
        category: setting.category,
        threshold: setting.threshold,
      }));
    }

    return [];
  }

  protected _failedAttemptHandler(e: Error): void {
    const error: Error = wrapGoogleGenerativeAIClientError(e);
    super._failedAttemptHandler(error);
  }

  getParams(
    options?: this['SerializedCallOptions']
  ): Omit<GeminiChatParams, 'contents'> {
    return {
      model: this.modelName,
      // tools: this._getTools(options),
      safetySettings: this._getSafetySettings(options),
      generationConfig: this._getGenerationConfig(),
      stream: this.streaming,
      ...this.additionalKwargs,
    };
  }

  /**
   * Processes input messages and generates responses based on the provided options.
   * Handles both single response and streaming scenarios.
   *
   * @param messages - The array of base messages to be processed.
   * @param options - Serialized call options that may modify the behavior of the method.
   * @returns A promise resolving to the language model result, including generated contents and token usage.
   * @example
   * ```typescript
   * const geminiChat = new GeminiChat({
   *   modelName: 'gemini-pro',
   *   googleApiKey: 'your-api-key',
   * });
   * const messages = [new HumanMessage({ content: "Hello, world!" })];
   * const options = { safetySettings: [{ category: 'hate', threshold: 'high' }] };
   * const result = await geminiChat._provide(messages, options);
   * console.log(result);
   * ```
   */
  async _provide(
    messages: BaseMessage[],
    options: this['SerializedCallOptions']
  ): Promise<LLMResult> {
    if (
      this._isMultimodal !== true &&
      messages.some((message: BaseMessage) =>
        isModalityRequiredInMessage(message)
      )
    ) {
      throw new Error(
        'Message contains Image input but modality is not enabled for gemini-pro, please change it to gemini-pro-vision.'
      );
    }

    const tokenUsage: TokenUsage = {};

    const params = this.getParams(options);
    const convertedContents: Content[] = messages.map((message: BaseMessage) =>
      getContentFromMessage(message)
    );

    if (this.streaming) {
      const stream = this._completionWithStream(
        params,
        convertedContents,
        options
      );

      const chunks: Record<number, ChatGenerationChunk> = {};
      for await (const chunk of stream) {
        const index: number = (chunk.info?.completion as number) ?? 0;
        if (chunks[index] === undefined) {
          chunks[index] = chunk;
        } else {
          chunks[index] = chunks[index].concat(chunk);
        }
      }

      const generations: ChatGenerationChunk[] = Object.keys(chunks)
        .sort((a: string, b: string) => parseInt(a, 10) - parseInt(b, 10))
        .map((key: string): ChatGenerationChunk => chunks[key]);

      const messageTokenUsage = await this.getNumTokensInChat(messages);

      const generationsTokenUsage =
        await this.getNumTokensInGenerations(generations);

      tokenUsage.promptTokens = messageTokenUsage;
      tokenUsage.completionTokens = generationsTokenUsage;
      tokenUsage.totalTokens = messageTokenUsage + generationsTokenUsage;

      return { generations, llmOutput: { tokenUsage } };
    } else {
      const response = await this.completionWithRetry(
        {
          ...params,
          stream: false,
          contents: convertedContents,
        },
        {
          ...options,
        }
      );

      const promptTokens: number = await this.getNumTokensInChat(messages);
      let completionTokens: number | undefined;

      if (!response.candidates) {
        throw new Error('No candidates from Gemini response.');
      }

      const generations: Array<unknown> = [];
      for (const candidate of response.candidates) {
        const numTokensResponse: CountTokensResponse = await this._getClient()
          .getGenerativeModel({
            model: this.modelName,
          })
          .countTokens({
            contents: [candidate.content],
          });

        completionTokens =
          (completionTokens ?? 0) + numTokensResponse.totalTokens;

        const output: string = candidate.content.parts
          .map((part: Part) => (part as TextPart).text)
          .join('\n');

        const message: BaseMessage = getMessageFromContent(
          candidate.content ?? { role: 'assistant' }
        );

        const info = {
          finishReason: candidate.finishReason,
          completion: candidate.index ?? 0,
          finishMessage: candidate.finishMessage,
          safetyRatings: candidate.safetyRatings,
          citationMetadata: candidate.citationMetadata,
        };

        generations.push({
          output,
          message,
          info,
        });
      }

      const totalTokens: number = promptTokens + (completionTokens ?? 0);

      if (completionTokens) {
        tokenUsage.completionTokens =
          (tokenUsage.completionTokens ?? 0) + completionTokens;
      }

      if (promptTokens) {
        tokenUsage.promptTokens = (tokenUsage.promptTokens ?? 0) + promptTokens;
      }

      if (totalTokens) {
        tokenUsage.totalTokens = (tokenUsage.totalTokens ?? 0) + totalTokens;
      }

      return {
        generations: generations as Generation[],
        llmOutput: { tokenUsage },
      };
    }
  }

  /**
   * Handles streaming responses for chat completions. Assembles message parts into complete
   * chat messages.
   *
   * @param params - Parameters excluding the contents for the Gemini API.
   * @param contents - The contents to be sent for completion.
   * @param options - Additional call options.
   * @returns An async generator yielding chat generation chunks.
   * @internal
   */
  private async *_completionWithStream(
    params: Omit<GeminiChatParams, 'contents'>,
    contents: Content[],
    options: this['SerializedCallOptions']
  ): AsyncGenerator<ChatGenerationChunk> {
    const stream: AsyncIterable<GenerateContentResponse> =
      await this.completionWithRetry(
        {
          ...params,
          stream: true,
          contents,
        },
        options
      );

    let defaultRole: GeminiContentRole | undefined = 'model';
    for await (const content of stream) {
      const candidate: GenerateContentCandidate | undefined =
        content.candidates?.[0];

      if (!candidate) {
        continue;
      }

      const newMessage: BaseMessage = getMessageFromContentWithRole(
        candidate.content,
        defaultRole
      );

      defaultRole =
        (candidate.content.role as GeminiContentRole) ?? defaultRole;

      const generationChunk = new ChatGenerationChunk({
        output:
          typeof newMessage.content === 'string' ? newMessage.content : '',
        message: newMessage,
        info: {
          finishReason: candidate.finishReason,
          completion: candidate.index ?? 0,
          finishMessage: candidate.finishMessage,
          safetyRatings: candidate.safetyRatings,
          citationMetadata: candidate.citationMetadata,
        },
      });

      yield generationChunk;
    }

    if (options.signal?.aborted) {
      throw new Error('AbortError');
    }
  }

  /**
   * Asynchronously generates content in a streaming fashion, useful for handling continuous
   * data flows.
   *
   * @param model - The generative model to use for content generation.
   * @param request - The content generation request parameters.
   * @param options - Options that may influence streaming, such as cancellation tokens.
   * @returns An async iterable that yields generated content responses.
   * @internal
   */
  private async *_generateContentIterable(
    model: GenerativeModel,
    request: GenerateContentRequest,
    options?: GeminiCallOptions
  ): AsyncIterable<EnhancedGenerateContentResponse> {
    const stream: AsyncGenerator<EnhancedGenerateContentResponse> =
      await this.caller.callWithOptions(
        { signal: options?.signal },
        async () => {
          const { stream, response } =
            await model.generateContentStream(request);

          const res = await response;
          if (
            res &&
            'promptFeedback' in res &&
            typeof res['promptFeedback'] === 'object' &&
            'blockReason' in res['promptFeedback']
          ) {
            this._throwErrorForBlockReason(
              res['promptFeedback']['blockReason']
            );
          }

          return stream;
        }
      );

    // Iterate over the async generator from the stream
    for await (const content of stream) {
      yield content;
    }
  }

  /**
   * Attempts to complete an operation with retries, supporting both streaming and non-streaming responses.
   * Handles API calls with appropriate retries and error handling.
   *
   * @param request - The request configuration, determining if streaming is enabled.
   * @param options - Optional parameters including retry and timeout settings.
   * @returns Either an async iterable of chat responses for streaming or a single chat response for non-streaming.
   * @example
   * ```typescript
   * const geminiChat = new GeminiChat({
   *   modelName: 'gemini-pro',
   *   googleApiKey: 'your-api-key',
   * });
   *
   * const content = {
   *   parts: [
   *     { text: "Hello, world!" }
   *   ]
   * };
   *
   * try {
   *   const response = await geminiChat.completionWithRetry(
   *     { contents: [content], stream: false }
   *   );
   *   console.log(response);
   * } catch (error) {
   *   console.error("Completion failed:", error);
   * }
   * ```
   */
  async completionWithRetry(
    request: GeminiChatParamsStreaming,
    options?: GeminiCallOptions
  ): Promise<AsyncIterable<GenerateContentResponse>>;

  async completionWithRetry(
    request: GeminiChatParamsNonStreaming,
    options?: GeminiCallOptions
  ): Promise<GenerateContentResponse>;

  async completionWithRetry(
    request: GeminiChatParamsNonStreaming | GeminiChatParamsStreaming,
    options?: GeminiCallOptions
  ): Promise<AsyncIterable<GenerateContentResponse> | GenerateContentResponse> {
    const modelParams: ModelParams = this._getModelParams(options);

    const model: GenerativeModel =
      this._getClient().getGenerativeModel(modelParams);

    const req: GenerateContentRequest = {
      contents: request.contents,
      safetySettings: request.safetySettings,
      generationConfig: request.generationConfig,
    };

    if (request.stream) {
      return this._generateContentIterable(model, req, options);
    } else {
      return await this.caller.call(async () => {
        const res: GenerateContentResult = await model.generateContent(req);

        const response = res.response;
        if (
          response &&
          'promptFeedback' in response &&
          typeof response['promptFeedback'] === 'object' &&
          response['promptFeedback'] !== null &&
          'blockReason' in response['promptFeedback']
        ) {
          this._throwErrorForBlockReason(
            response['promptFeedback']['blockReason'] as string
          );
        }

        return response;
      });
    }
  }

  /**
   * Throws a formatted error based on a provided block reason, potentially including a
   * custom message.
   *
   * @param blockReason - The reason provided by the model for blocking the generation.
   * @param blockReasonMessage - Optional additional message to include in the error.
   * @throws An error indicating why the generation was blocked.
   * @internal
   */
  protected _throwErrorForBlockReason(
    blockReason: string,
    blockReasonMessage?: string
  ) {
    const error = new Error(
      `The message is blocked because of ${blockReason}` +
        (blockReasonMessage ? `: ${blockReasonMessage}` : '')
    );

    (error as AsyncCallError).status = 406;

    throw error;
  }

  /**
   * Retrieves the context size of the specified model, which indicates the maximum number
   * of tokens that can be considered in one response.
   *
   * @param modelName - The name of the model to query.
   * @returns The number of tokens in the model's context size.
   * @example
   * ```typescript
   * const contextSize = GeminiChat.getModelContextSize('gemini-pro-vision');
   * console.log(contextSize); // Outputs: 16384
   * ```
   */
  static getModelContextSize(
    modelName: 'gemini-pro' | 'gemini-pro-vision'
  ): number {
    switch (modelName) {
      case 'gemini-pro':
        return 32768;
      case 'gemini-pro-vision':
        return 16384;
    }
  }

  /**
   * Calculates the total number of tokens in an array of generated chat contents.
   *
   * @param generations - An array of chat generation chunks.
   * @returns The total number of tokens across all provided chat contents.
   * @example
   * ```typescript
   * const geminiChat = new GeminiChat({
   *   modelName: 'gemini-pro',
   *   googleApiKey: 'your-api-key',
   * });
   * const tokens = await geminiChat.getNumTokensInGenerations(generations);
   * console.log("Total tokens in generations:", tokens);
   * ```
   */
  async getNumTokensInGenerations(generations: ChatGenerationChunk[]) {
    const geminiContents: Content[] = generations.map(
      (generation: ChatGenerationChunk) =>
        getContentFromMessage(generation.message)
    );

    return await this.getNumTokensInContents(geminiContents);
  }

  /**
   * Calculates the total number of tokens in an array of chat messages prior to generation.
   *
   * @param messages - An array of base messages to be processed.
   * @returns The total number of tokens used in the chat messages.
   * @example
   * ```typescript
   * const geminiChat = new GeminiChat({
   *   modelName: 'gemini-pro',
   *   googleApiKey: 'your-api-key',
   * });
   * const messages = [new HumanMessage({ content: "Hello, world!" })];
   * const tokenCount = await geminiChat.getNumTokensInChat(messages);
   * console.log(tokenCount);
   * ```
   */
  async getNumTokensInChat(messages: BaseMessage[]): Promise<number> {
    const geminiContents: Content[] = messages.map((message: BaseMessage) =>
      getContentFromMessage(message)
    );

    return await this.getNumTokensInContents(geminiContents);
  }

  /**
   * Calculates the total number of tokens in an array of Gemini contents, which can include both text and media.
   *
   * @param geminiContents - An array of contents each potentially including multiple media types.
   * @returns The total number of tokens across all contents.
   * @example
   * ```typescript
   * const geminiChat = new GeminiChat({
   *   modelName: 'gemini-pro',
   *   googleApiKey: 'your-api-key',
   * });
   * const contents = [
   *   { text: "Hello, world!" },
   *   { inlineData: { mimeType: 'image/png', data: '...' } }
   * ];
   * const tokenCount = await geminiChat.getNumTokensInContents(contents);
   * console.log(tokenCount);
   * ```
   */
  async getNumTokensInContents(geminiContents: Content[]): Promise<number> {
    const numTokensResponse: CountTokensResponse = await this._getClient()
      .getGenerativeModel({
        model: this.modelName,
      })
      .countTokens({
        contents: geminiContents,
      });

    return numTokensResponse.totalTokens;
  }

  /**
   * Retrieves or initializes the client used to interact with the Vertex AI API.
   *
   * @returns The initialized GoogleGenerativeAIClient instance.
   * @throws Error if the API key is not found or the client could not be initialized.
   * @internal
   */
  private _getClient(): GoogleGenerativeAIClient {
    if (!this._client) {
      if (!this.googleApiKey) {
        throw new Error('Google API Key not found');
      }

      this._client = new GoogleGenerativeAIClient(this.googleApiKey);
    }

    return this._client;
  }

  /**
   * Constructs and returns the model parameters based on the current settings and options.
   *
   * @param options - Optional parameters that might influence the generated model parameters.
   * @returns The constructed model parameters.
   * @internal
   */
  private _getModelParams(options?: GeminiCallOptions): ModelParams {
    return {
      model: this.modelName,
      // tools: this._getTools(options as this["SerializedCallOptions"]),
      safetySettings: this._getSafetySettings(
        options as this['SerializedCallOptions']
      ),
      generationConfig: this._getGenerationConfig(),
      ...this.additionalKwargs,
    };
  }
}
