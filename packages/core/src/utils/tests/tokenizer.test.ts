import { expect, test } from '@jest/globals';
import { Tiktoken, TiktokenEncoding, TiktokenModel, getEncodingNameForModel } from 'js-tiktoken';
import { encodingForModel, getEncoding, getTiktokenModel } from '../tokenizer';

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
