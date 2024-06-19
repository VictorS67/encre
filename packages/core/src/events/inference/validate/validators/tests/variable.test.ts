import { afterEach, describe, expect, test } from '@jest/globals';
import { GeneralRule } from '../../guardrails/base';
import { NumberRule } from '../../guardrails/number';
import { VariableValidator } from '../variable';

describe('test VariableValidator', () => {
  const isPositiveRule = NumberRule.isGreaterThan(0);
  const isStringRule = new GeneralRule({
    description: 'is string',
    func: async (input: unknown) => {
      return typeof input === 'string';
    },
  });

  let validator = new VariableValidator({
    variables: ['age', 'name'],
  });

  afterEach(() => {
    validator = new VariableValidator({
      variables: ['age', 'name'],
    });
  });

  test('add and remove specific rules', () => {
    validator.addSpecificRule('age', isPositiveRule);
    expect(
      (validator.getRule('age') as NumberRule<number>).description ===
        isPositiveRule.description
    ).toBeTruthy();

    validator.removeSpecificRule('age');
    expect(validator.getRule('age')).toBeNull();
  });

  test('add and remove exclude variables', () => {
    validator.addExcludeVariable('name');
    expect(validator.rules.exclude).toContain('name');

    validator.removeExcludeVariable('name');
    expect(validator.rules.exclude).not.toContain('name');
  });

  test('validate with specific rule', async () => {
    validator.addSpecificRule('age', isPositiveRule);
    expect(await validator.invoke({ age: 5 })).toEqual({ isValid: true });
    expect(await validator.invoke({ age: -3 })).toEqual({
      isValid: false,
      errorMessage: "Validation failed in variable 'age'",
    });
  });

  test('validate with default rule', async () => {
    validator.addDefaultRule(isStringRule);

    expect(await validator.invoke({ age: '25', name: 'John' })).toEqual({
      isValid: true,
    });

    expect(await validator.invoke({ age: 25, name: 'John' })).toEqual({
      isValid: false,
      errorMessage: "Validation failed in variable 'age'",
    });
  });

  test('add exclusion to variable to avoid validation', async () => {
    validator.addDefaultRule(isStringRule);

    // Exclude 'age' from validation
    validator.addExcludeVariable('age');

    // Adding this specific rule will override the default rule for variable 'age'
    // However, since we already exclude 'age' from validation, this specific rule won't apply to it
    validator.addSpecificRule('age', isPositiveRule);

    expect(await validator.invoke({ age: -5 })).toEqual({ isValid: true });
  });

  test('validate a specific variable', async () => {
    validator.addDefaultRule(isStringRule);
    validator.addSpecificRule('age', isPositiveRule);

    expect(await validator.validateVariable('age', 10)).toEqual({
      isValid: true,
    });

    expect(await validator.validateVariable('name', 'John')).toEqual({
      isValid: true,
    });

    expect(() =>
      validator.validateVariable('nonExistVariable', 'someValue')
    ).rejects.toThrow();
  });
});
