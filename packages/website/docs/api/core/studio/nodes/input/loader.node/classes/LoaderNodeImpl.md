# Class: `abstract` LoaderNodeImpl

An abstract class providing a base implementation for loader nodes.
This class extends the callable node implementation to provide specialized
loader functionalities.

## Extends

- [`CallableNodeImpl`](../../../base/classes/CallableNodeImpl.md) \<[`LoaderNode`](../type-aliases/LoaderNode.md)\>

## Extended by

- [`PDFLoaderNodeImpl`](PDFLoaderNodeImpl.md)

## Constructors

### new LoaderNodeImpl()

> **new LoaderNodeImpl**(`node`): [`LoaderNodeImpl`](LoaderNodeImpl.md)

Initializes a new instance of the `CallableNodeImpl` class.

#### Parameters

• **node**: [`LoaderNode`](../type-aliases/LoaderNode.md)

The `CallableNode` data that provides configuration and runtime information.

#### Returns

[`LoaderNodeImpl`](LoaderNodeImpl.md)

#### Inherited from

[`CallableNodeImpl`](../../../base/classes/CallableNodeImpl.md) . [`constructor`](../../../base/classes/CallableNodeImpl.md#constructors)

#### Source

[packages/core/src/studio/nodes/base.ts:508](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L508)

## Properties

### aliases

> `readonly` **aliases**: `SerializedKeyAlias`

Key aliases for serializable data fields.

#### Inherited from

[`CallableNodeImpl`](../../../base/classes/CallableNodeImpl.md) . [`aliases`](../../../base/classes/CallableNodeImpl.md#aliases)

#### Source

[packages/core/src/studio/nodes/base.ts:63](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L63)

***

### node

> `readonly` **node**: [`LoaderNode`](../type-aliases/LoaderNode.md)

Reference to the serialized node instance.

#### Inherited from

[`CallableNodeImpl`](../../../base/classes/CallableNodeImpl.md) . [`node`](../../../base/classes/CallableNodeImpl.md#node)

#### Source

[packages/core/src/studio/nodes/base.ts:58](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L58)

***

### secrets

> `readonly` **secrets**: `SecretFields`

Secret keys used in the serializable data.

#### Inherited from

[`CallableNodeImpl`](../../../base/classes/CallableNodeImpl.md) . [`secrets`](../../../base/classes/CallableNodeImpl.md#secrets)

#### Source

[packages/core/src/studio/nodes/base.ts:68](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L68)

## Accessors

### callableType

> `get` **callableType**(): `string`

Gets the type of callable operation this node implements.

#### Returns

`string`

The callable type as a string.

#### Source

[packages/core/src/studio/nodes/base.ts:520](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L520)

***

### data

> `get` **data**(): `T`\[`"data"`\]

Retrieves the data associated with the node.

#### Returns

`T`\[`"data"`\]

#### Source

[packages/core/src/studio/nodes/base.ts:149](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L149)

***

### description

> `get` **description**(): `string`

Retrieves the description of the node, defaulting to an empty string if not set.

#### Returns

`string`

#### Source

[packages/core/src/studio/nodes/base.ts:99](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L99)

***

### id

> `get` **id**(): `RecordId`

Retrieves the unique identifier of the node.

#### Returns

`RecordId`

#### Source

[packages/core/src/studio/nodes/base.ts:106](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L106)

***

### inputs

> `get` **inputs**(): `T`\[`"inputs"`\]

Retrieves the input ports of the node.

#### Remarks

It is NOT safe to get actual input ports of the node if the node is in a graph,
please use [getInputPortDefs](LoaderNodeImpl.md#getinputportdefs) instead.

#### Returns

`T`\[`"inputs"`\]

#### Source

[packages/core/src/studio/nodes/base.ts:160](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L160)

***

### kwargs

> `get` **kwargs**(): [`DataFields`](../../../../data/type-aliases/DataFields.md)

Retrieves keyword arguments for the serializable data.

#### Returns

[`DataFields`](../../../../data/type-aliases/DataFields.md)

#### Source

[packages/core/src/studio/nodes/base.ts:185](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L185)

***

### memory

> `get` **memory**(): `number`

Retrieves the memory allocation for the node, defaulting to 0.

#### Returns

`number`

#### Source

[packages/core/src/studio/nodes/base.ts:199](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L199)

***

### name

> `get` **name**(): `string`

Retrieves the name of the node. It is equvalent to the serializable data's name.

#### Returns

`string`

#### Source

[packages/core/src/studio/nodes/base.ts:135](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L135)

***

### outputSizes

> `get` **outputSizes**(): [`NodePortSizes`](../../../type-aliases/NodePortSizes.md)

Retrieves or initializes output port sizes.

#### Returns

[`NodePortSizes`](../../../type-aliases/NodePortSizes.md)

#### Source

[packages/core/src/studio/nodes/base.ts:178](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L178)

***

### outputs

> `get` **outputs**(): `T`\[`"outputs"`\]

Retrieves the output ports of the node.

#### Remarks

It is NOT safe to get actual output ports of the node if the node is in a graph,
please use [getOutputPortDefs](LoaderNodeImpl.md#getoutputportdefs) instead.

#### Returns

`T`\[`"outputs"`\]

#### Source

[packages/core/src/studio/nodes/base.ts:171](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L171)

***

### registerArgs

> `get` **registerArgs**(): `undefined` \| `Record`\<`string`, `unknown`\>

Retrieves the registration arguments of the node, if any.
This is used for creating the current node.

#### Returns

`undefined` \| `Record`\<`string`, `unknown`\>

#### Source

[packages/core/src/studio/nodes/base.ts:128](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L128)

***

### runtime

> `get` **runtime**(): `number`

Retrieves the runtime allocation for the node, defaulting to 0.

#### Returns

`number`

#### Source

[packages/core/src/studio/nodes/base.ts:192](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L192)

***

### subType

> `get` **subType**(): `SubType`

Retrieves the subtype of the node.

#### Returns

`SubType`

#### Source

[packages/core/src/studio/nodes/base.ts:120](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L120)

***

### title

> `get` **title**(): `string`

Retrieves the title of the node, defaulting to the serializable data's name if not set.

#### Returns

`string`

#### Source

[packages/core/src/studio/nodes/base.ts:92](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L92)

***

### type

> `get` **type**(): `Type`

Retrieves the type of the node.

#### Returns

`Type`

#### Source

[packages/core/src/studio/nodes/base.ts:113](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L113)

***

### visualInfo

> `get` **visualInfo**(): `T`\[`"visualInfo"`\]

Retrieves visual information such as position and size of the node.

#### Returns

`T`\[`"visualInfo"`\]

#### Source

[packages/core/src/studio/nodes/base.ts:142](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L142)

## Methods

### \_postprocess()

`Internal`

> `protected` `abstract` **\_postprocess**(`rawOutputs`, `context`): `Promise` \<[`ProcessOutputMap`](../../../../processor/type-aliases/ProcessOutputMap.md)\>

Processes the raw outputs from the callable operation.
This method converts or handles the outputs from the callable operation before they are
returned to the caller.

#### Parameters

• **rawOutputs**: `unknown`

The raw output data from the callable operation.

• **context**: [`ProcessContext`](../../../../processor/type-aliases/ProcessContext.md)

The process context that might contain additional runtime information or utilities.

#### Returns

`Promise` \<[`ProcessOutputMap`](../../../../processor/type-aliases/ProcessOutputMap.md)\>

A promise resolving to the final processed outputs as a `ProcessOutputMap`.

#### Inherited from

[`CallableNodeImpl`](../../../base/classes/CallableNodeImpl.md) . [`_postprocess`](../../../base/classes/CallableNodeImpl.md#_postprocess)

#### Source

[packages/core/src/studio/nodes/base.ts:548](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L548)

***

### \_preprocess()

`Internal`

> `protected` `abstract` **\_preprocess**(`inputs`, `context`): `Promise`\<`unknown`\>

Processes the input data before the main callable operation is executed.
This method performs any necessary preprocessing on the input data.

#### Parameters

• **inputs**: [`ProcessInputMap`](../../../../processor/type-aliases/ProcessInputMap.md)

The input data provided to the node.

• **context**: [`ProcessContext`](../../../../processor/type-aliases/ProcessContext.md)

The process context that might contain additional runtime information or utilities.

#### Returns

`Promise`\<`unknown`\>

A promise resolving to the processed input data that will be used in the main operation.

#### Inherited from

[`CallableNodeImpl`](../../../base/classes/CallableNodeImpl.md) . [`_preprocess`](../../../base/classes/CallableNodeImpl.md#_preprocess)

#### Source

[packages/core/src/studio/nodes/base.ts:533](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L533)

***

### getBody()

> **getBody**(): `Promise` \<[`NodeBody`](../../../type-aliases/NodeBody.md)\>

Asynchronously constructs a composite body of UI context elements based on the node's
secrets and keyword arguments.

#### Returns

`Promise` \<[`NodeBody`](../../../type-aliases/NodeBody.md)\>

A promise that resolves to a `NodeBody`, potentially containing multiple `UIContext` elements.

#### Inherited from

[`CallableNodeImpl`](../../../base/classes/CallableNodeImpl.md) . [`getBody`](../../../base/classes/CallableNodeImpl.md#getbody)

#### Source

[packages/core/src/studio/nodes/base.ts:306](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L306)

***

### getInputPortDefs()

> **getInputPortDefs**(`connections`, `nodeMap`): [`NodeInputPortDef`](../../../type-aliases/NodeInputPortDef.md)[]

Generates definitions for input ports of the node, potentially modifying port requirements based on existing connections.

#### Parameters

• **connections**: [`NodeConnection`](../../../type-aliases/NodeConnection.md)[]= `[]`

An array of `NodeConnection` representing current node connections.

• **nodeMap**: `Record`\<`RecordId`, [`SerializableNode`](../../../interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../../../load/serializable/classes/Serializable.md)\>\>= `{}`

A map of node IDs to `SerializableNode` instances, providing context about other nodes in the system.

#### Returns

[`NodeInputPortDef`](../../../type-aliases/NodeInputPortDef.md)[]

An array of `NodeInputPortDef` detailing the input port configurations.

#### Inherited from

[`CallableNodeImpl`](../../../base/classes/CallableNodeImpl.md) . [`getInputPortDefs`](../../../base/classes/CallableNodeImpl.md#getinputportdefs)

#### Source

[packages/core/src/studio/nodes/base.ts:238](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L238)

***

### getOutputPortDefs()

> **getOutputPortDefs**(`connections`, `nodeMap`): [`NodeOutputPortDef`](../../../type-aliases/NodeOutputPortDef.md)[]

Generates definitions for output ports of the node.

#### Parameters

• **connections**: [`NodeConnection`](../../../type-aliases/NodeConnection.md)[]= `[]`

An array of `NodeConnection`, which might be used in future extensions to modify output configurations based on connections.

• **nodeMap**: `Record`\<`RecordId`, [`SerializableNode`](../../../interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../../../load/serializable/classes/Serializable.md)\>\>= `{}`

A map of node IDs to `SerializableNode`, similar to `getInputPortDefs`, can be used for context about connections.

#### Returns

[`NodeOutputPortDef`](../../../type-aliases/NodeOutputPortDef.md)[]

An array of `NodeOutputPortDef` detailing the output port configurations.

#### Inherited from

[`CallableNodeImpl`](../../../base/classes/CallableNodeImpl.md) . [`getOutputPortDefs`](../../../base/classes/CallableNodeImpl.md#getoutputportdefs)

#### Source

[packages/core/src/studio/nodes/base.ts:264](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L264)

***

### invoke()

> `abstract` **invoke**\<`CallInput`, `CallOutput`, `CallOptions`\>(`input`, `options`?): `Promise`\<`CallOutput`\>

Invokes the callable operation implemented by the node.
This method performs the actual callable operation.

#### Type parameters

• **CallInput**

• **CallOutput**

• **CallOptions**

#### Parameters

• **input**: `CallInput`

The input data to the operation.

• **options?**: `Partial`\<`CallOptions`\>

Optional additional options that might affect the operation.

#### Returns

`Promise`\<`CallOutput`\>

A promise resolving to the output of the operation.

#### Inherited from

[`CallableNodeImpl`](../../../base/classes/CallableNodeImpl.md) . [`invoke`](../../../base/classes/CallableNodeImpl.md#invoke)

#### Source

[packages/core/src/studio/nodes/base.ts:561](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L561)

***

### process()

> `abstract` **process**(`inputs`, `context`): `Promise` \<[`ProcessOutputMap`](../../../../processor/type-aliases/ProcessOutputMap.md)\>

Abstract method that must be implemented by subclasses to process input data and produce output.

#### Parameters

• **inputs**: [`ProcessInputMap`](../../../../processor/type-aliases/ProcessInputMap.md)

A map of input data keyed by input port names.

• **context**: [`ProcessContext`](../../../../processor/type-aliases/ProcessContext.md)

An instance of `ProcessContext` providing additional data and operational context.

#### Returns

`Promise` \<[`ProcessOutputMap`](../../../../processor/type-aliases/ProcessOutputMap.md)\>

A promise that resolves to a `ProcessOutputMap`, containing the processing results keyed by output port names.

#### Inherited from

[`CallableNodeImpl`](../../../base/classes/CallableNodeImpl.md) . [`process`](../../../base/classes/CallableNodeImpl.md#process)

#### Source

[packages/core/src/studio/nodes/base.ts:295](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L295)

***

### serialize()

> **serialize**(`connections`, `processInfo`?): `Promise` \<[`SerializedNode`](../../../../serde/interfaces/SerializedNode.md)\>

Serializes the current node instance to a `SerializedNode`, including connection and
process information.

#### Parameters

• **connections**: [`NodeConnection`](../../../type-aliases/NodeConnection.md)[]

An array of `NodeConnection` representing the node's outgoing connections.

• **processInfo?**: [`NodeProcessInfo`](../../../../graph/type-aliases/NodeProcessInfo.md)

Optional information about the node's runtime and memory usage.

#### Returns

`Promise` \<[`SerializedNode`](../../../../serde/interfaces/SerializedNode.md)\>

A promise that resolves to a `SerializedNode` encapsulating the node's current state and configuration.

#### Inherited from

[`CallableNodeImpl`](../../../base/classes/CallableNodeImpl.md) . [`serialize`](../../../base/classes/CallableNodeImpl.md#serialize)

#### Source

[packages/core/src/studio/nodes/base.ts:394](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L394)

***

### setKwarg()

> **setKwarg**(`key`, `value`): `void`

Sets a keyword argument for the node.

#### Parameters

• **key**: `string`

The key of the argument to set.

• **value**: `unknown`

The value to set for the argument.

#### Returns

`void`

#### Inherited from

[`CallableNodeImpl`](../../../base/classes/CallableNodeImpl.md) . [`setKwarg`](../../../base/classes/CallableNodeImpl.md#setkwarg)

#### Source

[packages/core/src/studio/nodes/base.ts:208](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L208)

***

### validateInputs()

> **validateInputs**(`inputs`?): `boolean`

Validates the provided inputs against the node's required inputs to ensure all necessary
data is present and correctly formatted.

#### Parameters

• **inputs?**: [`ProcessInputMap`](../../../../processor/type-aliases/ProcessInputMap.md)

An optional map of process input data keyed by input port names.

#### Returns

`boolean`

A boolean indicating whether the provided inputs meet all requirements specified by the node's input configuration.

#### Inherited from

[`CallableNodeImpl`](../../../base/classes/CallableNodeImpl.md) . [`validateInputs`](../../../base/classes/CallableNodeImpl.md#validateinputs)

#### Source

[packages/core/src/studio/nodes/base.ts:278](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L278)

***

### deserialize()

> `static` **deserialize**(`serialized`): `Promise` \<[`LoaderNode`](../type-aliases/LoaderNode.md)\>

Deserializes a serialized loader node representation into an executable loader node,
reconstituting the node with its operational parameters and data.

#### Parameters

• **serialized**: [`SerializedNode`](../../../../serde/interfaces/SerializedNode.md)

The serialized node data.

#### Returns

`Promise` \<[`LoaderNode`](../type-aliases/LoaderNode.md)\>

A promise resolving to a deserialized loader node.

#### Overrides

[`CallableNodeImpl`](../../../base/classes/CallableNodeImpl.md) . [`deserialize`](../../../base/classes/CallableNodeImpl.md#deserialize)

#### Source

[packages/core/src/studio/nodes/input/loader.node.ts:45](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/input/loader.node.ts#L45)
