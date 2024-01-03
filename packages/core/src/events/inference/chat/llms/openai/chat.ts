import {
  OpenAI as OpenAIClient,
  ClientOptions as OpenAIClientOptions,
} from 'openai';
import type { RequestOptions as OpenAIClientRequestOptions } from 'openai/core';
import {
  ChatCompletionCreateParamsStreaming,
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
} from 'openai/resources/chat';
import { SecretFields, SerializedFields } from '../../../../../load/keymap.js';
import { getEnvironmentVariables } from '../../../../../utils/environment.js';
import {
  FunctionDef,
  formatFunctionDefinitions,
} from '../../../../../utils/openaiFunction.js';
import {
  BaseMessage,
  BotMessage,
  ChatMessage,
  ContentLike,
  FunctionMessage,
  HumanMessage,
  MessageRole,
  SystemMessage,
} from '../../../../input/load/msgs/base.js';
import { LLMResult } from '../../../../output/provide/llmresult.js';
import { ChatGenerationChunk } from '../../../../output/provide/message.js';
import { BaseChatLM, BaseLLMParams } from '../../base.js';
import { TokenUsage } from '../../index.js';
import {
  OpenAIChatCallOptions,
  OpenAIChatInput,
  wrapOpenAIClientError,
} from './index.js';

export type OpenAIMessageRole = 'system' | 'user' | 'assistant' | 'function';

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
    };
  }

  static _name(): string {
    return 'OpenAIChat';
  }

  temperature = 1;

  topP = 1;

  frequencyPenalty = 0;

  presencePenalty = 0;

  n = 1;

  streaming = false;

  modelName = 'gpt-3.5-turbo';

  user?: string;

  maxTokens?: number;

  logitBias?: Record<string, number>;

  additionalKwargs?: Record<string, unknown>;

  stopWords?: string[];

  timeout?: number;

  openAIApiKey?: string;

  chatMessages?: ChatCompletionMessageParam[];

  organization?: string;

  private _client: OpenAIClient;

  private _clientOptions: OpenAIClientOptions;

  constructor(
    fields?: Partial<OpenAIChatInput> &
      BaseLLMParams & {
        configuration?: OpenAIClientOptions;
      }
  ) {
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
    this.logitBias = fields?.logitBias;
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
      temperature: this.temperature,
      max_tokens: this.maxTokens === -1 ? undefined : this.maxTokens,
      top_p: this.topP,
      frequency_penalty: this.frequencyPenalty,
      presence_penalty: this.presencePenalty,
      n: this.n,
      logit_bias: this.logitBias,
      stop: options?.stopWords ?? this.stopWords,
      user: this.user,
      stream: this.streaming,
      functions: options?.functions,
      function_call: options?.functionCallOption,
      ...this.additionalKwargs,
    };
  }

  async _provide(
    messages: BaseMessage[],
    options: this['SerializedCallOptions']
  ): Promise<LLMResult> {
    const tokenUsage: TokenUsage = {};

    const params = this.getParams(options);
    const convertedMessages: OpenAIClient.Chat.ChatCompletionMessageParam[] =
      messages.map((message: BaseMessage) => ({
        role: getOpenAIRoleFromMessage(message),
        content: getOpenAIMessageContentFromMessage(message),
        name: message.name,
        function_call: message.additionalKwargs
          ?.functionCall as OpenAIClient.Chat.ChatCompletionMessage.FunctionCall,
      }));

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

      const { functions, function_call } = this.getParams(options);

      const messageTokenUsage = await this.getNumTokensInChat(
        messages,
        functions,
        function_call
      );

      const generationsTokenUsage =
        await this.getNumTokensInGenerations(generations);

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
   *
   * @param {ChatCompletionCreateParamsStreaming | ChatCompletionCreateParamsNonStreaming} request
   *        The request parameters which can be either for streaming or non-streaming chat completions.
   * @param {OpenAIClientRequestOptions} [options] Optional client request configurations.
   */
  async completionWithRetry(
    request: ChatCompletionCreateParamsStreaming,
    options?: OpenAIClientRequestOptions
  ): Promise<AsyncIterable<OpenAIClient.Chat.Completions.ChatCompletionChunk>>;

  async completionWithRetry(
    request: ChatCompletionCreateParamsNonStreaming,
    options?: OpenAIClientRequestOptions
  ): Promise<OpenAIClient.Chat.Completions.ChatCompletion>;

  async completionWithRetry(
    request:
      | ChatCompletionCreateParamsStreaming
      | ChatCompletionCreateParamsNonStreaming,
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
   * Estimate token used in messages with OpenAI Chat language model.
   * @see https://github.com/hmarr/openai-chat-tokens/blob/main/src/index.ts
   */
  async getNumTokensInChat(
    messages: BaseMessage[],
    functions?: OpenAIClient.Chat.ChatCompletionCreateParams.Function[],
    functionCallOption?:
      | 'none'
      | 'auto'
      | OpenAIClient.Chat.ChatCompletionCreateParams.FunctionCallOption
  ): Promise<number> {
    // It appears that if functions are present, the first system message is padded with
    // a trailing newline. This was inferred by trying lots of combinations of messages
    // and functions and seeing what the token counts were.
    const openAIMessages: OpenAIClient.Chat.Completions.ChatCompletionMessageParam[] =
      messages.map((message: BaseMessage) =>
        getOpenAIMessageFromMessage(message)
      );

    const tokens: number[] = await Promise.all(
      openAIMessages.map(
        async (openAIMessage) => await this.getNumTokensInMessage(openAIMessage)
      )
    );

    let count: number = tokens.reduce(
      (a: number, b: number): number => a + b,
      0
    );

    count += 3; // every reply is primed with <|start|>assistant<|message|>

    // If there are functions, add the function definitions as they count towards token usage
    if (functions) {
      const promptDefinitions: string = formatFunctionDefinitions(
        functions as unknown as FunctionDef[]
      );

      count += await this.getNumTokens(promptDefinitions);
      count += 9; // Add nine per completion
    }

    // If there's a system message _and_ functions are present, subtract four tokens.
    // I assume this is because functions typically add a system message, but reuse
    // the first one if it's already there. This offsets the extra 9 tokens added by
    // the function definitions.
    if (functions && openAIMessages.find((m) => m.role === 'system')) {
      count -= 4;
    }

    // If functionCallOption is 'none', add one token.
    // If it's a FunctionCall object, add 4 + the number of tokens in the function name.
    // If it's undefined or 'auto', don't add anything.
    if (functionCallOption === 'none') {
      count += 1;
    } else if (
      functionCallOption !== 'auto' &&
      typeof functionCallOption === 'object'
    ) {
      count += (await this.getNumTokens(functionCallOption.name)) + 4;
    }

    return count;
  }

  /**
   * Estimate token used in each OpenAI Chat message.
   * @see https://github.com/hmarr/openai-chat-tokens/blob/main/src/index.ts and
   * @see https://github.com/openai/openai-cookbook/blob/main/examples/How_to_format_inputs_to_ChatGPT_models.ipynb
   */
  async getNumTokensInMessage(
    message: OpenAIClient.Chat.Completions.ChatCompletionMessageParam
  ): Promise<number> {
    let tokenPerMessage: number;
    let tokenPerName: number;

    // from: https://github.com/openai/openai-cookbook/blob/main/examples/How_to_format_inputs_to_ChatGPT_models.ipynb
    if (this.modelName === 'gpt-3.5-turbo-0301') {
      tokenPerMessage = 4; // every message follows <|start|>{role/name}\n{content}<|end|>\n
      tokenPerName = -1; // if there's a name, the role is omitted
    } else {
      tokenPerMessage = 3;
      tokenPerName = 1;
    }

    // from: https://github.com/hmarr/openai-chat-tokens/blob/main/src/index.ts
    const components = [
      message.role,
      message.content,
      message.name,
      message.function_call?.name,
      message.function_call?.arguments,
    ].filter((v): v is string => !!v);

    const tokens: number[] = await Promise.all(
      components.map((v: string): Promise<number> => this.getNumTokens(v))
    );

    let count: number = tokens.reduce(
      (a: number, b: number): number => a + b,
      0
    );

    count += tokenPerMessage;

    if (message.name) {
      count += tokenPerName;
    }

    if (message.role === 'function') {
      count -= 2;
    }

    if (message.function_call) {
      count += 3;
    }

    return count;
  }

  /**
   * Estimate token used in generation from OpenAI Chat language model.
   */
  async getNumTokensInGenerations(generations: ChatGenerationChunk[]) {
    const tokens: number[] = await Promise.all(
      generations.map(async (generation: ChatGenerationChunk) => {
        const openAIMessage: OpenAIClient.Chat.Completions.ChatCompletionMessageParam =
          getOpenAIMessageFromMessage(generation.message);

        if (openAIMessage.function_call) {
          return await this.getNumTokensInMessage(openAIMessage);
        }

        return await this.getNumTokens(openAIMessage.content ?? '');
      })
    );

    return tokens.reduce((a: number, b: number): number => a + b, 0);
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

function getOpenAIRoleFromMessage(message: BaseMessage): OpenAIMessageRole {
  const role: MessageRole = message._role();

  switch (role) {
    case 'system':
      return 'system';
    case 'human':
      return 'user';
    case 'assistant':
      return 'assistant';
    case 'function':
      return 'function';
    default:
      throw new Error(`Failed to get OpenAI Role from ${role}`);
  }
}

function getOpenAIMessageFromMessage(
  message: BaseMessage
): OpenAIClient.Chat.Completions.ChatCompletionMessageParam {
  const openAIMessage: OpenAIClient.Chat.Completions.ChatCompletionMessageParam =
    {
      role: getOpenAIRoleFromMessage(message),
      content: getOpenAIMessageContentFromMessage(message),
      name: message.name,
      function_call: message.additionalKwargs
        ?.functionCall as OpenAIClient.Chat.ChatCompletionMessage.FunctionCall,
    };

  if (openAIMessage.function_call?.arguments) {
    openAIMessage.function_call.arguments = JSON.stringify(
      JSON.parse(openAIMessage.function_call.arguments)
    );
  }

  return openAIMessage;
}

function getOpenAIMessageContentFromMessage(
  message: BaseMessage
): string | null {
  if (message.additionalKwargs?.functionCall) {
    return null;
  }

  const getContent = (content: ContentLike): string => {
    if (typeof content === 'string') {
      return content;
    }

    throw new Error('Message is not valid for OpenAI Chat model');
  };

  if (!Array.isArray(message.content)) {
    return getContent(message.content);
  }

  return message.content
    .map((content: ContentLike) => getContent(content))
    .join('\n');
}

function getMessageFromChatCompletionDelta(
  delta: OpenAIClient.Chat.Completions.ChatCompletionChunk.Choice.Delta,
  defaultRole?: OpenAIMessageRole
): BaseMessage {
  const role = delta.role ?? defaultRole;
  const content: string = delta.content ?? '';
  const additionalKwargs: Record<string, unknown> = {};

  if (delta.function_call) {
    additionalKwargs['functionCall'] = delta.function_call;
  }

  switch (role) {
    case 'user':
      return new HumanMessage({ content });
    case 'assistant':
      return new BotMessage({ content, additionalKwargs });
    case 'system':
      return new SystemMessage({ content });
    case 'function':
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

  if (message.function_call) {
    additionalKwargs['functionCall'] = message.function_call;
  }

  switch (message.role) {
    case 'user':
      return new HumanMessage({ content });
    case 'assistant':
      return new BotMessage({ content, additionalKwargs });
    case 'system':
      return new SystemMessage({ content });
    case 'function':
      return new FunctionMessage({ content, additionalKwargs });
    default:
      return new ChatMessage({
        content,
        role: message.role ?? 'unknown',
        additionalKwargs,
      });
  }
}
