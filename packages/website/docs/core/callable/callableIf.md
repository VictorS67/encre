## ** [ Abstract ] CallableIf **

** 
A conditional callable object that determines which specific callable to execute based on predefined rules and input. **

----
| Reference | Link |
| --- | --- |
| API | [CallableIf API]() |

### Overview

**
CallableIf is an abstract class that extends the Callable class, designed to provide conditional execution of callables. It allows for the creation of complex logic flows where different callables are invoked based on the evaluation of input against a set of rules.

This class is particularly useful in scenarios where the choice of action depends on the input or context, enabling dynamic and flexible execution paths in your application.

Key features of CallableIf include:
- Definition of multiple rules and associated actions
- Optional default action for cases where no rules are satisfied
- Ability to execute multiple actions concurrently if multiple rules are satisfied
**

### Inputs

| InputName | Data Type | Description |
| ----------| ----------| ------------|
| CallInput | unknown | The input type for the callable, used to evaluate rules and passed to the executed callable(s) |
| CallOptions | CallableIfConfig | Configuration options for the CallableIf, extending the base CallableConfig |

### Output

| OutputName | Data Type | Description |
| ----------| ----------| ------------|
| CallOutput | Record<string, unknown> | A record mapping keys to outputs of individual callables that were executed |

### Usage

Below is an example of how to create and use a CallableIf instance:

```typescript
import { CallableIf,CallableLambda } from 'encre/packages/core/src/record/callable.ts';
import { GeneralRule } from 'encre/packages/core/src/events/inference/validate/guardrails/base.js'

type TestInput = {
    input: string | boolean;
  };

  const isStringRule = new GeneralRule({
    description: 'is string',
    func: async (input: { input: TestInput }) => {
      return typeof input.input === 'string';
    },
  });

  const isJohnRule = new GeneralRule({
    description: 'is John',
    func: async (input: { input: TestInput }) => {
      return String(input.input) === 'John';
    },
  });


  type TestOutputA = string;

  type TestOutputB = Array<string>;

  const handlerFunc = async (input: TestInput): Promise<TestOutputA> => {
    return new Promise((resovle, reject) => resovle(String(input.input)));
  };

  const handlerFunc2 = async (input: TestInput): Promise<TestOutputB> => {
    return new Promise((resovle, reject) => resovle([String(input.input)]));
  };

  const callableLambdaA = new CallableLambda<TestInput, TestOutputA>({
    func: handlerFunc,
  });

  const callableLambdaB = new CallableLambda<TestInput, TestOutputB>({
    func: handlerFunc2,
  });

  const callableIf = CallableIf.from<TestInput>(
    {
      'if input is a string': isStringRule,
      'if input is equal to "John"': isJohnRule,
    },
    {
      'if input is a string': callableLambdaA,
      'if input is equal to "John"': callableLambdaB,
    }
  );
   callableIf.invoke({ input: 'input' })
   // should return 'input'

```

In this example, we create a CallableIf instance that checks if a number is even and/or positive. It demonstrates how multiple rules can be evaluated concurrently and how the default action is used when no rules are satisfied.