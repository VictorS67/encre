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
  SecretFields,
  SerializedFields,
} from '../../../../../../load/keymap.js';
import { AsyncCallError } from '../../../../../../utils/asyncCaller.js';
import { getEnvironmentVariables } from '../../../../../../utils/environment.js';
import { BaseMessage } from '../../../../../input/load/msgs/base.js';
import {
  Generation,
  GenerationChunk,
} from '../../../../../output/provide/generation.js';
import { LLMResult } from '../../../../../output/provide/llmresult.js';
import {
  ChatGeneration,
  ChatGenerationChunk,
} from '../../../../../output/provide/message.js';
import { BaseChatLM, BaseLLMParams } from '../../../base.js';
import { TokenUsage } from '../../../index.js';
import {
  GeminiCallOptions,
  GeminiContent,
  GeminiContentRole,
  GeminiInput,
  GeminiSafetySetting,
  checkModelForGemini,
  checkModelForGeminiVision,
  wrapGoogleGenerativeAIClientError,
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
   * `gemini-pro` or `gemini-pro-vision`
   */
  modelName = 'gemini-pro';

  /**
   * Default for gemini-pro: 0.9
   * Default for gemini-pro-vision: 0.4
   */
  temperature = 0.9;

  /**
   * Default: 1.0
   */
  topP = 1.0;

  /**
   * This value must be 1.
   */
  candidateCount = 1;

  /**
   * Default for gemini-pro: 2048
   * Default for gemini-pro-vision: 4096
   */
  maxOutputTokens = 2048;

  /**
   * Whether the response comes with stream
   */
  streaming = true;

  /**
   * Default for gemini-pro: none
   * Default for gemini-pro-vision: 32
   */
  topK: number;

  googleApiKey?: string;

  stopSequences?: string[];

  additionalKwargs?: Record<string, unknown>;

  contents: GeminiContent[];

  safetySettings?: Array<GeminiSafetySetting>;

  private _client: GoogleGenerativeAIClient;

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

  getModelContextSize(modelName: 'gemini-pro' | 'gemini-pro-vision'): number {
    switch (modelName) {
      case 'gemini-pro':
        return 30720;
      case 'gemini-pro-vision':
        return 12288;
    }
  }

  async getNumTokensInGenerations(generations: ChatGenerationChunk[]) {
    const geminiContents: Content[] = generations.map(
      (generation: ChatGenerationChunk) =>
        getContentFromMessage(generation.message)
    );

    return await this.getNumTokensInContents(geminiContents);
  }

  async getNumTokensInChat(messages: BaseMessage[]): Promise<number> {
    const geminiContents: Content[] = messages.map((message: BaseMessage) =>
      getContentFromMessage(message)
    );

    return await this.getNumTokensInContents(geminiContents);
  }

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

  private _getClient(): GoogleGenerativeAIClient {
    if (!this._client) {
      if (!this.googleApiKey) {
        throw new Error('Google API Key not found');
      }

      this._client = new GoogleGenerativeAIClient(this.googleApiKey);
    }

    return this._client;
  }

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
