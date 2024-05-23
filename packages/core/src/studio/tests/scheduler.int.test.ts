import { describe, expect, test } from '@jest/globals';
import { RecordId } from '../../load/keymap.js';
import { SubGraph } from '../graph.js';
import { globalNodeRegistry } from '../registration/nodes.js';
import { GraphScheduler } from '../scheduler.js';

describe('GraphScheduler', () => {
  test('test scheduler set-up', async () => {
    // const stringPromptNode = globalNodeRegistry.createDynamic(
    //   'prompt',
    //   'string'
    // );

    // stringPromptNode.id = 'upload' as RecordId;
    // stringPromptNode.runtime = 1;

    const openAINode = globalNodeRegistry.createDynamic('chatlm', 'openai');
    openAINode.runtime = 5;

    const openAINode1 = globalNodeRegistry.createDynamic('chatlm', 'openai');
    openAINode1.runtime = 5;

    const openAINode2 = globalNodeRegistry.createDynamic('chatlm', 'openai');
    openAINode1.runtime = 1;

    const openAINode3 = globalNodeRegistry.createDynamic('chatlm', 'openai');
    openAINode3.runtime = 1;

    const graph = new SubGraph({
      nodes: [openAINode, openAINode1, openAINode2, openAINode3],
      connections: [
        {
          fromNodeId: openAINode.id,
          fromPortName: 'output',
          toNodeId: openAINode1.id,
          toPortName: 'prompt'
        },
        {
          fromNodeId: openAINode.id,
          fromPortName: 'output',
          toNodeId: openAINode2.id,
          toPortName: 'prompt'
        },
        {
          fromNodeId: openAINode2.id,
          fromPortName: 'output',
          toNodeId: openAINode3.id,
          toPortName: 'prompt'
        },
        // {
        //   fromNodeId: openAINode3.id,
        //   fromPortName: 'output',
        //   toNodeId: openAINode2.id,
        //   toPortName: 'prompt'
        // },
      ],
    });

    const scheduler = new GraphScheduler(graph);

    expect(graph.flattenNodes.map((n) => n.id)).toMatchSnapshot();
    expect(scheduler.grouping()).toMatchSnapshot();
  });
});
