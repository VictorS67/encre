import { CallableConfig } from '../../../record/callable.js';
import { BaseEvent, BaseEventParams } from '../../base.js';
import { Context } from '../../input/load/docs/context.js';

/**
 * Base interface for retriever call options, extends the base event parameters.
 */
export interface BaseRetrieverCallOptions extends BaseEventParams {}

/**
 * Base parameters interface for retrievers, extends the base event parameters.
 */
export interface BaseRetrieverParams extends BaseEventParams {}

/**
 * Abstract base class for creating retrievers. This class extends BaseEvent and is designed to retrieve contextual data based on a source input.
 * The retriever uses generic types to handle various types of sources and metadata, and implements custom retrieval logic as defined by subclasses.
 *
 * @template Source The type of the source input for the retriever.
 * @template Metadata The type of metadata that the retrieved contexts will contain.
 * @template CallOptions The specific call options used during retrieval.
 */
export abstract class BaseRetriever<
    Source = unknown,
    Metadata = Record<string, unknown>,
    CallOptions extends BaseRetrieverCallOptions = BaseRetrieverCallOptions,
  >
  extends BaseEvent<Source, Context<Metadata>[], CallOptions>
  implements BaseRetrieverParams
{
  /** @hidden */
  declare SerializedCallOptions: Omit<CallOptions, keyof CallableConfig>;

  _isSerializable = false;

  _eventNamespace(): string[] {
    return ['inference', 'retrieve', this._sourceType(), this._retrieverType()];
  }

  constructor(fields?: BaseRetrieverParams) {
    super(fields ?? {});
  }

  /**
   * Returns the source type handled by the retriever.
   */
  abstract _sourceType(): string;

  /**
   * Returns the specific retriever type.
   */
  abstract _retrieverType(): string;

  /**
   * Invokes the retrieval process. This is a wrapper around the abstract retrieve method,
   * handling standard invocation logic.
   * @param input The input data for retrieval.
   * @param options Optional retrieval options.
   * @returns A promise that resolves to the retrieved contexts.
   */
  async invoke(
    input: Source,
    options?: CallOptions
  ): Promise<Context<Metadata>[]> {
    const result: Context<Metadata>[] = await this.retrieve(
      input,
      options,
      options?.callbacks
    );

    return result;
  }

  /**
   * Retrieves data based on the provided source and options. This method must be implemented by
   * subclasses to provide specific retrieval logic.
   * @param query The source input based on which the retrieval is performed.
   * @param options Retrieval options, potentially including callbacks and other modifiers.
   * @returns A promise resolving to an array of contexts containing the retrieved data and associated metadata.
   */
  abstract retrieve(
    query: Source,
    options?: CallOptions,
    callbacks?: any
  ): Promise<Context<Metadata>[]>;

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
}

/**
 * Interface representing call options specific to text-based retrievers.
 * Extends from `BaseRetrieverCallOptions`, allowing customization of base event parameters.
 */
export interface BaseTextRetrieverCallOptions
  extends BaseRetrieverCallOptions {}

/**
 * Interface representing configuration parameters for initializing a `BaseTextRetriever`.
 * Extends from `BaseRetrieverParams`, incorporating all base event parameters.
 */
export interface BaseTextRetrieverParams extends BaseRetrieverParams {}

/**
 * Abstract class defining a retriever that works with text data. This class provides a framework
 * for implementing specific text retrieval functionalities, such as searching through documents or logs.
 *
 * @template Metadata - Optional metadata type to enrich the retrieval context.
 * @template CallOptions - Configuration options type for retrieval operations.
 */
export abstract class BaseTextRetriever<
    Metadata = Record<string, unknown>,
    CallOptions extends BaseRetrieverCallOptions = BaseRetrieverCallOptions,
  >
  extends BaseRetriever<string, Metadata, CallOptions>
  implements BaseTextRetrieverParams
{
  _sourceType(): string {
    return 'text';
  }

  abstract _retrieve(
    query: string,
    options: this['SerializedCallOptions']
  ): Promise<Context<Metadata>[]>;

  /**
   * Retrieves contextual data based on the given text query.
   * @param query - The text query for which to retrieve context.
   * @param options - Optional parameters and configurations for the retrieval.
   * @returns A promise resolving to an array of contexts matching the query.
   */
  async retrieve(
    query: string,
    options?: CallOptions,
    callbacks?: any
  ): Promise<Context<Metadata>[]> {
    if (Array.isArray(query) || typeof query !== 'string') {
      throw new Error("Argument 'query' must be string");
    }

    const [callableOptions, serializedCallOptions] =
      this._splitCallableOptionsFromCallOptions(options);

    callableOptions.callbacks = callableOptions.callbacks ?? callbacks;

    return this._retrieve(query, serializedCallOptions);
  }
}

/**
 * Interface representing call options specific to embedding-based retrievers.
 * Extends from `BaseRetrieverCallOptions`, supporting customization for operations on embeddings.
 */
export interface BaseEmbeddingRetrieverCallOptions
  extends BaseRetrieverCallOptions {}

/**
 * Interface representing configuration parameters for initializing a `BaseEmbeddingRetriever`.
 * Extends from `BaseRetrieverParams`, encapsulating all necessary base configurations for embedding operations.
 */
export interface BaseEmbeddingRetrieverParams extends BaseRetrieverParams {}

/**
 * Abstract class defining a retriever that operates on numerical embeddings.
 * This class supports functionalities such as searching through embedding spaces,
 * which are commonly used in machine learning models for tasks like similarity search.
 *
 * @template Metadata - Optional metadata type to enrich the retrieval context.
 * @template CallOptions - Configuration options type for retrieval operations.
 */
export abstract class BaseEmbeddingRetriever<
    Metadata = Record<string, unknown>,
    CallOptions extends BaseRetrieverCallOptions = BaseRetrieverCallOptions,
  >
  extends BaseRetriever<number[], Metadata, CallOptions>
  implements BaseTextRetrieverParams
{
  _sourceType(): string {
    return 'embedding';
  }

  /**
   * An abstract method that must be implemented by subclasses of `BaseEmbeddingRetriever`.
   * This method performs the core retrieval logic using numerical embeddings.
   *
   * The retrieval process typically involves comparing the provided query embedding
   * to a database or store of embeddings to find the most relevant or similar items.
   *
   * @param query - An array of numbers representing the query embedding. This embedding is
   *                used to perform operations such as similarity search in an embedding space.
   * @param options - An object representing serialized call options. These options may
   *                  modify how the retrieval process behaves, such as filtering results
   *                  or adjusting the retrieval algorithm's parameters.
   * @returns A promise that resolves to an array of `Context<Metadata>[]`, where each `Context`
   *          object encapsulates information about one of the retrieved items, enriched with
   *          optional metadata.
   */
  abstract _retrieve(
    query: number[],
    options: this['SerializedCallOptions']
  ): Promise<Context<Metadata>[]>;

  /**
   * Retrieves contextual data based on the given numerical embedding query.
   * @param query - The numerical embedding array for which to retrieve context.
   * @param options - Optional parameters and configurations for the retrieval.
   * @returns A promise resolving to an array of contexts matching the embedding query.
   */
  async retrieve(
    query: number[],
    options?: CallOptions,
    callbacks?: any
  ): Promise<Context<Metadata>[]> {
    if (!Array.isArray(query) || typeof query[0] !== 'number') {
      throw new Error("Argument 'query' must be number array");
    }

    const [callableOptions, serializedCallOptions] =
      this._splitCallableOptionsFromCallOptions(options);

    callableOptions.callbacks = callableOptions.callbacks ?? callbacks;

    return this._retrieve(query, serializedCallOptions);
  }
}
