import {
  ChromaClient,
  Collection as ChromaCollection,
  CollectionMetadata as ChromaCollectionMetadata,
  Metadata as ChromaMetadata,
  QueryResponse,
  Where,
} from 'chromadb';

import { maximalMarginalRelevance } from '../../../../utils/math.js';
import { getRecordId } from '../../../../utils/nanoid.js';
import { Context } from '../docs/context.js';
import { BaseVectorStore, BaseVectorStoreField } from './base.js';

export interface ChromaVectorStoreField extends BaseVectorStoreField {
  url: string;

  numDimensions?: number;

  collectionName?: string;

  collectionMetadata?: ChromaCollectionMetadata;

  filter?: ChromaVectorStoreFilterType;
}

export interface ChromaDeleteParams<T> {
  ids?: string[];
  filter?: T;
}

export type ChromaVectorStoreFilterType = {
  where?: Where;
  includeEmbeddings?: boolean;
};

export class ChromaVectorStore
  extends BaseVectorStore
  implements ChromaVectorStoreField
{
  declare FilterType: ChromaVectorStoreFilterType;

  _isSerializable = true;

  url: string;

  numDimensions?: number | undefined;

  collectionName?: string | undefined;

  collectionMetadata?: ChromaCollectionMetadata | undefined;

  filter?: ChromaVectorStoreFilterType | undefined;

  private _client: ChromaClient;

  _vectorstoreType(): string {
    return 'chroma';
  }

  constructor(fields?: Partial<ChromaVectorStoreField>) {
    super(fields);

    this.url = fields?.url ?? 'http://localhost:8000';
    this.numDimensions = fields?.numDimensions;
    this.collectionName = fields?.collectionName;
    this.collectionMetadata = fields?.collectionMetadata;
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
        'Chroma addVectors: unmatched # of embeddings and # of contexts'
      );
    }

    if (this.numDimensions !== embeddings[0].length) {
      console.warn(
        `Chroma addVectors: unmatched # of dimensions and # of embeddings. Now change dimensions to ${embeddings[0].length}`
      );

      this.numDimensions = embeddings[0].length;
    }

    let ids: string[] = options?.ids ?? [];
    if (ids.length > 0 && ids.length > embeddings.length) {
      console.warn(
        'Chroma addVectors: # of ids is larger than # of embeddings. Now truncate last few ids'
      );

      ids = ids.slice(0, embeddings.length);
    } else if (ids.length > 0 && ids.length < embeddings.length) {
      console.warn(
        'Chroma addVectors: # of ids is less than # of embeddings. Now pad last few ids with some random ids'
      );

      const paddingArray = Array.from(
        { length: embeddings.length - ids.length },
        () => getRecordId()
      );
      ids = ids.concat(paddingArray);
    } else if (ids.length === 0) {
      ids = Array.from({ length: embeddings.length }, () => getRecordId());
    }

    const collection: ChromaCollection = await this._getCollection();

    const metadatas = context.map(({ metadata }) => {
      let locFrom: number | undefined;
      let locTo: number | undefined;

      if (
        metadata?.loc &&
        typeof metadata.loc === 'object' &&
        metadata.loc !== null &&
        !Array.isArray(metadata.loc) &&
        'lines' in metadata.loc
      ) {
        if (
          typeof metadata.loc.lines === 'object' &&
          metadata.loc.lines !== null &&
          !Array.isArray(metadata.loc.lines) &&
          'from' in metadata.loc.lines &&
          typeof metadata.loc.lines.from === 'number'
        ) {
          locFrom = metadata.loc.lines.from;
        }

        if (
          typeof metadata.loc.lines === 'object' &&
          metadata.loc.lines !== null &&
          !Array.isArray(metadata.loc.lines) &&
          'to' in metadata.loc.lines &&
          typeof metadata.loc.lines.to === 'number'
        ) {
          locTo = metadata.loc.lines.to;
        }
      }

      const newMetadata: Context['metadata'] = {
        ...metadata,
        ...(locFrom !== undefined && { locFrom }),
        ...(locTo !== undefined && { locTo }),
      };

      if (newMetadata.loc) {
        delete newMetadata.loc;
      }

      return newMetadata;
    }) as ChromaMetadata[];

    await collection.upsert({
      ids,
      embeddings,
      metadatas,
      documents: context.map(({ pageContent }) => pageContent),
    });
  }

  async deleteVectors(params?: ChromaDeleteParams<this['FilterType']>) {
    const collection = await this._getCollection();

    if (params?.ids && params?.filter?.where) {
      await collection.delete({
        ids: params.ids,
        where: { ...params.filter.where },
      });
    } else if (params?.ids) {
      await collection.delete({ ids: params.ids });
    } else if (params?.filter?.where) {
      await collection.delete({
        where: { ...params.filter.where },
      });
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
    const _filter: this['FilterType'] | undefined = filter ?? this.filter;

    const collection: ChromaCollection = await this._getCollection();

    let result: QueryResponse;
    if (_filter?.where) {
      result = await collection.query({
        queryEmbeddings: query,
        nResults: topK,
        where: { ..._filter.where },
      });
    } else {
      result = await collection.query({
        queryEmbeddings: query,
        nResults: topK,
      });
    }

    const { ids, distances, embeddings, documents, metadatas } = result;
    if (!ids || !distances || !embeddings || !documents || !metadatas) {
      return [];
    }

    const [firstIds] = ids;
    const [firstDistances] = distances;
    const [firstEmbeddings] = embeddings;
    const [firstDocuments] = documents;
    const [firstMetadatas] = metadatas;

    const results: [Context, number][] = [];
    for (let i = 0; i < firstIds.length; i++) {
      let metadata: Context['metadata'] = firstMetadatas?.[i] ?? {};

      if (metadata.locFrom && metadata.locTo) {
        metadata = {
          ...metadata,
          loc: {
            lines: {
              from: metadata.locFrom,
              to: metadata.locTo,
            },
          },
        };

        delete metadata.locFrom;
        delete metadata.locTo;
      }

      if (_filter?.includeEmbeddings) {
        metadata.embedding = firstEmbeddings?.[i];
      }

      results.push([
        new Context({
          pageContent: firstDocuments?.[i] ?? '',
          metadata,
        }),
        firstDistances[i],
      ]);
    }

    return results;
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

  private async _getCollection(): Promise<ChromaCollection> {
    if (!this._client) {
      this._client = new ChromaClient({
        path: this.url,
      });
    }

    try {
      const collection: ChromaCollection =
        await this._client.getOrCreateCollection({
          name: this._getCollectionName(),
          ...(this.collectionMetadata && { metadata: this.collectionMetadata }),
        });

      return collection;
    } catch (err) {
      throw new Error(`Chroma failed to getOrCreateCollection: ${err}`);
    }
  }

  private _getCollectionName(): string {
    if (!this.collectionName) {
      return `encre-chroma-${getRecordId()}`;
    }

    return this.collectionName;
  }
}
