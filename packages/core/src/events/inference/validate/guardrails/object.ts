import { SerializedRule } from '../../../../studio/serde.js';
import { BaseRule } from './base.js';

/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
export class JSONObjectRule<T extends unknown = object> extends BaseRule<T> {
  _isSerializable = true;

  static _name(): string {
    return 'JSONObjectRule';
  }

  _ruleType(): 'object' {
    return 'object';
  }

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

  static exists() {
    return new JSONObjectRule<object | undefined>({
      description: 'exists',
      func: async (input: object | undefined) => {
        return input !== undefined;
      },
    });
  }

  static doesNotExist() {
    return new JSONObjectRule<object | undefined>({
      description: 'does not exist',
      func: async (input: object | undefined) => {
        return input === undefined;
      },
    });
  }

  static isEmpty() {
    return new JSONObjectRule<object>({
      description: 'is empty',
      func: async (input: object) => {
        return Object.keys(input).length === 0;
      },
    });
  }

  static isNotEmpty() {
    return new JSONObjectRule<object>({
      description: 'is not empty',
      func: async (input: object) => {
        return Object.keys(input).length !== 0;
      },
    });
  }

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
