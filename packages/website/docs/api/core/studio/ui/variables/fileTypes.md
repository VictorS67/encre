# Variable: fileTypes

> `const` **fileTypes**: [`"text/plain"`, `"text/html"`, `"text/javascript"`, `"text/css"`, `"application/json"`, `"application/pdf"`, `"application/xml"`]

Represents a tuple of MIME types for various file formats that the system can handle.
This tuple is used to guide file operations like uploads, downloads, and internal file management, ensuring correct handling based on file type.

- 'text/plain': Plain text files without any formatting.
- 'text/html': HTML files, which are the backbone of web pages.
- 'text/javascript': JavaScript files, used in web development.
- 'text/css': CSS files, used to style HTML content.
- 'application/json': JSON files, commonly used for data interchange.
- 'application/pdf': PDF files, widely used for documents that require fixed formatting.
- 'application/xml': XML files, used for structured data and various configurations.

## Source

[packages/core/src/studio/ui.ts:399](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/ui.ts#L399)
