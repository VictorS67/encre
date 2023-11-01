import {
  ReadableStream,
  ReadableStreamDefaultReadResult,
  ReadableStreamDefaultReader,
} from 'stream/web';

/**
 * @see https://streams.spec.whatwg.org/#rs-model for ReadableStream.
 * @see https://github.com/MattiasBuelens/web-streams-polyfill/pull/122#issuecomment-1627354490 for async interate ReadableStream.
 */
export class ReadableStreamAsyncIterable<T> extends ReadableStream<T> {
  private _reader: ReadableStreamDefaultReader<T>;

  acquireReader(): ReadableStreamDefaultReader<T> {
    if (!this._reader) {
      this._reader = this.getReader();
    }
    return this._reader;
  }

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

  async return(reason?: any): Promise<ReadableStreamDefaultReadResult<T>> {
    this._reader = this.acquireReader();
    const cancelPromise = this._reader.cancel(reason);
    this._reader.releaseLock();
    await cancelPromise;

    return { done: true, value: undefined };
  }

  // [Symbol.asyncIterator]() {
  //   return this;
  // }
}
