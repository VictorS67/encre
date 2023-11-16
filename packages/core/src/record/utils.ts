import {
  Callable,
  CallableLambda,
  CallableLike,
  CallableMap,
} from './callable';

export function convertCallableLikeToCallable<CallInput, CallOutput>(
  callableLike: CallableLike<CallInput, CallOutput>
): Callable<CallInput, CallOutput> {
  if (typeof callableLike === 'function') {
    return new CallableLambda({ func: callableLike }) as Callable<
      CallInput,
      CallOutput
    >;
  } else if (Callable.isCallable(callableLike)) {
    return callableLike as Callable<CallInput, CallOutput>;
  } else if (!Array.isArray(callableLike) && typeof callableLike === 'object') {
    const callables: Record<string, Callable<CallInput>> = {};

    for (const [k, v] of Object.entries(callableLike)) {
      callables[k] = convertCallableLikeToCallable(v);
    }

    return new CallableMap<CallInput>({
      steps: callables,
    }) as Callable<CallInput, CallOutput>;
  } else {
    throw new Error(
      'CANNOT convert to Callable. It requires a function or object.'
    );
  }
}
