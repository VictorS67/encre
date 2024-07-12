## StringPrompt

A concrete implementation of BasePrompt for text-based prompts. This class stores a string value and provides methods to output this value as a string or a chat message.

---

| Reference | Link |
| --- | --- |
| Encre Concept | [Serializable](**-a-link-to-the-corresponding-concept-documentation-**) |
| Encre Node | [Prompt Nodes](**-a-link-to-the-corresponding-node-documentation-**) |
| API | [** A reference to API Documentation **](**-a-link-to-the-corresponding-api-documentation-**) |

### Overview

The `StringPrompt` class provides a structured and extensible way to define various types of prompts in a system. It ensures consistency and reusability across different prompt types.


### Usage

#### Creating with Parameters

Here's an example of how to create `StringPrompt` with parameters:

```typescript
import { StringPrompt } from 'your/path/to/packages/core/src/events/input/load/prompts/chat.ts';

const messages: BaseMessage[] = [
  { text: 'Hello', sender: 'User' },
  { text: 'Hi there!', sender: 'Bot' },
];

// Initialize your component
const StringPrompt = new StringPrompt(messages);
```

Component parameters:

| Parameter | Runtime Type | Description |
| --- | --- | --- |
| template | string | Template string used to generate prompts. |
| inputVariables | string[] | List of input variables explicitly declared, used within the template. |
| guardrails | VariableRules | Optional rules for validating the input variables.|



