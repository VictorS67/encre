import { VectorStore, VectorStoreInput } from "../base";
import { Context } from "../../docs/context";
import { Embeddings, EmbeddingsParams } from "../../../../embeddings/base";
import { expect, test, jest } from '@jest/globals';

class TestEmbeddings extends Embeddings{
    async embedDocuments(documents: string[]): Promise<number[][]> {
        const listOfDocuments: number[][]  = [];
        for (const document of documents){
            listOfDocuments.push(await this.embedQuery(document));
        }
        return listOfDocuments;
    }

    async embedQuery(document: string): Promise<number[]> {
        return [Math.random(), Math.random()];
    }
}


export class TestVectorStore extends VectorStore {
  vectors: any[];
  contexts: any[];
  _namespace: string[];
  constructor(embeddings, dbConfig) {
    super(embeddings, dbConfig);
    this.vectors = [];
    this.contexts = [];
  }

  _vectorstoreType() {
    return 'TestVectorStore';
  }

  async addVectors(vectors, contexts, options) {
    for (const vector of vectors) {
        this.vectors.push(vector);
      }
  }

  async addContexts(contexts, options) {
    for (const context of contexts) {
        this.contexts.push(context);
    }
  }

  async similaritySearchVectorWithScore(
    query: number[], // Update the query type to match the vector type used in your implementation
    k: number,
    filter?: this["FilterType"]
  ): Promise<[Context<Record<string, unknown>>, number][]> {
    const context2Metadata: Record<"Context 2", "page1"> = {
      "Context 2": "page1",
    };

    const context2 = new Context({
      pageContent: "Context 2",
      metadata: context2Metadata,
    });

    return [[context2, 0.548]];
  }

  async maxMarginalRelevanceSearch(query, options, callbacks){
    const context1Metadata: Record<"Context 1", "page1"> = {
        "Context 1": "page1",
      };
      
    const context1 = new Context({
        pageContent: "Context 1",
        metadata: context1Metadata,
    });
    return [context1];
  }

  static async fromTexts(texts, metadatas, embeddings, dbConfig) {
    return new TestVectorStore(new TestEmbeddings({}), {})
  }

  static async fromContexts(context, embeddings, dbConfig) {
    return new TestVectorStore(new TestEmbeddings({}), {})
  }

  invoke(input) {
    const { command, inputs } = input;
    try{
        switch (command) {
          case "addContexts":
            // Run function for command A
            return this.addContexts(inputs.contexts, inputs.options);
          case "addVectors":
            // Run function for command B
            return this.addVectors(inputs.vectors, inputs.contexts, inputs.options);
          case "similaritySearchVectorWithScore":
            // Run function for command D
            return this.similaritySearchVectorWithScore(inputs.query, inputs.k);
          case "maxMarginalRelevanceSearch":
            return this.maxMarginalRelevanceSearch(inputs.query, inputs.options, inputs.callbacks);
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


test('invoke running ok and methods run as expected', async () => {
    const context1Metadata: Record<"Context 1", "page1"> = {
        "Context 1": "page1",
      };
      
    const context1 = new Context({
        pageContent: "Context 1",
        metadata: context1Metadata,
    });
    const context2Metadata: Record<"Context 2", "page1"> = {
        "Context 2": "page1",
      };
      
    const context2 = new Context({
        pageContent: "Context 2",
        metadata: context2Metadata,
    });
    const vectorStore = new TestVectorStore({}, {});
    const input1 = {
        command: "addVectors",
        inputs: {
          vectors: [[1, 2, 3], [3, 4, 5]],
          contexts: [context1, context2],
          options: {},
        },
    };
    const result1 = await vectorStore.invoke(input1);
    expect(result1).toBeUndefined();
    expect(vectorStore.vectors).toEqual([[1, 2, 3], [3, 4, 5]]);
    const input = {
        command: "addContexts",
        inputs: {
          contexts: [context1, context2],
          options: {},
        },
    };
    const result = await vectorStore.invoke(input);
    expect(result).toBeUndefined();
    expect(vectorStore.contexts).toEqual([context1, context2]);


    const input2 = {
        command: "similaritySearchVectorWithScore",
        inputs: {
          query: "Test question",
          k: 3
        },
    };
    const result2 = await vectorStore.invoke(input2);
    expect (result2).toEqual([[context2, 0.548]]);

    const input3 = {
        command: "maxMarginalRelevanceSearch",
        inputs: {
          query: "Test question",
          options: {},
          callbacks: undefined
        },
    };
    const result3 = await vectorStore.invoke(input3);
    expect (result3).toEqual([context1]);
});