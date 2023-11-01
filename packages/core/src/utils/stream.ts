import {
  ReadableStream,
  ReadableStreamController,
  ReadableStreamDefaultReadResult,
  ReadableStreamDefaultReader,
} from 'stream/web';

/**
 * The ReadableStreamAsyncIterable class allows the ReadableStream to be used with 
 * for-await-of loops and other async iteration mechanism.
 * @see https://streams.spec.whatwg.org/#rs-model for ReadableStream.
 * @see https://github.com/MattiasBuelens/web-streams-polyfill/pull/122#issuecomment-1627354490 for async interate ReadableStream.
 * 
 * @template T The type of the chunks contained in the readable stream.
 */
export class ReadableStreamAsyncIterable<T> extends ReadableStream<T> {
  private _reader: ReadableStreamDefaultReader<T>;

  acquireReader(): ReadableStreamDefaultReader<T> {
    if (!this._reader) {
      this._reader = this.getReader();
    }
    return this._reader;
  }

  /**
   * Reads the next chunk from the stream using the acquired reader.
   * If the stream is finished, the reader is released.
   * 
   * @returns A promise that resolves with the next chunk from the stream.
   */
  async next(): Promise<ReadableStreamDefaultReadResult<T>> {
    this._reader = this.acquireReader();
    try {
      const result: ReadableStreamDefaultReadResult<T> =
        await this._reader.read();
      if (result.done) {
        this._reader.releaseLock();
      }

      return result;
    } catch (e) {
      this._reader.releaseLock();
      throw e;
    }
  }

  /**
   * Cancels the stream reading and releases the reader.
   * 
   * @param reason An optional reason for cancelling the stream reading.
   * @returns A promise that resolves with a done result indicating the stream is finished.
   */
  async return(reason?: any): Promise<ReadableStreamDefaultReadResult<T>> {
    this._reader = this.acquireReader();
    const cancelPromise = this._reader.cancel(reason);
    this._reader.releaseLock();
    await cancelPromise;

    return { done: true, value: undefined };
  }

  
  /**
   * Returns the async iterable iterator for this stream.
   * Allows the stream to be used with for-await-of loops and other async iteration mechanisms.
   * 
   * @returns An AsyncIterableIterator that can be used to read chunks from the stream asynchronously.
   */
  [Symbol.asyncIterator](): AsyncIterableIterator<T> {
    return {
      next: this.next.bind(this),
      return: this.return.bind(this),
      [Symbol.asyncIterator]() {
        return this;
      },
    };
  }

  /**
   * A utility function to create a ReadableStreamAsyncIterable from an async generator.
   * This allows create a readable stream from asynchronous generator functions.
   * 
   * @param generator An async generator function that yields chunks to be read.
   * @returns An instance of ReadableStreamAsyncIterable that reads chunks from the generator.
   */
  static withAsyncGenerator<T>(generator: AsyncGenerator<T>) {
    return new ReadableStreamAsyncIterable<T>({
      async pull(controller: ReadableStreamController<T>) {
        const { done, value } = await generator.next();

        if (done) {
          controller.close();
        } else {
          controller.enqueue(value);
        }
      },
    });
  }
}
