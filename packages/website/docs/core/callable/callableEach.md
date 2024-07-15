## ** [ Abstract ] CallableEach **

** 
A callable object that applies a given callable to each item in a collection of inputs, producing a collection of outputs. **

----
| Reference | Link |
| --- | --- |
| API | [CallableEach API]() |

### Overview

**
CallableEach is a specialized class that extends the Callable abstract class. It is designed to apply a given callable to each item in an input array, effectively performing batch operations.

Key features of CallableEach include:
- Applies a bound callable to each item in an input array
- Supports batch processing of inputs
- Maintains the Callable interface, allowing it to be used wherever a regular Callable is expected
- Provides a bind method for creating new instances with specific configurations
**

### Inputs

| InputName | Data Type | Description |
| ----------| ----------| ------------|
| CallInputItem[] | Array | An array of input items, each of which will be processed by the bound callable |
| CallOptions | CallableConfig | Optional configuration for the callable object, applied to each invocation |

### Output

| OutputName | Data Type | Description |
| ----------| ----------| ------------|
| CallOutputItem[] | Array | An array of output items, each corresponding to an input item after processing |

### Usage

Below is an example of how to create and use a CallableEach:

```typescript
import { Callable, CallableEach } from '@your-library/path';
// Assume SimpleCallable is an extension of the Callable class
const simpleCallable = new SimpleCallable({
    attr1: 1,
    secret1: 'this is a secret',
});
const aCallableEach = await load<
      CallableEach<
        SimpleCallableInput,
        SimpleCallableOutput,
        SimpleCallableOptions
      >
    >(
      str,
      { TEST_SECRET_1: 'other secret 1' } as SecretMap,
      {
        'custom/tests': { SimpleCallable },
        'record/callable': { CallableEach },
      } as OptionalImportMap
    );

aCallable.getAttributes().metadata.callables?.bound 
// it should be equal to the simpleCallable.getAttributes()
```

This example demonstrates creating a CallableEach instance using a custom Callable (DoubleCallable). It shows how to invoke the CallableEach with an array of inputs, how to use optional configuration, and how to create a new instance with bound configuration.

The CallableEach is particularly useful for batch processing scenarios where you need to apply the same operation to multiple inputs efficiently. It provides a convenient way to parallelize operations on collections of data within systems expecting Callable objects.