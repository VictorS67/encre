## [Node] RecursiveTextSplitterNodeImpl 

This node recursively splits input text into multiple contexts for advanced processing.

---

| Reference | Link |
| --- | --- |
| Encre Component | [RecursiveTextSplitter](link to RecursiveTextSplitter component md) |
| API | [RecursiveTextSplitterNodeImpl API]() |

### Overview

The Recursive Text Splitter Node is particularly useful for breaking down complex or structured text into smaller, manageable chunks. It's especially valuable when dealing with nested or hierarchical text structures, as it can intelligently split content based on various levels of separators.

This node can be configured for different languages or text formats, making it versatile for various text processing tasks.

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

| Port Name | Data Type | Description | Default Value | Notes |
| --- | --- | --- | --- | --- |
| input | `string`, `context`, or `context[]` | The text to be split recursively | (required) | Can be a string, a single context, or an array of contexts |

</TabItem>

<TabItem value="outputs">

### Outputs

| Port Name | Data Type | Description | Default Value | Notes |
| --- | --- | --- | --- | --- |
| contexts | `context[]` | The resulting split contexts | N/A | An array of contexts derived from the recursively split text data |

</TabItem>

<TabItem value="context">

### Process Context

N/A

</TabItem>

</Tabs>

### Usage

#### Use on its own

Here's an example of how to use `RecursiveTextSplitterNode`:

```typescript
const splitterNode = RecursiveTextSplitterNodeImpl.create();
const result = await splitterNode.process({
  input: { type: 'string', value: 'Your complex text here...' }
}, {});
console.log(result.contexts);
```

#### Use in a graph

This example shows a graph processing example that recursively splits a text and processes the resulting contexts:

<!-- ```typescript
const graph = new Graph();

const splitterNode = graph.addNode(RecursiveTextSplitterNodeImpl.create());
const processingNode = graph.addNode(/* Some other node for processing */);

graph.connect(splitterNode, 'contexts', processingNode, 'input');

const result = await graph.process({
  [splitterNode.id]: {
    input: { type: 'string', value: 'Your complex text here...' }
  }
});
``` -->

Note: You can customize the splitter for specific languages or formats by using the `nodeFrom` method with appropriate `registerArgs`:

```typescript
const customSplitter = new RecursiveTextSplitter(/* custom options */);
const languageSpecificNode = RecursiveTextSplitterNodeImpl.nodeFrom(customSplitter, { language: 'python' });
```

This allows for language-specific or format-specific splitting strategies.