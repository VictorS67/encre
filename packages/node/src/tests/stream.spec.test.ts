import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from '@jest/globals';
import { createProcessor, loadGraph } from '../index.js';

describe('stream', () => {
  test('test get event sse stream from processor', async () => {
    const testDir = dirname(fileURLToPath(import.meta.url));
    const filePath = join(testDir, './examples/Simple Graph.encre');

    const graph = await loadGraph(filePath);

    const processor = createProcessor(graph);

    processor.run();

    const reader = processor
      .sseStream({
        nodeFinish: true,
      })
      .getReader();

    const decoder = new TextDecoder();

    const eventNames: string[] = [];
    for (;;) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const data = decoder.decode(value);

      const event = /event: (?<event>.*)/.exec(data)!.groups!.event!;
      eventNames.push(event);
    }

    expect(eventNames).toStrictEqual([
      'nodeFinish',
      'nodeFinish',
      'nodeFinish',
    ]);
  });
});
