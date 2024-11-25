## ** [ Abstract ] CallableBind **

** 
A callable object that allows binding configuration and arguments to another callable for future invocations, enabling pre-configuration of certain aspects of a callable's behavior before its actual invocation. **

----
| Reference | Link |
| --- | --- |
| API | [CallableBind API]() |

### Overview

**
CallableBind is a class that extends the Callable abstract class, designed to create a configurable wrapper around another callable object. It provides mechanisms to pre-configure and partially apply arguments to the underlying callable, allowing for more flexible and reusable callable objects.

Key features of CallableBind include:
- Ability to bind configuration and arguments to an existing callable
- Methods to create new instances with updated configurations or arguments
- Support for batch processing and streaming of inputs
- Maintains the callable interface, allowing it to be used wherever a regular callable is expected
**

### Inputs

| InputName | Data Type | Description |
| ----------| ----------| ------------|
| CallInput | unknown | The input type accepted by the underlying callable |
| CallOptions | CallableConfig | Configuration options extending CallableConfig |

### Output

| OutputName | Data Type | Description |
| ----------| ----------| ------------|
| CallOutput | unknown | The output type produced by the underlying callable |

### Usage

Below is an example of how to create and use a CallableBind:

```typescript
import { CallableBind } from 'encre/packages/core/src/record/callable.ts';

// Assume Test is a class extended from the abstract Callable class 
const test = new Test({
    hello: 'hello',
    bye: 'bye',
    serializableField: true,
    testApi: 'this-is-api',
  });

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

  const testbind = new TestBind({
    hello: 'bind-hello',
    bye: 'bind-bye',
    serializableField: true,
    testApi: 'bind-this-is-api',
  });

  const tBind = testbind.bind(test);
  const newTest = test.bind(testbind);

  tBind.invoke({ input: 'input' })
  // 'this-is-a-bind'
  newTest.invoke({ input: 'input' })
  // 'bind-hello-input-bind-bye-true'
```

This example demonstrates creating a CallableBind that wraps a simple callable. It shows how to pre-configure the callable with a prefix, create new instances with updated configurations, and use batch processing. The CallableBind maintains the same interface as the original callable, allowing it to be used in the same contexts while providing additional flexibility in configuration and argument binding.