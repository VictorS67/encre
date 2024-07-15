## ** [ Node ] Human Message Node **

** A specialized node for representing and processing human-generated messages in a messaging system. **

---

| Reference | Link |
| --- | --- |
| Encre Component | [Human Message]() |
| API | [Human Message API]() |

### Overview

**

The Human Message Node is crucial for integrating human-generated messages into a messaging or chat system. It allows for the processing and management of messages originating from human interactions, facilitating their incorporation into larger messaging workflows or AI-driven conversations.



**

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
| message | `chat-message` | A chat message representing the human input | N/A | This output can be connected to other nodes in the conversation flow |

</TabItem>

<TabItem value="context">

### Process Context

N/A

</TabItem>

</Tabs>

### Usage

#### Use on its own

Here's an example of how to use `HumanMessageNode`:

```typescript
import { HumanMessageNodeImpl } from 'encre/packages/core/src/studio/nodes/input/message.node.ts';
import { HumanMessage } from 'encre/packages/core/events/input/load/msgs/human.js'

const chatMessage = new HumanMessage({
  content: 'Hello, world!',
  role: 'human',
});

const humanMessageNode = HumanMessageNodeImpl.nodeFrom(chatMessage);

```

#### Use in a graph

This example shows a graph processing example that incorporates a human message into a conversation flow:

```typescript

Not sure how to do this part yet
```

This graph represents a simple conversation where a human message is created and then passed to an AI response node for processing.