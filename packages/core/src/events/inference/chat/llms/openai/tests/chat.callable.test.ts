import { beforeAll, describe, expect, test } from '@jest/globals';
import {
  OptionalImportMap,
  SecretMap,
} from '../../../../../../load/importType.js';
import { load } from '../../../../../../load/index.js';
import { OpenAIChat } from '../chat.js';

describe('test OpenAIChat Callable', () => {
  let openaiChat: OpenAIChat;

  beforeAll(() => {
    openaiChat = new OpenAIChat({
      openAIApiKey: 'this_is_api_key',
      modelName: 'gpt-4-turbo-preview',
    });
  });

  test('serializable', async () => {
    expect(openaiChat.getAttributes()).toStrictEqual({
      aliases: {
        modelName: 'model',
        openAIApiKey: 'openai_api_key',
        streaming: 'stream',
      },
      secrets: {
        organization: 'OPENAI_ORGANIZATION',
        openAIApiKey: 'OPENAI_API_KEY',
      },
      kwargs: {
        verbose: undefined,
        callbacks: undefined,
        modelName: 'gpt-4-turbo-preview',
        temperature: 1,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
        maxTokens: 2048,
        streaming: false,
        stopWords: undefined,
        logitBias: undefined,
        responseFormatType: undefined,
        seed: undefined,
        user: undefined,
        timeout: undefined,
        additionalKwargs: {},
      },
      metadata: {
        type: 'Callable',
      },
    });

    const str: string = JSON.stringify(openaiChat, null, 2);
    expect(str).toBe(
      JSON.stringify(
        {
          _grp: 1,
          _type: 'constructor',
          _id: ['inference', 'chat', 'llms', 'openai', 'OpenAIChat'],
          _kwargs: {
            model: 'gpt-4-turbo-preview',
            frequency_penalty: 0,
            presence_penalty: 0,
            stream: false,
            temperature: 1,
            max_tokens: 2048,
            top_p: 1,
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

    const anotherOpenAI: OpenAIChat = await load<OpenAIChat>(
      str,
      { OPENAI_API_KEY: 'this_is_api_key' } as SecretMap,
      { 'inference/chat/llms/openai': { OpenAIChat } } as OptionalImportMap
    );

    expect(anotherOpenAI).toBeInstanceOf(OpenAIChat);
    expect(JSON.stringify(anotherOpenAI, null, 2)).toBe(str);

    expect(anotherOpenAI.getAttributes()).toStrictEqual({
      aliases: {
        modelName: 'model',
        openAIApiKey: 'openai_api_key',
        streaming: 'stream',
      },
      secrets: {
        organization: 'OPENAI_ORGANIZATION',
        openAIApiKey: 'OPENAI_API_KEY',
      },
      kwargs: {
        verbose: undefined,
        callbacks: undefined,
        modelName: 'gpt-4-turbo-preview',
        temperature: 1,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
        maxTokens: 2048,
        streaming: false,
        stopWords: undefined,
        logitBias: undefined,
        responseFormatType: undefined,
        seed: undefined,
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
