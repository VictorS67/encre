import { Serializable } from '../../../../load/serializable.js';
import { type Context } from '../docs/index.js';

export interface BaseVectorStoreField {}

/**
 * An abstract class representing the basic functionality of a vector store. Vector stores
 * are used to manage and retrieve high-dimensional vector data typically used in search
 * and machine learning applications. This class provides a common interface for adding,
 * deleting, and searching vectors within a store.
 *
 * @extends Serializable Indicates that instances of subclasses can be serialized.
 * @implements {BaseVectorStoreField} A marker interface for additional fields.
 */
export abstract class BaseVectorStore
  extends Serializable
  implements BaseVectorStoreField
{
  /**
   * Defines the filter type used in vector operations. This can be an object or a string,
   * depending on the subclass implementation, to support various filtering strategies.
   */
  declare FilterType: object | string;

  _isSerializable = false;

  _namespace: string[] = [
    'events',
    'input',
    'load',
    'vectorstore',
    this._vectorstoreType(),
  ];

  constructor(fields?: Partial<BaseVectorStoreField>) {
    super(fields);
  }

  /**
   * Returns the type of the vector store.
   */
  abstract _vectorstoreType(): string;

  /**
   * Adds vectors to the store along with their associated context data.
   * @param embeddings An array of numerical arrays representing the vector embeddings to be added.
   * @param context An array of `Context` objects associated with each embedding.
   * @param options Optional parameters for the add operation.
   * @returns {Promise<void>} A promise that resolves when the vectors have been added.
   */
  abstract addVectors(
    embeddings: number[][],
    context: Context[],
    options?: Record<string, unknown>
  ): Promise<void>;

  /**
   * Deletes vectors from the store based on specified parameters.
   * @param params Optional parameters to specify which vectors to delete.
   * @returns {Promise<void>} A promise that resolves when the vectors have been deleted.
   */
  abstract deleteVectors(params?: Record<string, unknown>): Promise<void>;

  /**
   * Performs a similarity search to find vectors closest to the given query vector.
   * @param query A numerical array representing the query vector.
   * @param topK The number of top similar results to return.
   * @param filter Optional filter to apply to the search.
   * @returns {Promise<[Context, number][]>} A promise that resolves to an array of tuples,
   *         each containing a `Context` object and a similarity score.
   */
  abstract similaritySearch(
    query: number[],
    topK: number,
    filter?: this['FilterType']
  ): Promise<[Context, number][]>;

  /**
   * Performs a Max Marginal Relevance (MMR) search to diversify the results of a similarity search.
   * This method helps in retrieving not just the most similar items, but also the most diverse
   * ones from the top results.
   * @param query A numerical array representing the query vector.
   * @param topK The number of top results to consider for diversification.
   * @param lambda A parameter controlling the trade-off between similarity and diversity.
   * @param filter Optional filter to apply during the search.
   * @returns {Promise<[Context, number][]>} A promise that resolves to an array of tuples,
   *         each containing a `Context` object and a relevance score.
   */
  abstract maxMarginalRelevanceSearch(
    query: number[],
    topK: number,
    lambda: number,
    filter?: this['FilterType']
  ): Promise<[Context, number][]>;
}
