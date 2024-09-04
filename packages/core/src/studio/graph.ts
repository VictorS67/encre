import { type RecordId } from '../load/keymap.js';
import { Serializable, type Serialized } from '../load/serializable.js';
import { getRecordId } from '../utils/nanoid.js';
import { isNotNull, type Writeable } from '../utils/safeTypes.js';
import { type GraphComment } from './comments/index.js';
import { type DataType } from './data.js';
import { NodeImpl } from './nodes/base.js';
import {
  type NodeConnection,
  type NodeInputPortDef,
  type NodeOutputPortDef,
  type NodePortFields,
  type SerializableNode,
} from './nodes/index.js';
import { type GuardrailRegistration } from './registration/guardrails.js';
import { globalNodeRegistry, type NodeRegistration } from './registration/nodes.js';
import { GraphScheduler } from './scheduler.js';
import { type SerializedGraph, type SerializedNode } from './serde.js';

export interface NodeGraph {
  /**
   * Unique identifier for the graph.
   */
  id?: RecordId;

  /**
   * Human-readable title for the graph.
   */
  title?: string;

  /**
   * Description of the graph's purpose and contents.
   */
  description?: string;

  registry?: NodeRegistration;

  /**
   * Collection of nodes that compose the graph. Nodes can be of any type
   * derived from `SerializableNode`, including `SubGraphNode`.
   */
  nodes: SerializableNode[];

  /**
   * Connections between nodes within the graph, specifying data flow from node to node.
   * Connections can be connected to/from `SubGraphNode`.
   */
  connections: NodeConnection[];

  /**
   * Optional comments associated with the graph, for user notes or documentation purposes.
   */
  comments?: GraphComment[];
}

// /** The input and output values from a graph */
// export type GraphValues = Record<RecordId, Record<string, unknown>>;

export type NodeProcessInfo = {
  runtime: number;
  memory: number;
};

/**
 * Represents a base class for creating and managing a graph structure consisting of nodes,
 * connections, and comments. This class provides functionalities for graph operations,
 * node registration, and data integrity validation across a potentially complex network of nodes.
 *
 */
export abstract class BaseGraph extends Serializable implements NodeGraph {
  _isSerializable = true;

  _namespace: string[] = ['studio', 'graph'];

  /**
   * Unique identifier for the graph.
   */
  id: RecordId;

  /**
   * Human-readable title for the graph.
   */
  title: string;

  /**
   * Description of the graph's purpose and contents.
   */
  description: string;

  /**
   * Collection of nodes that compose the graph. Nodes can be of any type
   * derived from `SerializableNode`, including `SubGraphNode`.
   */
  nodes: SerializableNode[];

  /**
   * Connections between nodes within the graph, specifying data flow from node to node.
   * Connections can be connected to/from `SubGraphNode`.
   */
  connections: NodeConnection[];

  /**
   * Optional comments associated with the graph, for user notes or documentation purposes.
   */
  comments: GraphComment[];

  // all of the non-subgraph nodes in the graph
  readonly flattenNodes: SerializableNode[];

  // all of the connections after removing subgraph nodes in the graph
  readonly flattenConnections: NodeConnection[];

  // input port fields of the graph
  readonly graphInputs: Record<string, DataType | Readonly<DataType[]>>;

  // output port fields of the graph
  readonly graphOutputs: Record<string, DataType | Readonly<DataType[]>>;

  // a lookup table with the key of the input port name and the value
  // of the corresponding node id and actual input port name in the node
  readonly graphInputNameMap: Record<
    string,
    { nodeId: RecordId; name: string }
  >;

  readonly graphStartNodeIds: RecordId[];

  // a lookup table with the key of the output port name and the value
  // of the corresponding node id and actual output port name in the node
  readonly graphOutputNameMap: Record<
    string,
    { nodeId: RecordId; name: string }
  >;

  readonly graphEndNodeIds: RecordId[];

  // node-map: a lookup table with the key of the non-subgraph node id and
  // the value of the non-subgraph node
  readonly nodeMap: Record<RecordId, SerializableNode>;

  // nodeImpl-map: a lookup table with the key of the non-subgraph node id
  // and the value of the non-subgraph nodeImpl
  readonly nodeImplMap: Record<RecordId, NodeImpl<SerializableNode>>;

  // node-connections-map: a lookup table with the key of the non-subgraph
  // node id and the value of connected edges to this non-subgraph node
  readonly nodeConnMap: Record<RecordId, NodeConnection[]>;

  // node-input-defs-map and node-output-defs-map: a lookup table with key
  // of the non-subgraph node id  and value of input definitions and output
  // definitions of this non-subgraph node
  readonly nodePortDefMap: Record<
    RecordId,
    { inputs: NodeInputPortDef[]; outputs: NodeOutputPortDef[] }
  >;

  // where the node are registered, in default we use globalNodeRegistry
  readonly registry: NodeRegistration;

  // node-process-info-map: a lookup table with the key of the non-subgraph
  // node id and the value of node process info. This map is updated once
  // per processing.
  nodeProcessInfoMap: Record<RecordId, NodeProcessInfo>;

  get _attributes() {
    return {
      nodes: [],
      connections: [],
    };
  }

  /**
   * Constructs a new instance of the BaseGraph, setting up initial configuration including
   * nodes, connections, and other parameters.
   *
   * @param {NodeGraph} fields - Initial fields to set up the graph.
   */
  constructor(fields?: NodeGraph) {
    let registry: NodeRegistration | undefined;
    if (fields?.registry) {
      registry = fields?.registry;
      delete fields['registry'];
    }

    super(fields ?? {});

    if (this._kwargs['registry']) {
      registry = this._kwargs['registry'] as NodeRegistration;
      delete this._kwargs['registry'];
    }

    this.id = fields?.id ?? getRecordId();
    this.title = fields?.title ?? 'Untitled Graph';
    this.description = fields?.description ?? '';

    this.nodes = fields?.nodes ?? [];
    this.connections = fields?.connections ?? [];
    this.comments = fields?.comments ?? [];

    this.nodeProcessInfoMap = {};

    this.registry =
      registry ?? (globalNodeRegistry as unknown as NodeRegistration);
    this.nodeMap = {};
    this.nodeImplMap = {};
    this.nodeConnMap = {};
    this.nodePortDefMap = {};

    // Flatten any subgraph in the nodes and connections, all nodes
    // should be a non-subgraph node, also get graph inputs and outputs
    // for the start nodes and end nodes
    const {
      flattenNodes,
      flattenConnections,
      inputs,
      inputNameMap,
      startNodeIds,
      outputs,
      outputNameMap,
      endNodeIds,
    } = BaseGraph.flattenGraph(this.id, this.nodes, this.connections);
    this.flattenNodes = flattenNodes;
    this.flattenConnections = flattenConnections;
    this.graphInputs = inputs;
    this.graphInputNameMap = inputNameMap;
    this.graphStartNodeIds = startNodeIds;
    this.graphOutputs = outputs;
    this.graphOutputNameMap = outputNameMap;
    this.graphEndNodeIds = endNodeIds;

    this._loadLookUpTables();
  }

  private _loadLookUpTables(): void {
    // Create nodeImpl-map and node-map for future lookup
    for (const node of this.flattenNodes) {
      this.nodeMap[node.id] = node;
      this.nodeImplMap[node.id] = this.registry.createDynamicImpl(node);
    }

    // Create node-connections-map for future lookup
    for (const conn of this.flattenConnections) {
      if (!this.nodeMap[conn.fromNodeId] || !this.nodeMap[conn.toNodeId]) {
        if (!this.nodeMap[conn.fromNodeId]) {
          console.warn(
            `Missing node ${conn.fromNodeId} in graph ${
              this.id
            } (connection to ${this.nodeMap[conn.toNodeId]?.title})`
          );
        } else {
          console.warn(
            `Missing node ${conn.toNodeId} in graph ${
              this.id
            } (connection to ${this.nodeMap[conn.fromNodeId]?.title})`
          );
        }

        continue;
      }

      this.nodeConnMap[conn.fromNodeId] ??= [];
      this.nodeConnMap[conn.toNodeId] ??= [];
      this.nodeConnMap[conn.fromNodeId]!.push(conn);
      this.nodeConnMap[conn.toNodeId]!.push(conn);
    }

    // Create node-input-defs-map and node-output-defs-map for future lookup
    for (const node of this.flattenNodes) {
      const connectionForNode: NodeConnection[] =
        this.nodeConnMap[node.id] ?? [];

      const inputPortDefs: NodeInputPortDef[] = this.nodeImplMap[
        node.id
      ]!.getInputPortDefs(connectionForNode, this.nodeMap);

      const outputPortDefs: NodeOutputPortDef[] = this.nodeImplMap[
        node.id
      ]!.getOutputPortDefs(connectionForNode, this.nodeMap);

      this.nodePortDefMap[node.id] = {
        inputs: inputPortDefs,
        outputs: outputPortDefs,
      };

      const nodeTitle: string =
        node.title ?? node.data._id[node.data._id.length - 1];
      const invalidConnections: NodeConnection[] = connectionForNode.filter(
        (conn) => {
          if (conn.toNodeId === node.id) {
            const inputDef: NodeInputPortDef | undefined = inputPortDefs.find(
              (def) => def.nodeId === node.id && def.name === conn.toPortName
            );

            if (!inputDef) {
              const nodeFrom: SerializableNode = this.nodeMap[conn.fromNodeId];
              const nodeFromTitle: string =
                nodeFrom.title ??
                nodeFrom.data._id[nodeFrom.data._id.length - 1];
              console.warn(
                `Invalid connection going from "${nodeFromTitle}".${conn.fromPortName} to "${nodeTitle}".${conn.toPortName}`
              );

              return true;
            }
          } else {
            const outputDef: NodeOutputPortDef | undefined =
              outputPortDefs.find(
                (def) =>
                  def.nodeId === node.id && def.name === conn.fromPortName
              );

            if (!outputDef) {
              const nodeTo: SerializableNode = this.nodeMap[conn.toNodeId];
              const nodeToTitle: string =
                nodeTo.title ?? nodeTo.data._id[nodeTo.data._id.length - 1];
              console.warn(
                `Invalid connection going from "${nodeTitle}".${conn.fromPortName} to "${nodeToTitle}".${conn.toPortName}`
              );

              return true;
            }
          }

          return false;
        }
      );

      for (const connections of Object.values(this.nodeConnMap)) {
        for (const invalidConn of invalidConnections) {
          const index = connections.indexOf(invalidConn);
          if (index !== -1) {
            connections.splice(index, 1);
          }
        }
      }
    }
  }

  /**
   * Abstract method to load a node registry into the graph. Implementations should handle
   * the specifics of registry integration.
   *
   * @param {NodeRegistration | undefined} registry - The node registry to integrate.
   * @returns {BaseGraph}
   */
  abstract loadRegistry(registry: NodeRegistration | undefined): BaseGraph;

  /**
   * Get all nodes that push data toward the current node.
   *
   * @param node the current node
   * @returns all nodes that push data toward the current node
   */
  getFromNodes(node: SerializableNode): SerializableNode[] {
    const connections: NodeConnection[] = this.nodeConnMap[node.id] ?? [];

    const incomingConnections = connections.filter(
      (conn) => conn.toNodeId === node.id
    );

    const inputDefs = this.nodePortDefMap[node.id]?.inputs ?? [];

    return incomingConnections
      .filter((conn) => {
        const connectionDef = inputDefs.find(
          (def) => def.nodeId === node.id && def.name === conn.toPortName
        );

        return connectionDef !== undefined;
      })
      .map((conn) => this.nodeMap[conn.fromNodeId])
      .filter(isNotNull);
  }

  /**
   * Get all nodes that receive data from the current node.
   *
   * @param node the current node
   * @returns all nodes that receive data from the current node
   */
  getToNodes(node: SerializableNode): SerializableNode[] {
    const connections: NodeConnection[] = this.nodeConnMap[node.id] ?? [];

    const outgoingConnections = connections.filter(
      (conn) => conn.fromNodeId === node.id
    );

    const outputDefs = this.nodePortDefMap[node.id]?.outputs ?? [];

    return outgoingConnections
      .filter((conn) => {
        const connectionDef = outputDefs.find(
          (def) => def.nodeId === node.id && def.name === conn.fromPortName
        );

        return connectionDef !== undefined;
      })
      .map((conn) => this.nodeMap[conn.toNodeId])
      .filter(isNotNull);
  }

  /**
   * Flatten a graph by exploding the nodes and connections in any subgraph
   * node in the graph. Since the original connections use the subgraph node
   * id and port name, these will be replaced with the inner node id and port
   * name
   *
   * In addition, get graph ports for the start nodes and end nodes in the
   * flatten graph
   *
   * @param graphId graph id
   * @param nodes all of the nodes in the graph, this allows subgraph nodes
   * @param connections all of the connections in the graph, this allows the
   * connection with subgraph nodes
   * @returns `flattenNodes` are all of the non-subgraph nodes in the graph,
   * `flattenConnections` are all of the connections after removing subgraph
   * nodes in the graph,`inputs` are input port fields, `outputs` are output
   * port fields, `inputNameMap` and `outputNameMap` are the pointer to the
   * original node id and port name for reversing the name to the original,
   * `startNodeIds` are the start non-subgraph node ids, `endNodeIds` are the
   * end non-subgraph node ids.
   */
  static flattenGraph(
    graphId: RecordId,
    nodes: SerializableNode[],
    connections: NodeConnection[]
  ): {
    flattenNodes: SerializableNode[];
    flattenConnections: NodeConnection[];
    inputs: Record<string, DataType | Readonly<DataType[]>>;
    inputNameMap: Record<string, { nodeId: RecordId; name: string }>;
    startNodeIds: RecordId[];
    outputs: Record<string, DataType | Readonly<DataType[]>>;
    outputNameMap: Record<string, { nodeId: RecordId; name: string }>;
    endNodeIds: RecordId[];
  } {
    let flattenNodes: SerializableNode[] = [];
    let flattenConnections: NodeConnection[] = [];

    // Get all of the input ports and output ports of the graph
    const {
      inputs,
      inputNameMap,
      startNodeIds,
      outputs,
      outputNameMap,
      endNodeIds,
    } = BaseGraph.getGraphPorts(nodes, connections);

    for (const node of nodes) {
      if (node.type === 'graph' && node.subType === 'subgraph') {
        // a subgraph is possible in a graph node, we need to recursively flatten it
        const {
          flattenNodes: subFlattenNodes,
          flattenConnections: subFlattenConnections,
        } = BaseGraph.flattenGraph(
          node.id,
          (node as any).data.nodes,
          (node as any).data.connections
        );

        flattenNodes = [...flattenNodes, ...subFlattenNodes];
        flattenConnections = [...flattenConnections, ...subFlattenConnections];
      } else {
        flattenNodes.push(node);
      }
    }

    const inputPortNames: string[] = Object.keys(inputs);
    const outputPortNames: string[] = Object.keys(outputs);
    for (const conn of connections) {
      if (conn.toNodeId === graphId) {
        // To GraphNode's input ports
        const inputPortName: string | undefined = inputPortNames.find(
          (ipn) => ipn === conn.toPortName
        );
        if (!inputPortName) {
          throw new Error(
            `Graph ${graphId} cannot find an input port name that matches to the connection to-port name: ${conn.toPortName}`
          );
        }

        const nameMap = inputNameMap[inputPortName];
        if (!nameMap) {
          throw new Error(
            `Graph ${graphId} cannot find an node id that has input port that matches to the connection to-port name: ${conn.toPortName}`
          );
        }

        // change the graph node id to the inner node id, as well as the port name
        flattenConnections.push({
          ...conn,
          toNodeId: nameMap.nodeId,
          toPortName: nameMap.name,
        });
      } else if (conn.fromNodeId === graphId) {
        // From GraphNode's output ports
        const outputPortName: string | undefined = outputPortNames.find(
          (opn) => opn === conn.fromPortName
        );
        if (!outputPortName) {
          throw new Error(
            `Graph ${graphId} cannot find an output port name that matches to the connection from-port name: ${conn.fromPortName}`
          );
        }

        const nameMap = outputNameMap[outputPortName];
        if (!nameMap) {
          throw new Error(
            `Graph ${graphId} cannot find an node id that has output port that matches to the connection from-port name: ${conn.fromPortName}`
          );
        }

        // change the graph node id to the inner node id, as well as the port name
        flattenConnections.push({
          ...conn,
          fromNodeId: nameMap.nodeId,
          fromPortName: nameMap.name,
        });
      } else {
        flattenConnections.push(conn);
      }
    }

    return {
      flattenNodes,
      flattenConnections,
      inputs,
      inputNameMap,
      startNodeIds,
      outputs,
      outputNameMap,
      endNodeIds,
    };
  }

  /**
   * Get all input and output ports in the graph. The graph input ports are the
   * unconnected input ports in the nodes, and the graph output ports are the
   * unconnected output ports in the nodes.
   *
   * Note: when merging the input and output port names, it is possible that multiple
   * ports share the same port name. We will change the port name in the format of
   * `${nodeTitle} ${portName}`. However, sometimes the node titles are the same in
   * those identical port names, then we will use an identifying number to make the
   * name unique, for example, the name will be `${nodeTitle} ${number} ${portName}`.
   *
   * @param nodes all of the nodes in the graph, this allows subgraph nodes
   * @param connections all of the connections in the graph, this allows the
   * connection with subgraph nodes
   * @returns `inputs` are input port fields, `outputs` are output port fields,
   * `inputNameMap` and `outputNameMap` are the pointer to the original node id and
   * port name for reversing the name to the original, `startNodeIds` are the start
   * node ids, `endNodeIds` are the end node ids.
   */
  static getGraphPorts(
    nodes: SerializableNode[],
    connections: NodeConnection[]
  ): {
    inputs: Record<string, DataType | Readonly<DataType[]>>;
    inputNameMap: Record<string, { nodeId: RecordId; name: string }>;
    startNodeIds: RecordId[];
    outputs: Record<string, DataType | Readonly<DataType[]>>;
    outputNameMap: Record<string, { nodeId: RecordId; name: string }>;
    endNodeIds: RecordId[];
  } {
    const incomingConnections: {
      [key in RecordId]: {
        [key in string]: { fromNodeId: RecordId; fromPortName: string };
      };
    } = {};

    const outgoingConnections: {
      [key in RecordId]: {
        [key in string]: { toNodeId: RecordId; toPortName: string };
      };
    } = {};

    for (const conn of connections) {
      const { fromNodeId, fromPortName, toNodeId, toPortName } = conn;

      if (!incomingConnections[toNodeId]) {
        incomingConnections[toNodeId] = {};
      }
      incomingConnections[toNodeId][toPortName] = { fromNodeId, fromPortName };

      if (!outgoingConnections[fromNodeId]) {
        outgoingConnections[fromNodeId] = {};
      }
      outgoingConnections[fromNodeId][fromPortName] = { toNodeId, toPortName };
    }

    const inputs: Record<string, DataType | Readonly<DataType[]>> = {};
    const inputNameMap: Record<string, { nodeId: RecordId; name: string }> = {};
    const startNodeIds: RecordId[] = [];
    const outputs: Record<string, DataType | Readonly<DataType[]>> = {};
    const outputNameMap: Record<string, { nodeId: RecordId; name: string }> =
      {};
    const endNodeIds: RecordId[] = [];
    for (const node of nodes) {
      const nodeId: RecordId = node.id;
      const nodeTitle: string =
        node.title ?? node.data._id[node.data._id.length - 1];
      const nodeInputs: NodePortFields = node.inputs ?? {};
      const nodeOutputs: NodePortFields = node.outputs ?? {};

      if (Object.keys(nodeInputs).length > 0) {
        Object.keys(nodeInputs).forEach((i) => {
          if (
            !(incomingConnections[nodeId] && incomingConnections[nodeId][i])
          ) {
            let inputName: string = i;
            let count = 1;
            while (inputNameMap[inputName]) {
              inputName = `${nodeTitle} ${
                count > 1 ? `${count} ` : ''
              }${inputName}`;
              count += 1;
            }

            inputs[inputName] = nodeInputs[i];
            inputNameMap[inputName] = { nodeId, name: i };
          }
        });
      }

      if (Object.keys(nodeOutputs).length > 0) {
        Object.keys(nodeOutputs).forEach((o) => {
          if (
            !(outgoingConnections[nodeId] && outgoingConnections[nodeId][o])
          ) {
            let outputName: string = o;
            let count = 1;
            while (outputNameMap[outputName]) {
              outputName = `${nodeTitle} ${
                count > 1 ? `${count} ` : ''
              }${outputName}`;
              count += 1;
            }

            outputs[outputName] = nodeOutputs[o];
            outputNameMap[outputName] = { nodeId, name: o };
          }
        });
      }

      if (
        !(node.id in incomingConnections) ||
        Object.keys(incomingConnections[node.id]).length === 0
      ) {
        startNodeIds.push(node.id);
      }

      if (
        !(node.id in outgoingConnections) ||
        Object.keys(outgoingConnections[node.id]).length === 0
      ) {
        endNodeIds.push(node.id);
      }
    }

    return {
      inputs,
      inputNameMap,
      startNodeIds: [...new Set(startNodeIds)],
      outputs,
      outputNameMap,
      endNodeIds: [...new Set(endNodeIds)],
    };
  }

  /**
   * Converts a serialized graph object back into an instance of `BaseGraph`, restoring its structure and state
   * from a previously serialized form. This method is static and typically used to rehydrate a graph from
   * data stored in a database or received over a network.
   *
   * @param serialized - The serialized representation of the graph.
   * @param values - Additional values that might be necessary for fully restoring the serialized nodes within the graph.
   * @param registry - Optional registries for nodes and guardrails that may be needed during deserialization.
   * @returns Returns a promise that resolves to an instance of `BaseGraph`.
   * @throws {Error} Throws an error if the serialized object does not represent a graph.
   */
  static async deserialize(
    serialized: SerializedGraph,
    values: Record<string, unknown> = {},
    registry?: {
      nodes?: NodeRegistration;
      guardrails?: GuardrailRegistration;
    }
  ): Promise<BaseGraph> {
    if (serialized._type !== 'graph') {
      throw new Error(
        `CANNOT deserialize this type in graph: ${serialized._type}`
      );
    }

    const { id, title, description, nodes: serializedNodes } = serialized;
    const nodes: SerializableNode[] = [];
    const connections: NodeConnection[] = [];
    for (const serializedNode of serializedNodes) {
      nodes.push(await NodeImpl.deserialize(serializedNode, values, registry));

      const nodeId = serializedNode.id;
      const outgoingConnections = serializedNode.outgoingConnections;
      Object.keys(outgoingConnections).forEach((fpn) => {
        connections.push({
          fromNodeId: nodeId,
          fromPortName: fpn,
          ...outgoingConnections[fpn],
        });
      });
    }

    return new SubGraph({
      id,
      title,
      description,
      nodes,
      connections,
      registry: registry?.nodes,
    });
  }

  /**
   * Serializes the current state of the graph into a format that can be easily stored or transmitted.
   * This method facilitates the conversion of complex graph structures into a standardized JSON format,
   * ensuring that all relevant details are preserved and can be reconstructed later.
   *
   * @returns Returns a promise that resolves to a serialized representation of the graph.
   */
  async serialize(): Promise<SerializedGraph> {
    const serializedNodes: SerializedNode[] = [];

    for (const node of this.nodes) {
      const nodeId: RecordId = node.id;
      const nodeImpl: NodeImpl<SerializableNode> | undefined =
        this.nodeImplMap[nodeId];
      const nodeConnections: NodeConnection[] | undefined =
        this.nodeConnMap[node.id];

      if (!nodeImpl || !nodeConnections) {
        console.warn(`CANNOT serialize node with id: ${nodeId}`);
        continue;
      }

      let processInfo: NodeProcessInfo | undefined =
        this.nodeProcessInfoMap[node.id];
      if (node.type === 'graph') {
        const subGraphProcessInfoMap: Record<RecordId, NodeProcessInfo> = (
          node.data as BaseGraph
        ).nodeProcessInfoMap;

        const subGraphNodes: SerializableNode[] = (node.data as BaseGraph)
          .flattenNodes;

        let subGraphRuntime = 0;
        let subGraphMemory = 0;
        for (const subGraphNode of subGraphNodes) {
          const subGraphNodeProcessInfo: NodeProcessInfo | undefined =
            this.nodeProcessInfoMap[subGraphNode.id] ??
            subGraphProcessInfoMap[subGraphNode.id];

          subGraphRuntime += subGraphNodeProcessInfo?.runtime ?? 0;
          subGraphMemory += subGraphNodeProcessInfo?.memory ?? 0;
        }

        processInfo = { runtime: subGraphRuntime, memory: subGraphMemory };
      }

      serializedNodes.push(
        await nodeImpl.serialize(nodeConnections, processInfo)
      );
    }

    return {
      _type: 'graph',
      id: this.id,
      title: this.title,
      description: this.description,
      nodes: serializedNodes,
    };
  }

  toJSON(): Serialized {
    if (this._kwargs['registry']) {
      delete this._kwargs['registry'];
    }

    (this.registry as Writeable<this['registry']>) = undefined!;

    return super.toJSON();
  }

  /**
   * Abstract method to define the scheduling of node execution within the graph. This method should be implemented
   * by subclasses to specify the order in which nodes should be processed based on dependencies or other criteria.
   *
   * Implementations should return an ordered array of tuples, where each tuple represents a scheduled group of nodes.
   * Each group is identified by a processor ID and an array of node IDs that can be executed in parallel or sequence,
   * depending on the graph's logic and node interdependencies.
   *
   * @returns An array of tuples, where each tuple contains a processor ID and an array of node IDs scheduled for execution.
   */
  abstract schedule(): Array<[string, RecordId[]]>;
}

/**
 * Represents a subgraph within a larger graph structure. This class extends the basic functionalities
 * of a BaseGraph to handle specific cases such as loading custom node registries and scheduling nodes
 * based on a more defined context or subgraph-specific logic.
 *
 * @example
 * // Initializing a new SubGraph with predefined nodes and connections.
 * const stringPromptNode = globalNodeRegistry.createDynamicRaw(
 *   new StringPrompt('Who are you?')
 * );
 *
 * const openAINode = globalNodeRegistry.createDynamicRaw(
 *   new OpenAIChat({ modelName: 'gpt-3.5-turbo' })
 * );
 *
 * const graph = new SubGraph({
 *   nodes: [stringPromptNode, openAINode],
 *   connections: [
 *     {
 *       fromNodeId: stringPromptNode.id,
 *       fromPortName: 'prompt',
 *       toNodeId: openAINode.id,
 *       toPortName: 'prompt',
 *     },
 *   ],
 * });
 *
 * // Scheduling the nodes in the subGraph for execution.
 * const schedule = subGraph.schedule();
 * console.log('Execution Schedule:', schedule);
 */
export class SubGraph extends BaseGraph {
  /**
   * Loads a given node registry into the subgraph, allowing the subgraph to update its internal structures
   * to accommodate changes in node definitions or behaviors. If no registry is provided, the method returns
   * the current instance without making any changes.
   *
   * @param registry - The node registration to load into the subgraph.
   * @returns Returns a new instance of SubGraph if a registry is provided, otherwise returns the current instance.
   *
   */
  loadRegistry(registry: NodeRegistration | undefined): SubGraph {
    if (!registry) {
      return this;
    }

    const nodeGraphFields = {
      id: this.id,
      title: this.title,
      description: this.description,
      registry,
      nodes: this.nodes,
      connections: this.connections,
      comments: this.comments,
    };

    return new SubGraph(nodeGraphFields);
  }

  /**
   * Schedules the execution of nodes within the subgraph. This method utilizes a GraphScheduler to determine
   * the order of node execution based on dependencies and other scheduling criteria defined within the subgraph.
   * It returns an array of tuples where each tuple consists of a processor ID and an array of node IDs, indicating
   * the order of execution.
   *
   * @returns An array of tuples, each containing a processor ID and an array of node IDs, representing the execution order of the nodes.
   *
   * @example
   * ```typescript
   * const subGraph = new SubGraph({ ... });
   * const executionSchedule = subGraph.schedule();
   * console.log(executionSchedule);
   * // Output might look like:
   * // [
   * //   ['<processor-id-1>', ['<node-id-1>', '<node-id-2>']],
   * //   ['<processor-id-2>', ['<node-id-3>']],
   * //   ['<processor-id-3>', ['<node-id-4>']]
   * // ]
   * ```
   */
  schedule(): Array<[string, RecordId[]]> {
    const graphScheduler = new GraphScheduler(this);

    return graphScheduler.schedule();
  }
}
