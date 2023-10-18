import { type Result, type Options, type Version } from 'pdf-parse';
import { Context } from '../context';
import { BufferLoader } from './buffer';

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
 * Class that extends the `BufferLoader` class. It is a
 * document loader that loads documents from PDF files.
 */
export class PDFLoader<
  T extends string | Blob = string | Blob,
> extends BufferLoader<T> {
  private _splitPages: boolean;

  private _pdfjs: typeof PDFLoaderImports;

  constructor({ splitPages = true, pdfjs = PDFLoaderImports } = {}) {
    super();

    this._splitPages = splitPages;
    this._pdfjs = pdfjs;
  }

  /**
   * Method that taks a `rawData` buffer and `metadata` as parameters
   * and returns a promise that resolves to an array of `Context` instances.
   * @param rawData The buffer to be parsed.
   * @param metadata The metadata of the context.
   * @returns A promise that resolves to an array of `Context` instances.
   */
  public async parse(
    rawData: Buffer,
    metadata: Context['metadata']
  ): Promise<Context[]> {
    const { PdfParse } = await this._pdfjs();

    const pageContents: string[] = [];
    const renderPage = (pageData): string => {
      const renderOptions = {
        // replaces all occurrences of whitespace with standard spaces (0x20).
        // The default value is `false`.
        normalizeWhitespace: true,
        // do not attempt to combine same line TextItem's. The default value
        // is `false`.
        disableCombineTextItems: false,
      };

      return pageData
        .getTextContent(renderOptions)
        .then(function (textContent) {
          const text = textContent.items.map((item) => item.str).join('\n');
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

    if (this._splitPages) {
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
