## ** [ Abstract ] Callable **

** 
A callable object is an object that can be used like a function, that can takes in an input and create an output **

----
| Reference | Link |
| --- | --- |
| API | [Callable API]() |

### Overview

**
Callable is an abstract class required to be extended in order to create callable objects in the library. 

Specifically, each callable object must contain a `invoke` method such that after calling the `invoke` method, so that the output can be produced from the input.
**

### Inputs

| InputName | Data Type | Description |
| ----------| ----------| ------------|
| CallInput | unknown | The expected input of the callable function
| CallOptions | CallableConfig |  Represents the configuration for a callable object, containing options like name, tags, metadata, and callbacks.

### Output

| OutputName | Data Type | Description |
| ----------| ----------| ------------|
| CallOutput | unknown  | The expected output type of the callable type

### Usage

Below is an example of how we can extend a callable class and call the `invoke` method. 

```typescript
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

  class Test<CallOptions extends SerializableTestParams = SerializableTestParams,
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

  await test.invoke({ input: 'input' })
  // should return 'hello-input-bye-true'
```
