import { TiktokenModel, type Tiktoken } from 'js-tiktoken/lite';
import { BaseCache } from '../../../../cache/base.js';
import { MemoryCache } from '../../../../cache/index.js';
import {
  Callable,
  CallableConfigFields,
  type CallableConfig,
} from '../../../../record/callable.js';
import {
  AsyncCallError,
  AsyncCaller,
  type AsyncCallerParams,
} from '../../../../utils/asyncCaller.js';
import {
  encodingForModel,
  getTiktokenModel,
} from '../../../../utils/tokenizer.js';
import { BaseEventParams } from '../../../base.js';
import {
  type BaseMessage,
  type BaseMessageLike,
  convertMessageLikeToMessage,
  getChatString,
  BotMessage,
} from '../../../input/load/msgs/base.js';
import { BasePrompt, StringPrompt } from '../../../input/load/prompts/base.js';
import { ChatPrompt } from '../../../input/load/prompts/chat.js';
import { Generation } from '../../../output/provide/generation.js';
import { LLMResult } from '../../../output/provide/llmresult.js';

export interface BaseLMCallOptions extends BaseEventParams {
  /**
   * Stop tokens in the LM call.
   * If not provided, default stop tokens are used for the LM.
   */
  stopWords?: string[];

  /**
   * Timeout for the LM cal in milliseconds;
   */
  timeout?: number;

  /**
   * Abort signal for the call.
   * If provided, the call will be aborted when the signal is aborted.
   */
  signal?: AbortSignal;
}

export type BaseLMInput = BasePrompt | BaseMessageLike[] | string;

export interface BaseLMParams extends AsyncCallerParams, BaseEventParams {
  cache?: BaseCache | boolean;
}

/**
 * Abstract class representing the BaseLM (Base Language Model).
 * This class offers core functionalities for interfacing with a language model, including caching,
 * token counting, and transforming inputs to prompts.
 *
 * @template CallOutput - Represents the call output type. Default is unknown.
 * @template CallOptions - Represents the call options type. By default, it extends from {@link BaseLMCallOptions}.
 */
export abstract class BaseLM<
    CallOutput = unknown,
    CallOptions extends BaseLMCallOptions = BaseLMCallOptions,
  >
  extends Callable<BaseLMInput, CallOutput, CallOptions>
  implements BaseLMParams
{
  /**
   * Represents the type for call options.
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
   * Instance of Tiktoken to calculate the number of tokens in a given string.
   */
  private _encoding?: Tiktoken;

  /**
   * Constructor for the BaseLM class.
   * @param {BaseLMParams} params - Parameters to initialize the base language model.
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

    this.caller = new AsyncCaller(params ?? {});
  }

  /**
   * Abstract method to get the LLM type. Must be implemented by subclasses.
   * @returns {string} The type of LLM.
   */
  abstract _llmType(): string;

  /**
   * Abstract method to get the model type. Must be implemented by subclasses.
   * @returns {string} The type of the model.
   */
  abstract _modelType(): string;

  /**
   * Abstract method to provides the core logic to interface with the language model,
   * handling both cached and uncached predictions.
   * @param {string[]} prompts - An array of prompts.
   * @param {string[] | CallOptions} [options] - Optional call options or an array of stop words.
   * @param {any} [callbacks] - Optional callbacks.
   * @returns {Promise<LLMResult>} The result from the language model.
   */
  abstract provide(
    prompts: string[],
    options?: string[] | CallOptions,
    callbacks?: any
  ): Promise<LLMResult>;

  /**
   * Abstract method to provide language model result with prompts {@link BasePrompt[]}.
   * @param {BasePrompt[]} prompts - Array of prompts.
   * @param {string[] | CallOptions} [options] - Optional call options or an array of stop words.
   * @param {any} [callbacks] - Optional callbacks.
   * @returns {Promise<LLMResult>} The result from the language model.
   */
  abstract provideWithPrompts(
    prompts: BasePrompt[],
    options?: string[] | CallOptions,
    callbacks?: any
  ): Promise<LLMResult>;

  /**
   * Abstract method to predict output based on a given text.
   * @param {string} text - The input text.
   * @param {string[] | CallOptions} [options] - Optional call options or an array of stop words.
   * @param {any} [callbacks] - Optional callbacks.
   * @returns {Promise<string>} The predicted output.
   */
  abstract predict(
    text: string,
    options?: string[] | CallOptions,
    callbacks?: any
  ): Promise<string>;

  /**
   * Abstract method to generate a prediction based on a set of messages.
   * @param {BaseMessage[]} messages - Array of messages.
   * @param {string[] | CallOptions} [options] - Optional call options or an array of stop words.
   * @param {any} [callbacks] - Optional callbacks.
   * @returns {Promise<BaseMessage>} The bot's message after prediction.
   */
  abstract predictWithMessages(
    messages: BaseMessage[],
    options?: string[] | CallOptions,
    callbacks?: any
  ): Promise<BaseMessage>;

  /**
   * Calculates the number of tokens in the given text.
   * @param {string} text - The input text.
   * @returns {Promise<number>} The number of tokens in the input text.
   */
  async getNumTokens(text: string) {
    // fallback for calulating text's tokens
    // 1 token ~= 4 chars in English
    let numTokens: number = Math.ceil(text.length / 4);

    if (!this._encoding) {
      try {
        this._encoding = await encodingForModel(
          'modelName' in this
            ? getTiktokenModel(this.modelName as string)
            : 'gpt2'
        );
      } catch (e) {
        console.warn(
          `Failed to calculate correct number of tokens, now we use 1 token ~= 4 chars in English for approximate token calculation: ${e}`
        );
      }
    }

    if (this._encoding) {
      numTokens = this._encoding.encode(text).length;
    }

    return numTokens;
  }

  /**
   * Converts a given {@link BaseLMInput} to a {@link BasePrompt}.
   * @param {BaseLMInput} input - The input for the language model.
   * @returns {BasePrompt} The corresponding prompt.
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
   * @returns {Record<string, any>} A record of identified parameters.
   */
  protected _identifyParams(): Record<string, any> {
    return {};
  }

  /**
   * Constructs a string key based on the given call options for caching purposes.
   * @param {CallOptions} callOptions - The call options.
   * @returns {string} The generated key.
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
> extends BaseLM<string, CallOptions> {
  /**
   * Represents the type for call options without some specified properties.
   */
  declare SerializedCallOptions: Omit<
    CallOptions,
    keyof CallableConfig & 'timeout'
  >;

  /**
   * A predefined namespace array to identify the type of language model and other related namespaces.
   */
  _namespace: string[] = ['inference', 'chat', 'llms', this._llmType()];

  /**
   * Constructor for the BaseLLM class.
   * @param fields - Parameters to initialize the base language model.
   */
  constructor(fields: BaseLLMParams) {
    super(fields);
  }

  /**
   * Returns the type of the model.
   * @returns {string} The type of the model.
   */
  _modelType(): string {
    return 'base_llm';
  }

  /**
   * Invokes the language model with a given input and options.
   * @param input - The input for the language model.
   * @param options - Optional call options.
   * @returns {Promise<string>} The output from the language model.
   */
  async invoke(input: BaseLMInput, options?: CallOptions): Promise<string> {
    const prompt: BasePrompt = BaseLLM._convertInputToPrompt(input);
    const result: LLMResult = await this.provideWithPrompts(
      [prompt],
      options,
      options?.callbacks
    );

    return result.generations[0][0].output as string;
  }

  /**
   * Calls the language model with a given prompt and options.
   * @param prompt - The prompt for the language model.
   * @param options - Optional call options or an array of stop words.
   * @param callbacks - Optional callbacks.
   * @returns {Promise<string>} The output from the language model.
   */
  async call(
    prompt: string,
    options?: CallOptions | string[],
    callbacks?: any
  ): Promise<string> {
    const { generations } = await this.provide([prompt], options, callbacks);
    return generations[0][0].output as string;
  }

  /**
   * Predicts the output based on a given text.
   * @param text - The input text.
   * @param options - Optional call options or an array of stop words.
   * @param callbacks - Optional callbacks.
   * @returns {Promise<string>} The predicted output.
   */
  async predict(
    text: string,
    options?: CallOptions | string[],
    callbacks?: any
  ): Promise<string> {
    return this.call(text, options, callbacks);
  }

  /**
   * Generates a prediction based on a set of messages.
   * @param messages - An array of messages.
   * @param options - Optional call options or an array of stop words.
   * @param callbacks - Optional callbacks.
   * @returns {Promise<BaseMessage>} The bot's message after prediction.
   */
  async predictWithMessages(
    messages: BaseMessage[],
    options?: CallOptions | string[],
    callbacks?: any
  ): Promise<BaseMessage> {
    const text: string = getChatString(messages);
    const prediction: string = await this.call(text, options, callbacks);
    return new BotMessage(prediction);
  }

  /**
   * Provides the core logic to interface with the language model, handling both cached and uncached predictions.
   * @param prompts - An array of prompts.
   * @param options - Optional call options or an array of stop words.
   * @param callbacks - Optional callbacks.
   * @returns {Promise<LLMResult>} The result from the language model.
   */
  async provide(
    prompts: string[],
    options?: CallOptions | string[],
    callbacks?: any
  ): Promise<LLMResult> {
    if (!Array.isArray(prompts)) {
      throw new Error("Argument 'prompts' must be string[]");
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

    const uncachedPromptIndices: number[] = [];
    const generations: (Generation[] | null | undefined)[] = await Promise.all(
      prompts.map(async (prompt, idx) => {
        const result: Generation[] | null | undefined =
          await this.cache?.lookup([prompt, llmStrKey]);

        if (result === null || result === undefined) {
          uncachedPromptIndices.push(idx);
        }

        return result;
      })
    );

    let llmOutput = {};
    if (uncachedPromptIndices.length > 0) {
      const llmResult: LLMResult = await this._provideUncached(
        uncachedPromptIndices.map((i: number) => prompts[i]),
        serializedCallOptions
      );

      await Promise.all(
        llmResult.generations.map(
          async (generation: Generation[], idx: number) => {
            const uncachedPromptIdx: number = uncachedPromptIndices[idx];
            generations[uncachedPromptIdx] = generation;
            return this.cache?.update(
              [prompts[uncachedPromptIdx], llmStrKey],
              generation
            );
          }
        )
      );

      llmOutput = llmResult.llmOutput ?? {};
    }

    return { generations: generations as Generation[][], llmOutput };
  }

  /**
   * Method to provide language model result with prompts {@link BasePrompt[]}.
   * Transforms prompts to strings and delegates the call to the `provide` method.
   * @param prompts - An array of prompts.
   * @param options - Optional call options or an array of stop words.
   * @param callbacks - Optional callbacks.
   * @returns {Promise<LLMResult>} The result from the language model.
   */
  async provideWithPrompts(
    prompts: BasePrompt[],
    options?: string[] | CallOptions,
    callbacks?: any
  ): Promise<LLMResult> {
    const promptStrs: string[] = prompts.map((prompt: BasePrompt) =>
      prompt.toString()
    );
    return this.provide(promptStrs, options, callbacks);
  }

  /**
   * Abstract method that interfaces with the underlying language model. Must be implemented by subclasses.
   * @param prompts - An array of prompts.
   * @param options - Call options.
   * @returns {Promise<LLMResult>} The result from the language model.
   */
  abstract _provide(
    prompts: string[],
    options: this['SerializedCallOptions']
  ): Promise<LLMResult>;

  /**
   * Handles uncached prompts and calls the `_provide` method.
   * @param prompts - An array of prompts.
   * @param serializedCallOptions - Serialized call options.
   * @returns {Promise<LLMResult>} The result from the language model.
   */
  protected async _provideUncached(
    prompts: string[],
    serializedCallOptions: this['SerializedCallOptions']
  ): Promise<LLMResult> {
    let output: LLMResult;

    /*eslint no-useless-catch: "warn"*/
    try {
      output = await this._provide(prompts, serializedCallOptions);
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

export async function calculateMaxToken(
  prompt: string,
  modelName: TiktokenModel
): Promise<number> {
  let numTokens: number;

  try {
    numTokens = (await encodingForModel(getTiktokenModel(modelName))).encode(
      prompt
    ).length;
  } catch (e) {
    console.warn(
      `Failed to calculate correct number of tokens, now we use 1 token ~= 4 chars in English for approximate token calculation: ${e}`
    );

    numTokens = Math.ceil(prompt.length / 4);
  }

  const maxTokens = getModelContextSize(modelName);
  return maxTokens - numTokens;
}

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
