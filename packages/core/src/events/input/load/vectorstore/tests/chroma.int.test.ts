import { describe, expect, test } from '@jest/globals';
import { IncludeEnum } from 'chromadb';
import { OpenAIEmbeddings } from '../../../../embeddings/openai.js';
import { Context } from '../../docs/context.js';
import { ChromaVectorStore } from '../chroma.js';

describe('ChromaVectorStore', () => {
  /**
   * Before testing, deploy Chroma on a long-running server, and connect to it remotely
   *
   * Docker:
   * ```
   * docker pull chromadb/chroma
   * docker run -p 8000:8000 chromadb/chroma
   * ```
   */

  const OPENAI_API_KEY = 'you_should_get_this_api_from_openai';

  const openaiEmbeddings = new OpenAIEmbeddings({
    openAIApiKey: OPENAI_API_KEY,
    modelName: 'text-embedding-ada-002',
  });

  const embed = async (query: string): Promise<number[]> => {
    const embedResult = await openaiEmbeddings.invoke(query);

    return embedResult.embedding;
  };

  test('imports correctly', async () => {
    const { ChromaClient } = await import('chromadb');

    expect(ChromaClient).toBeDefined();
  });

  test('constructor defined', async () => {
    const chromaStore = new ChromaVectorStore({
      url: 'http://localhost:8000',
      collectionName: 'test-collection',
    });

    expect(chromaStore).toBeDefined();
  });

  test('similarity search', async () => {
    const chroma = new ChromaVectorStore({
      url: 'http://localhost:8000',
      collectionName: 'test-similarity-search',
    });

    chroma.addVectors(
      [
        await embed('I like pizza'),
        await embed("I don't like dogs"),
        await embed('I looks like a clown'),
      ],
      [
        new Context({
          pageContent: 'I like pizza',
        }),
        new Context({
          pageContent: "I don't like dogs",
        }),
        new Context({
          pageContent: 'I looks like a clown',
        }),
      ],
      {
        ids: ['vec1', 'vec2', 'vec3'],
      }
    );

    const searches = await chroma.similaritySearch(
      await embed('what do I like?'),
      2
    );

    expect(searches).toMatchSnapshot();
  });

  test('mmr search', async () => {
    const chroma = new ChromaVectorStore({
      url: 'http://localhost:8000',
      collectionName: 'test-mmr-search',
    });

    chroma.addVectors(
      [
        await embed('I like pizza'),
        await embed("I don't like dogs"),
        await embed('I looks like a clown'),
      ],
      [
        new Context({
          pageContent: 'I like pizza',
        }),
        new Context({
          pageContent: "I don't like dogs",
        }),
        new Context({
          pageContent: 'I looks like a clown',
        }),
      ],
      {
        ids: ['vec1', 'vec2', 'vec3'],
      }
    );

    const searches = await chroma.maxMarginalRelevanceSearch(
      await embed('what do I like?'),
      2,
      0.5
    );

    expect(searches).toMatchSnapshot();
  });

  test('add vectors to the collection with loc metadata', async () => {
    const expectedVectorIds: string[] = ['vec1', 'vec2', 'vec3'];

    const expectedPageContents: string[] = [
      'I like pizza',
      "I don't like dogs",
      'I looks like a clown',
    ];

    const expectedEmbeddings: number[][] = await Promise.all(
      expectedPageContents.map(async (pc) => await embed(pc))
    );

    const expectedContexts: Context[] = expectedPageContents.map(
      (pc, index) =>
        new Context({
          pageContent: pc,
          metadata: {
            source: 'dummy.html',
            loc: {
              lines: {
                from: 0 + index * 4,
                to: (index + 1) * 4,
              },
            },
          },
        })
    );

    const expectedMetadatas = expectedPageContents.map((_, index) => ({
      source: 'dummy.html',
      locFrom: 0 + index * 4,
      locTo: (index + 1) * 4,
    }));

    const chromaStore = new ChromaVectorStore({
      url: 'http://localhost:8000',
      collectionName: 'test-add-vectors',
    });

    chromaStore.addVectors(expectedEmbeddings, expectedContexts, {
      ids: expectedVectorIds,
    });

    const collection = await chromaStore._getCollection();

    const response = await collection.get({
      ids: expectedVectorIds,
      include: [IncludeEnum.Metadatas],
    });

    expect(JSON.parse(JSON.stringify(response.metadatas))).toStrictEqual(
      expectedMetadatas
    );
  });
});
