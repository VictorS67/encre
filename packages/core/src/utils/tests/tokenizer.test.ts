import { expect, jest, test } from '@jest/globals';
import {
  Tiktoken,
  TiktokenEncoding,
  TiktokenModel,
  getEncodingNameForModel,
} from 'js-tiktoken';
import {
  encodingForModel,
  getEncoding,
  getNumTokens,
  getTiktokenModel,
} from '../tokenizer';

test('test getTiktokenModel', () => {
  const modelName = 'gpt-3.5-turbo-16k-0613';
  const expectModel: TiktokenModel = 'gpt-3.5-turbo-16k';
  expect(getTiktokenModel(modelName)).toBe(expectModel);

  const modelName2 = 'gpt-3.5-turbo-0613';
  const expectModel2: TiktokenModel = 'gpt-3.5-turbo';
  expect(getTiktokenModel(modelName2)).toBe(expectModel2);

  const modelName3 = 'gpt-4-32k-0314';
  const expectModel3: TiktokenModel = 'gpt-4-32k';
  expect(getTiktokenModel(modelName3)).toBe(expectModel3);

  const modelName4 = 'gpt-4-0314';
  const expectModel4: TiktokenModel = 'gpt-4';
  expect(getTiktokenModel(modelName4)).toBe(expectModel4);

  const modelName5 = 'gpt2';
  const expectModel5: TiktokenModel = 'gpt2';
  expect(getTiktokenModel(modelName5)).toBe(expectModel5);
});

test('test encodingForModel', async () => {
  const model: TiktokenModel = 'gpt-3.5-turbo-16k';
  const prompt = 'this is a prompt';

  const tiktoken: Tiktoken = await encodingForModel(model);
  const tokens: number[] = tiktoken.encode(prompt);

  expect(tiktoken.decode(tokens)).toBe(prompt);
  expect(tiktoken.encode(prompt)).toStrictEqual(tokens);
});

test('test getEncoding', async () => {
  const model: TiktokenModel = 'gpt-3.5-turbo-16k';
  const prompt = 'this is a prompt';

  const encoding: TiktokenEncoding = getEncodingNameForModel(model);
  const expectEncoding: TiktokenEncoding = 'cl100k_base';
  expect(encoding).toBe(expectEncoding);

  const tiktoken: Tiktoken = await getEncoding(encoding);
  const newTiktoken: Tiktoken = await encodingForModel(model);

  const tokens: number[] = tiktoken.encode(prompt);

  expect(newTiktoken.decode(tokens)).toBe(prompt);
  expect(newTiktoken.encode(prompt)).toStrictEqual(tokens);
});

test('test getNumTokens', async () => {
  const model = 'gpt-3.5-turbo-16k';
  const prompt = 'this is a prompt';
  // const prompt = "This is a longer text that needs to be split into chunks. It has multiple lines to demonstrate chunking. It is longer to test the multi_lines mode.";

  expect(await getNumTokens(prompt, model)).toBe(4);

  const modelNonExist = 'gpt-399';
  jest.spyOn(global.console, 'warn');
  expect(await getNumTokens(prompt, modelNonExist)).toBe(4);
  expect(console.warn).toHaveBeenCalledTimes(1);
  expect(console.warn).toHaveBeenLastCalledWith(
    'Failed to calculate correct number of tokens, now we use 1 token ~= 4 chars in English for approximate token calculation: Error: Unknown model'
  );
});
