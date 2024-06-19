import { type SerializedRule } from '../../../../serde.js';
import { BaseRule } from './base.js';

/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */

/**
 * A specialized rule class designed for handling number-based validations.
 * This class provides various static methods to create number-specific validation.
 *
 * @template T The type of input data the rule will validate, defaulting to number.
 * 
 * @example
 * ```typescript
 * const rule = new NumberRule({
 *   description: 'is 0',
 *   func: await (input: number) => input === 0
 * });
 * ```
 */
export class NumberRule<T extends unknown = number> extends BaseRule<T> {
  _isSerializable = true;

  static _name(): string {
    return 'NumberRule';
  }

  /**
   * Specifies the rule type. For `NumberRule`, the type is explicitly "number".
   * @returns The type identifier for this rule class.
   */
  _ruleType(): 'number' {
    return 'number';
  }

  /**
   * Combines two numeric rules into one using a specified logical conjunction ('and' or 'or').
   * @param rule The rule to concatenate with the current rule.
   * @param conjunction The type of logical conjunction to apply ('and' | 'or').
   * @returns A new `NumberRule` instance representing the combined rule.
   */
  concat<U>(rule: BaseRule<U>, conjunction: 'or' | 'and'): BaseRule<T | U> {
    return new NumberRule<T | U>({
      description: NumberRule._mergeDescription(
        this as BaseRule,
        rule as BaseRule,
        conjunction
      ),
      variables: NumberRule._mergeVariables(this as BaseRule, rule as BaseRule),
      func: NumberRule._mergeFunc(
        this as BaseRule,
        rule as BaseRule,
        conjunction
      ),
      metadata: NumberRule._mergeMetadata(
        this as BaseRule,
        rule as BaseRule,
        conjunction
      ),
    });
  }

  /**
   * Deserializes a serialized rule object into a `NumberRule` instance.
   * @param serialized The serialized rule data.
   * @param values Optional additional values to merge into the rule's variables.
   * @returns A promise that resolves to a new instance of `NumberRule`.
   */
  static async deserialize(
    serialized: SerializedRule,
    values?: Record<string, unknown>
  ): Promise<NumberRule<number>> {
    const numberRuleFields = {
      description: serialized.description,
      func: serialized.func,
      variables: {
        ...serialized.variables,
        ...values,
      },
    };

    return new NumberRule(numberRuleFields);
  }

  /**
   * Creates a rule to check if a numeric value exists (is not undefined).
   * @returns A `NumberRule` instance to check if the value is not undefined.
   * @example
   * // Usage
   * const existsRule = NumberRule.exists();
   * console.log(existsRule.func(5)); // Outputs: true
   * console.log(existsRule.func(undefined)); // Outputs: false
   */
  static exists() {
    return new NumberRule<number | undefined>({
      description: 'exists',
      func: async (input: number | undefined) => {
        return input !== undefined;
      },
    });
  }

  /**
   * Creates a rule to check if a numeric value does not exist (is undefined).
   * @returns A `NumberRule` instance to check if the value is undefined.
   * @example
   * // Usage
   * const doesNotExistRule = NumberRule.doesNotExist();
   * console.log(doesNotExistRule.func(undefined)); // Outputs: true
   * console.log(doesNotExistRule.func(5)); // Outputs: false
   */
  static doesNotExist() {
    return new NumberRule<number | undefined>({
      description: 'does not exist',
      func: async (input: number | undefined) => {
        return input === undefined;
      },
    });
  }

  /**
   * Creates a rule to check if a numeric value is equal to a specified value.
   * @param value The value to compare against.
   * @returns A `NumberRule` instance to check equality.
   * @example
   * // Usage
   * const isEqualRule = NumberRule.isEqual(10);
   * console.log(isEqualRule.func(10)); // Outputs: true
   * console.log(isEqualRule.func(5)); // Outputs: false
   */
  static isEqual(value?: number) {
    return new NumberRule<number>({
      description: 'is equal to {{value}}',
      variables: { value },
      func: async (input: number, variables: { value: number }) => {
        return input === variables.value;
      },
    });
  }

  /**
   * Creates a rule to check if a numeric value is not equal to a specified value.
   * @param value The value to compare against.
   * @returns A `NumberRule` instance to check inequality.
   * @example
   * // Usage
   * const isNotEqualRule = NumberRule.isNotEqual(10);
   * console.log(isNotEqualRule.func(5)); // Outputs: true
   * console.log(isNotEqualRule.func(10)); // Outputs: false
   */
  static isNotEqual(value?: number) {
    return new NumberRule<number>({
      description: 'is not equal to {{value}}',
      variables: { value },
      func: async (input: number, variables: { value: number }) => {
        return input !== variables.value;
      },
    });
  }

  /**
   * Creates a rule to check if a numeric value is greater than a specified value.
   * @param value The value to compare against.
   * @returns A `NumberRule` instance to check if the input is greater than the specified value.
   * @example
   * // Usage
   * const isGreaterThanRule = NumberRule.isGreaterThan(10);
   * console.log(isGreaterThanRule.func(15)); // Outputs: true
   * console.log(isGreaterThanRule.func(10)); // Outputs: false
   */
  static isGreaterThan(value?: number) {
    return new NumberRule<number>({
      description: 'is greater than {{value}}',
      variables: { value },
      func: async (input: number, variables: { value: number }) => {
        return input > variables.value;
      },
    });
  }

  /**
   * Creates a rule to check if a numeric value is less than a specified value.
   * @param value The value to compare against.
   * @returns A `NumberRule` instance to check if the input is less than the specified value.
   * @example
   * // Usage
   * const isLessThanRule = NumberRule.isLessThan(10);
   * console.log(isLessThanRule.func(5)); // Outputs: true
   * console.log(isLessThanRule.func(10)); // Outputs: false
   */
  static isLessThan(value?: number) {
    return new NumberRule<number>({
      description: 'is less than {{value}}',
      variables: { value },
      func: async (input: number, variables: { value: number }) => {
        return input < variables.value;
      },
    });
  }

  /**
   * Creates a rule to check if a numeric value is greater than or equal to a specified value.
   * @param value The value to compare against.
   * @returns A `NumberRule` instance to check if the input is greater than or equal to the specified value.
   * @example
   * // Usage
   * const isGreaterThanOrEqualRule = NumberRule.isGreaterThanOrEqual(10);
   * console.log(isGreaterThanOrEqualRule.func(10)); // Outputs: true
   * console.log(isGreaterThanOrEqualRule.func(9)); // Outputs: false
   */
  static isGreaterThanOrEqual(value?: number) {
    return new NumberRule<number>({
      description: 'is greater than or equal {{value}}',
      variables: { value },
      func: async (input: number, variables: { value: number }) => {
        return input >= variables.value;
      },
    });
  }

  /**
   * Creates a rule to check if a numeric value is less than or equal to a specified value.
   * @param value The value to compare against.
   * @returns A `NumberRule` instance to check if the input is less than or equal to the specified value.
   * @example
   * // Usage
   * const isLessThanOrEqualRule = NumberRule.isLessThanOrEqual(10);
   * console.log(isLessThanOrEqualRule.func(10)); // Outputs: true
   * console.log(isLessThanOrEqualRule.func(11)); // Outputs: false
   */
  static isLessThanOrEqual(value?: number) {
    return new NumberRule<number>({
      description: 'is less than or equal {{value}}',
      variables: { value },
      func: async (input: number, variables: { value: number }) => {
        return input <= variables.value;
      },
    });
  }
}
