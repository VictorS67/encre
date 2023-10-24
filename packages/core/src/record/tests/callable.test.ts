import { expect, test } from "@jest/globals";
import { stringify } from "yaml";
import { load } from "../../load";
import { OptionalImportMap, SecretMap } from "../../load/importType.js";
import { SecretFields } from "../../load/keymap";
import { SerializedConstructor } from "../../load/serializable";
import {
  Callable,
  CallableConfigFields,
  CallableConfig,
  CallableBindArgs,
} from "../callable";

test("test custom callable", async () => {
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
    _namespace: string[] = ["tests"];

    _isCallable = true;

    _isSerializable = true;

    get _secrets(): SecretFields | undefined {
      return {
        testApi: "TEST_API",
      };
    }

    get _aliases(): SecretFields | undefined {
      return {
        testApi: "test_api",
      };
    }

    hello: string;

    bye: string;

    testApi: string;

    constructor(fields?: Partial<TestInput> & SerializableTestParams) {
      super(fields ?? {});
      this.hello = fields?.hello ?? "default-hello";
      this.bye = fields?.bye ?? "default-bye";
      this.testApi = fields?.testApi ?? "default-api";
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
    hello: "hello",
    bye: "bye",
    serializableField: true,
    testApi: "this-is-api",
  });
  const argumentsBefore = test._kwargs;
  const serializedStr: string = JSON.stringify(test, null, 2);

  expect(test._kwargs).toEqual(argumentsBefore);
  expect(stringify(JSON.parse(serializedStr))).toMatchSnapshot();

  expect(await test.invoke({ input: "input" })).toBe("hello-input-bye-true");
  expect(await test.invoke({ input: true })).toBe("hello-true-bye-true");

  const test2 = await load<Test>(
    serializedStr,
    { TEST_API: "this-is-a-key" } as SecretMap,
    { tests: { Test } } as OptionalImportMap
  );

  expect(test2).toBeInstanceOf(Test);
  expect(JSON.stringify(test2, null, 2)).toBe(serializedStr);

  expect(await test2.invoke({ input: "input" })).toBe("hello-input-bye-true");
  expect(await test2.invoke({ input: true })).toBe("hello-true-bye-true");

  expect(
    await test2.invoke(
      { input: "input" },
      { hello: "new-hello", bye: "new-bye" }
    )
  ).toBe("new-hello-input-new-bye-true");
  expect(
    await test2.invoke({ input: true }, { hello: "new-hello", bye: "new-bye" })
  ).toBe("new-hello-true-new-bye-true");

  const record = await test.toRecord("output");
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
    { TEST_API: "this-is-a-key" } as SecretMap,
    { tests: { Test } } as OptionalImportMap
  );

  expect(test3).toBeInstanceOf(Test);
  expect(JSON.stringify(test3, null, 2)).toBe(serializedStr);
});

test("test CallableBind", async () => {
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
    _namespace: string[] = ["tests"];

    _isCallable = true;

    _isSerializable = true;

    get _secrets(): SecretFields | undefined {
      return {
        testApi: "TEST_API",
      };
    }

    get _aliases(): SecretFields | undefined {
      return {
        testApi: "test_api",
      };
    }

    hello: string;

    bye: string;

    testApi: string;

    constructor(fields?: Partial<TestInput> & SerializableTestParams) {
      super(fields ?? {});
      this.hello = fields?.hello ?? "default-hello";
      this.bye = fields?.bye ?? "default-bye";
      this.testApi = fields?.testApi ?? "default-api";
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
    _namespace: string[] = ["tests"];

    _isCallable = true;

    _isSerializable = true;

    get _secrets(): SecretFields | undefined {
      return {
        testApi: "TEST_API",
      };
    }

    get _aliases(): SecretFields | undefined {
      return {
        testApi: "test_api",
      };
    }

    hello: string;

    bye: string;

    testApi: string;

    constructor(fields?: Partial<TestInput> & SerializableTestParams) {
      super(fields ?? {});
      this.hello = fields?.hello ?? "default-hello";
      this.bye = fields?.bye ?? "default-bye";
      this.testApi = fields?.testApi ?? "default-api";
    }

    async invoke(
      input: TestInput,
      options?: Partial<CallOptions> | undefined
    ): Promise<string> {
      return "this-is-a-bind";
    }
  }

  const test = new Test({
    hello: "hello",
    bye: "bye",
    serializableField: true,
    testApi: "this-is-api",
  });

  const testbind = new TestBind({
    hello: "bind-hello",
    bye: "bind-bye",
    serializableField: true,
    testApi: "bind-this-is-api",
  });

  const tBind = testbind.bind(test);
  const newTest = test.bind(testbind);

  expect(await tBind.invoke({ input: "input" })).toBe("this-is-a-bind");
  expect(await newTest.invoke({ input: "input" })).toBe(
    "bind-hello-input-bind-bye-true"
  );

  const serializedStr: string = JSON.stringify(newTest, null, 2);
  expect(stringify(JSON.parse(serializedStr))).toMatchSnapshot();

  expect(
    stringify(JSON.parse(JSON.stringify(tBind, null, 2)))
  ).toMatchSnapshot();

  const record = await newTest.toRecord("output");
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

test("test CallableEach", async () => {
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
    _namespace: string[] = ["tests"];

    _isCallable = true;

    _isSerializable = true;

    get _secrets(): SecretFields | undefined {
      return {
        testApi: "TEST_API",
      };
    }

    get _aliases(): SecretFields | undefined {
      return {
        testApi: "test_api",
      };
    }

    hello: string;

    bye: string;

    testApi: string;

    constructor(fields?: Partial<TestInput> & SerializableTestParams) {
      super(fields ?? {});
      this.hello = fields?.hello ?? "default-hello";
      this.bye = fields?.bye ?? "default-bye";
      this.testApi = fields?.testApi ?? "default-api";
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
    hello: "hello",
    bye: "bye",
    serializableField: true,
    testApi: "this-is-api",
  });

  const testMap = test.map();
  const serializedStr: string = JSON.stringify(testMap, null, 2);
  expect(stringify(JSON.parse(serializedStr))).toMatchSnapshot();
});
