import {
  GoogleGenerativeAI as GoogleGenerativeAIClient,
  ModelParams,
  GenerationConfig,
  SafetySetting,
  GenerateContentCandidate,
  GenerativeModel,
  EnhancedGenerateContentResponse,
  GenerateContentResult,
  CountTokensResponse,
  PromptFeedback,
} from '@google/generative-ai';

import {
  SecretFields,
  SerializedFields,
} from '../../../../../../load/keymap.js';
import { AsyncCallError } from '../../../../../../utils/asyncCaller.js';
import { getEnvironmentVariables } from '../../../../../../utils/environment.js';
import { Generation } from '../../../../../output/provide/generation.js';
import { LLMResult } from '../../../../../output/provide/llmresult.js';
import { BaseLLM, BaseLLMParams } from '../../../base.js';
import { TokenUsage } from '../../../index.js';
import {
  GeminiCallOptions,
  GeminiSafetySetting,
  VertexAIBaseInput,
  checkModelForGemini,
  checkModelForGeminiVision,
  wrapGoogleGenerativeAIClientError,
} from '../index.js';

/**
 * Base interface for all Gemini API call parameters, specifying the essential prompt
 * required for generating content.
 */
export interface GeminiParamsBase extends ModelParams {
  prompt: string;
}

/**
 * Interface for non-streaming Gemini API call parameters, indicating that responses
 * will not be streamed.
 */
export interface GeminiParamsNonStreaming extends GeminiParamsBase {
  stream: false;
}

/**
 * Interface for streaming Gemini API call parameters, indicating that responses should
 * be streamed as they are generated.
 */
export interface GeminiParamsStreaming extends GeminiParamsBase {
  stream: true;
}

/**
 * Type definition for Gemini API call parameters that may be either streaming or
 * non-streaming based on the `stream` property.
 */
export type GeminiParams = GeminiParamsNonStreaming | GeminiParamsStreaming;

/**
 * Represents a text response candidate from a Gemini model generation, omitting the
 * original content descriptor.
 */
export type GeminiTextCandidate = Omit<GenerateContentCandidate, 'content'> & {
  text: string;
};

/**
 * The main class for interacting with the Gemini AI model, capable of handling both
 * streaming and non-streaming responses.
 *
 * @example
 * ```typescript
 * const geminiAI = new Gemini({
 *   modelName: 'gemini-pro',
 *   googleApiKey: 'your-api-key',
 * });
 * const prompt = "Hello, world!";
 * const response = await geminiAI.invoke(prompt);
 * console.log(response);
 * ```
 */
export class Gemini<CallOptions extends GeminiCallOptions = GeminiCallOptions>
  extends BaseLLM<CallOptions>
  implements VertexAIBaseInput
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
    return 'Gemini';
  }

  /**
   * ID of the model to use. Only support `gemini-pro` for now
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
   */
  maxOutputTokens = 2048;

  /**
   * Streaming involves receiving responses to prompts as they are generated.
   * That is, as soon as the model generates output tokens, the output tokens
   * are sent.
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

  _llmType(): string {
    return 'gemini';
  }

  constructor(fields?: Partial<VertexAIBaseInput> & BaseLLMParams) {
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
      throw new Error('please use `GeminiChat` for `gemini-pro-vision` model.');
    }

    this.topK = fields?.topK ?? 1;
    this.maxOutputTokens = fields?.maxOutputTokens ?? 2048;

    if (this.maxOutputTokens > 2048) {
      console.warn(
        'gemini-pro does not support output token larger than 2048, now using 2048 as maxOutputTokens.'
      );
      this.maxOutputTokens = 2048;
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

  /**
   * Retrieves the safety settings from the provided options, which configure thresholds
   * for blocking content based on its safety category.
   *
   * @param options - Optional serialized call options that may include safety settings.
   * @returns An array of safety settings used to configure content blocking.
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
  ): Omit<GeminiParams, 'prompt'> {
    return {
      model: this.modelName,
      safetySettings: this._getSafetySettings(options),
      generationConfig: this._getGenerationConfig(),
      stream: this.streaming,
      ...this.additionalKwargs,
    };
  }

  /**
   * Provides a response from the Gemini model based on the given prompt and options.
   * Handles both streaming and non-streaming responses.
   *
   * @param prompt - The text prompt to send to the model.
   * @param options - Serialized call options that may include request modifiers like streaming.
   * @returns A promise resolving to the language model result.
   * @internal
   * @example
   * ```typescript
   * const geminiAI = new Gemini({
   *   modelName: 'gemini-pro',
   *   googleApiKey: 'your-api-key',
   * });
   * const prompt = "Explain the theory of relativity.";
   * const result = await geminiAI._provide(prompt, { streaming: false });
   * console.log(result);
   * ```
   */
  async _provide(
    prompt: string,
    options: this['SerializedCallOptions']
  ): Promise<LLMResult> {
    const candidates: GeminiTextCandidate[] = [];
    const tokenUsage: TokenUsage = {};

    const params = this.getParams(options);

    let response: {
      candidates: GeminiTextCandidate[];
      promptFeedback?: PromptFeedback | undefined;
    };

    if (params.stream) {
      response = await this._completionWithStream(params, prompt, options);
    } else {
      const res: EnhancedGenerateContentResponse =
        await this.completionWithRetry(
          {
            ...params,
            stream: false,
            prompt: prompt,
          },
          {
            signal: options?.signal,
            ...options,
          }
        );

      response = {
        candidates: res.candidates
          ? res.candidates.map(
              (candidate: GenerateContentCandidate): GeminiTextCandidate => ({
                ...candidate,
                text: res.text(),
              })
            )
          : [],
        promptFeedback: res.promptFeedback,
      };
    }

    candidates.push(...response.candidates);

    if (candidates.length === 0) {
      throw new Error('No candidates from Gemini response.');
    }

    const promptTokens: number = await this.getNumTokens(prompt);
    let completionTokens: number | undefined;

    const generations: Array<unknown> = [];
    for (const candidate of response.candidates) {
      completionTokens =
        (completionTokens ?? 0) + (await this.getNumTokens(candidate.text));

      const output: string = candidate.text;

      const info = {
        finishReason: candidate.finishReason,
        completion: candidate.index ?? 0,
        finishMessage: candidate.finishMessage,
        safetyRatings: candidate.safetyRatings,
        citationMetadata: candidate.citationMetadata,
      };

      generations.push({
        output,
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

  /**
   * Handles the streaming of data from the Gemini model, aggregating responses as they are
   * received.
   *
   * @param params - Parameters for the stream request, excluding the 'prompt'.
   * @param prompt - The prompt to use for generating content.
   * @param options - Serialized call options relevant to the request.
   * @returns A promise resolving to a structured response aggregating all streamed content.
   * @internal
   */
  private async _completionWithStream(
    params: Omit<GeminiParams, 'prompt'>,
    prompt: string,
    options: this['SerializedCallOptions']
  ) {
    const candidates: GeminiTextCandidate[] = [];
    let res:
      | Omit<EnhancedGenerateContentResponse, 'candidates' | 'text'>
      | undefined;

    const stream: AsyncIterable<EnhancedGenerateContentResponse> =
      await this.completionWithRetry(
        {
          ...params,
          stream: true,
          prompt,
        },
        options
      );

    for await (const message of stream) {
      if (!res) {
        res = {
          promptFeedback: message.promptFeedback,
        };
      }

      for (const part of message.candidates!) {
        if (!candidates[part.index]) {
          candidates[part.index] = {
            ...part,
            text: message.text(),
          };
        } else {
          const candidate: GeminiTextCandidate = candidates[part.index];
          candidate.text += message.text();
          candidate.finishReason = part.finishReason;
          candidate.finishMessage = part.finishMessage;
          candidate.safetyRatings = part.safetyRatings;
          candidate.citationMetadata = part.citationMetadata;
        }
      }
    }

    if (options.signal?.aborted) {
      throw new Error('AbortError');
    }

    return { ...res, candidates };
  }

  /**
   * Generates content asynchronously by creating an iterable that yields content responses
   * from the AI model as they are received.
   *
   * @param model - The generative model to use for content generation.
   * @param prompt - The input prompt based on which the content is generated.
   * @param options - Optional parameters that may affect the generation process.
   * @returns An async iterable that yields content responses.
   * @internal
   */
  private async *_generateContentIterable(
    model: GenerativeModel,
    prompt: string,
    options?: GeminiCallOptions
  ): AsyncIterable<EnhancedGenerateContentResponse> {
    const stream: AsyncGenerator<EnhancedGenerateContentResponse> =
      await this.caller.callWithOptions(
        { signal: options?.signal },
        async () => {
          const { stream, response } =
            await model.generateContentStream(prompt);

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
   * Attempts to complete an operation with the Gemini model, retrying on failure.
   * Supports both streaming and non-streaming operations based on the provided request configuration.
   *
   * @param request - The request parameters, which may indicate whether the response should be streamed.
   * @param options - Optional call options including signaling for aborting the request.
   * @returns Either an async iterable of responses for streaming or a single response for non-streaming.
   * @example
   * ```typescript
   * const geminiAI = new Gemini({
   *   modelName: 'gemini-pro',
   *   googleApiKey: 'your-api-key',
   * });
   * try {
   *   const response = await geminiAI.completionWithRetry({ model: 'gemini-pro', prompt: "Hello, world!", stream: false });
   *   console.log(response);
   * } catch (error) {
   *   console.error("Failed to fetch response:", error);
   * }
   * ```
   */
  async completionWithRetry(
    request: GeminiParamsStreaming,
    options?: GeminiCallOptions
  ): Promise<AsyncIterable<EnhancedGenerateContentResponse>>;

  async completionWithRetry(
    request: GeminiParamsNonStreaming,
    options?: GeminiCallOptions
  ): Promise<EnhancedGenerateContentResponse>;

  async completionWithRetry(
    request: GeminiParamsNonStreaming | GeminiParamsStreaming,
    options?: GeminiCallOptions
  ): Promise<
    | AsyncIterable<EnhancedGenerateContentResponse>
    | EnhancedGenerateContentResponse
  > {
    const modelParams: ModelParams = this._getModelParams(options);

    const model: GenerativeModel =
      this._getClient().getGenerativeModel(modelParams);

    if (request.stream) {
      return this._generateContentIterable(model, request.prompt, options);
    } else {
      return await this.caller.call(async () => {
        const res: GenerateContentResult = await model.generateContent(
          request.prompt
        );

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
   * Retrieves the number of tokens in the given text using the specified model's tokenizer.
   *
   * @param text - The text to tokenize.
   * @returns The total number of tokens in the text.
   * @example
   * ```
   * const geminiAI = new Gemini({
   *   modelName: 'gemini-pro',
   *   googleApiKey: 'your-api-key',
   * });
   * const tokenCount = await geminiAI.getNumTokens("Example text for tokenization.");
   * console.log(tokenCount); // Outputs the number of tokens
   * ```
   */
  async getNumTokens(text: string): Promise<number> {
    const numTokensResponse: CountTokensResponse = await this._getClient()
      .getGenerativeModel({
        model: this.modelName,
      })
      .countTokens(text);

    return numTokensResponse.totalTokens;
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
   * ```
   * const contextSize = Gemini.getModelContextSize('gemini-pro');
   * console.log(contextSize); // Outputs: 32768
   * ```
   */
  static getModelContextSize(modelName: 'gemini-pro'): number {
    switch (modelName) {
      case 'gemini-pro':
        return 32768;
    }
  }

  /**
   * Retrieves or initializes the client for interacting with the AI service.
   *
   * @returns The initialized client.
   * @throws Error if the API key is not found.
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

  /** @hidden */
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
