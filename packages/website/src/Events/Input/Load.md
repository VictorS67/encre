# Comprehensive Guide to Loading and Handling in Encre

Encre provides a versatile and extensible system for loading and processing various types of data, including documents, messages, and prompts. This guide covers the core components and processes involved in Encre's loading mechanisms, ensuring a seamless integration and efficient data handling across different formats and contexts.

## Contents
1. [Document Loading in Encre](#document-loading-in-encre)
2. [Message Loading in Encre](#message-loading-in-encre)
3. [Prompts in Encre](#prompts-in-encre)

## Document Loading in Encre

Encre provides a robust system for loading various types of documents and converting them into contexts for further processing. The system is designed to handle different input formats through a set of specialized loaders, each tailored to specific document types and data sources.

### Overview of Loaders

#### BaseLoader

- **Purpose**: Serves as an abstract base class for all document loaders.
- **Functionality**: Defines the core interface and common functionality for loading documents. It requires derived classes to implement the `load` method, which is responsible for reading the source data and converting it into a structured format (`Context`).
- **Key Features**:
  - `load(source: CallInput): Promise<CallOutput>`: Abstract method to be implemented by subclasses.
  - `invoke(input: CallInput, options?: Partial<CallOptions>): Promise<CallOutput>`: Manages the loading process and handles context splitting if needed.

#### BufferLoader

- **Purpose**: Extends `BaseLoader` to load documents from a buffer.
- **Functionality**: Reads buffer contents and metadata, then parses the raw data into contexts.
- **Key Features**:
  - `parse(rawData: Buffer, metadata: Context['metadata']): Promise<Context[]>`: Parses buffer data into an array of `Context` instances.
  - Handles metadata extraction and integrates document-specific details such as page numbers and PDF metadata.

### Loading Different Document Types

#### Text Documents

- **Loader**: Typically handled by a loader that reads text from various sources (e.g., files, web pages).
- **Process**: The loader reads the text content, processes it into chunks if necessary, and creates `Context` objects that encapsulate the text data and metadata.

#### PDF Documents

- **Loader**: Implemented in `BufferLoader` with specific parsing logic for PDF files.
- **Process**:
  - Reads the PDF buffer and extracts text content from each page.
  - Extracts metadata such as PDF version, document info, and total number of pages.
  - Constructs `Context` objects for each page or a single `Context` object containing the entire document text, depending on the `shouldSplit` option.

#### Example: PDF Document Loading

```typescript
class PDFLoader extends BufferLoader {
  async parse(rawData: Buffer, metadata: Context['metadata']): Promise<Context[]> {
    const { PdfParse } = await this._pdfjs();
    const pageContents: string[] = [];
    
    const renderPage = (pageData: PDFPageProxy): Promise<string> => {
      return pageData.getTextContent({ normalizeWhitespace: true }).then((textContent) => {
        const text = textContent.items.map((item) => (item as TextItem).str).join('\n');
        pageContents.push(text);
        return text;
      });
    };

    const pdf: Result = await PdfParse(rawData, { pagerender: renderPage });
    const PdfDocuments: Context[] = [];

    for (let i = 1; i <= pdf.numpages; i++) {
      PdfDocuments.push(new Context({
        pageContent: pageContents[i - 1],
        metadata: { ...metadata, loc: { pageNumber: i }, pdf: { version: pdf.version, info: pdf.info, totalPages: pdf.numpages } },
      }));
    }

    return this.shouldSplit ? PdfDocuments : [new Context({ pageContent: pageContents.join('\n\n'), metadata: { ...metadata, pdf: { version: pdf.version, info: pdf.info, totalPages: pdf.numpages } } })];
  }
}
```


## Message Loading in Encre

Encre supports the loading and processing of various types of messages, converting them into contexts that can be utilized within its pipeline. This system handles different message roles and formats, ensuring flexibility and consistency. Encre's message loading system is designed to handle a wide variety of message types and roles efficiently. By defining specific loaders for different message types, Encre ensures that data can be seamlessly integrated into its processing pipeline. Whether dealing with chat interactions, system messages, or function calls, Encre provides the necessary tools to load and process message data effectively.

### Overview of Message Loaders

#### Chat Messages

- **Loader**: Implemented to handle loading and processing of chat messages.
- **Process**:
  - Reads chat messages, which can include various roles such as human, assistant, system, function, and general.
  - Converts messages into a structured format (`Context`) for processing within the Encre pipeline.

#### Human Messages

- **Loader**: Specifically handles messages originating from human users.
- **Process**:
  - Converts human-generated text into `Context` objects.
  - Ensures proper handling of metadata and content to maintain context integrity.

#### Bot Messages

- **Loader**: Processes messages generated by bots.
- **Process**:
  - Converts bot-generated content into `Context` objects.
  - Maintains the role and metadata to ensure proper context management.

#### System Messages

- **Loader**: Manages messages related to system operations.
- **Process**:
  - Reads and processes system messages, converting them into `Context` objects.
  - Ensures that system-related metadata is accurately captured.

#### Function Messages

- **Loader**: Handles messages related to function calls or tool usage.
- **Process**:
  - Converts function-related messages into `Context` objects.
  - Captures relevant metadata to ensure accurate context representation.



