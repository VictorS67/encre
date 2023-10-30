import { expect, test } from '@jest/globals';
import { stringify } from 'yaml';
import { BotMessage, SystemMessage } from '../../msgs/base';
import { ChatPrompt } from '../chat';

test('test custom ChatPrompt', async () => {
  const testChatPrompt = new ChatPrompt([
    new SystemMessage('this is a system message'),
    new BotMessage('this is a bot message'),
  ]);

  // ChatPrompt is serializable
  const serializedStr: string = JSON.stringify(testChatPrompt, null, 2);
  expect(stringify(JSON.parse(serializedStr))).toMatchSnapshot();

  expect(testChatPrompt.toString()).toBe(
    'System: this is a system message\nAI: this is a bot message'
  );

  // ChatMessages are serializable
  const serializedStr2: string = JSON.stringify(
    testChatPrompt.toChatMessages(),
    null,
    2
  );
  expect(stringify(JSON.parse(serializedStr2))).toMatchSnapshot();
});
