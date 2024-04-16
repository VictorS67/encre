import { describe, expect, test } from '@jest/globals';
import { NumberRule } from '../number';

describe('test NumberRule', () => {
  test('exists', async () => {
    expect(await NumberRule.exists().validate(undefined)).toBeFalsy();
    expect(await NumberRule.exists().validate(0)).toBeTruthy();
  });

  test("doesn't exists", async () => {
    expect(await NumberRule.doesNotExist().validate(undefined)).toBeTruthy();
    expect(await NumberRule.doesNotExist().validate(0)).toBeFalsy();
  });

  test('is equal to', async () => {
    expect(await NumberRule.isEqual(0).validate(0)).toBeTruthy();
    expect(await NumberRule.isEqual(0).validate(1)).toBeFalsy();
  });

  test("isn't equal to", async () => {
    expect(await NumberRule.isNotEqual(0).validate(0)).toBeFalsy();
    expect(await NumberRule.isNotEqual(0).validate(1)).toBeTruthy();
  });

  test('is greater than', async () => {
    expect(await NumberRule.isGreaterThan(0).validate(1)).toBeTruthy();
    expect(await NumberRule.isGreaterThan(0).validate(-1)).toBeFalsy();
  });

  test('is less than', async () => {
    expect(await NumberRule.isLessThan(0).validate(1)).toBeFalsy();
    expect(await NumberRule.isLessThan(0).validate(-1)).toBeTruthy();
  });

  test('is greater than or equal', async () => {
    expect(await NumberRule.isGreaterThanOrEqual(0).validate(-1)).toBeFalsy();
    expect(await NumberRule.isGreaterThanOrEqual(0).validate(0)).toBeTruthy();
  });

  test('is less than or equal', async () => {
    expect(await NumberRule.isLessThanOrEqual(0).validate(1)).toBeFalsy();
    expect(await NumberRule.isLessThanOrEqual(0).validate(0)).toBeTruthy();
  });
});
