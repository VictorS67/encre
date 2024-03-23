import { describe, expect, test } from '@jest/globals';
import { ArrayRule } from '../array';

describe('test ArrayRule', () => {
  test('exists', async () => {
    expect(await ArrayRule.exists().validate(undefined)).toBeFalsy();
    expect(await ArrayRule.exists().validate([])).toBeTruthy();
  });

  test("doesn't exists", async () => {
    expect(await ArrayRule.doesNotExist().validate(undefined)).toBeTruthy();
    expect(await ArrayRule.doesNotExist().validate([])).toBeFalsy();
  });

  test('is equal to', async () => {
    expect(
      await ArrayRule.isStrictlyEqual(['John']).validate(['John'])
    ).toBeTruthy();
    expect(
      await ArrayRule.isStrictlyEqual(['John']).validate(['Peter'])
    ).toBeFalsy();
  });

  test("isn't equal to", async () => {
    expect(
      await ArrayRule.isNotStrictlyEqual(['John']).validate(['John'])
    ).toBeFalsy();
    expect(
      await ArrayRule.isNotStrictlyEqual(['John']).validate(['Peter'])
    ).toBeTruthy();
  });

  test('contains', async () => {
    expect(await ArrayRule.contains('John').validate(['John'])).toBeTruthy();
    expect(await ArrayRule.contains('John').validate(['Peter'])).toBeFalsy();
  });

  test("doesn't contain", async () => {
    expect(
      await ArrayRule.doesNotContain('John').validate(['John'])
    ).toBeFalsy();
    expect(
      await ArrayRule.doesNotContain('John').validate(['Peter'])
    ).toBeTruthy();
  });

  test('length equal to', async () => {
    expect(await ArrayRule.lengthEqual(1).validate(['John'])).toBeTruthy();
    expect(await ArrayRule.lengthEqual(1).validate([])).toBeFalsy();
  });

  test('length not equal to', async () => {
    expect(await ArrayRule.lengthNotEqual(1).validate(['John'])).toBeFalsy();
    expect(await ArrayRule.lengthNotEqual(1).validate([])).toBeTruthy();
  });

  test('length greater than', async () => {
    expect(
      await ArrayRule.lengthGreaterThan(1).validate(['John', 'Peter'])
    ).toBeTruthy();
    expect(await ArrayRule.lengthGreaterThan(1).validate([])).toBeFalsy();
  });

  test('length less than', async () => {
    expect(await ArrayRule.lengthLessThan(1).validate(['John'])).toBeFalsy();
    expect(await ArrayRule.lengthLessThan(1).validate([])).toBeTruthy();
  });

  test('length greater than or equal', async () => {
    expect(
      await ArrayRule.lengthGreaterThanOrEqual(1).validate(['John', 'Peter'])
    ).toBeTruthy();
    expect(
      await ArrayRule.lengthGreaterThanOrEqual(1).validate([])
    ).toBeFalsy();
  });

  test('length less than or equal', async () => {
    expect(
      await ArrayRule.lengthLessThanOrEqual(1).validate(['John', 'Peter'])
    ).toBeFalsy();
    expect(await ArrayRule.lengthLessThanOrEqual(1).validate([])).toBeTruthy();
  });
});
