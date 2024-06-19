import { type Context } from '../../../input/load/docs/index.js';
import { type BaseVectorStore } from '../../../input/load/vectorstore/index.js';
import {
  BaseEmbeddingRetriever,
  type BaseEmbeddingRetrieverParams,
} from '../base.js';
import {
  type MaxMarginalRelevanceSearch,
  type SimilaritySearch,
  type VectorStoreRetrieverSearch,
} from './index.js';

/**
 * Parameters for initializing a VectorStoreRetriever, specifying the vector store,
 * optional filtering criteria, and search strategy.
 */
export interface VectorStoreRetrieverParams<
  V extends BaseVectorStore = BaseVectorStore,
> extends BaseEmbeddingRetrieverParams {
  /**
   * The vector store used for retrieving vectors.
   */
  vectorstore: BaseVectorStore;

  /**
   * Optional filtering type specific to the vector store.
   */
  filter?: V['FilterType'];

  /**
   * Search strategy to use, can be either similarity search or max marginal
   * relevance (MMR) search.
   */
  search?: VectorStoreRetrieverSearch;
}

/**
 * A retriever that utilizes a vector store to fetch contextually relevant data based
 * on the provided vector query. It supports configurable search strategies such as
 * similarity search and max marginal relevance (MMR).
 *
 * @template V - The type of the vector store, extending from `BaseVectorStore`.
 *
 * @example
 * ```
 * const vectorStore = new MemoryVectorStore();
 * const retriever = new VectorStoreRetriever<MemoryVectorStore>({
 *   vectorstore: vectorStore,
 *   search: {
 *     type: 'similarity',
 *     topK: 5
 *   }
 * });
 *
 * // To retrieve using a vector query
 * const results = await retriever.invoke([0.1, 0.2, 0.3, 0.4]);
 * console.log(results);
 * ```
 */
export class VectorStoreRetriever<V extends BaseVectorStore = BaseVectorStore>
  extends BaseEmbeddingRetriever
  implements VectorStoreRetrieverParams<V>
{
  _isSerializable = true;

  static _name(): string {
    return 'VectorStoreRetriever';
  }

  _retrieverType(): string {
    return 'vectorstore';
  }

  /**
   * The vector store used for retrieving vectors.
   */
  vectorstore: BaseVectorStore;

  /**
   * Optional filtering type specific to the vector store.
   */
  filter?: V['FilterType'];

  /**
   * Search strategy to use, can be either similarity search or max marginal
   * relevance (MMR) search.
   */
  search: VectorStoreRetrieverSearch;

  constructor(fields: VectorStoreRetrieverParams<V>) {
    const _fields = {
      search:
        fields.search?.type === 'mmr'
          ? ({
              type: 'mmr',
              topK: 4,
              lambda: 0.5,
            } as MaxMarginalRelevanceSearch)
          : ({
              type: 'similarity',
              topK: 4,
            } as SimilaritySearch),
      ...fields,
    };

    super(_fields);

    this.vectorstore = _fields.vectorstore;
    this.filter = _fields.filter;
    this.search = _fields.search;
  }

  /**
   * Retrieves contextually relevant data from the vector store based on the provided query vector.
   * The method of retrieval depends on the configured search type, which can be either a similarity search
   * or a max marginal relevance (MMR) search.
   *
   * @param {number[]} query - The query vector used to find similar vectors in the vector store.
   * @param {SerializedCallOptions} options - Additional serialized options that may affect retrieval, such as safety settings.
   * @returns {Promise<Context[]>} A promise that resolves to an array of contexts, which are the retrieved data elements based on the query.
   * @throws {Error} Throws an error if the search type is unsupported, indicating a configuration or implementation issue.
   * @internal
   * @example
   * Using Similarity Search:
   * ```typescript
   * // Assuming 'retriever' is an instance of VectorStoreRetriever and initialized properly
   * const queryVector = [0.1, 0.2, 0.3, 0.4];
   * retriever.search = {
   *   type: 'similarity',
   *   topK: 5
   * };
   * const results = await retriever._retrieve(queryVector, {});
   * console.log(results); // logs contexts similar to the query vector
   * ```
   *
   * Using Max Marginal Relevance (MMR) Search:
   * ```typescript
   * // Setting up the retriever for MMR search
   * retriever.search = {
   *   type: 'mmr',
   *   topK: 5,
   *   lambda: 0.65
   * };
   * const mmrResults = await retriever._retrieve(queryVector, {});
   * console.log(mmrResults); // logs diversified search results balancing similarity and diversity
   * ```
   *
   */
  async _retrieve(
    query: number[],
    options: this['SerializedCallOptions']
  ): Promise<Context[]> {
    if (this.search.type === 'mmr') {
      const searches = await this.vectorstore.maxMarginalRelevanceSearch(
        query,
        this.search.topK ?? 4,
        this.search.lambda ?? 0.5,
        this.filter
      );

      return searches.map((s) => s[0]);
    } else if (this.search.type === 'similarity') {
      const searches = await this.vectorstore.similaritySearch(
        query,
        this.search.topK ?? 4,
        this.filter
      );

      return searches.map((s) => s[0]);
    } else {
      throw new Error(
        `Does not support search type in vector store retriever: ${
          (this.search as any).type
        }`
      );
    }
  }
}
