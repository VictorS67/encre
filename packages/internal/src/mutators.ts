import { HandlerFunctions } from "./handlers";
import { sequential } from "./utils/async";

/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */
const runningMethods = new Set();
const mutatingMethods = new WeakMap();

let currentContext = null;
let _lastestHandlerNames: Array<string | undefined> = [];

export function mutator<T extends HandlerFunctions>(handler: T): T {
  mutatingMethods.set(handler, true);
  return handler;
}

export function isMutating<T extends HandlerFunctions>(handler: T) {
  return mutatingMethods.has(handler);
}

export async function runHandler<T extends HandlerFunctions>(
  handler: T,
  args?: Parameters<T>[0],
  { undoTag, name }: { undoTag?: string; name?: string } = {},
): Promise<Awaited<ReturnType<T>>> {
  _lastestHandlerNames.push(name);
  if (_lastestHandlerNames.length > 5) {
    _lastestHandlerNames = _lastestHandlerNames.slice(-5);
  }

  if (mutatingMethods.has(handler)) {
    return runMutator(() => handler(args as any), { undoTag }) as Promise<
      Awaited<ReturnType<T>>
    >;
  }

  const promise = handler(args as any);
  runningMethods.add(promise);
  promise.then(() => {
    runningMethods.delete(promise);
  });

  return promise as Promise<Awaited<ReturnType<T>>>;
}

function _runMutator<T extends () => Promise<unknown>>(
  func: T,
  initContext = {},
): Promise<Awaited<ReturnType<T>>> {
  currentContext = initContext;

  return func().finally(() => {
    currentContext = null;
  }) as Promise<Awaited<ReturnType<T>>>;
}

export const runMutator = sequential(
  _runMutator as () => Promise<unknown>,
) as typeof _runMutator;
