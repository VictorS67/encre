import path from 'path';
import url from 'url';
import { describe, expect, test } from '@jest/globals';

import { OpenAIChat } from '../../../events/inference/chat/llms/openai/chat.js';
import { StringPrompt } from '../../../events/input/load/prompts/text.js';
import { SubGraph } from '../../graph.js';
import { globalNodeRegistry } from '../../registration/nodes.js';
import { loadGraph } from '../load.js';
import { saveGraph } from '../save.js';

describe('test saving to local', () => {
  test('save to path', async () => {
    const stringPromptNode = globalNodeRegistry.createDynamicRaw(
      new StringPrompt('Who are you?')
    );

    const openAINode = globalNodeRegistry.createDynamicRaw(
      new OpenAIChat({ modelName: 'gpt-3.5-turbo' })
    );

    const graph = new SubGraph({
      nodes: [stringPromptNode, openAINode],
      connections: [
        {
          fromNodeId: stringPromptNode.id,
          fromPortName: 'prompt',
          toNodeId: openAINode.id,
          toPortName: 'prompt',
        },
      ],
    });

    const filePath: string = path.resolve(
      path.dirname(url.fileURLToPath(import.meta.url)),
      './examples/'
    );

    await saveGraph(graph, filePath);

    expect(true).toBeTruthy();
  });

  test('load graph', async () => {
    const filePath: string = path.resolve(
      path.dirname(url.fileURLToPath(import.meta.url)),
      './examples/Untitled Graph.encre'
    );

    const graph = await loadGraph(filePath);

    expect(graph).toMatchSnapshot();
  });
});
