import { LRUCache } from 'lru-cache';

import { EncreData } from './types';

export interface EncreCache {
  get: (
    graphId: string,
    nodeId: string,
  ) => [string, Record<string, EncreData>] | undefined;

  has: (graphId: string, nodeId: string) => boolean;

  set: (
    graphId: string,
    nodeId: string,
    data: [string, Record<string, EncreData>] | undefined,
  ) => void;
}

export const encreCache = (): EncreCache => {
  const ref = new LRUCache<string, [string, Record<string, EncreData>]>({
    maxSize: 500,
    sizeCalculation: (value) => {
      return JSON.stringify(value).length;
    },
  });

  const set = (
    graphId: string,
    nodeId: string,
    data: [string, Record<string, EncreData>] | undefined,
  ) => {
    ref.set(`${graphId}-${nodeId}`, data);
  };

  const get = (graphId: string, nodeId: string) => {
    return ref.get(`${graphId}-${nodeId}`);
  };

  const has = (graphId: string, nodeId: string) => {
    return ref.has(`${graphId}-${nodeId}`);
  };

  return { set, get, has } satisfies EncreCache;
};
