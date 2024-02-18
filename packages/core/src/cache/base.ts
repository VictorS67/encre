import hash from 'object-hash';
import { Generation } from '../events/output/provide/generation.js';

export abstract class BaseCache<T = Generation[]> {
  abstract lookup(keysStr: string[]): Promise<T | null>;

  abstract update(keysStr: string[], value: T): Promise<void>;
}

export function getCacheKey(keysStr: string[]): string {
  return hash(keysStr.join('_'));
}
