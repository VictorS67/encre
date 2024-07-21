## BasePrompt

An abstract base class representing a generic prompt, which must be extended to provide specific types of prompts.

---

| Reference | Link |
| --- | --- |
| Encre Concept | [Serializable ](**-a-link-to-the-corresponding-concept-documentation-**) |
| Encre Node | [** A reference to the node that uses this component **](**-a-link-to-the-corresponding-node-documentation-**) |
| API | [** A reference to API Documentation **](**-a-link-to-the-corresponding-api-documentation-**) |

### Overview

The `BasePrompt` class provides a structured and extensible way to define various types of prompts in a system. It ensures consistency and reusability across different prompt types.


### Usage

#### Creating with Parameters

Here's an example of how to create `BasePrompt` with parameters:

```typescript
import { BasePrompt } from 'your/path/to/packages/core/src/events/input/load/prompts/base.ts';

class CustomPrompt extends BasePrompt {
  _promptType(): string {
    return 'custom';
  }

  toString(): string {
    return 'Custom prompt';
  }

  toChatMessages(): BaseMessage[] {
    // Implementation of chat messages conversion
    return [];
  }
}

// Initialize your component
const prompt = new CustomPrompt();

```

Component parameters:

| Parameter | Runtime Type | Description |
| --- | --- | --- |
| _namespace | string[] | Namespace array indicating the component's hierarchy. |
