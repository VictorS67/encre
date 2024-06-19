import axios from 'axios';
import {
  OpenAI as OpenAIClient,
  ClientOptions as OpenAIClientOptions,
} from 'openai';
import type { RequestOptions as OpenAIClientRequestOptions } from 'openai/core';
import sharp from 'sharp';

import {
  type SecretFields,
  type SerializedFields,
} from '../../../../../load/keymap.js';
import { getEnvironmentVariables } from '../../../../../utils/environment.js';
import {
  type FunctionDef,
  formatFunctionDefs,
} from '../../../../../utils/openaiFunctionFormat.js';
import { getNumTokens } from '../../../../../utils/tokenizer.js';
import {
  type BaseMessage,
  BotMessage,
  ChatMessage,
  FunctionMessage,
  HumanMessage,
  SystemMessage,
} from '../../../../input/load/msgs/index.js';
import {
  type LLMResult,
  ChatGenerationChunk,
} from '../../../../output/provide/index.js';
import { BaseChatLM, type BaseLLMParams } from '../../base.js';
import { type TokenUsage } from '../../index.js';
import {
  formatJSONInContent,
  formatJSONStringInContent,
  getContentFromMessage,
  isJSONInContent,
} from './utils.js';
import {
  checkModelForOpenAIChat,
  checkModelForOpenAIVision,
  type OpenAIChatCallOptions,
  type OpenAIChatInput,
  wrapOpenAIClientError,
} from './index.js';

/**
 * Represents the role of a message within the chat, distinguishing between system-generated
 * and user-generated content, among other types.
 */
export type OpenAIMessageRole = 'system' | 'user' | 'assistant' | 'tool';

/**
 * Class for handling interactions with the OpenAI API, specifically designed to manage chat
 * functionalities.
 *
 * @template CallOptions - Extends OpenAIChatCallOptions for detailed API call configurations.
 *
 * @example
 * ```typescript
 * const openAI = new OpenAIChat({
 *   modelName: 'gpt-3.5-turbo',
 *   openAIApiKey: 'your-api-key',
 * });
 * const message = new HumanMessage("Hello, world!");
 * const response = await openAI.invoke([message]);
 * console.log(response);
 * ```
 */
export class OpenAIChat<
    CallOptions extends OpenAIChatCallOptions = OpenAIChatCallOptions,
  >
  extends BaseChatLM<CallOptions>
  implements OpenAIChatInput
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
    return 'OpenAIChat';
  }

  /**
   * ID of the model to use. You can use the [List models]({@link https://platform.openai.com/docs/api-reference/models/list})
   * API to see all of your available models, or see [Model overview]({@link https://platform.openai.com/docs/models/overview})
   * for descriptions of them.
   */
  modelName = 'gpt-3.5-turbo';

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
   * Whether to stream back partial progress. If set, tokens will be sent as
   * data-only [server-sent events]({@link https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format})
   * as they become available, with the stream terminated by a `data: [DONE]`
   * message.
   *
   * [Example Python code]({@link https://cookbook.openai.com/examples/how_to_stream_completions})
   */
  streaming = false;

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
   * How many completions to generate for each prompt.
   *
   * **Note:** Because this parameter generates many completions, it can quickly
   * consume your token quota. Use carefully and ensure that you have reasonable
   * settings for `maxTokens` and `stopWords`.
   */
  n = 1;

  /**
   * An object specifying the format that the model must output. Compatible with
   * [GPT-4 Turbo](https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo) and
   * all GPT-3.5 Turbo models newer than `gpt-3.5-turbo-1106`.
   *
   * Setting to `"json"` enables JSON mode, which guarantees the message the model
   * generates is valid JSON.
   *
   * **Important:** when using JSON mode, you **must** also instruct the model to
   * produce JSON yourself via a system or user message. Without this, the model may
   * generate an unending stream of whitespace until the generation reaches the token
   * limit, resulting in a long-running and seemingly "stuck" request. Also note that
   * the message content may be partially cut off if `finish_reason="length"`, which
   * indicates the generation exceeded `maxTokens` or the conversation exceeded the
   * max context length.
   */
  responseFormatType?: 'json' | 'text';

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
   * This feature is in Beta. If specified, our system will make a best effort to
   * sample deterministically, such that repeated requests with the same `seed` and
   * parameters should return the same result. Determinism is not guaranteed, and you
   * should refer to the `system_fingerprint` response parameter to monitor changes
   * in the backend.
   */
  seed?: number;

  /**
   * Up to 4 sequences where the API will stop generating further tokens. The
   * returned text will not contain the stop sequence.
   */
  stopWords?: string[];

  /**
   * A unique identifier representing your end-user, which can help OpenAI to monitor
   * and detect abuse.
   *
   * [Learn more]({@link https://platform.openai.com/docs/guides/safety-best-practices})
   */
  user?: string;

  /**
   * Holds any additional parameters that are valid to pass to
   * [OpenAI API Reference]({@link https://platform.openai.com/docs/api-reference/introduction})
   * that are not explicitly specified on this class.
   */
  additionalKwargs?: Record<string, unknown>;

  /**
   * Timeout to use when making requests to OpenAI.
   */
  timeout?: number;

  /**
   * API key to use when making requests to OpenAI. Defaults to the value of
   * `OPENAI_API_KEY` environment variable.
   */
  openAIApiKey?: string;

  /** ChatGPT messages to pass as a prefix to the prompt */
  chatMessages?: OpenAIClient.Chat.ChatCompletionMessageParam[];

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

  /**
   * Whether the model supports vision (i.e. multimodal)
   * @internal
   */
  private _isMultimodal = false;

  /**
   * Constructs an instance of the OpenAIChat class with options to configure the OpenAI
   * client.
   *
   * @param fields Configuration options for the OpenAI client and chat behavior.
   */
  constructor(
    fields?: Partial<OpenAIChatInput> &
      BaseLLMParams & {
        configuration?: OpenAIClientOptions;
      }
  ) {
    fields = {
      modelName: fields?.modelName ?? 'gpt-3.5-turbo',
      frequencyPenalty: fields?.frequencyPenalty ?? 0,
      presencePenalty: fields?.presencePenalty ?? 0,
      streaming: fields?.streaming ?? false,
      temperature: fields?.temperature ?? 1,
      maxTokens: fields?.maxTokens ?? 2048,
      topP: fields?.topP ?? 1,
      responseFormatType: fields?.responseFormatType,
      logitBias: fields?.logitBias,
      seed: fields?.seed,
      stopWords: fields?.stopWords,
      user: fields?.user,
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

    if (!fields.configuration && !checkModelForOpenAIChat(this.modelName)) {
      throw new Error(
        'model is not valid for OpenAIChat, please check openai model lists for chat completions'
      );
    }

    this.temperature = fields?.temperature ?? this.temperature;
    this.maxTokens = fields?.maxTokens ?? this.maxTokens;
    this.topP = fields?.topP ?? this.topP;
    this.frequencyPenalty = fields?.frequencyPenalty ?? this.frequencyPenalty;
    this.presencePenalty = fields?.presencePenalty ?? this.presencePenalty;
    this.n = fields?.n ?? this.n;
    this.logitBias = fields?.logitBias;
    this.responseFormatType =
      fields?.responseFormatType ?? this.responseFormatType;
    this.seed = fields?.seed;
    this.additionalKwargs = fields?.additionalKwargs ?? {};

    this.user = fields?.user;
    this.stopWords = fields?.stopWords;
    this.timeout = fields?.timeout;
    this.streaming = fields?.streaming ?? this.streaming;
    this.chatMessages = fields?.chatMessages;

    this.organization =
      fields?.configuration?.organization ??
      getEnvironmentVariables('OPENAI_ORGANIZATION');

    this._clientOptions = {
      apiKey: this.openAIApiKey,
      organization: this.organization,
      baseURL: fields?.configuration?.baseURL,
      dangerouslyAllowBrowser: true,
      defaultHeaders: fields?.configuration?.defaultHeaders,
      defaultQuery: fields?.configuration?.defaultQuery,
      ...fields?.configuration,
    };

    if (checkModelForOpenAIVision(this.modelName)) {
      this._isMultimodal = true;
    }
  }

  _llmType(): string {
    return 'openai';
  }

  protected _failedAttemptHandler(e: Error): void {
    const error: Error = wrapOpenAIClientError(e as Error);
    super._failedAttemptHandler(error);
  }

  /**
   * Get the current set of parameters for the OpenAIClient's chat completion API call,
   * excluding the 'messages' parameter.
   * @param options An optional configuration object that can override certain default
   *                parameters, particularly `stopWords`, `functions`, and
   *                `functionCallOption`.
   * @returns An object containing parameters for the OpenAIClient's chat completion
   *          API call without the 'messages'.
   */
  getParams(
    options?: this['SerializedCallOptions']
  ): Omit<OpenAIClient.Chat.ChatCompletionCreateParams, 'messages'> {
    return {
      model: this.modelName,
      frequency_penalty: this.frequencyPenalty,
      logit_bias: this.logitBias,
      logprobs: options?.logprobs,
      max_tokens: this.maxTokens === -1 ? undefined : this.maxTokens,
      n: this.n,
      presence_penalty: this.presencePenalty,
      response_format: this.responseFormatType
        ? {
            type: this.responseFormatType === 'json' ? 'json_object' : 'text',
          }
        : undefined,
      seed: this.seed,
      stop: options?.stopWords ?? this.stopWords,
      stream: this.streaming,
      temperature: this.temperature,
      tool_choice: options?.toolChoice,
      tools: options?.tools,
      top_logprobs: options?.topLogprobs,
      top_p: this.topP,
      user: this.user,
      ...this.additionalKwargs,
    };
  }

  /**
   * Provides the implementation for fetching chat completions from OpenAI based on the
   * provided messages and options.
   * This method can handle both multimodal responses and standard text, adjusting parameters
   * based on model capabilities.
   *
   * @param messages Array of messages to be processed in the chat.
   * @param options Configuration options for the chat completion.
   * @returns A promise resolving to the language model result with chat completions.
   * @example
   * ```typescript
   * const openaiChat = new OpenAIChat({
   *   modelName: 'gpt-3.5-turbo',
   *   openAIApiKey: 'your-api-key',
   * });
   * const messages = [new HumanMessage({ content: "Hello, world!" })];
   * const result = await openaiChat._provide(messages);
   * console.log(result);
   * ```
   */
  async _provide(
    messages: BaseMessage[],
    options: this['SerializedCallOptions']
  ): Promise<LLMResult> {
    if (this._isMultimodal) {
      if (this.responseFormatType !== undefined) {
        console.warn(
          'Currently, GPT-4 Turbo with vision does not support `responseFormatType`. Now skipping this parameter'
        );

        this.responseFormatType = undefined;
      }

      if (messages.some((m) => m.name !== undefined)) {
        console.warn(
          'Currently, GPT-4 Turbo with vision does not support the `message.name` parameter. Now skipping this parameter'
        );

        messages = messages.map((m) => {
          m.name = undefined;
          return m;
        });
      }

      if (
        options.tools !== undefined ||
        options.toolChoice !== undefined ||
        messages.some(
          (m) =>
            m._role() === 'function' ||
            (m._role() === 'general' && (m as ChatMessage).role === 'function')
        )
      ) {
        console.warn(
          'Currently, GPT-4 Turbo with vision does not support any functions/tools. Now skipping this parameter'
        );

        options.tools = undefined;
        options.toolChoice = undefined;
        messages = messages.filter(
          (m) =>
            m._role() !== 'function' &&
            !(m._role() === 'general' && (m as ChatMessage).role === 'function')
        );
      }

      if (options.logprobs !== undefined || options.topLogprobs !== undefined) {
        console.warn(
          'Currently, GPT-4 Turbo with vision does not support `logprobs` parameter. Now skipping this parameter'
        );

        options.logprobs = undefined;
        options.topLogprobs = undefined;
      }
    }

    const tokenUsage: TokenUsage = {};

    const params = this.getParams(options);
    const convertedMessages: OpenAIClient.Chat.ChatCompletionMessageParam[] =
      messages.map((message: BaseMessage) => getContentFromMessage(message));

    if (params.stream) {
      const stream = this._completionWithStream(
        params,
        convertedMessages,
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

      const { tools, tool_choice } = this.getParams(options);

      const messageTokenUsage = await OpenAIChat.getNumTokensInChat(
        this.modelName,
        messages,
        tools,
        tool_choice
      );

      const generationsTokenUsage = await OpenAIChat.getNumTokensInGenerations(
        this.modelName,
        generations
      );

      tokenUsage.promptTokens = messageTokenUsage;
      tokenUsage.completionTokens = generationsTokenUsage;
      tokenUsage.totalTokens = messageTokenUsage + generationsTokenUsage;

      return { generations, llmOutput: { tokenUsage } };
    } else {
      const response: OpenAIClient.Chat.Completions.ChatCompletion =
        await this.completionWithRetry(
          {
            ...params,
            stream: false,
            messages: convertedMessages,
          },
          {
            signal: options?.signal,
            ...options?.options,
          }
        );

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

      const generations = response.choices.map(
        (choice: OpenAIClient.Chat.Completions.ChatCompletion.Choice) => ({
          output: choice.message?.content ?? '',
          message: getMessageFromOpenAICompletionMessage(
            choice.message ?? { role: 'assistant' }
          ),
          info: {
            finishReason: choice.finish_reason,
          },
        })
      );

      return { generations, llmOutput: { tokenUsage } };
    }
  }

  /**
   * Handles streaming completions from OpenAI's Chat API. This method initiates a streaming
   * API call and processes the incoming data chunks to form a complete chat response.
   *
   * @param params - Parameters for the streaming completion, excluding the 'messages' parameter.
   * @param messages - The chat messages formatted for the OpenAI API.
   * @param options - Additional call options that may include signal handling for abort operations.
   * @returns An async generator that yields chat generation chunks as they arrive from the API.
   * @internal
   */
  private async *_completionWithStream(
    params: Omit<OpenAIClient.Chat.ChatCompletionCreateParams, 'messages'>,
    messages: OpenAIClient.Chat.ChatCompletionMessageParam[],
    options: this['SerializedCallOptions']
  ): AsyncGenerator<ChatGenerationChunk> {
    const stream: AsyncIterable<OpenAIClient.Chat.Completions.ChatCompletionChunk> =
      await this.completionWithRetry(
        {
          ...params,
          stream: true,
          messages: messages,
        },
        options
      );

    let defaultRole: OpenAIMessageRole | undefined = 'assistant';
    for await (const message of stream) {
      const choice:
        | OpenAIClient.Chat.Completions.ChatCompletionChunk.Choice
        | undefined = message?.choices[0];

      if (!choice) {
        continue;
      }

      const newMessage: BaseMessage = getMessageFromChatCompletionDelta(
        choice.delta,
        defaultRole
      );

      defaultRole = choice.delta.role ?? defaultRole;

      const generationChunk = new ChatGenerationChunk({
        output:
          typeof newMessage.content === 'string' ? newMessage.content : '',
        message: newMessage,
        info: {
          finishReason: choice.finish_reason,
          completion: choice.index ?? 0,
        },
      });

      yield generationChunk;
    }

    if (options.signal?.aborted) {
      throw new Error('AbortError');
    }
  }

  /**
   * Attempts to get a chat completion from the OpenAIClient and retries if an error occurs.
   * This method supports both streaming and non-streaming requests.
   *
   * @param request - The request parameters, which can be for streaming or non-streaming chat completions.
   * @param options - Optional client request configurations.
   * @returns Depending on the request type, either a stream of chat completion chunks or a single chat completion.
   * @example
   * ```typescript
   * const openAIChat = new OpenAIChat({
   *   modelName: 'gpt-3.5-turbo',
   *   openAIApiKey: 'your-api-key',
   * });
   *
   * const message = {
   *   role: 'user',
   *   content: [
   *     { text: "Hello, world!" }
   *   ]
   * };
   *
   * try {
   *   const response = await openAIChat.completionWithRetry(
   *     { messages: [message], stream: false }
   *   );
   *   console.log(response);
   * } catch (error) {
   *   console.error("Completion failed:", error);
   * }
   * ```
   */
  async completionWithRetry(
    request: OpenAIClient.Chat.ChatCompletionCreateParamsStreaming,
    options?: OpenAIClientRequestOptions
  ): Promise<AsyncIterable<OpenAIClient.Chat.Completions.ChatCompletionChunk>>;

  async completionWithRetry(
    request: OpenAIClient.Chat.ChatCompletionCreateParamsNonStreaming,
    options?: OpenAIClientRequestOptions
  ): Promise<OpenAIClient.Chat.Completions.ChatCompletion>;

  async completionWithRetry(
    request:
      | OpenAIClient.Chat.ChatCompletionCreateParamsStreaming
      | OpenAIClient.Chat.ChatCompletionCreateParamsNonStreaming,
    options?: OpenAIClientRequestOptions
  ): Promise<
    | OpenAIClient.Chat.Completions.ChatCompletion
    | AsyncIterable<OpenAIClient.Chat.Completions.ChatCompletionChunk>
  > {
    const requestOptions: OpenAIClientRequestOptions =
      this._getRequestOptions(options);
    return this.caller.call(async () => {
      const res = await this._client.chat.completions.create(
        request,
        requestOptions
      );
      return res;
    });
  }

  /**
   * Estimates the total number of tokens used in a chat session. This includes messages
   * and any defined tools or function calls.
   *
   * Reference:
   * @see https://github.com/hmarr/openai-chat-tokens/blob/main/src/index.ts
   * @see https://github.com/forestwanglin/openai-java/blob/main/jtokkit/src/main/java/xyz/felh/openai/jtokkit/utils/TikTokenUtils.java
   *
   * @param modelName - The model name used for token calculations.
   * @param messages - The array of base messages from the chat.
   * @param tools - Optional array of tools that may influence token usage.
   * @param toolChoiceOption - Optional tool choice configuration.
   * @returns The total number of tokens estimated to be used in the chat.
   * @example
   * ```typescript
   * const tokenCount = await OpenAIChat.getNumTokensInChat(
   *   'gpt-3.5-turbo',
   *   [new HumanMessage('Hello!')]
   * );
   * console.log(tokenCount);
   * ```
   */
  static async getNumTokensInChat(
    modelName: string,
    messages: BaseMessage[],
    tools?: OpenAIClient.Chat.Completions.ChatCompletionTool[],
    toolChoiceOption?: OpenAIClient.Chat.ChatCompletionToolChoiceOption
  ): Promise<number> {
    // It appears that if functions are present, the first system message is padded with
    // a trailing newline. This was inferred by trying lots of combinations of messages
    // and functions and seeing what the token counts were.
    const openAIMessages: OpenAIClient.Chat.Completions.ChatCompletionMessageParam[] =
      messages.map((message: BaseMessage) => getContentFromMessage(message));

    let count = 0;
    count += await OpenAIChat.getNumTokensInMessages(
      modelName,
      openAIMessages,
      tools
    );

    // If there are functions, add the function definitions as they count towards token usage
    if (tools && tools.length > 0) {
      count += await OpenAIChat.getNumTokensInTools(modelName, tools);
    }

    // If there's a system message _and_ functions are present, subtract four tokens.
    // I assume this is because functions typically add a system message, but reuse
    // the first one if it's already there. This offsets the extra 9 tokens added by
    // the function definitions.
    if (tools && openAIMessages.find((m) => m.role === 'system')) {
      count -= 4;
    }

    // If functionCallOption is 'none', add one token.
    // If it's a FunctionCall object, add 4 + the number of tokens in the function name.
    // If it's undefined or 'auto', don't add anything.
    if (toolChoiceOption && toolChoiceOption !== 'auto') {
      if (toolChoiceOption === 'none') {
        count += 1;
      } else {
        if (toolChoiceOption.function.name) {
          count +=
            (await getNumTokens(toolChoiceOption.function.name, modelName)) + 4;
        }
      }
    }

    return count;
  }

  /**
   * Estimates the number of tokens for an array of messages formatted for the OpenAI Chat API.
   *
   * Reference:
   * @see https://github.com/forestwanglin/openai-java/blob/main/jtokkit/src/main/java/xyz/felh/openai/jtokkit/utils/TikTokenUtils.java
   *
   * @param modelName - The model used for token calculations.
   * @param messages - Chat messages formatted for the API.
   * @param tools - Tools that may be present in the chat influencing token usage.
   * @returns The total number of tokens estimated for the provided messages.
   * @example
   * ```typescript
   * const tokenCount = await OpenAIChat.getNumTokensInMessages(
   *   'gpt-3.5-turbo',
   *   [{ role: 'user', content: 'Hello!' }]
   * );
   * console.log(tokenCount);
   * ```
   */
  static async getNumTokensInMessages(
    modelName: string,
    messages: OpenAIClient.Chat.Completions.ChatCompletionMessageParam[],
    tools?: OpenAIClient.Chat.Completions.ChatCompletionTool[]
  ): Promise<number> {
    let count = 0;
    const toolMessageSize: number = messages.filter(
      (m) => m.role === 'tool'
    ).length;

    if (toolMessageSize > 1) {
      count += toolMessageSize * 2 + 1;

      const jsonContentToolSize: number = messages.filter(
        (m) => m.role === 'tool' && isJSONInContent(m.content)
      ).length;

      if (jsonContentToolSize > 0) {
        count += 1 - jsonContentToolSize;
      }
    }

    let paddedSystem = false;
    let copiedMessage:
      | OpenAIClient.Chat.Completions.ChatCompletionMessageParam
      | undefined;
    for (const message of messages) {
      if (
        message.role === 'system' &&
        tools &&
        tools.length > 0 &&
        !paddedSystem
      ) {
        if (message.content && message.content.length > 0) {
          copiedMessage = {
            role: message.role,
            name: message.name,
            content: `${message.content}\n`,
          };
        }
        paddedSystem = true;
      }
      count += await OpenAIChat.getNumTokensInMessage(
        modelName,
        copiedMessage ?? message,
        toolMessageSize
      );
    }

    count += 3; // every reply is primed with <|start|>assistant<|message|>

    return count;
  }

  /**
   * Calculates the number of tokens for a single chat message, considering non-tool content
   * and tool-related adjustments.
   *
   * Reference:
   * @see https://github.com/forestwanglin/openai-java/blob/main/jtokkit/src/main/java/xyz/felh/openai/jtokkit/utils/TikTokenUtils.java
   *
   * @param modelName - The model used for token calculations.
   * @param message - A single chat message.
   * @param toolMessageSize - Number of tool messages which can affect token calculations.
   * @returns The number of tokens used by the message.
   * @example
   * ```typescript
   * const tokenCount = await OpenAIChat.getNumTokensInMessage(
   *   'gpt-3.5-turbo',
   *   [{ role: 'user', content: 'Hello!' }]
   * );
   * console.log(tokenCount);
   * ```
   */
  static async getNumTokensInMessage(
    modelName: string,
    message: OpenAIClient.Chat.Completions.ChatCompletionMessageParam,
    toolMessageSize: number
  ) {
    let count = 0;

    // role
    count += await getNumTokens(message.role, modelName);

    // content
    if (message.role === 'tool') {
      if (toolMessageSize === 1) {
        count += await getNumTokens(message.content, modelName);
      } else {
        count += await getNumTokens(
          formatJSONStringInContent(message.content),
          modelName
        );

        const contentJSON = formatJSONInContent(message.content);
        if (contentJSON !== null) {
          count -= Object.keys(contentJSON).length;
        }
      }
    } else {
      count += await OpenAIChat.getNumTokensInMessageNonToolContent(
        modelName,
        message.content
      );
    }

    // name
    // don't need to compute token in name in tool messages
    if (message.role !== 'tool' && message.name) {
      count += (await getNumTokens(message.name, modelName)) + 1;
    }

    // tool_calls in assistant messages
    if (message.role === 'assistant') {
      count += await OpenAIChat.getNumTokensInMessageToolCalls(
        modelName,
        message.tool_calls
      );
    }

    if (message.role === 'tool') {
      count += 2;
    } else {
      count += 3;
    }

    return count;
  }

  /**
   * Estimates token count for message content that does not involve tool operations, such as
   * plain text or structured data.
   *
   * @param modelName - The model used for token calculations.
   * @param content - The content of the message, either a string or structured content.
   * @returns The number of tokens estimated for the non-tool content.
   * @example
   * ```typescript
   * const tokenCount = await OpenAIChat.getNumTokensInMessageNonToolContent(
   *   'gpt-3.5-turbo',
   *   [{ type: 'text', content: 'Hello!' }]
   * );
   * console.log(tokenCount);
   * ```
   */
  static async getNumTokensInMessageNonToolContent(
    modelName: string,
    content:
      | string
      | OpenAIClient.Chat.Completions.ChatCompletionContentPart[]
      | null
      | undefined
  ) {
    let count = 0;

    if (typeof content === 'string') {
      count += await getNumTokens(content, modelName);
    } else {
      if (content) {
        for (const part of content) {
          if (part.type === 'text') {
            // don't need to compute type as token
            count += await getNumTokens(part.text, modelName);
          } else if (part.type === 'image_url') {
            // tokens are different depending on the resolution detail
            // see https://platform.openai.com/docs/guides/vision/calculating-costs
            if (part.image_url.detail === 'low') {
              count += 85;
            } else if (part.image_url.detail === 'high') {
              count += 85;

              let width = 0;
              let height = 0;

              if (part.image_url.url.startsWith('data:')) {
                // base64
                try {
                  let b64: string = part.image_url.url;
                  b64 = b64.split(';base64,').pop()!;

                  const image = Buffer.from(b64, 'base64');
                  const metadata = await sharp(image).metadata();

                  if (!metadata.width || !metadata.height) {
                    throw new Error(
                      `image from base64 has invalid width and height: ${metadata.width}, ${metadata.height}`
                    );
                  }

                  width = metadata.width;
                  height = metadata.height;
                } catch (e) {
                  console.error(`base64 to image has error: ${e}`);
                }
              } else {
                // image url
                try {
                  const res = await axios({
                    url: part.image_url.url,
                    responseType: 'arraybuffer',
                  });

                  const image = Buffer.from(res.data, 'base64');
                  const metadata = await sharp(image).metadata();
                  if (!metadata.width || !metadata.height) {
                    throw new Error(
                      `image from base64 has invalid width and height: ${metadata.width}, ${metadata.height}`
                    );
                  }

                  width = metadata.width;
                  height = metadata.height;
                } catch (e) {
                  console.error(`url to image has error: ${e}`);
                }
              }

              // 1 tile per 512x512, 170 tokens per tile
              const tiles: number =
                Math.ceil(width / 512.0) * Math.ceil(height / 512.0);
              count += 170 * tiles;
            }
          }
        }
      }
    }

    return count;
  }

  /**
   * Estimates the number of tokens used by tool calls within a message, accounting for
   * function names and arguments.
   *
   * @param modelName - The model used for token calculations.
   * @param toolCalls - Array of tool calls within the message.
   * @returns The number of tokens used by all tool calls in the message.
   * @example
   * ```typescript
   * const tokenCount = await OpenAIChat.getNumTokensInMessageToolCalls(
   *   'gpt-4-turbo',
   *   [
   *     {
   *       id: 'tool-id-from-api',
   *       type: 'function',
   *       function: {
   *         name: 'get_current_weather',
   *         arguments: "{\n\"location\": \"Boston, MA\"\n}"
   *       }
   *     }
   *   ]
   * );
   * console.log(tokenCount);
   * ```
   */
  static async getNumTokensInMessageToolCalls(
    modelName: string,
    toolCalls:
      | OpenAIClient.Chat.Completions.ChatCompletionMessageToolCall[]
      | undefined
  ) {
    let count = 0;

    if (toolCalls) {
      for (const tc of toolCalls) {
        count += 3;
        count += await getNumTokens(tc.type, modelName);

        if (tc.type === 'function') {
          // name is required in function
          if (tc.function.name) {
            count += await getNumTokens(tc.function.name, modelName);
          }
          if (tc.function.arguments) {
            count += await getNumTokens(tc.function.arguments, modelName);
          }
        }
      }
    }

    return count;
  }

  /**
   * Estimates the total number of tokens generated in response to chat interactions, useful
   * for API quota management.
   *
   * @param modelName - The model used for token calculations.
   * @param generations - Array of chat generation chunks produced by the model.
   * @returns The total number of tokens used in the generations.
   * @example
   * ```typescript
   * const tokenCount = await OpenAIChat.getNumTokensInGenerations(
   *   'gpt-4-turbo',
   *   [new ChatGenerationChunk({ message: new BotMessage('Hello!') })]
   * );
   * console.log(tokenCount);
   * ```
   */
  static async getNumTokensInGenerations(
    modelName: string,
    generations: ChatGenerationChunk[]
  ) {
    const counts: number[] = await Promise.all(
      generations.map(async (generation: ChatGenerationChunk) => {
        const openAIMessage = getContentFromMessage(generation.message);

        let count = 0;

        if (openAIMessage.role === 'assistant') {
          count += await OpenAIChat.getNumTokensInMessageToolCalls(
            modelName,
            openAIMessage.tool_calls
          );

          if (openAIMessage.tool_calls && openAIMessage.tool_calls.length > 0) {
            count += 3;
          }
        }

        count += await OpenAIChat.getNumTokensInMessageNonToolContent(
          modelName,
          openAIMessage.content
        );

        return count;
      })
    );

    return counts.reduce((a, b) => a + b, 0);
  }

  /**
   * Calculates the number of tokens associated with the tools defined for use in the chat.
   *
   * @param modelName - The model used for token calculations.
   * @param tools - Tools configured for the chat.
   * @returns The total number of tokens estimated for all tools.
   * @example
   * ```typescript
   * const tokenCount = await OpenAIChat.getNumTokensInTools(
   *   'gpt-4-turbo',
   *   [
   *     {
   *       type: 'function',
   *       function: {
   *         name: 'get_current_weather',
   *         description: 'get weather in a given location',
   *         parameters: {
   *           type: 'object',
   *           properties: {
   *             location: {
   *               type: 'string'
   *             },
   *             unit: {
   *               type: 'string',
   *               enum: ['celsius', 'fahrenheit'],
   *             }
   *           },
   *           required: ['location']
   *         }
   *       }
   *     }
   *   ]
   * );
   * console.log(tokenCount);
   * ```
   */
  static async getNumTokensInTools(
    modelName: string,
    tools: OpenAIClient.Chat.Completions.ChatCompletionTool[]
  ) {
    const promptDefinitions: string = formatFunctionDefs(
      tools.map((t) => t.function) as unknown as FunctionDef[]
    );

    let count: number = await getNumTokens(promptDefinitions, modelName);
    count += 9; // Additional tokens for function definition of tools

    return count;
  }

  /**
   * Configures and returns the request options for API calls, merging any additional options
   * provided with the default client options.
   *
   * @param options - Optional request configurations that may override default settings.
   * @returns The complete request options for API calls.
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

function getMessageFromChatCompletionDelta(
  delta: OpenAIClient.Chat.Completions.ChatCompletionChunk.Choice.Delta,
  defaultRole?: OpenAIMessageRole
): BaseMessage {
  const role = delta.role ?? defaultRole;
  const content: string = delta.content ?? '';
  const additionalKwargs: Record<string, unknown> = {};

  if (delta.tool_calls) {
    additionalKwargs['tool_calls'] = delta.tool_calls;
  }

  switch (role) {
    case 'user':
      return new HumanMessage({ content });
    case 'assistant':
      return new BotMessage({ content, additionalKwargs });
    case 'system':
      return new SystemMessage({ content });
    case 'tool':
      return new FunctionMessage({ content, additionalKwargs });
    default:
      return new ChatMessage({
        content,
        role: role ?? 'unknown',
        additionalKwargs,
      });
  }
}

function getMessageFromOpenAICompletionMessage(
  message: OpenAIClient.Chat.Completions.ChatCompletionMessage
): BaseMessage {
  const content: string = message.content ?? '';
  const additionalKwargs: Record<string, unknown> = {};

  if (message.tool_calls) {
    additionalKwargs['tool_calls'] = message.tool_calls;
  }

  return new BotMessage({ content, additionalKwargs });
}
