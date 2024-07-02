export function init(opts?: { persist?: boolean }): void;
export type Init = typeof init;

export function get(key: string): Promise<string>;
export type Get = typeof get;

export function set(key: string, value: unknown): void;
export type Set = typeof set;

export function remove(key: string): void;
export type Remove = typeof remove;

export function multiGet(keys: string[]): Promise<[string, string][]>;
export type MultiGet = typeof multiGet;

export function multiSet(keyValues: [string, unknown][]): void;
export type MultiSet = typeof multiSet;

export function multiRemove(keys: string[]): void;
export type MultiRemove = typeof multiRemove;
