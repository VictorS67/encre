# Class: TextSplitterNodeImpl

Implementation of a SplitterNode specifically for splitting text data.
This node handles the segmentation of text data into discrete contexts, which can be used
for further processing.

### Node Properties

| Field       | Type                | Description                                                                   |
|-------------|---------------------|-------------------------------------------------------------------------------|
| `type`      | `'splitter'`        | The type of the node, indicating it handles splitting operations.             |
| `subtype`   | `'text'`            | The subtype of the node, specifying that it is specialized for text data.      |
| `data`      | [TextSplitter](../../../../../events/input/transform/splitter/classes/TextSplitter.md)| The callable used for text splitting operations.                               |

### Input Ports

| Port Name   | Supported Types     | Description                                                                 |
|-------------|---------------------|-----------------------------------------------------------------------------|
| `input`     | `string`, `context`, `context[]` | Accepts text data as a string, a context, or an array of contexts for splitting. |

### Output Ports

| Port Name   | Supported Types     | Description                                                                 |
|-------------|---------------------|-----------------------------------------------------------------------------|
| `contexts`  | `context[]`         | Outputs an array of contexts derived from the split text data.              |

## Extends

- [`SplitterNodeImpl`](SplitterNodeImpl.md)

## Constructors

### new TextSplitterNodeImpl()

> **new TextSplitterNodeImpl**(`node`): [`TextSplitterNodeImpl`](TextSplitterNodeImpl.md)

Initializes a new instance of the `CallableNodeImpl` class.

#### Parameters

• **node**: [`SplitterNode`](../type-aliases/SplitterNode.md)

The `CallableNode` data that provides configuration and runtime information.

#### Returns

[`TextSplitterNodeImpl`](TextSplitterNodeImpl.md)

#### Inherited from

[`SplitterNodeImpl`](SplitterNodeImpl.md) . [`constructor`](SplitterNodeImpl.md#constructors)

#### Source

[packages/core/src/studio/nodes/base.ts:503](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L503)

## Properties

### aliases

> `readonly` **aliases**: `SerializedKeyAlias`

Key aliases for serializable data fields.

#### Inherited from

[`SplitterNodeImpl`](SplitterNodeImpl.md) . [`aliases`](SplitterNodeImpl.md#aliases)

#### Source

[packages/core/src/studio/nodes/base.ts:63](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L63)

***

### node

> `readonly` **node**: [`SplitterNode`](../type-aliases/SplitterNode.md)

Reference to the serialized node instance.

#### Inherited from

[`SplitterNodeImpl`](SplitterNodeImpl.md) . [`node`](SplitterNodeImpl.md#node)

#### Source

[packages/core/src/studio/nodes/base.ts:58](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L58)

***

### secrets

> `readonly` **secrets**: `SecretFields`

Secret keys used in the serializable data.

#### Inherited from

[`SplitterNodeImpl`](SplitterNodeImpl.md) . [`secrets`](SplitterNodeImpl.md#secrets)

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

> `get` **inputs**(): `T`\[`"inputs"`\]

Retrieves the input ports of the node.

#### Remarks

It is NOT safe to get actual input ports of the node if the node is in a graph,
please use [getInputPortDefs](TextSplitterNodeImpl.md#getinputportdefs) instead.

#### Returns

`T`\[`"inputs"`\]

#### Source

[packages/core/src/studio/nodes/base.ts:160](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L160)

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

> `get` **outputs**(): `T`\[`"outputs"`\]

Retrieves the output ports of the node.

#### Remarks

It is NOT safe to get actual output ports of the node if the node is in a graph,
please use [getOutputPortDefs](TextSplitterNodeImpl.md#getoutputportdefs) instead.

#### Returns

`T`\[`"outputs"`\]

#### Source

[packages/core/src/studio/nodes/base.ts:171](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L171)

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

### \_postprocess()

`Internal`

> `protected` **\_postprocess**(`rawOutputs`, `context`): `Promise` \<[`ProcessOutputMap`](../../../../processor/type-aliases/ProcessOutputMap.md)\>

Postprocesses the raw output from the splitter, wrapping it into the expected output format.

#### Parameters

• **rawOutputs**: [`Context`](../../../../../events/input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]

The raw contexts generated by the splitter.

• **context**: [`ProcessContext`](../../../../processor/type-aliases/ProcessContext.md)

The processing context, not actively used here.

#### Returns

`Promise` \<[`ProcessOutputMap`](../../../../processor/type-aliases/ProcessOutputMap.md)\>

A map of process outputs keyed by their output port names.

#### Inherited from

[`SplitterNodeImpl`](SplitterNodeImpl.md) . [`_postprocess`](SplitterNodeImpl.md#_postprocess)

#### Source

[packages/core/src/studio/nodes/input/splitter.node.ts:78](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/input/splitter.node.ts#L78)

***

### \_preprocess()

`Internal`

> `protected` **\_preprocess**(`inputs`, `context`): `Promise` \<[`ContextLike`](../../../../../events/input/load/docs/context/type-aliases/ContextLike.md)\>

Preprocesses the input data to ensure it is in a valid format for splitting.
This step ensures that the input data is a string, a single context, or an array of contexts.

#### Parameters

• **inputs**: [`ProcessInputMap`](../../../../processor/type-aliases/ProcessInputMap.md)

The map containing input data for the node.

• **context**: [`ProcessContext`](../../../../processor/type-aliases/ProcessContext.md)

The processing context, not actively used here.

#### Returns

`Promise` \<[`ContextLike`](../../../../../events/input/load/docs/context/type-aliases/ContextLike.md)\>

The validated and cast input data as ContextLike.

#### Inherited from

[`SplitterNodeImpl`](SplitterNodeImpl.md) . [`_preprocess`](SplitterNodeImpl.md#_preprocess)

#### Throws

Error if the inputs are not valid.

#### Source

[packages/core/src/studio/nodes/input/splitter.node.ts:48](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/input/splitter.node.ts#L48)

***

### getBody()

> **getBody**(): `Promise` \<[`NodeBody`](../../../type-aliases/NodeBody.md)\>

Asynchronously constructs a composite body of UI context elements based on the node's
secrets and keyword arguments.

#### Returns

`Promise` \<[`NodeBody`](../../../type-aliases/NodeBody.md)\>

A promise that resolves to a `NodeBody`, potentially containing multiple `UIContext` elements.

#### Inherited from

[`SplitterNodeImpl`](SplitterNodeImpl.md) . [`getBody`](SplitterNodeImpl.md#getbody)

#### Source

[packages/core/src/studio/nodes/base.ts:306](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L306)

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

[`SplitterNodeImpl`](SplitterNodeImpl.md) . [`getInputPortDefs`](SplitterNodeImpl.md#getinputportdefs)

#### Source

[packages/core/src/studio/nodes/base.ts:238](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L238)

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

[`SplitterNodeImpl`](SplitterNodeImpl.md) . [`getOutputPortDefs`](SplitterNodeImpl.md#getoutputportdefs)

#### Source

[packages/core/src/studio/nodes/base.ts:264](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L264)

***

### invoke()

> **invoke**\<`CallInput`, `CallOutput`, `CallOptions`\>(`input`, `options`?): `Promise`\<`CallOutput`\>

Invokes the splitter with the given input under the provided options.
This method directly interfaces with the splitter's callable mechanism.

#### Type parameters

• **CallInput**

• **CallOutput**

• **CallOptions**

#### Parameters

• **input**: `CallInput`

The input data for the splitter, expected to be ContextLike.

• **options?**: `Partial`\<`CallOptions`\>

Optional additional settings for the splitter call.

#### Returns

`Promise`\<`CallOutput`\>

The output from the splitter as specified by the splitter's output type.

#### Inherited from

[`SplitterNodeImpl`](SplitterNodeImpl.md) . [`invoke`](SplitterNodeImpl.md#invoke)

#### Source

[packages/core/src/studio/nodes/input/splitter.node.ts:95](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/input/splitter.node.ts#L95)

***

### process()

> **process**(`inputs`, `context`): `Promise` \<[`ProcessOutputMap`](../../../../processor/type-aliases/ProcessOutputMap.md)\>

Main process method that orchestrates the full lifecycle of data splitting.
This method integrates input validation, preprocessing, splitter invocation, and
postprocessing.

#### Parameters

• **inputs**: [`ProcessInputMap`](../../../../processor/type-aliases/ProcessInputMap.md)

A map containing all inputs to the node.

• **context**: [`ProcessContext`](../../../../processor/type-aliases/ProcessContext.md)

The current processing context.

#### Returns

`Promise` \<[`ProcessOutputMap`](../../../../processor/type-aliases/ProcessOutputMap.md)\>

A map of outputs as processed by the node.

#### Inherited from

[`SplitterNodeImpl`](SplitterNodeImpl.md) . [`process`](SplitterNodeImpl.md#process)

#### Throws

Error if inputs are not valid or if any stage of processing fails.

#### Source

[packages/core/src/studio/nodes/input/splitter.node.ts:118](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/input/splitter.node.ts#L118)

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

[`SplitterNodeImpl`](SplitterNodeImpl.md) . [`serialize`](SplitterNodeImpl.md#serialize)

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

[`SplitterNodeImpl`](SplitterNodeImpl.md) . [`setKwarg`](SplitterNodeImpl.md#setkwarg)

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

[`SplitterNodeImpl`](SplitterNodeImpl.md) . [`validateInputs`](SplitterNodeImpl.md#validateinputs)

#### Source

[packages/core/src/studio/nodes/base.ts:278](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L278)

***

### create()

> `static` **create**(): [`SplitterNode`](../type-aliases/SplitterNode.md)

Factory method to create a new instance of TextSplitterNode.
This method provides a simple way to instantiate a text splitter node with default settings
for splitting text data into multiple contexts.

#### Returns

[`SplitterNode`](../type-aliases/SplitterNode.md)

An instance of SplitterNode prepared with a default TextSplitter.

#### Source

[packages/core/src/studio/nodes/input/splitter.node.ts:202](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/input/splitter.node.ts#L202)

***

### deserialize()

> `static` **deserialize**(`serialized`, `values`, `registry`?): `Promise` \<[`SerializableNode`](../../../interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../../../load/serializable/classes/Serializable.md)\>\>

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

`Promise` \<[`SerializableNode`](../../../interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../../../load/serializable/classes/Serializable.md)\>\>

A promise resolving to an instance of `SerializableNode`.

#### Inherited from

[`SplitterNodeImpl`](SplitterNodeImpl.md) . [`deserialize`](SplitterNodeImpl.md#deserialize)

#### Source

[packages/core/src/studio/nodes/base.ts:326](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L326)

***

### nodeFrom()

> `static` **nodeFrom**(`callable`): [`SplitterNode`](../type-aliases/SplitterNode.md)

Creates a SplitterNode configuration from a TextSplitter callable instance.

#### Parameters

• **callable**: [`TextSplitter`](../../../../../events/input/transform/splitter/classes/TextSplitter.md) \<[`ContextLike`](../../../../../events/input/load/docs/context/type-aliases/ContextLike.md), [`Context`](../../../../../events/input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], [`CallableConfig`](../../../../../record/callable/type-aliases/CallableConfig.md)\>

An instance of TextSplitter defining the splitting logic.

#### Returns

[`SplitterNode`](../type-aliases/SplitterNode.md)

A fully configured SplitterNode specialized for text operations.

#### Source

[packages/core/src/studio/nodes/input/splitter.node.ts:170](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/input/splitter.node.ts#L170)
