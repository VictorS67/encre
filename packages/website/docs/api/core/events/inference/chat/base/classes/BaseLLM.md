# Class: `abstract` BaseLLM\<CallOptions\>

Abstract class representing the BaseLLM. This class provides core functionalities
to interface with a language model, potentially allowing for both cached and uncached predictions.

## Extends

- [`BaseLM`](BaseLM.md) \<[`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md), `CallOptions`\>

## Extended by

- [`OpenAI`](../../llms/openai/text/classes/OpenAI.md)
- [`Gemini`](../../llms/vertexai/gemini/text/classes/Gemini.md)

## Type parameters

• **CallOptions** *extends* [`BaseLLMCallOptions`](../interfaces/BaseLLMCallOptions.md) = [`BaseLLMCallOptions`](../interfaces/BaseLLMCallOptions.md)

Represents the call options type. By default, it extends from [BaseLLMCallOptions](../interfaces/BaseLLMCallOptions.md).

## Constructors

### new BaseLLM()

> **new BaseLLM**\<`CallOptions`\>(`fields`): [`BaseLLM`](BaseLLM.md)\<`CallOptions`\>

Constructor for the BaseLLM class.

#### Parameters

• **fields**: [`BaseLLMParams`](../interfaces/BaseLLMParams.md)

Parameters to initialize the base language model.

#### Returns

[`BaseLLM`](BaseLLM.md)\<`CallOptions`\>

#### Overrides

[`BaseLM`](BaseLM.md) . [`constructor`](BaseLM.md#constructors)

#### Source

[packages/core/src/events/inference/chat/base.ts:248](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L248)

## Properties

### \_isCallable

> **\_isCallable**: `boolean` = `true`

Indicates if the instance is callable. If false, then the callable cannot be invoked.

#### Inherited from

[`BaseLM`](BaseLM.md) . [`_isCallable`](BaseLM.md#_iscallable)

#### Source

[packages/core/src/record/callable.ts:188](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L188)

***

### \_isSerializable

> **\_isSerializable**: `boolean` = `false`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Inherited from

[`BaseLM`](BaseLM.md) . [`_isSerializable`](BaseLM.md#_isserializable)

#### Source

[packages/core/src/load/serializable.ts:163](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L163)

***

### \_kwargs

> **\_kwargs**: `SerializedFields`

Key-value pairs of properties to be serialized.

#### Inherited from

[`BaseLM`](BaseLM.md) . [`_kwargs`](BaseLM.md#_kwargs)

#### Source

[packages/core/src/load/serializable.ts:168](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L168)

***

### \_namespace

> **\_namespace**: `string`[]

Unique namespace identifier for the serialized object, represented as an array of strings.

#### Inherited from

[`BaseLM`](BaseLM.md) . [`_namespace`](BaseLM.md#_namespace)

#### Source

[packages/core/src/events/base.ts:44](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L44)

***

### cache?

> `optional` **cache**: [`BaseCache`](../../../../../cache/base/classes/BaseCache.md) \<[`Generation`](../../../../output/provide/generation/interfaces/Generation.md)[]\>

Cache instance to store and retrieve results for given prompts.

#### Inherited from

[`BaseLM`](BaseLM.md) . [`cache`](BaseLM.md#cache)

#### Source

[packages/core/src/events/inference/chat/base.ts:93](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L93)

***

### callbacks?

`Experimental`

> `optional` **callbacks**: `any`

not-implemented yet

#### Inherited from

[`BaseLM`](BaseLM.md) . [`callbacks`](BaseLM.md#callbacks)

#### Source

[packages/core/src/events/base.ts:79](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L79)

***

### caller

> **caller**: `AsyncCaller`

Instance responsible for making asynchronous calls.

#### Inherited from

[`BaseLM`](BaseLM.md) . [`caller`](BaseLM.md#caller)

#### Source

[packages/core/src/events/inference/chat/base.ts:88](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L88)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Inherited from

[`BaseLM`](BaseLM.md) . [`metadata`](BaseLM.md#metadata)

#### Source

[packages/core/src/events/base.ts:74](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L74)

***

### name?

`Experimental`

> `optional` **name**: `string`

The name of the callable, used for identification or logging.

not-implement yet

#### Inherited from

[`BaseLM`](BaseLM.md) . [`name`](BaseLM.md#name)

#### Source

[packages/core/src/events/base.ts:61](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L61)

***

### tags?

`Experimental`

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables.

not-implement yet

#### Inherited from

[`BaseLM`](BaseLM.md) . [`tags`](BaseLM.md#tags)

#### Source

[packages/core/src/events/base.ts:69](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L69)

***

### verbose

`Experimental`

> **verbose**: `boolean`

Specifies whether the event should provide verbose output, such as detailed logs or response texts.
This can be useful for debugging or detailed monitoring of event handling processes.

not-implement yet

#### Inherited from

[`BaseLM`](BaseLM.md) . [`verbose`](BaseLM.md#verbose)

#### Source

[packages/core/src/events/base.ts:53](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L53)

## Accessors

### \_aliases

> `get` **\_aliases**(): `undefined` \| `SerializedFields`

Retrieves alias mappings for the object's attribute names.

#### Returns

`undefined` \| `SerializedFields`

An object representing key aliases, or undefined if none are defined.

#### Source

[packages/core/src/load/serializable.ts:217](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L217)

***

### \_attributes

> `get` **\_attributes**(): `undefined` \| `SerializedFields`

Retrieves attributes of the object.

#### Returns

`undefined` \| `SerializedFields`

An object representing attributes, or undefined if none are defined.

#### Source

[packages/core/src/events/base.ts:81](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L81)

***

### \_id

> `get` **\_id**(): `string`[]

Retrieves the name of the class. This provides a unique identifier for serialization.

#### Returns

`string`[]

The path of serializable.

#### Source

[packages/core/src/load/serializable.ts:187](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L187)

***

### \_secrets

> `get` **\_secrets**(): `undefined` \| `SecretFields`

Retrieves any secrets defined in the object.

#### Returns

`undefined` \| `SecretFields`

An object representing secret fields, or undefined if none are defined.

#### Source

[packages/core/src/load/serializable.ts:199](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L199)

## Methods

### \_eventNamespace()

> **\_eventNamespace**(): `string`[]

A predefined namespace array to identify the type of language model and other related namespaces.

#### Returns

`string`[]

#### Overrides

`BaseLM._eventNamespace`

#### Source

[packages/core/src/events/inference/chat/base.ts:240](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L240)

***

### \_failedAttemptHandler()

> `protected` **\_failedAttemptHandler**(`e`): `void`

Custom handler for failed asynchronous attempts.

#### Parameters

• **e**: `Error`

The error encountered during an attempt.

#### Returns

`void`

#### Inherited from

[`BaseLM`](BaseLM.md) . [`_failedAttemptHandler`](BaseLM.md#_failedattempthandler)

#### Source

[packages/core/src/events/inference/chat/base.ts:210](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L210)

***

### \_getLLMStrKey()

`Internal`

> `protected` **\_getLLMStrKey**(`callOptions`): `string`

Constructs a string key based on the given call options for caching purposes.

#### Parameters

• **callOptions**: `CallOptions`

The call options.

#### Returns

`string`

The generated key.

#### Inherited from

[`BaseLM`](BaseLM.md) . [`_getLLMStrKey`](BaseLM.md#_getllmstrkey)

#### Source

[packages/core/src/events/inference/chat/base.ts:185](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L185)

***

### \_identifyParams()

`Internal`

> `protected` **\_identifyParams**(): `Record`\<`string`, `any`\>

Method to identify additional parameters specific to implementations.

#### Returns

`Record`\<`string`, `any`\>

A record of identified parameters.

#### Inherited from

[`BaseLM`](BaseLM.md) . [`_identifyParams`](BaseLM.md#_identifyparams)

#### Source

[packages/core/src/events/inference/chat/base.ts:175](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L175)

***

### \_llmType()

> `abstract` **\_llmType**(): `string`

Returns the LLM type.

#### Returns

`string`

The type of LLM.

#### Inherited from

[`BaseLM`](BaseLM.md) . [`_llmType`](BaseLM.md#_llmtype)

#### Source

[packages/core/src/events/inference/chat/base.ts:119](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L119)

***

### \_modelType()

> **\_modelType**(): `string`

Returns the type of the model.

#### Returns

`string`

The type of the model.

#### Overrides

[`BaseLM`](BaseLM.md) . [`_modelType`](BaseLM.md#_modeltype)

#### Source

[packages/core/src/events/inference/chat/base.ts:256](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L256)

***

### \_provide()

> `abstract` **\_provide**(`prompt`, `options`): `Promise` \<[`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

Abstract method that interfaces with the underlying language model. Must be implemented by subclasses.

#### Parameters

• **prompt**: `string`

A prompt.

• **options**: `Omit`\<`CallOptions`, `never`\>

Call options.

#### Returns

`Promise` \<[`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

The result from the language model.

#### Source

[packages/core/src/events/inference/chat/base.ts:339](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L339)

***

### \_provideUncached()

> `protected` **\_provideUncached**(`prompt`, `serializedCallOptions`): `Promise` \<[`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

Handles uncached prompts and calls the `_provide` method.

#### Parameters

• **prompt**: `string`

A prompt.

• **serializedCallOptions**: `Omit`\<`CallOptions`, `never`\>

Serialized call options.

#### Returns

`Promise` \<[`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

The result from the language model.

#### Source

[packages/core/src/events/inference/chat/base.ts:350](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L350)

***

### \_splitCallableOptionsFromCallOptions()

> `protected` **\_splitCallableOptionsFromCallOptions**(`options`?): [[`CallableConfig`](../../../../../record/callable/type-aliases/CallableConfig.md), `Omit`\<`CallOptions`, `never`\>]

Splits the provided call options into callable options and serialized options.

#### Parameters

• **options?**: `Partial`\<`CallOptions`\>

Call options.

#### Returns

[[`CallableConfig`](../../../../../record/callable/type-aliases/CallableConfig.md), `Omit`\<`CallOptions`, `never`\>]

A tuple containing callable options and serialized options.

#### Overrides

`BaseLM._splitCallableOptionsFromCallOptions`

#### Source

[packages/core/src/events/inference/chat/base.ts:371](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L371)

***

### \_streamIterator()

`Internal`

> **\_streamIterator**(`input`, `options`?): `AsyncGenerator` \<[`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md), `any`, `unknown`\>

Creates an async generator for streaming callable outputs.
This protected method is used internally for streaming operations.

#### Parameters

• **input**: [`BaseLMInput`](../type-aliases/BaseLMInput.md)

The input for the callable.

• **options?**: `Partial`\<`CallOptions`\>

Optional additional options for the callable.

#### Returns

`AsyncGenerator` \<[`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md), `any`, `unknown`\>

An async generator yielding callable outputs.

#### Inherited from

[`BaseLM`](BaseLM.md) . [`_streamIterator`](BaseLM.md#_streamiterator)

#### Source

[packages/core/src/record/callable.ts:429](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L429)

***

### batch()

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise` \<[`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md)[]\>

Batch calls invoke N times, where N is the length of inputs.

##### Parameters

• **inputs**: [`BaseLMInput`](../type-aliases/BaseLMInput.md)[]

Array of inputs in each call in a batch.

• **options?**: `Partial`\<`CallOptions`\> \| `Partial`\<`CallOptions`\>[]

Either a single call options to apply to each call or an array of options for each call.

• **batchOptions?**: [`CallableBatchOptions`](../../../../../record/callable/type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise` \<[`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md)[]\>

An arrays of CallOutputs, or mixed CallOutputs and Errors (if returnExceptions is true).

##### Inherited from

[`BaseLM`](BaseLM.md) . [`batch`](BaseLM.md#batch)

##### Source

[packages/core/src/record/callable.ts:368](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L368)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| [`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md))[]\>

##### Parameters

• **inputs**: [`BaseLMInput`](../type-aliases/BaseLMInput.md)[]

• **options?**: `Partial`\<`CallOptions`\> \| `Partial`\<`CallOptions`\>[]

• **batchOptions?**: [`CallableBatchOptions`](../../../../../record/callable/type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise`\<(`Error` \| [`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md))[]\>

##### Inherited from

[`BaseLM`](BaseLM.md) . [`batch`](BaseLM.md#batch)

##### Source

[packages/core/src/record/callable.ts:374](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L374)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| [`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md))[]\>

##### Parameters

• **inputs**: [`BaseLMInput`](../type-aliases/BaseLMInput.md)[]

• **options?**: `Partial`\<`CallOptions`\> \| `Partial`\<`CallOptions`\>[]

• **batchOptions?**: [`CallableBatchOptions`](../../../../../record/callable/type-aliases/CallableBatchOptions.md)

##### Returns

`Promise`\<(`Error` \| [`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md))[]\>

##### Inherited from

[`BaseLM`](BaseLM.md) . [`batch`](BaseLM.md#batch)

##### Source

[packages/core/src/record/callable.ts:380](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L380)

***

### bind()

> **bind**(`kwargs`): [`Callable`](../../../../../record/callable/classes/Callable.md) \<[`BaseLMInput`](../type-aliases/BaseLMInput.md), [`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md), `CallOptions`\>

Creates a new [CallableBind](../../../../../record/callable/classes/CallableBind.md) instance with the specified keyword arguments.
This method allows partial reconfiguration of the callable instance.

#### Parameters

• **kwargs**: `Partial`\<`CallOptions`\>

Partial keyword arguments for the callable configuration.

#### Returns

[`Callable`](../../../../../record/callable/classes/Callable.md) \<[`BaseLMInput`](../type-aliases/BaseLMInput.md), [`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md), `CallOptions`\>

A new [CallableBind](../../../../../record/callable/classes/CallableBind.md) instance with the given keyword arguments.

#### Inherited from

[`BaseLM`](BaseLM.md) . [`bind`](BaseLM.md#bind)

#### Source

[packages/core/src/record/callable.ts:343](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L343)

***

### getAttributes()

> **getAttributes**(): `object`

Retrieves a comprehensive representation of the object's attributes, secrets, and aliases.

#### Returns

`object`

An object containing aliases, secrets, and keyword arguments.

##### aliases

> **aliases**: `SerializedKeyAlias`

##### kwargs

> **kwargs**: `SerializedFields`

##### metadata

> **metadata**: `object`

##### metadata.callables?

> `optional` **callables**: [`SerializedCallableFields`](../../../../../record/callable/type-aliases/SerializedCallableFields.md)

##### metadata.type

> **type**: `string`

##### secrets

> **secrets**: `SecretFields`

#### Inherited from

[`BaseLM`](BaseLM.md) . [`getAttributes`](BaseLM.md#getattributes)

#### Source

[packages/core/src/record/callable.ts:511](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L511)

***

### getParams()

> `abstract` **getParams**(`options`?): `Record`\<`string`, `unknown`\>

Returns the parameters of the model.

#### Parameters

• **options?**: `Omit`\<`CallOptions`, `never`\>

#### Returns

`Record`\<`string`, `unknown`\>

The parameters of the model.

#### Source

[packages/core/src/events/inference/chat/base.ts:264](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L264)

***

### invoke()

> **invoke**(`input`, `options`?): `Promise` \<[`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

Invokes the language model with a given input and options.

#### Parameters

• **input**: [`BaseLMInput`](../type-aliases/BaseLMInput.md)

The input for the language model.

• **options?**: `CallOptions`

Optional call options.

#### Returns

`Promise` \<[`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

The output llm result from the language model.

#### Overrides

[`BaseLM`](BaseLM.md) . [`invoke`](BaseLM.md#invoke)

#### Source

[packages/core/src/events/inference/chat/base.ts:274](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L274)

***

### map()

> **map**(): [`Callable`](../../../../../record/callable/classes/Callable.md) \<[`BaseLMInput`](../type-aliases/BaseLMInput.md)[], [`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md)[], `CallOptions`\>

Creates a new [CallableEach](../../../../../record/callable/classes/CallableEach.md) instance for mapping inputs to outputs.
This method allows applying the callable to each input in an array of inputs.

#### Returns

[`Callable`](../../../../../record/callable/classes/Callable.md) \<[`BaseLMInput`](../type-aliases/BaseLMInput.md)[], [`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md)[], `CallOptions`\>

A new [CallableEach](../../../../../record/callable/classes/CallableEach.md) instance for mapping operation.

#### Inherited from

[`BaseLM`](BaseLM.md) . [`map`](BaseLM.md#map)

#### Source

[packages/core/src/record/callable.ts:355](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L355)

***

### pipe()

> **pipe**\<`NewCallOutput`\>(`callableLike`): [`CallableSequence`](../../../../../record/callable/classes/CallableSequence.md) \<[`BaseLMInput`](../type-aliases/BaseLMInput.md), `NewCallOutput`\>

Chains the current callable with another callable, creating a sequence.
This method allows sequential execution of multiple callables.

#### Type parameters

• **NewCallOutput**

#### Parameters

• **callableLike**: [`CallableLike`](../../../../../record/callable/type-aliases/CallableLike.md) \<[`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md), `NewCallOutput`\>

The next callable in the sequence.

#### Returns

[`CallableSequence`](../../../../../record/callable/classes/CallableSequence.md) \<[`BaseLMInput`](../type-aliases/BaseLMInput.md), `NewCallOutput`\>

A new [CallableSequence](../../../../../record/callable/classes/CallableSequence.md) instance representing the chained callables.

#### Inherited from

[`BaseLM`](BaseLM.md) . [`pipe`](BaseLM.md#pipe)

#### Source

[packages/core/src/record/callable.ts:460](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L460)

***

### provide()

> **provide**(`prompt`, `options`?, `callbacks`?): `Promise` \<[`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

Provides the core logic to interface with the language model, handling both cached and uncached predictions.

#### Parameters

• **prompt**: `string`

A prompt.

• **options?**: `string`[] \| `CallOptions`

Optional call options or an array of stop words.

• **callbacks?**: `any`

Optional callbacks.

#### Returns

`Promise` \<[`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

The result from the language model.

#### Overrides

[`BaseLM`](BaseLM.md) . [`provide`](BaseLM.md#provide)

#### Source

[packages/core/src/events/inference/chat/base.ts:292](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L292)

***

### stream()

> **stream**(`input`, `options`?): `Promise`\<`ReadableStreamAsyncIterable` \<[`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>\>

Creates a readable stream for the callable outputs.
This method allows streaming the outputs of the callable for continuous data.

#### Parameters

• **input**: [`BaseLMInput`](../type-aliases/BaseLMInput.md)

The input for the callable.

• **options?**: `Partial`\<`CallOptions`\>

Optional additional options for the callable.

#### Returns

`Promise`\<`ReadableStreamAsyncIterable` \<[`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>\>

A promise that resolves to a readable stream of callable outputs.

#### Inherited from

[`BaseLM`](BaseLM.md) . [`stream`](BaseLM.md#stream)

#### Source

[packages/core/src/record/callable.ts:444](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L444)

***

### toJSON()

> **toJSON**(): [`Serialized`](../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized representation based on the object's current state. This method determines whether to use a 'not implemented' or 'constructor' format based on the object's serializability.

#### Returns

[`Serialized`](../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`BaseLM`](BaseLM.md) . [`toJSON`](BaseLM.md#tojson)

#### Source

[packages/core/src/load/serializable.ts:665](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L665)

***

### toJSONConstructor()

> **toJSONConstructor**(`aliases`, `secrets`, `kwargs`): [`Serialized`](../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized constructor format. This method provides a way to serialize object construction details, including any aliases or secrets.

#### Parameters

• **aliases**: `SerializedKeyAlias`

Key aliases to include in the serialized output.

• **secrets**: `SecretFields`

Secrets to be secured in the serialized output.

• **kwargs**: `SerializedFields`

Additional keyword arguments to include in the serialized output.

#### Returns

[`Serialized`](../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object as a constructor.

#### Inherited from

[`BaseLM`](BaseLM.md) . [`toJSONConstructor`](BaseLM.md#tojsonconstructor)

#### Source

[packages/core/src/load/serializable.ts:478](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L478)

***

### toJSONNotImplemented()

> **toJSONNotImplemented**(): [`Serialized`](../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized format that is not implemented. This method should be overridden in subclasses to provide specific serialization behavior.

#### Returns

[`Serialized`](../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`BaseLM`](BaseLM.md) . [`toJSONNotImplemented`](BaseLM.md#tojsonnotimplemented)

#### Source

[packages/core/src/load/serializable.ts:448](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L448)

***

### toJSONSecret()

> **toJSONSecret**(`secretKey`): [`Serialized`](../../../../../load/serializable/type-aliases/Serialized.md)

Converts a secret key to its serialized format. This method is typically used for serializing secrets in a secure manner.

#### Parameters

• **secretKey**: `string`

The secret key to serialize.

#### Returns

[`Serialized`](../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the secret key.

#### Inherited from

[`BaseLM`](BaseLM.md) . [`toJSONSecret`](BaseLM.md#tojsonsecret)

#### Source

[packages/core/src/load/serializable.ts:462](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L462)

***

### withConfig()

> **withConfig**(`config`): [`CallableBind`](../../../../../record/callable/classes/CallableBind.md) \<[`BaseLMInput`](../type-aliases/BaseLMInput.md), [`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md), `CallOptions`\>

Creates a new [CallableBind](../../../../../record/callable/classes/CallableBind.md) instance with the specified configuration.
This method allows reconfiguration of the callable instance.

#### Parameters

• **config**: [`CallableConfig`](../../../../../record/callable/type-aliases/CallableConfig.md)

The configuration to apply to the new callable instance.

#### Returns

[`CallableBind`](../../../../../record/callable/classes/CallableBind.md) \<[`BaseLMInput`](../type-aliases/BaseLMInput.md), [`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md), `CallOptions`\>

A new [CallableBind](../../../../../record/callable/classes/CallableBind.md) instance with the given configuration.

#### Inherited from

[`BaseLM`](BaseLM.md) . [`withConfig`](BaseLM.md#withconfig)

#### Source

[packages/core/src/record/callable.ts:314](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L314)

***

### withFallbacks()

> **withFallbacks**(`fields`): [`CallableWithFallbacks`](../../../../../record/callable/classes/CallableWithFallbacks.md) \<[`BaseLMInput`](../type-aliases/BaseLMInput.md), [`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

Creates a new [CallableWithFallbacks](../../../../../record/callable/classes/CallableWithFallbacks.md) instance with specified fallbacks.
This method allows defining fallback callables for error handling or retries.

#### Parameters

• **fields**

Object containing an array of fallback callables.

• **fields.fallbacks**: [`Callable`](../../../../../record/callable/classes/Callable.md) \<[`BaseLMInput`](../type-aliases/BaseLMInput.md), [`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md), [`CallableConfig`](../../../../../record/callable/type-aliases/CallableConfig.md)\>[]

#### Returns

[`CallableWithFallbacks`](../../../../../record/callable/classes/CallableWithFallbacks.md) \<[`BaseLMInput`](../type-aliases/BaseLMInput.md), [`LLMResult`](../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

A new [CallableWithFallbacks](../../../../../record/callable/classes/CallableWithFallbacks.md) instance with the specified fallbacks.

#### Inherited from

[`BaseLM`](BaseLM.md) . [`withFallbacks`](BaseLM.md#withfallbacks)

#### Source

[packages/core/src/record/callable.ts:327](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L327)

***

### \_convertInputToPrompt()

`Internal`

> `static` `protected` **\_convertInputToPrompt**(`input`): [`BasePrompt`](../../../../input/load/prompts/base/classes/BasePrompt.md)

Converts a given [BaseLMInput](../type-aliases/BaseLMInput.md) to a [BasePrompt](../../../../input/load/prompts/base/classes/BasePrompt.md).

#### Parameters

• **input**: [`BaseLMInput`](../type-aliases/BaseLMInput.md)

The input for the language model.

#### Returns

[`BasePrompt`](../../../../input/load/prompts/base/classes/BasePrompt.md)

The corresponding prompt.

#### Inherited from

[`BaseLM`](BaseLM.md) . [`_convertInputToPrompt`](BaseLM.md#_convertinputtoprompt)

#### Source

[packages/core/src/events/inference/chat/base.ts:158](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L158)

***

### \_name()

> `static` **\_name**(): `string`

Generates a unique name for the class, typically used for serialization identification.

#### Returns

`string`

#### Inherited from

[`BaseLM`](BaseLM.md) . [`_name`](BaseLM.md#_name)

#### Source

[packages/core/src/load/serializable.ts:178](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L178)

***

### isCallable()

> `static` **isCallable**(`anything`): `anything is Callable<unknown, unknown, CallableConfig>`

Checks if a given object is an instance of Callable.

#### Parameters

• **anything**: `any`

Object to be checked.

#### Returns

`anything is Callable<unknown, unknown, CallableConfig>`

True if the object is an instance of Callable, false otherwise.

#### Inherited from

[`BaseLM`](BaseLM.md) . [`isCallable`](BaseLM.md#iscallable)

#### Source

[packages/core/src/record/callable.ts:196](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L196)
