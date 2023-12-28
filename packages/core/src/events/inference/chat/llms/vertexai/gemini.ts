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
  InlineDataPart,
  Part,
} from '@google/generative-ai';

import { SecretFields, SerializedFields } from '../../../../../load/keymap.js';
import { AsyncCallError } from '../../../../../utils/asyncCaller.js';
import { getEnvironmentVariables } from '../../../../../utils/environment.js';
import {
  BaseMessage,
  BotMessage,
  ChatMessage,
  ContentLike,
  HumanMessage,
} from '../../../../input/load/msgs/base.js';
import { LLMResult } from '../../../../output/provide/llmresult.js';
import { ChatGenerationChunk } from '../../../../output/provide/message.js';
import { BaseChatLM, BaseLLMParams } from '../../base.js';
import { TokenUsage } from '../../index.js';
import {
  GeminiCallOptions,
  GeminiContent,
  GeminiContentRole,
  GeminiInlineData,
  GeminiInput,
  GeminiMimeType,
  GeminiSafetySetting,
  GeminiTool,
  checkModelForGemini,
  checkModelForGeminiVision,
  wrapGoogleGenerativeAIClientError,
} from './index.js';

export interface GeminiParamsBase extends ModelParams {
  contents: Content[];
}

export interface GeminiParamsNonStreaming extends GeminiParamsBase {
  stream: false;
}

export interface GeminiParamsStreaming extends GeminiParamsBase {
  stream: true;
}

export type GeminiParams = GeminiParamsNonStreaming | GeminiParamsStreaming;

export class Gemini<CallOptions extends GeminiCallOptions = GeminiCallOptions>
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
    return 'Gemini';
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

      this.maxOutputTokens = fields?.maxOutputTokens ?? 4096;

      if (this.maxOutputTokens > 4096) {
        console.warn(
          'gemini-pro-vision does not support output token larger than 4096, now using 4096 as maxOutputTokens.'
        );
        this.maxOutputTokens = 4096;
      }
    } else {
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
      topK: 1,
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
  ): Omit<GeminiParams, 'contents'> {
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

      const completionTokens: number | undefined = (response as any)
        .usageMetadata?.candidates_token_count;
      const promptTokens: number | undefined = (response as any).usageMetadata
        ?.prompt_token_count;
      const totalTokens: number | undefined = (response as any).usageMetadata
        ?.totalTokenCount;

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

      if (!response.candidates) {
        throw new Error('No candidates from Gemini response.');
      }

      const generations = response.candidates.map(
        (candidate: GenerateContentCandidate) => ({
          output: candidate.content,
          message: getMessageFromContent(
            candidate.content ?? { role: 'assistant' }
          ),
          info: {
            finishReason: candidate.finishReason,
            completion: candidate.index ?? 0,
            finishMessage: candidate.finishMessage,
            safetyRatings: candidate.safetyRatings,
            citationMetadata: candidate.citationMetadata,
          },
        })
      );

      return { generations, llmOutput: { tokenUsage } };
    }
  }

  private async *_completionWithStream(
    params: Omit<GeminiParams, 'contents'>,
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
    request: GeminiParamsStreaming,
    options?: GeminiCallOptions
  ): Promise<AsyncIterable<GenerateContentResponse>>;

  async completionWithRetry(
    request: GeminiParamsNonStreaming,
    options?: GeminiCallOptions
  ): Promise<GenerateContentResponse>;

  async completionWithRetry(
    request: GeminiParamsNonStreaming | GeminiParamsStreaming,
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

        if (
          res &&
          'promptFeedback' in res &&
          typeof res['promptFeedback'] === 'object' &&
          res['promptFeedback'] !== null &&
          'blockReason' in res['promptFeedback']
        ) {
          this._throwErrorForBlockReason(
            res['promptFeedback']['blockReason'] as string
          );
        }

        return res.response;
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

function getMessageFromContentWithRole(
  content: Content,
  defaultRole?: GeminiContentRole
): BaseMessage {
  const role = content.role ?? defaultRole;
  const text: string = content.parts[0].text ?? '';
  const additionalKwargs: Record<string, unknown> = {};

  switch (role) {
    case 'user':
      return new HumanMessage({ content: text });
    case 'model':
      return new BotMessage({ content: text, additionalKwargs });
    default:
      return new ChatMessage({
        content: text,
        role: role ?? 'unknown',
        additionalKwargs,
      });
  }
}

function getMessageFromContent(content: Content): BaseMessage {
  const text: string = content.parts[0].text ?? '';
  const additionalKwargs: Record<string, unknown> = {};

  switch (content.role) {
    case 'user':
      return new HumanMessage({ content: text });
    case 'model':
      return new BotMessage({ content: text, additionalKwargs });
    default:
      return new ChatMessage({
        content: text,
        role: content.role ?? 'unknown',
        additionalKwargs,
      });
  }
}

function getContentFromMessage(message: BaseMessage): Content {
  return {
    role: getGeminiRoleFromMessage(message),
    parts: getPartsFromMessage(message),
  };
}

function getGeminiRoleFromMessage(message: BaseMessage): GeminiContentRole {
  switch (message._role()) {
    case 'system':
    case 'human':
      return 'user';
    case 'assistant':
      return 'model';
    default:
      throw new Error(
        `Message role ${message._role()} does not support Gemini.`
      );
  }
}

function getPartsFromMessage(message: BaseMessage): Part[] {
  const getPart = (content: ContentLike): Part => {
    if (typeof content === 'string') {
      return {
        text: content,
      };
    } else if (isTextData(content)) {
      return getTextPart(content);
    } else if (isInlineData(content)) {
      return getInlinePartFromInlineData(content);
    }

    throw new Error('Message is not valid for Gemini');
  };

  if (!Array.isArray(message.content)) {
    return [getPart(message.content)];
  }

  return message.content.map((content: ContentLike) => getPart(content));
}

function isModalityRequiredInMessage(message: BaseMessage): boolean {
  const isModalityRequired = (content: ContentLike): boolean => {
    return typeof content !== 'string' && isInlineData(content);
  };

  if (!Array.isArray(message.content)) {
    return isModalityRequired(message.content);
  }

  return message.content.some((content: ContentLike) =>
    isModalityRequired(content)
  );
}

function getTextPart(content: any): any {
  return {
    text: content.text,
  };
}

function getInlinePartFromInlineData(
  inlineData: GeminiInlineData
): InlineDataPart {
  return {
    inlineData: {
      mimeType: inlineData.mimeType,
      data: inlineData.data,
    },
  };
}

function isTextData(partLike: any): boolean {
  return (
    typeof partLike === 'object' &&
    'text' in partLike &&
    typeof partLike['text'] === 'string' &&
    partLike['text'].length > 0
  );
}

function isInlineData(partLike: any): partLike is GeminiInlineData {
  return (
    typeof partLike === 'object' &&
    'mimeType' in partLike &&
    'data' in partLike &&
    isValidMime(partLike['mimeType']) &&
    typeof partLike['data'] === 'string'
  );
}

function isValidMime(mimeLike: any): mimeLike is GeminiMimeType {
  return Object.values(GeminiMimeType).includes(mimeLike as GeminiMimeType);
}
