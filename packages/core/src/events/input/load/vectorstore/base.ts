import type { Embeddings } from "../../../embeddings/base.js";
import type { Context } from "../docs/context.js";
import { BaseRetriever, BaseRetrieverInput } from "./baseretriever.js";
import { Callable, CallableConfig} from "../../../../record/callable.js";

type AddContextOptions = Record<string, any>;

export type MaxMarginalRelevanceSearchOptions<FilterType> = {
  k: number;
  fetchK?: number;
  lambda?: number;
  filter?: FilterType;
};


export type VectorStoreRetrieverMMRSearchKwargs = {
  fetchK?: number;
  lambda?: number;
};


export type VectorStoreRetrieverInput<V extends VectorStore> =
  BaseRetrieverInput &
    (
      | {
          vectorStore: V;
          k?: number;
          filter?: V["FilterType"];
          searchType?: "similarity";
        }
      | {
          vectorStore: V;
          k?: number;
          filter?: V["FilterType"];
          searchType: "mmr";
          searchKwargs?: VectorStoreRetrieverMMRSearchKwargs;
        }
    );


export class VectorStoreRetriever<V extends VectorStore = VectorStore> extends BaseRetriever {
    _namespace: string[];
  
    vectorStore: V;
  
    k = 4;
  
    searchType = "similarity";
  
    searchKwargs?: VectorStoreRetrieverMMRSearchKwargs;
  
    filter?: V["FilterType"];
  
    _vectorstoreType(): string {
      return this.vectorStore._vectorstoreType();
    }
  
    constructor(fields: VectorStoreRetrieverInput<V>) {
      super(fields);
      this.vectorStore = fields.vectorStore;
      this.k = fields.k ?? this.k;
      this.searchType = fields.searchType ?? this.searchType;
      this.filter = fields.filter;
      if (fields.searchType === "mmr") {
        this.searchKwargs = fields.searchKwargs;
      }
    }
  
    async _getRelevantContexts(
      query: string,
    ): Promise<Context[]> {
      if (this.searchType === "mmr") {
        if (typeof this.vectorStore.maxMarginalRelevanceSearch !== "function") {
          throw new Error(
            `The vector store backing this retriever, ${this._vectorstoreType()} does not support max marginal relevance search.`
          );
        }
        return this.vectorStore.maxMarginalRelevanceSearch(query,{k: this.k,filter: this.filter,...this.searchKwargs}, undefined);
      }
      return this.vectorStore.similaritySearch(
        query,
        this.k,
        this.filter,
      );
    }
  
    async addContexts(
      documents: Context[],
      options?: AddContextOptions
    ): Promise<string[] | void> {
      return this.vectorStore.addContexts(documents, options);
    }
}

export abstract class VectorStore extends Callable {
  declare FilterType: object | string;

  lc_namespace = ["Encre", "vectorstores", this._vectorstoreType()];

  embeddings: Embeddings;

  constructor(embeddings: Embeddings, dbConfig: Record<string, any>) {
    super(dbConfig);
    this.embeddings = embeddings;
  }

  abstract _vectorstoreType(): string;

  abstract addVectors(
    vectors: number[][],
    contexts: Context[],
    options?: AddContextOptions
  ): Promise<string[] | void>;

  abstract addContexts(
    context: Context[],
    options?: AddContextOptions
  ): Promise<string[] | void>;

  async delete(_params?: Record<string, any>): Promise<void> {
    throw new Error("Not implemented.");
  }

  abstract similaritySearchVectorWithScore(
    query: number[],
    k: number,
    filter?: this["FilterType"]
  ): Promise<[Context, number][]>;

  async similaritySearch(
    query: string,
    k = 4,
    filter: this["FilterType"] | undefined = undefined,
    _callbacks: any | undefined = undefined 
  ): Promise<Context[]> {
    const results = await this.similaritySearchVectorWithScore(
      await this.embeddings.embedQuery(query),
      k,
      filter
    );
    return results.map((result) => result[0]);
  }

  async similaritySearchWithScore(
    query: string,
    k = 4,
    filter: this["FilterType"] | undefined = undefined,
    _callbacks: any | undefined = undefined 
  ): Promise<[Context, number][]> {
    return this.similaritySearchVectorWithScore(
      await this.embeddings.embedQuery(query),
      k,
      filter
    );
  }

  async maxMarginalRelevanceSearch?(
    query: string,
    options: MaxMarginalRelevanceSearchOptions<this["FilterType"]>,
    _callbacks: any | undefined
  ): Promise<Context[]>;

  static fromTexts(
    _texts: string[],
    _metadatas: object[] | object,
    _embeddings: Embeddings,
    _dbConfig: Record<string, any>
  ): Promise<VectorStore> {
    throw new Error(
      "the vectorstore implementation you are using forgot to override this, please report a bug"
    );
  }

  static fromContexts(
    _context: Context[],
    _embeddings: Embeddings,
    _dbConfig: Record<string, any>
  ): Promise<VectorStore> {
    throw new Error(
      "the vectorstore implementation you are using forgot to override this, please report a bug"
    );
  }

  asRetriever(
    kOrFields?: number | Partial<VectorStoreRetrieverInput<this>>,
    filter?: this["FilterType"],
    callbacks?: any,
    tags?: string[],
    metadata?: Record<string, unknown>,
    verbose?: boolean
  ): VectorStoreRetriever<this> {
    if (typeof kOrFields === "number") {
      return new VectorStoreRetriever({
        vectorStore: this,
        k: kOrFields,
        filter,
        tags: [...(tags ?? []), this._vectorstoreType()],
        metadata,
        verbose,
        callbacks,
      });
    } else {
      const params = {
        vectorStore: this,
        k: kOrFields?.k,
        filter: kOrFields?.filter,
        tags: [...(kOrFields?.tags ?? []), this._vectorstoreType()],
        metadata: kOrFields?.metadata,
        verbose: kOrFields?.verbose,
        callbacks: kOrFields?.callbacks,
        searchType: kOrFields?.searchType,
      };
      if (kOrFields?.searchType === "mmr") {
        return new VectorStoreRetriever({
          ...params,
          searchKwargs: kOrFields.searchKwargs,
        });
      }
      return new VectorStoreRetriever({ ...params });
    }
  }

  abstract invoke(
    input: VectorStoreInput,
  ): Promise<unknown>;

  
}

export type VectorStoreInput = {
  command?: string;
  inputs?: { [key: string]: any };
};