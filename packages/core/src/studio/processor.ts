import { performance } from 'perf_hooks';
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
import { InputNode, InputNodeImpl } from './nodes/utility/input.node.js';
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
    processorId: string;
    isSubProcessor: boolean;
    graph: BaseGraph;
    inputs: GraphInputs;
    contextValues: Record<string, Data>;
  };

  /** processing process a node, adding the node to the processing queue */
  processInQueue: {
    processorId: string;
    isSubProcessor: boolean;
    node: SerializableNode;
  };

  /** processing pause */
  pause: { processorId: string; isSubProcessor: boolean };

  /** processing resume */
  resume: { processorId: string; isSubProcessor: boolean };

  /** processing finish */
  finish: { processorId: string; isSubProcessor: boolean };

  /** processing complete with results */
  done: { processorId: string; isSubProcessor: boolean; results: GraphOutputs };

  /** processing abort */
  abort: {
    processorId: string;
    isSubProcessor: boolean;
    success: boolean;
    error?: string | Error;
  };

  /** processing error */
  error: {
    processorId: string;
    isSubProcessor: boolean;
    error: string | Error;
  };

  /** graph/subgraph start */
  graphStart: {
    processorId: string;
    isSubProcessor: boolean;
    graph: BaseGraph;
    inputs: GraphInputs;
  };

  /** graph/subgraph error */
  graphError: {
    processorId: string;
    isSubProcessor: boolean;
    graph: BaseGraph;
    error: string | Error;
  };

  /** graph/subgraph finish */
  graphFinish: {
    processorId: string;
    isSubProcessor: boolean;
    graph: BaseGraph;
    outputs: GraphOutputs;
  };

  /** graph/subgraph abort */
  graphAbort: {
    processorId: string;
    isSubProcessor: boolean;
    graph: BaseGraph;
    success: boolean;
    error?: string | Error;
  };

  /** node start */
  nodeStart: {
    processorId: string;
    isSubProcessor: boolean;
    node: SerializableNode;
    inputs: ProcessInputMap;
    processId: ProcessId;
  };

  /** node finish */
  nodeFinish: {
    processorId: string;
    isSubProcessor: boolean;
    node: SerializableNode;
    outputs: ProcessOutputMap;
    processId: ProcessId;
  };

  /** node error */
  nodeError: {
    processorId: string;
    isSubProcessor: boolean;
    node: SerializableNode;
    error: Error;
    processId: ProcessId;
  };

  /** node excluded */
  nodeExcluded: {
    processorId: string;
    isSubProcessor: boolean;
    node: SerializableNode;
  };

  /** new AbortController created */
  newAbortController: {
    processorId: string;
    isSubProcessor: boolean;
    controller: AbortController;
  };

  /** InputNode requires user input */
  requireInput: {
    processorId: string;
    isSubProcessor: boolean;
    node: InputNode;
    // context provided to user to prompt for answers
    promptContext: ProcessOutputMap;
    // callback to handle user inputs, this is identical
    // to `userInput` method in GraphProcessor
    callback: (userInputs: ProcessInputMap) => void;
    processId: ProcessId;
  };

  /** trace logging */
  trace: {
    processorId: string;
    isSubProcessor: boolean;
    log: string;
  };
};

export type ProcessEvent = {
  [P in keyof ProcessEvents]: { '#type': P } & ProcessEvents[P];
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

  #nodeIdToProcessorIdMap: Map<RecordId, string> = undefined!;

  #pendingUserInputsNodeIds: Record<
    RecordId,
    {
      resolve: (inputs: ProcessInputMap) => void;
      reject: (error: unknown) => void;
    }
  > = undefined!;

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

    this.#isAborted = false;
    this.#isAbortedSuccess = false;
    this.#abortError = undefined;
    this.#abortController = this.#initAbortController();
    this.#abortController.signal.addEventListener('abort', () => {
      this.#isAborted = true;
    });
    this.#nodeAbortControllers = new Map();

    this.#children = new Set();
    if (!this.#isSubProcessor) {
      this._distributeNodesToWorkers(this.#graph.schedule());
    }

    this.#graphOutputs = {};
    this.#pendingUserInputsNodeIds = {};
  }

  #initAbortController() {
    const controller = new AbortController();
    this.#emitter.emit('newAbortController', {
      processorId: this.#processorId,
      isSubProcessor: this.#isSubProcessor,
      controller: controller,
    });

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

    this.#isSubProcessor = subProcessor !== undefined;

    if (this.#isSubProcessor) {
      this.#processorId = subProcessor!.processorId;
      this.#nodeIdsToRun = subProcessor!.nodeIds;
    }

    this.#subscribe();
  }

  #subscribe() {
    this.#emitter.on(
      'processInQueue',
      async (eventData: {
        processorId: string;
        isSubProcessor: boolean;
        node: SerializableNode;
      }) => {
        this.#emitter.emit('trace', {
          processorId: eventData.processorId,
          isSubProcessor: eventData.isSubProcessor,
          log: `process node in queue: ${eventData.node.id}`,
        });

        if (!this.#isRunning) {
          this.#emitter.emit('trace', {
            processorId: this.#processorId,
            isSubProcessor: this.#isSubProcessor,
            log: 'processor is not started yet, starting it now',
          });

          this.initProcessState();
        }

        this.#processingQueue?.add(async () => {
          await this.#fetchNodeDataAndProcessNode(eventData.node);
        });
      }
    );

    if (!this.#isSubProcessor) {
      this.#emitter.on(
        'trace',
        (eventData: {
          processorId: string;
          isSubProcessor: boolean;
          log: string;
        }) => {
          console.log(
            `[${eventData.isSubProcessor ? 'SUB' : 'MASTER'}] ${
              eventData.processorId
            }: ${eventData.log.toString()}`
          );
        }
      );

      this.#emitter.on(
        'error',
        (eventData: {
          processorId: string;
          isSubProcessor: boolean;
          error: string | Error;
        }) => {
          console.error(
            `[${eventData.isSubProcessor ? 'SUB' : 'MASTER'}] ${
              eventData.processorId
            }: ${eventData.error.toString()}`
          );
        }
      );
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

    this.#emitter.emit('trace', {
      processorId: this.#processorId,
      isSubProcessor: this.#isSubProcessor,
      log: 'processor is aborted',
    });

    this.#emitter.emit('abort', {
      processorId: this.#processorId,
      isSubProcessor: this.#isSubProcessor,
      success,
      error,
    });

    if (!this.#isSubProcessor) {
      this.#emitter.emit('trace', {
        processorId: this.#processorId,
        isSubProcessor: this.#isSubProcessor,
        log: 'graph is aborted',
      });

      this.#emitter.emit('graphAbort', {
        processorId: this.#processorId,
        isSubProcessor: this.#isSubProcessor,
        graph: this.#graph,
        success,
        error,
      });
    }

    await this.#processingQueue.onEmpty();
  }

  pause() {
    if (!this.#isPaused) {
      this.#isPaused = true;

      this.#emitter.emit('trace', {
        processorId: this.#processorId,
        isSubProcessor: this.#isSubProcessor,
        log: 'processor is paused',
      });

      this.#emitter.emit('pause', {
        processorId: this.#processorId,
        isSubProcessor: this.#isSubProcessor,
      });
    }
  }

  resume() {
    if (this.#isPaused) {
      this.#isPaused = false;

      this.#emitter.emit('trace', {
        processorId: this.#processorId,
        isSubProcessor: this.#isSubProcessor,
        log: 'processor is resumed',
      });

      this.#emitter.emit('resume', {
        processorId: this.#processorId,
        isSubProcessor: this.#isSubProcessor,
      });
    }
  }

  userInput(nodeId: RecordId, inputs: ProcessInputMap): void {
    const node: SerializableNode = this.#graph.nodeMap[nodeId];
    const processorToRun: GraphProcessor = this._getProcessorForNode(node);

    if (processorToRun.#processorId !== this.#processorId) {
      processorToRun.userInput(nodeId, inputs);
    } else {
      const pending = this.#pendingUserInputsNodeIds?.[nodeId];
      if (pending) {
        this.#emitter.emit('trace', {
          processorId: this.#processorId,
          isSubProcessor: this.#isSubProcessor,
          log: `node ${node.id} is receiving user's inputs`,
        });

        pending.resolve(inputs);
        delete this.#pendingUserInputsNodeIds[nodeId];
      }
    }
  }

  async #waitUntilUnpaused(): Promise<void> {
    if (!this.#isPaused) {
      return;
    }

    await this.#emitter.once('resume');
  }

  async *events(): AsyncGenerator<ProcessEvent> {
    for await (const [event, data] of this.#emitter.anyEvent()) {
      yield { '#type': event, ...(data as any) };

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

    processor.on('graphStart', (e) => this.#emitter.emit('graphStart', e));
    processor.on('graphError', (e) => this.#emitter.emit('graphError', e));
    processor.on('graphFinish', (e) => this.#emitter.emit('graphFinish', e));
    processor.on('graphAbort', (e) => this.#emitter.emit('graphAbort', e));

    processor.on('nodeStart', (e) => this.#emitter.emit('nodeStart', e));
    processor.on('nodeError', (e) => this.#emitter.emit('nodeError', e));
    processor.on('nodeFinish', (e) => this.#emitter.emit('nodeFinish', e));
    processor.on('nodeExcluded', (e) => this.#emitter.emit('nodeExcluded', e));

    processor.on('requireInput', (e) => this.#emitter.emit('requireInput', e));

    processor.on('trace', (e) => this.#emitter.emit('trace', e));

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

      this.#emitter.emit('trace', {
        processorId: this.#processorId,
        isSubProcessor: this.#isSubProcessor,
        log: `creating master worker: ${this.#processorId}`,
      });

      for (const child of this.#children) {
        this.#emitter.emit('trace', {
          processorId: this.#processorId,
          isSubProcessor: this.#isSubProcessor,
          log: `creating sub worker: ${child.#processorId}`,
        });
      }

      this.#emitter.emit('trace', {
        processorId: this.#processorId,
        isSubProcessor: this.#isSubProcessor,
        log: 'graph start',
      });

      this.#emitter.emit('graphStart', {
        processorId: this.#processorId,
        isSubProcessor: this.#isSubProcessor,
        graph: this.#graph,
        inputs: this.#graphInputs,
      });

      const workers: GraphProcessor[] = [this, ...this.#children];

      for (const worker of workers) {
        worker.#processingQueue = new PQueue({ concurrency: Infinity });

        worker.#context = context;
        worker.#contextValues ??= contextValues;

        worker.#graphInputs = inputs;

        worker.#emitter.emit('trace', {
          processorId: worker.#processorId,
          isSubProcessor: worker.#isSubProcessor,
          log: 'processor start',
        });

        worker.#emitter.emit('start', {
          processorId: worker.#processorId,
          isSubProcessor: worker.#isSubProcessor,
          graph: worker.#graph,
          inputs: worker.#graphInputs,
          contextValues: worker.#contextValues,
        });
      }

      const startNodeIds: RecordId[] = this.#graph.graphStartNodeIds;

      const endNodeIds: RecordId[] = this.#graph.graphEndNodeIds;

      await this.#waitUntilUnpaused();

      this.#emitter.emit('trace', {
        processorId: this.#processorId,
        isSubProcessor: this.#isSubProcessor,
        log: `start with nodes: ${startNodeIds}`,
      });

      this.#emitter.emit('trace', {
        processorId: this.#processorId,
        isSubProcessor: this.#isSubProcessor,
        log: `end with nodes: ${endNodeIds}`,
      });

      for (const startNodeId of startNodeIds) {
        await this.#emitter.emit('processInQueue', {
          processorId: this.#processorId,
          isSubProcessor: this.#isSubProcessor,
          node: this.#graph.nodeMap[startNodeId],
        });
      }

      for (;;) {
        const allQueuesEmpty = workers.every(
          (worker) =>
            worker.#processingQueue.size === 0 &&
            worker.#processingQueue.pending === 0
        );
        if (allQueuesEmpty) {
          // Check again after a short delay to ensure no new tasks were added
          await _delay(1);
          const allQueuesStillEmpty = workers.every(
            (worker) =>
              worker.#processingQueue.size === 0 &&
              worker.#processingQueue.pending === 0
          );
          if (allQueuesStillEmpty) {
            break;
          }
        }
        await _delay(1); // Check every 1ms
      }

      this.#emitter.emit('trace', {
        processorId: this.#processorId,
        isSubProcessor: this.#isSubProcessor,
        log: 'all processing queues are finished',
      });

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
              `failed to process due to errors in nodes:\n\t${erroredNodes
                .map(([nodeId, error]) => `${nodeId}: ${error}`)
                .join('\n\t')}`
            );

          this.#emitter.emit('error', {
            processorId: worker.#processorId,
            isSubProcessor: worker.#isSubProcessor,
            error,
          });

          errors.push(error);
        } else {
          endNodeIds.forEach((nId) => {
            if (worker.#nodeResults.has(nId)) {
              this.#graphOutputs[nId] = worker.#nodeResults.get(nId)!;
            }
          });
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

        this.#emitter.emit('trace', {
          processorId: this.#processorId,
          isSubProcessor: this.#isSubProcessor,
          log: graphError.toString(),
        });

        this.#emitter.emit('graphError', {
          processorId: this.#processorId,
          isSubProcessor: this.#isSubProcessor,
          graph: this.#graph,
          error: graphError,
        });
      }

      const outputValues = this.#graphOutputs;

      this.#isRunning = false;

      this.#emitter.emit('trace', {
        processorId: this.#processorId,
        isSubProcessor: this.#isSubProcessor,
        log: 'graph is finished',
      });

      this.#emitter.emit('graphFinish', {
        processorId: this.#processorId,
        isSubProcessor: this.#isSubProcessor,
        graph: this.#graph,
        outputs: outputValues,
      });

      for (const worker of workers) {
        worker.#emitter.emit('trace', {
          processorId: this.#processorId,
          isSubProcessor: this.#isSubProcessor,
          log: 'processing is done',
        });

        worker.#emitter.emit('done', {
          processorId: worker.#processorId,
          isSubProcessor: worker.#isSubProcessor,
          results: outputValues,
        });
      }

      return outputValues;
    } finally {
      for (const worker of [this, ...this.#children]) {
        worker.#isRunning = false;

        worker.#emitter.emit('trace', {
          processorId: this.#processorId,
          isSubProcessor: this.#isSubProcessor,
          log: 'processing is finished',
        });

        this.#emitter.emit('finish', {
          processorId: worker.#processorId,
          isSubProcessor: worker.#isSubProcessor,
        });
      }
    }
  }

  async #fetchNodeDataAndProcessNode(node: SerializableNode): Promise<void> {
    try {
      // Check if the node should be processed in the current processor
      const processorToRun: GraphProcessor = this._getProcessorForNode(node);
      if (processorToRun.#processorId !== this.#processorId) {
        this.#emitter.emit('trace', {
          processorId: this.#processorId,
          isSubProcessor: this.#isSubProcessor,
          log: `node ${node.id} is NOT processed in the current processor when fetching the node data`,
        });

        processorToRun.#emitter.emit('processInQueue', {
          processorId: processorToRun.#processorId,
          isSubProcessor: processorToRun.#isSubProcessor,
          node,
        });

        return;
      }

      // Check if the current processor is processing the node
      if (this.#currProcessingNodeIds.has(node.id)) {
        this.#emitter.emit('trace', {
          processorId: this.#processorId,
          isSubProcessor: this.#isSubProcessor,
          log: `node ${node.id} is already in processing when fetching the node data`,
        });

        return;
      }

      // Check if the node is queued
      if (this.#queuedNodeIds.has(node.id)) {
        this.#emitter.emit('trace', {
          processorId: this.#processorId,
          isSubProcessor: this.#isSubProcessor,
          log: `node ${node.id} is queued when fetching the node data`,
        });

        return;
      }

      // Check if the node already has result
      if (this.#nodeResults.has(node.id)) {
        this.#emitter.emit('trace', {
          processorId: this.#processorId,
          isSubProcessor: this.#isSubProcessor,
          log: `node ${node.id} already has result when fetching the node data`,
        });

        return;
      }

      // Check if the node is errored
      if (this.#nodeErrorMap.has(node.id)) {
        this.#emitter.emit('trace', {
          processorId: this.#processorId,
          isSubProcessor: this.#isSubProcessor,
          log: `node ${node.id} is errored when fetching the node data`,
        });

        return;
      }

      const connections = this.#graph.nodeConnMap[node.id] ?? [];
      const inputNodeIds: RecordId[] = [];
      for (const input of this.#graph.nodePortDefMap[node.id]!.inputs) {
        const incomingConn = connections?.find(
          (conn) => conn.toPortName === input.name && conn.toNodeId === node.id
        );

        // Check if all required inputs have connections and is not from the input
        if (
          !incomingConn &&
          input.required &&
          !this.#graphInputs[input.nodeId]
        ) {
          this.#emitter.emit('trace', {
            processorId: this.#processorId,
            isSubProcessor: this.#isSubProcessor,
            log: `node ${node.id} is NOT ready to process because some required inputs are not connected when fetching the node data`,
          });

          return;
        }

        if (!incomingConn || !input.required) {
          continue;
        }

        inputNodeIds.push(incomingConn.fromNodeId);
      }

      const inputNodes: SerializableNode[] = [...new Set(inputNodeIds)].map(
        (nId) => this.#graph.nodeMap[nId]
      );
      for (const inputNode of inputNodes) {
        const processorToRunInput: GraphProcessor =
          this._getProcessorForNode(inputNode);

        // Check if all input nodes are free of errors
        if (processorToRunInput.#nodeErrorMap.has(inputNode.id)) {
          this.#emitter.emit('trace', {
            processorId: this.#processorId,
            isSubProcessor: this.#isSubProcessor,
            log: `node ${node.id} is NOT ready to process because prior nodes have errors when fetching the node data`,
          });

          return;
        }

        // Check if the required and connected input nodes has output
        if (
          !Object.prototype.hasOwnProperty.call(
            processorToRunInput.#graphInputs,
            inputNode.id
          ) &&
          !processorToRunInput.#nodeResults.has(inputNode.id)
        ) {
          this.#emitter.emit('trace', {
            processorId: this.#processorId,
            isSubProcessor: this.#isSubProcessor,
            log: `node ${node.id} is NOT ready to process because prior nodes don't have outputs when fetching the node data`,
          });

          return;
        }
      }
      this.#queuedNodeIds.add(node.id);

      for (const inputNode of inputNodes) {
        await this.#emitter.emit('processInQueue', {
          processorId: this.#processorId,
          isSubProcessor: this.#isSubProcessor,
          node: inputNode,
        });
      }

      await this.#processNodeIfAllInputsAvailable(node);
    } catch (error) {
      await this.abort(false, error as Error);
    }
  }

  async #processNodeIfAllInputsAvailable(
    node: SerializableNode
  ): Promise<void> {
    try {
      // Check if the current node should be ignored
      if (this.#ignoreNodeIds.has(node.id)) {
        this.#emitter.emit('trace', {
          processorId: this.#processorId,
          isSubProcessor: this.#isSubProcessor,
          log: `node ${node.id} is ignored`,
        });

        return;
      }

      // Check if the current processor is processing the node
      if (this.#currProcessingNodeIds.has(node.id)) {
        this.#emitter.emit('trace', {
          processorId: this.#processorId,
          isSubProcessor: this.#isSubProcessor,
          log: `node ${node.id} is already processing`,
        });

        return;
      }

      // Check if the current node is visited
      if (this.#visitedNodeIds.has(node.id)) {
        this.#emitter.emit('trace', {
          processorId: this.#processorId,
          isSubProcessor: this.#isSubProcessor,
          log: `node ${node.id} is visited`,
        });

        return;
      }

      // Check if the current node is errored
      if (this.#nodeErrorMap.has(node.id)) {
        this.#emitter.emit('trace', {
          processorId: this.#processorId,
          isSubProcessor: this.#isSubProcessor,
          log: `node ${node.id} is errored`,
        });

        return;
      }

      const connections = this.#graph.nodeConnMap[node.id] ?? [];
      const inputNodeIds: RecordId[] = [];
      for (const input of this.#graph.nodePortDefMap[node.id]!.inputs) {
        const incomingConn = connections?.find(
          (conn) => conn.toPortName === input.name && conn.toNodeId === node.id
        );

        // Check if all required inputs have connections and is not from the input
        if (
          !incomingConn &&
          input.required &&
          !this.#graphInputs[input.nodeId]
        ) {
          this.#emitter.emit('trace', {
            processorId: this.#processorId,
            isSubProcessor: this.#isSubProcessor,
            log: `node ${node.id} is NOT ready to process because some required inputs are not connected`,
          });

          return;
        }

        if (!incomingConn || !input.required) {
          continue;
        }

        inputNodeIds.push(incomingConn.fromNodeId);
      }

      const inputNodes: SerializableNode[] = [...new Set(inputNodeIds)].map(
        (nId) => this.#graph.nodeMap[nId]
      );
      for (const inputNode of inputNodes) {
        const processorToRunInput: GraphProcessor =
          this._getProcessorForNode(inputNode);

        // Check if all input nodes are free of errors
        if (processorToRunInput.#nodeErrorMap.has(inputNode.id)) {
          this.#emitter.emit('trace', {
            processorId: this.#processorId,
            isSubProcessor: this.#isSubProcessor,
            log: `node ${node.id} is NOT ready to process because prior nodes have errors`,
          });

          return;
        }

        // Check if the required and connected input nodes has output
        if (
          !Object.prototype.hasOwnProperty.call(
            processorToRunInput.#graphInputs,
            inputNode.id
          ) &&
          !processorToRunInput.#nodeResults.has(inputNode.id)
        ) {
          this.#emitter.emit('trace', {
            processorId: this.#processorId,
            isSubProcessor: this.#isSubProcessor,
            log: `node ${node.id} is NOT ready to process because prior nodes don't have outputs`,
          });

          return;
        }
      }

      this.#emitter.emit('trace', {
        processorId: this.#processorId,
        isSubProcessor: this.#isSubProcessor,
        log: `node ${node.id} is ready to process`,
      });

      this.#currProcessingNodeIds.add(node.id);

      const processId = await this.#processNode(node);

      this.#visitedNodeIds.add(node.id);
      this.#currProcessingNodeIds.delete(node.id);
      this.#remainingNodeIds.delete(node.id);

      const outputNodes = this.#graph.getToNodes(node);

      this.#emitter.emit('trace', {
        processorId: this.#processorId,
        isSubProcessor: this.#isSubProcessor,
        log: `node ${node.id} has output nodes: ${outputNodes.map(
          (n) => n.id
        )}`,
      });

      for (const outputNode of outputNodes) {
        await this.#emitter.emit('processInQueue', {
          processorId: this.#processorId,
          isSubProcessor: this.#isSubProcessor,
          node: outputNode,
        });
      }
    } catch (error) {
      await this.abort(false, error as Error);
    }
  }

  async #processNode(node: SerializableNode): Promise<ProcessId> {
    const processId = getRecordId() as string as ProcessId;

    // Check if user is aborted
    if (this.#abortController.signal.aborted) {
      this.#throwProcessError(node, new Error('Processing aborted'), processId);
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

      this.#throwProcessError(node, error, processId);
      return processId;
    }

    if (node.type === 'input') {
      await this.#processInputNode(node as InputNode, processId);
    } else {
      await this.#processNormalNode(node, processId);
    }

    return processId;
  }

  async #processInputNode(node: InputNode, processId: ProcessId) {
    const inputValues = this.#getProcessInputForNode(node);

    this.#emitter.emit('trace', {
      processorId: this.#processorId,
      isSubProcessor: this.#isSubProcessor,
      log: `node ${node.id} start processing`,
    });

    this.#emitter.emit('nodeStart', {
      processorId: this.#processorId,
      isSubProcessor: this.#isSubProcessor,
      node,
      inputs: inputValues,
      processId,
    });

    try {
      const results = await new Promise<ProcessInputMap>((resolve, reject) => {
        this.#pendingUserInputsNodeIds[node.id] = {
          resolve,
          reject,
        };

        this.#abortController.signal.addEventListener('abort', () => {
          delete this.#pendingUserInputsNodeIds[node.id];
          reject(new Error('Processing aborted'));
        });

        this.#emitter.emit('trace', {
          processorId: this.#processorId,
          isSubProcessor: this.#isSubProcessor,
          log: `node ${node.id} is waiting for user's inputs`,
        });

        this.#emitter.emit('requireInput', {
          processorId: this.#processorId,
          isSubProcessor: this.#isSubProcessor,
          node,
          promptContext: inputValues,
          callback: (userInputs: ProcessInputMap) => {
            resolve(userInputs);

            this.#emitter.emit('trace', {
              processorId: this.#processorId,
              isSubProcessor: this.#isSubProcessor,
              log: `node ${node.id} is receiving user's inputs`,
            });

            delete this.#pendingUserInputsNodeIds[node.id];
          },
          processId,
        });
      });

      const outputValues: ProcessOutputMap =
        await this.#processNodeWithInputData(node, results, processId);

      this.#nodeResults.set(node.id, outputValues);
      this.#visitedNodeIds.add(node.id);

      this.#emitter.emit('trace', {
        processorId: this.#processorId,
        isSubProcessor: this.#isSubProcessor,
        log: `node ${node.id} finish processing`,
      });

      this.#emitter.emit('nodeFinish', {
        processorId: this.#processorId,
        isSubProcessor: this.#isSubProcessor,
        node,
        outputs: outputValues,
        processId,
      });
    } catch (error) {
      this.#throwProcessError(node, error as Error, processId);
    }
  }

  async #processNormalNode(node: SerializableNode, processId: ProcessId) {
    const inputValues: ProcessInputMap = this.#getProcessInputForNode(node);

    this.#emitter.emit('trace', {
      processorId: this.#processorId,
      isSubProcessor: this.#isSubProcessor,
      log: `node ${node.id} start processing`,
    });

    this.#emitter.emit('nodeStart', {
      processorId: this.#processorId,
      isSubProcessor: this.#isSubProcessor,
      node,
      inputs: inputValues,
      processId,
    });

    try {
      const outputValues: ProcessOutputMap =
        await this.#processNodeWithInputData(node, inputValues, processId);

      this.#nodeResults.set(node.id, outputValues);
      this.#visitedNodeIds.add(node.id);

      this.#emitter.emit('trace', {
        processorId: this.#processorId,
        isSubProcessor: this.#isSubProcessor,
        log: `node ${node.id} finish processing`,
      });

      this.#emitter.emit('nodeFinish', {
        processorId: this.#processorId,
        isSubProcessor: this.#isSubProcessor,
        node,
        outputs: outputValues,
        processId,
      });
    } catch (error) {
      this.#throwProcessError(node, error as Error, processId);
    }
  }

  async #processNodeWithInputData(
    node: SerializableNode,
    inputs: ProcessInputMap,
    processId: ProcessId
  ): Promise<ProcessOutputMap> {
    const nodeImpl = this.#graph.nodeImplMap[node.id]!;

    const nodeAbortController: AbortController = this.#initAbortController();
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

    await this.#waitUntilUnpaused();

    const start: number = performance.now();

    // Processing a single node
    const results: ProcessOutputMap = await nodeImpl.process(inputs, context);

    const end: number = performance.now();

    // runtime in seconds
    const runtime: number = (end - start) / 1000;

    // memory in megabytes
    const memory: number =
      Buffer.byteLength(JSON.stringify(results), 'utf8') / (1024 * 1024);

    this.#graph.nodeProcessInfoMap[node.id] = { runtime, memory };

    this.#emitter.emit('trace', {
      processorId: this.#processorId,
      isSubProcessor: this.#isSubProcessor,
      log: `node ${node.id} received processing result in ${runtime} seconds`,
    });

    this.#nodeAbortControllers.delete(`${node.id}-${processId}`);
    this.#abortController.signal.removeEventListener('abort', abortListener);

    if (nodeAbortController.signal.aborted) {
      throw new Error(`Node ${node.id} aborted`);
    }

    return results;
  }

  #getProcessInputForNode(node: SerializableNode): ProcessInputMap {
    const connections: NodeConnection[] | undefined =
      this.#graph.nodeConnMap[node.id];
    return this.#graph.nodePortDefMap[node.id]!.inputs.reduce(
      (values, input) => {
        const connection: NodeConnection | undefined = connections?.find(
          (conn) => conn.toNodeId === node.id && conn.toPortName === input.name
        );

        if (connection) {
          const outputNode: SerializableNode =
            this.#graph.nodeMap[connection.fromNodeId]!;

          const processorToRun: GraphProcessor =
            this._getProcessorForNode(outputNode);

          let outputResult: Data | undefined;
          if (processorToRun.#nodeResults.has(outputNode.id)) {
            const nodeOutputs: ProcessOutputMap | undefined =
              processorToRun.#nodeResults.get(outputNode.id);
            outputResult = nodeOutputs?.[connection.fromPortName];
          } else {
            // TODO: Get this from the global data rather than from the graph input
            const nodeInputs: ProcessInputMap | undefined =
              this.#graphInputs[node.id];
            outputResult = nodeInputs?.[input.name];
          }

          values[input.name] = outputResult;
        } else {
          const nodeInputs: ProcessInputMap | undefined =
            this.#graphInputs[node.id];
          const inputResult: Data | undefined = nodeInputs?.[input.name];

          values[input.name] = inputResult;
        }

        return values;
      },
      {} as Record<string, Data | undefined>
    );
  }

  #throwProcessError(
    node: SerializableNode,
    error: Error,
    processId: ProcessId
  ) {
    this.#emitter.emit('trace', {
      processorId: this.#processorId,
      isSubProcessor: this.#isSubProcessor,
      log: `node ${node.id} has error: ${error.toString()}`,
    });

    this.#emitter.emit('nodeError', {
      processorId: this.#processorId,
      isSubProcessor: this.#isSubProcessor,
      node,
      error,
      processId,
    });
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

    this.#nodeIdToProcessorIdMap = new Map();
    masterNodeIds.forEach((nId) => {
      this.#nodeIdToProcessorIdMap.set(nId, masterProcessorId);
    });

    // Distribute the following groups of nodes to workers
    group.forEach(([subProcessorId, subNodeIds]) => {
      for (const nId of subNodeIds) {
        this.#nodeIdToProcessorIdMap.set(nId, subProcessorId);
      }

      this.createSubProcessor(subProcessorId, subNodeIds);
    });
  }

  private _getProcessorForNode(node: SerializableNode): GraphProcessor {
    let nodeIdToProcessorIdMap: Map<RecordId, string>;
    if (this.#isSubProcessor) {
      if (!this.#parent) {
        throw new Error('CANNOT find parent in child');
      }

      nodeIdToProcessorIdMap = this.#parent.#nodeIdToProcessorIdMap;
    } else {
      nodeIdToProcessorIdMap = this.#nodeIdToProcessorIdMap;
    }

    if (!nodeIdToProcessorIdMap?.has(node.id)) {
      throw new Error(`CANNOT find node ${node.id} in the processor`);
    }

    for (const worker of [this, this.#parent, ...this.#children]) {
      if (!worker) {
        continue;
      }

      if (worker.#processorId !== nodeIdToProcessorIdMap.get(node.id)) {
        continue;
      }

      return worker;
    }

    throw new Error('CANNOT find child in parent');
  }
}

function _delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
