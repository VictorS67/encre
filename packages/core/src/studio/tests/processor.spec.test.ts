import { beforeAll, describe, expect, test } from '@jest/globals';
import { SubGraph } from '../graph';
import { CallableNodeImpl } from '../nodes/base';
import { GraphInputs, GraphProcessor, ProcessInputMap } from '../processor';
import { globalNodeRegistry } from '../registration/nodes';

describe('GraphProcessor', () => {
  test('test simple node in graph', async () => {
    const OpenAINode = globalNodeRegistry.createDynamic('chatlm', 'openai');

    const graph = new SubGraph({ nodes: [OpenAINode], connections: [] });

    const processor = new GraphProcessor(graph);

    const processInput: ProcessInputMap = {
      prompt: {
        type: 'string',
        value: 'Who are you?',
      },
    };

    const graphInputs: GraphInputs = {};
    graphInputs[OpenAINode.id] = processInput;

    expect(
      graph.nodeImplMap[OpenAINode.id].getInputPortDefs()
    ).toMatchSnapshot();

    expect(
      await (graph.nodeImplMap[OpenAINode.id] as CallableNodeImpl<any>).invoke(
        'Who are you?'
      )
    ).toMatchSnapshot();

    expect(
      await graph.nodeImplMap[OpenAINode.id].process(processInput, {})
    ).toMatchSnapshot();

    expect(await processor.processGraph(graphInputs)).toMatchSnapshot();
  });
});
