## [Node] ChatPromptNode

This node generates chat-based prompts, creating structured conversational prompts or message sequences.

---

| Reference | Link |
| --- | --- |
| Encre Component | [ChatPrompt]() |
| API | [ChatPrompt API]() |

### Overview

The Chat Prompt Node is designed to create and manage chat-based prompts. It's particularly useful for generating structured conversations or message sequences that can be used in chatbot interactions, dialogue systems, or any application requiring a series of chat messages as input.

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

This node does not have any input ports. The chat prompt content is defined within the node's configuration.

</TabItem>

<TabItem value="outputs">

### Outputs

| Port Name | Data Type | Description | Default Value | Notes |
| --- | --- | --- | --- | --- |
| prompt | `string` or `chat-message[]` | The generated chat prompt | N/A | Can output either a string representation of the chat or an array of chat messages, depending on the configuration and connected nodes |

</TabItem>

<TabItem value="context">

### Process Context

N/A

</TabItem>

</Tabs>

### Usage

#### Use on its own

Here's an example of how to use `ChatPromptNode`:

```typescript
const promptNode = ChatPromptNodeImpl.create();
const result = await promptNode.process({}, {});
console.log(result.prompt);
```

#### Use in a graph

This example shows how to use a ChatPromptNode in a graph:

<!-- ```typescript
import { ChatPromptNodeImpl } from '@encre/chat-prompt';
import { Graph } from '@encre/graph';

const graph = new Graph();

const promptNode = graph.addNode(ChatPromptNodeImpl.create());
const processingNode = graph.addNode(/* Some other node that uses the chat prompt */);

graph.connect(promptNode, 'prompt', processingNode, 'input');

consst result = await graph.process({});
``` -->

### Custom Configuration

You can create a ChatPromptNode with custom configuration:

```typescript
import { ChatPrompt } from '@encre/chat-prompt';

const customChatPrompt = new ChatPrompt([
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'Hello, how are you?' },
  { role: 'assistant', content: 'I'm doing well, thank you. How can I assist you today?' }
]);
const customNode = ChatPromptNodeImpl.nodeFrom(customChatPrompt);
```

This allows you to define specific chat sequences or complex conversation structures within your node.

### Notes

- The ChatPromptNode can output either a string representation of the chat or an array of chat messages, making it versatile for different downstream node requirements.
- While this node doesn't have input ports, the underlying ChatPrompt can be configured with a series of messages, each with a role (e.g., 'system', 'user', 'assistant') and content.
- The actual content and structure of the chat prompt are determined by the ChatPrompt instance used to create the node. This allows for great flexibility in defining static or dynamic chat sequences.
- Chat prompts are particularly useful for working with language models that support role-based conversations, such as GPT models.
- The default creation (`create()`) initializes an empty chat prompt. You'll typically want to add messages to it or use a custom configuration for meaningful output.

### Advanced Usage

You can dynamically modify the chat prompt based on external inputs or conditions within your application logic:

```typescript
const chatNode = ChatPromptNodeImpl.create();
const chatPrompt = chatNode.data;

// Add messages dynamically
chatPrompt.addMessage({ role: 'user', content: 'What's the weather like today?' });
chatPrompt.addMessage({ role: 'assistant', content: 'I'm sorry, I don't have real-time weather information. Would you like me to explain how to check the weather?' });

// Process the node with the updated chat prompt
const result = await chatNode.process({}, {});
```

This flexibility allows you to create dynamic, context-aware chat prompts that can evolve based on the flow of your application or user interactions.