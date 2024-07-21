## FunctionMessage

The `FunctionMessage` component stores messages related to function calls or configurations within a conversation.

---

| Reference | Link |
| --- | --- |
| Encre Concept | [Serializable, ContentLike, MessageRole, BaseMessageFields](**-a-link-to-the-corresponding-concept-documentation-**) |
| Encre Node | [Function Message Node](**-a-link-to-the-corresponding-node-documentation-**) |
| API | [** A reference to API Documentation **](**-a-link-to-the-corresponding-api-documentation-**) |

### Overview

The `FunctionMessage` component is crucial for handling messages that relate to function calls or configurations in a conversation. It inherits from the `BaseMessage` class and provides additional methods specific to function messages.

### Usage

#### Creating with Parameters

Here's an example of how to create `FunctionMessage` with parameters:

```typescript

import { FunctionMessage} from 'path/to/your/FunctionMessage.js';


const message1 = new FunctionMessage({ content: 'Initialize function.' });
const message2 = new FunctionMessage({ content: 'Update function parameters.' });

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