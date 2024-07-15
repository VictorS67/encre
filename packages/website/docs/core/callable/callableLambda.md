## ** [ Abstract ] CallableLambda **

** 
A callable object that encapsulates a lambda function, allowing it to be used as a Callable with the ability to take an input and produce an output. **

----
| Reference | Link |
| --- | --- |
| API | [CallableLambda API]() |

### Overview

**
CallableLambda is a specialized class that extends the Callable abstract class. It is designed to wrap a lambda function, either provided as a string representation or a function object, and make it usable as a Callable within the library ecosystem.

Key features of CallableLambda include:
- Ability to create a Callable from a compact, inline lambda function
- Support for both string representations and function objects of lambda functions
- Maintains the Callable interface, allowing it to be used wherever a regular Callable is expected
- Provides a static factory method for easy instantiation from a lambda function
**

### Inputs

| InputName | Data Type | Description |
| ----------| ----------| ------------|
| CallInput | unknown | The input type accepted by the lambda function |
| CallOptions | CallableConfig | Optional configuration for the callable object |

### Output

| OutputName | Data Type | Description |
| ----------| ----------| ------------|
| CallOutput | unknown | The output type produced by the lambda function |

### Usage

Below is an example of how to create and use a CallableLambda:

```typescript
import { CallableLambda } from 'encre/packages/core/src/record/callable.ts';

 type TestInput = {
    input: string | boolean;
  };

  type TestOutput = string;

  const handlerFunc = async (input: TestInput): Promise<TestOutput> => {
    return new Promise((resovle, reject) => resovle(String(input.input)));
  };

  const callableLambda = new CallableLambda<TestInput, TestOutput>({
    func: handlerFunc,
  });

  await callableLambda.invoke({ input: 'input' }
  // 'input'
```

This example demonstrates creating CallableLambda instances using both a string representation of a lambda function and a function object. It shows how to invoke these Callables and how they maintain the same interface as other Callable objects, including support for optional configuration.

The CallableLambda is particularly useful when you need to create simple, stateless Callable objects inline without defining a full class. It provides a lightweight way to integrate custom logic into systems expecting Callable objects.s