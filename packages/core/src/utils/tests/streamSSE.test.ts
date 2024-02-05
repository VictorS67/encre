import { ReadableStream } from 'stream/web';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { SSEDecoder, Stream } from '../stream.js';

// Mock for AbortController
class MockAbortController extends AbortController {
  abort = jest.fn();
}

function createMockSSEStream(messages, interval = 100) {
  return new ReadableStream({
    start(controller) {
      messages.forEach((message, index) => {
        setTimeout(() => {
          controller.enqueue(
            `data: ${
              typeof message === 'string' ? message : JSON.stringify(message)
            }\n\n`
          );
          if (index === messages.length - 1) {
            controller.close();
          }
        }, interval * index);
      });
    },
  });
}

describe('test Stream', () => {
  test('should process SSE messages', async () => {
    const mockMessages = [
      { id: 1, text: 'Hello' },
      { id: 2, text: 'World' },
    ];
    const mockResponse = {
      body: createMockSSEStream(mockMessages),
    } as Response;
    const mockController = new MockAbortController();
    const stream = new Stream<Record<string, unknown>>(
      mockResponse,
      mockController
    );

    const receivedMessages: Record<string, unknown>[] = [];
    for await (const item of stream) {
      receivedMessages.push(item);
    }

    expect(receivedMessages.map((message) => JSON.stringify(message))).toEqual(
      mockMessages.map((message) => JSON.stringify(message))
    );
  });

  test("should process SSE messages", async () => {
    const mockMessages = ["{\n", '"id": 1,\n', '"text": "Hello",\n', "}\n\n"];
    const expectMessages = [{ id: 1, text: "Hello" }];

    const mockResponse = {
      body: createMockSSEStream(mockMessages),
    } as Response;
    const mockController = new MockAbortController();
    const stream = new Stream<Record<string, unknown>>(
      mockResponse,
      mockController
    );

    const receivedMessages: Record<string, unknown>[] = [];
    for await (const item of stream) {
      receivedMessages.push(item);
    }

    expect(receivedMessages.map((message) => JSON.stringify(message))).toEqual(
      expectMessages.map((message) => JSON.stringify(message))
    );
  });

  test('should handle [DONE] signal correctly', async () => {
    const mockMessages = [{ id: 1, text: 'First Message' }, '[DONE]'];
    const mockResponse = {
      body: createMockSSEStream(mockMessages),
    } as Response;
    const mockController = new MockAbortController();
    const stream = new Stream<Record<string, unknown>>(
      mockResponse,
      mockController
    );

    const receivedMessages: Record<string, unknown>[] = [];
    for await (const item of stream) {
      receivedMessages.push(item);
    }

    expect(receivedMessages.map((message) => JSON.stringify(message))).toEqual([
      JSON.stringify({ id: 1, text: 'First Message' }),
    ]);

    expect(mockController.abort).not.toHaveBeenCalled();
  });

  test('stream should be aborted on break', async () => {
    const mockMessages = [
      { id: 1, text: 'Hello' },
      { id: 2, text: 'World' },
      '[DONE]',
    ];
    const mockResponse = {
      body: createMockSSEStream(mockMessages),
    } as Response;
    const mockController = new MockAbortController();
    const stream = new Stream(mockResponse, mockController);

    for await (const item of stream) {
      break; // Simulate breaking out of the loop
    }

    expect(mockController.abort).toHaveBeenCalled(); // Stream should be aborted when breaking the loop
  });

  test('should throw an error for invalid JSON', async () => {
    const mockResponse = {
      body: createMockSSEStream(['{ invalid JSON }']), // Mock stream with invalid JSON
    } as Response;
    const mockController = new MockAbortController();
    const stream = new Stream(mockResponse, mockController);

    await expect(async () => {
      for await (const item of stream) {
        // Iteration over the stream
      }
    }).rejects.toThrow(SyntaxError); // Expect a SyntaxError due to invalid JSON
  });

  test('should handle AbortError quietly', async () => {
    const mockResponse = {
      body: new ReadableStream({
        start(controller) {
          const error = new Error('AbortError');
          error.name = 'AbortError';
          controller.error(error);
        },
      }),
    } as Response;
    const mockController = new MockAbortController();
    const stream = new Stream(mockResponse, mockController);

    const asyncFunction = async () => {
      for await (const item of stream) {
        // Iteration over the stream
      }
    };

    await expect(asyncFunction()).resolves.toBeUndefined(); // Expect no error to be thrown externally
  });
});

// describe('test SSEDecoder', () => {
//   let decoder: SSEDecoder;

//   beforeEach(() => {
//     decoder = new SSEDecoder();
//   });

//   test("should decode valid SSE message", () => {
//     const line = 'data: {"message": "Hello, World!"}\n\n';
//     const sse = decoder.decode(line);

//     expect(sse).toEqual({
//       event: null,
//       data: '{"message": "Hello, World!"}',
//       raw: [line.trim()],
//     });
//   });

//   test('should return null for incomplete SSE message', () => {
//     const line = 'data: Incomplete';
//     const sse = decoder.decode(line);

//     expect(sse).toBeNull();
//   });

//   test("should handle SSE message with multiple data lines", () => {
//     decoder.decode("data: first line\n");
//     decoder.decode("data: second line\n\n");
//     const sse = decoder.decode("\n");

//     expect(sse).toEqual({
//       event: null,
//       data: "first line\nsecond line",
//       raw: ["data: first line", "data: second line"],
//     });
//   });

//   test('should ignore empty lines and comments', () => {
//     const comment = ': this is a comment\n';
//     const emptyLine = '\n';

//     expect(decoder.decode(comment)).toBeNull();
//     expect(decoder.decode(emptyLine)).toBeNull();
//   });

//   test('should ignore comments and handle empty lines correctly', () => {
//     const comment = ': this is a comment\n';
//     expect(decoder.decode(comment)).toBeNull();

//     // Ensure we send a data line before the empty line
//     decoder.decode('data: some data\n');
//     const sse = decoder.decode('\n'); // This should now return the complete SSE message
//     expect(sse).toEqual({
//       event: null,
//       data: 'some data',
//       raw: ['data: some data'],
//     });
//   });
// });
