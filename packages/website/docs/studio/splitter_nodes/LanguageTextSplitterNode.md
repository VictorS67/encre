## [Node] Language Text Splitter Node

This node splits input text into multiple contexts based on specific language rules and structures.

---

| Reference | Link |
| --- | --- |
| Encre Component | [LanguageTextSplitter]() |
| API | [LanguageTextSplitterNodeImpl API](https://docs.encre.io/api/language-text-splitter) |

### Overview

The Language Text Splitter Node is designed to break down text into manageable chunks while respecting the syntax and structure of specific programming languages or markup formats. This node is particularly useful when processing code snippets, documentation, or any text that follows language-specific patterns.

It supports various languages and formats, including Python, JavaScript, HTML, Markdown, and more, allowing for precise and context-aware text splitting.



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
| input | `string`, `context`, or `context[]` | The text to be split according to language-specific rules | (required) | Can be a string, a single context, or an array of contexts |

</TabItem>

<TabItem value="outputs">

### Outputs

| Port Name | Data Type | Description | Default Value | Notes |
| --- | --- | --- | --- | --- |
| contexts | `context[]` | The resulting split contexts | N/A | An array of contexts derived from the language-specific text splitting |

</TabItem>

<TabItem value="context">

### Process Context

N/A

</TabItem>

</Tabs>

### Usage

#### Use on its own

Here's an example of how to use `LanguageTextSplitterNode`:

```typescript
const splitterNode = LanguageTextSplitterNodeImpl.create({ language: 'python' });
const result = await splitterNode.process({
  input: { type: 'string', value: 'def example():\n    print("Hello, World!")' }
}, {});
console.log(result.contexts);
```

#### Use in a graph

This example shows a graph processing example that splits Python code and processes the resulting contexts:

<!-- ```typescript
const graph = new Graph();

const splitterNode = graph.addNode(LanguageTextSplitterNodeImpl.create({ language: 'python' }));
const processingNode = graph.addNode(/* Some other node for processing */);

graph.connect(splitterNode, 'contexts', processingNode, 'input');

const result = await graph.process({
  [splitterNode.id]: {
    input: { type: 'string', value: 'def example():\n    print("Hello, World!")' }
  }
});
``` -->
<br> 
Note: The `language` parameter in the `create` method is crucial for tailoring the splitting strategy to the specific language or format of your text. Supported languages include:

- 'cpp'
- 'go'
- 'java'
- 'js'
- 'php'
- 'proto'
- 'python'
- 'rst'
- 'ruby'
- 'rust'
- 'scala'
- 'swift'
- 'markdown'
- 'latex'
- 'html'
- 'sol' (Solidity)

Choose the appropriate language to ensure optimal splitting results for your specific use case.