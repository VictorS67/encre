import PQueue from "p-queue";

let queue: (typeof import("p-queue"))["default"]["prototype"];

function initQueue() {
  return new PQueue({
    autoStart: true,
    concurrency: 1,
  });
}

export async function consumeCallback<T>(
  promiseFn: () => Promise<T> | T | void,
  shouldWait: boolean
): Promise<void> {
  if (shouldWait === true) {
    await promiseFn();
  } else {
    if (typeof queue === "undefined") {
      queue = initQueue();
    }

    void queue.add(promiseFn);
  }
}

export function awaitAllCallbacks(): Promise<void> {
  return typeof queue !== "undefined" ? queue.onIdle() : Promise.resolve();
}
