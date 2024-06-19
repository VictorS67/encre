import { type SerializedRule } from '../../../../serde.js';
import { BaseRule } from './base.js';

/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */

/**
 * A specialized rule class designed for handling array-based validations.
 * This class provides various static methods to create array-specific validation.
 *
 * @template T The type of input data the rule will validate, defaulting to Array of unknown.
 * 
 * @example
 * ```typescript
 * const rule = new ArrayRule({
 *   description: 'has all 0s',
 *   func: await (input: Array<unknown>) => input.every((i) => i === 0)
 * });
 * ```
 */
export class ArrayRule<T extends unknown = Array<unknown>> extends BaseRule<T> {
  _isSerializable = true;

  static _name(): string {
    return 'ArrayRule';
  }

  /**
   * Specifies the rule type. For `ArrayRule`, the type is explicitly "array".
   * @returns The type identifier for this rule class.
   */
  _ruleType(): 'array' {
    return 'array';
  }

  /**
   * Combines two array rules into one using a specified logical conjunction ('and' or 'or').
   * @param rule The rule to concatenate with the current rule.
   * @param conjunction The type of logical conjunction to apply ('and' | 'or').
   * @returns A new `ArrayRule` instance representing the combined rule.
   */
  concat<U>(rule: BaseRule<U>, conjunction: 'or' | 'and'): BaseRule<T | U> {
    return new ArrayRule<T | U>({
      description: ArrayRule._mergeDescription(
        this as BaseRule<unknown>,
        rule as BaseRule<unknown>,
        conjunction
      ),
      variables: ArrayRule._mergeVariables(
        this as BaseRule,
        rule as BaseRule<unknown>
      ),
      func: ArrayRule._mergeFunc(
        this as BaseRule,
        rule as BaseRule,
        conjunction
      ),
      metadata: ArrayRule._mergeMetadata(
        this as BaseRule,
        rule as BaseRule,
        conjunction
      ),
    });
  }

  /**
   * Deserializes a serialized rule object into an `ArrayRule` instance.
   * @param serialized The serialized rule data.
   * @param values Optional additional values to merge into the rule's variables.
   * @returns A promise that resolves to a new instance of `ArrayRule`.
   */
  static async deserialize(
    serialized: SerializedRule,
    values?: Record<string, unknown>
  ): Promise<ArrayRule<Array<unknown>>> {
    const arrayRuleFields = {
      description: serialized.description,
      func: serialized.func,
      variables: {
        ...serialized.variables,
        ...values,
      },
    };

    return new ArrayRule(arrayRuleFields);
  }

  /**
   * Creates a rule to check if an array exists (is not undefined).
   * @returns A `ArrayRule` instance to check if the array is not undefined.
   * @example
   * // Usage
   * const existsRule = ArrayRule.exists();
   * console.log(existsRule.func([1, 2, 3])); // Outputs: true
   * console.log(existsRule.func(undefined)); // Outputs: false
   */
  static exists() {
    return new ArrayRule<Array<unknown> | undefined>({
      description: 'exists',
      func: async (input: Array<unknown> | undefined) => {
        return input !== undefined;
      },
    });
  }

  /**
   * Creates a rule to check if an array does not exist (is undefined).
   * @returns A `ArrayRule` instance to check if the array is undefined.
   * @example
   * // Usage
   * const doesNotExistRule = ArrayRule.doesNotExist();
   * console.log(doesNotExistRule.func(undefined)); // Outputs: true
   * console.log(doesNotExistRule.func([1, 2, 3])); // Outputs: false
   */
  static doesNotExist() {
    return new ArrayRule<Array<unknown> | undefined>({
      description: 'does not exist',
      func: async (input: Array<unknown> | undefined) => {
        return input === undefined;
      },
    });
  }

  /**
   * Creates a rule to check if an array is strictly equal to a specified array.
   * This includes checking the equality of all elements in the array.
   * @param value The array to compare against.
   * @returns A `ArrayRule` instance to perform the equality check.
   * @example
   * // Usage
   * const isEqualRule = ArrayRule.isStrictlyEqual([1, 2, 3]);
   * console.log(isEqualRule.func([1, 2, 3])); // Outputs: true
   * console.log(isEqualRule.func([1, 2])); // Outputs: false
   */
  static isStrictlyEqual(value?: Array<unknown>) {
    return new ArrayRule<Array<unknown>>({
      description: 'is equal to {{value}}',
      variables: { value },
      func: async (
        input: Array<unknown>,
        variables: { value: Array<unknown> }
      ) => {
        const areArraysStrictlyEqual = (
          arr1: Array<unknown>,
          arr2: Array<unknown>
        ): boolean => {
          if (arr1.length !== arr2.length) {
            return false;
          }

          for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
              return false;
            }
          }

          return true;
        };

        return areArraysStrictlyEqual(input, variables.value);
      },
    });
  }

  /**
   * Creates a rule to check if an array is not strictly equal to a specified array.
   * This includes checking the inequality of any element in the array.
   * @param value The array to compare against.
   * @returns A `ArrayRule` instance to perform the inequality check.
   * @example
   * // Usage
   * const isNotEqualRule = ArrayRule.isNotStrictlyEqual([1, 2, 3]);
   * console.log(isNotEqualRule.func([1, 2])); // Outputs: true
   * console.log(isNotEqualRule.func([1, 2, 3])); // Outputs: false
   */
  static isNotStrictlyEqual(value?: Array<unknown>) {
    return new ArrayRule<Array<unknown>>({
      description: 'is not equal to {{value}}',
      variables: { value },
      func: async (
        input: Array<unknown>,
        variables: { value: Array<unknown> }
      ) => {
        const areArraysStrictlyEqual = (
          arr1: Array<unknown>,
          arr2: Array<unknown>
        ): boolean => {
          if (arr1.length !== arr2.length) {
            return false;
          }

          for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
              return false;
            }
          }

          return true;
        };

        return !areArraysStrictlyEqual(input, variables.value);
      },
    });
  }

  /**
   * Creates a rule to check if an array contains a specific value.
   * @param value The value to check for within the array.
   * @returns A `ArrayRule` instance to check if the value is contained in the array.
   * @example
   * // Usage
   * const containsRule = ArrayRule.contains(2);
   * console.log(containsRule.func([1, 2, 3])); // Outputs: true
   * console.log(containsRule.func([4, 5, 6])); // Outputs: false
   */
  static contains(value?: unknown) {
    return new ArrayRule<Array<unknown>>({
      description: 'contains {{value}}',
      variables: { value },
      func: async (input: Array<unknown>, variables: { value: unknown }) => {
        return input.includes(variables.value);
      },
    });
  }

  /**
   * Creates a rule to check if an array does not contain a specific value.
   * @param value The value to check for within the array.
   * @returns A `ArrayRule` instance to check if the value is not contained in the array.
   * @example
   * // Usage
   * const doesNotContainRule = ArrayRule.doesNotContain(2);
   * console.log(doesNotContainRule.func([4, 5, 6])); // Outputs: true
   * console.log(doesNotContainRule.func([1, 2, 3])); // Outputs: false
   */
  static doesNotContain(value?: unknown) {
    return new ArrayRule<Array<unknown>>({
      description: 'does not contain {{value}}',
      variables: { value },
      func: async (input: Array<unknown>, variables: { value: unknown }) => {
        return !input.includes(variables.value);
      },
    });
  }

  /**
   * Creates a rule to check if an array's length is exactly equal to a specified value.
   * @param value The length value to compare against the array's length.
   * @returns A `ArrayRule` instance to perform the equality check on the length.
   * @example
   * // Usage
   * const lengthEqualRule = ArrayRule.lengthEqual(3);
   * console.log(lengthEqualRule.func([1, 2, 3])); // Outputs: true
   * console.log(lengthEqualRule.func([1, 2])); // Outputs: false
   */
  static lengthEqual(value?: number) {
    return new ArrayRule<Array<unknown>>({
      description: 'length equal to {{value}}',
      variables: { value },
      func: async (input: Array<unknown>, variables: { value: number }) => {
        return input.length === variables.value;
      },
    });
  }

  /**
   * Creates a rule to check if an array's length is not equal to a specified value.
   * @param value The length value to compare against the array's length.
   * @returns A `ArrayRule` instance to perform the inequality check on the length.
   * @example
   * // Usage
   * const lengthNotEqualRule = ArrayRule.lengthNotEqual(3);
   * console.log(lengthNotEqualRule.func([1, 2, 3])); // Outputs: false
   * console.log(lengthNotEqualRule.func([1, 2, 3, 4])); // Outputs: true
   */
  static lengthNotEqual(value?: number) {
    return new ArrayRule<Array<unknown>>({
      description: 'length not equal to {{value}}',
      variables: { value },
      func: async (input: Array<unknown>, variables: { value: number }) => {
        return input.length !== variables.value;
      },
    });
  }

  /**
   * Creates a rule to check if an array's length is greater than a specified value.
   * @param value The minimum length value the array should exceed.
   * @returns A `ArrayRule` instance to check if the array's length is greater than the specified value.
   * @example
   * // Usage
   * const lengthGreaterThanRule = ArrayRule.lengthGreaterThan(2);
   * console.log(lengthGreaterThanRule.func([1, 2, 3])); // Outputs: true
   * console.log(lengthGreaterThanRule.func([1])); // Outputs: false
   */
  static lengthGreaterThan(value?: number) {
    return new ArrayRule<Array<unknown>>({
      description: 'length greater than {{value}}',
      variables: { value },
      func: async (input: Array<unknown>, variables: { value: number }) => {
        return input.length > variables.value;
      },
    });
  }

  /**
   * Creates a rule to check if an array's length is less than a specified value.
   * @param value The maximum length value the array should not exceed.
   * @returns A `ArrayRule` instance to check if the array's length is less than the specified value.
   * @example
   * // Usage
   * const lengthLessThanRule = ArrayRule.lengthLessThan(3);
   * console.log(lengthLessThanRule.func([1, 2])); // Outputs: true
   * console.log(lengthLessThanRule.func([1, 2, 3])); // Outputs: false
   */
  static lengthLessThan(value?: number) {
    return new ArrayRule<Array<unknown>>({
      description: 'length less than {{value}}',
      variables: { value },
      func: async (input: Array<unknown>, variables: { value: number }) => {
        return input.length < variables.value;
      },
    });
  }

  /**
   * Creates a rule to check if an array's length is greater than or equal to a specified value.
   * @param value The minimum length value the array should meet or exceed.
   * @returns A `ArrayRule` instance to check if the array's length is greater than or equal to the specified value.
   * @example
   * // Usage
   * const lengthGreaterThanOrEqualRule = ArrayRule.lengthGreaterThanOrEqual(3);
   * console.log(lengthGreaterThanOrEqualRule.func([1, 2, 3])); // Outputs: true
   * console.log(lengthGreaterThanOrEqualRule.func([1, 2])); // Outputs: false
   */
  static lengthGreaterThanOrEqual(value?: number) {
    return new ArrayRule<Array<unknown>>({
      description: 'length greater than or equal {{value}}',
      variables: { value },
      func: async (input: Array<unknown>, variables: { value: number }) => {
        return input.length >= variables.value;
      },
    });
  }

  /**
   * Creates a rule to check if an array's length is less than or equal to a specified value.
   * @param value The maximum length value the array should meet or not exceed.
   * @returns A `ArrayRule` instance to check if the array's length is less than or equal to the specified value.
   * @example
   * // Usage
   * const lengthLessThanOrEqualRule = ArrayRule.lengthLessThanOrEqual(2);
   * console.log(lengthLessThanOrEqualRule.func([1, 2])); // Outputs: true
   * console.log(lengthLessThanOrEqualRule.func([1, 2, 3])); // Outputs: false
   */
  static lengthLessThanOrEqual(value?: number) {
    return new ArrayRule<Array<unknown>>({
      description: 'length less than or equal {{value}}',
      variables: { value },
      func: async (input: Array<unknown>, variables: { value: number }) => {
        return input.length <= variables.value;
      },
    });
  }
}
