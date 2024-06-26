## PDFLoader

Use PDFLoader to load (read) PDF files, extract textual content from each page, and construct an array of `Context` instances representing the content of each page along with relevant metadata.

---

| Reference | Link |
| --- | --- |
| Encre Concept | [Encre Concept Diagram](**-a-link-to-the-corresponding-concept-documentation-**) |
| Encre Node | [Node Documentation](**-a-link-to-the-corresponding-node-documentation-**) |
| API | [API Documentation](**-a-link-to-the-corresponding-api-documentation-**) |

### Overview

The PDFLoader component is useful for processing PDF files to extract text content from each page, which can then be used for various text processing tasks. This component can be particularly beneficial for applications requiring PDF text extraction, such as data analysis, machine learning, and document management systems.

Prior knowledge of the following is recommended:
1. Basic understanding of PDF structure and text extraction concepts.
2. Familiarity with JavaScript/TypeScript and npm/yarn for library management.

```bash
npm install pdf-parse
# or
yarn add pdf-parse

```
### Usage

#### Creating with Parameters

Here's an example of how to create `PDFLoader` with parameters:

```typescript
import path from 'path';
import url from 'url';
import { FileProvider } from './path/to/file/provider'; // Adjust the import path accordingly
import { PDFLoader } from './path/to/pdf'; // Adjust the import path accordingly

async function runPDFLoader() {
  // Define the file path to the PDF document
  const filePath = path.resolve(
    path.dirname(url.fileURLToPath(import.meta.url)),
    './path/to/your/pdf-file.pdf' // Adjust the file path accordingly
  );

  // Initialize the FileProvider with the PDF file path
  const provider = new FileProvider(filePath);

  // Initialize the PDFLoader with default options
  const loader = new PDFLoader();

  // Serialize the loader and log it
  const serializedStr = JSON.stringify(loader, null, 2);
  console.log('Serialized Loader:', serializedStr);

  // Load the documents
  const docs = await loader.load(provider.provide());

  // Log some checks
  console.log('Number of Documents:', docs.length);
  console.log('First Document Content:', docs[0].pageContent);

  // Invoke the loader and compare with docs
  const invokedDocs = await loader.invoke(provider.provide());
  console.log('Invoked Documents match loaded documents:', JSON.stringify(invokedDocs) === JSON.stringify(docs));
}

// Run the PDFLoader
runPDFLoader().catch((error) => {
  console.error('Error running PDFLoader:', error);
});


```

Component parameters:

| Parameter | Runtime Type | Description |
| --- | --- | --- |
| 'shouldsplit' | boolean | Indicates whether the PDF should be split into individual pages or not. Default is true. |
