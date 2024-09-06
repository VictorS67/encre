import { describe, expect, test } from '@jest/globals';
import { OpenAIEmbeddings } from '../../../../embeddings/openai.js';
import { MemoryVectorStore, Vector } from '../memory.js';

describe('MemoryVectorStore', () => {
  const OPENAI_API_KEY = 'you_should_get_this_api_from_openai';

  const openaiEmbeddings = new OpenAIEmbeddings({
    openAIApiKey: OPENAI_API_KEY,
    modelName: 'text-embedding-ada-002',
  });

  const embed = async (query: string): Promise<number[]> => {
    const embedResult = await openaiEmbeddings.invoke(query);

    return embedResult.embedding;
  };

  test('similarity search', async () => {
    const memory = new MemoryVectorStore({
      vectors: [
        {
          id: 'vec1',
          content: 'I like pizza',
          embedding: await embed('I like pizza'),
          metadata: {},
        },
        {
          id: 'vec2',
          content: "I don't like dogs",
          embedding: await embed("I don't like dogs"),
          metadata: {},
        },
        {
          id: 'vec2',
          content: 'I looks like a clown',
          embedding: await embed('I looks like a clown'),
          metadata: {},
        },
      ],
    });

    const searches = await memory.similaritySearch(
      await embed('what do I like?'),
      2
    );

    expect(searches).toMatchSnapshot();
  });

  test('mmr search', async () => {
    const memory = new MemoryVectorStore({
      vectors: [
        {
          id: 'vec1',
          content: 'I like pizza',
          embedding: await embed('I like pizza'),
          metadata: {},
        },
        {
          id: 'vec2',
          content: "I don't like dogs",
          embedding: await embed("I don't like dogs"),
          metadata: {},
        },
        {
          id: 'vec2',
          content: 'I looks like a clown',
          embedding: await embed('I looks like a clown'),
          metadata: {},
        },
      ],
    });

    const searches = await memory.maxMarginalRelevanceSearch(
      await embed('what do I like?'),
      2,
      0.5
    );

    expect(searches).toMatchSnapshot();
  });
});
