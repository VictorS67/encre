import { test, expect } from '@jest/globals';
import { stringify } from 'yaml';

import { OptionalImportMap, SecretMap } from '../importType.js';
import { load } from '../index.js';
import { SecretFields, SerializedFields } from '../keymap.js';
import { SerializableType, Serializable } from '../serializable.js';

test('test custom module serializable', async () => {
  class Test extends Serializable {
    _namespace: string[] = ['tests'];

    _isSerializable = true;

    get _secrets(): SecretFields | undefined {
      return { apiKey: 'TEST_API_KEY' };
    }

    get _attributes(): SerializedFields | undefined {
      return { 
        hello: this.hello,
        shouldOverride: 'should override'
      };
    }

    hello = 3;

    constructor(fields: { aField: string; apiKey: string; hello?: number, shouldOverride?: string }) {
      super(fields);
    }
  }

  class SubTest extends Test {
    get _secrets(): SecretFields | undefined {
      return {
        newApiKey: 'NEW_API_KEY',
        apiKey: 'OVERRIDE_API_KEY',
        inheritApiKey: 'INHERIT_API_KEY',
        'nested.api.key': 'NESTED_API_KEY',
      };
    }

    get _attributes(): SerializedFields | undefined {
      return { newAttr: this.newAttr };
    }

    newAttr = 42;

    inheritApiKey: string;

    nested: { api: { key: string } };

    constructor(fields: {
      aField: string;
      apiKey: string;
      newApiKey: string;
      inheritApiKey?: string;
      nested?: { api: { key: string } };
      hello?: number;
      newAttr?: number;
    }) {
      super(fields);

      this.inheritApiKey = fields.inheritApiKey ?? 'this-is-default-key';
      this.nested = fields.nested ?? {
        api: { key: 'this-is-default-nested-key' },
      };
    }
  }

  // In the serializable class, we test the following cases:
  // 1. attributes are decamalized (e.g. aField -> a_field, etcs.);
  // 2. attributes matchs kwargs after convert to JSON (e.g. a_fireld etcs.);
  // 3. serializedStr matchs after loading serializable class (e.g. load<Test>(...))
  const test = new Test({
    aField: 'hello',
    apiKey: 'this-is-a-key',
    shouldOverride: 'a new value'
  });
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

  // In the class that extends the parent serializable class,
  // we test the following cases:
  // 1. Inherit all attributes and secrets in the parent class (e.g. aField, etcs.);
  // 2. Override the secret keys (e.g. apiKey in parent requries TEST_API_KEY that is overrided to OVERRIDE_API_KEY);
  // 3. Add new attributes (e.g. newAttr etcs.);
  // 4. Nested secret (e.g. nested.api.key);
  // 5. default secret key values (e.g. inheritApiKey, etcs.).
  const subTest = new SubTest({
    aField: 'hello',
    apiKey: 'this-is-a-key',
    newApiKey: 'this-is-another-key',
  });

  const serializedStr2 = JSON.stringify(subTest, null, 2);
  expect(stringify(JSON.parse(serializedStr2))).toMatchSnapshot();

  const subTest2 = await load<Test>(
    serializedStr2,
    {
      OVERRIDE_API_KEY: 'this-is-a-key',
      TEST_API_KEY: 'this-is-a-key',
      NEW_API_KEY: 'this-is-another-key',
      INHERIT_API_KEY: 'this-is-default-key',
      NESTED_API_KEY: 'this-is-default-nested-key',
    } as SecretMap,
    { tests: { SubTest } } as OptionalImportMap
  );

  expect(subTest2).toBeInstanceOf(SubTest);
  expect(JSON.stringify(subTest2, null, 2)).toBe(serializedStr2);
});

test('test custom record serializable', async () => {
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

  class SubTest extends Test {
    get _secrets(): SecretFields | undefined {
      return {
        newApiKey: 'NEW_API_KEY',
        apiKey: 'OVERRIDE_API_KEY',
        inheritApiKey: 'INHERIT_API_KEY',
        'nested.api.key': 'NESTED_API_KEY',
      };
    }

    get _attributes(): SerializedFields | undefined {
      return { newAttr: this.newAttr };
    }

    newAttr = 42;

    inheritApiKey: string;

    nested: { api: { key: string } };

    constructor(fields: {
      aField: string;
      apiKey: string;
      newApiKey: string;
      inheritApiKey?: string;
      nested?: { api: { key: string } };
      hello?: number;
      newAttr?: number;
    }) {
      super(fields);

      this.inheritApiKey = fields.inheritApiKey ?? 'this-is-default-key';
      this.nested = fields.nested ?? {
        api: { key: 'this-is-default-nested-key' },
      };
    }
  }

  // In the serializable class, we test the following cases:
  // 1. attributes are stored in the record (e.g. _kwargs in recordStr);
  // 2. record Id are generated by nanoId (e.g. _recordId in recordStr);
  // 3. secret keys are grouped together (e.g. _secrets in recordStr._metadata);
  // 4. inputs contains all attributes except secret keys (e.g. _inputs in recordStr._metadata);
  // 5. outputs contains given attributes except secret keyts (e.g. _outputs in recordStr._metadata);
  // 6. serializedStr matchs after loading the record (e.g. load<Test>(...))
  const test = new Test({
    aField: 'hello',
    apiKey: 'this-is-a-key',
  });
  const argumentsBefore = test._kwargs;
  const serializedStr: string = JSON.stringify(test, null, 2);

  const record = await test.toRecord({
    aOutput: 'bye',
    apiKey: 'this-is-a-key',
  });
  const recordStr: string = JSON.stringify(record, null, 2);

  expect(test._kwargs).toEqual(argumentsBefore);
  expect(JSON.parse(recordStr)).toMatchSnapshot({
    _recordId: expect.any(String),
    _metadata: {
      _secrets: {
        _recordId: expect.any(String),
      },
      _inputs: {
        _recordId: expect.any(String),
      },
      _outputs: {
        _recordId: expect.any(String),
      },
    },
  });

  const test2 = await load<Test>(
    recordStr,
    { TEST_API_KEY: 'this-is-a-key' } as SecretMap,
    { tests: { Test } } as OptionalImportMap
  );

  expect(test2).toBeInstanceOf(Test);
  expect(JSON.stringify(test2, null, 2)).toBe(serializedStr);

  // In the class that extends the parent serializable class,
  // we test the following cases:
  // 1. Inherit all attributes and secrets in the parent class (e.g. aField, etcs.);
  // 2. Override the secret keys (e.g. apiKey in parent requries TEST_API_KEY that is overrided to OVERRIDE_API_KEY);
  // 3. Add new attributes (e.g. newAttr etcs.);
  // 4. Nested secret (e.g. nested.api.key);
  // 5. default secret key values (e.g. inheritApiKey, etcs.).
  // 6. serializedStr matchs after loading the record (e.g. load<SubTest>(...)).
  const subTest = new SubTest({
    aField: 'hello',
    apiKey: 'this-is-a-key',
    newApiKey: 'this-is-another-key',
  });

  const serializedStr2 = JSON.stringify(subTest, null, 2);
  const subRecord = await subTest.toRecord({
    aOutput: 'bye',
    apiKey: 'this-is-a-key',
  });
  const recordStr2 = JSON.stringify(subRecord, null, 2);
  expect(JSON.parse(recordStr2)).toMatchSnapshot({
    _recordId: expect.any(String),
    _metadata: {
      _secrets: {
        _recordId: expect.any(String),
      },
      _inputs: {
        _recordId: expect.any(String),
      },
      _outputs: {
        _recordId: expect.any(String),
      },
    },
  });

  const subTest2 = await load<Test>(
    recordStr2,
    {
      OVERRIDE_API_KEY: 'this-is-a-key',
      TEST_API_KEY: 'this-is-a-key',
      NEW_API_KEY: 'this-is-another-key',
      INHERIT_API_KEY: 'this-is-default-key',
      NESTED_API_KEY: 'this-is-default-nested-key',
    } as SecretMap,
    { tests: { SubTest } } as OptionalImportMap
  );

  expect(subTest2).toBeInstanceOf(SubTest);
  expect(JSON.stringify(subTest2, null, 2)).toBe(serializedStr2);
});
