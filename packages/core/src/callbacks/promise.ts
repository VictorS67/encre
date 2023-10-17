let queue: (typeof import('p-queue'))['default']['prototype'];

export function awaitAllCallbacks(): Promise<void> {
  return typeof queue !== 'undefined' ? queue.onIdle() : Promise.resolve();
}
