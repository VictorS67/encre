import { describe, test, expect } from '@jest/globals';
import {
  createProcessor,
  getNodeRegistry,
  NodeConnection,
  OpenAIChat,
  StringPrompt,
  SubGraph,
} from '../index.js';

describe('apis', () => {
  test('stream processor events', async () => {
    const promptNode = getNodeRegistry().createDynamicRaw(
      new StringPrompt('Who are you?')
    );

    const gptNode = getNodeRegistry().createDynamicRaw(
      new OpenAIChat({ modelName: 'gpt-3.5-turbo' })
    );

    const connection: NodeConnection = {
      fromNodeId: promptNode.id,
      fromPortName: 'prompt',
      toNodeId: gptNode.id,
      toPortName: 'prompt',
    };

    const graph = new SubGraph({
      nodes: [promptNode, gptNode],
      connections: [connection],
    });

    const processor = createProcessor(graph);

    processor.run();

    const eventNames: string[] = [];
    for await (const event of processor.events({
      done: true,
      nodeStart: true,
      nodeFinish: true,
    })) {
      eventNames.push(event.type);
    }

    expect(eventNames).toStrictEqual([
      'nodeStart',
      'nodeFinish',
      'nodeStart',
      'nodeFinish',
      'done',
    ]);
  });
});
