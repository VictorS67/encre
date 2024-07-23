import { describe, expect, test } from '@jest/globals';

import { ChatMessage } from '../../../../events/input/load/msgs/index.js';
import { ChatMessageData } from '../../../data.js';
import { ChatMessageNodeImpl } from '../message.node.js';

describe('test MessageNodeImpl', () => {
  test('test user input to chat message', async () => {
    const chatMessageNode = ChatMessageNodeImpl.create();
    const nodeImpl = new ChatMessageNodeImpl(chatMessageNode);

    const role = 'user';
    const content = 'The following conversation is about writing fairy tales. You are given some topics, and your task is to write the fairy tale that based on those topics.';

    const outputs = await nodeImpl.process({
      role: { type: 'string', value: role },
      content: { type: 'string', value: content },
    }, {});

    const expectMessage = new ChatMessage({ role, content });

    expect(
      JSON.parse(JSON.stringify((outputs.message as ChatMessageData).value))
    ).toStrictEqual(JSON.parse(JSON.stringify(expectMessage)));
  });

  test('test using chat message stored data', async () => {
    const role = 'user';
    const content = 'The following conversation is about writing fairy tales. You are given some topics, and your task is to write the fairy tale that based on those topics.';
    const expectMessage = new ChatMessage({ role, content });

    const chatMessageNode = ChatMessageNodeImpl.nodeFrom(expectMessage);
    const nodeImpl = new ChatMessageNodeImpl(chatMessageNode);

    const outputs = await nodeImpl.process(undefined, {});

    expect(
      JSON.parse(JSON.stringify((outputs.message as ChatMessageData).value))
    ).toStrictEqual(JSON.parse(JSON.stringify(expectMessage)));
  });
});