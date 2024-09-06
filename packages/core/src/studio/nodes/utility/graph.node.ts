import { load } from '../../../load/index.js';
import {
  globalImportMap,
  globalSecretMap,
} from '../../../load/registration.js';
import { type SerializedConstructor } from '../../../load/serializable.js';
import { getRecordId } from '../../../utils/nanoid.js';
import { BaseGraph, SubGraph } from '../../graph.js';
import {
  type ProcessContext,
  type ProcessInputMap,
  type ProcessOutputMap,
} from '../../processor.js';
import { type GuardrailRegistration } from '../../registration/guardrails.js';
import { type NodeRegistration } from '../../registration/nodes.js';
import { type SerializedNode } from '../../serde.js';
import { NodeImpl } from '../base.js';
import { type NodeConnection, type SerializableNode } from '../index.js';

/**
 * A type alias for a specialized node focused on graph operations, handling complex data
 * structures and workflows.
 * This node type is designed for constructing, manipulating, and processing graph-based data
 * structures.
 */
export type GraphNode = SerializableNode<'graph', BaseGraph>;

/**
 * An abstract class providing a base implementation for graph nodes.
 * This class extends the basic node implementation to provide functionalities
 * specific to graph operations and data handling.
 */
export abstract class GraphNodeImpl extends NodeImpl<GraphNode> {
  /**
   * Deserializes a serialized graph node representation into an executable graph node,
   * reconstituting the node with its operational parameters and data.
   *
   * @param serialized The serialized node data.
   * @param values Additional values that might be used during deserialization.
   * @param registry Optional registry containing additional configurations such as node types and guardrails.
   * @returns A promise resolving to a deserialized graph node.
   * @throws Error if the node type is not compatible with graph operations.
   */
  static async deserialize(
    serialized: SerializedNode,
    values: Record<string, unknown> = {},
    registry?: {
      nodes?: NodeRegistration;
      guardrails?: GuardrailRegistration;
    }
  ): Promise<GraphNode> {
    const subType: string = serialized.subType;

    switch (subType) {
      case 'subgraph':
        return SubGraphNodeImpl.deserialize(serialized, values, registry);
      default:
        throw new Error('Plugin node is unsupported for now');
    }
  }

  /**
   * Abstract process method that must be implemented by subclasses to handle
   * specific graph operations based on input data and execution context.
   *
   * @param inputs The map containing input data for the node.
   * @param context The processing context providing additional data and operations for processing.
   * @returns A promise resolving to a map of process outputs.
   */
  abstract process(
    inputs: ProcessInputMap,
    context: ProcessContext
  ): Promise<ProcessOutputMap>;
}

/**
 * Implementation of a GraphNode specifically for subgraph operations.
 * This node is designed to handle and execute operations within a subgraph, which is a
 * component of a larger graph.
 *
 * ### Node Properties
 *
 * | Field        | Type                  | Description                                                                    |
 * |--------------|-----------------------|--------------------------------------------------------------------------------|
 * | `type`       | `'graph'`             | The type of the node, indicating it handles graph-based operations.            |
 * | `subType`    | `'subgraph'`          | The subtype of the node, specifying that it operates on a segment of a larger graph. |
 * | `registerArgs`| `{ nodes, connections }`| Configuration arguments specifying the nodes and connections of the subgraph.|
 * | `data`       | {@link SubGraph}      | The actual subgraph data structure being managed by this node.                 |
 *
 * ### Input Ports
 *
 * Input ports in a graph node are the ports in the start nodes from {@link BaseGraph.getGraphPorts}.
 *
 * ### Output Ports
 *
 * Output ports in a graph node are the ports in the end nodes from {@link BaseGraph.getGraphPorts}.
 *
 */
export class SubGraphNodeImpl extends GraphNodeImpl {
  /**
   * Creates a GraphNode configuration from a SubGraph callable instance.
   * @param callable An instance of SubGraph defining the interaction logic with graph component.
   * @returns A fully configured GraphNode specialized for SubGraph operations.
   */
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

  /**
   * Factory method to create a new instance of SubGraph.
   * This method initializes a new node with a graph instance configured
   * for handling and executing operations within a subgraph.
   *
   * @returns An instance of SubGraph.
   */
  static create(fields: {
    nodes: SerializableNode[];
    connections: NodeConnection[];
  }): GraphNode {
    const subGraph = new SubGraph(fields);

    const node: GraphNode = SubGraphNodeImpl.nodeFrom(subGraph, fields);

    return node;
  }

  /**
   * Processes the inputs within the context of the subgraph.
   * This method needs to be implemented by subclasses to handle specific operations.
   * not-implemented
   *
   * @param inputs The map containing input data for the node.
   * @param context The processing context.
   * @returns A promise resolving to a map of process outputs.
   * @throws Error if the method is not implemented.
   * @experimental
   */
  process(
    inputs: ProcessInputMap,
    context: ProcessContext
  ): Promise<ProcessOutputMap> {
    throw new Error('Method not implemented.');
  }

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
    const subGraph = await load<SubGraph>(subGraphStr, globalSecretMap, {
      ...globalImportMap,
      'studio/graph': await import('../../graph.js'),
    });

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
