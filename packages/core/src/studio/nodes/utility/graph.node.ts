import { load } from '../../../load/index.js';
import {
  globalImportMap,
  globalSecretMap,
} from '../../../load/registration.js';
import { SerializedConstructor } from '../../../load/serializable.js';
import { getRecordId } from '../../../utils/nanoid.js';
import { BaseGraph, GraphValues, SubGraph } from '../../graph.js';
import {
  ProcessContext,
  ProcessInputMap,
  ProcessOutputMap,
} from '../../processor.js';
import { GuardrailRegistration } from '../../registration/guardrails.js';
import { NodeRegistration } from '../../registration/nodes.js';
import { SerializedNode } from '../../serde.js';
import { CallableNodeImpl } from '../base.js';
import { CallableNode, NodeConnection, SerializableNode } from '../index.js';

export type GraphNode = CallableNode<'graph', BaseGraph>;

export abstract class GraphNodeImpl extends CallableNodeImpl<GraphNode> {
  abstract _preprocess(
    inputs: ProcessInputMap,
    context: ProcessContext
  ): Promise<GraphValues>;

  abstract _postprocess(
    rawOutputs: GraphValues,
    context: ProcessContext
  ): Promise<ProcessOutputMap>;

  abstract invoke<CallInput, CallOutput, CallOptions>(
    input: CallInput,
    options?: Partial<CallOptions>
  ): Promise<CallOutput>;

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
  static create(fields: {
    nodes: SerializableNode[];
    connections: NodeConnection[];
  }): GraphNode {
    const subGraph = new SubGraph(fields);

    const { inputs, outputs } = BaseGraph.getGraphPorts(
      fields.nodes,
      fields.connections
    );

    const node: GraphNode = {
      id: getRecordId(),
      type: 'graph',
      subType: 'subgraph',
      registerArgs: fields,
      data: subGraph,
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

    return node;
  }

  _preprocess(
    inputs: ProcessInputMap,
    context: ProcessContext
  ): Promise<GraphValues> {
    throw new Error('Method not implemented.');
  }
  _postprocess(
    rawOutputs: GraphValues,
    context: ProcessContext
  ): Promise<ProcessOutputMap> {
    throw new Error('Method not implemented.');
  }
  invoke<CallInput, CallOutput, CallOptions>(
    input: CallInput,
    options?: Partial<CallOptions> | undefined
  ): Promise<CallOutput> {
    throw new Error('Method not implemented.');
  }
  process(
    inputs: ProcessInputMap,
    context: ProcessContext
  ): Promise<ProcessOutputMap> {
    throw new Error('Method not implemented.');
  }
}
