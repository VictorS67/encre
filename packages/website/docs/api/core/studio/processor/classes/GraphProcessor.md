# Class: GraphProcessor

Represents a processor for managing the execution and lifecycle of nodes within a graph.
This class provides functionalities such as starting, pausing, resuming, and aborting the process,
as well as handling user inputs and emitting various events related to the process states.

## Constructors

### new GraphProcessor()

> **new GraphProcessor**(`graph`, `subProcessor`?): [`GraphProcessor`](GraphProcessor.md)

Initializes a new instance of the GraphProcessor class.

#### Parameters

• **graph**: [`BaseGraph`](../../graph/classes/BaseGraph.md)

The graph to be processed.

• **subProcessor?**

Optional parameters for initializing a sub-processor.

• **subProcessor.nodeIds?**: `RecordId`[]

• **subProcessor.processorId?**: `string`

#### Returns

[`GraphProcessor`](GraphProcessor.md)

#### Source

[packages/core/src/studio/processor.ts:959](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L959)

## Properties

### #abortController

`Internal`

> `private` **#abortController**: `AbortController`

The primary abort controller for the graph processing, used to trigger an abort from external
sources or internally in case of errors or other conditions that require stopping the graph processing.

#### Source

[packages/core/src/studio/processor.ts:736](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L736)

***

### #abortError

`Internal`

> `private` **#abortError**: `undefined` \| `string` \| `Error` = `undefined`

Stores any error that might have caused the processing to abort. This is crucial for error handling
and for providing context to the user or to downstream systems about why processing was stopped.

#### Source

[packages/core/src/studio/processor.ts:862](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L862)

***

### #children

`Internal`

> `private` **#children**: `Set` \<[`GraphProcessor`](GraphProcessor.md)\>

A set of child processors, if this processor has spawned sub-processors. This allows the main processor
to manage and coordinate the activities of its children, facilitating complex graph processing scenarios
that involve parallelism or segmentation of the graph.

#### Source

[packages/core/src/studio/processor.ts:813](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L813)

***

### #context

`Internal`

> `private` **#context**: [`ProcessContext`](../type-aliases/ProcessContext.md)

Provides context for the processing, such as cancellation signals and any additional data
required by nodes during processing. This context is vital for managing the execution state
and behavior across different parts of the graph.

#### Source

[packages/core/src/studio/processor.ts:694](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L694)

***

### #contextValues

`Internal`

> `private` **#contextValues**: `Record`\<`string`, [`Data`](../../data/type-aliases/Data.md)\>

A collection of additional values that might be used across various nodes within the graph.
These values can include configurations or any supplementary data that nodes need to function.

#### Source

[packages/core/src/studio/processor.ts:702](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L702)

***

### #currProcessingNodeIds

`Internal`

> `private` **#currProcessingNodeIds**: `Set`\<`RecordId`\>

Tracks the IDs of nodes currently being processed. This is crucial for managing concurrency
and ensuring that nodes do not start processing before all their dependencies are resolved.

#### Source

[packages/core/src/studio/processor.ts:787](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L787)

***

### #emitter

`Internal`

> `private` `readonly` **#emitter**: `default` \<[`ProcessEvents`](../interfaces/ProcessEvents.md), [`ProcessEvents`](../interfaces/ProcessEvents.md) & `OmnipresentEventData`, `never`\>

An event emitter used for managing various events that occur during the processing of the graph.
This includes starting, pausing, resuming, and aborting the process, along with node-specific events.

#### Source

[packages/core/src/studio/processor.ts:661](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L661)

***

### #executionCache

`Internal`

> `private` **#executionCache**: `Map`\<`string`, `unknown`\>

A cache for storing results or stateful data during graph execution, allowing for optimizations
such as memoization or storing intermediate results that can be reused.

#### Source

[packages/core/src/studio/processor.ts:720](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L720)

***

### #graph

`Internal`

> `private` `readonly` **#graph**: [`BaseGraph`](../../graph/classes/BaseGraph.md)

Represents the graph being processed. This property holds the entire structure of the graph
including its nodes and connections, facilitating the management and execution of the graph.

#### Source

[packages/core/src/studio/processor.ts:653](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L653)

***

### #graphInputs

`Internal`

> `private` **#graphInputs**: [`GraphInputs`](../type-aliases/GraphInputs.md)

Stores inputs provided to the graph at the start of the processing. These inputs are used
to feed the initial nodes of the graph that require external data to begin processing.

#### Source

[packages/core/src/studio/processor.ts:677](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L677)

***

### #graphOutputs

`Internal`

> `private` **#graphOutputs**: [`GraphOutputs`](../type-aliases/GraphOutputs.md)

Holds the outputs generated from the graph processing. This map is populated as nodes within
the graph complete their processing, storing their results for further use or for final outputs.

#### Source

[packages/core/src/studio/processor.ts:685](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L685)

***

### #ignoreNodeIds

`Internal`

> `private` **#ignoreNodeIds**: `Set`\<`RecordId`\>

Nodes that should be ignored during processing, typically because they are either not needed
for the particular processing instance or because they have been disabled or conditionally excluded.

#### Source

[packages/core/src/studio/processor.ts:779](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L779)

***

### #isAborted

`Internal`

> `private` **#isAborted**: `boolean` = `false`

Indicates whether the processing has been aborted. This flag helps in managing cleanup and finalization
tasks when processing is stopped prematurely.

#### Source

[packages/core/src/studio/processor.ts:846](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L846)

***

### #isAbortedSuccess

`Internal`

> `private` **#isAbortedSuccess**: `boolean` = `false`

Indicates whether the abort was successful. This is important for understanding the state of the graph
post-abort and for deciding subsequent actions or error handling.

#### Source

[packages/core/src/studio/processor.ts:854](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L854)

***

### #isPaused

`Internal`

> `private` **#isPaused**: `boolean` = `false`

Indicates whether the processing is currently paused. This allows the processor to temporarily halt
processing and resume it later, which is useful for scenarios requiring user interaction or awaiting external data.

#### Source

[packages/core/src/studio/processor.ts:838](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L838)

***

### #isRunning

`Internal`

> `private` **#isRunning**: `boolean` = `false`

Indicates whether the graph is currently being processed. This state is crucial for managing controls
like pause, resume, and abort, and for ensuring that operations like start or stop are only performed
when appropriate.

#### Source

[packages/core/src/studio/processor.ts:830](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L830)

***

### #isSubProcessor

`Internal`

> `private` **#isSubProcessor**: `boolean` = `false`

Indicates whether this processor is a sub-processor. This is used to differentiate the behavior
and responsibilities of processors, especially in managing events and handling state specific to sub-processing.

#### Source

[packages/core/src/studio/processor.ts:821](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L821)

***

### #nodeAbortControllers

`Internal`

> `private` **#nodeAbortControllers**: `Map`\<\`$\{RecordId\}-$\{ProcessId\}\`, `AbortController`\>

Maps node and process identifiers to their respective abort controllers, allowing individual cancellation
of node processes without affecting the entire graph processing.

#### Source

[packages/core/src/studio/processor.ts:744](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L744)

***

### #nodeErrorMap

`Internal`

> `private` **#nodeErrorMap**: `Map`\<`RecordId`, `string`\>

Tracks errors that occur at the node level, allowing the processor to handle errors appropriately
and potentially continue processing other parts of the graph if possible.

#### Source

[packages/core/src/studio/processor.ts:755](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L755)

***

### #nodeIdToProcessorIdMap

`Internal`

> `private` **#nodeIdToProcessorIdMap**: `Map`\<`RecordId`, `string`\>

Maps node IDs to processor IDs, helping in distributing nodes to appropriate processors,
especially in complex graphs where nodes might be processed in parallel or on different processors.

#### Source

[packages/core/src/studio/processor.ts:878](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L878)

***

### #nodeIdsToRun

`Internal`

> `private` **#nodeIdsToRun**: `RecordId`[]

Lists the node IDs that this processor is responsible for running. This is particularly useful in distributed
processing where different processors might be responsible for different parts of the graph.

#### Source

[packages/core/src/studio/processor.ts:870](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L870)

***

### #nodeResults

`Internal`

> `private` **#nodeResults**: [`NodeResults`](../type-aliases/NodeResults.md)

A map that stores the outputs of each processed node. This is essential for nodes whose outputs
are inputs to other nodes, ensuring that data flows correctly through the graph.

#### Source

[packages/core/src/studio/processor.ts:712](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L712)

***

### #parent

`Internal`

> `private` **#parent**: `undefined` \| [`GraphProcessor`](GraphProcessor.md)

A reference to the parent processor if this processor is a sub-processor. This allows sub-processors
to communicate and synchronize with the main processor, especially useful in distributed or hierarchical
processing scenarios.

#### Source

[packages/core/src/studio/processor.ts:804](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L804)

***

### #pendingUserInputsNodeIds

`Internal`

> `private` **#pendingUserInputsNodeIds**: `Record`\<`RecordId`, `object`\>

Stores pending user inputs for nodes. When a node requires user interaction, this map holds the promises
that resolve when the user provides the needed input, ensuring that the node can proceed with the provided data.

#### Source

[packages/core/src/studio/processor.ts:886](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L886)

***

### #processingQueue

`Internal`

> `private` **#processingQueue**: `default`\<`default`, `QueueAddOptions`\>

Manages the queue of nodes waiting to be processed. This queue helps in scheduling nodes based on
their readiness to be processed, ensuring that nodes are processed in the correct order.

#### Source

[packages/core/src/studio/processor.ts:728](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L728)

***

### #processorId

`Internal`

> `private` **#processorId**: `string`

Unique identifier for the processor instance. This ID helps in distinguishing between different
processors, especially when there are multiple sub-processors involved in processing parts of the graph.

#### Source

[packages/core/src/studio/processor.ts:669](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L669)

***

### #queuedNodeIds

`Internal`

> `private` **#queuedNodeIds**: `Set`\<`RecordId`\>

Stores the IDs of nodes that are queued for processing. This helps in managing the flow of node
execution and ensuring that nodes are ready to process as soon as their prerequisites are met.

#### Source

[packages/core/src/studio/processor.ts:795](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L795)

***

### #remainingNodeIds

`Internal`

> `private` **#remainingNodeIds**: `Set`\<`RecordId`\>

A set of node IDs that remain to be processed. This helps in tracking the progress of graph processing
and managing the workflow of nodes as they move through various stages of execution.

#### Source

[packages/core/src/studio/processor.ts:763](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L763)

***

### #visitedNodeIds

`Internal`

> `private` **#visitedNodeIds**: `Set`\<`RecordId`\>

Keeps track of all node IDs that have been visited during the processing. This is used to prevent
reprocessing of nodes and to manage dependencies and execution order within the graph.

#### Source

[packages/core/src/studio/processor.ts:771](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L771)

***

### off()

> **off**: \<`Name`\>(`eventName`, `listener`) => `void`

Detaches an event listener from the specified event.

#### Type parameters

• **Name** *extends* keyof ProcessEvents \| keyof OmnipresentEventData

#### Parameters

• **eventName**: `Name` \| readonly `Name`[]

The event name to stop listening to.

• **listener**

The function that was attached earlier.

#### Returns

`void`

#### Source

[packages/core/src/studio/processor.ts:1061](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L1061)

***

### offAny()

> **offAny**: (`listener`) => `void`

Detaches an 'any event' listener.

#### Parameters

• **listener**

The function that was attached earlier.

#### Returns

`void`

#### Source

[packages/core/src/studio/processor.ts:1080](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L1080)

***

### on()

> **on**: \<`Name`\>(`eventName`, `listener`) => `UnsubscribeFunction`

Attaches an event listener to the specified event.

#### Type parameters

• **Name** *extends* keyof ProcessEvents \| keyof OmnipresentEventData

#### Parameters

• **eventName**: `Name` \| readonly `Name`[]

The event name to listen for.

• **listener**

The function to call when the event is emitted.

#### Returns

`UnsubscribeFunction`

#### Source

[packages/core/src/studio/processor.ts:1054](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L1054)

***

### onAny()

> **onAny**: (`listener`) => `UnsubscribeFunction`

Attaches an event listener that triggers for any event.

#### Parameters

• **listener**

The function to call when any event is emitted.

#### Returns

`UnsubscribeFunction`

#### Source

[packages/core/src/studio/processor.ts:1074](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L1074)

***

### once()

> **once**: \<`Name`\>(`eventName`) => `EmitteryOncePromise` \<[`ProcessEvents`](../interfaces/ProcessEvents.md) & `OmnipresentEventData`\[`Name`\]\>

Attaches a one-time event listener that automatically detaches after it runs.

#### Type parameters

• **Name** *extends* keyof ProcessEvents \| keyof OmnipresentEventData

#### Parameters

• **eventName**: `Name` \| readonly `Name`[]

The event name to listen for once.

#### Returns

`EmitteryOncePromise` \<[`ProcessEvents`](../interfaces/ProcessEvents.md) & `OmnipresentEventData`\[`Name`\]\>

#### Source

[packages/core/src/studio/processor.ts:1068](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L1068)

## Accessors

### isRunning

> `get` **isRunning**(): `boolean`

Indicates whether the graph is currently being processed.

#### Returns

`boolean`

#### Source

[packages/core/src/studio/processor.ts:897](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L897)

## Methods

### #fetchNodeDataAndProcessNode()

`Internal`

> `private` **#fetchNodeDataAndProcessNode**(`node`): `Promise`\<`void`\>

Retrieves data for a specific node and processes it if all conditions are met (e.g., all inputs are available and valid).
This method is typically called internally as part of the node processing pipeline.

#### Parameters

• **node**: [`SerializableNode`](../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../load/serializable/classes/Serializable.md)\>

The node to fetch data for and process.

#### Returns

`Promise`\<`void`\>

#### Source

[packages/core/src/studio/processor.ts:1553](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L1553)

***

### #getProcessInputForNode()

`Internal`

> `private` **#getProcessInputForNode**(`node`): [`ProcessInputMap`](../type-aliases/ProcessInputMap.md)

Retrieves the inputs for a node based on the current graph state and connections.
This method aggregates inputs from connected nodes or initial graph inputs.

#### Parameters

• **node**: [`SerializableNode`](../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../load/serializable/classes/Serializable.md)\>

The node for which inputs are required.

#### Returns

[`ProcessInputMap`](../type-aliases/ProcessInputMap.md)

A map of input names to their corresponding data.

#### Source

[packages/core/src/studio/processor.ts:2117](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L2117)

***

### #initAbortController()

`Internal`

> `private` **#initAbortController**(): `AbortController`

Initializes a new AbortController for managing abort signals within graph processing.
This controller allows for fine-grained control over aborting ongoing processes, either globally or individually.

#### Returns

`AbortController`

An instance of AbortController.

#### Source

[packages/core/src/studio/processor.ts:942](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L942)

***

### #processInputNode()

`Internal`

> `private` **#processInputNode**(`node`, `processId`): `Promise`\<`void`\>

Processes an input node which requires external user inputs.
Manages the collection of user inputs and processes the node with them.

#### Parameters

• **node**: [`InputNode`](../../nodes/utility/input.node/type-aliases/InputNode.md)

The input node to process.

• **processId**: [`ProcessId`](../type-aliases/ProcessId.md)

The identifier for the ongoing process.

#### Returns

`Promise`\<`void`\>

#### Source

[packages/core/src/studio/processor.ts:1906](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L1906)

***

### #processNode()

`Internal`

> `private` **#processNode**(`node`): `Promise` \<[`ProcessId`](../type-aliases/ProcessId.md)\>

The core method for processing a single node within the graph.
Manages the execution of node-specific logic.

#### Parameters

• **node**: [`SerializableNode`](../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../load/serializable/classes/Serializable.md)\>

The node to be processed.

#### Returns

`Promise` \<[`ProcessId`](../type-aliases/ProcessId.md)\>

A promise that resolves to the process identifier.

#### Source

[packages/core/src/studio/processor.ts:1861](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L1861)

***

### #processNodeIfAllInputsAvailable()

`Internal`

> `private` **#processNodeIfAllInputsAvailable**(`node`): `Promise`\<`void`\>

Processes a node if all required inputs are available, handling dependencies and
ensuring that node execution order is respected.

#### Parameters

• **node**: [`SerializableNode`](../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../load/serializable/classes/Serializable.md)\>

The node to process.

#### Returns

`Promise`\<`void`\>

#### Source

[packages/core/src/studio/processor.ts:1704](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L1704)

***

### #processNodeWithInputData()

`Internal`

> `private` **#processNodeWithInputData**(`node`, `inputs`, `processId`): `Promise` \<[`ProcessOutputMap`](../type-aliases/ProcessOutputMap.md)\>

Processes a node with the specified input data. Handles the execution of the node's
logic based on the provided inputs.

#### Parameters

• **node**: [`SerializableNode`](../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../load/serializable/classes/Serializable.md)\>

The node to process.

• **inputs**: [`ProcessInputMap`](../type-aliases/ProcessInputMap.md)

The input data for the node.

• **processId**: [`ProcessId`](../type-aliases/ProcessId.md)

The identifier for the ongoing process.

#### Returns

`Promise` \<[`ProcessOutputMap`](../type-aliases/ProcessOutputMap.md)\>

A promise that resolves to the outputs of the node.

#### Source

[packages/core/src/studio/processor.ts:2045](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L2045)

***

### #processNormalNode()

`Internal`

> `private` **#processNormalNode**(`node`, `processId`): `Promise`\<`void`\>

Processes a normal node that does not require external inputs.
Handles the standard node processing based on internal logic and connections.

#### Parameters

• **node**: [`SerializableNode`](../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../load/serializable/classes/Serializable.md)\>

The node to process.

• **processId**: [`ProcessId`](../type-aliases/ProcessId.md)

The identifier for the ongoing process.

#### Returns

`Promise`\<`void`\>

#### Source

[packages/core/src/studio/processor.ts:1993](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L1993)

***

### #subscribe()

> `private` **#subscribe**(): `void`

Subscribes to necessary internal events to manage the processing flow and error handling.

#### Returns

`void`

#### Source

[packages/core/src/studio/processor.ts:986](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L986)

***

### #throwProcessError()

`Internal`

> `private` **#throwProcessError**(`node`, `error`, `processId`): `void`

Emits an error event for a node and records the error in the processor's state.
This is used to handle and log errors that occur during node processing.

#### Parameters

• **node**: [`SerializableNode`](../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../load/serializable/classes/Serializable.md)\>

The node that encountered an error.

• **error**: `Error`

The error that occurred.

• **processId**: [`ProcessId`](../type-aliases/ProcessId.md)

The identifier for the ongoing process.

#### Returns

`void`

#### Source

[packages/core/src/studio/processor.ts:2169](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L2169)

***

### #waitUntilUnpaused()

`Internal`

> `private` **#waitUntilUnpaused**(): `Promise`\<`void`\>

Waits until the graph processing is resumed if it is currently paused.
This method ensures that the processing does not continue while in a paused state.
It listens for the 'resume' event and will resume operation only once the event is
emitted, indicating that the processing has been resumed.

#### Returns

`Promise`\<`void`\>

#### Source

[packages/core/src/studio/processor.ts:1207](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L1207)

***

### \_distributeNodesToWorkers()

`Internal`

> `private` **\_distributeNodesToWorkers**(`group`): `void`

Distributes nodes among different processors, including sub-processors.
This method is used to balance the load and optimize parallel processing.

#### Parameters

• **group**: [`string`, `RecordId`[]][]

#### Returns

`void`

#### Source

[packages/core/src/studio/processor.ts:2196](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L2196)

***

### \_getProcessorForNode()

`Internal`

> `private` **\_getProcessorForNode**(`node`): [`GraphProcessor`](GraphProcessor.md)

Retrieves the appropriate processor for a given node, considering whether the node
should be handled by this processor or a sub-processor.

#### Parameters

• **node**: [`SerializableNode`](../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../load/serializable/classes/Serializable.md)\>

The node for which the processor needs to be determined.

#### Returns

[`GraphProcessor`](GraphProcessor.md)

The processor responsible for handling the node.

#### Source

[packages/core/src/studio/processor.ts:2235](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L2235)

***

### abort()

> **abort**(`success`, `error`?): `Promise`\<`void`\>

Aborts the current graph processing.
This method stops all ongoing processes and emits an abort event.

#### Parameters

• **success**: `boolean`= `false`

Indicates whether the abort is considered successful.

• **error?**: `string` \| `Error`

Optional error that might have triggered the abort.

#### Returns

`Promise`\<`void`\>

#### Source

[packages/core/src/studio/processor.ts:1089](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L1089)

***

### createSubProcessor()

> **createSubProcessor**(`processorId`, `subNodeIds`, `options`): [`GraphProcessor`](GraphProcessor.md)

Creates a sub-processor for handling a subset of nodes within the graph.
This is used for distributed or parallel processing.

#### Parameters

• **processorId**: `string`

The identifier for the new sub-processor.

• **subNodeIds**: `RecordId`[]

Array of node IDs that the sub-processor will handle.

• **options**= `{}`

Additional options such as the AbortSignal for coordinating abort behavior across processors.

• **options.signal?**: `AbortSignal`

#### Returns

[`GraphProcessor`](GraphProcessor.md)

An instance of GraphProcessor configured as a sub-processor.

#### Source

[packages/core/src/studio/processor.ts:1239](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L1239)

***

### events()

> **events**(): `AsyncGenerator` \<[`ProcessEvent`](../type-aliases/ProcessEvent.md), `any`, `unknown`\>

Continuously yields events from the processor as they occur.
This generator allows consumers to react to events in real-time during the graph processing.

#### Returns

`AsyncGenerator` \<[`ProcessEvent`](../type-aliases/ProcessEvent.md), `any`, `unknown`\>

An asynchronous generator yielding processing events.

#### Source

[packages/core/src/studio/processor.ts:1221](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L1221)

***

### initProcessState()

> **initProcessState**(): `void`

Initializes the processing state and prepares the graph for execution.
This method should be called before any processing starts.

#### Returns

`void`

#### Source

[packages/core/src/studio/processor.ts:905](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L905)

***

### pause()

> **pause**(): `void`

Pauses the graph processing. This can be resumed later.

#### Returns

`void`

#### Source

[packages/core/src/studio/processor.ts:1133](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L1133)

***

### processGraph()

> **processGraph**(`inputs`, `context`, `contextValues`): `Promise` \<[`GraphOutputs`](../type-aliases/GraphOutputs.md)\>

Initiates the processing of the graph with the provided inputs and context.
Manages the entire lifecycle of the graph processing.

#### Parameters

• **inputs**: [`GraphInputs`](../type-aliases/GraphInputs.md)= `{}`

Initial inputs to the graph nodes.

• **context**: [`ProcessContext`](../type-aliases/ProcessContext.md)= `{}`

Additional context needed for node processing.

• **contextValues**: `Record`\<`string`, [`Data`](../../data/type-aliases/Data.md)\>= `{}`

Supplementary values that can be accessed by nodes during processing.

#### Returns

`Promise` \<[`GraphOutputs`](../type-aliases/GraphOutputs.md)\>

A promise that resolves to the outputs from the graph processing.

#### Source

[packages/core/src/studio/processor.ts:1317](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L1317)

***

### resume()

> **resume**(): `void`

Resumes the graph processing if it was previously paused.

#### Returns

`void`

#### Source

[packages/core/src/studio/processor.ts:1153](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L1153)

***

### userInput()

> **userInput**(`nodeId`, `inputs`): `void`

Processes user inputs for an interactive node during the graph execution.
This method is typically called in response to an input request from a node that
requires user interaction.

#### Parameters

• **nodeId**: `RecordId`

The ID of the InputNode requiring user input.

• **inputs**: [`ProcessInputMap`](../type-aliases/ProcessInputMap.md)

The inputs provided by the user.

#### Returns

`void`

#### Source

[packages/core/src/studio/processor.ts:1178](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L1178)
