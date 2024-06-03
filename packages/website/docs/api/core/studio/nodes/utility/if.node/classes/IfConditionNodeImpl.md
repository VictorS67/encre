# Class: IfConditionNodeImpl

Implementation of an IfNode specifically for managing conditional logic within a node-graph system.
This node provides interfaces to dynamically configure input and output ports based on the
conditional logic and connections established in a network or system.

### Node Properties

| Field        | Type                  | Description                                                                    |
|--------------|-----------------------|--------------------------------------------------------------------------------|
| `type`       | `'if'`                | The type of the node, indicating it handles conditional logic.                 |
| `subType`    | `'condition'`         | The subtype of the node, specifying it is focused on conditional operations.   |
| `data`       | [IfCondition](../../../../condition/classes/IfCondition.md)   | The actual condition logic being managed by this node.                         |

### Input Ports

Input ports in an if node are from `sources` of [BaseIfCondition](../../../../condition/classes/BaseIfCondition.md), default with types of [dataTypes](../../../../data/variables/dataTypes.md).

### Output Ports

Output ports in an if node are from `targets` of [BaseIfCondition](../../../../condition/classes/BaseIfCondition.md), default with types of [dataTypes](../../../../data/variables/dataTypes.md).

## Extends

- [`IfNodeImpl`](IfNodeImpl.md)

## Constructors

### new IfConditionNodeImpl()

> **new IfConditionNodeImpl**(`node`): [`IfConditionNodeImpl`](IfConditionNodeImpl.md)

Initializes a new instance of the `CallableNodeImpl` class.

#### Parameters

• **node**: [`IfNode`](../type-aliases/IfNode.md)

The `CallableNode` data that provides configuration and runtime information.

#### Returns

[`IfConditionNodeImpl`](IfConditionNodeImpl.md)

#### Inherited from

[`IfNodeImpl`](IfNodeImpl.md) . [`constructor`](IfNodeImpl.md#constructors)

#### Source

[packages/core/src/studio/nodes/base.ts:503](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L503)

## Properties

### aliases

> `readonly` **aliases**: `SerializedKeyAlias`

Key aliases for serializable data fields.

#### Inherited from

[`IfNodeImpl`](IfNodeImpl.md) . [`aliases`](IfNodeImpl.md#aliases)

#### Source

[packages/core/src/studio/nodes/base.ts:63](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L63)

***

### node

> `readonly` **node**: [`IfNode`](../type-aliases/IfNode.md)

Reference to the serialized node instance.

#### Inherited from

[`IfNodeImpl`](IfNodeImpl.md) . [`node`](IfNodeImpl.md#node)

#### Source

[packages/core/src/studio/nodes/base.ts:58](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L58)

***

### secrets

> `readonly` **secrets**: `SecretFields`

Secret keys used in the serializable data.

#### Inherited from

[`IfNodeImpl`](IfNodeImpl.md) . [`secrets`](IfNodeImpl.md#secrets)

#### Source

[packages/core/src/studio/nodes/base.ts:68](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L68)

## Accessors

### callableType

> `get` **callableType**(): `string`

Gets the type of callable operation this node implements.

#### Returns

`string`

The callable type as a string.

#### Source

[packages/core/src/studio/nodes/base.ts:515](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L515)

***

### data

> `get` **data**(): `T`\[`"data"`\]

Retrieves the data associated with the node.

#### Returns

`T`\[`"data"`\]

#### Source

[packages/core/src/studio/nodes/base.ts:149](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L149)

***

### description

> `get` **description**(): `string`

Retrieves the description of the node, defaulting to an empty string if not set.

#### Returns

`string`

#### Source

[packages/core/src/studio/nodes/base.ts:99](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L99)

***

### id

> `get` **id**(): `RecordId`

Retrieves the unique identifier of the node.

#### Returns

`RecordId`

#### Source

[packages/core/src/studio/nodes/base.ts:106](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L106)

***

### inputs

> `set` **inputs**(`newVal`): `void`

#### Parameters

• **newVal**: `undefined` \| [`NodePortFields`](../../../type-aliases/NodePortFields.md)

#### Source

[packages/core/src/studio/nodes/utility/if.node.ts:95](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/utility/if.node.ts#L95)

***

### kwargs

> `get` **kwargs**(): [`DataFields`](../../../../data/type-aliases/DataFields.md)

Retrieves keyword arguments for the serializable data.

#### Returns

[`DataFields`](../../../../data/type-aliases/DataFields.md)

#### Source

[packages/core/src/studio/nodes/base.ts:185](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L185)

***

### memory

> `get` **memory**(): `number`

Retrieves the memory allocation for the node, defaulting to 0.

#### Returns

`number`

#### Source

[packages/core/src/studio/nodes/base.ts:199](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L199)

***

### name

> `get` **name**(): `string`

Retrieves the name of the node. It is equvalent to the serializable data's name.

#### Returns

`string`

#### Source

[packages/core/src/studio/nodes/base.ts:135](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L135)

***

### outputSizes

> `get` **outputSizes**(): [`NodePortSizes`](../../../type-aliases/NodePortSizes.md)

Retrieves or initializes output port sizes.

#### Returns

[`NodePortSizes`](../../../type-aliases/NodePortSizes.md)

#### Source

[packages/core/src/studio/nodes/base.ts:178](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L178)

***

### outputs

> `set` **outputs**(`newVal`): `void`

#### Parameters

• **newVal**: `undefined` \| [`NodePortFields`](../../../type-aliases/NodePortFields.md)

#### Source

[packages/core/src/studio/nodes/utility/if.node.ts:99](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/utility/if.node.ts#L99)

***

### registerArgs

> `get` **registerArgs**(): `undefined` \| `Record`\<`string`, `unknown`\>

Retrieves the registration arguments of the node, if any.
This is used for creating the current node.

#### Returns

`undefined` \| `Record`\<`string`, `unknown`\>

#### Source

[packages/core/src/studio/nodes/base.ts:128](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L128)

***

### runtime

> `get` **runtime**(): `number`

Retrieves the runtime allocation for the node, defaulting to 0.

#### Returns

`number`

#### Source

[packages/core/src/studio/nodes/base.ts:192](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L192)

***

### subType

> `get` **subType**(): `SubType`

Retrieves the subtype of the node.

#### Returns

`SubType`

#### Source

[packages/core/src/studio/nodes/base.ts:120](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L120)

***

### title

> `get` **title**(): `string`

Retrieves the title of the node, defaulting to the serializable data's name if not set.

#### Returns

`string`

#### Source

[packages/core/src/studio/nodes/base.ts:92](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L92)

***

### type

> `get` **type**(): `Type`

Retrieves the type of the node.

#### Returns

`Type`

#### Source

[packages/core/src/studio/nodes/base.ts:113](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L113)

***

### visualInfo

> `get` **visualInfo**(): `T`\[`"visualInfo"`\]

Retrieves visual information such as position and size of the node.

#### Returns

`T`\[`"visualInfo"`\]

#### Source

[packages/core/src/studio/nodes/base.ts:142](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L142)

## Methods

### \_getNewPortName()

`Internal`

> `private` **\_getNewPortName**(): `string`

Generates a new unique port name for input or output ports based on existing port names.
This method ensures that each new port name does not conflict with existing names
by checking against the current list of input and output ports. It uses a systematic
approach to iterate through potential names using a combination of alphabetic characters
and numeric suffixes to ensure uniqueness.

#### Returns

`string`

A unique port name that is not already used in the node's inputs or outputs.

#### Example

```ts
// Example of generating a new unique port name when adding a new port
const newPortName = ifNodeInstance._getNewPortName(); // suppose new name is 'A'
const anotherNewPortName = ifNodeInstance._getNewPortName(); // now new name is 'B'
```

#### Source

[packages/core/src/studio/nodes/utility/if.node.ts:495](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/utility/if.node.ts#L495)

***

### \_postprocess()

`Internal`

> `protected` **\_postprocess**(`rawOutputs`, `context`): `Promise` \<[`ProcessOutputMap`](../../../../processor/type-aliases/ProcessOutputMap.md)\>

Postprocesses the raw outputs from the invoke method, converting them to a process output map
format by coercing data types as necessary.

#### Parameters

• **rawOutputs**: [`IfConditionTarget`](../../../../condition/type-aliases/IfConditionTarget.md)

The raw outputs from the condition evaluation.

• **context**: [`ProcessContext`](../../../../processor/type-aliases/ProcessContext.md)

The processing context.

#### Returns

`Promise` \<[`ProcessOutputMap`](../../../../processor/type-aliases/ProcessOutputMap.md)\>

#### Overrides

[`IfNodeImpl`](IfNodeImpl.md) . [`_postprocess`](IfNodeImpl.md#_postprocess)

#### Source

[packages/core/src/studio/nodes/utility/if.node.ts:416](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/utility/if.node.ts#L416)

***

### \_preprocess()

`Internal`

> `protected` **\_preprocess**(`inputs`, `context`): `Promise`\<`object`\>

Preprocesses the input data to convert it from the process input map format to a structured format
that includes the input values and any relevant variable context from memory.

#### Parameters

• **inputs**: [`ProcessInputMap`](../../../../processor/type-aliases/ProcessInputMap.md)

A map containing input data for the node.

• **context**: [`ProcessContext`](../../../../processor/type-aliases/ProcessContext.md)

The processing context.

#### Returns

`Promise`\<`object`\>

##### inputs

> **inputs**: `object`

###### Index signature

 \[`source`: `string`\]: `unknown`

##### variables?

> `optional` **variables**: `object`

###### Index signature

 \[`target`: `string`\]: ([`ConditionFieldVariables`](../../../../condition/type-aliases/ConditionFieldVariables.md) \| `undefined`)[]

#### Overrides

[`IfNodeImpl`](IfNodeImpl.md) . [`_preprocess`](IfNodeImpl.md#_preprocess)

#### Source

[packages/core/src/studio/nodes/utility/if.node.ts:386](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/utility/if.node.ts#L386)

***

### addInputPort()

> **addInputPort**(): `string`

Dynamically adds a new input port to the node. This method updates the node's internal
input structure and condition source list to include the new port.

#### Returns

`string`

The name of the newly added input port.

#### Source

[packages/core/src/studio/nodes/utility/if.node.ts:187](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/utility/if.node.ts#L187)

***

### addOutputPort()

> **addOutputPort**(): `string`

Dynamically adds a new output port to the node. This method updates the node's internal
output structure and condition target list to include the new port and associated action.

#### Returns

`string`

The name of the newly added output port.

#### Source

[packages/core/src/studio/nodes/utility/if.node.ts:206](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/utility/if.node.ts#L206)

***

### getBody()

> **getBody**(): `Promise` \<[`NodeBody`](../../../type-aliases/NodeBody.md)\>

Retrieves a dynamic user interface representation of the condition,
typically used for configuring the node in a user interface.

#### Returns

`Promise` \<[`NodeBody`](../../../type-aliases/NodeBody.md)\>

A promise that resolves to the condition UI contexts which might include
details about the sources and actions associated with the condition.

#### Inherited from

[`IfNodeImpl`](IfNodeImpl.md) . [`getBody`](IfNodeImpl.md#getbody)

#### Source

[packages/core/src/studio/nodes/utility/if.node.ts:62](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/utility/if.node.ts#L62)

***

### getInputPortDefs()

> **getInputPortDefs**(`connections`, `nodeMap`): [`NodeInputPortDef`](../../../type-aliases/NodeInputPortDef.md)[]

Generates definitions for input ports of the node, potentially modifying port requirements based on existing connections.

#### Parameters

• **connections**: [`NodeConnection`](../../../type-aliases/NodeConnection.md)[]

An array of `NodeConnection` representing current node connections.

• **nodeMap**: `Record`\<`RecordId`, [`SerializableNode`](../../../interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../../../load/serializable/classes/Serializable.md)\>\>

A map of node IDs to `SerializableNode` instances, providing context about other nodes in the system.

#### Returns

[`NodeInputPortDef`](../../../type-aliases/NodeInputPortDef.md)[]

An array of `NodeInputPortDef` detailing the input port configurations.

#### Overrides

[`IfNodeImpl`](IfNodeImpl.md) . [`getInputPortDefs`](IfNodeImpl.md#getinputportdefs)

#### Source

[packages/core/src/studio/nodes/utility/if.node.ts:103](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/utility/if.node.ts#L103)

***

### getOutputPortDefs()

> **getOutputPortDefs**(`connections`, `nodeMap`): [`NodeOutputPortDef`](../../../type-aliases/NodeOutputPortDef.md)[]

Generates definitions for output ports of the node.

#### Parameters

• **connections**: [`NodeConnection`](../../../type-aliases/NodeConnection.md)[]

An array of `NodeConnection`, which might be used in future extensions to modify output configurations based on connections.

• **nodeMap**: `Record`\<`RecordId`, [`SerializableNode`](../../../interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../../../load/serializable/classes/Serializable.md)\>\>

A map of node IDs to `SerializableNode`, similar to `getInputPortDefs`, can be used for context about connections.

#### Returns

[`NodeOutputPortDef`](../../../type-aliases/NodeOutputPortDef.md)[]

An array of `NodeOutputPortDef` detailing the output port configurations.

#### Overrides

[`IfNodeImpl`](IfNodeImpl.md) . [`getOutputPortDefs`](IfNodeImpl.md#getoutputportdefs)

#### Source

[packages/core/src/studio/nodes/utility/if.node.ts:142](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/utility/if.node.ts#L142)

***

### invoke()

> **invoke**\<`CallInput`, `CallOutput`, `CallOptions`\>(`input`, `options`?): `Promise`\<`CallOutput`\>

Invokes the condition logic defined in the data property with the provided input,
handling any dynamic rule evaluation based on the input conditions and specified options.

#### Type parameters

• **CallInput**

• **CallOutput**

• **CallOptions**

#### Parameters

• **input**: `CallInput`

The input data for the condition, expected to be IfConditionSource.

• **options?**: `Partial`\<`CallOptions`\>

Optional additional settings for the condition call.

#### Returns

`Promise`\<`CallOutput`\>

The output from the condition logic as specified by the condition's output type.

#### Overrides

[`IfNodeImpl`](IfNodeImpl.md) . [`invoke`](IfNodeImpl.md#invoke)

#### Source

[packages/core/src/studio/nodes/utility/if.node.ts:436](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/utility/if.node.ts#L436)

***

### process()

> **process**(`inputs`, `context`): `Promise` \<[`ProcessOutputMap`](../../../../processor/type-aliases/ProcessOutputMap.md)\>

Processes the inputs based on the conditional logic defined within the node.
This process might involve checking conditions and producing outputs accordingly.

#### Parameters

• **inputs**: [`ProcessInputMap`](../../../../processor/type-aliases/ProcessInputMap.md)

The map containing input data for the node.

• **context**: [`ProcessContext`](../../../../processor/type-aliases/ProcessContext.md)

The processing context.

#### Returns

`Promise` \<[`ProcessOutputMap`](../../../../processor/type-aliases/ProcessOutputMap.md)\>

A promise that resolves to a map of process outputs.

#### Overrides

[`IfNodeImpl`](IfNodeImpl.md) . [`process`](IfNodeImpl.md#process)

#### Source

[packages/core/src/studio/nodes/utility/if.node.ts:457](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/utility/if.node.ts#L457)

***

### removeInputPort()

> **removeInputPort**(`inputPortName`): `boolean`

Removes an existing input port from the node by name. This also updates the condition source list
to no longer include the removed port.

#### Parameters

• **inputPortName**: `string`

The name of the input port to remove.

#### Returns

`boolean`

True if the input port was successfully removed, false otherwise.

#### Source

[packages/core/src/studio/nodes/utility/if.node.ts:234](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/utility/if.node.ts#L234)

***

### removeOutputPort()

> **removeOutputPort**(`outputPortName`): `boolean`

Removes an existing output port from the node by name. This also updates the condition target list
and removes any associated actions.

#### Parameters

• **outputPortName**: `string`

The name of the output port to remove.

#### Returns

`boolean`

True if the output port was successfully removed, false otherwise.

#### Source

[packages/core/src/studio/nodes/utility/if.node.ts:252](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/utility/if.node.ts#L252)

***

### serialize()

> **serialize**(`connections`, `processInfo`?): `Promise` \<[`SerializedNode`](../../../../serde/type-aliases/SerializedNode.md)\>

Serializes the current node instance to a `SerializedNode`, including connection and
process information.

#### Parameters

• **connections**: [`NodeConnection`](../../../type-aliases/NodeConnection.md)[]

An array of `NodeConnection` representing the node's outgoing connections.

• **processInfo?**: [`NodeProcessInfo`](../../../../graph/type-aliases/NodeProcessInfo.md)

Optional information about the node's runtime and memory usage.

#### Returns

`Promise` \<[`SerializedNode`](../../../../serde/type-aliases/SerializedNode.md)\>

A promise that resolves to a `SerializedNode` encapsulating the node's current state and configuration.

#### Inherited from

[`IfNodeImpl`](IfNodeImpl.md) . [`serialize`](IfNodeImpl.md#serialize)

#### Source

[packages/core/src/studio/nodes/base.ts:392](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L392)

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

[`IfNodeImpl`](IfNodeImpl.md) . [`setKwarg`](IfNodeImpl.md#setkwarg)

#### Source

[packages/core/src/studio/nodes/base.ts:208](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L208)

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

[`IfNodeImpl`](IfNodeImpl.md) . [`validateInputs`](IfNodeImpl.md#validateinputs)

#### Source

[packages/core/src/studio/nodes/base.ts:278](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L278)

***

### create()

> `static` **create**(): [`IfNode`](../type-aliases/IfNode.md)

Factory method to create a new instance of IfCondition.
This method initializes a new node with a if-condition instance configured
for managing conditional logic.

#### Returns

[`IfNode`](../type-aliases/IfNode.md)

An instance of IfCondition.

#### Source

[packages/core/src/studio/nodes/utility/if.node.ts:308](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/utility/if.node.ts#L308)

***

### deserialize()

> `static` **deserialize**(`serialized`, `values`, `registry`?): `Promise` \<[`IfNode`](../type-aliases/IfNode.md)\>

Static method to deserialize a node from its serialized representation, handling different
node types via dynamic imports based on the type.

#### Parameters

• **serialized**: [`SerializedNode`](../../../../serde/type-aliases/SerializedNode.md)

The serialized node data.

• **values**: `Record`\<`string`, `unknown`\>= `{}`

Optional values to override or provide additional deserialization context.

• **registry?**

Optional registry containing node and guardrail registrations.

• **registry.guardrails?**: [`GuardrailRegistration`](../../../../registration/guardrails/classes/GuardrailRegistration.md)\<`never`, `never`, `never`\>

• **registry.nodes?**: [`NodeRegistration`](../../../../registration/nodes/classes/NodeRegistration.md)\<`never`, `never`, `never`\>

#### Returns

`Promise` \<[`IfNode`](../type-aliases/IfNode.md)\>

A promise resolving to an instance of `SerializableNode`.

#### Overrides

[`IfNodeImpl`](IfNodeImpl.md) . [`deserialize`](IfNodeImpl.md#deserialize)

#### Source

[packages/core/src/studio/nodes/utility/if.node.ts:329](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/utility/if.node.ts#L329)

***

### nodeFrom()

> `static` **nodeFrom**(`callable`): [`IfNode`](../type-aliases/IfNode.md)

Creates a IfNode configuration from a IfCondition callable instance.

#### Parameters

• **callable**: [`IfCondition`](../../../../condition/classes/IfCondition.md)

An instance of IfCondition defining the interaction logic with if-else logics.

#### Returns

[`IfNode`](../type-aliases/IfNode.md)

A fully configured IfNode specialized for IfCondition operations.

#### Source

[packages/core/src/studio/nodes/utility/if.node.ts:268](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/utility/if.node.ts#L268)
