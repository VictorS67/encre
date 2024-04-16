// Note: the argument `variables` is always in JSON object type, which 
// contains any metadata that used for validation.
// You can think as variables has type `Record<string, unknown>`. The `any`
// type here is for convenience of specifying key-value pairs' types in `variables`.
export type ValidateFunc<T = any> = (
  input: T,
  variables?: any
) => Promise<boolean>;

// This is the result for all validators. When the validation does not pass
// (e.g. `isValid` is False), then the `errorMessage` is non-empty.
export type ValidateResult = { isValid: boolean; errorMessage?: string };
