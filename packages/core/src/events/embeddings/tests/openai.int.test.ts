import { describe, expect, test } from '@jest/globals';
import { OpenAIEmbeddings } from '../openai';

describe('OpenAIEmbeddings', () => {
  const OPENAI_API_KEY = 'you_should_get_this_api_from_openai';

  test('test text-embedding-ada-002', async () => {
    const openaiEmbeddings = new OpenAIEmbeddings({
      openAIApiKey: OPENAI_API_KEY,
      modelName: 'text-embedding-ada-002',
    });

    const embeddings = await openaiEmbeddings.invoke(
      'Your text string goes here'
    );

    expect(embeddings).toMatchSnapshot();
  });

  test('test text-embedding-3-small', async () => {
    const openaiEmbeddings = new OpenAIEmbeddings({
      openAIApiKey: OPENAI_API_KEY,
      modelName: 'text-embedding-3-small',
    });

    const embeddings = await openaiEmbeddings.invoke(
      'Your text string goes here'
    );

    expect(embeddings).toMatchSnapshot();
  });

  test('test text-embedding-3-large', async () => {
    const openaiEmbeddings = new OpenAIEmbeddings({
      openAIApiKey: OPENAI_API_KEY,
      modelName: 'text-embedding-3-large',
    });

    const embeddings = await openaiEmbeddings.invoke(
      'Your text string goes here'
    );

    expect(embeddings).toMatchSnapshot();
  });
});
