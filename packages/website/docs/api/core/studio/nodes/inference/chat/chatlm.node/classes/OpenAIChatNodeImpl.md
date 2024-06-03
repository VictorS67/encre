# Class: OpenAIChatNodeImpl

Implementation of a ChatLMNode specifically using OpenAI's language models.
This node handles the interaction with OpenAI's chat models like gpt-3.5-turbo,
producing chat responses based on provided prompts.

### Node Properties

| Field       | Type                | Description                                                                      |
|-------------|---------------------|----------------------------------------------------------------------------------|
| `type`      | `'chatlm'`          | The type of the node, indicating it handles chat interactions via language models.|
| `subType`   | `'openai'`          | The subtype of the node, specifying that it uses OpenAI's language models.        |
| `data`      | [OpenAIChat](../../../../../../events/inference/chat/llms/openai/chat/classes/OpenAIChat.md)  | The callable used for interacting with OpenAI's language models.                  |

### Input Ports

| Port Name   | Supported Types          | Description                                                         |
|-------------|--------------------------|---------------------------------------------------------------------|
| `prompt`    | `string`, `chat-message[]` | Accepts a string or an array of chat messages as input to the model.|

### Output Ports

| Port Name    | Supported Types           | Description                                                         |
|--------------|---------------------------|---------------------------------------------------------------------|
| `output`     | `string`                  | Outputs the string response from the chat model.                    |
| `message`    | `chat-message`            | Outputs the chat message object as a structured response.           |
| `info`       | `object`, `unknown`       | Outputs additional information about the generation, if available.  |
| `tokenUsage` | `object`, `unknown`       | Outputs information on token usage during the generation process.   |

## Extends

- [`ChatLMNodeImpl`](ChatLMNodeImpl.md)

## Constructors

### new OpenAIChatNodeImpl()

> **new OpenAIChatNodeImpl**(`node`): [`OpenAIChatNodeImpl`](OpenAIChatNodeImpl.md)

Initializes a new instance of the `CallableNodeImpl` class.

#### Parameters

• **node**: [`ChatLMNode`](../type-aliases/ChatLMNode.md)

The `CallableNode` data that provides configuration and runtime information.

#### Returns

[`OpenAIChatNodeImpl`](OpenAIChatNodeImpl.md)

#### Inherited from

[`ChatLMNodeImpl`](ChatLMNodeImpl.md) . [`constructor`](ChatLMNodeImpl.md#constructors)

#### Source

[packages/core/src/studio/nodes/base.ts:503](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L503)

## Properties

### aliases

> `readonly` **aliases**: `SerializedKeyAlias`

Key aliases for serializable data fields.

#### Inherited from

[`ChatLMNodeImpl`](ChatLMNodeImpl.md) . [`aliases`](ChatLMNodeImpl.md#aliases)

#### Source

[packages/core/src/studio/nodes/base.ts:63](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L63)

***

### node

> `readonly` **node**: [`ChatLMNode`](../type-aliases/ChatLMNode.md)

Reference to the serialized node instance.

#### Inherited from

[`ChatLMNodeImpl`](ChatLMNodeImpl.md) . [`node`](ChatLMNodeImpl.md#node)

#### Source

[packages/core/src/studio/nodes/base.ts:58](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L58)

***

### secrets

> `readonly` **secrets**: `SecretFields`

Secret keys used in the serializable data.

#### Inherited from

[`ChatLMNodeImpl`](ChatLMNodeImpl.md) . [`secrets`](ChatLMNodeImpl.md#secrets)

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
please use [getInputPortDefs](OpenAIChatNodeImpl.md#getinputportdefs) instead.

#### Returns

`T`\[`"inputs"`\]

#### Source

[packages/core/src/studio/nodes/base.ts:160](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L160)

***

### kwargs

> `get` **kwargs**(): [`DataFields`](../../../../../data/type-aliases/DataFields.md)

Retrieves keyword arguments for the serializable data.

#### Returns

[`DataFields`](../../../../../data/type-aliases/DataFields.md)

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

> `get` **outputSizes**(): [`NodePortSizes`](../../../../type-aliases/NodePortSizes.md)

Retrieves or initializes output port sizes.

#### Returns

[`NodePortSizes`](../../../../type-aliases/NodePortSizes.md)

#### Source

[packages/core/src/studio/nodes/base.ts:178](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L178)

***

### outputs

> `get` **outputs**(): `T`\[`"outputs"`\]

Retrieves the output ports of the node.

#### Remarks

It is NOT safe to get actual output ports of the node if the node is in a graph,
please use [getOutputPortDefs](OpenAIChatNodeImpl.md#getoutputportdefs) instead.

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

> `protected` **\_postprocess**(`rawOutputs`, `context`): `Promise` \<[`ProcessOutputMap`](../../../../../processor/type-aliases/ProcessOutputMap.md)\>

Postprocesses the raw outputs from the language model, extracting the generated chat responses
and any associated metadata.

#### Parameters

• **rawOutputs**: [`LLMResult`](../../../../../../events/output/provide/llmresult/type-aliases/LLMResult.md)

The raw outputs from the language model invocation.

• **context**: [`ProcessContext`](../../../../../processor/type-aliases/ProcessContext.md)

The processing context, not actively used here.

#### Returns

`Promise` \<[`ProcessOutputMap`](../../../../../processor/type-aliases/ProcessOutputMap.md)\>

A map of process outputs keyed by their output port names.

#### Inherited from

[`ChatLMNodeImpl`](ChatLMNodeImpl.md) . [`_postprocess`](ChatLMNodeImpl.md#_postprocess)

#### Source

[packages/core/src/studio/nodes/inference/chat/chatlm.node.ts:73](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/inference/chat/chatlm.node.ts#L73)

***

### \_preprocess()

`Internal`

> `protected` **\_preprocess**(`inputs`, `context`): `Promise` \<[`BaseLMInput`](../../../../../../events/inference/chat/base/type-aliases/BaseLMInput.md)\>

Preprocesses the input data to ensure it is in a valid format for the language model.
This step ensures that the input data is either a string or an array of chat messages.

#### Parameters

• **inputs**: [`ProcessInputMap`](../../../../../processor/type-aliases/ProcessInputMap.md)

The map containing input data for the node.

• **context**: [`ProcessContext`](../../../../../processor/type-aliases/ProcessContext.md)

The processing context, not actively used here.

#### Returns

`Promise` \<[`BaseLMInput`](../../../../../../events/inference/chat/base/type-aliases/BaseLMInput.md)\>

The validated and cast input data as BaseLMInput.

#### Inherited from

[`ChatLMNodeImpl`](ChatLMNodeImpl.md) . [`_preprocess`](ChatLMNodeImpl.md#_preprocess)

#### Throws

Error if the inputs are not valid.

#### Source

[packages/core/src/studio/nodes/inference/chat/chatlm.node.ts:46](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/inference/chat/chatlm.node.ts#L46)

***

### getBody()

> **getBody**(): `Promise` \<[`NodeBody`](../../../../type-aliases/NodeBody.md)\>

Asynchronously constructs a composite body of UI context elements based on the node's
secrets and keyword arguments.

#### Returns

`Promise` \<[`NodeBody`](../../../../type-aliases/NodeBody.md)\>

A promise that resolves to a `NodeBody`, potentially containing multiple `UIContext` elements.

#### Inherited from

[`ChatLMNodeImpl`](ChatLMNodeImpl.md) . [`getBody`](ChatLMNodeImpl.md#getbody)

#### Source

[packages/core/src/studio/nodes/base.ts:306](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L306)

***

### getInputPortDefs()

> **getInputPortDefs**(`connections`, `nodeMap`): [`NodeInputPortDef`](../../../../type-aliases/NodeInputPortDef.md)[]

Generates definitions for input ports of the node, potentially modifying port requirements based on existing connections.

#### Parameters

• **connections**: [`NodeConnection`](../../../../type-aliases/NodeConnection.md)[]= `[]`

An array of `NodeConnection` representing current node connections.

• **nodeMap**: `Record`\<`RecordId`, [`SerializableNode`](../../../../interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../../../../load/serializable/classes/Serializable.md)\>\>= `{}`

A map of node IDs to `SerializableNode` instances, providing context about other nodes in the system.

#### Returns

[`NodeInputPortDef`](../../../../type-aliases/NodeInputPortDef.md)[]

An array of `NodeInputPortDef` detailing the input port configurations.

#### Inherited from

[`ChatLMNodeImpl`](ChatLMNodeImpl.md) . [`getInputPortDefs`](ChatLMNodeImpl.md#getinputportdefs)

#### Source

[packages/core/src/studio/nodes/base.ts:238](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L238)

***

### getOutputPortDefs()

> **getOutputPortDefs**(`connections`, `nodeMap`): [`NodeOutputPortDef`](../../../../type-aliases/NodeOutputPortDef.md)[]

Generates definitions for output ports of the node.

#### Parameters

• **connections**: [`NodeConnection`](../../../../type-aliases/NodeConnection.md)[]= `[]`

An array of `NodeConnection`, which might be used in future extensions to modify output configurations based on connections.

• **nodeMap**: `Record`\<`RecordId`, [`SerializableNode`](../../../../interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../../../../load/serializable/classes/Serializable.md)\>\>= `{}`

A map of node IDs to `SerializableNode`, similar to `getInputPortDefs`, can be used for context about connections.

#### Returns

[`NodeOutputPortDef`](../../../../type-aliases/NodeOutputPortDef.md)[]

An array of `NodeOutputPortDef` detailing the output port configurations.

#### Inherited from

[`ChatLMNodeImpl`](ChatLMNodeImpl.md) . [`getOutputPortDefs`](ChatLMNodeImpl.md#getoutputportdefs)

#### Source

[packages/core/src/studio/nodes/base.ts:264](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L264)

***

### invoke()

> **invoke**\<`CallInput`, `CallOutput`, `CallOptions`\>(`input`, `options`?): `Promise`\<`CallOutput`\>

Invokes the language model with the given input under the provided options.
This method directly interfaces with the language model's callable mechanism.

#### Type parameters

• **CallInput**

• **CallOutput**

• **CallOptions**

#### Parameters

• **input**: `CallInput`

The input data for the language model, expected to be BaseLMInput.

• **options?**: `Partial`\<`CallOptions`\>

Optional additional settings for the language model call.

#### Returns

`Promise`\<`CallOutput`\>

The output from the language model as specified by the callable's output type.

#### Inherited from

[`ChatLMNodeImpl`](ChatLMNodeImpl.md) . [`invoke`](ChatLMNodeImpl.md#invoke)

#### Source

[packages/core/src/studio/nodes/inference/chat/chatlm.node.ts:109](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/inference/chat/chatlm.node.ts#L109)

***

### process()

> **process**(`inputs`, `context`): `Promise` \<[`ProcessOutputMap`](../../../../../processor/type-aliases/ProcessOutputMap.md)\>

Main process method that orchestrates the full lifecycle of chat generation using a language model.
This method integrates input validation, preprocessing, language model invocation, and postprocessing.

#### Parameters

• **inputs**: [`ProcessInputMap`](../../../../../processor/type-aliases/ProcessInputMap.md)

A map containing all inputs to the node.

• **context**: [`ProcessContext`](../../../../../processor/type-aliases/ProcessContext.md)

The current processing context.

#### Returns

`Promise` \<[`ProcessOutputMap`](../../../../../processor/type-aliases/ProcessOutputMap.md)\>

A map of outputs as processed by the node, including the generated output, any structured messages, and additional info.

#### Overrides

[`ChatLMNodeImpl`](ChatLMNodeImpl.md) . [`process`](ChatLMNodeImpl.md#process)

#### Throws

Error if inputs are not valid or if any stage of processing fails.

#### Source

[packages/core/src/studio/nodes/inference/chat/chatlm.node.ts:213](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/inference/chat/chatlm.node.ts#L213)

***

### serialize()

> **serialize**(`connections`, `processInfo`?): `Promise` \<[`SerializedNode`](../../../../../serde/type-aliases/SerializedNode.md)\>

Serializes the current node instance to a `SerializedNode`, including connection and
process information.

#### Parameters

• **connections**: [`NodeConnection`](../../../../type-aliases/NodeConnection.md)[]

An array of `NodeConnection` representing the node's outgoing connections.

• **processInfo?**: [`NodeProcessInfo`](../../../../../graph/type-aliases/NodeProcessInfo.md)

Optional information about the node's runtime and memory usage.

#### Returns

`Promise` \<[`SerializedNode`](../../../../../serde/type-aliases/SerializedNode.md)\>

A promise that resolves to a `SerializedNode` encapsulating the node's current state and configuration.

#### Inherited from

[`ChatLMNodeImpl`](ChatLMNodeImpl.md) . [`serialize`](ChatLMNodeImpl.md#serialize)

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

[`ChatLMNodeImpl`](ChatLMNodeImpl.md) . [`setKwarg`](ChatLMNodeImpl.md#setkwarg)

#### Source

[packages/core/src/studio/nodes/base.ts:208](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L208)

***

### validateInputs()

> **validateInputs**(`inputs`?): `boolean`

Validates the provided inputs against the node's required inputs to ensure all necessary
data is present and correctly formatted.

#### Parameters

• **inputs?**: [`ProcessInputMap`](../../../../../processor/type-aliases/ProcessInputMap.md)

An optional map of process input data keyed by input port names.

#### Returns

`boolean`

A boolean indicating whether the provided inputs meet all requirements specified by the node's input configuration.

#### Inherited from

[`ChatLMNodeImpl`](ChatLMNodeImpl.md) . [`validateInputs`](ChatLMNodeImpl.md#validateinputs)

#### Source

[packages/core/src/studio/nodes/base.ts:278](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L278)

***

### create()

> `static` **create**(): [`ChatLMNode`](../type-aliases/ChatLMNode.md)

Factory method to create a new instance of ChatLMNode.
This method provides a simple way to instantiate a chatlm node with default settings,
preparing it for use in requesting openai chat model.

#### Returns

[`ChatLMNode`](../type-aliases/ChatLMNode.md)

An instance of ChatLMNode prepared with a default OpenAIChat.

#### Source

[packages/core/src/studio/nodes/inference/chat/chatlm.node.ts:193](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/inference/chat/chatlm.node.ts#L193)

***

### deserialize()

> `static` **deserialize**(`serialized`, `values`, `registry`?): `Promise` \<[`SerializableNode`](../../../../interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../../../../load/serializable/classes/Serializable.md)\>\>

Static method to deserialize a node from its serialized representation, handling different
node types via dynamic imports based on the type.

#### Parameters

• **serialized**: [`SerializedNode`](../../../../../serde/type-aliases/SerializedNode.md)

The serialized node data.

• **values**: `Record`\<`string`, `unknown`\>= `{}`

Optional values to override or provide additional deserialization context.

• **registry?**

Optional registry containing node and guardrail registrations.

• **registry.guardrails?**: [`GuardrailRegistration`](../../../../../registration/guardrails/classes/GuardrailRegistration.md)\<`never`, `never`, `never`\>

• **registry.nodes?**: [`NodeRegistration`](../../../../../registration/nodes/classes/NodeRegistration.md)\<`never`, `never`, `never`\>

#### Returns

`Promise` \<[`SerializableNode`](../../../../interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../../../../load/serializable/classes/Serializable.md)\>\>

A promise resolving to an instance of `SerializableNode`.

#### Inherited from

[`ChatLMNodeImpl`](ChatLMNodeImpl.md) . [`deserialize`](ChatLMNodeImpl.md#deserialize)

#### Source

[packages/core/src/studio/nodes/base.ts:326](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L326)

***

### nodeFrom()

> `static` **nodeFrom**(`callable`): [`ChatLMNode`](../type-aliases/ChatLMNode.md)

Creates a ChatLMNode configuration from a OpenAIChat callable instance.

#### Parameters

• **callable**: [`OpenAIChat`](../../../../../../events/inference/chat/llms/openai/chat/classes/OpenAIChat.md)\<`OpenAIChatCallOptions`\>

An instance of OpenAIChat defining the openai chat model.

#### Returns

[`ChatLMNode`](../type-aliases/ChatLMNode.md)

A fully configured ChatLMNode specialized for openai chat model.

#### Source

[packages/core/src/studio/nodes/inference/chat/chatlm.node.ts:158](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/inference/chat/chatlm.node.ts#L158)
