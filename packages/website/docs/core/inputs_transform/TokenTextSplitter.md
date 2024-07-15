## TokenTextSplitter

The `TokenTextSplitter` is an advanced text splitting callable event designed to handle requirements of a tokenization model. It leverages `maxSize` and `overlap` parameters to ensure efficient and context-aware splitting based on tokens for natural language processing tasks.

---

| Reference     | Link                                                                                                                                                                         |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Encre Concept | [Callable Event](**-a-link-to-the-corresponding-concept-documentation-**)                                                                                                    |
| Encre Node    | [TokenTextSplitterNode](**-a-link-to-the-corresponding-node-documentation-**)                                                                                                |
| API           | [TokenTextSplitter](**-a-link-to-the-corresponding-api-documentation-**)                                                                                                     |

### Overview

The `TokenTextSplitter` is an advanced text splitting callable event designed to handle requirements of a tokenization model. It leverages `maxSize` and `overlap` parameters to ensure efficient and context-aware splitting based on tokens for natural language processing tasks.

A splitter is a utility that breaks down large pieces of text into smaller, manageable chunks. The `TokenTextSplitter` specifically splits text based on tokens, which is particularly useful for applications where precise control over the inclusion and exclusion of specific tokens or characters is necessary, such as in natural language processing or data sanitization tasks.

The `TokenTextSplitter` allows for customization of the splitting process through parameters such as `maxSize`, `overlap`, `modelName`, `allowedSpecial`, and `disallowedSpecial`.

### Usage

#### Creating with Parameters

Here's an example of how to create `TokenTextSplitter` with parameters:

```typescript
import { TokenTextSplitter } from "@encrejs/core";

const splitter = new TokenTextSplitter({
  maxSize: 512,
  overlap: 50,
  modelName: "gpt3-3.5-turbo",
  allowedSpecial: ["{", "}"], // Allow curly braces
  disallowedSpecial: "all"   // Disallow all other special characters
});
```

Component parameters:

| Parameter          | Runtime Type                                   | Description                                                                         |
| ------------------ | ---------------------------------------------- | ----------------------------------------------------------------------------------- |
| maxSize            | number                                         | The maximum size of a single context chunk.                                         |
| overlap            | number                                         | The number of characters to overlap between adjacent context chunks.                |
| computeContextSize | a sync/async function                          | Optional function to compute the size of a context, which can be asynchronous.      |
| separator          | string                                         | Separator in splitting text                                                         |
| keepSeparator      | boolean                                        | Flag to determine if the separator should be kept in the output                     |
| modelName          | string                                         | The name of the model used for tokenization.                                        |
| allowedSpecial     | string[] or 'all'                              | An array of allowed special characters or tokens, or 'all'.                         |
| disallowedSpecial  | string[] or 'all'                              | An array of disallowed special characters or tokens, or 'all'.                      |

#### Inputs and Outputs

This example demonstrates how to use the `TokenTextSplitter` component to split a text into multiple contexts based on tokens:

```typescript
import { TokenTextSplitter } from "@encrejs/core";

const splitter = new TokenTextSplitter({
  maxSize: 512,
  overlap: 50,
  modelName: "gpt3-3.5-turbo",
  allowedSpecial: ["{", "}"], // Allow curly braces
  disallowedSpecial: "all"   // Disallow all other special characters
});

const text = "Here is some text with {special characters} that need to be handled properly.";
const chunks = await splitter.invoke(text);
console.log(chunks);
// Output will show the text split into manageable chunks based on tokens, maintaining the allowed special characters and excluding the disallowed ones.
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
    <td> array of context, each context contains the split page of content based on tokens and the corresponding metadata for where the context is split from the original context.</td>
  </tr>
</table>