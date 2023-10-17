import { test, expect } from '@jest/globals';
import { stringify } from 'yaml';

import { OptionalImportMap, SecretMap } from '../importType.js';
import { load } from '../index.js';
import { SecretFields, SerializedFields } from '../keymap.js';
import { Serializable } from '../serializable';

test('test custom serializable', async () => {
  class Test extends Serializable {
    _namespace: string[] = ['tests'];

    _isSerializable = true;

    get _secrets(): SecretFields | undefined {
      return { apiKey: 'TEST_API_KEY' };
    }

    get _attributes(): SerializedFields | undefined {
      return { hello: this.hello };
    }

    hello = 3;

    constructor(fields: { aField: string; apiKey: string; hello?: number }) {
      super(fields);
    }
  }

  const test = new Test({ aField: 'hello', apiKey: 'this-is-a-key' });
  const argumentsBefore = test._kwargs;
  const serializedStr: string = JSON.stringify(test, null, 2);

  expect(test._kwargs).toEqual(argumentsBefore);
  expect(stringify(JSON.parse(serializedStr))).toMatchSnapshot();

  const test2 = await load<Test>(
    serializedStr,
    { TEST_API_KEY: 'this-is-a-key' } as SecretMap,
    { tests: { Test } } as OptionalImportMap
  );

  expect(test2).toBeInstanceOf(Test);
  expect(JSON.stringify(test2, null, 2)).toBe(serializedStr);
});
