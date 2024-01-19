import { expect, jest, test } from '@jest/globals';
import { variableValidator } from '../promptTemplateValidator/variableValidator';

const isPositive = (n) => n > 0;
const isString = (s) => typeof s === 'string';

let validator;
validator = new variableValidator(['age', 'name']);

test('add and remove specific rules', () => {
    expect(() => validator.addSpecificRule('age', isPositive)).not.toThrow();

    expect(() => validator.removeSpecificRule('age')).not.toThrow();
    expect(() => validator.removeSpecificRule('age')).toThrow();
});

test('add and remove exclude variables', () => {
    validator.addExcludeVariable('name');
    expect(validator.getAttributes().rules.exclude).toContain('name');
    validator.removeExcludeVariable('name');
    expect(validator.getAttributes().rules.exclude).not.toContain('name');
});

test('validate with specific rule', () => {
    validator.addSpecificRule('age', isPositive);
    expect(validator.validate({ age: 5 })).toEqual({ isValid: true });
    expect(validator.validate({ age: -3 })).toEqual({ isValid: false, errorMessage: 'Validation failed for age' });
});

test('validate with default rule', () => {
    validator = new variableValidator(['age', 'name'], { default: isString });
    expect(validator.validate({ age: '25', name: 'John' })).toEqual({ isValid: true });
    expect(validator.validate({ age: 25, name: 'John' })).toEqual({ isValid: false, errorMessage: 'Validation failed for age' });
});

test('add specific rule with default rule conflict and exclusion', () => {
    const validator = new variableValidator(['age', 'name'], { default: isString });

    // Attempt to add a specific rule that conflicts with the default rule
    expect(() => validator.addSpecificRule('age', isPositive)).toThrow();

    // Exclude 'age' from default rule
    validator.addExcludeVariable('age');

    // Successfully add specific rule after exclusion
    expect(() => validator.addSpecificRule('age', isPositive)).not.toThrow();
});