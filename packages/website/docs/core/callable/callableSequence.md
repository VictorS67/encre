## ** [ Abstract ] CallableSequence **

** 
A callable object that manages a sequence of callables, where the output of one callable serves as the input to the next, creating a pipeline of operations. **

----
| Reference | Link |
| --- | --- |
| API | [CallableSequence API]() |

### Overview

**
CallableSequence is a class that extends the Callable abstract class, designed to create and manage a sequence of callable objects. It facilitates the creation of data processing pipelines where the output of one operation becomes the input for the next.

Key features of CallableSequence include:
- Ability to chain multiple callable objects in a sequence
- Automatic passing of output from one callable to the input of the next
- Support for batch processing of inputs
- Dynamic extension of the sequence through the `pipe` method
**

### Inputs

| InputName | Data Type | Description |
| ----------| ----------| ------------|
| CallInput | unknown | The input type for the first callable in the sequence |
| CallOptions | CallableConfig | Configuration options for the callable sequence |

### Output

| OutputName | Data Type | Description |
| ----------| ----------| ------------|
| CallOutput | unknown | The output type of the last callable in the sequence |

### Usage

Below is an example of how to create and use a CallableSequence:

```typescript
import { CallableLambda, CallableSequence } from 'encre/packages/core/src/record/callable.ts';

// Assume SimpleCallable is a class extended from the Callable class
const simpleCallable1 = new SimpleCallable({
    attr1: 1,
    secret1: 'this is a secret 1',
});

const lambda = async (
    input: SimpleCallableOutput,
    options?: Partial<SimpleCallableOptions> | undefined
): Promise<SimpleCallableOutput> => {
    return {
    output1: 'output1',
    output2: true,
    };
};

const simpleCallable2 = CallableLambda.from(lambda);

const simpleCallable3 = CallableLambda.from(lambda);

const simpleCallableSequence = CallableSequence.from([
    simpleCallable1,
    simpleCallable2,
    simpleCallable3,
]);
```

This example demonstrates creating a CallableSequence that doubles a number, adds 10, and then converts it to a string. It also shows how to extend the sequence and perform batch processing.