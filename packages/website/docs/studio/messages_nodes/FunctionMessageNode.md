## ** [ Node ] Function Message Node **

** A specialized node for handling function-related messages in a messaging system. **

---

| Reference | Link |
| --- | --- |
| Encre Component | [Function Message]() |
| API | [Function Message API]() |

### Overview

**

The Function Message Node is essential for managing messages that trigger or relate to specific functional operations within a system. It enables structured handling of function calls and their responses, making it invaluable in scenarios where automated actions or complex workflows need to be integrated into a messaging or chat system.
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

This node does not have any input ports. It is typically used to generate function-related messages or inject them into an existing conversation or workflow.

</TabItem>

<TabItem value="outputs">

### Outputs

| Port Name | Data Type | Description | Default Value | Notes |
| --- | --- | --- | --- | --- |
| message | `chat-message` | A chat message representing the function-related output | N/A | This output can be connected to other nodes in the conversation or workflow |

</TabItem>

<TabItem value="context">

### Process Context

N/A

</TabItem>

</Tabs>

### Usage

#### Use on its own

Here's an example of how to use `FunctionMessageNode`:

```typescript
import { FunctionMessageNodeImpl } from 'encre/packages/core/src/studio/nodes/input/message.node.ts';
import { FunctionMessage } from 'encre/packages/core/events/input/load/msgs/function.js'

const functionMessage = new FunctionMessage(
    {
        'content': 'this message is a function message',
        'role': 'function'
    }
);

const functionMessageNode = new FunctionMessageNodeImpl.nodeFrom(functionMessage);

```

#### Use in a graph

Not sure yet ...