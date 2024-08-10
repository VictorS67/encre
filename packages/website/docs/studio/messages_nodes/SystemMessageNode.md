## ** [ Node ] System Message Node **

** A specialized node for representing and processing system-generated prompt messages in a messaging system. **

---

| Reference | Link |
| --- | --- |
| Encre Component | [System Message]() |
| API | [System Message API]() |

### Overview

**

The System Message Node is crucial for integrating system-generated prompt messages into a messaging or chat system. It enables the processing and management of messages created by system prompts, facilitating their incorporation into larger messaging workflows or AI-driven conversations.


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

This node does not have any input ports. It is typically used to generate system prompt messages or inject them into an existing conversation flow.

</TabItem>

<TabItem value="outputs">

### Outputs

| Port Name | Data Type | Description | Default Value | Notes |
| --- | --- | --- | --- | --- |
| message | `chat-message` | A chat message representing the system prompt output | N/A | This output can be connected to other nodes in the conversation flow |

</TabItem>

<TabItem value="context">

### Process Context

N/A

</TabItem>

</Tabs>

### Usage

#### Use on its own

Here's an example of how to use `SystemMessageNode`:

```typescript
import { SystemMessageNodeImpl } from 'encre/packages/core/src/studio/nodes/input/message.node.ts';
import { SystemMessage } from 'encre/packages/core/events/input/load/msgs/system.js'

const systemMessage = new SystemMessage({
    content: 'this is a message from the system',
    role: 'system'
  });

const systemMessageNode = SystemMessageNodeImpl.nodeFrom(systemMessage)

```

#### Use in a graph

This example shows a graph processing example that incorporates a system message into a conversation flow:

```typescript
Not sure how to do it right yet.
```
