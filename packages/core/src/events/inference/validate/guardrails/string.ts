import { BaseRule } from './base.js';

/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
export class StringRule<
  T extends unknown = string,
> extends BaseRule<T> {
  _isSerializable = true;

  static _name(): string {
    return 'StringRule';
  }

  _ruleType(): string {
    return 'string';
  }

  concat<U>(rule: BaseRule<U>, conjunction: 'or' | 'and'): BaseRule<T | U> {
    return new StringRule<T | U>({
      description: StringRule._mergeDescription(
        this as BaseRule,
        rule as BaseRule,
        conjunction
      ),
      variables: StringRule._mergeVariables(
        this as BaseRule,
        rule as BaseRule
      ),
      func: StringRule._mergeFunc(
        this as BaseRule,
        rule as BaseRule,
        conjunction
      ),
    });
  }

  static exists() {
    return new StringRule<string | undefined>({
      description: 'exists',
      func: async (input: string | undefined) => {
        return input !== undefined;
      },
    });
  }

  static doesNotExist() {
    return new StringRule<string | undefined>({
      description: "doesn't exist",
      func: async (input: string | undefined) => {
        return input === undefined;
      },
    });
  }

  static isEqual(value: string) {
    return new StringRule<string>({
      description: 'is equal to {{value}}',
      variables: { value },
      func: async (input: string, variables: { value: string }) => {
        return input === variables.value;
      },
    });
  }

  static isNotEqual(value: string) {
    return new StringRule<string>({
      description: "isn't equal to {{value}}",
      variables: { value },
      func: async (input: string, variables: { value: string }) => {
        return input !== variables.value;
      },
    });
  }

  static contains(value: string) {
    return new StringRule<string>({
      description: 'contains {{value}}',
      variables: { value },
      func: async (input: string, variables: { value: string }) => {
        return input.includes(variables.value);
      },
    });
  }

  static doesNotContain(value: string) {
    return new StringRule<string>({
      description: "doesn't contain {{value}}",
      variables: { value },
      func: async (input: string, variables: { value: string }) => {
        return !input.includes(variables.value);
      },
    });
  }

  static startsWith(value: string) {
    return new StringRule<string>({
      description: 'starts with {{value}}',
      variables: { value },
      func: async (input: string, variables: { value: string }) => {
        return input.startsWith(variables.value);
      },
    });
  }

  static doesNotStartWith(value: string) {
    return new StringRule<string>({
      description: "doesn't start with {{value}}",
      variables: { value },
      func: async (input: string, variables: { value: string }) => {
        return !input.startsWith(variables.value);
      },
    });
  }

  static endsWith(value: string) {
    return new StringRule<string>({
      description: 'ends with {{value}}',
      variables: { value },
      func: async (input: string, variables: { value: string }) => {
        return input.endsWith(variables.value);
      },
    });
  }

  static doesNotEndWith(value: string) {
    return new StringRule<string>({
      description: "doesn't end with {{value}}",
      variables: { value },
      func: async (input: string, variables: { value: string }) => {
        return !input.endsWith(variables.value);
      },
    });
  }

  static matchesRegex(regex: RegExp) {
    return new StringRule<string>({
      description: 'matches regex {{regex}}',
      variables: { regex },
      func: async (input: string, variables: { regex: RegExp }) => {
        return input.match(variables.regex) !== null;
      },
    });
  }

  static doesNotMatchRegex(regex: RegExp) {
    return new StringRule<string>({
      description: "doesn't match regex {{regex}}",
      variables: { regex },
      func: async (input: string, variables: { regex: RegExp }) => {
        return input.match(variables.regex) === null;
      },
    });
  }

  static lengthEqual(value: number) {
    return new StringRule<string>({
      description: 'length equal to {{value}}',
      variables: { value },
      func: async (input: string, variables: { value: number }) => {
        return input.length === variables.value;
      },
    });
  }

  static lengthNotEqual(value: number) {
    return new StringRule<string>({
      description: 'length not equal to {{value}}',
      variables: { value },
      func: async (input: string, variables: { value: number }) => {
        return input.length !== variables.value;
      },
    });
  }

  static lengthGreaterThan(value: number) {
    return new StringRule<string>({
      description: 'length greater than {{value}}',
      variables: { value },
      func: async (input: string, variables: { value: number }) => {
        return input.length > variables.value;
      },
    });
  }

  static lengthLessThan(value: number) {
    return new StringRule<string>({
      description: 'length less than {{value}}',
      variables: { value },
      func: async (input: string, variables: { value: number }) => {
        return input.length < variables.value;
      },
    });
  }

  static lengthGreaterThanOrEqual(value: number) {
    return new StringRule<string>({
      description: 'length greater than or equal {{value}}',
      variables: { value },
      func: async (input: string, variables: { value: number }) => {
        return input.length >= variables.value;
      },
    });
  }

  static lengthLessThanOrEqual(value: number) {
    return new StringRule<string>({
      description: 'length less than or equal {{value}}',
      variables: { value },
      func: async (input: string, variables: { value: number }) => {
        return input.length <= variables.value;
      },
    });
  }
}
