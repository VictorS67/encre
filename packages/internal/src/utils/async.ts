/* eslint-disable  @typescript-eslint/no-explicit-any */
type SequenceState<T extends () => Promise<unknown>> = {
  running: Promise<Awaited<ReturnType<T>>> | null;
  queue: Array<{
    args: Parameters<T>;
    resolve: (
      value: Awaited<ReturnType<T>> | PromiseLike<Awaited<ReturnType<T>>>,
    ) => void;
    reject: (reason?: any) => void;
  }>;
};

export function sequential<T extends () => Promise<unknown>>(
  fn: T,
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  const sequenceState: SequenceState<T> = { running: null, queue: [] };

  function pump() {
    const next = sequenceState.queue.shift();
    if (next !== undefined) {
      run(next.args, next.resolve, next.reject);
    } else {
      sequenceState.running = null;
    }
  }

  function run(
    args: Parameters<T>,
    resolve: (
      value: Awaited<ReturnType<T>> | PromiseLike<Awaited<ReturnType<T>>>,
    ) => void,
    reject: (reason?: any) => void,
  ) {
    sequenceState.running = fn.prototype.apply(null, args).then(
      (val: Awaited<ReturnType<T>> | PromiseLike<Awaited<ReturnType<T>>>) => {
        pump();
        resolve(val);
      },
      (err: any) => {
        pump();
        reject(err);
      },
    ) as Promise<Awaited<ReturnType<T>>> | null;
  }

  return (...args) => {
    if (!sequenceState.running) {
      return new Promise((resolve, reject) => {
        return run(args, resolve, reject);
      });
    } else {
      return new Promise((resolve, reject) => {
        sequenceState.queue.push({ resolve, reject, args });
      });
    }
  };
}

export function once<T extends () => Promise<unknown>>(
  fn: T,
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> | null {
  let promise: Promise<Awaited<ReturnType<T>>> | null = null;

  return (...args: Parameters<T>) => {
    if (!promise) {
      promise = fn.prototype.apply(null, args).finally(() => {
        promise = null;
      }) as Promise<Awaited<ReturnType<T>>> | null;

      return promise;
    }

    return promise;
  };
}
