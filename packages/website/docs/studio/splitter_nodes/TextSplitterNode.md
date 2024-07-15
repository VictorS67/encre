# TextSplitterNodeImpl

This node splits input text into multiple contexts for further processing.

---

| Reference | Link |
| --- | --- |
| Encre Component | [TextSplitter](link to textSplitterComponent md ) |
| API | [TextSplitterNodeImpl API](TypeDoc for TextSplitterNodeImpl) |

## Overview
**
The Text Splitter Node is useful for breaking down large pieces of text into smaller, manageable chunks. This is particularly helpful when working with large documents or when you need to process text in smaller segments.
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

| Port Name | Data Type | Description | Default Value | Notes |
| --- | --- | --- | --- | --- |
| input | `string`, `context`, or `context[]` | The text to be split | None, (required) | Can be a string, a single context, or an array of contexts |

</TabItem>

<TabItem value="outputs">

### Outputs

| Port Name | Data Type | Description | Default Value | Notes |
| --- | --- | --- | --- | --- |
| contexts | `context[]` | The resulting split contexts | N/A | An array of contexts derived from the split text data |

</TabItem>

<TabItem value="context">

### Process Context

N/A

</TabItem>

</Tabs>

### Usage

#### Use on its own

Here's an example of how to use `TextSplitterNode`:

```typescript
const textSplitterNode = TextSplitterNodeImpl.create();
const result = await textSplitterNode.process({
  input: { type: 'string', value: 'Your long text here...' }
}, {});
console.log(result.contexts);
```

#### Use in a graph

This example shows a graph processing example that splits a text and processes the resulting contexts:
<!-- 
```typescript
const graph = new Graph();

const textSplitterNode = graph.addNode(TextSplitterNodeImpl.create());
const processingNode = graph.addNode(/* Some other node for processing */);

graph.connect(textSplitterNode, 'contexts', processingNode, 'input');

const result = await graph.process({
  [textSplitterNode.id]: {
    input: { type: 'string', value: 'Your long text here...' }
  }
});
``` -->

