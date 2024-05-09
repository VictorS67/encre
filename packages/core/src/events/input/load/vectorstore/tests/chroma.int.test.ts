import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { ChromaClient, Collection } from "chromadb";
import { OpenAIEmbeddings } from "../../../../embeddings/openai.js";
import { Context } from "../../docs/context.js";
import { ChromaVectorStore } from "../chroma.js";

describe("MemoryVectorStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const OPENAI_API_KEY = "you_should_get_this_api_from_openai";

  const openaiEmbeddings = new OpenAIEmbeddings({
    openAIApiKey: OPENAI_API_KEY,
    modelName: "text-embedding-ada-002",
  });

  const embed = async (query: string): Promise<number[]> => {
    const embedResult = await openaiEmbeddings.invoke(query);

    return embedResult.embedding;
  };

  test("imports correctly", async () => {
    const { ChromaClient } = await import("chromadb");

    expect(ChromaClient).toBeDefined();
  });

  test("constructor defined", async () => {
    const chromaStore = new ChromaVectorStore({
      url: "http://localhost:11452",
      collectionName: "test-collection",
    });

    expect(chromaStore).toBeDefined();
  });

  // test("test chroma", async () => {
  //   const client = new ChromaClient({
  //     path: "http://127.0.0.1:8000",
  //   });

  //   const collection = await client.getOrCreateCollection({
  //     name: "my_collection",
  //     metadata: {
  //       description: "My first collection",
  //     },
  //   });

  //   const collections = await client.listCollections();

  //   expect(collections).toMatchSnapshot();
  // });

  // test("similarity search", async () => {
  //   const chroma = new ChromaVectorStore({
  //     url: "http://localhost:11451",
  //   });

  //   chroma.addVectors(
  //     [
  //       await embed("I like pizza"),
  //       await embed("I don't like dogs"),
  //       await embed("I looks like a clown"),
  //     ],
  //     [
  //       new Context({
  //         pageContent: "I like pizza",
  //       }),
  //       new Context({
  //         pageContent: "I don't like dogs",
  //       }),
  //       new Context({
  //         pageContent: "I looks like a clown",
  //       }),
  //     ],
  //     {
  //       ids: ["vec1", "vec2", "vec3"],
  //     }
  //   );

  //   const searches = await chroma.similaritySearch(
  //     await embed("what do I like?"),
  //     2
  //   );

  //   expect(searches).toMatchSnapshot();
  // });

  // test("mmr search", async () => {
  //   const chroma = new ChromaVectorStore({
  //     url: "http://localhost:11452",
  //   });

  //   chroma.addVectors(
  //     [
  //       await embed("I like pizza"),
  //       await embed("I don't like dogs"),
  //       await embed("I looks like a clown"),
  //     ],
  //     [
  //       new Context({
  //         pageContent: "I like pizza",
  //       }),
  //       new Context({
  //         pageContent: "I don't like dogs",
  //       }),
  //       new Context({
  //         pageContent: "I looks like a clown",
  //       }),
  //     ],
  //     {
  //       ids: ["vec1", "vec2", "vec3"],
  //     }
  //   );

  //   const searches = await chroma.maxMarginalRelevanceSearch(
  //     await embed("what do I like?"),
  //     2,
  //     0.5
  //   );

  //   expect(searches).toMatchSnapshot();
  // });
});
