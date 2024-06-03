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

/**
 * Class providing functionality to interact with OpenAI's API, extending generic large language model functionalities.
 * It handles API communication, manages API keys, and prepares parameters for API requests.
 *
 * @template CallOptions - Customizable options for OpenAI API calls, extends {@link OpenAITextCallOptions}.
 *
 * @example
 * ```typescript
 * const openAI = new OpenAI({
 *   modelName: 'text-davinci-003',
 *   openAIApiKey: 'your-api-key',
 * });
 * const prompt = "Hello, world!";
 * const response = await openAI.invoke(prompt);
 * console.log(response);
 * ```
 */
export class OpenAI<
    CallOptions extends OpenAITextCallOptions = OpenAITextCallOptions,
  >
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
      streaming: 'stream',
    };
  }

  static _name(): string {
    return 'OpenAI';
  }

  /**
   * ID of the model to use. You can use the [List models]({@link https://platform.openai.com/docs/api-reference/models/list})
   * API to see all of your available models, or see [Model overview]({@link https://platform.openai.com/docs/models/overview})
   * for descriptions of them.
   */
  modelName = 'text-davinci-003';

  /**
   * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will
   * make the output more random, while lower values like 0.2 will make it more
   * focused and deterministic.
   *
   * We generally recommend altering this or `topP` but not both.
   */
  temperature = 1;

  /**
   * The maximum number of [tokens]({@link https://platform.openai.com/tokenizer})
   * to generate in the completion.
   *
   * The token count of your prompt plus `maxTokens` cannot exceed the model's
   * context length.
   *
   * [Example Python code]({@link https://cookbook.openai.com/examples/how_to_count_tokens_with_tiktoken}) f
   * or counting tokens.
   */
  maxTokens = 2048;

  /**
   * An alternative to sampling with temperature, called nucleus sampling, where the
   * model considers the results of the tokens with temperature probability mass. So 0.1
   * means only the tokens comprising the top 10% probability mass are considered.
   *
   * We generally recommend altering this or `temperature` but not both.
   */
  topP = 1;

  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on their
   * existing frequency in the text so far, decreasing the model's likelihood to
   * repeat the same line verbatim.
   *
   * [See more information about frequency and presence panalties]({@link https://platform.openai.com/docs/guides/text-generation/parameter-details})
   */
  frequencyPenalty = 0;

  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on
   * whether they appear in the text so far, increasing the model's likelihood to
   * talk about new topics.
   *
   * [See more information about frequency and presence penalties]({@link https://platform.openai.com/docs/guides/text-generation/parameter-details})
   */
  presencePenalty = 0;

  /**
   * How many completions to generate for each prompt.
   *
   * **Note:** Because this parameter generates many completions, it can quickly
   * consume your token quota. Use carefully and ensure that you have reasonable
   * settings for `maxTokens` and `stopWords`.
   */
  n = 1;

  /**
   * Whether to stream back partial progress. If set, tokens will be sent as
   * data-only [server-sent events]({@link https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format})
   * as they become available, with the stream terminated by a `data: [DONE]`
   * message.
   *
   * [Example Python code]({@link https://cookbook.openai.com/examples/how_to_stream_completions})
   */
  streaming = false;

  /**
   * Generates `bestOf` completions server-side and returns the "best" (the one with
   * the highest log probability per token). Results cannot be streamed.
   *
   * When used with `n`, `bestOf` controls the number of candidate completions and
   * `n` specifies how many to return – `bestOf` must be greater than `n`.
   *
   * **Note:** Because this parameter generates many completions, it can quickly
   * consume your token quota. Use carefully and ensure that you have reasonable
   * settings for `maxToken` and `stopWords`.
   */
  bestOf?: number | undefined;

  /**
   * Echo back the prompt in addition to the completion
   */
  echo?: boolean;

  /**
   * Holds any additional parameters that are valid to pass to
   * [OpenAI API Reference]({@link https://platform.openai.com/docs/api-reference/introduction})
   * that are not explicitly specified on this class.
   */
  additionalKwargs?: OpenAIInput['additionalKwargs'];

  /**
   * Modify the likelihood of specified tokens appearing in the completion.
   *
   * Accepts a json object that maps tokens (specified by their token ID in the GPT
   * tokenizer) to an associated bias value from -100 to 100. You can use this
   * [tokenizer tool]({@link https://platform.openai.com/tokenizer?view=bpe})
   * (which works for both GPT-2 and GPT-3) to convert text to token IDs. Mathematically,
   * the bias is added to the logits generated by the model prior to sampling.
   * The exact effect will vary per model, but values between -1 and 1 should
   * decrease or increase likelihood of selection; values like -100 or 100 should
   * result in a ban or exclusive selection of the relevant token.
   *
   * As an example, you can pass `{"50256": -100}` to prevent the end-of-text token
   * from being generated.
   */
  logitBias?: Record<string, number>;

  /**
   * Include the log probabilities on the `logprobs` most likely tokens, as well the
   * chosen tokens. For example, if `logprobs` is 5, the API will return a list of
   * the 5 most likely tokens. The API will always return the `logprob` of the
   * sampled token, so there may be up to `logprobs+1` elements in the response.
   *
   * The maximum value for `logprobs` is 5.
   */
  logprobs?: number;

  /**
   * This feature is in Beta. If specified, our system will make a best effort to
   * sample deterministically, such that repeated requests with the same `seed` and
   * parameters should return the same result. Determinism is not guaranteed, and you
   * should refer to the `system_fingerprint` response parameter to monitor changes
   * in the backend.
   */
  seed?: number;

  /**
   * A unique identifier representing your end-user, which can help OpenAI to monitor
   * and detect abuse.
   *
   * [Learn more]({@link https://platform.openai.com/docs/guides/safety-best-practices})
   */
  user?: string | undefined;

  /**
   * Up to 4 sequences where the API will stop generating further tokens. The
   * returned text will not contain the stop sequence.
   */
  stopWords?: string[];

  /**
   * Timeout to use when making requests to OpenAI.
   */
  timeout?: number;

  /**
   * API key to use when making requests to OpenAI. Defaults to the value of
   * `OPENAI_API_KEY` environment variable.
   */
  openAIApiKey?: string;

  /**
   * Identifier for organization sometimes used in API requests。
   */
  organization?: string;

  /**
   * OpenAI API Client.
   * @internal
   */
  private _client: OpenAIClient;

  /**
   * OpenAI API request options.
   * @internal
   */
  private _clientOptions: OpenAIClientOptions;

  _llmType(): string {
    return 'openai';
  }

  /**
   * Constructs an instance of the OpenAI class.
   * @param fields Initialization options that include model configurations and API client options.
   */
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

  /**
   * Provides the main functionality to communicate with OpenAI's API to retrieve completions.
   * Handles both streaming and non-streaming responses based on configuration.
   * @param prompt The input string for which to generate completions.
   * @param options Configuration options for the API call.
   * @returns A promise resolving to the language model result.
   * @internal
   * @example
   * ```typescript
   * const openAI = new OpenAI({
   *   modelName: 'text-davinci-003',
   *   openAIApiKey: 'your-api-key',
   * });
   * const prompt = "Hello, world!";
   * const response = await openAI._provide(prompt, { streaming: false });
   * console.log(response);
   * ```
   */
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
   * Handles retry logic for API calls, adapting for either streaming or regular completion requests.
   * @param request API request parameters.
   * @param options Optional additional request configurations.
   * @returns Either a stream of completion responses or a single completion response.
   * @example
   * ```typescript
   * const openAI = new OpenAI({
   *   modelName: 'text-davinci-003',
   *   openAIApiKey: 'your-api-key',
   * });
   * try {
   *   const response = await openAI.completionWithRetry({ model: 'text-davinci-003', prompt: "Hello, world!", stream: false });
   *   console.log(response);
   * } catch (error) {
   *   console.error("Failed to fetch response:", error);
   * }
   * ```
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

  /**
   * Generates and handles streaming responses for OpenAI completions.
   * @param params API call parameters excluding the prompt.
   * @param prompt The input prompt for completion.
   * @param options Call options potentially modifying the request.
   * @returns A promise resolving to a structured completion response.
   * @internal
   */
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

  /**
   * Builds request options for the API call, merging default client options with
   * method-specific options.
   * @param options Optional additional request configurations.
   * @returns The combined request options.
   * @internal
   */
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
