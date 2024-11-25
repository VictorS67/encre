## ** [ Node ] Bot Message Node **

** A specialized node for representing and processing bot-generated messages in a messaging system. **

---

| Reference | Link |
| --- | --- |
| Encre Component | [Bot Message]() |
| API | [Bot Message API]() |

### Overview

**

The Bot Message Node is essential for integrating automated or bot-generated messages into a messaging or chat system. It enables the processing and management of messages created by automated systems, facilitating their incorporation into larger messaging workflows or AI-driven conversations.


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

This node does not have any input ports. It is typically used to generate automated responses or inject bot messages into an existing conversation flow.

</TabItem>

<TabItem value="outputs">

### Outputs

| Port Name | Data Type | Description | Default Value | Notes |
| --- | --- | --- | --- | --- |
| message | `chat-message` | A chat message representing the bot's output | N/A | This output can be connected to other nodes in the conversation flow |

</TabItem>

<TabItem value="context">

### Process Context

N/A

</TabItem>

</Tabs>

### Usage

#### Use on its own

Here's an example of how to use `BotMessageNode`:

```typescript
import { BotMessageNodeImpl } from 'encre/packages/core/src/studio/nodes/input/message.node.ts';
import { BotMessage } from 'encre/packages/core/events/input/load/msgs/bot.js'

const chatMessage = new BotMessage({
  content: 'Hello, world!',
  role: 'assistant',
});

const botMessageNode = BotMessageNodeImpl.nodeFrom(chatMessage);
```

#### Use in a graph

This example shows a graph processing example that incorporates a bot message into a conversation flow:

```typescript
Not Sure how to do this part yet.

The below part is suggested by Claude 3.0 after feeding in the code files.
// import { Graph } from '@encre/graph';
// import { HumanMessageNode } from '@encre/human-message';
// import { BotMessageNodeImpl } from '@encre/bot-message';

// // Create a new graph
// const graph = new Graph();

// // Add nodes to the graph
// const humanMessage = graph.addNode(HumanMessageNode.create());
// const botResponse = graph.addNode(BotMessageNodeImpl.create());

// // Connect nodes
// graph.connect(humanMessage, 'message', botResponse, 'input');

// // Set the human message content
// humanMessage.data.content = "What's the weather like today?";

// // Set the bot response content
// botResponse.data.content = "I'm sorry, I don't have real-time weather information. You might want to check a weather website or app for the most up-to-date forecast.";

// // Process the graph
// const result = await graph.process({});

// console.log(result);
```