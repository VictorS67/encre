import { describe, expect, test } from '@jest/globals';
import { JSONObjectRule } from '../object';

describe('test JSONObjectRule', () => {
  test('exists', async () => {
    expect(await JSONObjectRule.exists().validate(undefined)).toBeFalsy();
    expect(await JSONObjectRule.exists().validate({})).toBeTruthy();
  });

  test("doesn't exists", async () => {
    expect(
      await JSONObjectRule.doesNotExist().validate(undefined)
    ).toBeTruthy();
    expect(await JSONObjectRule.doesNotExist().validate({})).toBeFalsy();
  });

  test('is empty', async () => {
    expect(await JSONObjectRule.isEmpty().validate({})).toBeTruthy();
    expect(
      await JSONObjectRule.isEmpty().validate({ name: 'John' })
    ).toBeFalsy();
  });

  test("isn't empty", async () => {
    expect(await JSONObjectRule.isNotEmpty().validate({})).toBeFalsy();
    expect(
      await JSONObjectRule.isNotEmpty().validate({ name: 'John' })
    ).toBeTruthy();
  });

  test('is equal to', async () => {
    expect(
      await JSONObjectRule.isStrictlyEqual({ name: 'John' }).validate({
        name: 'John',
      })
    ).toBeTruthy();
    expect(
      await JSONObjectRule.isStrictlyEqual({ name: 'John' }).validate({
        name: 'Peter',
      })
    ).toBeFalsy();
  });

  test("isn't equal to", async () => {
    expect(
      await JSONObjectRule.isNotStrictlyEqual({ name: 'John' }).validate({
        name: 'John',
      })
    ).toBeFalsy();
    expect(
      await JSONObjectRule.isNotStrictlyEqual({ name: 'John' }).validate({
        name: 'Peter',
      })
    ).toBeTruthy();
  });
});
