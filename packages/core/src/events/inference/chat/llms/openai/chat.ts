import axios from 'axios';
import {
  OpenAI as OpenAIClient,
  ClientOptions as OpenAIClientOptions,
} from 'openai';
import type { RequestOptions as OpenAIClientRequestOptions } from 'openai/core';
import sharp from 'sharp';

import { SecretFields, SerializedFields } from '../../../../../load/keymap.js';
import { getEnvironmentVariables } from '../../../../../utils/environment.js';
import {
  FunctionDef,
  formatFunctionDefs,
} from '../../../../../utils/openaiFunctionFormat.js';
import {
  getNumTokens,
  getTiktokenModel,
} from '../../../../../utils/tokenizer.js';
import {
  BaseMessage,
} from '../../../../input/load/msgs/base.js';
import { BotMessage } from '../../../../input/load/msgs/bot.js';
import { ChatMessage } from '../../../../input/load/msgs/chat.js';
import { FunctionMessage } from '../../../../input/load/msgs/function.js';
import { HumanMessage } from '../../../../input/load/msgs/human.js';
import { SystemMessage } from '../../../../input/load/msgs/system.js';
import { LLMResult } from '../../../../output/provide/llmresult.js';
import { ChatGenerationChunk } from '../../../../output/provide/message.js';
import { BaseChatLM, BaseLLMParams } from '../../base.js';
import { TokenUsage } from '../../index.js';
import {
  formatArguments,
  formatJSONInContent,
  formatJSONStringInContent,
  getContentFromMessage,
  isJSONInContent,
} from './utils.js';
import {
  checkModelForOpenAIChat,
  checkModelForOpenAIVision,
  OpenAIChatCallOptions,
  OpenAIChatInput,
  wrapOpenAIClientError,
} from './index.js';

export type OpenAIMessageRole = 'system' | 'user' | 'assistant' | 'tool';

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

  modelName = 'gpt-3.5-turbo';

  frequencyPenalty = 0;

  presencePenalty = 0;

  streaming = false;

  temperature = 1;

  maxTokens = 2048;

  topP = 1;

  n = 1;

  responseFormatType?: 'json' | 'text';

  logitBias?: Record<string, number>;

  seed?: number;

  stopWords?: string[];

  user?: string;

  additionalKwargs?: Record<string, unknown>;

  timeout?: number;

  openAIApiKey?: string;

  chatMessages?: OpenAIClient.Chat.ChatCompletionMessageParam[];

  organization?: string;

  private _client: OpenAIClient;

  private _clientOptions: OpenAIClientOptions;

  private _isMultimodal = false;

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

    if (!checkModelForOpenAIChat(this.modelName)) {
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
   * @param {OpenAIClient.Chat.ChatCompletionCreateParamsStreaming | OpenAIClient.Chat.ChatCompletionCreateParamsNonStreaming} request
   *        The request parameters which can be either for streaming or non-streaming chat completions.
   * @param {OpenAIClientRequestOptions} [options] Optional client request configurations.
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
   * Estimate token used in messages with OpenAI Chat language model.
   * @see https://github.com/hmarr/openai-chat-tokens/blob/main/src/index.ts and
   * @see https://github.com/forestwanglin/openai-java/blob/main/jtokkit/src/main/java/xyz/felh/openai/jtokkit/utils/TikTokenUtils.java
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
   * Estimate token used in an array of OpenAI Chat Completion messages.
   * @see https://github.com/forestwanglin/openai-java/blob/main/jtokkit/src/main/java/xyz/felh/openai/jtokkit/utils/TikTokenUtils.java
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
   * Estimate token used in an array of OpenAI Chat Completion messages.
   * @see https://github.com/forestwanglin/openai-java/blob/main/jtokkit/src/main/java/xyz/felh/openai/jtokkit/utils/TikTokenUtils.java
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
            count += await getNumTokens(
              tc.function.name,
              modelName
            );
          }
          if (tc.function.arguments) {
            count += await getNumTokens(
              tc.function.arguments,
              modelName
            );
          }
        }
      }
    }

    return count;
  }

  /**
   * Estimate token used in generation from OpenAI Chat language model.
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
