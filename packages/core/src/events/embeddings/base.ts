import { type BaseCache } from '../../cache/index.js';
import { MemoryCache } from '../../cache/index.js';
import { type CallableConfig } from '../../record/index.js';
import {
  AsyncCaller,
  type AsyncCallerParams,
} from '../../utils/asyncCaller.js';
import { BaseEvent, type BaseEventParams } from '../base.js';
import { type EmbedResult } from '../output/provide/index.js';

/**
 * Options for base embeddings call.
 */
export interface BaseEmbeddingsCallOptions extends BaseEventParams {
  /**
   * Abort signal for the call.
   * If provided, the call will be aborted when the signal is aborted.
   */
  signal?: AbortSignal;
}

/**
 * Parameters for base embeddings, combining asynchronous caller parameters with
 * base event parameters.
 */
export interface BaseEmbeddingsParams
  extends AsyncCallerParams,
    BaseEventParams {
  /**
   * Optional cache to use for storing results, can be a cache instance or a boolean
   * to use a global cache.
   */
  cache?: BaseCache<number[]> | boolean;
}

/**
 * Abstract class providing base functionality for embeddings.
 * Manages event handling and asynchronous calling with optional caching.
 */
export abstract class BaseEmbeddings<
    CallOptions extends BaseEmbeddingsCallOptions = BaseEmbeddingsCallOptions,
  >
  extends BaseEvent<string, EmbedResult, CallOptions>
  implements BaseEmbeddingsParams
{
  /**
   * Represents the type for call options without some specified properties.
   * @hidden
   */
  declare SerializedCallOptions: Omit<CallOptions, keyof CallableConfig>;

  /**
   * The async caller should be used by subclasses to make any async calls,
   * which will thus benefit from the concurrency and retry logic.
   */
  caller: AsyncCaller;

  /**
   * Cache instance to store and retrieve results for given string.
   */
  cache?: BaseCache<number[]>;

  _eventNamespace(): string[] {
    return ['embeddings', this._embeddingsType()];
  }

  /**
   * Returns the type of the embeddings.
   */
  abstract _embeddingsType(): string;

  constructor({ callbacks, ...params }: BaseEmbeddingsParams) {
    super({ callbacks, ...params });

    if (typeof params.cache === 'object') {
      this.cache = params.cache;
    } else if (params.cache) {
      this.cache = MemoryCache.global<number[]>();
    } else {
      this.cache = undefined;
    }

    this.caller = new AsyncCaller(params ?? {});
  }

  /**
   * Embeds a single document as input and returns a promise that resolves to a
   * vector for the query document.
   * @param input A single document to be embedded.
   * @param options Additional options for embedding.
   * @returns A promise that resolves to a vector for the query document.
   */
  async invoke(input: string, options?: CallOptions): Promise<EmbedResult> {
    const result: EmbedResult = await this.embed(
      input,
      options,
      options?.callbacks
    );

    return result;
  }

  /**
   * Provides the core logic to interface with the language model, handling both
   * cached and uncached embeddings.
   * @param document A string.
   * @param options Optional call options.
   * @param callbacks Optional callbacks.
   * @returns The result from the language model embeddings.
   */
  async embed(
    document: string,
    options?: CallOptions,
    callbacks?: any
  ): Promise<EmbedResult> {
    if (Array.isArray(document) || !(typeof document === 'string')) {
      throw new Error("Argument 'document' must be string");
    }

    const [callableOptions, serializedCallOptions] =
      this._splitCallableOptionsFromCallOptions(options);
    callableOptions.callbacks = callableOptions.callbacks ?? callbacks;

    const llmStrKey: string = this._getLLMStrKey(
      serializedCallOptions as CallOptions
    );

    let embedding: number[] | null | undefined = await this.cache?.lookup([
      document,
      llmStrKey,
    ]);

    let embedOutput = {};
    if (embedding === null || embedding === undefined) {
      const embedResult: EmbedResult = await this._embedUncached(
        document,
        serializedCallOptions
      );
      await this.cache?.update([document, llmStrKey], embedResult.embedding);

      embedding = embedResult.embedding;
      embedOutput = embedResult.embedOutput ?? {};
    }

    return { embedding, embedOutput };
  }

  /**
   * An abstract method that takes a single document as input and returns a
   * promise that resolves to a vector for the query document.
   * @param document A single document to be embedded.
   * @param options Additional options for embeddings.
   * @returns A promise that resolves to a vector for the query document.
   * @internal
   */
  abstract _embed(
    document: string,
    options: this['SerializedCallOptions']
  ): Promise<EmbedResult>;

  /**
   * Handles uncached document and calls the `_embed` method.
   * @param document A document.
   * @param serializedCallOptions Serialized call options.
   * @returns The result from the language model embeddings.
   * @internal
   */
  protected async _embedUncached(
    document: string,
    serializedCallOptions: this['SerializedCallOptions']
  ): Promise<EmbedResult> {
    let output: EmbedResult;

    /*eslint no-useless-catch: "warn"*/
    try {
      output = await this._embed(document, serializedCallOptions);
    } catch (e) {
      throw e;
    }

    return output;
  }

  abstract getParams(
    options?: this['SerializedCallOptions']
  ): Record<string, unknown>;

  /** @hidden */
  protected _splitCallableOptionsFromCallOptions(
    options: Partial<CallOptions> = {}
  ): [CallableConfig, this['SerializedCallOptions']] {
    const callableOptions: CallableConfig = {
      name: options.name,
      tags: options.tags,
      metadata: options.metadata,
      callbacks: options.callbacks,
    };

    const callOptionsCopy: Partial<CallOptions> = { ...options };
    delete callOptionsCopy.name;
    delete callOptionsCopy.tags;
    delete callOptionsCopy.metadata;
    delete callOptionsCopy.callbacks;

    return [callableOptions, callOptionsCopy as this['SerializedCallOptions']];
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
