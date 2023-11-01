import { expect, test } from '@jest/globals';
import { ReadableStreamAsyncIterable } from '../stream.js';

test('test stream async iterator in for loop', async () => {
  const testArray: number[] = [1, 2, 3];

  const asyncGenerator = async function* () {
    for (const item of testArray) {
      yield item;
    }
  };

  const stream = ReadableStreamAsyncIterable.withAsyncGenerator(
    asyncGenerator()
  );

  let index = 0;
  for await (const value of stream) {
    expect(value).toBe(testArray[index]);
    index++;
  }
});

test('test stream async iterator with next', async () => {
  const testArray: number[] = [1, 2, 3];

  const asyncGenerator = async function* () {
    for (const item of testArray) {
      yield item;
    }
  };

  const stream = ReadableStreamAsyncIterable.withAsyncGenerator(
    asyncGenerator()
  );

  const reader = stream.acquireReader();
  expect(reader).toBeDefined();

  const result = await stream.next();
  expect(result.value).toBe(testArray[0]);
  expect(result.done).toBeFalsy();

  await stream.next();
  await stream.next();
  const end = await stream.next();
  expect(end.done).toBeTruthy();
});

test('test stream with early canceling', async () => {
  const testArray: number[] = [1, 2, 3];

  const asyncGenerator = async function* () {
    for (const item of testArray) {
      yield item;
    }
  };

  const stream = ReadableStreamAsyncIterable.withAsyncGenerator(
    asyncGenerator()
  );

  const reason = 'canceled for testing';
  const result = await stream.return(reason);
  expect(result.done).toBeTruthy();
});
