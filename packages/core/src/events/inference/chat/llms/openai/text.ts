import { TiktokenModel } from 'js-tiktoken';
import {
  OpenAI as OpenAIClient,
  ClientOptions as OpenAIClientOptions,
} from 'openai';
import type { RequestOptions as OpenAIClientRequestOptions } from 'openai/core';
import {
  Completion,
  CompletionChoice,
  CompletionCreateParamsNonStreaming,
  CompletionCreateParamsStreaming,
  Completions,
} from 'openai/resources';

import { SecretFields, SerializedFields } from '../../../../../load/keymap.js';
import { getEnvironmentVariables } from '../../../../../utils/environment.js';
import { Generation } from '../../../../output/provide/generation.js';
import { LLMResult } from '../../../../output/provide/llmresult.js';
import { BaseLLM, BaseLLMParams, calculateMaxToken } from '../../base.js';
import { TokenUsage } from '../../index.js';
import {
  OpenAIInput,
  OpenAITextCallOptions,
  wrapOpenAIClientError,
} from './index.js';

export class OpenAI<CallOptions extends OpenAITextCallOptions = OpenAITextCallOptions>
  extends BaseLLM<CallOptions>
  implements OpenAIInput
{
  _isSerializable = true;

  get _secrets(): SecretFields | undefined {
    return {
      openAIApiKey: 'OPENAI_API_KEY',
      organization: 'OPENAI_ORGANIZATION',
    };
  }

  get _aliases(): SerializedFields | undefined {
    return {
      modelName: 'model',
      openAIApiKey: 'openai_api_key',
      streaming: 'stream'
    };
  }

  static _name(): string {
    return 'OpenAI';
  }

  modelName = 'text-davinci-003';

  temperature = 1;

  maxTokens = 2048;

  topP = 1;

  frequencyPenalty = 0;

  presencePenalty = 0;

  n = 1;

  streaming = false;

  bestOf?: number | undefined;

  echo?: boolean;

  additionalKwargs?: OpenAIInput['additionalKwargs'];

  logitBias?: Record<string, number>;

  logprobs?: number;

  seed?: number;

  user?: string | undefined;

  stopWords?: string[];

  timeout?: number;

  openAIApiKey?: string;

  organization?: string;

  private _client: OpenAIClient;

  private _clientOptions: OpenAIClientOptions;

  _llmType(): string {
    return 'openai';
  }

  constructor(
    fields?: Partial<OpenAIInput> &
      BaseLLMParams & {
        configuration?: OpenAIClientOptions;
      }
  ) {
    fields = {
      modelName: fields?.modelName ?? 'text-davinci-003',
      temperature: fields?.temperature ?? 1,
      maxTokens: fields?.maxTokens ?? 2048,
      topP: fields?.topP ?? 1,
      frequencyPenalty: fields?.frequencyPenalty ?? 0,
      presencePenalty: fields?.presencePenalty ?? 0,
      streaming: fields?.streaming ?? false,
      bestOf: fields?.bestOf,
      logitBias: fields?.logitBias,
      logprobs: fields?.logprobs,
      echo: fields?.echo,
      seed: fields?.seed,
      user: fields?.user,
      stopWords: fields?.stopWords,
      timeout: fields?.timeout,
      additionalKwargs: fields?.additionalKwargs,
      ...fields,
    };

    super(fields ?? {});

    this.openAIApiKey =
      fields?.openAIApiKey ?? getEnvironmentVariables('OPENAI_API_KEY');

    if (!this.openAIApiKey) {
      throw new Error('OpenAI API Key not found');
    }

    this.modelName = fields?.modelName ?? this.modelName;

    this.temperature = fields?.temperature ?? this.temperature;
    this.maxTokens = fields?.maxTokens ?? this.maxTokens;
    this.topP = fields?.topP ?? this.topP;
    this.frequencyPenalty = fields?.frequencyPenalty ?? this.frequencyPenalty;
    this.presencePenalty = fields?.presencePenalty ?? this.presencePenalty;
    this.n = fields?.n ?? this.n;
    this.bestOf = fields?.bestOf ?? this.bestOf;
    this.logitBias = fields?.logitBias;
    this.logprobs = fields?.logprobs;
    this.echo = fields?.echo;
    this.seed = fields?.seed;
    this.additionalKwargs = fields?.additionalKwargs ?? {};

    this.user = fields?.user;
    this.stopWords = fields?.stopWords;
    this.timeout = fields?.timeout;
    this.streaming = fields?.streaming ?? this.streaming;

    this.organization =
      fields?.configuration?.organization ??
      getEnvironmentVariables('OPENAI_ORGANIZATION');

    if (this.streaming && this.bestOf && this.bestOf > 1) {
      throw new Error('Cannot stream results with bestOf > 1');
    }

    this._clientOptions = {
      apiKey: this.openAIApiKey,
      organization: this.organization,
      baseURL: fields?.configuration?.baseURL,
      dangerouslyAllowBrowser: true,
      defaultHeaders: fields?.configuration?.defaultHeaders,
      defaultQuery: fields?.configuration?.defaultQuery,
      ...fields?.configuration,
    };
  }

  protected _failedAttemptHandler(e: Error): void {
    const error: Error = wrapOpenAIClientError(e as Error);
    super._failedAttemptHandler(error);
  }

  /**
   * Get the current set of parameters for the OpenAIClient's completion API call,
   * excluding the 'prompt' parameter.
   * @param options An optional configuration object that can override certain default
   *                parameters, particularly `stopWords`.
   * @returns An object containing parameters for the OpenAIClient's completion API
   *          call without the 'prompt'.
   */
  getParams(
    options?: this['SerializedCallOptions']
  ): Omit<OpenAIClient.CompletionCreateParams, 'prompt'> {
    return {
      model: this.modelName,
      temperature: this.temperature,
      max_tokens: this.maxTokens === -1 ? undefined : this.maxTokens,
      top_p: this.topP,
      frequency_penalty: this.frequencyPenalty,
      presence_penalty: this.presencePenalty,
      n: this.n,
      best_of: this.bestOf,
      logit_bias: this.logitBias,
      logprobs: this.logprobs,
      stop: options?.stopWords ?? this.stopWords,
      suffix: options?.suffix,
      echo: this.echo,
      seed: this.seed,
      user: this.user,
      stream: this.streaming,
      ...this.additionalKwargs,
    };
  }

  _identifyParams(): Omit<OpenAIClient.CompletionCreateParams, 'prompt'> & {
    model_name: string;
  } & OpenAIClientOptions {
    return {
      model_name: this.modelName,
      ...this.getParams(),
      ...this._clientOptions,
    };
  }

  async _provide(
    prompt: string,
    options: this['SerializedCallOptions']
  ): Promise<LLMResult> {
    const choices: CompletionChoice[] = [];
    const tokenUsage: TokenUsage = {};

    const params = this.getParams(options);
    if (params.max_tokens === -1) {
      params.max_tokens = await calculateMaxToken(
        prompt,
        this.modelName as TiktokenModel
      );
    }

    const response = params.stream
      ? await this._completionWithStream(params, prompt, options)
      : await this.completionWithRetry(
          {
            ...params,
            stream: false,
            prompt: prompt,
          },
          {
            signal: options?.signal,
            ...options?.options,
          }
        );

    choices.push(...response.choices);

    const completionTokens: number | undefined =
      response.usage?.completion_tokens;
    const promptTokens: number | undefined = response.usage?.prompt_tokens;
    const totalTokens: number | undefined = response.usage?.total_tokens;

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

    const generations: Generation[] = choices.map(
      (choice: CompletionChoice) => ({
        output: choice.text ?? ('' as string),
        info: {
          finishReason: choice.finish_reason,
          logprobs: choice.logprobs,
        },
      })
    );

    return { generations, llmOutput: { tokenUsage } };
  }

  /**
   * Attempts to get a completion from the OpenAIClient and retries if an error occurs.
   *
   * @param {CompletionCreateParamsStreaming | CompletionCreateParamsNonStreaming} request
   *        The request parameters which can be either for streaming or non-streaming completions.
   * @param {OpenAIClientRequestOptions} [options] Optional client request configurations.
   */
  async completionWithRetry(
    request: CompletionCreateParamsStreaming,
    options?: OpenAIClientRequestOptions
  ): Promise<AsyncIterable<Completion>>;

  async completionWithRetry(
    request: CompletionCreateParamsNonStreaming,
    options?: OpenAIClientRequestOptions
  ): Promise<Completions.Completion>;

  async completionWithRetry(
    request:
      | CompletionCreateParamsStreaming
      | CompletionCreateParamsNonStreaming,
    options?: OpenAIClientRequestOptions
  ): Promise<Completions.Completion | AsyncIterable<Completion>> {
    const requestOptions: OpenAIClientRequestOptions =
      this._getRequestOptions(options);
    return this.caller.call(async () => {
      const res = await this._client.completions.create(
        request,
        requestOptions
      );
      return res;
    });
  }

  private async _completionWithStream(
    params: Omit<OpenAIClient.CompletionCreateParams, 'prompt'>,
    prompt: string,
    options: this['SerializedCallOptions']
  ) {
    const choices: CompletionChoice[] = [];
    let res: Omit<Completion, 'choices'> | undefined;

    const stream: AsyncIterable<Completions.Completion> =
      await this.completionWithRetry(
        {
          ...params,
          stream: true,
          prompt: prompt,
        },
        options
      );

    for await (const message of stream) {
      if (!res) {
        res = {
          id: message.id,
          object: message.object,
          created: message.created,
          model: message.model,
        };
      }

      for (const part of message.choices) {
        if (!choices[part.index]) {
          choices[part.index] = part;
        } else {
          const choice: Completions.CompletionChoice = choices[part.index];
          choice.text += part.text;
          choice.finish_reason = part.finish_reason;
          choice.logprobs = part.logprobs;
        }
      }
    }

    if (options.signal?.aborted) {
      throw new Error('AbortError');
    }

    return { ...res, choices };
  }

  private _getRequestOptions(
    options?: OpenAIClientRequestOptions
  ): OpenAIClientRequestOptions {
    if (!this._client) {
      const params = {
        ...this._clientOptions,
        timeout: this.timeout,
        maxRetries: 0,
      };

      if (!params.baseURL) {
        delete params.baseURL;
      }

      this._client = new OpenAIClient(params);
    }

    const requestOptions: OpenAIClientRequestOptions = {
      ...this._clientOptions,
      ...options,
    };

    return requestOptions;
  }
}
