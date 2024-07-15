## [Node] Token Text Splitter Node

This node splits input text into multiple contexts based on token count, providing a consistent way to break down text for processing.

---

| Reference | Link |
| --- | --- |
| Encre Component | [TokenTextSplitter](link to TokenTextSplitter component md file) |
| API | [TokenTextSplitterNodeImpl API]() |

### Overview

The Token Text Splitter Node is designed to divide text into smaller chunks based on a specified number of tokens. This approach is particularly useful for tasks that require processing text in fixed-size segments, such as working with large language models or performing tokenization-based analysis.

This node ensures that text is split in a way that respects token boundaries, which can be crucial for maintaining the integrity of words and phrases in the resulting contexts.

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
| input | `string`, `context`, or `context[]` | The text to be split into tokens | (required) | Can be a string, a single context, or an array of contexts |

</TabItem>

<TabItem value="outputs">

### Outputs

| Port Name | Data Type | Description | Default Value | Notes |
| --- | --- | --- | --- | --- |
| contexts | `context[]` | The resulting split contexts | N/A | An array of contexts, each containing a specified number of tokens |

</TabItem>

<TabItem value="context">

### Process Context

N/A

</TabItem>

</Tabs>

### Usage

#### Use on its own

Here's an example of how to use `TokenTextSplitterNode`:

```typescript
import { TokenTextSplitterNodeImpl } from '@encre/token-text-splitter';

const splitterNode = TokenTextSplitterNodeImpl.create();
const result = await splitterNode.process({
  input: { type: 'string', value: 'This is a long piece of text that will be split into tokens.' }
}, {});
console.log(result.contexts);
```

#### Use in a graph

This example shows a graph processing example that splits text into token-based contexts and processes the resulting contexts:

<!-- ```typescript
import { TokenTextSplitterNodeImpl } from '@encre/token-text-splitter';
import { Graph } from '@encre/graph';

const graph = new Graph();

const splitterNode = graph.addNode(TokenTextSplitterNodeImpl.create());
const processingNode = graph.addNode(/* Some other node for processing */);

graph.connect(splitterNode, 'contexts', processingNode, 'input');

const result = await graph.process({
  [splitterNode.id]: {
    input: { type: 'string', value: 'This is a long piece of text that will be split into tokens.' }
  }
});
``` -->
<br>
Note: The TokenTextSplitterNode uses default settings when created with the `create()` method. If you need to customize the token splitting behavior (e.g., changing the number of tokens per chunk or the overlap between chunks), you would need to create a custom TokenTextSplitter instance and use the `nodeFrom` method:

```typescript
import { TokenTextSplitter } from '@encre/token-text-splitter';

const customTokenSplitter = new TokenTextSplitter({
  chunkSize: 100,
  chunkOverlap: 20,
  // Add other configuration options as needed
});

const customNode = TokenTextSplitterNodeImpl.nodeFrom(customTokenSplitter);
```

This allows for fine-tuning the token splitting process to meet specific requirements of your text processing pipeline.