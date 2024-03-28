import { beforeAll, describe, expect, test } from '@jest/globals';
import { OptionalImportMap, SecretMap } from '../../../../../../load/importType.js';
import { load } from '../../../../../../load/index.js';
import { OpenAI } from '../text.js';

describe('test OpenAI Callable', () => {
  let openai: OpenAI;

  beforeAll(() => {
    openai = new OpenAI({
      openAIApiKey: 'this_is_api_key',
      modelName: 'gpt-3.5-turbo-instruct',
    });
  });

  test('serializable', async () => {
    expect(openai.getAttributes()).toStrictEqual({
      aliases: {
        modelName: 'model',
        openAIApiKey: 'openai_api_key',
        streaming: 'stream'
      },
      secrets: {
        organization: 'OPENAI_ORGANIZATION',
        openAIApiKey: 'OPENAI_API_KEY',
      },
      kwargs: {
        verbose: undefined,
        callbacks: undefined,
        echo: undefined,
        modelName: 'gpt-3.5-turbo-instruct',
        temperature: 1,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
        maxTokens: 2048,
        streaming: false,
        bestOf: undefined,
        seed: undefined,
        stopWords: undefined,
        logitBias: undefined,
        logprobs: undefined,
        user: undefined,
        timeout: undefined,
        additionalKwargs: {},
      },
      metadata: {
        type: 'Callable',
      },
    });

    const str: string = JSON.stringify(openai, null, 2);
    expect(str).toBe(
      JSON.stringify(
        {
          _grp: 1,
          _type: 'constructor',
          _id: ['inference', 'chat', 'llms', 'openai', 'OpenAI'],
          _kwargs: {
            model: 'gpt-3.5-turbo-instruct',
            temperature: 1,
            max_tokens: 2048,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stream: false,
            additional_kwargs: {},
            openai_api_key: {
              _grp: 1,
              _type: 'secret',
              _id: ['OPENAI_API_KEY'],
            },
          },
        },
        null,
        2
      )
    );

    const anotherOpenAI: OpenAI = await load<OpenAI>(
      str,
      { OPENAI_API_KEY: 'this_is_api_key' } as SecretMap,
      { 'inference/chat/llms/openai': { OpenAI } } as OptionalImportMap
    );

    expect(anotherOpenAI).toBeInstanceOf(OpenAI);
    expect(JSON.stringify(anotherOpenAI, null, 2)).toBe(str);

    expect(anotherOpenAI.getAttributes()).toStrictEqual({
      aliases: {
        modelName: 'model',
        openAIApiKey: 'openai_api_key',
        streaming: 'stream'
      },
      secrets: {
        organization: 'OPENAI_ORGANIZATION',
        openAIApiKey: 'OPENAI_API_KEY',
      },
      kwargs: {
        verbose: undefined,
        callbacks: undefined,
        echo: undefined,
        modelName: 'gpt-3.5-turbo-instruct',
        temperature: 1,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
        maxTokens: 2048,
        streaming: false,
        bestOf: undefined,
        seed: undefined,
        stopWords: undefined,
        logitBias: undefined,
        logprobs: undefined,
        user: undefined,
        timeout: undefined,
        additionalKwargs: {},
      },
      metadata: {
        type: 'Callable',
      },
    });
  });
});
