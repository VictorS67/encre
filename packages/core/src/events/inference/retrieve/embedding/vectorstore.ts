import { Context } from '../../../input/load/docs/context.js';
import { BaseVectorStore } from '../../../input/load/vectorstore/base.js';
import {
  BaseEmbeddingRetriever,
  BaseEmbeddingRetrieverParams,
} from '../base.js';
import {
  MaxMarginalRelevanceSearch,
  SimilaritySearch,
  VectorStoreRetrieverSearch,
} from './index.js';

export interface VectorStoreRetrieverParams<
  V extends BaseVectorStore = BaseVectorStore,
> extends BaseEmbeddingRetrieverParams {
  vectorstore: BaseVectorStore;
  filter?: V['FilterType'];
  search?: VectorStoreRetrieverSearch;
}

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

  vectorstore: BaseVectorStore;

  filter?: V['FilterType'];

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
