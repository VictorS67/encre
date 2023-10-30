import { expect, test } from '@jest/globals';
import { Generation } from '../../events/output/provide/generation.js';
import { MemoryCache } from '../index.js';

test('test MemoryCache', async () => {
  const cache: MemoryCache = MemoryCache.global();

  const keys: string[] = ['This', 'is', 'a', 'key'];
  const value: Generation[] = [
    {
      output: 'this is a text output',
      info: {
        index: 0,
      },
    },
    {
      output: 'this is another text output',
      info: {
        index: 1,
      },
    },
  ];

  expect(await cache.lookup(keys)).toBe(null);

  await cache.update(keys, value);
  expect(await cache.lookup(keys)).toStrictEqual([
    {
      output: 'this is a text output',
      info: {
        index: 0,
      },
    },
    {
      output: 'this is another text output',
      info: {
        index: 1,
      },
    },
  ]);
});
