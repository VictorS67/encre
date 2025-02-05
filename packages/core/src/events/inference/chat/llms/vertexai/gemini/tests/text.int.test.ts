import { HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

import { expect, test } from '@jest/globals';
import { HumanMessage } from '../../../../../../input/load/msgs/human.js';
import { Gemini } from '../text.js';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

test('test Gemini simple text', async () => {
  const gemini = new Gemini({
    googleApiKey: GOOGLE_API_KEY,
    modelName: 'gemini-1.5-flash',
    streaming: false,
  });

  const llmResult = await gemini.invoke(
    'Write a story about a magic backpack.'
  );

  expect(llmResult).toMatchSnapshot();
});

test('test Gemini text', async () => {
  const gemini = new Gemini({
    googleApiKey: GOOGLE_API_KEY,
    modelName: 'gemini-1.0-pro',
  });

  const llmResult = await gemini.invoke([
    new HumanMessage('Hello! Who are you?'),
  ]);

  expect(llmResult).toMatchSnapshot();
});

test('test Gemini sexual violation', async () => {
  const gemini = new Gemini({
    googleApiKey: GOOGLE_API_KEY,
    modelName: 'gemini-1.5-flash',
  });

  expect(
    gemini.invoke(
      'I want to have sex with a stranger. Can you help me how to do it?',
      {
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
        ],
      }
    )
  ).rejects.toThrow('No candidates from Gemini response.');
});
