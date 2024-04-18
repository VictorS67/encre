import { expect, test } from '@jest/globals';
import { stringify } from 'yaml';
import { MemoryCache } from '../../../../cache/index.js';
import {
  BaseMessage,
  BaseMessageLike,
} from '../../../input/load/msgs/base.js';
import { ChatMessage } from '../../../input/load/msgs/chat.js';
import { HumanMessage } from '../../../input/load/msgs/human.js';
import { SystemMessage } from '../../../input/load/msgs/system.js';
import { convertMessageLikeToMessage } from '../../../input/load/msgs/utils.js';
import { BasePrompt } from '../../../input/load/prompts/base.js';
import { ChatPrompt } from '../../../input/load/prompts/chat.js';
import { StringPrompt } from '../../../input/load/prompts/text.js';
import { Generation } from '../../../output/provide/generation.js';
import { LLMResult } from '../../../output/provide/llmresult.js';
import {
  BaseChatLM,
  BaseLLM,
  BaseLM,
  BaseLMCallOptions,
  BaseLMInput,
  calculateMaxToken,
} from '../base.js';

test('test calculateMaxToken', async () => {
  const prompt = 'this is a prompt.';

  const modelName = 'gpt-3.5-turbo-16k-0613';
  expect(await calculateMaxToken(prompt, modelName)).toBe(16384 - 5);

  const modelName2 = 'gpt-3.5-turbo-0613';
  expect(await calculateMaxToken(prompt, modelName2)).toBe(4096 - 5);

  const modelName3 = 'gpt-4-32k-0314';
  expect(await calculateMaxToken(prompt, modelName3)).toBe(32768 - 5);

  const modelName4 = 'gpt-4-0314';
  expect(await calculateMaxToken(prompt, modelName4)).toBe(8192 - 5);

  const modelName5 = 'gpt2';
  expect(await calculateMaxToken(prompt, modelName5)).toBe(4096 - 5);
});

test('test BaseLM', async () => {
  class TestLM extends BaseLM {
    _eventNamespace(): string[] {
      return ['tests'];
    }

    _llmType(): string {
      return 'test_llm';
    }

    _modelType(): string {
      return 'test_model';
    }

    /**
     * In this method, we mock the language model result as pairs of prompts
     * given an array of prompts.
     * @param {string} prompt - A prompt.
     * @param options if given an array of strings, then it means the stopwords.
     * @param callbacks TODO: not yet implemented
     */
    async provide(
      prompt: string,
      options?: BaseLMCallOptions | string[],
      callbacks?: any
    ): Promise<LLMResult> {
      const generations: Generation[] = [
        {
          output: prompt,
          info: {
            index: 0,
          },
        },
      ];

      return { generations };
    }

    /**
     * Invokes the language model with a given input and options.
     * @param input The given prompt in {@link BaseLMInput}
     * @param options It contains callbask and other options such as stopwords.
     */
    async invoke(
      input: BaseLMInput,
      options?: Partial<BaseLMCallOptions>
    ): Promise<unknown> {
      let prompt: BasePrompt;
      if (typeof input === 'string') {
        prompt = new StringPrompt(input);
      } else if (Array.isArray(input)) {
        prompt = new ChatPrompt(
          input.map((msg: BaseMessageLike) => convertMessageLikeToMessage(msg))
        );
      } else {
        prompt = input;
      }

      const result: LLMResult = await this.provide(
        prompt.toString(),
        options,
        options?.callbacks
      );

      return result;
    }
  }

  const testLM = new TestLM({});

  // BaseLM is not serializable
  const serializedStr: string = JSON.stringify(testLM, null, 2);
  expect(stringify(JSON.parse(serializedStr))).toMatchSnapshot();

  const result: LLMResult = await testLM.provide('this is a prompt.');
  expect(result).toStrictEqual({
    generations: [{ info: { index: 0 }, output: 'this is a prompt.' }],
  });

  expect(stringify(await testLM.invoke('this is a prompt.'))).toMatchSnapshot();

  expect(
    stringify(
      await testLM.invoke([
        ['system', 'this is a system message'],
        ['human', 'this is a human message'],
        ['assistant', 'this is a bot message'],
      ])
    )
  ).toMatchSnapshot();

  expect(
    stringify(
      await testLM.invoke([
        'this is a human message 1',
        'this is a human message 2',
        'this is a human message 3',
      ])
    )
  ).toMatchSnapshot();

  expect(
    stringify(await testLM.invoke(new StringPrompt('this is a prompt.')))
  ).toMatchSnapshot();

  expect(
    stringify(
      await testLM.invoke(
        new ChatPrompt([
          new SystemMessage('this is a system message'),
          new HumanMessage('this is a human message'),
        ])
      )
    )
  ).toMatchSnapshot();

  expect(
    stringify(
      await testLM.invoke([
        new SystemMessage('this is a system message'),
        new HumanMessage('this is a human message'),
      ])
    )
  ).toMatchSnapshot();
});

test('test BaseLLM', async () => {
  class TestLLM extends BaseLLM {
    getParams(
      options?: this['SerializedCallOptions']
    ): Record<string, unknown> {
      return {};
    }

    /**
     * In this method, we mock the language model result as pairs of prompts
     * given an array of prompts.
     * @param {string} prompt - A prompt.
     * @param options if given an array of strings, then it means the stopwords.
     * @param callbacks TODO: not yet implemented
     */
    async _provide(
      prompt: string,
      options: this['SerializedCallOptions']
    ): Promise<LLMResult> {
      const generations: Generation[] = [
        {
          output: prompt,
          info: {
            index: 0,
          },
        },
      ];

      return { generations };
    }

    _llmType(): string {
      return 'test_llm';
    }
  }

  const cache: MemoryCache = MemoryCache.global();
  const testLLMWithCustomCache = new TestLLM({ cache });

  // BaseLLM is not serializable
  const serializedStr: string = JSON.stringify(testLLMWithCustomCache, null, 2);
  expect(stringify(JSON.parse(serializedStr))).toMatchSnapshot();

  const result: LLMResult =
    await testLLMWithCustomCache.provide('this is a prompt.');
  expect(result).toStrictEqual({
    generations: [{ info: { index: 0 }, output: 'this is a prompt.' }],
    llmOutput: {},
  });

  expect(
    stringify(await testLLMWithCustomCache.invoke('this is a prompt.'))
  ).toMatchSnapshot();

  expect(
    stringify(
      await testLLMWithCustomCache.invoke([
        ['system', 'this is a system message'],
        ['human', 'this is a human message'],
        ['assistant', 'this is a bot message'],
      ])
    )
  ).toMatchSnapshot();

  expect(
    stringify(
      await testLLMWithCustomCache.invoke([
        'this is a human message 1',
        'this is a human message 2',
        'this is a human message 3',
      ])
    )
  ).toMatchSnapshot();

  expect(
    stringify(
      await testLLMWithCustomCache.invoke(new StringPrompt('this is a prompt.'))
    )
  ).toMatchSnapshot();

  expect(
    stringify(
      await testLLMWithCustomCache.invoke(
        new ChatPrompt([
          new SystemMessage('this is a system message'),
          new HumanMessage('this is a human message'),
        ])
      )
    )
  ).toMatchSnapshot();

  expect(
    stringify(
      await testLLMWithCustomCache.invoke([
        new SystemMessage('this is a system message'),
        new HumanMessage('this is a human message'),
      ])
    )
  ).toMatchSnapshot();
});

test('test BaseChatLM', async () => {
  class TestChatLM extends BaseChatLM {
    getParams(
      options?: this['SerializedCallOptions']
    ): Record<string, unknown> {
      return {};
    }

    /**
     * In this method, we mock the language model result as pairs of prompts
     * given an array of prompts.
     * @param {string} prompt - A prompt.
     * @param options if given an array of strings, then it means the stopwords.
     * @param callbacks TODO: not yet implemented
     */
    async _provide(
      messages: BaseMessage[],
      options: this['SerializedCallOptions']
    ): Promise<LLMResult> {
      const generations: Generation[] = messages.map(
        (message: BaseMessage, idx: number) => ({
          output: message.content ?? '',
          info: {
            index: idx,
          },
        })
      );

      return { generations };
    }

    _llmType(): string {
      return 'test_chatlm';
    }
  }

  const cache: MemoryCache = MemoryCache.global();
  const testChatLMWithCustomCache = new TestChatLM({ cache });

  // BaseLLM is not serializable
  const serializedStr: string = JSON.stringify(
    testChatLMWithCustomCache,
    null,
    2
  );
  expect(stringify(JSON.parse(serializedStr))).toMatchSnapshot();

  const result: LLMResult = await testChatLMWithCustomCache.provide([
    new ChatMessage('this is a prompt.', 'assistant'),
  ]);
  expect(result).toStrictEqual({
    generations: [{ info: { index: 0 }, output: 'this is a prompt.' }],
    llmOutput: {},
  });

  expect(
    stringify(await testChatLMWithCustomCache.invoke('this is a prompt.'))
  ).toMatchSnapshot();

  expect(
    stringify(
      await testChatLMWithCustomCache.invoke([
        ['system', 'this is a system message'],
        ['human', 'this is a human message'],
        ['assistant', 'this is a bot message'],
      ])
    )
  ).toMatchSnapshot();

  expect(
    stringify(
      await testChatLMWithCustomCache.invoke([
        'this is a human message 1',
        'this is a human message 2',
        'this is a human message 3',
      ])
    )
  ).toMatchSnapshot();

  expect(
    stringify(
      await testChatLMWithCustomCache.invoke(
        new StringPrompt('this is a prompt.')
      )
    )
  ).toMatchSnapshot();

  expect(
    stringify(
      await testChatLMWithCustomCache.invoke(
        new ChatPrompt([
          new SystemMessage('this is a system message'),
          new HumanMessage('this is a human message'),
        ])
      )
    )
  ).toMatchSnapshot();

  expect(
    stringify(
      await testChatLMWithCustomCache.invoke([
        new SystemMessage('this is a system message'),
        new HumanMessage('this is a human message'),
      ])
    )
  ).toMatchSnapshot();
});
