## **[Node] ChatMessageNodeImpl**

The ChatMessageNodeImpl is a specialized node designed for handling chat messages within a messaging system.

---

| Reference | Link |
| --- | --- |
| Encre Component | [ChatMessageNodeImpl]() |
| API | [ChatMessageNodeImpl]() |

### Overview

The ChatMessageNodeImpl is a node implementation that processes and routes chat messages in a messaging system. 

<Tabs
  defaultValue="inputs"
  values={[
    {label: 'Inputs', value: 'inputs'},
    {label: 'Outputs', value: 'outputs'},
    {label: 'Process Context', value: 'context'},
  ]}
>

<TabItem value="inputs">

### Inputs

This node does not have any input ports.

</TabItem>

<TabItem value="outputs">

### Outputs

| Port Name | Data Type | Description | Default Value | Notes |
| --- | --- | --- | --- | --- |
| `message` | `chat-message` | Outputs a chat message. | N/A | The output port for the processed chat message. |

</TabItem>

<TabItem value="context">

### Process Context
N/A

</TabItem>

</Tabs>

### Usage

#### Use on its own

Here's an example of how to use the `ChatMessageNodeImpl`:

```typescript
import { ChatMessageNodeImpl } from 'encre/packages/core/src/studio/nodes/input/message.node.ts';
import { ChatMessage } from 'encre/packages/core/events/input/load/msgs/chat.js'

const chatMessage = new ChatMessage({
  content: 'Hello, world!',
  role: 'human',
});

const chatMessageNode = ChatMessageNodeImpl.nodeFrom(chatMessage);

```

#### Use in a graph
```typescript
Not sure how to do it yet
```