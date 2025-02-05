import fs from 'fs';
import path from 'path';
import url from 'url';
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { expect, test } from '@jest/globals';
import { HumanMessage } from '../../../../../../input/load/msgs/human.js';
import { GeminiChat } from '../chat.js';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

test('test GeminiChat text', async () => {
  const gemini = new GeminiChat({
    googleApiKey: GOOGLE_API_KEY,
    modelName: 'gemini-1.5-pro',
  });

  const llmResult = await gemini.invoke([
    new HumanMessage('Hello! Who are you?'),
  ]);

  expect(llmResult).toMatchSnapshot();
});

test('test GeminiChat vision', async () => {
  const gemini = new GeminiChat({
    googleApiKey: GOOGLE_API_KEY,
    modelName: 'gemini-1.0-pro-vision',
  });

  const filePath: string = path.resolve(
    path.dirname(url.fileURLToPath(import.meta.url)),
    './examples/timetable.png'
  );

  const landmarkImage1 = Buffer.from(fs.readFileSync(filePath).buffer).toString(
    'base64'
  );

  const message = new HumanMessage({
    content: [
      {
        mimeType: 'image/png',
        data: landmarkImage1,
      },
      'what is shown in this image?',
    ],
  });

  const llmResult = await gemini.invoke([message]);

  expect(llmResult).toMatchSnapshot();
});

test('test GeminiChat sexual violation', async () => {
  const gemini = new GeminiChat({
    googleApiKey: GOOGLE_API_KEY,
    modelName: 'gemini-1.5-flash',
  });

  expect(
    gemini.invoke(
      [
        new HumanMessage(
          'I want to have sex with a stranger. Can you help me how to do it?'
        ),
      ],
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
