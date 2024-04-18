import { beforeAll, describe, expect, test } from '@jest/globals';
import { load } from '../../../../load/index.js';
import { RecordId } from '../../../../load/keymap.js';
import { globalImportMap, globalSecretMap } from '../../../../load/registration.js';
import { SubGraph } from '../../../graph.js';
import { SerializedNode } from '../../../serde.js';
import { NodeConnection, SerializableNode } from '../../index.js';
import { OpenAIChatNodeImpl } from '../../inference/chat/chatlm.node.js';
import { ChatPromptNodeImpl } from '../../input/prompt.node.js';
import { GraphNodeImpl, SubGraphNodeImpl } from '../graph.node.js';

describe('test GraphNodeImpl', () => {
  let nodes: SerializableNode[] = [];
  let connections: NodeConnection[] = [];

  beforeAll(() => {
    const chatPromptNode = ChatPromptNodeImpl.create();
    const openAIChatNode = OpenAIChatNodeImpl.create();

    nodes = [chatPromptNode, openAIChatNode];

    connections = [
      {
        fromNodeId: chatPromptNode.id,
        fromPortName: 'prompt',
        toNodeId: openAIChatNode.id,
        toPortName: 'prompt',
      },
    ];
  });

  test('serializable', async () => {
    const subGraph = SubGraphNodeImpl.create({ nodes, connections });
    expect(JSON.stringify(subGraph, null, 2)).toMatchSnapshot();

    const outgoingConnections: {
      [key in string]: { toNodeId: RecordId; toPortName: string };
    } = {};

    for (const conn of connections) {
      const { fromPortName, toNodeId, toPortName } = conn;
      outgoingConnections[fromPortName] = { toNodeId, toPortName };
    }

    const serializedNode: SerializedNode = {
      _type: 'node',
      id: subGraph.id,
      type: subGraph.type,
      subType: subGraph.subType,
      registerArgs: subGraph.registerArgs,
      title: subGraph.title ?? subGraph.data._id[subGraph.data._id.length - 1],
      description: subGraph.description ?? '',
      runtime: subGraph.runtime ?? 0,
      memory: subGraph.memory ?? 0,
      data: JSON.parse(JSON.stringify(subGraph.data)),
      visualInfo: subGraph.visualInfo,
      inputs: subGraph.inputs,
      outputs: subGraph.outputs,
      outputSizes: subGraph.outputSizes,
      outgoingConnections,
    };
    expect(JSON.stringify(serializedNode, null, 2)).toMatchSnapshot();

    const revivedSubGraph = await GraphNodeImpl.deserialize(serializedNode);
    expect(revivedSubGraph.id).toBe(subGraph.id);
    expect(revivedSubGraph.type).toBe(subGraph.type);
    expect(revivedSubGraph.subType).toBe(subGraph.subType);
    expect(revivedSubGraph.registerArgs).toStrictEqual(subGraph.registerArgs);
    expect(JSON.stringify(revivedSubGraph.data)).toBe(
      JSON.stringify(subGraph.data)
    );
    expect(revivedSubGraph.visualInfo).toStrictEqual(subGraph.visualInfo);
    expect(revivedSubGraph.inputs).toStrictEqual(subGraph.inputs);
    expect(revivedSubGraph.outputs).toStrictEqual(subGraph.outputs);
  });
});
