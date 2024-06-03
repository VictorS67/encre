import { type readFile } from 'node:fs/promises';
import { BaseLoader } from './base.js';
import { Context } from './context.js';

/**
 * An abstract class that extends `BaseLoader` to specifically handle the loading of documents from buffers.
 * This class is designed to facilitate the reading of file contents or blob data, parse them, and convert them into a structured format (`Context` objects).
 * Implementations need to define the `parse` method to specify how the buffer is processed.
 *
 * @template CallInput The type of input this loader accepts, either a file path (`string`) or a blob (`Blob`).
 */
export abstract class BufferLoader<
  CallInput extends string | Blob = string | Blob,
> extends BaseLoader<CallInput> {

  _isSerializable = true;

  static _name(): string {
    return 'buffer';    
  }

  _docType(): string {
    return 'buffer';
  }

  /**
   * Abstract method that parse the buffer and return the documents.
   * 
   * @param rawData The buffer to parse.
   * @param metadata The metadata of the document.
   * @returns Promise that resolves with an array of `Context` objects.
   * @internal
   */
  protected abstract parse(
    rawData: Buffer,
    metadata: Context['metadata']
  ): Promise<Context[]>;

  /** @hidden */
  static async imports(): Promise<{ readFile: typeof readFile }> {
    try {
      const { readFile } = await import('node:fs/promises');

      return { readFile };
    } catch (e) {
      console.error(e);
      throw new Error('Failed to load fs/promises.');
    }
  }

  /**
   * Loads and parses document data from a buffer, converting it into an array of `Context` instances.
   * This method orchestrates the reading of file or blob data and their subsequent parsing into structured formats.
   *
   * @param filePathOrBlob The file path or blob object containing the document data to be loaded.
   * @returns A promise resolving to an array of `Context` instances, representing the parsed documents.
   */
  public async load(filePathOrBlob: CallInput): Promise<Context[]> {
    let buffer: Buffer;
    let metadata: Context['metadata'];

    if (typeof filePathOrBlob === 'string') {
      const { readFile } = await BufferLoader.imports();
      buffer = await readFile(filePathOrBlob);
      metadata = { source: filePathOrBlob };
    } else {
      buffer = await filePathOrBlob
        .arrayBuffer()
        .then((arrayBuffer) => Buffer.from(arrayBuffer));
      metadata = {
        source: 'blob',
        bolbType: filePathOrBlob.type,
        blobSize: filePathOrBlob.size,
      };
    }

    return this.parse(buffer, metadata);
  }
}
