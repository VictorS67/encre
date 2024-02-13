import { type readFile } from 'node:fs/promises';
import { BaseLoader } from './base.js';
import { Context } from './context.js';

/**
 * Abstract class that extends the `BaseLoader` class. It is a
 * document loader that loads document from a buffer. The `load()`
 * method is implemented to read the buffer contents and metadata,
 * and then calls the `parse()` method to parse the buffer and
 * return the documents.
 */
export abstract class BufferLoader<
  CallInput extends string | Blob = string | Blob,
> extends BaseLoader<CallInput> {

  _isSerializable = true;

  static _name(): string {
    return 'buffer';    
  }

  _loaderType(): string {
    return 'buffer';
  }

  /**
   * Abstract method that parse the buffer and return the documents.
   * @param rawData The buffer to parse.
   * @param metadata The metadata of the document.
   * @returns Promise that resolves with an array of `Context` objects.
   */
  protected abstract parse(
    rawData: Buffer,
    metadata: Context['metadata']
  ): Promise<Context[]>;

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
   * Async method that reads the buffer contents and metadata, and then
   * calls the `parse()` method to parse the buffer and return the documents.
   * @returns Promise that resolves with an array of `Context` objects.
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
