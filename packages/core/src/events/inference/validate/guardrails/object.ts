import { type SerializedRule } from '../../../../serde.js';
import { BaseRule } from './base.js';

/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */

/**
 * A specialized rule class designed for handling object-based validations.
 * This class provides various static methods to create object-specific validation.
 *
 * @template T The type of input data the rule will validate, defaulting to object.
 * 
 * @example
 * ```typescript
 * const rule = new JSONObjectRule({
 *   description: `has key 'name'`,
 *   func: await (input: object) => 'name' in input
 * });
 * ```
 */
export class JSONObjectRule<T extends unknown = object> extends BaseRule<T> {
  _isSerializable = true;

  static _name(): string {
    return 'JSONObjectRule';
  }

  /**
   * Specifies the rule type. For `JSONObjectRule`, the type is explicitly "object".
   * @returns The type identifier for this rule class.
   */
  _ruleType(): 'object' {
    return 'object';
  }

  /**
   * Combines two JSON object rules into one using a specified logical conjunction ('and' or 'or').
   * @param rule The rule to concatenate with the current rule.
   * @param conjunction The type of logical conjunction to apply ('and' | 'or').
   * @returns A new `JSONObjectRule` instance representing the combined rule.
   */
  concat<U>(rule: BaseRule<U>, conjunction: 'or' | 'and'): BaseRule<T | U> {
    return new JSONObjectRule<T | U>({
      description: JSONObjectRule._mergeDescription(
        this as BaseRule,
        rule as BaseRule,
        conjunction
      ),
      variables: JSONObjectRule._mergeVariables(
        this as BaseRule,
        rule as BaseRule
      ),
      func: JSONObjectRule._mergeFunc(
        this as BaseRule,
        rule as BaseRule,
        conjunction
      ),
      metadata: JSONObjectRule._mergeMetadata(
        this as BaseRule,
        rule as BaseRule,
        conjunction
      ),
    });
  }

  /**
   * Deserializes a serialized rule object into a `JSONObjectRule` instance.
   * @param serialized The serialized rule data.
   * @param values Optional additional values to merge into the rule's variables.
   * @returns A promise that resolves to a new instance of `JSONObjectRule`.
   */
  static async deserialize(
    serialized: SerializedRule,
    values?: Record<string, unknown>
  ): Promise<JSONObjectRule<object>> {
    const objectRuleFields = {
      description: serialized.description,
      func: serialized.func,
      variables: {
        ...serialized.variables,
        ...values,
      },
    };

    return new JSONObjectRule(objectRuleFields);
  }

  /**
   * Creates a rule to check if a JSON object exists (is not undefined).
   * @returns A `JSONObjectRule` instance to check if the object is not undefined.
   * @example
   * // Usage
   * const existsRule = JSONObjectRule.exists();
   * console.log(existsRule.func({})); // Outputs: true
   * console.log(existsRule.func(undefined)); // Outputs: false
   */
  static exists() {
    return new JSONObjectRule<object | undefined>({
      description: 'exists',
      func: async (input: object | undefined) => {
        return input !== undefined;
      },
    });
  }

/**
   * Creates a rule to check if a JSON object does not exist (is undefined).
   * @returns A `JSONObjectRule` instance to check if the object is undefined.
   * @example
   * // Usage
   * const doesNotExistRule = JSONObjectRule.doesNotExist();
   * console.log(doesNotExistRule.func(undefined)); // Outputs: true
   * console.log(doesNotExistRule.func({})); // Outputs: false
   */
  static doesNotExist() {
    return new JSONObjectRule<object | undefined>({
      description: 'does not exist',
      func: async (input: object | undefined) => {
        return input === undefined;
      },
    });
  }

  /**
   * Creates a rule to check if a JSON object is empty.
   * @returns A `JSONObjectRule` instance to check if the object has no keys.
   * @example
   * // Usage
   * const isEmptyRule = JSONObjectRule.isEmpty();
   * console.log(isEmptyRule.func({})); // Outputs: true
   * console.log(isEmptyRule.func({ key: 'value' })); // Outputs: false
   */
  static isEmpty() {
    return new JSONObjectRule<object>({
      description: 'is empty',
      func: async (input: object) => {
        return Object.keys(input).length === 0;
      },
    });
  }

  /**
   * Creates a rule to check if a JSON object is not empty.
   * @returns A `JSONObjectRule` instance to check if the object has keys.
   * @example
   * // Usage
   * const isNotEmptyRule = JSONObjectRule.isNotEmpty();
   * console.log(isNotEmptyRule.func({ key: 'value' })); // Outputs: true
   * console.log(isNotEmptyRule.func({})); // Outputs: false
   */
  static isNotEmpty() {
    return new JSONObjectRule<object>({
      description: 'is not empty',
      func: async (input: object) => {
        return Object.keys(input).length !== 0;
      },
    });
  }

  /**
   * Creates a rule to check if a JSON object is strictly equal to a specified object.
   * This includes a deep equality check of all properties.
   * @param value The object to compare against.
   * @returns A `JSONObjectRule` instance to perform the equality check.
   * @example
   * // Usage
   * const isEqualRule = JSONObjectRule.isStrictlyEqual({ key: 'value' });
   * console.log(isEqualRule.func({ key: 'value' })); // Outputs: true
   * console.log(isEqualRule.func({ key: 'other' })); // Outputs: false
   */
  static isStrictlyEqual(value?: object) {
    return new JSONObjectRule<object>({
      description: 'is equal to {{value}}',
      variables: { value },
      func: async (input: object, variables: { value: object }) => {
        const isObject = (obj: any): boolean => {
          return obj != null && typeof obj === 'object';
        };

        const areObjectsStrictlyEqual = (obj1: any, obj2: any): boolean => {
          const keys1 = Object.keys(obj1);
          const keys2 = Object.keys(obj2);

          if (keys1.length !== keys2.length) {
            return false;
          }

          for (const key of keys1) {
            const val1 = obj1[key];
            const val2 = obj2[key];
            const areObjects = isObject(val1) && isObject(val2);

            if (areObjects && !areObjectsStrictlyEqual(val1, val2)) {
              return false;
            } else if (!areObjects && val1 !== val2) {
              return false;
            }
          }

          return true;
        };

        return areObjectsStrictlyEqual(input, variables.value);
      },
    });
  }

  /**
   * Creates a rule to check if a JSON object is not strictly equal to a specified object.
   * This includes a deep equality check of all properties.
   * @param value The object to compare against.
   * @returns A `JSONObjectRule` instance to perform the inequality check.
   * @example
   * // Usage
   * const isNotEqualRule = JSONObjectRule.isNotStrictlyEqual({ key: 'value' });
   * console.log(isNotEqualRule.func({ key: 'other' })); // Outputs: true
   * console.log(isNotEqualRule.func({ key: 'value' })); // Outputs: false
   */
  static isNotStrictlyEqual(value?: object) {
    return new JSONObjectRule<object>({
      description: 'is not equal to {{value}}',
      variables: { value },
      func: async (input: object, variables: { value: object }) => {
        const isObject = (obj: any): boolean => {
          return obj != null && typeof obj === 'object';
        };

        const areObjectsStrictlyEqual = (obj1: any, obj2: any): boolean => {
          const keys1 = Object.keys(obj1);
          const keys2 = Object.keys(obj2);

          if (keys1.length !== keys2.length) {
            return false;
          }

          for (const key of keys1) {
            const val1 = obj1[key];
            const val2 = obj2[key];
            const areObjects = isObject(val1) && isObject(val2);

            if (areObjects && !areObjectsStrictlyEqual(val1, val2)) {
              return false;
            } else if (!areObjects && val1 !== val2) {
              return false;
            }
          }

          return true;
        };

        return !areObjectsStrictlyEqual(input, variables.value);
      },
    });
  }
}
