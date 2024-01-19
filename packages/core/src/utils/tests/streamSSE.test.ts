import { ReadableStream } from 'stream/web';
import { describe, expect, jest, test } from '@jest/globals';
import { Stream } from '../stream.js';

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
