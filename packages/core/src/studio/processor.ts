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
  processId?: ProcessId;

  signal?: AbortSignal;

  contextData?: Record<string, Data>;

  graphInputs?: GraphInputs;

  graphOutputs?: GraphOutputs;

  node?: SerializableNode;

  // In the memory, we store callable options for CallableNodes
  memory?: Record<RecordId, unknown>;

  abortGraph?: (error?: Error | string) => void;
};

export type ProcessEvents = {
  /** processing start */
  start: {
    graph: BaseGraph;
    inputs: GraphInputs;
    contextValues: Record<string, Data>;
  };

  /** TODO: processing process a node, adding the node to the processing queue */
  processInQueue: SerializableNode;

  /** processing pause */
  pause: { processorId: string };

  /** processing resume */
  resume: { processorId: string };

  /** processing finish */
  finish: { processorId: string };

  /** processing complete with results */
  done: { results: GraphOutputs };

  /** processing abort */
  abort: { processorId: string; success: boolean; error?: string | Error };

  /** processing error */
  error: { processorId: string; error: string | Error };

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

  #processorId: string;

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

  #nodeIdsToRun: RecordId[];

  get isRunning() {
    return this.#isRunning;
  }

  initProcessState() {
    this.#isRunning = true;
    // this.#attachedNodeData = new Map();
    this.#nodeResults = new Map();
    this.#executionCache ??= new Map();
    this.#nodeErrorMap = new Map();
    this.#remainingNodeIds = new Set(this.#nodeIdsToRun);
    this.#queuedNodeIds = new Set();
    this.#ignoreNodeIds = new Set();
    this.#visitedNodeIds = new Set();
    this.#currProcessingNodeIds = new Set();

    this.#processingQueue = new PQueue({ concurrency: Infinity });

    this.#graphOutputs = {};
    this.#children = new Set();
    if (!this.#isSubProcessor) {
      this._distributeNodesToWorkers(this.#graph.schedule());
    }

    this.#isAborted = false;
    this.#isAbortedSuccess = false;
    this.#abortError = undefined;
    this.#abortController = this.initAbortController();
    this.#abortController.signal.addEventListener('abort', () => {
      this.#isAborted = true;
    });
    this.#nodeAbortControllers = new Map();

    this.subscribe();
  }

  initAbortController() {
    const controller = new AbortController();
    this.#emitter.emit('newAbortController', controller);

    return controller;
  }

  constructor(
    graph: BaseGraph,
    subProcessor?: { processorId: string; nodeIds: RecordId[] }
  ) {
    this.#graph = graph;

    this.#emitter.bindMethods(this as any, [
      'on',
      'off',
      'once',
      'onAny',
      'offAny',
    ]);

    this.#isSubProcessor = !!subProcessor;

    if (subProcessor) {
      this.#processorId = subProcessor.processorId;
      this.#nodeIdsToRun = subProcessor.nodeIds;
    }
  }

  subscribe() {
    this.#emitter.on('processInQueue', async (node: SerializableNode) => {
      this.#processingQueue.add(async () => {
        await this.fetchNodeDataAndProcessNode(node);
      });
    });
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

    if (!this.#isSubProcessor) {
      this.#parent!.#emitter.emit('graphAbort', {
        graph: this.#graph,
        success,
        error,
      });
    }

    this.#emitter.emit('abort', {
      processorId: this.#processorId,
      success,
      error,
    });

    await this.#processingQueue.onIdle();
  }

  pause() {
    if (!this.#isPaused) {
      this.#isPaused = true;
      this.#emitter.emit('pause', { processorId: this.#processorId });
    }
  }

  resume() {
    if (this.#isPaused) {
      this.#isPaused = false;
      this.#emitter.emit('resume', { processorId: this.#processorId });
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
    processorId: string,
    subNodeIds: RecordId[],
    { signal }: { signal?: AbortSignal } = {}
  ): GraphProcessor {
    const processor = new GraphProcessor(this.#graph, {
      processorId,
      nodeIds: subNodeIds,
    });

    processor.#isSubProcessor = true;
    processor.#executionCache = this.#executionCache;
    processor.#contextValues = this.#contextValues;
    processor.#parent = this;

    // TODO: the processor should handle process emit

    processor.on('graphStart', (e) => this.#emitter.emit('graphStart', e));
    processor.on('graphError', (e) => this.#emitter.emit('graphError', e));
    processor.on('graphFinish', (e) => this.#emitter.emit('graphFinish', e));
    processor.on('graphAbort', (e) => this.#emitter.emit('graphAbort', e));

    processor.on('nodeStart', async (e) => this.#emitter.emit('nodeStart', e));
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

    processor.subscribe();

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

  async processGraph(
    inputs: GraphInputs = {},
    context: ProcessContext = {},
    contextValues: Record<string, Data> = {}
  ): Promise<GraphOutputs> {
    try {
      if (this.#isRunning) {
        throw new Error('CANNOT process graph while already processing');
      }

      if (this.#isSubProcessor) {
        throw new Error('CANNOT process graph in sub-processor');
      }

      this.initProcessState();

      this.#context = context;
      this.#contextValues ??= contextValues;

      this.#graphInputs = inputs;
      for (const child of this.#children) {
        child.#graphInputs = inputs;
      }

      this.#emitter.emit('start', {
        graph: this.#graph,
        inputs: this.#graphInputs,
        contextValues: this.#contextValues,
      });

      this.#emitter.emit('graphStart', {
        graph: this.#graph,
        inputs: this.#graphInputs,
      });

      const startNodes: SerializableNode[] = Object.values(
        this.#graph.graphInputNameMap
      ).map(({ nodeId }) => this.#graph.nodeMap[nodeId]);

      await this.waitUntilUnpaused();

      for (const startNode of startNodes) {
        this.#processingQueue.add(async () => {
          await this.fetchNodeDataAndProcessNode(startNode);
        });
      }

      await this.#processingQueue.onIdle();

      let erroredNodes: Array<[RecordId, string]> = [];
      let abortError: string | Error | undefined = undefined;
      let isAbortedSucess = true;

      const errors: Array<string | Error> = [];
      for (const worker of [this, ...this.#children]) {
        erroredNodes = [...worker.#nodeErrorMap.entries()];
        isAbortedSucess = worker.#isAbortedSuccess;
        abortError = worker.#abortError;

        if (erroredNodes.length && !isAbortedSucess) {
          const error =
            abortError ??
            new Error(
              `[${worker.#isSubProcessor ? 'SUB' : 'MASTER'}] ${
                worker.#processorId
              }: Failed to process due to errors in nodes:\n\t${erroredNodes
                .map(([nodeId, error]) => `${nodeId}: ${error}`)
                .join('\n\t')}`
            );

          this.#emitter.emit('error', {
            processorId: worker.#processorId,
            error,
          });

          errors.push(error);
        }
      }

      if (errors.length > 0) {
        const graphError = new Error(
          `Graph ${this.#graph.title} (${
            this.#graph.id
          }) processing failed because:\n${errors
            .map((e) => e.toString())
            .join('\n')}`
        );
        this.#emitter.emit('graphError', {
          graph: this.#graph,
          error: graphError,
        });
      }

      const outputValues = this.#graphOutputs;

      this.#isRunning = false;

      this.#emitter.emit('graphFinish', {
        graph: this.#graph,
        outputs: outputValues,
      });

      for (const worker of [this, ...this.#children]) {
        this.#emitter.emit('finish', { processorId: worker.#processorId });
      }

      this.#emitter.emit('done', {
        results: outputValues,
      });

      return outputValues;
    } finally {
      this.#isRunning = false;

      this.#emitter.emit('finish', { processorId: this.#processorId });
    }
  }

  async fetchNodeDataAndProcessNode(node: SerializableNode): Promise<void> {
    try {
      // Check if the node should be processed in the current processor
      const processorToRun: GraphProcessor = this._getProcessorForNode(node);
      if (processorToRun.#processorId !== this.#processorId) {
        processorToRun.#emitter.emit('processInQueue', node);
        return;
      }

      // Check if the current processor is processing the node
      // Check if the node is queued
      if (
        this.#currProcessingNodeIds.has(node.id) ||
        this.#queuedNodeIds.has(node.id)
      ) {
        return;
      }

      // Check if the node already has result
      // Check if the node is errored
      if (this.#nodeResults.has(node.id) || this.#nodeErrorMap.has(node.id)) {
        return;
      }

      // Check if all input nodes are free of errors
      const inputNodes = this.#graph.getFromNodes(node);
      for (const inputNode of inputNodes) {
        const processorToRunInput: GraphProcessor =
          this._getProcessorForNode(inputNode);
        if (processorToRunInput.#nodeErrorMap.has(inputNode.id)) {
          return;
        }
      }

      // Check if all required inputs have connections and if the connected output nodes have been visited
      const connections = this.#graph.nodeConnMap[node.id] ?? [];
      const inputsReady = this.#graph.nodePortDefMap[node.id]!.inputs.every(
        (input) => {
          const hasIncomingConn = connections?.find(
            (conn) =>
              conn.toPortName === input.name && conn.toNodeId === node.id
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
    } catch (error) {
      await this.abort(false, error as Error);
    }
  }

  async processNodeIfAllInputsAvailable(node: SerializableNode): Promise<void> {
    try {
      // Check if the current node should be ignored
      if (this.#ignoreNodeIds.has(node.id)) {
        return;
      }

      // Check if the current processor is processing the node
      if (this.#currProcessingNodeIds.has(node.id)) {
        return;
      }

      // Check if the current node is visited
      if (this.#visitedNodeIds.has(node.id)) {
        return;
      }

      // Check if the current node is errored
      if (this.#nodeErrorMap.has(node.id)) {
        return;
      }

      // Check if all input nodes are free of errors
      const inputNodes = this.#graph.getFromNodes(node);
      for (const inputNode of inputNodes) {
        const processorToRunInput: GraphProcessor =
          this._getProcessorForNode(inputNode);
        if (processorToRunInput.#nodeErrorMap.has(inputNode.id)) {
          return;
        }
      }

      // Check if all required inputs have connections and if the connected output nodes have been visited
      const connections = this.#graph.nodeConnMap[node.id] ?? [];
      const inputsReady = this.#graph.nodePortDefMap[node.id]!.inputs.every(
        (input) => {
          const hasIncomingConn = connections?.find(
            (conn) =>
              conn.toPortName === input.name && conn.toNodeId === node.id
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
    } catch (error) {
      await this.abort(false, error as Error);
    }
  }

  async processNode(node: SerializableNode): Promise<ProcessId> {
    const processId = getRecordId() as string as ProcessId;

    // Check if user is aborted
    if (this.#abortController.signal.aborted) {
      this.throwProcessError(node, new Error('Processing aborted'), processId);
      return processId;
    }

    // Check if all input nodes are free of errors
    const inputNodes = this.#graph.getFromNodes(node);
    const erroredInputNodes = inputNodes.filter((n) => {
      const processorToRunInput: GraphProcessor = this._getProcessorForNode(n);
      return processorToRunInput.#nodeErrorMap.has(n.id);
    });
    if (erroredInputNodes.length > 0) {
      const error = new Error(
        `CANNOT Process node ${
          node.id
        } because it depends on error nodes: ${erroredInputNodes
          .map((n) => n.id)
          .join(', ')}`
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

    try {
      const outputValues: ProcessOutputMap =
        await this.processNodeWithInputData(node, inputValues, processId);

      this.#nodeResults.set(node.id, outputValues);
      this.#visitedNodeIds.add(node.id);

      this.#emitter.emit('nodeFinish', {
        node,
        outputs: outputValues,
        processId,
      });
    } catch (error) {
      this.throwProcessError(node, error as Error, processId);
    }
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
          const outputNode: SerializableNode =
            this.#graph.nodeMap[connection.fromNodeId]!;
          const processorToRun: GraphProcessor =
            this._getProcessorForNode(outputNode);
          const outputNodeId: RecordId = outputNode.id;
          const outputNodeOutputs: ProcessOutputMap | undefined =
            processorToRun.#nodeResults.get(outputNodeId);
          const outputResult: Data | undefined =
            outputNodeOutputs?.[connection.fromPortName];

          values[input.name] = outputResult;
        }

        return values;
      },
      {} as Record<string, Data | undefined>
    );
  }

  throwProcessError(
    node: SerializableNode,
    error: Error,
    processId: ProcessId
  ) {
    this.#emitter.emit('nodeError', { node, error, processId });
    this.#nodeErrorMap.set(node.id, error.toString());
  }

  private _distributeNodesToWorkers(group: Array<[string, RecordId[]]>) {
    // The master processor runs the first group of nodes
    const firstNodeGroup: [string, RecordId[]] | undefined = group.shift();

    if (!firstNodeGroup) {
      return;
    }

    const [masterProcessorId, masterNodeIds] = firstNodeGroup;

    this.#processorId = masterProcessorId;

    this.#nodeIdsToRun = masterNodeIds;

    this.#parent = undefined;

    // Distribute the following groups of nodes to workers
    group.map(([subProcessorId, subNodeIds]) => {
      this.createSubProcessor(subProcessorId, subNodeIds);
    });
  }

  private _getProcessorForNode(node: SerializableNode): GraphProcessor {
    const isRunNodeInCurrProcessor: boolean = this.#nodeIdsToRun.includes(
      node.id
    );

    if (isRunNodeInCurrProcessor) {
      return this;
    }

    if (this.#isSubProcessor) {
      if (!this.#parent) {
        throw new Error(`CANNOT find parent in child: ${this.#processorId}`);
      }

      return this.#parent;
    }

    for (const child of this.#children) {
      const isRunNodeInSubProcessor: boolean = child.#nodeIdsToRun.includes(
        node.id
      );

      if (isRunNodeInSubProcessor) {
        return child;
      }
    }

    throw new Error(`CANNOT find child in parent: ${this.#processorId}`);
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
