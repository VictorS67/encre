## ** [ Abstract ] CallableMap **

** 
A callable object that manages a collection of other callables, each associated with a specific key, allowing simultaneous invocation of multiple callables and aggregating their results into a single record. **

----
| Reference | Link |
| --- | --- |
| API | [CallableMap API]() |

### Overview

**
CallableMap is a class that extends the Callable abstract class, designed to manage and invoke multiple callable objects simultaneously. It provides a way to organize and execute a group of related operations, where each operation is represented by a callable associated with a unique key.

Key features of CallableMap include:
- Ability to manage multiple callables under a single object
- Parallel execution of all callables with the same input
- Aggregation of results from all callables into a single record
- Support for creating a CallableMap from a record of callable-like objects
**

### Inputs

| InputName | Data Type | Description |
| ----------| ----------| ------------|
| CallInput | unknown| The input type that each callable within the map will accept |
| CallOptions | CallableConfig | Configuration options for the callable map |

### Output

| OutputName | Data Type | Description |
| ----------| ----------| ------------|
| CallOutput | Record<string, unknown> | A record where each key corresponds to a callable's output |

### Usage

Below is an example of how to create and use a CallableMap:

```typescript
import { CallableMap } from 'encre/packages/core/src/record/callable.ts';

// Define individual callables - assume SimpleCallable is a class that extends the Callable abstract class
const simpleCallable1 = new SimpleCallable({
      attr1: 1,
      secret1: 'this is a secret 1',
    });

const simpleCallable2 = new SimpleCallable({
    attr1: 2,
    secret1: 'this is a secret 2',
});

const simpleCallable3 = new SimpleCallable({
    attr1: 3,
    secret1: 'this is a secret 3',
});

// Define the map
const simpleCallableMap = CallableMap.from({
    first: simpleCallable1,
    second: simpleCallable2,
    third: simpleCallable3,
});
```

This example demonstrates creating a CallableMap that contains three operations: doubling a number, squaring a number, and converting a number to a string. When invoked, all these operations are performed in parallel on the same input, and their results are aggregated into a single object.