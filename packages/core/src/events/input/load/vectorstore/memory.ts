import { similarity as mlDistanceSimilarity } from 'ml-distance';
import { maximalMarginalRelevance } from '../../../../utils/math.js';
import { getRecordId } from '../../../../utils/nanoid.js';

import { Context } from '../docs/context.js';
import { BaseVectorStore, BaseVectorStoreField } from './base.js';

export interface MemoryVectorStoreField extends BaseVectorStoreField {
  vectors: Vector[];

  similarity: typeof mlDistanceSimilarity.cosine;

  filter?: MemoryVectorStoreFilterType;
}

export interface MemoryDeleteParams<T> {
  ids?: string[];
  filter?: T;
}

/**
 * A Vector includes the content (text), the corresponding
 * embedding (vector), and any associated metadata.
 */
export type Vector = {
  id: string;

  content: string;

  embedding: number[];

  metadata: Record<string, unknown>;
};

export type MemoryVectorStoreFilterType = {
  filterFunc?: (context: Context) => Promise<boolean>;
  includeEmbeddings?: boolean;
};

export class MemoryVectorStore
  extends BaseVectorStore
  implements MemoryVectorStoreField
{
  declare FilterType: MemoryVectorStoreFilterType;

  _isSerializable = true;

  vectors: Vector[];

  similarity: typeof mlDistanceSimilarity.cosine;

  filter?: this['FilterType'];

  _vectorstoreType(): string {
    return 'memory';
  }

  constructor(fields?: Partial<MemoryVectorStoreField>) {
    super(fields);

    this.vectors = fields?.vectors ?? [];
    this.similarity = fields?.similarity ?? mlDistanceSimilarity.cosine;
    this.filter = fields?.filter;
  }

  async addVectors(
    embeddings: number[][],
    context: Context[],
    options?: { ids?: string[] }
  ): Promise<void> {
    if (embeddings.length === 0) {
      return;
    }

    if (embeddings.length !== context.length) {
      throw new Error(
        'Memory addVectors: unmatched # of embeddings and # of contexts'
      );
    }

    let ids: string[] = options?.ids ?? [];
    if (ids.length > 0 && ids.length > embeddings.length) {
      console.warn(
        'Memory addVectors: # of ids is larger than # of embeddings. Now truncate last few ids'
      );

      ids = ids.slice(0, embeddings.length);
    } else if (ids.length > 0 && ids.length < embeddings.length) {
      console.warn(
        'Memory addVectors: # of ids is less than # of embeddings. Now pad last few ids with some random ids'
      );

      const paddingArray = Array.from(
        { length: embeddings.length - ids.length },
        () => getRecordId()
      );
      ids = ids.concat(paddingArray);
    } else if (ids.length === 0) {
      ids = Array.from({ length: embeddings.length }, () => getRecordId());
    }

    const newVectors: Vector[] = embeddings.map((embedding, index) => ({
      id: ids[index],
      content: context[index].pageContent,
      embedding,
      metadata: context[index].metadata,
    }));

    this.vectors = this.vectors.concat(newVectors);
  }

  async deleteVectors(
    params?: MemoryDeleteParams<this['FilterType']>
  ): Promise<void> {
    if (params?.ids || params?.filter) {
      let filteredVectors: Vector[] = this.vectors;

      if (params?.filter) {
        const _filter = params?.filter;

        const filterFunc = async (vector: Vector) => {
          if (!_filter.filterFunc) {
            return true;
          }

          const context = new Context({
            pageContent: vector.content,
            metadata: vector.metadata,
          });

          return _filter.filterFunc(context);
        };

        filteredVectors = filteredVectors.filter(filterFunc);
      }

      if (params?.ids) {
        const _ids: string[] = params?.ids ?? [];

        filteredVectors = filteredVectors.filter((v) => _ids.includes(v.id));
      }

      const vectorIdsToDelete: string[] = filteredVectors.map((v) => v.id);

      this.vectors = this.vectors.filter(
        (v) => !vectorIdsToDelete.includes(v.id)
      );
    } else {
      throw new Error(
        'Chroma deleteVectors: must provide either \'ids\' or \'filter\''
      );
    }
  }

  async similaritySearch(
    query: number[],
    topK: number,
    filter?: this['FilterType']
  ): Promise<[Context, number][]> {
    const _filter = filter ?? this.filter;

    const filterFunc = async (vector: Vector) => {
      if (!_filter?.filterFunc) {
        return true;
      }

      const context = new Context({
        pageContent: vector.content,
        metadata: vector.metadata,
      });

      return _filter.filterFunc(context);
    };

    const filteredVectors = this.vectors.filter(filterFunc);

    const searches = filteredVectors
      .map((vector, index) => ({
        similarity: this.similarity(query, vector.embedding),
        index,
      }))
      .sort((a, b) => (a.similarity > b.similarity ? -1 : 0))
      .slice(0, topK);

    return searches.map((search) => {
      const context = new Context({
        pageContent: filteredVectors[search.index].content,
        metadata: filteredVectors[search.index].metadata,
      });

      if (_filter?.includeEmbeddings) {
        context.metadata.embedding = filteredVectors[search.index].embedding;
      }

      const score = search.similarity;

      return [context, score];
    });
  }

  async maxMarginalRelevanceSearch(
    query: number[],
    topK: number,
    lambda: number,
    filter?: this['FilterType'] | undefined
  ): Promise<[Context, number][]> {
    const _filter = filter ?? this.filter;
    const includeEmbeddingsFlag = _filter?.includeEmbeddings || false;

    const searches = await this.similaritySearch(query, topK, {
      ..._filter,
      includeEmbeddings: true,
    });

    const embeddings = searches.map(
      (s) => s[0].metadata.embedding
    ) as number[][];

    const [mmrIndexes, mmrSimilarities] = maximalMarginalRelevance(
      query,
      embeddings,
      lambda,
      topK
    );

    return mmrIndexes.map((index) => {
      const context = searches[index][0];
      const similarity = mmrSimilarities[index];

      if (!includeEmbeddingsFlag) {
        delete context.metadata.embedding;
      }

      return [context, similarity];
    });
  }
}
