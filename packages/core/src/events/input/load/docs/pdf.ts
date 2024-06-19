import type {
  Result,
  Options,
  Version,
  PDFPageProxy,
  getTextContentParameters,
  TextItem,
  TextContent,
} from 'pdf-parse';
import { type BaseLoaderParams } from './base.js';
import { BufferLoader } from './buffer.js';
import { Context } from './context.js';

/**
 * Interface of PDFLoader
 */
export interface PDFLoaderParams extends BaseLoaderParams {}

/**
 * Dynamically imports the necessary dependencies from the 'pdf-parse' module.
 * This function is used to manage the dynamic loading of the 'pdf-parse' library,
 * which provides the functionality to parse PDF files.
 *
 * @returns A promise that resolves to the imported PdfParse function.
 * @throws Error if the 'pdf-parse' module fails to load.
 */
async function PDFLoaderImports() {
  try {
    const { default: PdfParse } = await import('pdf-parse');
    return { PdfParse };
  } catch (e) {
    console.error(e);
    throw new Error('Failed to load pdf-parse. Please install pdf-parse.');
  }
}

/**
 * A class that extends BufferLoader to specifically handle the loading and parsing of PDF files into contextual data.
 * This loader is designed to read PDF files, extract textual content from each page, and construct an array of `Context` instances
 * representing the content of each page along with relevant metadata.
 *
 * @template CallInput The type of input this loader accepts, restricted to strings representing file paths or Blob objects.
 */
export class PDFLoader<
  CallInput extends string | Blob = string | Blob,
> extends BufferLoader<CallInput> {
  _isSerializable = true;

  /**
   * The PdfParse module dynamically imported to handle PDF parsing.
   * @hidden
   * @internal
   */
  private _pdfjs: typeof PDFLoaderImports;

  static _name(): string {
    return 'PDFLoader';
  }

  _docType(): string {
    return 'pdf';
  }

  /**
   * Constructs a new PDFLoader instance with optional loader parameters and a PdfParse function.
   *
   * @param fields Loader-specific parameters including flags like shouldSplit to determine if the output should be split per page.
   * @param pdfjs An optional function to dynamically import PdfParse, defaults to PDFLoaderImports if not provided.
   */
  constructor(fields?: PDFLoaderParams, pdfjs?: typeof PDFLoaderImports) {
    super(fields ?? {});

    this.shouldSplit = fields?.shouldSplit ?? true;
    this._pdfjs = pdfjs ?? PDFLoaderImports;
  }

  /**
   * Parses the provided raw PDF data buffer, extracting textual content and associated metadata from each page.
   * This method is designed to sequentially render each page of the PDF, extracting the text and structuring it
   * into Context instances.
   *
   * @param rawData The raw buffer of the PDF file to be parsed.
   * @param metadata Metadata associated with the PDF document.
   * @returns A promise that resolves to an array of `Context` instances representing the parsed content of each page.
   */
  public async parse(
    rawData: Buffer,
    metadata: Context['metadata']
  ): Promise<Context[]> {
    const { PdfParse } = await this._pdfjs();

    const pageContents: string[] = [];
    const renderPage = (pageData: PDFPageProxy): Promise<string> => {
      const renderOptions: getTextContentParameters = {
        normalizeWhitespace: true,
        disableCombineTextItems: false,
      };

      return pageData
        .getTextContent(renderOptions)
        .then((textContent: TextContent) => {
          const text = textContent.items
            .map((item) => (item as TextItem).str)
            .join('\n');
          pageContents.push(text);

          return text;
        });
    };

    const options: Options = {
      pagerender: renderPage,
      version: 'v1.10.100',
    };

    const pdf: Result = await PdfParse(rawData, options);
    const meta: any = pdf.metadata;
    const info: any = pdf.info;
    const version: Version = pdf.version;
    const numPages: number = pdf.numpages;

    const PdfDocuments: Context[] = [];
    for (let i = 1; i <= numPages; i++) {
      PdfDocuments.push(
        new Context({
          pageContent: pageContents[i - 1],
          metadata: {
            ...metadata,
            pdf: {
              version,
              info: info,
              metadata: meta,
              totalPages: numPages,
            },
            loc: {
              pageNumber: i,
            },
          },
        })
      );
    }

    if (this.shouldSplit) {
      return PdfDocuments;
    }

    if (PdfDocuments.length === 0) {
      return [];
    }

    return [
      new Context({
        pageContent: PdfDocuments.map((doc: Context) => doc.pageContent).join(
          '\n\n'
        ),
        metadata: {
          ...metadata,
          pdf: {
            version,
            info: info,
            metadata: meta,
            totalPages: numPages,
          },
        },
      }),
    ];
  }
}
