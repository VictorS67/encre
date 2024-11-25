## RecursiveTextSplitter

The `RecursiveTextSplitter` is an advanced text splitting callable event designed to handle complex splitting requirements. It leverages `maxSize` and `overlap` parameters to ensure efficient and context-aware splitting.

---

| Reference     | Link                                                                                                                                                                         |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Encre Concept | [Callable Event](**-a-link-to-the-corresponding-concept-documentation-**)                                                                                                    |
| Encre Node    | [RecursiveTextSplitterNode](**-a-link-to-the-corresponding-node-documentation-**) <br> [LanguageTextSplitterNode](**-a-link-to-the-corresponding-node-documentation-**) <br> |
| API           | [RecursiveTextSplitter](**-a-link-to-the-corresponding-api-documentation-**)                                                                                                 |

### Overview

The `RecursiveTextSplitter` is an advanced text splitting callable event designed to handle complex splitting requirements. It leverages `maxSize` and `overlap` parameters to ensure efficient and context-aware splitting.

A splitter is a utility that breaks down large pieces of text or code into smaller, manageable chunks. This is useful for processing large documents, maintaining context in language models, or handling data that exceeds size limits of certain systems.

The `RecursiveTextSplitter` is capable of language-specific splitting, allowing it to intelligently split code based on the syntax and structure of various programming languages.

#### Supported Languages for code splitting

- `cpp`
- `go`
- `java`
- `js`
- `php`
- `proto`
- `python`
- `rst`
- `ruby`
- `rust`
- `scala`
- `swift`
- `markdown`
- `latex`
- `html`
- `sol`

### Usage

#### Creating with Parameters

Here's an example of how to create `RecursiveTextSplitter` with parameters:

```typescript
import { RecursiveTextSplitter } from "@encrejs/core";

const longDocument =
  "Section 1: Introduction\n\nThis section introduces the main concepts...\nSection 2: Development\nThis section covers the development...";

const splitter = new RecursiveTextSplitter({
  maxSize: 1000, // Maximum characters in a single chunk
  overlap: 50, // Characters to overlap between chunks
  separators: ["\n\n", ".", "\n"], // Order of separators to apply
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
| separators         | string array          | An array of strings defining the multiple separators to be used for splitting text. |

#### Inputs and Outputs

This example demonstrates how to use the `RecursiveTextSplitter` component to split a long document into smaller chunks:

```typescript
import { RecursiveTextSplitter } from "@encrejs/core";

const longDocument =
  "Section 1: Introduction\n\nThis section introduces the main concepts...\nSection 2: Development\nThis section covers the development...";

const splitter = new RecursiveTextSplitter({
  maxSize: 1000, // Maximum characters in a single chunk
  overlap: 50, // Characters to overlap between chunks
  separators: ["\n\n", ".", "\n"], // Order of separators to apply
  keepSeparator: true,
});

const splitText = await splitter.invoke(longDocument);
console.log(splitText);
// Output will show the text split into manageable chunks, maintaining logical separations and sections where possible.
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
    <td> array of context, each context contains the splitted page of content and the corresponding metadata for where the context is splitted from the original context.</td>
  </tr>
</table>