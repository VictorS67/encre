## ** [ Abstract ] CallableWithFallbacks **

** 
A callable object that manages a primary callable along with a list of fallback callables, attempting each in sequence until one succeeds or all fail. **

----
| Reference | Link |
| --- | --- |
| API | [CallableWithFallbacks API]() |

### Overview

**
CallableWithFallbacks is a specialized class that extends the Callable abstract class. It is designed to handle scenarios where multiple alternative implementations (fallbacks) are available for a particular operation.

Key features of CallableWithFallbacks include:
- Manages a primary callable and a list of fallback callables
- Attempts to invoke the primary callable first, then tries each fallback in sequence if previous attempts fail
- Supports both single invocation and batch processing
- Maintains the Callable interface, allowing it to be used wherever a regular Callable is expected
**

### Inputs

| InputName | Data Type | Description |
| ----------| ----------| ------------|
| CallInput | unknown | The input type that the primary callable and fallbacks accept |
| CallOptions | CallableConfig | Optional configuration for the callable object |

### Output

| OutputName | Data Type | Description |
| ----------| ----------| ------------|
| CallOutput | unknown | The output type that the primary callable and fallbacks produce |

### Usage

Below is an example of how to create and use a CallableWithFallbacks:

```typescript
import { CallableWithFallbacks } from 'encre/packages/core/src/record/callable.ts';

class SimpleCallable extends Callable<string, string> {
  private shouldSucceed: boolean;

  constructor(shouldSucceed: boolean) {
    super({});
    this.shouldSucceed = shouldSucceed;
  }

  async invoke(input: string): Promise<string> {
    if (this.shouldSucceed) {
      return `Success: ${input}`;
    } else {
      throw new Error('Callable failed');
    }
  }
}

// Create an instance of CallableWithFallbacks
const withFallbacks = new CallableWithFallbacks({
  callable: new SimpleCallable(false), // Primary callable (will fail)
  fallbacks: [
    new SimpleCallable(false),
    new SimpleCallable(true),  
    new SimpleCallablee(true)   
  ]
});

async function testCallableWithFallbacks() {
  try {
    const result = await withFallbacks.invoke('test input');
    console.log(result); // Output: "Success: test input"
  } catch (error) {
    console.error('All callables failed:', error);
  }

  const inputs = ['input1', 'input2', 'input3'];
  const results = await withFallbacks.batch(inputs);
  console.log(results); // Output: ["Success: input1", "Success: input2", "Success: input3"]
}
testCallableWithFallback()
```

This example demonstrates creating a CallableWithFallbacks instance using a custom Callable (UnreliableCallable). It shows how the class attempts each callable in sequence until one succeeds. The example includes both single invocation and batch processing scenarios.

CallableWithFallbacks is particularly useful in situations where you have multiple ways to perform an operation and want to try alternatives if the primary method fails. This can improve the robustness and reliability of your system by providing multiple paths to complete a task.