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
import { InputNode } from './nodes/utility/input.node.js';

/**
 * Represents a unique identifier for a process, ensuring type safety through
 * opacity.
 */
export type ProcessId = Opaque<string, 'ProcessId'>;

/**
 * Defines a map where each key is a string representing the input identifier,
 * and the value is a Data type or undefined, allowing for partial or incomplete
 * data specifications.
 */
export type ProcessInputMap = Record<string, Data | undefined>;

/**
 * Defines a map where each key is a string representing the output identifier,
 * and the value is a Data type or undefined, allowing for partial or incomplete
 * data specifications.
 */
export type ProcessOutputMap = Record<string, Data | undefined>;

/**
 * Defines an union of process input map and process output map.
 */
export type ProcessDataMap = ProcessInputMap | ProcessOutputMap;

/**
 * A map that associates each node (by its RecordId) with its respective output data,
 * following the execution of the node.
 */
export type NodeResults = Map<RecordId, ProcessOutputMap>;

/**
 * Collections that store the inputs for a graph keyed by node RecordId,
 * facilitating the management of data flow between nodes within the graph.
 */
export type GraphInputs = Record<RecordId, ProcessInputMap>;

/**
 * Collections that store the outputs for a graph keyed by node RecordId,
 * facilitating the management of data flow between nodes within the graph.
 */
export type GraphOutputs = Record<RecordId, ProcessOutputMap>;

// export type AttachedNodeDataItem = {
//   propagate:
//     | boolean
//     | ((parent: SerializableNode, connections: NodeConnection[]) => boolean);
// };

// export type AttachedNodeData = {
//   [key: string]: AttachedNodeDataItem | undefined;
// };

/**
 * Contains all relevant context needed for processing a node or graph. This includes
 * identifiers, state signals, and contextual data necessary for execution control.
 */
export type ProcessContext = {
  /**
   * A unique identifier for the current process instance. This ID is used to track the
   * process throughout its lifecycle.
   */
  processId?: ProcessId;

  /**
   * An instance of `AbortSignal` used to handle cancellation of the process. This allows
   * external consumers to request that the process stop execution.
   */
  signal?: AbortSignal;

  /**
   * Arbitrary data relevant to the process's execution context, typically used to pass
   * runtime values that are necessary for node computation.
   */
  contextData?: Record<string, Data>;

  /**
   * Inputs for the graph being processed, mapping each node's RecordId to its respective input data.
   * This property is typically set at the start of the graph processing to initialize node data.
   */
  graphInputs?: GraphInputs;

  /**
   * Outputs for the graph, populated as nodes within the graph are processed and their results computed.
   * This aggregates the results of individual nodes for use in subsequent processing or for final output.
   */
  graphOutputs?: GraphOutputs;

  /**
   * The current node being processed. This is particularly useful in context-specific operations
   * where node-specific data or actions are necessary.
   */
  node?: SerializableNode;

  /**
   * A memory space for storing intermediate states or results that are needed across different stages
   * of the graph processing. This helps in maintaining state within a stateless processing environment.
   * The CallOption of the CallableNodes are stored in the memory space.
   */
  memory?: Record<RecordId, unknown>;

  /**
   * A method provided to abort the graph processing, optionally passing an error message or object.
   * This can be used to terminate the process prematurely in case of errors or other conditions.
   */
  abortGraph?: (error?: Error | string) => void;
};

/**
 * A comprehensive list of events that can be emitted during the lifecycle of graph
 * and node processing. These events help in monitoring, debugging, and managing the
 * execution flow.
 *
 * @interface
 */
export type ProcessEvents = {
  /**
   * Fired at the start of the processing, marking the initialization of the processor.
   *
   * @interface
   */
  start: {
    /**
     * The ID of the processor.
     */
    processorId: string;

    /**
     * Whether the processor is a sub-processor.
     */
    isSubProcessor: boolean;

    /**
     * The graph being processed.
     */
    graph: BaseGraph;

    /**
     * Initial graph inputs.
     */
    inputs: GraphInputs;

    /**
     * Any contextual values.
     */
    contextValues: Record<string, Data>;
  };

  /**
   * Emitted when a node is added to the processing queue,
   * indicating that it's ready to be processed.
   *
   * @interface
   */
  processInQueue: {
    /**
     * The ID of the processor.
     */
    processorId: string;

    /**
     * Whether the processor is a sub-processor.
     */
    isSubProcessor: boolean;

    /**
     * The node that has been queued for processing.
     */
    node: SerializableNode;
  };

  /**
   * Emitted when the processing is paused.
   *
   * @interface
   */
  pause: {
    /**
     * The ID of the processor.
     */
    processorId: string;

    /**
     * Whether the processor is a sub-processor.
     */
    isSubProcessor: boolean;
  };

  /**
   * Emitted when the processing is resumed.
   *
   * @interface
   */
  resume: {
    /**
     * The ID of the processor.
     */
    processorId: string;

    /**
     * Whether the processor is a sub-processor.
     */
    isSubProcessor: boolean;
  };

  /**
   * Emitted when the processing is finished.
   * The processing can be finished bacause of errors.
   *
   * @interface
   */
  finish: {
    /**
     * The ID of the processor.
     */
    processorId: string;

    /**
     * Whether the processor is a sub-processor.
     */
    isSubProcessor: boolean;
  };

  /**
   * Emitted when the processing is completed with results.
   * The processing is completed without error.
   *
   * @interface
   */
  done: {
    /**
     * The ID of the processor.
     */
    processorId: string;

    /**
     * Whether the processor is a sub-processor.
     */
    isSubProcessor: boolean;

    /**
     * The final outputs from the graph processing.
     */
    results: GraphOutputs;
  };

  /**
   * Emitted when the processing is aborted. This event indicates whether the abortion was successful
   * and may include an error if the process was terminated due to an issue.
   *
   * @interface
   */
  abort: {
    /**
     * The ID of the processor.
     */
    processorId: string;

    /**
     * Whether the processor is a sub-processor.
     */
    isSubProcessor: boolean;

    /**
     * Whether the abort action was successful.
     */
    success: boolean;

    /**
     * Error if the process was terminated due to an error.
     */
    error?: string | Error;
  };

  /**
   * Emitted when an error occurs during the processing.
   * This event provides details about the error.
   *
   * @interface
   */
  error: {
    /**
     * The ID of the processor.
     */
    processorId: string;

    /**
     * Whether the processor is a sub-processor.
     */
    isSubProcessor: boolean;

    /**
     * The error object or string describing the error that occurred.
     */
    error: string | Error;
  };

  /**
   * Emitted when a graph starts processing. It includes details about the graph and the initial inputs.
   *
   * @interface
   */
  graphStart: {
    /**
     * The ID of the processor.
     */
    processorId: string;

    /**
     * Whether the processor is a sub-processor.
     */
    isSubProcessor: boolean;

    /**
     * The graph that has started processing.
     */
    graph: BaseGraph;

    /**
     * The initial inputs provided to the graph.
     */
    inputs: GraphInputs;
  };

  /**
   * Emitted when an error occurs within a graph during its execution.
   *
   * @interface
   */
  graphError: {
    /**
     * The ID of the processor.
     */
    processorId: string;

    /**
     * Whether the processor is a sub-processor.
     */
    isSubProcessor: boolean;

    /**
     * The graph in which the error occurred.
     */
    graph: BaseGraph;

    /**
     * The error encountered during the graph's execution.
     */
    error: string | Error;
  };

  /**
   * Emitted when a graph or subgraph completes its processing, providing the final outputs.
   *
   * @interface
   */
  graphFinish: {
    /**
     * The ID of the processor.
     */
    processorId: string;

    /**
     * Whether the processor is a sub-processor.
     */
    isSubProcessor: boolean;

    /**
     * The graph that has finished processing.
     */
    graph: BaseGraph;

    /**
     * The outputs generated by the graph.
     */
    outputs: GraphOutputs;
  };

  /**
   * Emitted when the processing of a graph is aborted, optionally including an error.
   *
   * @interface
   */
  graphAbort: {
    /**
     * The ID of the processor.
     */
    processorId: string;

    /**
     * Whether the processor is a sub-processor.
     */
    isSubProcessor: boolean;

    /**
     * The graph that was aborted.
     */
    graph: BaseGraph;

    /**
     * Indicates if the abort was successful.
     */
    success: boolean;

    /**
     * Optional error if the abort was due to an error.
     */
    error?: string | Error;
  };

  /**
   * Emitted when a node starts processing. It includes details about the node and the node inputs.
   *
   * @interface
   */
  nodeStart: {
    /**
     * The ID of the processor.
     */
    processorId: string;

    /**
     * Whether the processor is a sub-processor.
     */
    isSubProcessor: boolean;

    /**
     * The node that has started processing.
     */
    node: SerializableNode;

    /**
     * The node input map to each input port.
     */
    inputs: ProcessInputMap;

    /**
     * The Process ID of the node processing.
     */
    processId: ProcessId;
  };

  /**
   * Emitted when a node completes its processing, providing the node outputs.
   *
   * @interface
   */
  nodeFinish: {
    /**
     * The ID of the processor.
     */
    processorId: string;

    /**
     * Whether the processor is a sub-processor.
     */
    isSubProcessor: boolean;

    /**
     * The node that has finished processing.
     */
    node: SerializableNode;

    /**
     * The node output map to each output port.
     */
    outputs: ProcessOutputMap;

    /**
     * The Process ID of the node processing.
     */
    processId: ProcessId;
  };

  /**
   * Emitted when an error occurs within a node during its processing.
   *
   * @interface
   */
  nodeError: {
    /**
     * The ID of the processor.
     */
    processorId: string;

    /**
     * Whether the processor is a sub-processor.
     */
    isSubProcessor: boolean;

    /**
     * The node in which the error occurred.
     */
    node: SerializableNode;

    /**
     * The error encountered during the node's processing.
     */
    error: Error;

    /**
     * The Process ID of the node processing.
     */
    processId: ProcessId;
  };

  /**
   * Emitted when a node's processing is excluded by external events.
   *
   * @interface
   */
  nodeExcluded: {
    /**
     * The ID of the processor.
     */
    processorId: string;

    /**
     * Whether the processor is a sub-processor.
     */
    isSubProcessor: boolean;

    /**
     * The node that is excluded its processing.
     */
    node: SerializableNode;
  };

  /**
   * Emitted when a new AbortController is created within the processing context,
   * allowing for finer control over abort operations.
   *
   * In default, a new AbortController to a node is created before its processing.
   *
   * @interface
   */
  newAbortController: {
    /**
     * The ID of the processor.
     */
    processorId: string;

    /**
     * Whether the processor is a sub-processor.
     */
    isSubProcessor: boolean;

    /**
     * The newly created AbortController instance.
     */
    controller: AbortController;
  };

  /**
   * Emitted when an InputNode within the graph requires user input to continue processing.
   * This event includes context for prompting the user and a callback to handle the response.
   *
   * @interface
   */
  requireInput: {
    /**
     * The ID of the processor.
     */
    processorId: string;

    /**
     * Whether the processor is a sub-processor.
     */
    isSubProcessor: boolean;

    /**
     * The InputNode requiring the user input.
     */
    node: InputNode;

    /**
     * The context provided to prompt the user for input.
     */
    promptContext: ProcessOutputMap;

    /**
     * A function to call with the user's input to continue processing.
     * @param userInputs The input map that should follow the output ports of the InputNode.
     */
    callback: (userInputs: ProcessInputMap) => void;

    /**
     * The Process ID of the node processing.
     */
    processId: ProcessId;
  };

  /**
   * Emitted for logging trace-level details about the processing.
   * Useful for debugging and monitoring the internal state and steps of processing.
   *
   * @interface
   */
  trace: {
    /**
     * The ID of the processor.
     */
    processorId: string;

    /**
     * Whether the processor is a sub-processor.
     */
    isSubProcessor: boolean;

    /**
     * The trace log message.
     */
    log: string;
  };
};

/**
 * A utility type that helps in defining the structure of an event object where the type of the event
 * is determined by the key, and the structure of the event data is defined within ProcessEvents.
 */
export type ProcessEvent = {
  [P in keyof ProcessEvents]: { '#type': P } & ProcessEvents[P];
}[keyof ProcessEvents];

/**
 * Represents a processor for managing the execution and lifecycle of nodes within a graph.
 * This class provides functionalities such as starting, pausing, resuming, and aborting the process,
 * as well as handling user inputs and emitting various events related to the process states.
 */
export class GraphProcessor {
  /**
   * Represents the graph being processed. This property holds the entire structure of the graph
   * including its nodes and connections, facilitating the management and execution of the graph.
   *
   * @internal
   */
  readonly #graph: BaseGraph;

  /**
   * An event emitter used for managing various events that occur during the processing of the graph.
   * This includes starting, pausing, resuming, and aborting the process, along with node-specific events.
   *
   * @internal
   */
  readonly #emitter: Emittery<ProcessEvents> = new Emittery();

  /**
   * Unique identifier for the processor instance. This ID helps in distinguishing between different
   * processors, especially when there are multiple sub-processors involved in processing parts of the graph.
   *
   * @internal
   */
  #processorId: string;

  /**
   * Stores inputs provided to the graph at the start of the processing. These inputs are used
   * to feed the initial nodes of the graph that require external data to begin processing.
   *
   * @internal
   */
  #graphInputs: GraphInputs = undefined!;

  /**
   * Holds the outputs generated from the graph processing. This map is populated as nodes within
   * the graph complete their processing, storing their results for further use or for final outputs.
   *
   * @internal
   */
  #graphOutputs: GraphOutputs = undefined!;

  /**
   * Provides context for the processing, such as cancellation signals and any additional data
   * required by nodes during processing. This context is vital for managing the execution state
   * and behavior across different parts of the graph.
   *
   * @internal
   */
  #context: ProcessContext = undefined!;

  /**
   * A collection of additional values that might be used across various nodes within the graph.
   * These values can include configurations or any supplementary data that nodes need to function.
   *
   * @internal
   */
  #contextValues: Record<string, Data> = undefined!;

  // #attachedNodeData: Map<RecordId, AttachedNodeData> = undefined!;

  /**
   * A map that stores the outputs of each processed node. This is essential for nodes whose outputs
   * are inputs to other nodes, ensuring that data flows correctly through the graph.
   *
   * @internal
   */
  #nodeResults: NodeResults = undefined!;

  /**
   * A cache for storing results or stateful data during graph execution, allowing for optimizations
   * such as memoization or storing intermediate results that can be reused.
   *
   * @internal
   */
  #executionCache: Map<string, unknown> = undefined!;

  /**
   * Manages the queue of nodes waiting to be processed. This queue helps in scheduling nodes based on
   * their readiness to be processed, ensuring that nodes are processed in the correct order.
   *
   * @internal
   */
  #processingQueue: PQueue = undefined!;

  /**
   * The primary abort controller for the graph processing, used to trigger an abort from external
   * sources or internally in case of errors or other conditions that require stopping the graph processing.
   *
   * @internal
   */
  #abortController: AbortController = undefined!;

  /**
   * Maps node and process identifiers to their respective abort controllers, allowing individual cancellation
   * of node processes without affecting the entire graph processing.
   *
   * @internal
   */
  #nodeAbortControllers = new Map<
    `${RecordId}-${ProcessId}`,
    AbortController
  >();

  /**
   * Tracks errors that occur at the node level, allowing the processor to handle errors appropriately
   * and potentially continue processing other parts of the graph if possible.
   *
   * @internal
   */
  #nodeErrorMap: Map<RecordId, string> = undefined!;

  /**
   * A set of node IDs that remain to be processed. This helps in tracking the progress of graph processing
   * and managing the workflow of nodes as they move through various stages of execution.
   *
   * @internal
   */
  #remainingNodeIds: Set<RecordId> = undefined!;

  /**
   * Keeps track of all node IDs that have been visited during the processing. This is used to prevent
   * reprocessing of nodes and to manage dependencies and execution order within the graph.
   *
   * @internal
   */
  #visitedNodeIds: Set<RecordId> = undefined!;

  /**
   * Nodes that should be ignored during processing, typically because they are either not needed
   * for the particular processing instance or because they have been disabled or conditionally excluded.
   *
   * @internal
   */
  #ignoreNodeIds: Set<RecordId> = undefined!;

  /**
   * Tracks the IDs of nodes currently being processed. This is crucial for managing concurrency
   * and ensuring that nodes do not start processing before all their dependencies are resolved.
   *
   * @internal
   */
  #currProcessingNodeIds: Set<RecordId> = undefined!;

  /**
   * Stores the IDs of nodes that are queued for processing. This helps in managing the flow of node
   * execution and ensuring that nodes are ready to process as soon as their prerequisites are met.
   *
   * @internal
   */
  #queuedNodeIds: Set<RecordId> = undefined!;

  /**
   * A reference to the parent processor if this processor is a sub-processor. This allows sub-processors
   * to communicate and synchronize with the main processor, especially useful in distributed or hierarchical
   * processing scenarios.
   *
   * @internal
   */
  #parent: GraphProcessor | undefined;

  /**
   * A set of child processors, if this processor has spawned sub-processors. This allows the main processor
   * to manage and coordinate the activities of its children, facilitating complex graph processing scenarios
   * that involve parallelism or segmentation of the graph.
   *
   * @internal
   */
  #children: Set<GraphProcessor> = undefined!;

  /**
   * Indicates whether this processor is a sub-processor. This is used to differentiate the behavior
   * and responsibilities of processors, especially in managing events and handling state specific to sub-processing.
   *
   * @internal
   */
  #isSubProcessor = false;

  /**
   * Indicates whether the graph is currently being processed. This state is crucial for managing controls
   * like pause, resume, and abort, and for ensuring that operations like start or stop are only performed
   * when appropriate.
   *
   * @internal
   */
  #isRunning = false;

  /**
   * Indicates whether the processing is currently paused. This allows the processor to temporarily halt
   * processing and resume it later, which is useful for scenarios requiring user interaction or awaiting external data.
   *
   * @internal
   */
  #isPaused = false;

  /**
   * Indicates whether the processing has been aborted. This flag helps in managing cleanup and finalization
   * tasks when processing is stopped prematurely.
   *
   * @internal
   */
  #isAborted = false;

  /**
   * Indicates whether the abort was successful. This is important for understanding the state of the graph
   * post-abort and for deciding subsequent actions or error handling.
   *
   * @internal
   */
  #isAbortedSuccess = false;

  /**
   * Stores any error that might have caused the processing to abort. This is crucial for error handling
   * and for providing context to the user or to downstream systems about why processing was stopped.
   *
   * @internal
   */
  #abortError: Error | string | undefined = undefined;

  /**
   * Lists the node IDs that this processor is responsible for running. This is particularly useful in distributed
   * processing where different processors might be responsible for different parts of the graph.
   *
   * @internal
   */
  #nodeIdsToRun: RecordId[];

  /**
   * Maps node IDs to processor IDs, helping in distributing nodes to appropriate processors,
   * especially in complex graphs where nodes might be processed in parallel or on different processors.
   *
   * @internal
   */
  #nodeIdToProcessorIdMap: Map<RecordId, string> = undefined!;

  /**
   * Stores pending user inputs for nodes. When a node requires user interaction, this map holds the promises
   * that resolve when the user provides the needed input, ensuring that the node can proceed with the provided data.
   *
   * @internal
   */
  #pendingUserInputsNodeIds: Record<
    RecordId,
    {
      resolve: (inputs: ProcessInputMap) => void;
      reject: (error: unknown) => void;
    }
  > = undefined!;

  /**
   * Indicates whether the graph is currently being processed.
   */
  get isRunning() {
    return this.#isRunning;
  }

  /**
   * Initializes the processing state and prepares the graph for execution.
   * This method should be called before any processing starts.
   */
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

  /**
   * Initializes a new AbortController for managing abort signals within graph processing.
   * This controller allows for fine-grained control over aborting ongoing processes, either globally or individually.
   *
   * @returns An instance of AbortController.
   * @internal
   */
  #initAbortController() {
    const controller = new AbortController();
    this.#emitter.emit('newAbortController', {
      processorId: this.#processorId,
      isSubProcessor: this.#isSubProcessor,
      controller: controller,
    });

    return controller;
  }

  /**
   * Initializes a new instance of the GraphProcessor class.
   *
   * @param graph The graph to be processed.
   * @param subProcessor Optional parameters for initializing a sub-processor.
   */
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

  /**
   * Subscribes to necessary internal events to manage the processing flow and error handling.
   */
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

  /**
   * Attaches an event listener to the specified event.
   * @param eventName The event name to listen for.
   * @param listener The function to call when the event is emitted.
   */
  on = undefined! as Emittery<ProcessEvents>['on'];

  /**
   * Detaches an event listener from the specified event.
   * @param eventName The event name to stop listening to.
   * @param listener The function that was attached earlier.
   */
  off = undefined! as Emittery<ProcessEvents>['off'];

  /**
   * Attaches a one-time event listener that automatically detaches after it runs.
   * @param eventName The event name to listen for once.
   * @param listener The function to call when the event is emitted.
   */
  once = undefined! as Emittery<ProcessEvents>['once'];

  /**
   * Attaches an event listener that triggers for any event.
   * @param listener The function to call when any event is emitted.
   */
  onAny = undefined! as Emittery<ProcessEvents>['onAny'];

  /**
   * Detaches an 'any event' listener.
   * @param listener The function that was attached earlier.
   */
  offAny = undefined! as Emittery<ProcessEvents>['offAny'];

  /**
   * Aborts the current graph processing.
   * This method stops all ongoing processes and emits an abort event.
   *
   * @param success Indicates whether the abort is considered successful.
   * @param error Optional error that might have triggered the abort.
   */
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

  /**
   * Pauses the graph processing. This can be resumed later.
   */
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

  /**
   * Resumes the graph processing if it was previously paused.
   */
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

  /**
   * Processes user inputs for an interactive node during the graph execution.
   * This method is typically called in response to an input request from a node that
   * requires user interaction.
   *
   * @param nodeId The ID of the InputNode requiring user input.
   * @param inputs The inputs provided by the user.
   */
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

  /**
   * Waits until the graph processing is resumed if it is currently paused.
   * This method ensures that the processing does not continue while in a paused state.
   * It listens for the 'resume' event and will resume operation only once the event is
   * emitted, indicating that the processing has been resumed.
   *
   * @internal
   */
  async #waitUntilUnpaused(): Promise<void> {
    if (!this.#isPaused) {
      return;
    }

    await this.#emitter.once('resume');
  }

  /**
   * Continuously yields events from the processor as they occur.
   * This generator allows consumers to react to events in real-time during the graph processing.
   *
   * @returns An asynchronous generator yielding processing events.
   */
  async *events(): AsyncGenerator<ProcessEvent> {
    for await (const [event, data] of this.#emitter.anyEvent()) {
      yield { '#type': event, ...(data as any) };

      if (event === 'finish') {
        break;
      }
    }
  }

  /**
   * Creates a sub-processor for handling a subset of nodes within the graph.
   * This is used for distributed or parallel processing.
   * @param processorId The identifier for the new sub-processor.
   * @param subNodeIds Array of node IDs that the sub-processor will handle.
   * @param options Additional options such as the AbortSignal for coordinating abort behavior across processors.
   * @returns An instance of GraphProcessor configured as a sub-processor.
   */
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

  /**
   * Initiates the processing of the graph with the provided inputs and context.
   * Manages the entire lifecycle of the graph processing.
   * @param inputs Initial inputs to the graph nodes.
   * @param context Additional context needed for node processing.
   * @param contextValues Supplementary values that can be accessed by nodes during processing.
   * @returns A promise that resolves to the outputs from the graph processing.
   */
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

  /**
   * Retrieves data for a specific node and processes it if all conditions are met (e.g., all inputs are available and valid).
   * This method is typically called internally as part of the node processing pipeline.
   * @param node The node to fetch data for and process.
   *
   * @internal
   */
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

  /**
   * Processes a node if all required inputs are available, handling dependencies and
   * ensuring that node execution order is respected.
   * @param node The node to process.
   *
   * @internal
   */
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

  /**
   * The core method for processing a single node within the graph.
   * Manages the execution of node-specific logic.
   * @param node The node to be processed.
   * @returns A promise that resolves to the process identifier.
   *
   * @internal
   */
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

  /**
   * Processes an input node which requires external user inputs.
   * Manages the collection of user inputs and processes the node with them.
   * @param node The input node to process.
   * @param processId The identifier for the ongoing process.
   *
   * @internal
   */
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

  /**
   * Processes a normal node that does not require external inputs.
   * Handles the standard node processing based on internal logic and connections.
   * @param node The node to process.
   * @param processId The identifier for the ongoing process.
   *
   * @internal
   */
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

  /**
   * Processes a node with the specified input data. Handles the execution of the node's
   * logic based on the provided inputs.
   * @param node The node to process.
   * @param inputs The input data for the node.
   * @param processId The identifier for the ongoing process.
   * @returns A promise that resolves to the outputs of the node.
   *
   * @internal
   */
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

  /**
   * Retrieves the inputs for a node based on the current graph state and connections.
   * This method aggregates inputs from connected nodes or initial graph inputs.
   * @param node The node for which inputs are required.
   * @returns A map of input names to their corresponding data.
   *
   * @internal
   */
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

  /**
   * Emits an error event for a node and records the error in the processor's state.
   * This is used to handle and log errors that occur during node processing.
   * @param node The node that encountered an error.
   * @param error The error that occurred.
   * @param processId The identifier for the ongoing process.
   *
   * @internal
   */
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

  /**
   * Distributes nodes among different processors, including sub-processors.
   * This method is used to balance the load and optimize parallel processing.
   *
   * @internal
   */
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

  /**
   * Retrieves the appropriate processor for a given node, considering whether the node
   * should be handled by this processor or a sub-processor.
   * @param node The node for which the processor needs to be determined.
   * @returns The processor responsible for handling the node.
   *
   * @internal
   */
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
 * Validates the provided process data against the specified port fields.
 * This function checks if all required port fields are present in the process data and if their data types match the expected types defined in the port fields.
 * It returns `true` if all conditions are met, otherwise `false`.
 *
 * @param processData - A map of process data, where keys are port names and values are the data associated with those ports.
 * @param portFields - A map defining the expected data types for each port.
 * @returns `true` if all port data is valid according to its definition in `portFields`, otherwise `false`.
 *
 * @example
 * // Define process data and port fields
 * const processData = {
 *   "input1": { type: "number", value: 42 },
 *   "input2": { type: "string", value: "hello" }
 * };
 * const portFields = {
 *   "input1": "number",
 *   "input2": "string"
 * };
 *
 * // Validate process data
 * const isValid = validateProcessDataFromPorts(processData, portFields);
 * console.log(isValid); // Output: true
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

/**
 * Validates a single piece of process data against a specified data type or an array of data types.
 * It checks whether the type of the provided data matches any of the acceptable data types.
 *
 * @param processData - The process data to validate. This could be undefined, in which case the function checks if 'unknown' is a valid type.
 * @param dataType - The expected data type or an array of expected data types. The process data must match one of these types to be considered valid.
 * @returns `true` if the data is of an expected type or if both the data and expected types are undefined; otherwise, `false`.
 *
 * @example
 * // Validate a single data entry against multiple acceptable types
 * const data = { type: "string", value: "example" };
 * const validTypes = ["string", "text"];
 *
 * // Check if the data type is valid
 * const isValid = validateProcessData(data, validTypes);
 * console.log(isValid); // Output: true
 */
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
