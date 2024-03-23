import { describe, expect, test } from '@jest/globals';
import { BooleanRule } from '../boolean';

describe('test BooleanRule', () => {
  test('exists', async () => {
    expect(await BooleanRule.exists().validate(undefined)).toBeFalsy();
    expect(await BooleanRule.exists().validate(false)).toBeTruthy();
  });

  test("doesn't exists", async () => {
    expect(await BooleanRule.doesNotExist().validate(undefined)).toBeTruthy();
    expect(await BooleanRule.doesNotExist().validate(false)).toBeFalsy();
  });

  test('is equal to', async () => {
    expect(await BooleanRule.isEqual(true).validate(true)).toBeTruthy();
    expect(await BooleanRule.isEqual(true).validate(false)).toBeFalsy();
  });

  test("isn't equal to", async () => {
    expect(await BooleanRule.isNotEqual(true).validate(true)).toBeFalsy();
    expect(await BooleanRule.isNotEqual(true).validate(false)).toBeTruthy();
  });

  test('is true', async () => {
    expect(await BooleanRule.isTrue().validate(true)).toBeTruthy();
    expect(await BooleanRule.isTrue().validate(false)).toBeFalsy();
  });

  test('is false', async () => {
    expect(await BooleanRule.isFalse().validate(true)).toBeFalsy();
    expect(await BooleanRule.isFalse().validate(false)).toBeTruthy();
  });
});
