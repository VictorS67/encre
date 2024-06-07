import { Generation } from '../events/output/provide/generation.js';
import { BaseCache, getCacheKey } from './base.js';

const GLOBAL_MAP = new Map();

/**
 * A generic caching mechanism that stores data in memory using a `Map`.
 * This cache is suitable for applications that need rapid access to precomputed data,
 * such as generated outputs or processed results, reducing the need for repetitive computations.
 *
 * @template T The type of data stored in the cache defaults to an array of {@link Generation} objects.
 * 
 * @example
 * ```typescript
 * const cache = new MemoryCache(new Map([['key_1', 'value1']]));
 * const result = await cache.lookup(['key', '1']);
 * console.log(result); // Output: 'value1'
 * ```
 */
export class MemoryCache<T = Generation[]> extends BaseCache<T> {
  /**
   * The internal map that stores cached values. The keys are string identifiers, and the values are of type T.
   */
  private _cache: Map<string, T>;

  /**
   * Constructs a new instance of MemoryCache.
   * @param map An optional pre-existing map to initialize the cache, allowing for shared or isolated cache instances.
   */
  constructor(map?: Map<string, T>) {
    super();
    this._cache = map ?? new Map();
  }

  /**
   * Looks up a value in the cache based on an array of strings that are concatenated to form a cache key.
   * The lookup is a fast operation, leveraging the map's native get method.
   *
   * @param keysStr An array of strings that will be concatenated and hashed to form the cache key.
   * @returns A promise that resolves to the cached value or null if the key is not present in the cache.
   */
  public async lookup(keysStr: string[]): Promise<T | null> {
    return Promise.resolve(this._cache.get(getCacheKey(keysStr)) ?? null);
  }

  /**
   * Updates or adds a new value in the cache with the specified key formed from the array of strings.
   * This operation is also fast and ensures that subsequent retrievals using the same key will return the updated value.
   *
   * @param keysStr An array of strings that will be concatenated and hashed to form the cache key.
   * @param value The value to store in the cache.
   * @returns A promise that resolves once the value is set in the cache.
   */
  public async update(keysStr: string[], value: T): Promise<void> {
    this._cache.set(getCacheKey(keysStr), value);
  }

  /**
   * Provides a static method to access a global shared cache instance. This is useful for scenarios where
   * a single cache instance is sufficient and shared across different parts of the application.
   *
   * @template T The type of data the global cache will store.
   * @returns An instance of MemoryCache with a global shared map.
   */
  static global<T>(): MemoryCache<T> {
    return new MemoryCache(GLOBAL_MAP);
  }
}
