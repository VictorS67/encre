import hash from 'object-hash';
import { Generation } from '../events/output/provide/generation.js';

/**
 * An abstract class that defines the basic operations for a caching system.
 * Implementations of this class must provide methods for looking up and updating cache entries.
 * This class facilitates the creation of various types of caches by defining a consistent interface.
 *
 * @template T The type of data stored in the cache. By default, it is an array of {@link Generation} objects,
 * but it can be any type depending on the implementation's requirements.
 */
export abstract class BaseCache<T = Generation[]> {
  /**
   * Retrieves a value from the cache based on a generated key from an array of strings.
   * Implementations must define how the lookup is handled, including how keys are translated and how missing keys are treated.
   *
   * @param keysStr An array of strings that uniquely identifies the cache entry.
   * @returns A promise that resolves to the cached value if found, or null if no entry exists for the provided key.
   */
  abstract lookup(keysStr: string[]): Promise<T | null>;

  /**
   * Updates or adds a value in the cache identified by a generated key from an array of strings.
   * Implementations must define how updates are managed, ensuring that existing entries are replaced or new entries are added.
   *
   * @param keysStr An array of strings that uniquely identifies the cache entry.
   * @param value The value to be stored in the cache.
   * @returns A promise that resolves once the cache is updated.
   */
  abstract update(keysStr: string[], value: T): Promise<void>;
}

/**
 * Generates a unique key for cache entries based on an array of strings. This function uses the `object-hash` library
 * to create a consistent and unique hash from the concatenated string values, which serves as the cache key.
 *
 * The hash function is designed to produce a repeatable output for the same input, ensuring that the keys are consistent
 * across different executions and environments.
 *
 * @param keysStr An array of strings that will be concatenated with an underscore ('_') and hashed to form the cache key.
 * @returns A string representing the hashed value of the concatenated strings, used as the cache key.
 */
export function getCacheKey(keysStr: string[]): string {
  return hash(keysStr.join('_'));
}
