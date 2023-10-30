import { expect, test } from '@jest/globals';
import { BaseCache, getCacheKey } from '../base';

test('test custom BaseCache', async () => {
  const GLOBAL_MAP = new Map();

  class TestCache<T = string> extends BaseCache<T> {
    private _cache: Map<string, T>;

    constructor(map?: Map<string, T>) {
      super();
      this._cache = map ?? new Map();
    }

    async lookup(keysStr: string[]): Promise<T | null> {
      return Promise.resolve(this._cache.get(getCacheKey(keysStr)) ?? null);
    }

    async update(keysStr: string[], value: T): Promise<void> {
      this._cache.set(getCacheKey(keysStr), value);
    }

    static global(): TestCache {
      return new TestCache(GLOBAL_MAP);
    }
  }

  const cache: TestCache = TestCache.global();

  const keys: string[] = ['This', 'is', 'a', 'key'];
  const value = 'This is a value';

  expect(await cache.lookup(keys)).toBe(null);

  await cache.update(keys, value);
  expect(await cache.lookup(keys)).toBe('This is a value');
});
