export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export function isNotNull<T>(value: T | undefined | null): value is T {
  return value != null;
}

export function isRecordStringUnknown(
  value: any
): value is Record<string, unknown> {
  // First check if the item is an object and not null
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  // Ensure the item is not an array or a Date object
  if (Array.isArray(value) || value instanceof Date) {
    return false;
  }

  // Check if all keys are strings (this is usually true for objects in JavaScript)
  return Object.keys(value).every((key) => typeof key === 'string');
}