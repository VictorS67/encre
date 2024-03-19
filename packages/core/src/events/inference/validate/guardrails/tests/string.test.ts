import { describe, expect, test } from '@jest/globals';
import { StringRule } from '../string.js';

describe('test StringRule', () => {
  test('exists', async () => {
    expect(await StringRule.exists().validate(undefined)).toBeFalsy();
    expect(await StringRule.exists().validate('John')).toBeTruthy();
  });

  test("doesn't exist", async () => {
    expect(await StringRule.doesNotExist().validate(undefined)).toBeTruthy();
    expect(await StringRule.doesNotExist().validate('John')).toBeFalsy();
  });

  test('is equal to', async () => {
    expect(await StringRule.isEqual('John').validate('Peter')).toBeFalsy();
    expect(await StringRule.isEqual('John').validate('John')).toBeTruthy();
  });

  test("isn't equal to", async () => {
    expect(await StringRule.isNotEqual('John').validate('Peter')).toBeTruthy();
    expect(await StringRule.isNotEqual('John').validate('John')).toBeFalsy();
  });

  test('contains', async () => {
    expect(await StringRule.contains('John').validate("I'm Peter")).toBeFalsy();
    expect(await StringRule.contains('John').validate("I'm John")).toBeTruthy();
  });

  test("doesn't contain", async () => {
    expect(
      await StringRule.doesNotContain('John').validate("I'm Peter")
    ).toBeTruthy();
    expect(
      await StringRule.doesNotContain('John').validate("I'm John")
    ).toBeFalsy();
  });

  test('starts with', async () => {
    expect(await StringRule.startsWith('John').validate('John?')).toBeTruthy();
    expect(
      await StringRule.startsWith('John').validate("I'm John")
    ).toBeFalsy();
  });

  test("doesn't start with", async () => {
    expect(
      await StringRule.doesNotStartWith('John').validate('John?')
    ).toBeFalsy();
    expect(
      await StringRule.doesNotStartWith('John').validate("I'm John")
    ).toBeTruthy();
  });

  test('ends with', async () => {
    expect(await StringRule.endsWith('John').validate('John?')).toBeFalsy();
    expect(await StringRule.endsWith('John').validate("I'm John")).toBeTruthy();
  });

  test("doesn't end with", async () => {
    expect(
      await StringRule.doesNotEndWith('John').validate('John?')
    ).toBeTruthy();
    expect(
      await StringRule.doesNotEndWith('John').validate("I'm John")
    ).toBeFalsy();
  });

  test('matches regex', async () => {
    expect(
      await StringRule.matchesRegex(/[a-zA-Z]+/).validate('John')
    ).toBeTruthy();
    expect(
      await StringRule.matchesRegex(/[a-zA-Z]+/).validate('123456')
    ).toBeFalsy();
  });

  test("doesn't match regex", async () => {
    expect(
      await StringRule.doesNotMatchRegex(/[a-zA-Z]+/).validate('John')
    ).toBeFalsy();
    expect(
      await StringRule.doesNotMatchRegex(/[a-zA-Z]+/).validate('123456')
    ).toBeTruthy();
  });

  test('length equal to', async () => {
    expect(await StringRule.lengthEqual(4).validate('Peter')).toBeFalsy();
    expect(await StringRule.lengthEqual(4).validate('John')).toBeTruthy();
  });

  test('length not equal to', async () => {
    expect(await StringRule.lengthNotEqual(4).validate('Peter')).toBeTruthy();
    expect(await StringRule.lengthNotEqual(4).validate('John')).toBeFalsy();
  });

  test('length greater than', async () => {
    expect(
      await StringRule.lengthGreaterThan(4).validate('Peter')
    ).toBeTruthy();
    expect(await StringRule.lengthGreaterThan(4).validate('John')).toBeFalsy();
  });

  test('length less than', async () => {
    expect(await StringRule.lengthLessThan(4).validate('Peter')).toBeFalsy();
    expect(await StringRule.lengthLessThan(4).validate('Pet')).toBeTruthy();
  });

  test('length greater than or equal', async () => {
    expect(
      await StringRule.lengthGreaterThanOrEqual(4).validate('Pet')
    ).toBeFalsy();
    expect(
      await StringRule.lengthGreaterThanOrEqual(4).validate('John')
    ).toBeTruthy();
  });

  test('length less than or equal', async () => {
    expect(
      await StringRule.lengthLessThanOrEqual(4).validate('Pet')
    ).toBeTruthy();
    expect(
      await StringRule.lengthLessThanOrEqual(4).validate('Peter')
    ).toBeFalsy();
  });
});
