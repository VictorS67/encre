import { BaseRule } from './base.js';

/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
export class ArrayRule<T extends unknown = Array<unknown>> extends BaseRule<T> {
  _isSerializable = true;

  static _name(): string {
    return 'ArrayRule';
  }

  _ruleType(): string {
    return 'array';
  }

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
    });
  }

  static exists() {
    return new ArrayRule<Array<unknown> | undefined>({
      description: 'exists',
      func: async (input: Array<unknown> | undefined) => {
        return input !== undefined;
      },
    });
  }

  static doesNotExist() {
    return new ArrayRule<Array<unknown> | undefined>({
      description: "doesn't exist",
      func: async (input: Array<unknown> | undefined) => {
        return input === undefined;
      },
    });
  }

  static isStrictlyEqual(value: Array<unknown>) {
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

  static isNotStrictlyEqual(value: Array<unknown>) {
    return new ArrayRule<Array<unknown>>({
      description: "isn't equal to {{value}}",
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

  static contains(value: unknown) {
    return new ArrayRule<Array<unknown>>({
      description: 'contains {{value}}',
      variables: { value },
      func: async (input: Array<unknown>, variables: { value: unknown }) => {
        return input.includes(variables.value);
      },
    });
  }

  static doesNotContain(value: unknown) {
    return new ArrayRule<Array<unknown>>({
      description: "doesn't contain {{value}}",
      variables: { value },
      func: async (input: Array<unknown>, variables: { value: unknown }) => {
        return !input.includes(variables.value);
      },
    });
  }

  static lengthEqual(value: number) {
    return new ArrayRule<Array<unknown>>({
      description: 'length equal to {{value}}',
      variables: { value },
      func: async (input: Array<unknown>, variables: { value: number }) => {
        return input.length === variables.value;
      },
    });
  }

  static lengthNotEqual(value: number) {
    return new ArrayRule<Array<unknown>>({
      description: 'length not equal to {{value}}',
      variables: { value },
      func: async (input: Array<unknown>, variables: { value: number }) => {
        return input.length !== variables.value;
      },
    });
  }

  static lengthGreaterThan(value: number) {
    return new ArrayRule<Array<unknown>>({
      description: 'length greater than {{value}}',
      variables: { value },
      func: async (input: Array<unknown>, variables: { value: number }) => {
        return input.length > variables.value;
      },
    });
  }

  static lengthLessThan(value: number) {
    return new ArrayRule<Array<unknown>>({
      description: 'length less than {{value}}',
      variables: { value },
      func: async (input: Array<unknown>, variables: { value: number }) => {
        return input.length < variables.value;
      },
    });
  }

  static lengthGreaterThanOrEqual(value: number) {
    return new ArrayRule<Array<unknown>>({
      description: 'length greater than or equal {{value}}',
      variables: { value },
      func: async (input: Array<unknown>, variables: { value: number }) => {
        return input.length >= variables.value;
      },
    });
  }

  static lengthLessThanOrEqual(value: number) {
    return new ArrayRule<Array<unknown>>({
      description: 'length less than or equal {{value}}',
      variables: { value },
      func: async (input: Array<unknown>, variables: { value: number }) => {
        return input.length <= variables.value;
      },
    });
  }
}
