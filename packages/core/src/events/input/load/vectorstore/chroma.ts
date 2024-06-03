import {
  ChromaClient,
  Collection as ChromaCollection,
  CollectionMetadata as ChromaCollectionMetadata,
  Metadata as ChromaMetadata,
  IncludeEnum,
  QueryResponse,
  Where,
} from 'chromadb';
import { v4 as uuid } from 'uuid';

import { maximalMarginalRelevance } from '../../../../utils/math.js';
import { Context } from '../docs/context.js';
import { BaseVectorStore, BaseVectorStoreField } from './base.js';

/**
 * Defines the fields for the ChromaVectorStore class.
 *
 * @example
 * ```typescript
 * const vectorStoreConfig: ChromaVectorStoreField = {
 *   url: 'my-chroma-instance-url',
 *   numDimensions: 128,
 *   collectionName: 'myCollection',
 *   collectionMetadata: { createdBy: 'Data Science Team' },
 *   filter: {
 *     where: { field: 'category', value: 'technology', operation: 'EQUAL' },
 *     includeEmbeddings: true
 *   }
 * };
 * ```
 */
export interface ChromaVectorStoreField extends BaseVectorStoreField {
  /**
   * Base URL of the Chroma backend service.
   */
  url: string;

  /**
   * Number of dimensions for each embedding vector.
   */
  numDimensions?: number;

  /**
   * Name of the collection within Chroma where vectors are stored.
   */
  collectionName?: string;

  /**
   * Additional metadata related to the collection.
   */
  collectionMetadata?: ChromaCollectionMetadata;

  /**
   * Optional filter settings that can be applied during search operations.
   */
  filter?: ChromaVectorStoreFilterType;
}

/**
 * Specifies the parameters for deleting vectors from a Chroma vector store.
 *
 * @example
 * ```typescript
 * // Example of deleting specific vectors by IDs
 * const deleteParams: ChromaDeleteParams<ChromaVectorStoreFilterType> = {
 *   ids: ['id1', 'id2']
 * };
 *
 * // Example of deleting vectors by a custom filter
 * const deleteParamsWithFilter: ChromaDeleteParams<ChromaVectorStoreFilterType> = {
 *   filter: {
 *     where: { field: 'age', value: 25, operation: 'LESS_THAN' }
 *   }
 * };
 * ```
 */
export interface ChromaDeleteParams<T> {
  /**
   * Optional. Array of vector IDs to delete.
   */
  ids?: string[];

  /**
   * Optional. A filter defining which vectors to delete based on their metadata and content.
   */
  filter?: T;
}

/**
 * Defines the filter type used in ChromaVectorStore operations to refine search and deletion operations.
 *
 * @example
 * ```typescript
 * // Example filter to include embeddings and filter based on metadata
 * const filter: ChromaVectorStoreFilterType = {
 *   where: { field: 'status', value: 'active', operation: 'EQUAL' },
 *   includeEmbeddings: true
 * };
 * ```
 */
export type ChromaVectorStoreFilterType = {
  /**
   * Optional. Specifies conditions used to filter vectors based on their metadata.
   */
  where?: Where;

  /**
   * Optional. Indicates whether to include vector embeddings in the results.
   */
  includeEmbeddings?: boolean;
};

/**
 * The ChromaVectorStore class provides an in-memory vector store that integrates
 * with a Chroma backend service for storing and retrieving vector embeddings associated with content.
 * It supports operations like adding vectors, deleting vectors based on IDs or filters, and conducting
 * similarity and maximal marginal relevance searches.
 *
 * @example
 * ```typescript
 * // Instantiate the ChromaVectorStore
 * const vectorStore = new ChromaVectorStore({
 *   url: 'my-chroma-instance-url',
 *   collectionName: 'myVectorCollection'
 * });
 *
 * // Example embeddings and associated contexts
 * const embeddings = [
 *   [0.1, 0.2, 0.3],
 *   [0.4, 0.5, 0.6]
 * ];
 * const contexts = [
 *   new Context({ pageContent: "Content about AI", metadata: { topic: "AI" }}),
 *   new Context({ pageContent: "Content about ML", metadata: { topic: "ML" }})
 * ];
 *
 * // Add vectors to the store
 * await vectorStore.addVectors(embeddings, contexts);
 *
 * // Perform a similarity search
 * const queryEmbedding = [0.15, 0.25, 0.35];
 * const topK = 1;
 * const similarityResults = await vectorStore.similaritySearch(queryEmbedding, topK);
 *
 * // Display the results
 * console.log("Similarity Search Results:", similarityResults.map(r => ({
 *   content: r[0].pageContent,
 *   similarityScore: r[1]
 * })));
 *
 * // Optionally, delete vectors
 * await vectorStore.deleteVectors({ ids: [similarityResults[0][0].id] });
 * ```
 */
export class ChromaVectorStore
  extends BaseVectorStore
  implements ChromaVectorStoreField
{
  declare FilterType: ChromaVectorStoreFilterType;

  _isSerializable = true;

  /**
   * Base URL of the Chroma backend service.
   */
  url: string;

  /**
   * Number of dimensions for each embedding vector.
   */
  numDimensions?: number | undefined;

  /**
   * Name of the collection within Chroma where vectors are stored.
   */
  collectionName?: string | undefined;

  /**
   * Additional metadata related to the collection.
   */
  collectionMetadata?: ChromaCollectionMetadata | undefined;

  /**
   * Optional filter settings that can be applied during search operations.
   */
  filter?: ChromaVectorStoreFilterType | undefined;

  /**
   * Chroma API Client.
   * @internal
   */
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
        () => uuid()
      );
      ids = ids.concat(paddingArray);
    } else if (ids.length === 0) {
      ids = Array.from({ length: embeddings.length }, () => uuid());
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
        "Chroma deleteVectors: must provide either 'ids' or 'filter'"
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
    const include: IncludeEnum[] = [
      IncludeEnum.Documents,
      IncludeEnum.Embeddings,
      IncludeEnum.Distances,
      IncludeEnum.Metadatas,
    ];

    let result: QueryResponse;
    if (_filter?.where) {
      result = await collection.query({
        queryEmbeddings: query,
        nResults: topK,
        where: { ..._filter.where },
        include,
      });
    } else {
      result = await collection.query({
        queryEmbeddings: query,
        nResults: topK,
        include,
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

  /**
   * Retrieves a collection from the Chroma backend. If the collection does not exist, it creates a new one using
   * the specified collection name and optional metadata. This method ensures that the required collection is available
   * for storing and retrieving vector embeddings.
   *
   * @returns A promise that resolves to the ChromaCollection object, allowing for further interaction with the collection.
   * @throws An error if the Chroma service fails to create or retrieve the collection.
   * @internal
   * @example
   * ```typescript
   * const vectorStore = new ChromaVectorStore({
   *   url: 'my-chroma-instance-url',
   *   collectionName: 'myVectorCollection'
   * });
   * try {
   *   const collection = await vectorStore._getCollection();
   *   console.log('Collection ready for use:', collection);
   * } catch (error) {
   *   console.error('Failed to access or create the collection:', error);
   * }
   * ```
   */
  async _getCollection(): Promise<ChromaCollection> {
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

  /**
   * Generates a unique collection name based on the `collectionName` field. If `collectionName` is not set,
   * it generates a random UUID as the collection name. This method ensures a consistent naming strategy for
   * collections used within the Chroma service.
   *
   * @returns The name of the collection as a string.
   * @internal
   */
  private _getCollectionName(): string {
    if (!this.collectionName) {
      return `encre-chroma-${uuid()}`;
    }

    return this.collectionName;
  }
}
