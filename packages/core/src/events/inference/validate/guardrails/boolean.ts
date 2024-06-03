import { SerializedRule } from '../../../../studio/serde.js';
import { BaseRule } from './base.js';

/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */

/**
 * A specialized rule class designed for handling boolean-based validations.
 * This class provides various static methods to create boolean-specific validation.
 *
 * @template T The type of input data the rule will validate, defaulting to boolean.
 * 
 * @example
 * ```typescript
 * const rule = new BooleanRule({
 *   description: 'is true',
 *   func: await (input: boolean) => input === true
 * });
 * ```
 */
export class BooleanRule<T extends unknown = boolean> extends BaseRule<T> {
  _isSerializable = true;

  static _name(): string {
    return 'BooleanRule';
  }

  /**
   * Specifies the rule type. For `BooleanRule`, the type is explicitly "boolean".
   * @returns The type identifier for this rule class.
   */
  _ruleType(): 'boolean' {
    return 'boolean';
  }

  /**
   * Combines two boolean rules into one using a specified logical conjunction ('and' or 'or').
   * @param rule The rule to concatenate with the current rule.
   * @param conjunction The type of logical conjunction to apply ('and' | 'or').
   * @returns A new `BooleanRule` instance representing the combined rule.
   */
  concat<U>(rule: BaseRule<U>, conjunction: 'or' | 'and'): BaseRule<T | U> {
    return new BooleanRule<T | U>({
      description: BooleanRule._mergeDescription(
        this as BaseRule,
        rule as BaseRule,
        conjunction
      ),
      variables: BooleanRule._mergeVariables(
        this as BaseRule,
        rule as BaseRule
      ),
      func: BooleanRule._mergeFunc(
        this as BaseRule,
        rule as BaseRule,
        conjunction
      ),
      metadata: BooleanRule._mergeMetadata(
        this as BaseRule,
        rule as BaseRule,
        conjunction
      ),
    });
  }

  /**
   * Deserializes a serialized rule object into a `BooleanRule` instance.
   * @param serialized The serialized rule data.
   * @param values Optional additional values to merge into the rule's variables.
   * @returns A promise that resolves to a new instance of `BooleanRule`.
   */
  static async deserialize(
    serialized: SerializedRule,
    values?: Record<string, unknown>
  ): Promise<BooleanRule<boolean>> {
    const booleanRuleFields = {
      description: serialized.description,
      func: serialized.func,
      variables: {
        ...serialized.variables,
        ...values,
      },
    };

    return new BooleanRule(booleanRuleFields);
  }

  /**
   * Creates a rule to check if a boolean value exists (is not undefined).
   * @returns A `BooleanRule` instance to check if the value is not undefined.
   * @example
   * const existsRule = BooleanRule.exists();
   * console.log(existsRule.func(true)); // Outputs: true
   * console.log(existsRule.func(undefined)); // Outputs: false
   */
  static exists() {
    return new BooleanRule<boolean | undefined>({
      description: 'exists',
      func: async (input: boolean | undefined) => {
        return input !== undefined;
      },
    });
  }

  /**
   * Creates a rule to check if a boolean value does not exist (is undefined).
   * @returns A `BooleanRule` instance to check if the value is undefined.
   * @example
   * const doesNotExistRule = BooleanRule.doesNotExist();
   * console.log(doesNotExistRule.func(undefined)); // Outputs: true
   * console.log(doesNotExistRule.func(false)); // Outputs: false
   */
  static doesNotExist() {
    return new BooleanRule<boolean | undefined>({
      description: 'does not exist',
      func: async (input: boolean | undefined) => {
        return input === undefined;
      },
    });
  }

  /**
   * Creates a rule to check if a boolean value is equal to a specified value.
   * @param value The value to compare against.
   * @returns A `BooleanRule` instance to check equality.
   * @example
   * const isEqualTrue = BooleanRule.isEqual(true);
   * console.log(isEqualTrue.func(true)); // Outputs: true
   * console.log(isEqualTrue.func(false)); // Outputs: false
   */
  static isEqual(value?: boolean) {
    return new BooleanRule<boolean>({
      description: 'is equal to {{value}}',
      variables: { value },
      func: async (input: boolean, variables: { value: boolean }) => {
        return input === variables.value;
      },
    });
  }

  /**
   * Creates a rule to check if a boolean value is not equal to a specified value.
   * @param value The value to compare against.
   * @returns A `BooleanRule` instance to check inequality.
   * @example
   * const isNotEqualTrue = BooleanRule.isNotEqual(true);
   * console.log(isNotEqualTrue.func(false)); // Outputs: true
   * console.log(isNotEqualTrue.func(true)); // Outputs: false
   */
  static isNotEqual(value?: boolean) {
    return new BooleanRule<boolean>({
      description: 'is not equal to {{value}}',
      variables: { value },
      func: async (input: boolean, variables: { value: boolean }) => {
        return input !== variables.value;
      },
    });
  }

  /**
   * Creates a rule to check if a boolean value is true.
   * @returns A `BooleanRule` instance to validate if the value is true.
   * @example
   * const isTrueRule = BooleanRule.isTrue();
   * console.log(isTrueRule.func(true)); // Outputs: true
   * console.log(isTrueRule.func(false)); // Outputs: false
   */
  static isTrue() {
    return new BooleanRule<boolean>({
      description: 'is true',
      func: async (input: boolean) => {
        return input === true;
      },
    });
  }

  /**
   * Creates a rule to check if a boolean value is false.
   * @returns A `BooleanRule` instance to validate if the value is false.
   * @example
   * const isFalseRule = BooleanRule.isFalse();
   * console.log(isFalseRule.func(false)); // Outputs: true
   * console.log(isFalseRule.func(true)); // Outputs: false
   */
  static isFalse() {
    return new BooleanRule<boolean>({
      description: 'is false',
      func: async (input: boolean) => {
        return input === false;
      },
    });
  }
}
