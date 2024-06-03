import { TiktokenModel } from 'js-tiktoken/lite';
import { BaseCache } from '../../../cache/base.js';
import { MemoryCache } from '../../../cache/index.js';
import { type CallableConfig } from '../../../record/callable.js';
import {
  AsyncCallError,
  AsyncCaller,
  baseFailedAttemptHandler,
  type AsyncCallerParams,
} from '../../../utils/asyncCaller.js';
import { getNumTokens, getTiktokenModel } from '../../../utils/tokenizer.js';
import { BaseEvent, BaseEventParams } from '../../base.js';
import {
  type BaseMessageLike,
  BaseMessage,
} from '../../input/load/msgs/base.js';
import {
  convertMessageLikeToMessage,
  isMessageLike,
} from '../../input/load/msgs/utils.js';
import { BasePrompt } from '../../input/load/prompts/base.js';
import { ChatPrompt } from '../../input/load/prompts/chat.js';
import { StringPrompt } from '../../input/load/prompts/text.js';
import { Generation } from '../../output/provide/generation.js';
import { LLMResult } from '../../output/provide/llmresult.js';

/**
 * Options for language model invocation.
 */
export interface BaseLMCallOptions extends BaseEventParams {
  /**
   * Optional array of tokens that should stop the language model's generation.
   */
  stopWords?: string[];

  /**
   * Maximum time in milliseconds to wait for a response from the language model.
   */
  timeout?: number;

  /**
   * Optional abort signal to cancel the request prematurely.
   */
  signal?: AbortSignal;
}

/**
 * Type for inputs acceptable by the language model which can be a prompt, message like
 * array, or a string.
 */
export type BaseLMInput = BasePrompt | BaseMessageLike[] | string;

/**
 * Parameters for base language model operations, including caching.
 */
export interface BaseLMParams extends AsyncCallerParams, BaseEventParams {
  /**
   * Cache instance to store and retrieve results for given prompts.
   * If cache is boolean and is `true`, then we use a {@link MemoryCache}.
   */
  cache?: BaseCache | boolean;
}

/**
 * Abstract class for base language model handling.
 * Provides core functionality for interacting with a language model including caching,
 * input transformation, and asynchronous execution.
 *
 * @template CallOutput - Type of the output from a language model call.
 * @template CallOptions - Type for options to pass during a call.
 */
export abstract class BaseLM<
    CallOutput = unknown,
    CallOptions extends BaseLMCallOptions = BaseLMCallOptions,
  >
  extends BaseEvent<BaseLMInput, CallOutput, CallOptions>
  implements BaseLMParams
{
  /**
   * Represents the type for call options.
   * @hidden
   */
  declare CallOptions: CallOptions;

  /**
   * Instance responsible for making asynchronous calls.
   */
  caller: AsyncCaller;

  /**
   * Cache instance to store and retrieve results for given prompts.
   */
  cache?: BaseCache;

  /**
   * Constructor for the BaseLM class.
   * @param params Parameters to initialize the base language model.
   */
  constructor({ callbacks, ...params }: BaseLMParams) {
    super({ callbacks, ...params });

    if (typeof params.cache === 'object') {
      this.cache = params.cache;
    } else if (params.cache) {
      this.cache = MemoryCache.global();
    } else {
      this.cache = undefined;
    }

    this.caller = new AsyncCaller(
      (params ?? {}) && { onFailedAttempt: this._failedAttemptHandler }
    );
  }

  /**
   * Returns the LLM type.
   * @returns The type of LLM.
   */
  abstract _llmType(): string;

  /**
   * Returns the model type.
   * @returns The type of the model.
   */
  abstract _modelType(): string;

  /**
   * Abstract method to invoke the language model with a given input and options.
   * @param input The input for the language model.
   * @param options Optional call options.
   * @returns The output llm result from the language model.
   */
  abstract invoke(
    input: BaseLMInput,
    options?: Partial<CallOptions>
  ): Promise<CallOutput>;

  /**
   * Abstract method to provide the core logic to interface with the language model,
   * handling both cached and uncached predictions.
   * @param input A given input to the language model, can be a prompt or an array of messages.
   * @param options Optional call options or an array of stop words.
   * @param callbacks Optional callbacks.
   * @returns The result from the language model.
   */
  abstract provide(
    input: unknown,
    options?: string[] | CallOptions,
    callbacks?: any
  ): Promise<LLMResult>;

  /**
   * Converts a given {@link BaseLMInput} to a {@link BasePrompt}.
   * @param input The input for the language model.
   * @returns The corresponding prompt.
   * @internal
   */
  protected static _convertInputToPrompt(input: BaseLMInput): BasePrompt {
    if (typeof input === 'string') {
      return new StringPrompt(input);
    } else if (Array.isArray(input)) {
      return new ChatPrompt(
        input.map((msg: BaseMessageLike) => convertMessageLikeToMessage(msg))
      );
    }

    return input;
  }

  /**
   * Method to identify additional parameters specific to implementations.
   * @returns A record of identified parameters.
   * @internal
   */
  protected _identifyParams(): Record<string, any> {
    return {};
  }

  /**
   * Constructs a string key based on the given call options for caching purposes.
   * @param callOptions The call options.
   * @returns The generated key.
   * @internal
   */
  protected _getLLMStrKey(callOptions: CallOptions): string {
    const params: Record<string, any> = {
      ...this._identifyParams(),
      ...callOptions,
      _type: this._llmType(),
      _model: this._modelType(),
    };

    const nonEmptyParams: Record<string, any> = Object.entries(params).filter(
      ([_, v]) => v !== undefined
    );

    const llmStrKey: string = nonEmptyParams
      .map(([k, v]) => `${k}:${JSON.stringify(v)}`)
      .sort()
      .join(',');

    return llmStrKey;
  }

  /**
   * Custom handler for failed asynchronous attempts.
   *
   * @param e - The error encountered during an attempt.
   */
  protected _failedAttemptHandler(e: Error) {
    baseFailedAttemptHandler(e as AsyncCallError);
  }
}

export interface BaseLLMCallOptions extends BaseLMCallOptions {}

export interface BaseLLMParams extends BaseLMParams {}

/**
 * Abstract class representing the BaseLLM. This class provides core functionalities
 * to interface with a language model, potentially allowing for both cached and uncached predictions.
 *
 * @template CallOptions - Represents the call options type. By default, it extends from {@link BaseLLMCallOptions}.
 */
export abstract class BaseLLM<
  CallOptions extends BaseLLMCallOptions = BaseLLMCallOptions,
> extends BaseLM<LLMResult, CallOptions> {
  /**
   * Represents the type for call options without some specified properties.
   * @hidden
   */
  declare SerializedCallOptions: Omit<
    CallOptions,
    keyof CallableConfig & 'timeout'
  >;

  /**
   * A predefined namespace array to identify the type of language model and other related namespaces.
   */
  _eventNamespace(): string[] {
    return ['inference', 'chat', 'llms', this._llmType()];
  }

  /**
   * Constructor for the BaseLLM class.
   * @param fields Parameters to initialize the base language model.
   */
  constructor(fields: BaseLLMParams) {
    super(fields);
  }

  /**
   * Returns the type of the model.
   * @returns The type of the model.
   */
  _modelType(): string {
    return 'base_llm';
  }

  /**
   * Returns the parameters of the model.
   * @returns The parameters of the model.
   */
  abstract getParams(
    options?: this['SerializedCallOptions']
  ): Record<string, unknown>;

  /**
   * Invokes the language model with a given input and options.
   * @param input The input for the language model.
   * @param options Optional call options.
   * @returns The output llm result from the language model.
   */
  async invoke(input: BaseLMInput, options?: CallOptions): Promise<LLMResult> {
    const prompt: BasePrompt = BaseLLM._convertInputToPrompt(input);
    const result: LLMResult = await this.provide(
      prompt.toString(),
      options,
      options?.callbacks
    );

    return result;
  }

  /**
   * Provides the core logic to interface with the language model, handling both cached and uncached predictions.
   * @param prompt A prompt.
   * @param options Optional call options or an array of stop words.
   * @param callbacks Optional callbacks.
   * @returns The result from the language model.
   */
  async provide(
    prompt: string,
    options?: CallOptions | string[],
    callbacks?: any
  ): Promise<LLMResult> {
    if (Array.isArray(prompt) || !(typeof prompt === 'string')) {
      throw new Error("Argument 'prompt' must be string");
    }

    let parsedOptions: CallOptions | undefined;
    if (Array.isArray(options)) {
      parsedOptions = { stopWords: options } as CallOptions;
    } else {
      parsedOptions = options;
    }

    const [callableOptions, serializedCallOptions] =
      this._splitCallableOptionsFromCallOptions(parsedOptions);
    callableOptions.callbacks = callableOptions.callbacks ?? callbacks;

    const llmStrKey: string = this._getLLMStrKey(serializedCallOptions);

    let generations: Generation[] | null | undefined = await this.cache?.lookup(
      [prompt, llmStrKey]
    );

    let llmOutput = {};
    if (generations === null || generations === undefined) {
      const llmResult: LLMResult = await this._provideUncached(
        prompt,
        serializedCallOptions
      );
      await this.cache?.update([prompt, llmStrKey], llmResult.generations);

      generations = llmResult.generations;
      llmOutput = llmResult.llmOutput ?? {};
    }

    return { generations, llmOutput };
  }

  /**
   * Abstract method that interfaces with the underlying language model. Must be implemented by subclasses.
   * @param prompt A prompt.
   * @param options Call options.
   * @returns The result from the language model.
   */
  abstract _provide(
    prompt: string,
    options: this['SerializedCallOptions']
  ): Promise<LLMResult>;

  /**
   * Handles uncached prompts and calls the `_provide` method.
   * @param prompt A prompt.
   * @param serializedCallOptions Serialized call options.
   * @returns The result from the language model.
   */
  protected async _provideUncached(
    prompt: string,
    serializedCallOptions: this['SerializedCallOptions']
  ): Promise<LLMResult> {
    let output: LLMResult;

    /*eslint no-useless-catch: "warn"*/
    try {
      output = await this._provide(prompt, serializedCallOptions);
    } catch (e) {
      throw e;
    }

    return output;
  }

  /**
   * Splits the provided call options into callable options and serialized options.
   * @param options - Call options.
   * @returns A tuple containing callable options and serialized options.
   */
  protected _splitCallableOptionsFromCallOptions(
    options?: Partial<CallOptions>
  ): [CallableConfig, this['SerializedCallOptions']] {
    const [callableOptions, serializedCallOptions] =
      super._splitCallableOptionsFromCallOptions(options);

    if (serializedCallOptions?.timeout && !serializedCallOptions.signal) {
      serializedCallOptions.signal = AbortSignal.timeout(
        serializedCallOptions.timeout
      );
    }

    return [
      callableOptions,
      serializedCallOptions as this['SerializedCallOptions'],
    ];
  }
}

export interface BaseChatLMCallOptions extends BaseLMCallOptions {}

export interface BaseChatLMParams extends BaseLMParams {}

/**
 * Abstract class representing the BaseChatLM. This class provides core functionalities
 * to interface with a language model, potentially allowing for both cached and uncached predictions.
 *
 * @template CallOptions - Represents the call options type. By default, it extends from {@link BaseChatLMCallOptions}.
 */
export abstract class BaseChatLM<
  CallOptions extends BaseChatLMCallOptions = BaseChatLMCallOptions,
> extends BaseLM<LLMResult, CallOptions> {
  /**
   * Represents the type for call options without some specified properties.
   * @hidden
   */
  declare SerializedCallOptions: Omit<
    CallOptions,
    keyof CallableConfig & 'timeout'
  >;

  /**
   * A predefined namespace array to identify the type of language model and other related namespaces.
   */
  _eventNamespace(): string[] {
    return ['inference', 'chat', 'chatlms', this._llmType()];
  }

  constructor(fields: BaseChatLMParams) {
    super(fields);
  }

  /**
   * Returns the type of the model.
   * @returns The type of the model.
   */
  _modelType(): string {
    return 'base_chatlm';
  }

  /**
   * Returns the parameters of the model.
   * @returns The parameters of the model.
   */
  abstract getParams(
    options?: this['SerializedCallOptions']
  ): Record<string, unknown>;

  /**
   * Invokes the chat language model with a given input and options.
   * @param input The input for the chat language model.
   * @param options Optional call options.
   * @returns The output llm result from the language model.
   */
  async invoke(input: BaseLMInput, options?: CallOptions): Promise<LLMResult> {
    const prompt: BasePrompt = BaseChatLM._convertInputToPrompt(input);
    const result: LLMResult = await this.provide(
      prompt.toChatMessages(),
      options,
      options?.callbacks
    );

    return result;
  }

  /**
   * Provides the core logic to interface with the chat language model, handling both cached and uncached predictions.
   * @param messages An array of messages.
   * @param options Optional call options or an array of stop words.
   * @param callbacks Optional callbacks.
   * @returns The result from the language model.
   */
  async provide(
    messages: BaseMessageLike[],
    options?: CallOptions | string[],
    callbacks?: any
  ): Promise<LLMResult> {
    if (!Array.isArray(messages)) {
      throw new Error("Argument 'messages' must be array.");
    }

    const baseMessages: BaseMessage[] = messages.map(
      convertMessageLikeToMessage
    );

    let parsedOptions: CallOptions | undefined;
    if (Array.isArray(options)) {
      parsedOptions = { stopWords: options } as CallOptions;
    } else {
      parsedOptions = options;
    }

    const [callableOptions, serializedCallOptions] =
      this._splitCallableOptionsFromCallOptions(parsedOptions);
    callableOptions.callbacks = callableOptions.callbacks ?? callbacks;

    const llmStrKey: string = this._getLLMStrKey(serializedCallOptions);

    const prompt: string =
      BaseChatLM._convertInputToPrompt(baseMessages).toString();
    let generations: Generation[] | null | undefined = await this.cache?.lookup(
      [prompt, llmStrKey]
    );

    let llmOutput = {};
    if (generations === null || generations === undefined) {
      const llmResult: LLMResult = await this._provideUncached(
        baseMessages,
        serializedCallOptions
      );
      await this.cache?.update([prompt, llmStrKey], llmResult.generations);

      generations = llmResult.generations;
      llmOutput = llmResult.llmOutput ?? {};
    }

    return { generations, llmOutput };
  }

  /**
   * Abstract method that interfaces with the underlying language model. Must be implemented by subclasses.
   * @param messages An array of messages.
   * @param options Call options.
   * @returns The result from the language model.
   */
  abstract _provide(
    messages: BaseMessage[],
    options: this['SerializedCallOptions']
  ): Promise<LLMResult>;

  /**
   * Handles uncached prompts and calls the `_provide` method.
   * @param messages An array of messages.
   * @param serializedCallOptions Serialized call options.
   * @returns The result from the language model.
   */
  protected async _provideUncached(
    messages: BaseMessage[],
    serializedCallOptions: this['SerializedCallOptions']
  ): Promise<LLMResult> {
    let output: LLMResult;

    /*eslint no-useless-catch: "warn"*/
    try {
      output = await this._provide(messages, serializedCallOptions);
    } catch (e) {
      throw e;
    }

    return output;
  }

  /**
   * Splits the provided call options into callable options and serialized options.
   * @param options Call options.
   * @returns A tuple containing callable options and serialized options.
   */
  protected _splitCallableOptionsFromCallOptions(
    options?: Partial<CallOptions>
  ): [CallableConfig, this['SerializedCallOptions']] {
    const [callableOptions, serializedCallOptions] =
      super._splitCallableOptionsFromCallOptions(options);

    if (serializedCallOptions?.timeout && !serializedCallOptions.signal) {
      serializedCallOptions.signal = AbortSignal.timeout(
        serializedCallOptions.timeout
      );
    }

    return [
      callableOptions,
      serializedCallOptions as this['SerializedCallOptions'],
    ];
  }
}

/**
 * Utility function to calculate the maximum number of tokens that can be sent to the model
 * after accounting for the tokens in the prompt.
 *
 * @param prompt The text to be sent to the model.
 * @param modelName The model's name, which determines the total context size.
 * @returns Maximum number of tokens that can be added to the prompt.
 * @example
 * ```typescript
 * const remainingTokens = await calculateMaxToken("Example prompt", "gpt-3.5-turbo-16k");
 * console.log(remainingTokens);
 * ```
 */
export async function calculateMaxToken(
  prompt: string,
  modelName: TiktokenModel
): Promise<number> {
  const numTokens: number = await getNumTokens(prompt, modelName);

  const maxTokens = getModelContextSize(modelName);
  return maxTokens - numTokens;
}

/**
 * Retrieves the context size for a given model.
 *
 * @param modelName Model's name.
 * @returns Total number of tokens that the model can handle in a single prompt.
 */
export function getModelContextSize(modelName: string): number {
  switch (getTiktokenModel(modelName)) {
    case 'gpt-3.5-turbo-16k':
      return 16384;
    case 'gpt-3.5-turbo':
      return 4096;
    case 'gpt-4-32k':
      return 32768;
    case 'gpt-4':
      return 8192;
    case 'text-davinci-003':
      return 4096;
    case 'text-curie-001':
      return 2048;
    case 'text-babbage-001':
      return 2048;
    case 'text-ada-001':
      return 2048;
    case 'code-davinci-002':
      return 8000;
    case 'code-cushman-001':
      return 2048;
    default:
      return 4096;
  }
}

/**
 * Type guard to check if a value is a valid BaseLMInput.
 *
 * @param value Value to check.
 * @returns True if the value is a BaseLMInput, false otherwise.
 * @example
 * ```typescript
 * if (isLMInput(someInput)) {
 *   console.log("Valid input for language model.");
 * }
 * ```
 */
export function isLMInput(value: unknown): value is BaseLMInput {
  if (Array.isArray(value)) {
    return value.every((v) => isMessageLike(v));
  }

  return typeof value === 'string' || value instanceof BasePrompt;
}
