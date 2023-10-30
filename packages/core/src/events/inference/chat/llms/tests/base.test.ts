import { expect, test } from '@jest/globals';
import { stringify } from 'yaml';
import { MemoryCache } from '../../../../../cache/index.js';
import { batch } from '../../../../../utils/batch.js';
import {
  BaseMessage,
  BaseMessageLike,
  BotMessage,
  HumanMessage,
  SystemMessage,
  convertMessageLikeToMessage,
  getChatString,
} from '../../../../input/load/msgs/base.js';
import {
  BasePrompt,
  StringPrompt,
} from '../../../../input/load/prompts/base.js';
import { ChatPrompt } from '../../../../input/load/prompts/chat.js';
import { Generation } from '../../../../output/provide/generation.js';
import { LLMResult } from '../../../../output/provide/llmresult.js';
import {
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
    _namespace: string[] = ['tests'];

    _llmType(): string {
      return 'test_llm';
    }

    _modelType(): string {
      return 'test_model';
    }

    /**
     * In this method, we mock the language model result as pairs of prompts
     * given an array of prompts.
     * @param prompts The given array of prompts in strings.
     * @param options if given an array of strings, then it means the stopwords.
     * @param callbacks TODO: not yet implemented
     */
    async provide(
      prompts: string[],
      options?: BaseLMCallOptions | string[],
      callbacks?: any
    ): Promise<LLMResult> {
      const generations: Generation[][] = batch(prompts, 2).map(
        (promptPair: string[]) =>
          promptPair.map((prompt: string, idx: number) => ({
            output: prompt,
            info: {
              index: idx,
            },
          }))
      );

      return { generations };
    }

    /**
     * In this method, we mock the language model result as pairs of prompts
     * given an array of prompts.
     * @param prompts The given array of prompts in {@link BasePrompt}.
     * @param options if given an array of strings, then it means the stopwords.
     * @param callbacks TODO: not yet implemented
     */
    async provideWithPrompts(
      prompts: BasePrompt[],
      options?: BaseLMCallOptions | string[],
      callbacks?: any
    ): Promise<LLMResult> {
      const promptStrs: string[] = prompts.map((prompt: BasePrompt) =>
        prompt.toString()
      );

      const generations: Generation[][] = batch(promptStrs, 2).map(
        (promptPair: string[]) =>
          promptPair.map((prompt: string, idx: number) => ({
            output: prompt,
            info: {
              index: idx,
            },
          }))
      );

      return { generations };
    }

    /**
     * In this method, we mock the predict text as the given text input.
     * @param text The given input in string.
     * @param options if given an array of strings, then it means the stopwords.
     * @param callbacks TODO: not yet implemented
     * @returns
     */
    async predict(
      text: string,
      options?: BaseLMCallOptions | string[],
      callbacks?: any
    ): Promise<string> {
      return text;
    }

    /**
     * In this method, we mock the predict text as the given text input in {@link BotMessage}.
     * @param messages The given input in {@link BaseMessage[]}.
     * @param options if given an array of strings, then it means the stopwords.
     * @param callbacks TODO: not yet implemented
     */
    async predictWithMessages(
      messages: BaseMessage[],
      options?: BaseLMCallOptions | string[] | undefined,
      callbacks?: any
    ): Promise<BaseMessage> {
      const text: string = getChatString(messages);
      return new BotMessage(text);
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

      const result: LLMResult = await this.provideWithPrompts(
        [prompt],
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

  const result: string = await testLM.predict('this is a prompt.');
  expect(result).toBe('this is a prompt.');

  const messages: BaseMessage[] = [
    new SystemMessage('this is a system message'),
    new HumanMessage('this is a human message'),
  ];
  const result2: BaseMessage = await testLM.predictWithMessages(messages);
  expect(JSON.stringify(result2, null, 2)).toMatchSnapshot();

  const prompts: string[] = [
    'System: this is a system message',
    'Human: this is a human message',
    'AI: thhis is a bot message',
  ];
  const result3: LLMResult = await testLM.provide(prompts);
  expect(JSON.stringify(result3, null, 2)).toMatchSnapshot();

  const basePrompts: BasePrompt[] = [
    new StringPrompt('this is a prompt.'),
    new ChatPrompt(messages),
    new StringPrompt('this is a prompt.'),
  ];
  const result4: LLMResult = await testLM.provideWithPrompts(basePrompts);
  expect(JSON.stringify(result4, null, 2)).toMatchSnapshot();
});

test('test BaseLLM', async () => {
  class TestLLM extends BaseLLM {
    /**
     * In this method, we mock the language model result as pairs of prompts
     * given an array of prompts.
     * @param prompts The given array of prompts in strings.
     * @param options if given an array of strings, then it means the stopwords.
     * @param callbacks TODO: not yet implemented
     */
    async _provide(
      prompts: string[],
      options: this['SerializedCallOptions']
    ): Promise<LLMResult> {
      const generations: Generation[][] = batch(prompts, 2).map(
        (promptPair: string[]) =>
          promptPair.map((prompt: string, idx: number) => ({
            output: prompt,
            info: {
              index: idx,
            },
          }))
      );

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

  expect(await testLLMWithCustomCache.predict('this is a prompt.')).toBe(
    'this is a prompt.'
  );

  const messages: BaseMessage[] = [
    new SystemMessage('this is a system message'),
    new HumanMessage('this is a human message'),
  ];
  const result2: BaseMessage =
    await testLLMWithCustomCache.predictWithMessages(messages);
  expect(JSON.stringify(result2, null, 2)).toMatchSnapshot();

  const prompts: string[] = [
    'System: this is a system message',
    'Human: this is a human message',
    'AI: thhis is a bot message',
  ];
  const result3: LLMResult = await testLLMWithCustomCache.provide(prompts);
  expect(JSON.stringify(result3, null, 2)).toMatchSnapshot();

  const basePrompts: BasePrompt[] = [
    new StringPrompt('this is a prompt.'),
    new ChatPrompt(messages),
    new StringPrompt('this is a prompt.'),
  ];
  const result4: LLMResult =
    await testLLMWithCustomCache.provideWithPrompts(basePrompts);
  expect(JSON.stringify(result4, null, 2)).toMatchSnapshot();
});
