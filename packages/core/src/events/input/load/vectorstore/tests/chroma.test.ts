import { jest, test, expect } from "@jest/globals";
import { ChromaClient, Collection, OpenAIEmbeddingFunction } from "chromadb";
import { Embeddings, EmbeddingsParams } from "../../../../embeddings/base";
import { Context } from "../../docs/context";
import { Chroma, ChromaInput } from "../chroma";
import { url } from "inspector";
import * as uuid from "uuid";
import {OpenAIClient, AzureKeyCredential, Embeddings as AOpenaiEmbeddings} from "@azure/openai"


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



test('invoke chroma mock', async () => {
    const mockCollection = {
        count: jest.fn<Collection["count"]>().mockResolvedValue(5),
        upsert: jest.fn<Collection["upsert"]>().mockResolvedValue(undefined as any),
        delete: jest.fn<Collection["delete"]>().mockResolvedValue(undefined as any),
       
      } as any;
      const mockClient = {
        getOrCreateCollection: jest.fn<any>().mockResolvedValue(mockCollection),
      } as any;

    const embeddings = new TestEmbeddings({});
    jest.spyOn(embeddings, "embedDocuments");
    const collectionName =  "testCollection"
    const chromaclient = new Chroma(embeddings, {"client": mockClient, "collectionName": collectionName,  collectionMetadata: { "hnsw:space": "cosine" }})
    const expectedPageContents = ["Document 1", "Document 2"];
    const documents = expectedPageContents.map((pc) => ({ pageContent: pc }));
    await chromaclient.addContexts(documents as any);
    expect(mockClient.getOrCreateCollection).toHaveBeenCalled();
    expect(chromaclient.embeddings.embedDocuments).toHaveBeenCalledWith(
        expectedPageContents
    );
    expect(mockCollection.upsert).toHaveBeenCalled();

    const { metadatas } = mockCollection.upsert.mock.calls[0][0];
    expect(metadatas).toEqual([{}, {}]);

    
    const chroma = new Chroma(embeddings, {"client": mockClient, "collectionName": collectionName,  collectionMetadata: { "hnsw:space": "cosine" }})
    const query = [1, 2];
    const expectedResultCount = 5;
    mockCollection.query = jest.fn<Collection["query"]>().mockResolvedValue({
      ids: [["0", "1", "2", "3", "4"]],
      distances: [[0.1, 0.2, 0.3, 0.4, 0.5]],
      documents: [
        ["Document 1", "Document 2", "Document 3", "Document 4", "Document 5"],
      ],
      metadatas: [[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]],
    } as any);

    chroma.collection = mockCollection;

    const results = await chroma.similaritySearchVectorWithScore(
      query,
      expectedResultCount
    );

    expect(mockCollection.query).toHaveBeenCalledWith({
      queryEmbeddings: query,
      nResults: expectedResultCount,
      where: {},
    });
    expect(results).toHaveLength(5);


});
