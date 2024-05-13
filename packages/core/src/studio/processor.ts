import Emittery from 'emittery';
import PQueue from 'p-queue';
import type { Opaque } from 'type-fest';

import { RecordId } from '../load/keymap.js';
import { getRecordId } from '../utils/nanoid.js';
import { Data, DataType } from './data.js';
import { BaseGraph } from './graph.js';
import {
  NodeConnection,
  NodePortFields,
  SerializableNode,
} from './nodes/index.js';
import { BuiltInNodes } from './registration/nodes.js';

export type ProcessId = Opaque<string, 'ProcessId'>;

export type ProcessInputMap = Record<string, Data | undefined>;
export type ProcessOutputMap = Record<string, Data | undefined>;

export type ProcessDataMap = ProcessInputMap | ProcessOutputMap;

export type NodeResults = Map<RecordId, ProcessOutputMap>;

export type GraphInputs = Record<RecordId, ProcessInputMap>;
export type GraphOutputs = Record<RecordId, ProcessOutputMap>;

// export type AttachedNodeDataItem = {
//   propagate:
//     | boolean
//     | ((parent: SerializableNode, connections: NodeConnection[]) => boolean);
// };

// export type AttachedNodeData = {
//   [key: string]: AttachedNodeDataItem | undefined;
// };

export type ProcessContext = {
  processId: ProcessId;

  signal: AbortSignal;

  contextData: Record<string, Data>;

  graphInputs: GraphInputs;

  graphOutputs: GraphOutputs;

  node: SerializableNode;

  // In the memory, we store callable options for CallableNodes
  memory: Record<RecordId, unknown>;

  createSubProcessor: (
    subNodeIds: RecordId[],
    options?: { signal?: AbortSignal }
  ) => GraphProcessor;

  abortGraph: (error?: Error | string) => void;
};

export type ProcessEvents = {
  /** processing start */
  start: {
    graph: BaseGraph;
    inputs: GraphInputs;
    contextValues: Record<string, Data>;
  };

  /** processing pause */
  pause: void;

  /** processing resume */
  resume: void;

  /** processing finish */
  finish: void;

  /** processing complete with results */
  done: { results: GraphOutputs };

  /** processing abort */
  abort: { success: boolean; error?: string | Error };

  /** processing error */
  error: { error: string | Error };

  /** graph/subgraph start */
  graphStart: { graph: BaseGraph; inputs: GraphInputs };

  /** graph/subgraph error */
  graphError: { graph: BaseGraph; error: string | Error };

  /** graph/subgraph finish */
  graphFinish: { graph: BaseGraph; outputs: GraphOutputs };

  /** graph/subgraph abort */
  graphAbort: { graph: BaseGraph; success: boolean; error?: string | Error };

  /** node start */
  nodeStart: {
    node: SerializableNode;
    inputs: ProcessInputMap;
    processId: ProcessId;
  };

  /** node finish */
  nodeFinish: {
    node: SerializableNode;
    outputs: ProcessOutputMap;
    processId: ProcessId;
  };

  /** node error */
  nodeError: { node: SerializableNode; error: Error; processId: ProcessId };

  /** node excluded */
  nodeExcluded: { node: SerializableNode };

  /** new AbortController created */
  newAbortController: AbortController;
};

export type ProcessEvent = {
  [P in keyof ProcessEvents]: { type: P } & ProcessEvents[P];
}[keyof ProcessEvents];

export class GraphProcessor {
  readonly #graph: BaseGraph;

  readonly #emitter: Emittery<ProcessEvents> = new Emittery();

  #subNodeGrps: SerializableNode[][];

  #graphInputs: GraphInputs = undefined!;

  #graphOutputs: GraphOutputs = undefined!;

  #context: ProcessContext = undefined!;

  #contextValues: Record<string, Data> = undefined!;

  // #attachedNodeData: Map<RecordId, AttachedNodeData> = undefined!;

  #nodeResults: NodeResults = undefined!;

  #executionCache: Map<string, unknown> = undefined!;

  #processingQueue: PQueue = undefined!;

  #abortController: AbortController = undefined!;

  #nodeAbortControllers = new Map<
    `${RecordId}-${ProcessId}`,
    AbortController
  >();

  #nodeErrorMap: Map<RecordId, string> = undefined!;

  #remainingNodeIds: Set<RecordId> = undefined!;

  #visitedNodeIds: Set<RecordId> = undefined!;

  #ignoreNodeIds: Set<RecordId> = undefined!;

  #currProcessingNodeIds: Set<RecordId> = undefined!;

  #queuedNodeIds: Set<RecordId> = undefined!;

  #parent: GraphProcessor | undefined;

  #children: Set<GraphProcessor> = undefined!;

  #isSubProcessor = false;

  #isRunning = false;

  #isPaused = false;

  #isAborted = false;

  #isAbortedSuccess = false;

  #abortError: Error | string | undefined = undefined;

  private _initNodeIds: RecordId[];

  get isRunning() {
    return this.#isRunning;
  }

  initProcessState() {
    this.#isRunning = true;
    // this.#attachedNodeData = new Map();
    this.#nodeResults = new Map();
    this.#executionCache ??= new Map();
    this.#nodeErrorMap = new Map();
    this.#remainingNodeIds = new Set(this._initNodeIds);
    this.#queuedNodeIds = new Set();
    this.#ignoreNodeIds = new Set();
    this.#visitedNodeIds = new Set();
    this.#currProcessingNodeIds = new Set();

    this.#processingQueue = new PQueue({ concurrency: Infinity });

    this.#graphOutputs = {};
    this.#children = new Set();
    if (!this.#isSubProcessor) {
      this.#subNodeGrps = this.#graph.schedule();
      this.#subNodeGrps.map((grp) =>
        this.createSubProcessor(grp.map((n) => n.id))
      );

      this._initNodeIds = this.#graph.flattenNodes.map((n) => n.id);
    }

    this.#isAborted = false;
    this.#isAbortedSuccess = false;
    this.#abortError = undefined;
    this.#abortController = this.initAbortController();
    this.#abortController.signal.addEventListener('abort', () => {
      this.#isAborted = true;
    });
    this.#nodeAbortControllers = new Map();
  }

  initAbortController() {
    const controller = new AbortController();
    this.#emitter.emit('newAbortController', controller);

    return controller;
  }

  constructor(graph: BaseGraph, subNodeIds?: RecordId[]) {
    this.#graph = graph;

    this.#emitter.bindMethods(this as any, [
      'on',
      'off',
      'once',
      'onAny',
      'offAny',
    ]);

    this.#isSubProcessor = !!subNodeIds && subNodeIds.length > 0;

    if (!this.#isSubProcessor) {
      this.#subNodeGrps = graph.schedule();
      this.#subNodeGrps.map((grp) =>
        this.createSubProcessor(grp.map((n) => n.id))
      );

      this._initNodeIds = this.#graph.flattenNodes.map((n) => n.id);
    } else {
      this._initNodeIds = subNodeIds!;
    }
  }

  on = undefined! as Emittery<ProcessEvents>['on'];
  off = undefined! as Emittery<ProcessEvents>['off'];
  once = undefined! as Emittery<ProcessEvents>['once'];
  onAny = undefined! as Emittery<ProcessEvents>['onAny'];
  offAny = undefined! as Emittery<ProcessEvents>['offAny'];

  async abort(success: boolean = false, error?: string | Error): Promise<void> {
    if (!this.#isRunning || this.#isAborted) {
      return Promise.resolve();
    }

    this.#abortController.abort();
    this.#isAbortedSuccess = success;
    this.#abortError = error;

    this.#emitter.emit('graphAbort', { graph: this.#graph, success, error });

    if (!this.#isSubProcessor) {
      this.#emitter.emit('abort', { success, error });
    }

    await this.#processingQueue.onIdle();
  }

  pause() {
    if (!this.#isPaused) {
      this.#isPaused = true;
      this.#emitter.emit('pause', void 0);
    }
  }

  resume() {
    if (this.#isPaused) {
      this.#isPaused = false;
      this.#emitter.emit('resume', void 0);
    }
  }

  async waitUntilUnpaused(): Promise<void> {
    if (!this.#isPaused) {
      return;
    }

    await this.#emitter.once('resume');
  }

  async *events(): AsyncGenerator<ProcessEvent> {
    for await (const [event, data] of this.#emitter.anyEvent()) {
      yield { type: event, ...(data as any) };

      if (event === 'finish') {
        break;
      }
    }
  }

  createSubProcessor(
    subNodeIds: RecordId[],
    { signal }: { signal?: AbortSignal } = {}
  ): GraphProcessor {
    const processor = new GraphProcessor(this.#graph, subNodeIds);

    processor.#isSubProcessor = true;
    processor.#executionCache = this.#executionCache;
    processor.#contextValues = this.#contextValues;
    processor.#parent = this;

    processor.on('graphStart', (e) => this.#emitter.emit('graphStart', e));
    processor.on('graphError', (e) => this.#emitter.emit('graphError', e));
    processor.on('graphFinish', (e) => this.#emitter.emit('graphFinish', e));
    processor.on('graphAbort', (e) => this.#emitter.emit('graphAbort', e));

    processor.on('nodeStart', (e) => this.#emitter.emit('nodeStart', e));
    processor.on('nodeError', (e) => this.#emitter.emit('nodeError', e));
    processor.on('nodeFinish', (e) => this.#emitter.emit('nodeFinish', e));
    processor.on('nodeExcluded', (e) => this.#emitter.emit('nodeExcluded', e));

    processor.on('pause', () => {
      if (!this.#isPaused) {
        this.pause();
      }
    });

    processor.on('resume', () => {
      if (this.#isPaused) {
        this.resume();
      }
    });

    this.#children.add(processor);

    if (signal) {
      signal.addEventListener('abort', () => processor.abort());
    }

    this.#abortController.signal.addEventListener('abort', () =>
      processor.abort()
    );

    this.on('pause', () => processor.pause());
    this.on('resume', () => processor.resume());

    return processor;
  }

  // getAttachedData(node: SerializableNode | RecordId): AttachedNodeData {
  //   const nodeId: RecordId = typeof node === "string" ? node : node.id;

  //   let nodeData: AttachedNodeData | undefined =
  //     this.#attachedNodeData.get(nodeId);
  //   if (!nodeData) {
  //     nodeData = {};
  //     this.#attachedNodeData.set(nodeId, nodeData);
  //   }

  //   return nodeData;
  // }

  getProcessInputForNode(node: SerializableNode): ProcessInputMap {
    const connections: NodeConnection[] = this.#graph.nodeConnMap[node.id];

    return this.#graph.nodePortDefMap[node.id]!.inputs.reduce(
      (values, input) => {
        if (!connections) {
          return values;
        }

        const connection: NodeConnection | undefined = connections.find(
          (conn) => conn.toNodeId === node.id && conn.toPortName === input.name
        );

        if (connection) {
          const outputNodeId: RecordId =
            this.#graph.nodeMap[connection.fromNodeId]!.id;
          const outputNodeOutputs: ProcessOutputMap | undefined =
            this.#nodeResults.get(outputNodeId);
          const outputResult: Data | undefined =
            outputNodeOutputs?.[connection.fromPortName];

          values[input.name] = outputResult;
        }

        return values;
      },
      {} as Record<string, Data | undefined>
    );
  }

  async processGraph(
    context: ProcessContext,
    inputs: GraphInputs = {},
    contextValues: Record<string, Data> = {}
  ): Promise<GraphOutputs> {
    try {
      if (this.#isRunning) {
        throw new Error('CANNOT process graph while already processing');
      }

      this.initProcessState();

      this.#context = context;
      this.#graphInputs = inputs;
      this.#contextValues ??= contextValues;

      if (!this.#isSubProcessor) {
        this.#emitter.emit('start', {
          graph: this.#graph,
          inputs: this.#graphInputs,
          contextValues: this.#contextValues,
        });
      }

      this.#emitter.emit('graphStart', {
        graph: this.#graph,
        inputs: this.#graphInputs,
      });

      const startNodes = this.#graph.flattenNodes.filter((n) =>
        Object.keys(inputs).includes(n.id)
      );

      await this.waitUntilUnpaused();

      for (const startNode of startNodes) {
        this.#processingQueue.add(async () => {
          await this.fetchNodeDataAndProcessNode(startNode);
        });
      }

      await this.#processingQueue.onIdle();

      const erroredNodes = [...this.#nodeErrorMap.entries()];
      if (erroredNodes.length && !this.#isAbortedSuccess) {
        const error =
          this.#abortError ??
          new Error(
            `Graph ${this.#graph.title} (${
              this.#graph.id
            }) failed to process due to errors in nodes:\n\t${erroredNodes
              .map(([nodeId, error]) => `${nodeId}: ${error}`)
              .join('\n\t')}`
          );

        this.#emitter.emit('graphError', { graph: this.#graph, error });

        if (!this.#isSubProcessor) {
          this.#emitter.emit('error', { error });
        }

        throw error;
      }

      const outputValues = this.#graphOutputs;

      this.#isRunning = false;

      this.#emitter.emit('graphFinish', {
        graph: this.#graph,
        outputs: outputValues,
      });

      if (!this.#isSubProcessor) {
        this.#emitter.emit('done', { results: outputValues });
        this.#emitter.emit('finish', undefined);
      }

      return outputValues;
    } finally {
      this.#isRunning = false;

      if (!this.#isSubProcessor) {
        this.#emitter.emit('finish', undefined);
      }
    }
  }

  async fetchNodeDataAndProcessNode(node: SerializableNode): Promise<void> {
    if (
      this.#currProcessingNodeIds.has(node.id) ||
      this.#queuedNodeIds.has(node.id)
    ) {
      return;
    }

    if (this.#nodeResults.has(node.id) || this.#nodeErrorMap.has(node.id)) {
      return;
    }

    const inputNodes = this.#graph.getFromNodes(node);

    // check if all input nodes are free of errors
    for (const inputNode of inputNodes) {
      if (this.#nodeErrorMap.has(inputNode.id)) {
        return;
      }
    }

    // check if all required inputs have connections and if the connected output nodes have been visited
    const connections = this.#graph.nodeConnMap[node.id] ?? [];
    const inputsReady = this.#graph.nodePortDefMap[node.id]!.inputs.every(
      (input) => {
        const hasIncomingConn = connections?.find(
          (conn) => conn.toPortName === input.name && conn.toNodeId === node.id
        );

        return hasIncomingConn || !input.required;
      }
    );

    if (!inputsReady) {
      return;
    }

    // const attachedData: AttachedNodeData = this.getAttachedData(node);

    this.#queuedNodeIds.add(node.id);

    this.#processingQueue.addAll(
      inputNodes.map((inputNode) => {
        return async () => {
          await this.fetchNodeDataAndProcessNode(inputNode);
        };
      })
    );

    await this.processNodeIfAllInputsAvailable(node);
  }

  async processNodeIfAllInputsAvailable(node: SerializableNode): Promise<void> {
    const builtInNode = node as BuiltInNodes;

    if (this.#ignoreNodeIds.has(node.id)) {
      return;
    }

    if (this.#currProcessingNodeIds.has(node.id)) {
      return;
    }

    if (this.#visitedNodeIds.has(node.id)) {
      return;
    }

    if (this.#nodeErrorMap.has(node.id)) {
      return;
    }

    const inputNodes = this.#graph.getFromNodes(node);

    // check if all input nodes are free of errors
    for (const inputNode of inputNodes) {
      if (this.#nodeErrorMap.has(inputNode.id)) {
        return;
      }
    }

    // check if all required inputs have connections and if the connected output nodes have been visited
    const connections = this.#graph.nodeConnMap[node.id] ?? [];
    const inputsReady = this.#graph.nodePortDefMap[node.id]!.inputs.every(
      (input) => {
        const hasIncomingConn = connections?.find(
          (conn) => conn.toPortName === input.name && conn.toNodeId === node.id
        );

        return hasIncomingConn || !input.required;
      }
    );

    if (!inputsReady) {
      return;
    }

    this.#currProcessingNodeIds.add(node.id);

    const processId = await this.processNode(node);

    this.#visitedNodeIds.add(node.id);
    this.#currProcessingNodeIds.delete(node.id);
    this.#remainingNodeIds.delete(node.id);

    const outputNodes = this.#graph.getToNodes(node);

    this.#processingQueue.addAll(
      outputNodes.map((outputNode) => async () => {
        await this.processNodeIfAllInputsAvailable(outputNode);
      })
    );
  }

  async processNode(node: SerializableNode): Promise<ProcessId> {
    const processId = getRecordId() as string as ProcessId;

    if (this.#abortController.signal.aborted) {
      this.throwProcessError(node, new Error('Processing aborted'), processId);
      return processId;
    }

    const inputNodes = this.#graph.getFromNodes(node);
    const erroredInputNodes = inputNodes.filter((n) =>
      this.#nodeErrorMap.has(n.id)
    );
    if (erroredInputNodes.length > 0) {
      const error = new Error(
        `CANNOT Process node ${
          node.id
        } because it depends on error nodes:\n\t${erroredInputNodes
          .map((n) => n.id)
          .join('\n\t')}`
      );

      this.throwProcessError(node, error, processId);
      return processId;
    }

    await this.processNormalNode(node, processId);

    return processId;
  }

  async processNormalNode(node: SerializableNode, processId: ProcessId) {
    const inputValues: ProcessInputMap = this.getProcessInputForNode(node);

    this.#emitter.emit('nodeStart', { node, inputs: inputValues, processId });

    const outputValues: ProcessOutputMap = await this.processNodeWithInputData(
      node,
      inputValues,
      processId
    );

    this.#nodeResults.set(node.id, outputValues);
    this.#visitedNodeIds.add(node.id);

    this.#emitter.emit('nodeFinish', {
      node,
      outputs: outputValues,
      processId,
    });
  }

  async processNodeWithInputData(
    node: SerializableNode,
    inputs: ProcessInputMap,
    processId: ProcessId
  ): Promise<ProcessOutputMap> {
    const nodeImpl = this.#graph.nodeImplMap[node.id]!;

    const nodeAbortController: AbortController = this.initAbortController();
    const abortListener = () => {
      nodeAbortController.abort();
    };
    this.#nodeAbortControllers.set(
      `${node.id}-${processId}`,
      nodeAbortController
    );
    this.#abortController.signal.addEventListener('abort', abortListener);

    const context: ProcessContext = {
      ...this.#context,
      node,
      processId,
      graphInputs: this.#graphInputs,
      graphOutputs: this.#graphOutputs,
      contextData: this.#contextValues,
      signal: nodeAbortController.signal,
      createSubProcessor: this.createSubProcessor,
      abortGraph: (error) => {
        this.abort(error === undefined, error);
      },
    };

    await this.waitUntilUnpaused();

    // Processing a single node
    const results = await nodeImpl.process(inputs, context);

    this.#nodeAbortControllers.delete(`${node.id}-${processId}`);
    this.#abortController.signal.removeEventListener('abort', abortListener);

    if (nodeAbortController.signal.aborted) {
      throw new Error(`Node ${node.id} aborted`);
    }

    return results;
  }

  throwProcessError(
    node: SerializableNode,
    error: Error,
    processId: ProcessId
  ) {
    this.#emitter.emit('nodeError', { node, error, processId });
    this.#nodeErrorMap.set(node.id, error.toString());
  }
}

/**
 * Validate whether the ports are full-filled with the process data.
 */
export function validateProcessDataFromPorts(
  processData: ProcessDataMap,
  portFields: NodePortFields
): boolean {
  const keywords: string[] = Object.keys(portFields);

  return keywords.every((keyword: string): boolean => {
    // Return false if there is no such a port keyword in the process data.
    if (!Object.prototype.hasOwnProperty.call(processData, keyword)) {
      return false;
    }

    const processValue: Data | undefined = processData[keyword];
    const portType: DataType | Readonly<DataType[]> = portFields[keyword];

    return validateProcessData(processValue, portType);
  });
}

export function validateProcessData(
  processData: Data | undefined,
  dataType: DataType | Readonly<DataType[]>
): boolean {
  // Check if this keyword can support multiple types of data
  if (Array.isArray(dataType)) {
    // Return true if the process data value and the type are both empty.
    if (!processData) {
      return (
        dataType.length === 0 || dataType.some((t: DataType) => t === 'unknown')
      );
    }

    // Return true if there is some type in the type array that can be valid.
    // TODO: think about if coerceTypeOptional can apply here
    return dataType.some((t: DataType) => processData['type'] === t);
  }

  // Return false if the process data value is empty and the type is non-empty.
  if (!processData) return dataType === 'unknown';

  // Validate the types
  // TODO: think about if coerceTypeOptional can apply here
  return processData['type'] === dataType;
}
