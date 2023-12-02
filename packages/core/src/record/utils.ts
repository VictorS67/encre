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

export function isValidLambdaFunc(funcStr: string): boolean {
  // Check for 'input' in the parameters
  const hasInput = /\binput\b/.test(funcStr);

  // Check if the function is asynchronous
  const isFuncAsync = funcStr.trim().startsWith('async');

  // Check for 'return' statement if 'CallOutput' is not undefined
  // This is a basic check and assumes 'CallOutput' is not explicitly typed as 'undefined'
  const hasReturn = /return\b/.test(funcStr);

  // Check if the function is anonymous or named
  const isFuncAnonymous =
    funcStr.includes('function') || funcStr.includes('=>') || isFuncAsync;

  // Final validation
  if (hasInput && isFuncAnonymous) {
    if (hasReturn || isFuncAsync) {
      return true;
    }
  }

  return false;
}
