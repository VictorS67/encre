## HumanMessage

The `HumanMessage` component stores messages originating from human users within a conversation.

---

| Reference | Link |
| --- | --- |
| Encre Concept | [Serializable, ContentLike, MessageRole, BaseMessageFields](**-a-link-to-the-corresponding-concept-documentation-**) |
| Encre Node | [Human Message Node](**-a-link-to-the-corresponding-node-documentation-**) |
| API | [** A reference to API Documentation **](**-a-link-to-the-corresponding-api-documentation-**) |

### Overview

The `HumanMessage` component is crucial for handling messages from human users in a conversation. It inherits from the `BaseMessage` class and provides additional methods specific to human messages. Prior knowledge of TypeScript, inheritance, and basic message handling concepts is recommended before working with this component.


### Usage

#### Creating with Parameters

Here's an example of how to create `HumanMessage` with parameters:

```typescript

import { HumanMessage } from 'path/to/your/HumanMessage.js';

const message1 = new HumanMessage({ content: 'Hello!' });
const message2 = new HumanMessage({ content: 'How are you?' });

const concatenatedMessage = message1.concat(message2);
console.log(concatenatedMessage.toSerialized());

```

Component parameters:

| Parameter | Runtime Type | Description |
| --- | --- | --- |
| content | `ContentLike` or `ContentLike[]` | The main content of the message. It can be a string or a more complex structure represented by an object with key-value pairs. |
| name | `string` | An optional name for the message, used for identifying or categorizing the message. |
| role | `MessageRole` | The role of the message, specifying the category of the sender or purpose within the system.|
| additionalKwargs | `{ [key: string]: unknown }` (optional) | Optional additional keyword arguments for extended functionality and flexibility in handling the message.|