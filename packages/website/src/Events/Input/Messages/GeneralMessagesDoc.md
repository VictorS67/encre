## BaseMessage

The `BaseMessage` component is essential for defining and managing messages within the system. It is useful for maintaining consistent message structures, enabling serialization, and providing methods for message concatenation and equality checks. Prior knowledge of TypeScript and basic concepts of message handling in systems is recommended before working with this component.


---

| Reference | Link |
| --- | --- |
| Encre Concept | [Serializable, ContentLike, MessageRole](**-a-link-to-the-corresponding-concept-documentation-**) |
| Encre Node | [** A reference to the node that uses this component **](**-a-link-to-the-corresponding-node-documentation-**) |
| API | [** A reference to API Documentation **](**-a-link-to-the-corresponding-api-documentation-**) |

### Overview

The `BaseMessage` component is essential for defining and managing messages within the system. It is useful for maintaining consistent message structures, enabling serialization, and providing methods for message concatenation and equality checks. 


### Usage

#### Creating with Parameters

Here's an example of how to create `BaseMessage` with parameters:

```typescript
import {
  BaseMessage,
  ContentLike,
  MessageRole,
} from 'path/to/your/input/load/msgs/base.js';

class CustomMessage extends BaseMessage {
  _role(): MessageRole {
    return 'custom';
  }

  concat(message: BaseMessage): BaseMessage {
    const mergedContent = BaseMessage._mergeContent(this.content, message.content);
    const mergedKwargs = BaseMessage._mergeAdditionalKwargs(
      this.additionalKwargs,
      message.additionalKwargs
    );

    return new CustomMessage({
      content: mergedContent,
      additionalKwargs: mergedKwargs,
      name: this.name || message.name,
    });
  }
}

const message = new CustomMessage({ content: 'Hello, World!' });



```

Component parameters:

| Parameter | Runtime Type | Description |
| --- | --- | --- |
| content | `ContentLike` or `ContentLike[]` | The main content of the message. It can be a string or a more complex structure represented by an object with key-value pairs. |
| name | `string` | An optional name for the message, used for identifying or categorizing the message. |
| role | `MessageRole` | The role of the message, specifying the category of the sender or purpose within the system.|
| additionalKwargs | `{ [key: string]: unknown }` (optional) | Optional additional keyword arguments for extended functionality and flexibility in handling the message.|
