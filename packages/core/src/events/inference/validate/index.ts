// Note: the argument `variables` is always in JSON object type, which 
// contains any metadata that used for validation.
// You can think as variables has type `Record<string, unknown>`. The `any`
// type here is for convenience of specifying key-value pairs' types in `variables`.
export type ValidateFunc<T = any> = (
  input: T,
  variables?: any
) => Promise<boolean>;

/**
 * Type definition for the result of a validation operation.
 * If the validation does not pass (`isValid` is `false`), the `errorMessage` should describe the issue.
 */
export type ValidateResult = { 
  /**
   * A boolean indicating whether the validation passed.
   */
  isValid: boolean; 

  /**
   *  An optional string containing a message describing why the validation failed, present only when `isValid` is `false`.
   */
  errorMessage?: string 
};
