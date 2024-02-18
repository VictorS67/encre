import { expect, test } from '@jest/globals';
import { HumanMessage } from '../../../input/load/msgs/base.js';
import { ChatGenerationChunk } from '../message.js';

test('test ChatGenerationChunk', async () => {
  const testChatGenerationChunk = new ChatGenerationChunk({
    output: 'this is a text.',
    message: new HumanMessage('this is a text.'),
    info: {
      index: 0,
    },
  });

  const testChatGenerationChunk2 = new ChatGenerationChunk({
    output: 'this is a text2.',
    message: new HumanMessage('this is a text2.'),
    info: {
      index: 0,
    },
  });

  const newChunk: ChatGenerationChunk = testChatGenerationChunk.concat(
    testChatGenerationChunk2
  );

  expect(newChunk.output).toBe('this is a text.this is a text2.');
  expect(newChunk.message.content).toBe('this is a text.this is a text2.');
});
