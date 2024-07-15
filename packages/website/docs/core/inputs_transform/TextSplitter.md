## TextSplitter

The `TextSplitter` is a text splitting callable event designed to split a given text into multiple contexts based on specified parameters. It extends the functionality of ContextSplitter by allowing the text to be split using a custom separator and controlling whether the separator should be retained in the outputs.

---

| Reference     | Link                                                                                                                                                                         |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Encre Concept | [Callable Event](**-a-link-to-the-corresponding-concept-documentation-**)                                                                                                    |
| Encre Node    | [TextSplitterNode](**-a-link-to-the-corresponding-node-documentation-**)                                                                                                     |
| API           | [TextSplitter](**-a-link-to-the-corresponding-api-documentation-**)                                                                                                          |

### Overview

The `TextSplitter` is a text splitting callable event designed to split a given text into multiple contexts based on specified parameters. It extends the functionality of ContextSplitter by allowing the text to be split using a custom separator and controlling whether the separator should be retained in the outputs.

A splitter is a utility that breaks down large pieces of text into smaller, manageable chunks. This is useful for processing large documents, maintaining context in language models, or handling data that exceeds size limits of certain systems.

The `TextSplitter` allows for customization of the splitting process through parameters such as `maxSize`, `overlap`, `separator`, and `keepSeparator`.

### Usage

#### Creating with Parameters

Here's an example of how to create `TextSplitter` with parameters:

```typescript
import { TextSplitter } from '@encrejs/core';

const textSplitter = new TextSplitter({
  maxSize: 1024,
  overlap: 50,
  separator: '\n\n',
  keepSeparator: true,
});
```

Component parameters:

| Parameter          | Runtime Type          | Description                                                                         |
| ------------------ | --------------------- | ----------------------------------------------------------------------------------- |
| maxSize            | number                | The maximum size of a single context chunk.                                         |
| overlap            | number                | The number of characters to overlap between adjacent context chunks.                |
| computeContextSize | a sync/async function | Optional function to compute the size of a context, which can be asynchronous.      |
| separator          | string                | Separator in splitting text                                                         |
| keepSeparator      | boolean               | Flag to determine if the separator should be kept in the output                     |

#### Inputs and Outputs

This example demonstrates how to use the `TextSplitter` component to split a text into multiple contexts:

```typescript
import { TextSplitter } from '@encrejs/core';

const textSplitter = new TextSplitter({
  maxSize: 1024,
  overlap: 50,
  separator: '\n\n',
  keepSeparator: true,
});

const inputText = `First paragraph.\n\nSecond paragraph.\n\nThird paragraph.`;
const contexts = await textSplitter.invoke(inputText);
console.log(contexts);
// Outputs the text split into contexts with separators included.
```

Invoking details:

<table>
  <tr>
    <td> <strong>Input variables</strong> </td> 
    <td> a single readable context derived from a page of content, or arrays of context, or string </td>
  </tr>
  <tr>
    <td> <strong>Invoke options</strong> </td> 
    <td> N/A </td>
  </tr>
  <tr>
    <td> <strong>Output variables</strong> </td> 
    <td> array of context, each context contains the split page of content and the corresponding metadata for where the context is split from the original context.</td>
  </tr>
</table>
