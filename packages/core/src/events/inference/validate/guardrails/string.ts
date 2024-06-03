import { SerializedRule } from '../../../../studio/serde.js';
import { BaseRule } from './base.js';

/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */

/**
 * A specialized rule class designed for handling string-based validations.
 * This class provides various static methods to create string-specific validation
 * rules such as checking string length, content, and pattern matching.
 *
 * @template T The type of input data the rule will validate, defaulting to string.
 * 
 * @example
 * ```typescript
 * const rule = new StringRule({
 *   description: `is 'name'`,
 *   func: await (input: string) => input === 'name'
 * });
 * ```
 */
export class StringRule<T extends unknown = string> extends BaseRule<T> {
  _isSerializable = true;

  static _name(): string {
    return 'StringRule';
  }

  /**
   * Specifies the rule type. For `StringRule`, the type is explicitly "string".
   * @returns The type identifier for this rule class.
   */
  _ruleType(): 'string' {
    return 'string';
  }

  /**
   * Combines this rule with another rule using a specified logical conjunction ('and' | 'or').
   * This method merges two rules into a new `StringRule` instance, combining their conditions.
   *
   * @template U The type of input data the other rule will validate.
   * @param rule The other rule to concatenate with this rule.
   * @param conjunction The logical conjunction to apply ("and" | "or").
   * @returns A new `StringRule` instance representing the combination of this rule and the other rule.
   */
  concat<U>(rule: BaseRule<U>, conjunction: 'or' | 'and'): BaseRule<T | U> {
    return new StringRule<T | U>({
      description: StringRule._mergeDescription(
        this as BaseRule,
        rule as BaseRule,
        conjunction
      ),
      variables: StringRule._mergeVariables(this as BaseRule, rule as BaseRule),
      func: StringRule._mergeFunc(
        this as BaseRule,
        rule as BaseRule,
        conjunction
      ),
      metadata: StringRule._mergeMetadata(
        this as BaseRule,
        rule as BaseRule,
        conjunction
      ),
    });
  }

  /**
   * Deserializes a `SerializedRule` object into a `StringRule` instance.
   * This static method provides a mechanism to reconstruct a `StringRule` from its serialized form.
   *
   * @param serialized The serialized rule data.
   * @param values Optional additional variables that may be needed for rule initialization.
   * @returns A promise that resolves to a new `StringRule` instance based on the serialized data.
   */
  static async deserialize(
    serialized: SerializedRule,
    values?: Record<string, unknown>
  ): Promise<StringRule<string>> {
    const stringRuleFields = {
      description: serialized.description,
      func: serialized.func,
      variables: {
        ...serialized.variables,
        ...values,
      },
    };

    return new StringRule(stringRuleFields);
  }

  /**
   * Creates a rule to determine if a string value exists (is not undefined).
   * @returns A new `StringRule` instance to validate the existence of a string.
   * @example
   * // Usage
   * const existsRule = StringRule.exists();
   * console.log(existsRule.func("Hello"));  // Outputs: true
   * console.log(existsRule.func(undefined));  // Outputs: false
   */
  static exists() {
    return new StringRule<string | undefined>({
      description: 'exists',
      func: async (input: string | undefined) => {
        return input !== undefined;
      },
    });
  }

  /**
   * Creates a rule to determine if a string value does not exist (is undefined).
   * @returns A new `StringRule` instance to validate the non-existence of a string.
   * @example
   * // Usage
   * const doesNotExistRule = StringRule.doesNotExist();
   * console.log(doesNotExistRule.func("Hello"));  // Outputs: false
   * console.log(doesNotExistRule.func(undefined));  // Outputs: true
   */
  static doesNotExist() {
    return new StringRule<string | undefined>({
      description: 'does not exist',
      func: async (input: string | undefined) => {
        return input === undefined;
      },
    });
  }

  /**
   * Creates a rule to check if a string is equal to a specified value.
   * @param value The string value to compare against the input.
   * @returns A new `StringRule` instance to validate equality to the specified value.
   * @example
   * // Usage
   * const isEqualRule = StringRule.isEqual("test");
   * console.log(isEqualRule.func("test"));  // Outputs: true
   * console.log(isEqualRule.func("hello"));  // Outputs: false
   */
  static isEqual(value?: string) {
    return new StringRule<string>({
      description: 'is equal to {{value}}',
      variables: { value },
      func: async (input: string, variables: { value: string }) => {
        return input === variables.value;
      },
    });
  }

  /**
   * Creates a rule to check if a string is not equal to a specified value.
   * @param value The string value to compare against the input.
   * @returns A new `StringRule` instance to validate inequality to the specified value.
   * @example
   * // Usage
   * const isNotEqualRule = StringRule.isNotEqual("test");
   * console.log(isNotEqualRule.func("test"));  // Outputs: false
   * console.log(isNotEqualRule.func("hello"));  // Outputs: true
   */
  static isNotEqual(value?: string) {
    return new StringRule<string>({
      description: 'is not equal to {{value}}',
      variables: { value },
      func: async (input: string, variables: { value: string }) => {
        return input !== variables.value;
      },
    });
  }

  /**
   * Creates a rule to check if a string contains a specified substring.
   * @param value The substring to check within the input string.
   * @returns A new `StringRule` instance to validate the presence of the substring.
   * @example
   * // Usage
   * const containsRule = StringRule.contains("test");
   * console.log(containsRule.func("testing"));  // Outputs: true
   * console.log(containsRule.func("check"));  // Outputs: false
   */
  static contains(value?: string) {
    return new StringRule<string>({
      description: 'contains {{value}}',
      variables: { value },
      func: async (input: string, variables: { value: string }) => {
        return input.includes(variables.value);
      },
    });
  }

  /**
   * Creates a rule to check if a string does not contain a specified substring.
   * @param value The substring to check absence within the input string.
   * @returns A new `StringRule` instance to validate the absence of the substring.
   * @example
   * // Usage
   * const doesNotContainRule = StringRule.doesNotContain("test");
   * console.log(doesNotContainRule.func("testing"));  // Outputs: false
   * console.log(doesNotContainRule.func("check"));  // Outputs: true
   */
  static doesNotContain(value?: string) {
    return new StringRule<string>({
      description: 'does not contain {{value}}',
      variables: { value },
      func: async (input: string, variables: { value: string }) => {
        return !input.includes(variables.value);
      },
    });
  }

  /**
   * Creates a rule to check if a string starts with a specified substring.
   * @param value The substring to check at the start of the input string.
   * @returns A new `StringRule` instance to validate that the string starts with the specified substring.
   * @example
   * // Usage
   * const startsWithRule = StringRule.startsWith("Hello");
   * console.log(startsWithRule.func("Hello World"));  // Outputs: true
   * console.log(startsWithRule.func("World Hello"));  // Outputs: false
   */
  static startsWith(value?: string) {
    return new StringRule<string>({
      description: 'starts with {{value}}',
      variables: { value },
      func: async (input: string, variables: { value: string }) => {
        return input.startsWith(variables.value);
      },
    });
  }

  /**
   * Creates a rule to check if a string does not start with a specified substring.
   * @param value The substring that the input string should not start with.
   * @returns A new `StringRule` instance to validate that the string does not start with the specified substring.
   * @example
   * // Usage
   * const doesNotStartWithRule = StringRule.doesNotStartWith("Hello");
   * console.log(doesNotStartWithRule.func("Hello World"));  // Outputs: false
   * console.log(doesNotStartWithRule.func("World Hello"));  // Outputs: true
   */
  static doesNotStartWith(value?: string) {
    return new StringRule<string>({
      description: 'does not start with {{value}}',
      variables: { value },
      func: async (input: string, variables: { value: string }) => {
        return !input.startsWith(variables.value);
      },
    });
  }

  /**
   * Creates a rule to check if a string ends with a specified substring.
   * @param value The substring to check at the end of the input string.
   * @returns A new `StringRule` instance to validate that the string ends with the specified substring.
   * @example
   * // Usage
   * const endsWithRule = StringRule.endsWith("World");
   * console.log(endsWithRule.func("Hello World"));  // Outputs: true
   * console.log(endsWithRule.func("World Hello"));  // Outputs: false
   */
  static endsWith(value?: string) {
    return new StringRule<string>({
      description: 'ends with {{value}}',
      variables: { value },
      func: async (input: string, variables: { value: string }) => {
        return input.endsWith(variables.value);
      },
    });
  }

  /**
   * Creates a rule to check if a string does not end with a specified substring.
   * @param value The substring that the input string should not end with.
   * @returns A new `StringRule` instance to validate that the string does not end with the specified substring.
   * @example
   * // Usage
   * const doesNotEndWithRule = StringRule.doesNotEndWith("World");
   * console.log(doesNotEndWithRule.func("Hello World"));  // Outputs: false
   * console.log(doesNotEndWithRule.func("World Hello"));  // Outputs: true
   */
  static doesNotEndWith(value?: string) {
    return new StringRule<string>({
      description: 'does not end with {{value}}',
      variables: { value },
      func: async (input: string, variables: { value: string }) => {
        return !input.endsWith(variables.value);
      },
    });
  }

  /**
   * Creates a rule to check if a string matches a specified regular expression.
   * @param regex The regular expression to match against the input string.
   * @returns A new `StringRule` instance to validate that the string matches the specified regex.
   * @example
   * // Usage
   * const matchesRegexRule = StringRule.matchesRegex(/^test$/);
   * console.log(matchesRegexRule.func("test"));  // Outputs: true
   * console.log(matchesRegexRule.func("test123"));  // Outputs: false
   */
  static matchesRegex(regex?: RegExp) {
    return new StringRule<string>({
      description: 'matches regex {{regex}}',
      variables: { regex },
      func: async (input: string, variables: { regex: RegExp }) => {
        return input.match(variables.regex) !== null;
      },
    });
  }

  /**
   * Creates a rule to check if a string does not match a specified regular expression.
   * @param regex The regular expression that the input string should not match.
   * @returns A new `StringRule` instance to validate that the string does not match the specified regex.
   * @example
   * // Usage
   * const doesNotMatchRegexRule = StringRule.doesNotMatchRegex(/^test$/);
   * console.log(doesNotMatchRegexRule.func("test"));  // Outputs: false
   * console.log(doesNotMatchRegexRule.func("hello"));  // Outputs: true
   */
  static doesNotMatchRegex(regex?: RegExp) {
    return new StringRule<string>({
      description: 'does not match regex {{regex}}',
      variables: { regex },
      func: async (input: string, variables: { regex: RegExp }) => {
        return input.match(variables.regex) === null;
      },
    });
  }

  /**
   * Creates a rule to check if the length of a string is equal to a specified value.
   * @param value The length that the input string should match.
   * @returns A new `StringRule` instance to validate that the length of the string is equal to the specified value.
   * @example
   * // Usage
   * const lengthEqualRule = StringRule.lengthEqual(5);
   * console.log(lengthEqualRule.func("Hello"));  // Outputs: true
   * console.log(lengthEqualRule.func("Hello World"));  // Outputs: false
   */
  static lengthEqual(value?: number) {
    return new StringRule<string>({
      description: 'length equal to {{value}}',
      variables: { value },
      func: async (input: string, variables: { value: number }) => {
        return input.length === variables.value;
      },
    });
  }

  /**
   * Creates a rule to check if the length of a string is not equal to a specified value.
   * @param value The length that the input string should not match.
   * @returns A new `StringRule` instance to validate that the length of the string is not equal to the specified value.
   * @example
   * // Usage
   * const lengthNotEqualRule = StringRule.lengthNotEqual(5);
   * console.log(lengthNotEqualRule.func("Hello"));  // Outputs: false
   * console.log(lengthNotEqualRule.func("Hello World"));  // Outputs: true
   */
  static lengthNotEqual(value?: number) {
    return new StringRule<string>({
      description: 'length not equal to {{value}}',
      variables: { value },
      func: async (input: string, variables: { value: number }) => {
        return input.length !== variables.value;
      },
    });
  }

  /**
   * Creates a rule to check if the length of a string is greater than a specified value.
   * @param value The number to compare against the length of the input string.
   * @returns A new `StringRule` instance that validates whether the length of the string is greater than the specified value.
   * @example
   * // Usage
   * const lengthGreaterThanRule = StringRule.lengthGreaterThan(5);
   * console.log(lengthGreaterThanRule.func("Hello"));  // Outputs: false
   * console.log(lengthGreaterThanRule.func("Hello World"));  // Outputs: true
   */
  static lengthGreaterThan(value?: number) {
    return new StringRule<string>({
      description: 'length greater than {{value}}',
      variables: { value },
      func: async (input: string, variables: { value: number }) => {
        return input.length > variables.value;
      },
    });
  }

  /**
   * Creates a rule to check if the length of a string is less than a specified value.
   * @param value The number to compare against the length of the input string.
   * @returns A new `StringRule` instance that validates whether the length of the string is less than the specified value.
   * @example
   * // Usage
   * const lengthLessThanRule = StringRule.lengthLessThan(10);
   * console.log(lengthLessThanRule.func("Hello"));  // Outputs: true
   * console.log(lengthLessThanRule.func("Hello World"));  // Outputs: false
   */
  static lengthLessThan(value?: number) {
    return new StringRule<string>({
      description: 'length less than {{value}}',
      variables: { value },
      func: async (input: string, variables: { value: number }) => {
        return input.length < variables.value;
      },
    });
  }

  /**
   * Creates a rule to check if the length of a string is greater than or equal to a specified value.
   * @param value The number to compare against the length of the input string.
   * @returns A new `StringRule` instance that validates whether the length of the string is greater than or equal to the specified value.
   * @example
   * // Usage
   * const lengthGreaterThanOrEqualRule = StringRule.lengthGreaterThanOrEqual(5);
   * console.log(lengthGreaterThanOrEqualRule.func("Hello"));  // Outputs: true
   * console.log(lengthGreaterThanOrEqualRule.func("Hi"));  // Outputs: false
   */
  static lengthGreaterThanOrEqual(value?: number) {
    return new StringRule<string>({
      description: 'length greater than or equal {{value}}',
      variables: { value },
      func: async (input: string, variables: { value: number }) => {
        return input.length >= variables.value;
      },
    });
  }

  /**
   * Creates a rule to check if the length of a string is less than or equal to a specified value.
   * @param value The number to compare against the length of the input string.
   * @returns A new `StringRule` instance that validates whether the length of the string is less than or equal to the specified value.
   * @example
   * // Usage
   * const lengthLessThanOrEqualRule = StringRule.lengthLessThanOrEqual(5);
   * console.log(lengthLessThanOrEqualRule.func("Three"));  // Outputs: true
   * console.log(lengthLessThanOrEqualRule.func("Hello World"));  // Outputs: false
   */
  static lengthLessThanOrEqual(value?: number) {
    return new StringRule<string>({
      description: 'length less than or equal {{value}}',
      variables: { value },
      func: async (input: string, variables: { value: number }) => {
        return input.length <= variables.value;
      },
    });
  }
}
