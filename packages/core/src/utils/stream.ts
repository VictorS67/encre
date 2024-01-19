import {
  ReadableStream,
  ReadableStreamController,
  ReadableStreamDefaultReadResult,
  ReadableStreamDefaultReader,
  TextDecoderStream,
} from 'stream/web';

type Bytes = string | ArrayBuffer | Uint8Array | Buffer | null | undefined;

type ServerSentEvent = {
  event: string | null;
  data: string;
  raw: string[];
};

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

/**
 * Handles the processing of data streams, specifically designed for Server-Sent Events (SSEs).
 * This class allows asynchronous iteration over the data using the `for-await-of` syntax.
 */
export class Stream<Item> implements AsyncIterable<Item> {
  controller: AbortController;

  private response: Response;

  private decoder: SSEDecoder;

  /**
   * Handles the processing of data streams.
   * @param {Response} response - The HTTP response object containing the body stream.
   * @param {AbortController} controller - Used to signal the abortion of the stream processing.
   */
  constructor(response: Response, controller: AbortController) {
    this.response = response;
    this.controller = controller;
    this.decoder = new SSEDecoder();
  }

  /**
   * Internal generator function that processes each chunk of data from the response body.
   * @returns {AsyncGenerator<ServerSentEvent>} - The async generator yielding Server-Sent Events.
   */
  private async *iterMessages(): AsyncGenerator<ServerSentEvent> {
    if (!this.response.body) {
      this.controller.abort();
      throw new Error('Attempted to iterate over a response with no body');
    }
    const lineDecoder = new LineDecoder();

    const iter: ReadableStreamAsyncIterable<Bytes> =
      ReadableStreamAsyncIterable.withAsyncGenerator<Bytes>(
        streamToAsyncGenerator(this.response.body)
      );

    for await (const chunk of iter) {
      for (const line of lineDecoder.decode(chunk)) {
        const sse: ServerSentEvent | null = this.decoder.decode(line);
        if (sse) yield sse;
      }
    }

    for (const line of lineDecoder.flush()) {
      const sse: ServerSentEvent | null = this.decoder.decode(line);
      if (sse) yield sse;
    }
  }

  /**
   * Implementation of the async iterable protocol.
   * @returns {AsyncIterator<Item>} - The async iterator for the stream.
   */
  async *[Symbol.asyncIterator](): AsyncIterator<Item> {
    let done = false;
    try {
      for await (const sse of this.iterMessages()) {
        if (done) continue;

        if (sse.data.startsWith('[DONE]')) {
          done = true;
          continue;
        }

        if (sse.event === null) {
          try {
            const data = JSON.parse(sse.data);
            // throw new Error(data);
            yield data;
          } catch (e) {
            console.error('Could not parse message into JSON:', sse.data);
            console.error('From chunk:', sse.raw);
            throw e;
          }
        }
      }
      done = true;
    } catch (e) {
      // If the user calls `stream.controller.abort()`, we should exit without throwing.
      if (e instanceof Error && e.name === 'AbortError') {
        console.error(`error is thrown: ${e.message}`);
        return;
      }
      throw e;
    } finally {
      // If the user `break`s, abort the ongoing request.
      if (!done) this.controller.abort();
    }
  }
}

/**
 * Decodes individual lines into structured Server-Sent Event (SSE) objects.
 */
class SSEDecoder {
  private data: string[];

  private event: string | null;

  private chunks: string[];

  constructor() {
    this.event = null;
    this.data = [];
    this.chunks = [];
  }

  /**
   * Processes a line and constructs an SSE object when a complete event is formed.
   * @param {string} line - A line from the stream to decode.
   * @returns {ServerSentEvent | null} - The decoded Server-Sent Event or null if the line is not part of an event.
   */
  decode(line: string) {
    if (line.endsWith('\r')) {
      line = line.substring(0, line.length - 1);
    }

    if (!line) {
      // empty line and we didn't previously encounter any messages
      if (!this.event && !this.data.length) return null;

      const sse: ServerSentEvent = {
        event: this.event,
        data: this.data.join('\n'),
        raw: this.chunks,
      };

      this.event = null;
      this.data = [];
      this.chunks = [];

      return sse;
    }

    this.chunks.push(line);

    if (line.startsWith(':')) {
      return null;
    }

    const partitionArr: string[] = partition(line, ':');
    const fieldname: string = partitionArr[0];
    let value: string = partitionArr[partitionArr.length - 1];

    if (value.startsWith(' ')) {
      value = value.substring(1);
    }

    if (fieldname === 'event') {
      this.event = value;
    } else if (fieldname === 'data') {
      this.data.push(value);
    }

    return null;
  }
}

/**
 * Incrementally decodes text into lines, handling various newline characters.
 *
 * @see https://github.com/encode/httpx/blob/920333ea98118e9cf617f246905d7b202510941c/httpx/_decoders.py#L258 for implementation of httpx's `LineDecoder` in Python.
 */
class LineDecoder {
  // See https://docs.python.org/3/library/stdtypes.html#str.splitlines
  /* eslint no-control-regex: "warn" */
  static NEWLINE_CHARS = new Set([
    '\n',
    '\r',
    '\x0b',
    '\x0c',
    '\x1c',
    '\x1d',
    '\x1e',
    '\x85',
    '\u2028',
    '\u2029',
  ]);

  static NEWLINE_REGEXP = /\r\n|[\n\r\x0b\x0c\x1c\x1d\x1e\x85\u2028\u2029]/g;

  buffer: string[];

  trailingCR: boolean;

  textDecoder: any; // TextDecoder found in browsers; not typed to avoid pulling in either "dom" or "node" types.

  constructor() {
    this.buffer = [];
    this.trailingCR = false;
  }

  /**
   * Decodes a chunk of data into lines.
   * @param {Bytes} chunk - The chunk of data to decode.
   * @returns {string[]} - An array of decoded lines.
   */
  decode(chunk: Bytes): string[] {
    let text = this.decodeText(chunk);

    // We always push a trailing `\r` into the next decode iteration.
    if (this.trailingCR) {
      text = '\r' + text;
      this.trailingCR = false;
    }
    if (text.endsWith('\r')) {
      this.trailingCR = true;
      text = text.slice(0, -1);
    }

    if (!text) {
      return [];
    }

    const trailingNewline = LineDecoder.NEWLINE_CHARS.has(
      text[text.length - 1] || ''
    );
    let lines = text.split(LineDecoder.NEWLINE_REGEXP);

    if (lines.length === 1 && !trailingNewline) {
      // No new lines, buffer the input and continue.
      this.buffer.push(lines[0]!);
      return [];
    }

    if (this.buffer.length > 0) {
      // Include any existing buffer in the first portion of the splitlines result.
      lines = [this.buffer.join('') + lines[0], ...lines.slice(1)];
      this.buffer = [];
    }

    if (!trailingNewline) {
      // If the last segment of splitlines is not newline terminated,
      // then drop it from our output and start a new buffer.
      this.buffer = [lines.pop() || ''];
    }

    return lines;
  }

  decodeText(bytes: Bytes): string {
    if (bytes == null) return '';
    if (typeof bytes === 'string') return bytes;

    // Node
    if (typeof Buffer !== 'undefined') {
      if (bytes instanceof Buffer) {
        return bytes.toString();
      }
      if (bytes instanceof Uint8Array) {
        return Buffer.from(bytes).toString();
      }

      throw new Error(
        `Unexpected: received non-Uint8Array (${bytes.constructor.name}) stream chunk in an environment with a global "Buffer" defined, which this library assumes to be Node. Please report this error.`
      );
    }

    // Browser
    if (typeof TextDecoder !== 'undefined') {
      if (bytes instanceof Uint8Array || bytes instanceof ArrayBuffer) {
        this.textDecoder ??= new TextDecoder('utf8');
        return this.textDecoder.decode(bytes);
      }

      throw new Error(
        `Unexpected: received non-Uint8Array/ArrayBuffer (${
          (bytes as any).constructor.name
        }) in a web platform. Please report this error.`
      );
    }

    throw new Error(
      'Unexpected: neither Buffer nor TextDecoder are available as globals. Please report this error.'
    );
  }

  /**
   * Returns any remaining text as lines.
   * @returns {string[]} - An array of remaining lines.
   */
  flush(): string[] {
    if (!this.buffer.length && !this.trailingCR) {
      return [];
    }

    const lines = [this.buffer.join('')];
    this.buffer = [];
    this.trailingCR = false;
    return lines;
  }
}

/**
 * Splits a string into three parts based on the first occurrence of a specified delimiter.
 * @param {string} str - The string to be partitioned.
 * @param {string} delimiter - The delimiter to use for partitioning the string.
 * @returns {[string, string, string]} - An array containing the part before the delimiter, the delimiter itself, and the part after the delimiter.
 */
function partition(str: string, delimiter: string): [string, string, string] {
  const index = str.indexOf(delimiter);
  if (index !== -1) {
    return [
      str.substring(0, index),
      delimiter,
      str.substring(index + delimiter.length),
    ];
  }

  return [str, '', ''];
}

/**
 * Converts a ReadableStream to an async generator.
 * This allows for asynchronous iteration over the stream's data.
 * @param {ReadableStream} stream - The stream to be converted into an async generator.
 * @returns {AsyncGenerator<T>} - An async generator that yields data chunks from the stream.
 */
async function* streamToAsyncGenerator<T>(stream: any): AsyncGenerator<T> {
  const reader = stream.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield value;
    }
  } catch (e) {
    // Error handling if necessary
    const error = new Error((e as Error).message);
    error.name = 'AbortError';
    throw error;
  } finally {
    reader.releaseLock();
  }
}
