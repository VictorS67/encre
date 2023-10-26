import { expect, test } from '@jest/globals';
import { stringify } from 'yaml';
import { load } from '../../load';
import { OptionalImportMap, SecretMap } from '../../load/importType.js';
import { SecretFields } from '../../load/keymap';
import { SerializedConstructor } from '../../load/serializable';
import {
  Callable,
  CallableConfigFields,
  CallableConfig,
  CallableBindArgs,
  CallableEachArgs,
  CallableBatchOptions,
  CallableWithFallbacks,
  CallableWithFallbacksArg,
} from '../callable';

test('test custom callable', async () => {
  type TestInput = {
    input: string | boolean;
  };

  interface TestParams extends CallableConfig {
    hello: string;
    bye: string;
    testApi: string;
  }

  interface SerializableTestParams extends TestParams {
    serializableField: boolean;
  }

  class Test<
      CallOptions extends SerializableTestParams = SerializableTestParams,
    >
    extends Callable<TestInput, string, CallOptions>
    implements TestParams
  {
    _namespace: string[] = ['tests'];

    _isCallable = true;

    _isSerializable = true;

    get _secrets(): SecretFields | undefined {
      return {
        testApi: 'TEST_API',
      };
    }

    get _aliases(): SecretFields | undefined {
      return {
        testApi: 'test_api',
      };
    }

    hello: string;

    bye: string;

    testApi: string;

    constructor(fields?: Partial<TestInput> & SerializableTestParams) {
      super(fields ?? {});
      this.hello = fields?.hello ?? 'default-hello';
      this.bye = fields?.bye ?? 'default-bye';
      this.testApi = fields?.testApi ?? 'default-api';
    }

    async invoke(
      input: TestInput,
      options?: Partial<CallOptions> | undefined
    ): Promise<string> {
      this.hello = options?.hello ?? this.hello;
      this.bye = options?.bye ?? this.bye;

      return `${this.hello}-${String(input.input)}-${this.bye}-${String(
        this._kwargs.serializableField
      )}`;
    }
  }

  const test = new Test({
    hello: 'hello',
    bye: 'bye',
    serializableField: true,
    testApi: 'this-is-api',
  });
  const argumentsBefore = test._kwargs;
  const serializedStr: string = JSON.stringify(test, null, 2);

  expect(test._kwargs).toEqual(argumentsBefore);
  expect(stringify(JSON.parse(serializedStr))).toMatchSnapshot();

  expect(await test.invoke({ input: 'input' })).toBe('hello-input-bye-true');
  expect(await test.invoke({ input: true })).toBe('hello-true-bye-true');

  const test2 = await load<Test>(
    serializedStr,
    { TEST_API: 'this-is-a-key' } as SecretMap,
    { tests: { Test } } as OptionalImportMap
  );

  expect(test2).toBeInstanceOf(Test);
  expect(JSON.stringify(test2, null, 2)).toBe(serializedStr);

  expect(await test2.invoke({ input: 'input' })).toBe('hello-input-bye-true');
  expect(await test2.invoke({ input: true })).toBe('hello-true-bye-true');

  expect(
    await test2.invoke(
      { input: 'input' },
      { hello: 'new-hello', bye: 'new-bye' }
    )
  ).toBe('new-hello-input-new-bye-true');
  expect(
    await test2.invoke({ input: true }, { hello: 'new-hello', bye: 'new-bye' })
  ).toBe('new-hello-true-new-bye-true');

  const record = await test.toRecord('output');
  const recordStr = JSON.stringify(record, null, 2);
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

  const test3 = await load<Test>(
    recordStr,
    { TEST_API: 'this-is-a-key' } as SecretMap,
    { tests: { Test } } as OptionalImportMap
  );

  expect(test3).toBeInstanceOf(Test);
  expect(JSON.stringify(test3, null, 2)).toBe(serializedStr);
});

test('test batch calling', async () => {
  type TestInput = {
    input: string | boolean;
  };

  interface TestParams extends CallableConfig {
    hello: string;
    bye: string;
    testApi: string;
  }

  interface SerializableTestParams extends TestParams {
    shouldThrowError: boolean;
  }

  class Test<
      CallOptions extends SerializableTestParams = SerializableTestParams,
    >
    extends Callable<TestInput, string, CallOptions>
    implements TestParams
  {
    _namespace: string[] = ['tests'];

    _isCallable = true;

    _isSerializable = true;

    get _secrets(): SecretFields | undefined {
      return {
        testApi: 'TEST_API',
      };
    }

    get _aliases(): SecretFields | undefined {
      return {
        testApi: 'test_api',
      };
    }

    hello: string;

    bye: string;

    testApi: string;

    constructor(fields?: Partial<TestInput> & SerializableTestParams) {
      super(fields ?? {});
      this.hello = fields?.hello ?? 'default-hello';
      this.bye = fields?.bye ?? 'default-bye';
      this.testApi = fields?.testApi ?? 'default-api';
    }

    async invoke(
      input: TestInput,
      options?: Partial<CallOptions> | undefined
    ): Promise<string> {
      this.hello = options?.hello ?? this.hello;
      this.bye = options?.bye ?? this.bye;

      if (options?.shouldThrowError === true) {
        throw new Error('AbortError');
      }

      return `${this.hello}-${String(input.input)}-${this.bye}-${String(
        this._kwargs.shouldThrowError
      )}`;
    }
  }

  const test = new Test({
    hello: 'hello',
    bye: 'bye',
    shouldThrowError: false,
    testApi: 'this-is-api',
  });

  expect(
    await test.batch([{ input: 'input' }, { input: 'input2' }])
  ).toStrictEqual(['hello-input-bye-false', 'hello-input2-bye-false']);
  expect(
    await test.batch([{ input: true }, { input: 'input2' }])
  ).toStrictEqual(['hello-true-bye-false', 'hello-input2-bye-false']);

  const options: Partial<SerializableTestParams>[] = [
    {
      shouldThrowError: true,
    },
    {
      shouldThrowError: false,
    },
  ];

  const batchOptions: CallableBatchOptions = {
    maxConcurrency: 2,
    returnExceptions: true,
  };

  expect(
    await test.batch(
      [{ input: true }, { input: 'input2' }],
      options,
      batchOptions
    )
  ).toStrictEqual([new Error('AbortError'), 'hello-input2-bye-false']);
});

test('test CallableBind', async () => {
  type TestInput = {
    input: string | boolean;
  };

  interface TestParams extends CallableConfig {
    hello: string;
    bye: string;
    testApi: string;
  }

  interface SerializableTestParams extends TestParams {
    serializableField: boolean;
  }

  class Test<
      CallOptions extends SerializableTestParams = SerializableTestParams,
    >
    extends Callable<TestInput, string, CallOptions>
    implements TestParams
  {
    _namespace: string[] = ['tests'];

    _isCallable = true;

    _isSerializable = true;

    get _secrets(): SecretFields | undefined {
      return {
        testApi: 'TEST_API',
      };
    }

    get _aliases(): SecretFields | undefined {
      return {
        testApi: 'test_api',
      };
    }

    hello: string;

    bye: string;

    testApi: string;

    constructor(fields?: Partial<TestInput> & SerializableTestParams) {
      super(fields ?? {});
      this.hello = fields?.hello ?? 'default-hello';
      this.bye = fields?.bye ?? 'default-bye';
      this.testApi = fields?.testApi ?? 'default-api';
    }

    async invoke(
      input: TestInput,
      options?: Partial<CallOptions> | undefined
    ): Promise<string> {
      this.hello = options?.hello ?? this.hello;
      this.bye = options?.bye ?? this.bye;

      return `${this.hello}-${String(input.input)}-${this.bye}-${String(
        this._kwargs.serializableField
      )}`;
    }
  }

  class TestBind<
      CallOptions extends SerializableTestParams = SerializableTestParams,
    >
    extends Callable<TestInput, string, CallOptions>
    implements TestParams
  {
    _namespace: string[] = ['tests'];

    _isCallable = true;

    _isSerializable = true;

    get _secrets(): SecretFields | undefined {
      return {
        testApi: 'TEST_API',
      };
    }

    get _aliases(): SecretFields | undefined {
      return {
        testApi: 'test_api',
      };
    }

    hello: string;

    bye: string;

    testApi: string;

    constructor(fields?: Partial<TestInput> & SerializableTestParams) {
      super(fields ?? {});
      this.hello = fields?.hello ?? 'default-hello';
      this.bye = fields?.bye ?? 'default-bye';
      this.testApi = fields?.testApi ?? 'default-api';
    }

    async invoke(
      input: TestInput,
      options?: Partial<CallOptions> | undefined
    ): Promise<string> {
      return 'this-is-a-bind';
    }
  }

  const test = new Test({
    hello: 'hello',
    bye: 'bye',
    serializableField: true,
    testApi: 'this-is-api',
  });

  const testbind = new TestBind({
    hello: 'bind-hello',
    bye: 'bind-bye',
    serializableField: true,
    testApi: 'bind-this-is-api',
  });

  const tBind = testbind.bind(test);
  const newTest = test.bind(testbind);

  expect(await tBind.invoke({ input: 'input' })).toBe('this-is-a-bind');
  expect(await newTest.invoke({ input: 'input' })).toBe(
    'bind-hello-input-bind-bye-true'
  );

  const serializedStr: string = JSON.stringify(newTest, null, 2);
  expect(stringify(JSON.parse(serializedStr))).toMatchSnapshot();

  expect(
    stringify(JSON.parse(JSON.stringify(tBind, null, 2)))
  ).toMatchSnapshot();

  const record = await newTest.toRecord('output');
  const recordStr = JSON.stringify(record, null, 2);
  expect(JSON.parse(recordStr)).toMatchSnapshot({
    _recordId: expect.any(String),
    _metadata: {
      _inputs: {
        _recordId: expect.any(String),
        _kwargs: {
          bound: {
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
          },
        },
      },
      _outputs: {
        _recordId: expect.any(String),
      },
    },
  });

  const newBindObj = JSON.parse(serializedStr) as SerializedConstructor;
  const newBindArgs = newBindObj._kwargs as CallableBindArgs<
    TestInput,
    string,
    SerializableTestParams
  >;

  const newTest2 = await load<Test>(
    JSON.stringify(newBindArgs.bound, null, 2),
    { TEST_API: 'this-is-a-key' } as SecretMap,
    { tests: { Test } } as OptionalImportMap
  );
  expect(newTest2).toBeInstanceOf(Test);

  const newTest3 = await load<TestBind>(
    JSON.stringify(newBindArgs.kwargs, null, 2),
    { TEST_API: 'this-is-a-key' } as SecretMap,
    { tests: { TestBind } } as OptionalImportMap
  );
  expect(newTest3).toBeInstanceOf(TestBind);
});

test('test CallableEach', async () => {
  type TestInput = {
    input: string | boolean;
  };

  interface TestParams extends CallableConfig {
    hello: string;
    bye: string;
    testApi: string;
  }

  interface SerializableTestParams extends TestParams {
    serializableField: boolean;
  }

  class Test<
      CallOptions extends SerializableTestParams = SerializableTestParams,
    >
    extends Callable<TestInput, string, CallOptions>
    implements TestParams
  {
    _namespace: string[] = ['tests'];

    _isCallable = true;

    _isSerializable = true;

    get _secrets(): SecretFields | undefined {
      return {
        testApi: 'TEST_API',
      };
    }

    get _aliases(): SecretFields | undefined {
      return {
        testApi: 'test_api',
      };
    }

    hello: string;

    bye: string;

    testApi: string;

    constructor(fields?: Partial<TestInput> & SerializableTestParams) {
      super(fields ?? {});
      this.hello = fields?.hello ?? 'default-hello';
      this.bye = fields?.bye ?? 'default-bye';
      this.testApi = fields?.testApi ?? 'default-api';
    }

    async invoke(
      input: TestInput,
      options?: Partial<CallOptions> | undefined
    ): Promise<string> {
      this.hello = options?.hello ?? this.hello;
      this.bye = options?.bye ?? this.bye;

      return `${this.hello}-${String(input.input)}-${this.bye}-${String(
        this._kwargs.serializableField
      )}`;
    }
  }

  const test = new Test({
    hello: 'hello',
    bye: 'bye',
    serializableField: true,
    testApi: 'this-is-api',
  });

  const testMap = test.map();
  const serializedStr: string = JSON.stringify(testMap, null, 2);
  expect(stringify(JSON.parse(serializedStr))).toMatchSnapshot();

  expect(
    await testMap.invoke([{ input: 'input' }, { input: 'input2' }])
  ).toStrictEqual(['hello-input-bye-true', 'hello-input2-bye-true']);
  expect(
    await testMap.invoke([{ input: true }, { input: 'input2' }])
  ).toStrictEqual(['hello-true-bye-true', 'hello-input2-bye-true']);

  const record = await testMap.toRecord(['output', 'output2']);
  const recordStr = JSON.stringify(record, null, 2);
  expect(JSON.parse(recordStr)).toMatchSnapshot({
    _recordId: expect.any(String),
    _metadata: {
      _inputs: {
        _recordId: expect.any(String),
        _kwargs: {
          bound: {
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
          },
        },
      },
      _outputs: {
        _recordId: expect.any(String),
      },
    },
  });

  const newBindObj = JSON.parse(serializedStr) as SerializedConstructor;
  const newBindArgs = newBindObj._kwargs as CallableEachArgs<
    TestInput,
    string,
    SerializableTestParams
  >;

  const newTest2 = await load<Test>(
    JSON.stringify(newBindArgs.bound, null, 2),
    { TEST_API: 'this-is-a-key' } as SecretMap,
    { tests: { Test } } as OptionalImportMap
  );
  expect(newTest2).toBeInstanceOf(Test);
});

test('test CallableWithFallbacks', async () => {
  type TestInput = {
    input: string | boolean;
  };

  interface TestParams extends CallableConfig {
    hello: string;
    bye: string;
    testApi: string;
  }

  interface SerializableTestParams extends TestParams {
    shouldThrowError: boolean;
  }

  class Test<
      CallOptions extends SerializableTestParams = SerializableTestParams,
    >
    extends Callable<TestInput, string, CallOptions>
    implements TestParams
  {
    _namespace: string[] = ['tests'];

    _isCallable = true;

    _isSerializable = true;

    get _secrets(): SecretFields | undefined {
      return {
        testApi: 'TEST_API',
      };
    }

    get _aliases(): SecretFields | undefined {
      return {
        testApi: 'test_api',
      };
    }

    hello: string;

    bye: string;

    testApi: string;

    constructor(fields?: Partial<TestInput> & SerializableTestParams) {
      super(fields ?? {});
      this.hello = fields?.hello ?? 'default-hello';
      this.bye = fields?.bye ?? 'default-bye';
      this.testApi = fields?.testApi ?? 'default-api';
    }

    async invoke(
      input: TestInput,
      options?: Partial<CallOptions> | undefined
    ): Promise<string> {
      this.hello = options?.hello ?? this.hello;
      this.bye = options?.bye ?? this.bye;

      if (options?.shouldThrowError === true) {
        throw new Error('AbortError');
      }

      return `${this.hello}-${String(input.input)}-${this.bye}-${String(
        this._kwargs.serializableField
      )}`;
    }
  }

  const test = new Test({
    hello: 'hello',
    bye: 'bye',
    shouldThrowError: true,
    testApi: 'this-is-api',
  });

  const testFallback = new Test({
    hello: 'fallback-hello',
    bye: 'fallback-bye',
    shouldThrowError: true,
    testApi: 'this-is-api',
  });

  const testFallback2 = new Test({
    hello: 'fallback-hello-2',
    bye: 'fallback-hello-2',
    shouldThrowError: false,
    testApi: 'this-is-api',
  });

  const testWithFallbacks: CallableWithFallbacks<TestInput, string> =
    test.withFallbacks({ fallbacks: [testFallback, testFallback2] });

  const argumentsBefore = testWithFallbacks._kwargs;
  const serializedStr: string = JSON.stringify(testWithFallbacks, null, 2);

  expect(testWithFallbacks._kwargs).toEqual(argumentsBefore);
  expect(stringify(JSON.parse(serializedStr))).toMatchSnapshot();

  const newFallbackObj = JSON.parse(serializedStr) as SerializedConstructor;

  const { callable, fallbacks } =
    newFallbackObj._kwargs as CallableWithFallbacksArg<TestInput, string>;

  const test2 = await load<Test>(
    JSON.stringify(callable, null, 2),
    { TEST_API: 'this-is-a-key' } as SecretMap,
    { tests: { Test } } as OptionalImportMap
  );

  expect(test2).toBeInstanceOf(Test);
  expect(JSON.stringify(test2, null, 2)).toBe(JSON.stringify(test, null, 2));

  const newFallback = await load<Test>(
    JSON.stringify(fallbacks[0], null, 2),
    { TEST_API: 'this-is-a-key' } as SecretMap,
    { tests: { Test } } as OptionalImportMap
  );

  expect(newFallback).toBeInstanceOf(Test);
  expect(JSON.stringify(newFallback, null, 2)).toBe(
    JSON.stringify(testFallback, null, 2)
  );

  const newFallback2 = await load<Test>(
    JSON.stringify(fallbacks[1], null, 2),
    { TEST_API: 'this-is-a-key' } as SecretMap,
    { tests: { Test } } as OptionalImportMap
  );

  expect(newFallback2).toBeInstanceOf(Test);
  expect(JSON.stringify(newFallback2, null, 2)).toBe(
    JSON.stringify(testFallback2, null, 2)
  );

  const record = await testWithFallbacks.toRecord('output');
  const recordStr = JSON.stringify(record, null, 2);
  expect(JSON.parse(recordStr)).toMatchSnapshot({
    _recordId: expect.any(String),
    _metadata: {
      _inputs: {
        _recordId: expect.any(String),
        _kwargs: {
          callable: {
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
          },
          fallbacks: [
            {
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
            },
            {
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
            },
          ],
        },
      },
      _outputs: {
        _recordId: expect.any(String),
      },
    },
  });
});
