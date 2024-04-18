/**
 * Type safe version of Object.entries()
 */
export function entries<K extends string, V>(obj: Record<K, V>): [K, V][] {
  return Object.entries(obj) as [K, V][];
}

/**
 * Type safe version of Object.keys()
 */
export function keys<K extends string>(obj: Record<K, any>): K[] {
  return Object.keys(obj) as K[];
}

/**
 * Type safe version of Object.values()
 */
export function values<V>(obj: Record<string, V>): V[] {
  return Object.values(obj) as V[];
}

export function isNotNull<T>(value: T | undefined | null): value is T {
  return value != null;
}

export function typeOf<T>(): T {
  return undefined! as T;
}
