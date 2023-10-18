/**
 * Type definitions adapted from @types/pdf-parse and pdfjs-dist
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/pdf-parse/index.d.ts
 * https://github.com/mozilla/pdfjs-dist/blob/master/types/src/display/api.d.ts
 */
declare module 'pdf-parse' {
  export = PdfParse;

  declare function PdfParse(
    dataBuffer: Buffer,
    options?: PdfParse.Options
  ): Promise<PdfParse.Result>;

  declare namespace PdfParse {
    type Version =
      | 'default'
      | 'v1.9.426'
      | 'v1.10.100'
      | 'v1.10.88'
      | 'v2.0.550';
    interface Result {
      numpages: number;
      numrender: number;
      info: any;
      metadata: any;
      version: Version;
      text: string;
    }
    interface Options {
      pagerender?: ((pageData: any) => string) | undefined;
      max?: number | undefined;
      version?: Version | undefined;
    }
  }
}
