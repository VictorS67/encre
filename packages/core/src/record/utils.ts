import { BaseCallbackHandler, getHandler } from "../callbacks/handlers.js";
import { BaseCallbackManager, Callbacks } from "../callbacks/managers.js";
import { isNotNull } from "../utils/safeTypes.js";
import {
  Callable,
  CallableConfig,
  CallableLambda,
  CallableLike,
  CallableMap,
} from "./callable.js";

export function* consumeIteratorInContext<T>(
  context: Partial<CallableConfig> | undefined,
  iterator: IterableIterator<T>
): IterableIterator<T> {
  while (true) {
    const { value, done } = iterator.next.bind(iterator, context);

    if (done) {
      break;
    }

    yield value;
  }
}

export async function* consumeAsyncIterableInContext<T>(
  context: Partial<CallableConfig> | undefined,
  iterable: AsyncIterable<T>
): AsyncIterableIterator<T> {
  const iterator = iterable[Symbol.asyncIterator]();
  while (true) {
    const { value, done } = await iterator.next.bind(iterable, context);

    if (done) {
      break;
    }

    yield value;
  }
}

export function patchConfig<CallOptions extends CallableConfig>(
  config: Partial<CallOptions> = {},
  newConfig: CallableConfig = {}
): Partial<CallOptions> {
  const patchedConfig: CallableConfig = {
    name: newConfig.name,
    tags: config.tags,
    metadata: config.metadata,
    callbacks: newConfig.callbacks,
  };

  return patchedConfig as CallOptions;
}

export function mergeConfigs<CallOptions extends CallableConfig>(
  ...configs: (CallOptions | CallableConfig | undefined)[]
): Partial<CallOptions> {
  const mergedConfigs: Partial<CallOptions> = {};

  for (const config of configs.filter(isNotNull)) {
    for (const key of Object.keys(config)) {
      if (key === "name") {
        mergedConfigs[key] = config[key] ?? mergedConfigs[key];
      } else if (key === "tags") {
        const keys: string[] = mergedConfigs[key] ?? [];
        mergedConfigs[key] = [...new Set(keys.concat(config[key] ?? []))];
      } else if (key === "metadata") {
        mergedConfigs[key] = { ...mergedConfigs[key], ...config[key] };
      } else if (key === "callbacks") {
        const callbacks: Callbacks | undefined = mergedConfigs[key];
        const newCallbacks: Callbacks | undefined = config[key];

        if (Array.isArray(newCallbacks)) {
          const newHandlers: BaseCallbackHandler[] =
            newCallbacks.map(getHandler);

          if (!callbacks) {
            mergedConfigs[key] = newCallbacks;
          } else if (Array.isArray(callbacks)) {
            const handlers: BaseCallbackHandler[] = callbacks.map(getHandler);
            mergedConfigs[key] = handlers.concat(newHandlers);
          } else {
            const manager: BaseCallbackManager = callbacks.copy();
            for (const handler of newHandlers) {
              manager.addHandler(handler);
            }
            mergedConfigs[key] = manager;
          }
        } else if (newCallbacks) {
          if (!callbacks) {
            mergedConfigs[key] = newCallbacks;
          } else if (Array.isArray(callbacks)) {
            const handlers: BaseCallbackHandler[] = callbacks.map(getHandler);
            const manager: BaseCallbackManager = newCallbacks.copy();
            for (const handler of handlers) {
              manager.addHandler(handler);
            }
            mergedConfigs[key] = manager;
          } else {
            mergedConfigs[key] = BaseCallbackManager.configure(
              callbacks.handlers.concat(newCallbacks.handlers),
              newCallbacks.name ?? callbacks.name,
              [...new Set(callbacks.tags.concat(newCallbacks.tags))],
              { ...callbacks.metadata, ...newCallbacks.metadata }
            );
          }
        }
      }
    }
  }

  return mergedConfigs;
}

export function configureCallbackManager(
  config?: CallableConfig
): BaseCallbackManager | undefined {
  return BaseCallbackManager.configure(
    config?.callbacks,
    config?.name,
    config?.tags,
    config?.metadata
  );
}

export function convertCallableLikeToCallable<CallInput, CallOutput>(
  callableLike: CallableLike<CallInput, CallOutput>
): Callable<CallInput, CallOutput> {
  if (typeof callableLike === "function") {
    return new CallableLambda({ func: callableLike }) as Callable<
      CallInput,
      CallOutput
    >;
  } else if (Callable.isCallable(callableLike)) {
    return callableLike as Callable<CallInput, CallOutput>;
  } else if (!Array.isArray(callableLike) && typeof callableLike === "object") {
    const callables: Record<string, Callable<CallInput>> = {};

    for (const [k, v] of Object.entries(callableLike)) {
      callables[k] = convertCallableLikeToCallable(v);
    }

    return new CallableMap<CallInput>({
      steps: callables,
    }) as Callable<CallInput, CallOutput>;
  } else {
    throw new Error(
      "CANNOT convert to Callable. It requires a function or object."
    );
  }
}

export function isValidLambdaFunc(funcStr: string): boolean {
  // Check for 'input' in the parameters
  const hasInput = /\binput\b/.test(funcStr);

  // Check if the function is asynchronous
  const isFuncAsync = funcStr.trim().startsWith("async");

  // Check for 'return' statement if output is not undefined
  // This is a basic check and assumes output is not explicitly typed as 'undefined'
  const hasReturn = /return\b/.test(funcStr);

  // Check if the function is anonymous or named
  const isFuncAnonymous =
    funcStr.includes("function") || funcStr.includes("=>") || isFuncAsync;

  // Final validation
  if (hasInput && isFuncAnonymous) {
    if (hasReturn || isFuncAsync) {
      return true;
    }
  }

  return false;
}

export function convertLambdaFuncFromStr(funcStr: string) {
  const funcBody: string = funcStr.slice(
    funcStr.indexOf("{") + 1,
    funcStr.lastIndexOf("}")
  );

  const params: string[] = funcStr
    .slice(funcStr.indexOf("(") + 1, funcStr.indexOf(")"))
    .split(",")
    .map((param) => param.trim());

  const isAsync = funcStr.trim().startsWith("async");

  if (isAsync) {
    return new Function(
      ...params,
      `return (async function(${params.join(
        ", "
      )}) {${funcBody}}).apply(this, [${params.join(", ")}])`
    );
  }

  return new Function(...params, funcBody);
}

export function formatLambdaFuncStr(funcStr: string, isAsyncFunc: boolean) {
  const funcBody: string = funcStr.slice(
    funcStr.indexOf("{") + 1,
    funcStr.lastIndexOf("}")
  );

  const params: string[] = funcStr
    .slice(funcStr.indexOf("(") + 1, funcStr.indexOf(")"))
    .split(",")
    .map((param) => param.trim());

  const isAsync = funcStr.trim().startsWith("async") || isAsyncFunc;

  return `${isAsync ? "async" : ""} (${params.join(", ")}) => {
${funcBody}
}`.trim();
}
