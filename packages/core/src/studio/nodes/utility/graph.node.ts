import { load } from '../../../load/index.js';
import {
  globalImportMap,
  globalSecretMap,
} from '../../../load/registration.js';
import { SerializedConstructor } from '../../../load/serializable.js';
import { getRecordId } from '../../../utils/nanoid.js';
import { BaseGraph, SubGraph } from '../../graph.js';
import {
  ProcessContext,
  ProcessInputMap,
  ProcessOutputMap,
} from '../../processor.js';
import { GuardrailRegistration } from '../../registration/guardrails.js';
import { NodeRegistration } from '../../registration/nodes.js';
import { SerializedNode } from '../../serde.js';
import { CallableNodeImpl, NodeImpl } from '../base.js';
import { CallableNode, NodeConnection, SerializableNode } from '../index.js';

export type GraphNode = SerializableNode<'graph', BaseGraph>;

export abstract class GraphNodeImpl extends NodeImpl<GraphNode> {
  abstract process(
    inputs: ProcessInputMap,
    context: ProcessContext
  ): Promise<ProcessOutputMap>;

  static async deserialize(
    serialized: SerializedNode,
    values: Record<string, unknown> = {},
    registry?: {
      nodes?: NodeRegistration;
      guardrails?: GuardrailRegistration;
    }
  ): Promise<GraphNode> {
    const {
      id,
      type,
      subType,
      registerArgs,
      data,
      visualInfo,
      inputs,
      outputs,
      runtime,
      memory,
      outputSizes,
    } = serialized;

    if (type !== 'graph') {
      throw new Error(`CANNOT deserialize this type in graph node: ${type}`);
    }

    (data as SerializedConstructor)._kwargs['registry'] = registry?.nodes;
    const subGraphStr = JSON.stringify(data);
    const subGraph = await load<SubGraph>(
      subGraphStr,
      globalSecretMap,
      globalImportMap
    );

    return {
      id,
      type,
      subType,
      registerArgs,
      data: subGraph,
      visualInfo,
      inputs,
      outputs,
      runtime,
      memory,
      outputSizes,
    };
  }
}

export class SubGraphNodeImpl extends GraphNodeImpl {
  static nodeFrom(
    serializable: SubGraph,
    registerArgs: {
      nodes: SerializableNode[];
      connections: NodeConnection[];
    }
  ): GraphNode {
    const { inputs, outputs } = BaseGraph.getGraphPorts(
      registerArgs.nodes,
      registerArgs.connections
    );

    return {
      id: getRecordId(),
      type: 'graph',
      subType: 'subgraph',
      registerArgs: registerArgs,
      data: serializable,
      visualInfo: {
        position: {
          x: 0,
          y: 0,
        },
        size: {
          width: 300,
          height: 500,
        },
      },
      inputs,
      outputs,
    };
  }

  static create(fields: {
    nodes: SerializableNode[];
    connections: NodeConnection[];
  }): GraphNode {
    const subGraph = new SubGraph(fields);

    const node: GraphNode = SubGraphNodeImpl.nodeFrom(subGraph, fields);

    return node;
  }

  process(
    inputs: ProcessInputMap,
    context: ProcessContext
  ): Promise<ProcessOutputMap> {
    throw new Error('Method not implemented.');
  }
}
