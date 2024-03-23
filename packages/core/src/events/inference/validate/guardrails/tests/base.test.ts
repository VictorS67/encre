import { describe, expect, test } from '@jest/globals';
import { BaseRule, GeneralRule } from '../base.js';

describe('test BaseRule and GeneralRule', () => {
  test('cutomize a new rule', async () => {
    class NewRule<T = unknown> extends BaseRule<T> {
      _isSerializable = true;

      static _name(): string {
        return 'NewRule';
      }

      _ruleType(): string {
        return 'unknown';
      }

      concat<U>(rule: BaseRule<U>, conjunction: 'or' | 'and'): BaseRule<T | U> {
        return new NewRule<T | U>({
          description: NewRule._mergeDescription(
            this as BaseRule,
            rule as BaseRule,
            conjunction
          ),
          variables: NewRule._mergeVariables(
            this as BaseRule,
            rule as BaseRule
          ),
          func: NewRule._mergeFunc(
            this as BaseRule,
            rule as BaseRule,
            conjunction
          ),
        });
      }
    }

    const isStringRule = new NewRule({
      description: 'is string',
      func: async (input: unknown) => {
        return typeof input === 'string';
      },
    });

    expect(await isStringRule.validate(1)).toBeFalsy();
  });

  test('cutomize a new rule by applying logical conjunctions', async () => {
    // Suppose I have a rule to check if the input is a string, and I also want to check if it equals 'John'
    const isStringRule = new GeneralRule({
      description: 'is string',
      func: async (input: unknown) => {
        return typeof input === 'string';
      },
    });

    const isJohnRule = new GeneralRule({
      description: 'is John',
      func: async (input: string) => {
        return input === 'John';
      },
    });

    // Use `concat` with a 'and' conjunction can merge two rules
    const newRule = isStringRule.concat(isJohnRule, 'and');

    expect(newRule.description).toBe('is string AND is John');
    expect(await newRule.validate('John')).toBeTruthy();
    expect(await newRule.validate('Peter')).toBeFalsy();

    // Actually, there can be more rules.
    // Let's say I want to check if the string equals to `Peter`
    const isPeterRule = new GeneralRule({
      description: 'is Peter',
      func: async (input: string) => {
        return input === 'Peter';
      },
    });

    const anotherNewRule = newRule.concat(isPeterRule, 'or');

    expect(anotherNewRule.description).toBe(
      '(is string AND is John) OR is Peter'
    );
    expect(await anotherNewRule.validate('John')).toBeTruthy();
    expect(await anotherNewRule.validate('Peter')).toBeTruthy();
  });

  test('merging variables in concat rules', async () => {
    const isStringRule = new GeneralRule({
      description: 'is string',
      func: async (input: unknown) => {
        return typeof input === 'string';
      },
    });

    expect(await isStringRule.validate('John')).toBeTruthy();
    expect(await isStringRule.validate('Peter')).toBeTruthy();

    // Instead of checking if the input is John, I want the name to be flexible
    const isSomeNameRule = new GeneralRule({
      description: 'is {{name}}',
      variables: { name: 'John' },
      func: async (input: string, variables: { name: string }) => {
        return input === variables.name;
      },
    });

    expect(await isSomeNameRule.validate('John')).toBeTruthy();
    expect(await isSomeNameRule.validate('Peter')).toBeFalsy();

    // Use `concat` with a 'and' conjunction can merge two rules
    const newRule = isStringRule.concat(isSomeNameRule, 'and');

    // The variable in `isSomeNameRule` is wrapped in the `right` attribute, because
    // `isSomeNameRule` is the right rule when merging
    expect(newRule.variables).toStrictEqual({
      left: {},
      right: { name: 'John' },
    });
    expect(await newRule.validate('John')).toBeTruthy();
    expect(await newRule.validate('Peter')).toBeFalsy();

    // Now I want to change the name to be 'Peter' instead of 'John'
    newRule.variables = { left: {}, right: { name: 'Peter' } };

    expect(await newRule.validate('John')).toBeFalsy();
    expect(await newRule.validate('Peter')).toBeTruthy();
  });
});
