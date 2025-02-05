import { describe, expect, test } from '@jest/globals';

import { HumanMessage } from '../../../../../../input/load/msgs/human.js';
import { ChatGenerationChunk } from '../../../../../../output/provide/message.js';
import { OpenAIChat } from '../../chat.js';

describe('DeepSeek', () => {
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

  test('test DeepSeek text (deepseek-v3)', async () => {
    const deepseek = new OpenAIChat({
      openAIApiKey: DEEPSEEK_API_KEY,
      modelName: 'deepseek-chat',
    });
    const messages = [new HumanMessage('Hello! Who are you?')];

    const promptTokenNumber: number = await OpenAIChat.getNumTokensInChat(
      deepseek.modelName,
      messages
    );
    const llmResult = await deepseek.invoke(messages);
    const completionTokenNumber: number =
      await OpenAIChat.getNumTokensInGenerations(
        deepseek.modelName,
        llmResult.generations as ChatGenerationChunk[]
      );

    expect(llmResult).toMatchSnapshot();

    expect({
      completionTokens: completionTokenNumber,
      promptTokens: promptTokenNumber,
      totalTokens: promptTokenNumber + completionTokenNumber,
    }).toMatchSnapshot();
  });

  test('test DeepSeek reasoning (deepseek-r1)', async () => {
    const deepseek = new OpenAIChat({
      openAIApiKey: DEEPSEEK_API_KEY,
      modelName: 'deepseek-reasoner',
    });
    const messages = [new HumanMessage('Hello! Who are you?')];

    const promptTokenNumber: number = await OpenAIChat.getNumTokensInChat(
      deepseek.modelName,
      messages
    );
    const llmResult = await deepseek.invoke(messages);
    const completionTokenNumber: number =
      await OpenAIChat.getNumTokensInGenerations(
        deepseek.modelName,
        llmResult.generations as ChatGenerationChunk[]
      );

    expect(llmResult).toMatchSnapshot();

    expect({
      completionTokens: completionTokenNumber,
      promptTokens: promptTokenNumber,
      totalTokens: promptTokenNumber + completionTokenNumber,
    }).toMatchSnapshot();
  });
});
