# Type alias: ProcessContext

> **ProcessContext**: `object`

Contains all relevant context needed for processing a node or graph. This includes
identifiers, state signals, and contextual data necessary for execution control.

## Type declaration

### abortGraph()?

> `optional` **abortGraph**: (`error`?) => `void`

A method provided to abort the graph processing, optionally passing an error message or object.
This can be used to terminate the process prematurely in case of errors or other conditions.

#### Parameters

• **error?**: `Error` \| `string`

#### Returns

`void`

### contextData?

> `optional` **contextData**: `Record`\<`string`, [`Data`](../../data/type-aliases/Data.md)\>

Arbitrary data relevant to the process's execution context, typically used to pass
runtime values that are necessary for node computation.

### graphInputs?

> `optional` **graphInputs**: [`GraphInputs`](GraphInputs.md)

Inputs for the graph being processed, mapping each node's RecordId to its respective input data.
This property is typically set at the start of the graph processing to initialize node data.

### graphOutputs?

> `optional` **graphOutputs**: [`GraphOutputs`](GraphOutputs.md)

Outputs for the graph, populated as nodes within the graph are processed and their results computed.
This aggregates the results of individual nodes for use in subsequent processing or for final output.

### memory?

> `optional` **memory**: `Record`\<`RecordId`, `unknown`\>

A memory space for storing intermediate states or results that are needed across different stages
of the graph processing. This helps in maintaining state within a stateless processing environment.
The CallOption of the CallableNodes are stored in the memory space.

### node?

> `optional` **node**: [`SerializableNode`](../../nodes/interfaces/SerializableNode.md)

The current node being processed. This is particularly useful in context-specific operations
where node-specific data or actions are necessary.

### processId?

> `optional` **processId**: [`ProcessId`](ProcessId.md)

A unique identifier for the current process instance. This ID is used to track the
process throughout its lifecycle.

### signal?

> `optional` **signal**: `AbortSignal`

An instance of `AbortSignal` used to handle cancellation of the process. This allows
external consumers to request that the process stop execution.

## Source

[packages/core/src/studio/processor.ts:74](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/processor.ts#L74)
