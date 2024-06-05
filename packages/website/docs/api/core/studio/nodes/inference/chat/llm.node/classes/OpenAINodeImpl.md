# Class: OpenAINodeImpl

Implementation of an LLMNode specifically using OpenAI's language models.
This node handles the interaction with OpenAI's text models such as "text-davinci-003",
producing text responses based on provided prompts.

### Node Properties

| Field       | Type              | Description                                                                      |
|-------------|-------------------|----------------------------------------------------------------------------------|
| `type`      | `'llm'`           | The type of the node, indicating it handles language model interactions.         |
| `subType`   | `'openai'`        | The subtype of the node, specifying that it uses OpenAI's language models.        |
| `data`      | [OpenAI](../../../../../../events/inference/chat/llms/openai/text/classes/OpenAI.md)    | The callable used for interacting with OpenAI's language models.                  |

### Input Ports

| Port Name   | Supported Types          | Description                                                         |
|-------------|--------------------------|---------------------------------------------------------------------|
| `prompt`    | `string`, `chat-message[]` | Accepts a string or an array of chat messages as input to the model.|

### Output Ports

| Port Name    | Supported Types           | Description                                                         |
|--------------|---------------------------|---------------------------------------------------------------------|
| `output`     | `string`                  | Outputs the text response from the model.                          |
| `info`       | `object`, `unknown`       | Outputs additional information about the generation, if available. |
| `tokenUsage` | `object`, `unknown`       | Outputs information on token usage during the generation process.  |

## Extends

- [`LLMNodeImpl`](LLMNodeImpl.md)

## Constructors

### new OpenAINodeImpl()

> **new OpenAINodeImpl**(`node`): [`OpenAINodeImpl`](OpenAINodeImpl.md)

Initializes a new instance of the `CallableNodeImpl` class.

#### Parameters

• **node**: [`LLMNode`](../type-aliases/LLMNode.md)

The `CallableNode` data that provides configuration and runtime information.

#### Returns

[`OpenAINodeImpl`](OpenAINodeImpl.md)

#### Inherited from

[`LLMNodeImpl`](LLMNodeImpl.md) . [`constructor`](LLMNodeImpl.md#constructors)

#### Source

[packages/core/src/studio/nodes/base.ts:503](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L503)

## Properties

### aliases

> `readonly` **aliases**: `SerializedKeyAlias`

Key aliases for serializable data fields.

#### Inherited from

[`LLMNodeImpl`](LLMNodeImpl.md) . [`aliases`](LLMNodeImpl.md#aliases)

#### Source

[packages/core/src/studio/nodes/base.ts:63](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L63)

***

### node

> `readonly` **node**: [`LLMNode`](../type-aliases/LLMNode.md)

Reference to the serialized node instance.

#### Inherited from

[`LLMNodeImpl`](LLMNodeImpl.md) . [`node`](LLMNodeImpl.md#node)

#### Source

[packages/core/src/studio/nodes/base.ts:58](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L58)

***

### secrets

> `readonly` **secrets**: `SecretFields`

Secret keys used in the serializable data.

#### Inherited from

[`LLMNodeImpl`](LLMNodeImpl.md) . [`secrets`](LLMNodeImpl.md#secrets)

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
please use [getInputPortDefs](OpenAINodeImpl.md#getinputportdefs) instead.

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
please use [getOutputPortDefs](OpenAINodeImpl.md#getoutputportdefs) instead.

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

Postprocesses the raw outputs from the language model, extracting the generated text
and any associated metadata such as token usage.

#### Parameters

• **rawOutputs**: [`LLMResult`](../../../../../../events/output/provide/llmresult/type-aliases/LLMResult.md)

The raw outputs from the language model invocation.

• **context**: [`ProcessContext`](../../../../../processor/type-aliases/ProcessContext.md)

The processing context, not actively used here.

#### Returns

`Promise` \<[`ProcessOutputMap`](../../../../../processor/type-aliases/ProcessOutputMap.md)\>

A map of process outputs keyed by their output port names.

#### Inherited from

[`LLMNodeImpl`](LLMNodeImpl.md) . [`_postprocess`](LLMNodeImpl.md#_postprocess)

#### Source

[packages/core/src/studio/nodes/inference/chat/llm.node.ts:74](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/inference/chat/llm.node.ts#L74)

***

### \_preprocess()

`Internal`

> `protected` **\_preprocess**(`inputs`, `context`): `Promise` \<[`BaseLMInput`](../../../../../../events/inference/chat/base/type-aliases/BaseLMInput.md)\>

Preprocesses the input data to ensure it is in a valid format for the language model.
This step ensures that the input data is either a string or an array of chat messages,
suitable for processing by the language model.

#### Parameters

• **inputs**: [`ProcessInputMap`](../../../../../processor/type-aliases/ProcessInputMap.md)

The map containing input data for the node.

• **context**: [`ProcessContext`](../../../../../processor/type-aliases/ProcessContext.md)

The processing context, not actively used here.

#### Returns

`Promise` \<[`BaseLMInput`](../../../../../../events/inference/chat/base/type-aliases/BaseLMInput.md)\>

The validated and cast input data as BaseLMInput.

#### Inherited from

[`LLMNodeImpl`](LLMNodeImpl.md) . [`_preprocess`](LLMNodeImpl.md#_preprocess)

#### Throws

Error if the inputs are not valid.

#### Source

[packages/core/src/studio/nodes/inference/chat/llm.node.ts:47](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/inference/chat/llm.node.ts#L47)

***

### getBody()

> **getBody**(): `Promise` \<[`NodeBody`](../../../../type-aliases/NodeBody.md)\>

Asynchronously constructs a composite body of UI context elements based on the node's
secrets and keyword arguments.

#### Returns

`Promise` \<[`NodeBody`](../../../../type-aliases/NodeBody.md)\>

A promise that resolves to a `NodeBody`, potentially containing multiple `UIContext` elements.

#### Inherited from

[`LLMNodeImpl`](LLMNodeImpl.md) . [`getBody`](LLMNodeImpl.md#getbody)

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

[`LLMNodeImpl`](LLMNodeImpl.md) . [`getInputPortDefs`](LLMNodeImpl.md#getinputportdefs)

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

[`LLMNodeImpl`](LLMNodeImpl.md) . [`getOutputPortDefs`](LLMNodeImpl.md#getoutputportdefs)

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

[`LLMNodeImpl`](LLMNodeImpl.md) . [`invoke`](LLMNodeImpl.md#invoke)

#### Source

[packages/core/src/studio/nodes/inference/chat/llm.node.ts:107](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/inference/chat/llm.node.ts#L107)

***

### process()

> **process**(`inputs`, `context`): `Promise` \<[`ProcessOutputMap`](../../../../../processor/type-aliases/ProcessOutputMap.md)\>

Main process method that orchestrates the full lifecycle of text generation using OpenAI's language model.
This method integrates input validation, preprocessing, language model invocation, and postprocessing,
ensuring a seamless interaction tailored to the specifics of the OpenAI model capabilities.

#### Parameters

• **inputs**: [`ProcessInputMap`](../../../../../processor/type-aliases/ProcessInputMap.md)

A map containing all inputs to the node.

• **context**: [`ProcessContext`](../../../../../processor/type-aliases/ProcessContext.md)

The current processing context.

#### Returns

`Promise` \<[`ProcessOutputMap`](../../../../../processor/type-aliases/ProcessOutputMap.md)\>

A map of outputs as processed by the node, including the generated output, any additional information, and token usage details.

#### Overrides

[`LLMNodeImpl`](LLMNodeImpl.md) . [`process`](LLMNodeImpl.md#process)

#### Throws

Error if inputs are not valid or if any stage of processing fails.

#### Source

[packages/core/src/studio/nodes/inference/chat/llm.node.ts:211](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/inference/chat/llm.node.ts#L211)

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

[`LLMNodeImpl`](LLMNodeImpl.md) . [`serialize`](LLMNodeImpl.md#serialize)

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

[`LLMNodeImpl`](LLMNodeImpl.md) . [`setKwarg`](LLMNodeImpl.md#setkwarg)

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

[`LLMNodeImpl`](LLMNodeImpl.md) . [`validateInputs`](LLMNodeImpl.md#validateinputs)

#### Source

[packages/core/src/studio/nodes/base.ts:278](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L278)

***

### create()

> `static` **create**(): [`LLMNode`](../type-aliases/LLMNode.md)

Factory method to create a new instance of LLMNode.
This method initializes a new node with a OpenAI instance configured
for a specific model and API integration, providing a tailored approach to text generation.

#### Returns

[`LLMNode`](../type-aliases/LLMNode.md)

An instance of OpenAI prepared with a OpenAI configured for openai's model.

#### Source

[packages/core/src/studio/nodes/inference/chat/llm.node.ts:189](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/inference/chat/llm.node.ts#L189)

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

[`LLMNodeImpl`](LLMNodeImpl.md) . [`deserialize`](LLMNodeImpl.md#deserialize)

#### Source

[packages/core/src/studio/nodes/base.ts:326](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/base.ts#L326)

***

### nodeFrom()

> `static` **nodeFrom**(`callable`): [`LLMNode`](../type-aliases/LLMNode.md)

Creates a LLMNode configuration from a OpenAI callable instance.

#### Parameters

• **callable**: [`OpenAI`](../../../../../../events/inference/chat/llms/openai/text/classes/OpenAI.md)\<`OpenAITextCallOptions`\>

An instance of OpenAI defining the interaction logic with OpenAI's models.

#### Returns

[`LLMNode`](../type-aliases/LLMNode.md)

A fully configured LLMNode specialized for OpenAI operations.

#### Source

[packages/core/src/studio/nodes/inference/chat/llm.node.ts:155](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/inference/chat/llm.node.ts#L155)