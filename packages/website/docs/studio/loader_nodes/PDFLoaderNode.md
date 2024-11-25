## ** [ Node ] PDF Loader Node **

** A specialized node for loading and processing PDF documents in a data pipeline. **

---

| Reference | Link |
| --- | --- |
| Encre Component | [PDF Loader]() |
| API | [PDF Loader API]() |

### Overview

**

The PDF Loader Node is essential for integrating PDF document processing into your data pipeline. It allows you to extract content from PDF files, either from a URL or a local file, and convert it into a format suitable for further processing. This node is particularly useful for tasks involving document analysis, text extraction, or any workflow that requires processing PDF content.

Prior to using this node, ensure you have a basic understanding of PDF structure and the types of content you expect to extract. Familiarity with blob handling in JavaScript/TypeScript is also beneficial.

```bash
npm install pdf-parse
```

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
| pdf | `string` or `blob` | The PDF content to be processed | (required) | Can be either a URL string pointing to a PDF or a Blob containing PDF data |

</TabItem>

<TabItem value="outputs">

### Outputs

| Port Name | Data Type | Description | Default Value | Notes |
| --- | --- | --- | --- | --- |
| contexts | `context[]` | An array of context objects derived from the processed PDF | N/A | Each context object represents a processed segment of the PDF |

</TabItem>

<TabItem value="context">

### Process Context

N/A

</TabItem>

</Tabs>

### Usage

#### Use on its own

Here's an example of how to use `PDFLoaderNode`:

```typescript
import { PDFLoaderNodeImpl } from 'encre/packages/core/src/studio/nodes/input/loader.node.ts';

// Create a new PDF Loader Node
const pdfLoaderNode = PDFLoaderNodeImpl.create();

// Process a PDF file
const input = { pdf: 'https://example.com/sample.pdf' };
const result = await pdfLoaderNode.process(input, {});

console.log(result.contexts);
```

#### Use in a graph

This example shows a graph processing example that loads a PDF and processes its content:

```typescript
Code not too sure yet
```
