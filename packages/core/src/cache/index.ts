import { Generation } from '../events/output/provide/generation.js';
import { BaseCache, getCacheKey } from './base.js';

const GLOBAL_MAP = new Map();

export class MemoryCache<T = Generation[]> extends BaseCache<T> {
  private _cache: Map<string, T>;

  constructor(map?: Map<string, T>) {
    super();
    this._cache = map ?? new Map();
  }

  public async lookup(keysStr: string[]): Promise<T | null> {
    return Promise.resolve(this._cache.get(getCacheKey(keysStr)) ?? null);
  }

  public async update(keysStr: string[], value: T): Promise<void> {
    this._cache.set(getCacheKey(keysStr), value);
  }

  static global<T>(): MemoryCache<T> {
    return new MemoryCache(GLOBAL_MAP);
  }
}
