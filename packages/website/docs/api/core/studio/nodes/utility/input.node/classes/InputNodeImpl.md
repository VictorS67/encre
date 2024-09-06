# Class: InputNodeImpl

An implementation class for InputNode. This class extends the basic node implementation to provide
specialized functionalities for input handling. It supports dynamic definition of inputs and outputs
based on connected node configurations and the data types defined in the serialized data.

### Node Properties

| Field       | Type           | Description                                                                  |
|-------------|----------------|------------------------------------------------------------------------------|
| `type`      | `'input'`      | Indicates the node's role in handling inputs.                                |
| `subtype`   | `'input'`      | Further specifies the nature of input handling, typically not varying much.  |
| `data`      | [BaseInput](../../../../input/classes/BaseInput.md) | Encapsulates the data and configuration specific to input handling.       |

### Input Ports

None in default. Input ports are dynamically configured based on the node's current connections and may vary.

### Output Ports

Output ports in an input node are from `dataTypes` of [BaseInput](../../../../input/classes/BaseInput.md).

## Extends

- [`NodeImpl`](../../../base/classes/NodeImpl.md) \<[`InputNode`](../type-aliases/InputNode.md)\>

## Constructors

### new InputNodeImpl()

> **new InputNodeImpl**(`node`): [`InputNodeImpl`](InputNodeImpl.md)

Constructs a NodeImpl instance, initializing it with the provided node data.

#### Parameters

• **node**: [`InputNode`](../type-aliases/InputNode.md)

The node data to initialize the instance with.

#### Returns

[`InputNodeImpl`](InputNodeImpl.md)

#### Inherited from

[`NodeImpl`](../../../base/classes/NodeImpl.md) . [`constructor`](../../../base/classes/NodeImpl.md#constructors)

#### Source

[packages/core/src/studio/nodes/base.ts:80](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L80)

## Properties

### aliases

> `readonly` **aliases**: `SerializedKeyAlias`

Key aliases for serializable data fields.

#### Inherited from

[`NodeImpl`](../../../base/classes/NodeImpl.md) . [`aliases`](../../../base/classes/NodeImpl.md#aliases)

#### Source

[packages/core/src/studio/nodes/base.ts:63](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L63)

***

### node

> `readonly` **node**: [`InputNode`](../type-aliases/InputNode.md)

Reference to the serialized node instance.

#### Inherited from

[`NodeImpl`](../../../base/classes/NodeImpl.md) . [`node`](../../../base/classes/NodeImpl.md#node)

#### Source

[packages/core/src/studio/nodes/base.ts:58](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L58)

***

### secrets

> `readonly` **secrets**: `SecretFields`

Secret keys used in the serializable data.

#### Inherited from

[`NodeImpl`](../../../base/classes/NodeImpl.md) . [`secrets`](../../../base/classes/NodeImpl.md#secrets)

#### Source

[packages/core/src/studio/nodes/base.ts:68](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L68)

## Accessors

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

> `set` **inputs**(`newVal`): `void`

Sets new input definitions for the node. Allows dynamic configuration of node inputs based on external factors.

#### Parameters

• **newVal**: `undefined` \| [`NodePortFields`](../../../type-aliases/NodePortFields.md)

A structure defining the input ports and their data types, or undefined to clear inputs.

#### Source

[packages/core/src/studio/nodes/utility/input.node.ts:63](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/utility/input.node.ts#L63)

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
please use [getOutputPortDefs](InputNodeImpl.md#getoutputportdefs) instead.

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

### getBody()

> **getBody**(): `Promise` \<[`NodeBody`](../../../type-aliases/NodeBody.md)\>

Retrieves the body of the node, typically used for UI rendering or further processing.

#### Returns

`Promise` \<[`NodeBody`](../../../type-aliases/NodeBody.md)\>

A promise that resolves to the node's body, suitable for rendering in UIs or other outputs.

#### Overrides

[`NodeImpl`](../../../base/classes/NodeImpl.md) . [`getBody`](../../../base/classes/NodeImpl.md#getbody)

#### Source

[packages/core/src/studio/nodes/utility/input.node.ts:258](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/utility/input.node.ts#L258)

***

### getInputPortDefs()

> **getInputPortDefs**(`connections`, `nodeMap`): [`NodeInputPortDef`](../../../type-aliases/NodeInputPortDef.md)[]

Derives the input port definitions based on connections to this node.
This method dynamically adjusts input ports based on the connected nodes and the data types they provide.

#### Parameters

• **connections**: [`NodeConnection`](../../../type-aliases/NodeConnection.md)[]

Array of node connections that connect to this node.

• **nodeMap**: `Record`\<`RecordId`, [`SerializableNode`](../../../interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../../../load/serializable/classes/Serializable.md)\>\>

A mapping from node IDs to SerializableNode instances, to fetch output definitions.

#### Returns

[`NodeInputPortDef`](../../../type-aliases/NodeInputPortDef.md)[]

An array of input port definitions with potential data types they can accept.

#### Overrides

[`NodeImpl`](../../../base/classes/NodeImpl.md) . [`getInputPortDefs`](../../../base/classes/NodeImpl.md#getinputportdefs)

#### Source

[packages/core/src/studio/nodes/utility/input.node.ts:167](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/utility/input.node.ts#L167)

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

[`NodeImpl`](../../../base/classes/NodeImpl.md) . [`getOutputPortDefs`](../../../base/classes/NodeImpl.md#getoutputportdefs)

#### Source

[packages/core/src/studio/nodes/base.ts:264](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L264)

***

### process()

> **process**(`inputs`, `context`): `Promise` \<[`ProcessOutputMap`](../../../../processor/type-aliases/ProcessOutputMap.md)\>

Processes inputs to produce outputs based on the current configuration of the node.
This method takes user inputs or automated inputs and generates outputs accordingly,
maintaining the state in `data`.

#### Parameters

• **inputs**: [`ProcessInputMap`](../../../../processor/type-aliases/ProcessInputMap.md)

A map containing input data for the node.

• **context**: [`ProcessContext`](../../../../processor/type-aliases/ProcessContext.md)

The processing context, providing additional data and operations for processing.

#### Returns

`Promise` \<[`ProcessOutputMap`](../../../../processor/type-aliases/ProcessOutputMap.md)\>

A map of process outputs keyed by their output port names.

#### Overrides

[`NodeImpl`](../../../base/classes/NodeImpl.md) . [`process`](../../../base/classes/NodeImpl.md#process)

#### Source

[packages/core/src/studio/nodes/utility/input.node.ts:230](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/utility/input.node.ts#L230)

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

[`NodeImpl`](../../../base/classes/NodeImpl.md) . [`serialize`](../../../base/classes/NodeImpl.md#serialize)

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

[`NodeImpl`](../../../base/classes/NodeImpl.md) . [`setKwarg`](../../../base/classes/NodeImpl.md#setkwarg)

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

[`NodeImpl`](../../../base/classes/NodeImpl.md) . [`validateInputs`](../../../base/classes/NodeImpl.md#validateinputs)

#### Source

[packages/core/src/studio/nodes/base.ts:278](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/base.ts#L278)

***

### create()

> `static` **create**(): [`InputNode`](../type-aliases/InputNode.md)

Factory method to create a new instance of InputNode with default settings.
The instance is initialized with default data types for outputs, typically used at the start of node creation.

#### Returns

[`InputNode`](../type-aliases/InputNode.md)

An instance of InputNode initialized with default settings for data inputs.

#### Source

[packages/core/src/studio/nodes/utility/input.node.ts:99](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/utility/input.node.ts#L99)

***

### deserialize()

> `static` **deserialize**(`serialized`): `Promise` \<[`InputNode`](../type-aliases/InputNode.md)\>

Deserializes a serialized input node representation into an executable input node,
reconstituting the node with its operational parameters and data.

#### Parameters

• **serialized**: [`SerializedNode`](../../../../serde/interfaces/SerializedNode.md)

The serialized node data.

#### Returns

`Promise` \<[`InputNode`](../type-aliases/InputNode.md)\>

A promise resolving to a deserialized input node.

#### Overrides

[`NodeImpl`](../../../base/classes/NodeImpl.md) . [`deserialize`](../../../base/classes/NodeImpl.md#deserialize)

#### Source

[packages/core/src/studio/nodes/utility/input.node.ts:116](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/utility/input.node.ts#L116)

***

### nodeFrom()

> `static` **nodeFrom**(`serializable`): [`InputNode`](../type-aliases/InputNode.md)

Factory method to create an InputNode from a serializable instance of BaseInput.

#### Parameters

• **serializable**: [`BaseInput`](../../../../input/classes/BaseInput.md)

An instance of BaseInput that defines the structure and capabilities of the input node.

#### Returns

[`InputNode`](../type-aliases/InputNode.md)

A fully configured InputNode.

#### Source

[packages/core/src/studio/nodes/utility/input.node.ts:72](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/utility/input.node.ts#L72)
