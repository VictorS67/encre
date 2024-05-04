import { ChromaClient, Collection} from "chromadb";
import { VectorStore, VectorStoreInput} from "./base";
import { Embeddings } from "../../../embeddings/base";
import { Context} from "../docs/context";
import { CollectionMetadata, Where } from "chromadb/dist/main/types";
import { Metadatas} from "chromadb/dist/main/types";
import * as uuid from "uuid";

export type ChromaLibArgs =
  |{
      client?: ChromaClient;
      numDimensions?: number;
      collectionName?: string;
      filter?: object;
      collectionMetadata?: CollectionMetadata;
    };

export interface ChromaDeleteParams<T> {
    ids?: string[];
    filter?: T;
}


export class Chroma extends VectorStore {
    declare FilterType: Where;
    client ?: ChromaClient;
    collection ?: Collection;
    collectionMetadata?: CollectionMetadata;
    collectionName ?: string;
    filter?: object;
    numDimensions?: number;

    _namespace: string[];

    _vectorstoreType(): string {
        return "chroma";
    }


    constructor(embeddings: Embeddings, args: ChromaLibArgs) {
        super(embeddings, args);
        this.numDimensions = args.numDimensions;
        this.embeddings = embeddings;
        this.collectionName = ensureCollectionName(args.collectionName);
        this.collectionMetadata = args.collectionMetadata;
        this.filter = args.filter;
        this.client = args.client;
        this.filter = args.filter;
    }

    async ensureCollection(): Promise<Collection> {
        if (!this.collection) {
          if (!this.client || !this.collectionName) {
            throw new Error('Chroma client or chroma name is not defined.');
          }
      
          try {
            this.collection = await this.client.getOrCreateCollection({
              name: this.collectionName,
              ...(this.collectionMetadata && { metadata: this.collectionMetadata }),
            });
          } catch (err) {
            throw new Error(`Chroma getOrCreateCollection error: ${err}`);
          }
        }
      
        return this.collection;
    }

    async addContexts(contexts: Context[], options?: { ids?: string[] }) {
        const texts = contexts.map(({ pageContent }) => pageContent);
        return this.addVectors(
          await this.embeddings.embedDocuments(texts),
          contexts,
          options
        );
      }

      async addVectors(
        vectors: number[][],
        contexts: Context[],
        options?: { ids?: string[] }
      ) {
        if (vectors.length === 0) {
          return [];
        }
        if (this.numDimensions === undefined) {
          this.numDimensions = vectors[0].length;
        }
        if (vectors.length !== contexts.length) {
          throw new Error(`Vectors and metadatas must have the same length`);
        }
        if (vectors[0].length !== this.numDimensions) {
          throw new Error(
            `Vectors must have the same length as the number of dimensions (${this.numDimensions})`
          );
        }
    
        const documentIds =
          options?.ids ?? Array.from({ length: vectors.length }, () => uuid.v1());
        const collection = await this.ensureCollection();
    
        const mappedMetadatas = contexts.map(({ metadata }) => {
          let locFrom;
          let locTo;
    
          if (metadata?.loc) {
            const loc = metadata.loc as { lines?: { from?: number; to?: number } };
            if (loc.lines?.from !== undefined)
              locFrom = loc.lines.from;
            if (loc.lines?.to !== undefined) locTo = loc.lines.to;
          }
    
          const newMetadata: Context["metadata"] = {
            ...metadata,
            ...(locFrom !== undefined && { locFrom }),
            ...(locTo !== undefined && { locTo }),
          };
    
          if (newMetadata.loc) delete newMetadata.loc;
    
          return newMetadata;
        });
    
        await collection.upsert({
            ids: documentIds,
            embeddings: vectors,
            metadatas: mappedMetadatas as Metadatas,
            documents: contexts.map(({ pageContent }) => pageContent),
        });
        return documentIds;
      }

    async delete(params: ChromaDeleteParams<this["FilterType"]>): Promise<void> {
        const collection = await this.ensureCollection();
        if (Array.isArray(params.ids)) {
          await collection.delete({ ids: params.ids });
        } else if (params.filter) {
          await collection.delete({
            where: { ...params.filter },
          });
        } else {
          throw new Error(`You must provide one of "ids or "filter".`);
        }
      }

    async similaritySearchVectorWithScore(
        query: number[],
        k: number,
        filter?: this["FilterType"]
      ) {
        if (filter && this.filter) {
          throw new Error("cannot provide both `filter` and `this.filter`");
        }
        const _filter = filter ?? this.filter;
    
        const collection = await this.ensureCollection();
    
        // similaritySearchVectorWithScore supports one query vector at a time
        // chroma supports multiple query vectors at a time
        const result = await collection.query({
          queryEmbeddings: query,
          nResults: k,
          where: { ..._filter },
        });
    
        const { ids, distances, documents, metadatas } = result;
        if (!ids || !distances || !documents || !metadatas) {
          return [];
        }
        // get the result data from the first and only query vector
        const [firstIds] = ids;
        const [firstDistances] = distances;
        const [firstDocuments] = documents;
        const [firstMetadatas] = metadatas;
    
        const results: [Context, number][] = [];
        for (let i = 0; i < firstIds.length; i += 1) {
          let metadata: Context["metadata"] = firstMetadatas?.[i] ?? {};
    
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
    
          results.push([
            new Context({
              pageContent: firstDocuments?.[i] ?? "",
              metadata,
            }),
            firstDistances[i],
          ]);
        }
        return results;
      }

    static async fromTexts(
        texts: string[],
        metadatas: object[] | object,
        embeddings: Embeddings,
        ChromaConfig: ChromaLibArgs
      ): Promise<Chroma> {
        const docs: Context[] = [];
        for (let i = 0; i < texts.length; i += 1) {
          const metadata = Array.isArray(metadatas) ? metadatas[i] : metadatas;
          const newDoc = new Context({
            pageContent: texts[i],
            metadata,
          });
          docs.push(newDoc);
        }
        return this.fromContexts(docs, embeddings, ChromaConfig);
      }

    static async fromContexts(
        docs: Context[],
        embeddings: Embeddings,
        ChromaConfig: ChromaLibArgs
      ): Promise<Chroma> {
        const instance = new this(embeddings, ChromaConfig);
        await instance.addContexts(docs);
        return instance;
      }

    static async fromExistingCollection(
        embeddings: Embeddings,
        ChromaConfig: ChromaLibArgs
      ): Promise<Chroma> {
        const instance = new this(embeddings, ChromaConfig);
        await instance.ensureCollection();
        return instance;
    }

    invoke(input: ChromaInput): Promise<unknown> {
        const { command, inputs } = input;
        try{
          switch (command) {
            case "addContexts":
              // Run function for command A
              return this.addContexts(inputs.context, inputs.options);
            case "addVectors":
              // Run function for command B
              return this.addVectors(inputs.vectors, inputs.contexts, inputs.options);
            case "delete":
              // Run function for command C
              return this.delete(inputs.params);
            case "similaritySearchVectorWithScore":
              // Run function for command D
              return this.similaritySearchVectorWithScore(inputs.query, inputs.k);
            default:
              throw new Error("Invalid command");
          }

        }catch(error) {
          // Handle the error gracefully
          console.error("An error occurred:", error);
          // Optionally, you can throw the error again to propagate it
          throw error;
        }
          
    }
}


function ensureCollectionName(collectionName?: string) {
    if (!collectionName) {
        return `encre-${uuid.v4()}`;
    }
    return collectionName;
}

export type ChromaInput = VectorStoreInput & {
    command: "addContexts" | "addVectors" | "delete" | "similaritySearchVectorWithScore" | "fromTexts" | "fromContexts" | "fromExistingCollection";
    inputs: {
      [key: string]: any;
    };
  };

  const commandToKeyMapping: { [command: string]: string[] } = {
    addContexts: ["contexts", "options"],
    addVectors: ["vectors", "contexts", "options"],
    delete: ["params"],
    similaritySearchVectorWithScore: ["query", "k"],
    fromTexts: ["texts", "metadatas", "embeddings", "ChromaConfig"],
    fromContexts: ["docs", "embeddings", "ChromaConfig"],
    fromExistingCollection: ["embeddings", "ChromaConfig"]
  };
function getAllowedKeyNames(command: string): string[] {
return commandToKeyMapping[command] || [];
}


