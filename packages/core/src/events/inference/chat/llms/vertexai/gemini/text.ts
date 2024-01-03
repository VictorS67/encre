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
import { BaseChatLM, BaseLLM, BaseLLMParams } from '../../../base.js';
import { TokenUsage } from '../../../index.js';
import {
  GeminiCallOptions,
  GeminiSafetySetting,
  VertexAIBaseInput,
  checkModelForGemini,
  checkModelForGeminiVision,
  wrapGoogleGenerativeAIClientError,
} from '../index.js';

export interface GeminiParamsBase extends ModelParams {
  prompt: string;
}

export interface GeminiParamsNonStreaming extends GeminiParamsBase {
  stream: false;
}

export interface GeminiParamsStreaming extends GeminiParamsBase {
  stream: true;
}

export type GeminiParams = GeminiParamsNonStreaming | GeminiParamsStreaming;

export type GeminiTextCandidate = Omit<GenerateContentCandidate, 'content'> & {
  text: string;
};

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
   * only support `gemini-pro` for now
   */
  modelName = 'gemini-pro';

  /**
   * Default for gemini-pro: 0.9
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

  safetySettings?: Array<GeminiSafetySetting>;

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
      completionTokens = (completionTokens ?? 0) + await this.getNumTokens(candidate.text);

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

  async getNumTokens(text: string): Promise<number> {
    const numTokensResponse: CountTokensResponse = await this._getClient()
      .getGenerativeModel({
        model: this.modelName,
      })
      .countTokens(text);

    return numTokensResponse.totalTokens;
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

  getModelContextSize(modelName: 'gemini-pro'): number {
    switch (modelName) {
      case 'gemini-pro':
        return 32768;
    }
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
