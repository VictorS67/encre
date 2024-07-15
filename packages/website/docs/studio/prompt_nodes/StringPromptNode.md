## [Node] StringPromptNode

This node generates string-based prompts or chat messages based on the provided configuration.

---

| Reference | Link |
| --- | --- |
| Encre Component | [StringPrompt]() |
| API | [StringPromptNode API]() |

### Overview

The String Prompt Node is designed to create and manage string-based prompts or chat messages. It can be used to generate static text or dynamically composed prompts based on the configured StringPrompt instance.



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

This node does not have any input ports. The prompt content is defined within the node's configuration.

</TabItem>

<TabItem value="outputs">

### Outputs

| Port Name | Data Type | Description | Default Value | Notes |
| --- | --- | --- | --- | --- |
| prompt | `string` or `chat-message[]` | The generated prompt | N/A | Can output either a string or an array of chat messages depending on the configuration and connected nodes |

</TabItem>

<TabItem value="context">

### Process Context

N/A

</TabItem>

</Tabs>

### Usage

#### Use on its own

Here's an example of how to use `StringPromptNode`:

```typescript
const promptNode = StringPromptNodeImpl.create();
const result = await promptNode.process({}, {});
console.log(result.prompt);
```

#### Use in a graph

This example shows how to use a `StringPromptNode` in a graph:

<!-- ```typescript
import { StringPromptNodeImpl } from '@encre/string-prompt';
import { Graph } from '@encre/graph';

const graph = new Graph();

const promptNode = graph.addNode(StringPromptNodeImpl.create());
const processingNode = graph.addNode(/* Some other node that uses the prompt */);

graph.connect(promptNode, 'prompt', processingNode, 'input');

const result = await graph.process({});
``` -->

### Custom Configuration

You can create a StringPromptNode with custom configuration:

```typescript
const customStringPrompt = new StringPrompt("This is a custom prompt template: {variable}");
const customNode = StringPromptNodeImpl.nodeFrom(customStringPrompt);
```

This allows you to define specific prompt templates or complex string generation logic within your node.

### Notes

- The StringPromptNode is versatile and can output either a string or an array of chat messages, making it compatible with various downstream nodes that expect different prompt formats.
- While this node doesn't have input ports, the underlying StringPrompt can be configured to include variables that could potentially be set through the node's configuration interface in a visual editor.
- The actual content and structure of the prompt are determined by the StringPrompt instance used to create the node. This allows for great flexibility in defining static or dynamic prompt content.