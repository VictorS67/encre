import { BaseRule } from './base.js';

/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
export class NumberRule<
  T extends unknown = number,
> extends BaseRule<T> {
  _isSerializable = true;

  static _name(): string {
    return 'NumberRule';
  }

  _ruleType(): string {
    return 'number';
  }

  concat<U>(rule: BaseRule<U>, conjunction: 'or' | 'and'): BaseRule<T | U> {
    return new NumberRule<T | U>({
      description: NumberRule._mergeDescription(
        this as BaseRule,
        rule as BaseRule,
        conjunction
      ),
      variables: NumberRule._mergeVariables(
        this as BaseRule,
        rule as BaseRule
      ),
      func: NumberRule._mergeFunc(
        this as BaseRule,
        rule as BaseRule,
        conjunction
      ),
    });
  }

  static exists() {
    return new NumberRule<number | undefined>({
      description: 'exists',
      func: async (input: number | undefined) => {
        return input !== undefined;
      },
    });
  }

  static doesNotExist() {
    return new NumberRule<number | undefined>({
      description: "does not exist",
      func: async (input: number | undefined) => {
        return input === undefined;
      },
    });
  }

  static isEqual(value: number) {
    return new NumberRule<number>({
      description: 'is equal to {{value}}',
      variables: { value },
      func: async (input: number, variables: { value: number }) => {
        return input === variables.value;
      },
    });
  }

  static isNotEqual(value: number) {
    return new NumberRule<number>({
      description: "is not equal to {{value}}",
      variables: { value },
      func: async (input: number, variables: { value: number }) => {
        return input !== variables.value;
      },
    });
  }

  static isGreaterThan(value: number) {
    return new NumberRule<number>({
      description: 'is greater than {{value}}',
      variables: { value },
      func: async (input: number, variables: { value: number }) => {
        return input > variables.value;
      },
    });
  }

  static isLessThan(value: number) {
    return new NumberRule<number>({
      description: 'is less than {{value}}',
      variables: { value },
      func: async (input: number, variables: { value: number }) => {
        return input < variables.value;
      },
    });
  }

  static isGreaterThanOrEqual(value: number) {
    return new NumberRule<number>({
      description: 'is greater than or equal {{value}}',
      variables: { value },
      func: async (input: number, variables: { value: number }) => {
        return input >= variables.value;
      },
    });
  }

  static isLessThanOrEqual(value: number) {
    return new NumberRule<number>({
      description: 'is less than or equal {{value}}',
      variables: { value },
      func: async (input: number, variables: { value: number }) => {
        return input <= variables.value;
      },
    });
  }
}
