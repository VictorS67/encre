import { expect, jest, test } from '@jest/globals';
import { AsyncCaller } from '../asyncCaller';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test('test asyncCaller Abort', async () => {
  jest.setTimeout(1000);
  const caller = new AsyncCaller({});

  async function testFunc(test: string) {
    await delay(100);
    return test;
  }

  const result = await caller.call(testFunc, 'test');

  expect(result).toBe('test');

  const controller = new AbortController();

  async function alwaysFail() {
    throw new Error('I should fail');
  }

  setTimeout(() => {
		controller.abort();
	}, 0);

  await expect(
    caller.callWithOptions({ signal: controller.signal }, alwaysFail)
  ).rejects.toThrow('AbortError');

  const controller2 = new AbortController();

  setTimeout(() => {
		controller2.abort();
	}, 500);

  await expect(caller.callWithOptions({ signal: controller2.signal }, testFunc, 'test')
  ).resolves.toBe('test');
});
