# Class: `abstract` BaseEmbeddings\<CallOptions\>

Abstract class providing base functionality for embeddings.
Manages event handling and asynchronous calling with optional caching.

## Extends

- [`BaseEvent`](../../../base/classes/BaseEvent.md)\<`string`, [`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md), `CallOptions`\>

## Extended by

- [`OpenAIEmbeddings`](../../openai/classes/OpenAIEmbeddings.md)

## Type parameters

• **CallOptions** *extends* [`BaseEmbeddingsCallOptions`](../interfaces/BaseEmbeddingsCallOptions.md) = [`BaseEmbeddingsCallOptions`](../interfaces/BaseEmbeddingsCallOptions.md)

## Implements

- [`BaseEmbeddingsParams`](../interfaces/BaseEmbeddingsParams.md)

## Constructors

### new BaseEmbeddings()

> **new BaseEmbeddings**\<`CallOptions`\>(`__namedParameters`): [`BaseEmbeddings`](BaseEmbeddings.md)\<`CallOptions`\>

#### Parameters

• **\_\_namedParameters**: [`BaseEmbeddingsParams`](../interfaces/BaseEmbeddingsParams.md)

#### Returns

[`BaseEmbeddings`](BaseEmbeddings.md)\<`CallOptions`\>

#### Overrides

[`BaseEvent`](../../../base/classes/BaseEvent.md) . [`constructor`](../../../base/classes/BaseEvent.md#constructors)

#### Source

[packages/core/src/events/embeddings/base.ts:72](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/base.ts#L72)

## Properties

### \_isCallable

> **\_isCallable**: `boolean` = `true`

Indicates if the instance is callable. If false, then the callable cannot be invoked.

#### Inherited from

[`BaseEvent`](../../../base/classes/BaseEvent.md) . [`_isCallable`](../../../base/classes/BaseEvent.md#_iscallable)

#### Source

[packages/core/src/record/callable.ts:188](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L188)

***

### \_isSerializable

> **\_isSerializable**: `boolean` = `false`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Inherited from

[`BaseEvent`](../../../base/classes/BaseEvent.md) . [`_isSerializable`](../../../base/classes/BaseEvent.md#_isserializable)

#### Source

[packages/core/src/load/serializable.ts:163](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L163)

***

### \_kwargs

> **\_kwargs**: `SerializedFields`

Key-value pairs of properties to be serialized.

#### Inherited from

[`BaseEvent`](../../../base/classes/BaseEvent.md) . [`_kwargs`](../../../base/classes/BaseEvent.md#_kwargs)

#### Source

[packages/core/src/load/serializable.ts:168](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L168)

***

### \_namespace

> **\_namespace**: `string`[]

Unique namespace identifier for the serialized object, represented as an array of strings.

#### Inherited from

[`BaseEvent`](../../../base/classes/BaseEvent.md) . [`_namespace`](../../../base/classes/BaseEvent.md#_namespace)

#### Source

[packages/core/src/events/base.ts:44](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L44)

***

### cache?

> `optional` **cache**: [`BaseCache`](../../../../cache/base/classes/BaseCache.md)\<`number`[]\>

Cache instance to store and retrieve results for given string.

#### Implementation of

[`BaseEmbeddingsParams`](../interfaces/BaseEmbeddingsParams.md) . [`cache`](../interfaces/BaseEmbeddingsParams.md#cache)

#### Source

[packages/core/src/events/embeddings/base.ts:61](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/base.ts#L61)

***

### callbacks?

`Experimental`

> `optional` **callbacks**: `any`

not-implemented yet

#### Implementation of

[`BaseEmbeddingsParams`](../interfaces/BaseEmbeddingsParams.md) . [`callbacks`](../interfaces/BaseEmbeddingsParams.md#callbacks)

#### Inherited from

[`BaseEvent`](../../../base/classes/BaseEvent.md) . [`callbacks`](../../../base/classes/BaseEvent.md#callbacks)

#### Source

[packages/core/src/events/base.ts:79](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L79)

***

### caller

> **caller**: `AsyncCaller`

The async caller should be used by subclasses to make any async calls,
which will thus benefit from the concurrency and retry logic.

#### Source

[packages/core/src/events/embeddings/base.ts:56](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/base.ts#L56)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Implementation of

[`BaseEmbeddingsParams`](../interfaces/BaseEmbeddingsParams.md) . [`metadata`](../interfaces/BaseEmbeddingsParams.md#metadata)

#### Inherited from

[`BaseEvent`](../../../base/classes/BaseEvent.md) . [`metadata`](../../../base/classes/BaseEvent.md#metadata)

#### Source

[packages/core/src/events/base.ts:74](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L74)

***

### name?

`Experimental`

> `optional` **name**: `string`

The name of the callable, used for identification or logging.

not-implement yet

#### Implementation of

[`BaseEmbeddingsParams`](../interfaces/BaseEmbeddingsParams.md) . [`name`](../interfaces/BaseEmbeddingsParams.md#name)

#### Inherited from

[`BaseEvent`](../../../base/classes/BaseEvent.md) . [`name`](../../../base/classes/BaseEvent.md#name)

#### Source

[packages/core/src/events/base.ts:61](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L61)

***

### tags?

`Experimental`

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables.

not-implement yet

#### Implementation of

[`BaseEmbeddingsParams`](../interfaces/BaseEmbeddingsParams.md) . [`tags`](../interfaces/BaseEmbeddingsParams.md#tags)

#### Inherited from

[`BaseEvent`](../../../base/classes/BaseEvent.md) . [`tags`](../../../base/classes/BaseEvent.md#tags)

#### Source

[packages/core/src/events/base.ts:69](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L69)

***

### verbose

`Experimental`

> **verbose**: `boolean`

Specifies whether the event should provide verbose output, such as detailed logs or response texts.
This can be useful for debugging or detailed monitoring of event handling processes.

not-implement yet

#### Implementation of

[`BaseEmbeddingsParams`](../interfaces/BaseEmbeddingsParams.md) . [`verbose`](../interfaces/BaseEmbeddingsParams.md#verbose)

#### Inherited from

[`BaseEvent`](../../../base/classes/BaseEvent.md) . [`verbose`](../../../base/classes/BaseEvent.md#verbose)

#### Source

[packages/core/src/events/base.ts:53](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L53)

## Accessors

### \_aliases

> `get` **\_aliases**(): `undefined` \| `SerializedFields`

Retrieves alias mappings for the object's attribute names.

#### Returns

`undefined` \| `SerializedFields`

An object representing key aliases, or undefined if none are defined.

#### Source

[packages/core/src/load/serializable.ts:217](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L217)

***

### \_attributes

> `get` **\_attributes**(): `undefined` \| `SerializedFields`

Retrieves attributes of the object.

#### Returns

`undefined` \| `SerializedFields`

An object representing attributes, or undefined if none are defined.

#### Source

[packages/core/src/events/base.ts:81](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L81)

***

### \_id

> `get` **\_id**(): `string`[]

Retrieves the name of the class. This provides a unique identifier for serialization.

#### Returns

`string`[]

The path of serializable.

#### Source

[packages/core/src/load/serializable.ts:187](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L187)

***

### \_secrets

> `get` **\_secrets**(): `undefined` \| `SecretFields`

Retrieves any secrets defined in the object.

#### Returns

`undefined` \| `SecretFields`

An object representing secret fields, or undefined if none are defined.

#### Source

[packages/core/src/load/serializable.ts:199](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L199)

## Methods

### \_embed()

`Internal`

> `abstract` **\_embed**(`document`, `options`): `Promise` \<[`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md)\>

An abstract method that takes a single document as input and returns a
promise that resolves to a vector for the query document.

#### Parameters

• **document**: `string`

A single document to be embedded.

• **options**: `Omit`\<`CallOptions`, keyof [`CallableConfig`](../../../../record/callable/type-aliases/CallableConfig.md)\>

Additional options for embeddings.

#### Returns

`Promise` \<[`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md)\>

A promise that resolves to a vector for the query document.

#### Source

[packages/core/src/events/embeddings/base.ts:156](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/base.ts#L156)

***

### \_embedUncached()

`Internal`

> `protected` **\_embedUncached**(`document`, `serializedCallOptions`): `Promise` \<[`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md)\>

Handles uncached document and calls the `_embed` method.

#### Parameters

• **document**: `string`

A document.

• **serializedCallOptions**: `Omit`\<`CallOptions`, keyof [`CallableConfig`](../../../../record/callable/type-aliases/CallableConfig.md)\>

Serialized call options.

#### Returns

`Promise` \<[`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md)\>

The result from the language model embeddings.

#### Source

[packages/core/src/events/embeddings/base.ts:168](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/base.ts#L168)

***

### \_embeddingsType()

> `abstract` **\_embeddingsType**(): `string`

Returns the type of the embeddings.

#### Returns

`string`

#### Source

[packages/core/src/events/embeddings/base.ts:70](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/base.ts#L70)

***

### \_eventNamespace()

> **\_eventNamespace**(): `string`[]

#### Returns

`string`[]

#### Overrides

`BaseEvent._eventNamespace`

#### Source

[packages/core/src/events/embeddings/base.ts:63](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/base.ts#L63)

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

#### Source

[packages/core/src/events/embeddings/base.ts:223](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/base.ts#L223)

***

### \_identifyParams()

`Internal`

> `protected` **\_identifyParams**(): `Record`\<`string`, `any`\>

Method to identify additional parameters specific to implementations.

#### Returns

`Record`\<`string`, `any`\>

A record of identified parameters.

#### Source

[packages/core/src/events/embeddings/base.ts:213](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/base.ts#L213)

***

### \_streamIterator()

`Internal`

> **\_streamIterator**(`input`, `options`?): `AsyncGenerator` \<[`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md), `any`, `unknown`\>

Creates an async generator for streaming callable outputs.
This protected method is used internally for streaming operations.

#### Parameters

• **input**: `string`

The input for the callable.

• **options?**: `Partial`\<`CallOptions`\>

Optional additional options for the callable.

#### Returns

`AsyncGenerator` \<[`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md), `any`, `unknown`\>

An async generator yielding callable outputs.

#### Inherited from

[`BaseEvent`](../../../base/classes/BaseEvent.md) . [`_streamIterator`](../../../base/classes/BaseEvent.md#_streamiterator)

#### Source

[packages/core/src/record/callable.ts:429](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L429)

***

### batch()

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise` \<[`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md)[]\>

Batch calls invoke N times, where N is the length of inputs.

##### Parameters

• **inputs**: `string`[]

Array of inputs in each call in a batch.

• **options?**: `Partial`\<`CallOptions`\> \| `Partial`\<`CallOptions`\>[]

Either a single call options to apply to each call or an array of options for each call.

• **batchOptions?**: [`CallableBatchOptions`](../../../../record/callable/type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise` \<[`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md)[]\>

An arrays of CallOutputs, or mixed CallOutputs and Errors (if returnExceptions is true).

##### Inherited from

[`BaseEvent`](../../../base/classes/BaseEvent.md) . [`batch`](../../../base/classes/BaseEvent.md#batch)

##### Source

[packages/core/src/record/callable.ts:368](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L368)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| [`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md))[]\>

##### Parameters

• **inputs**: `string`[]

• **options?**: `Partial`\<`CallOptions`\> \| `Partial`\<`CallOptions`\>[]

• **batchOptions?**: [`CallableBatchOptions`](../../../../record/callable/type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise`\<(`Error` \| [`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md))[]\>

##### Inherited from

[`BaseEvent`](../../../base/classes/BaseEvent.md) . [`batch`](../../../base/classes/BaseEvent.md#batch)

##### Source

[packages/core/src/record/callable.ts:374](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L374)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| [`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md))[]\>

##### Parameters

• **inputs**: `string`[]

• **options?**: `Partial`\<`CallOptions`\> \| `Partial`\<`CallOptions`\>[]

• **batchOptions?**: [`CallableBatchOptions`](../../../../record/callable/type-aliases/CallableBatchOptions.md)

##### Returns

`Promise`\<(`Error` \| [`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md))[]\>

##### Inherited from

[`BaseEvent`](../../../base/classes/BaseEvent.md) . [`batch`](../../../base/classes/BaseEvent.md#batch)

##### Source

[packages/core/src/record/callable.ts:380](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L380)

***

### bind()

> **bind**(`kwargs`): [`Callable`](../../../../record/callable/classes/Callable.md)\<`string`, [`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md), `CallOptions`\>

Creates a new [CallableBind](../../../../record/callable/classes/CallableBind.md) instance with the specified keyword arguments.
This method allows partial reconfiguration of the callable instance.

#### Parameters

• **kwargs**: `Partial`\<`CallOptions`\>

Partial keyword arguments for the callable configuration.

#### Returns

[`Callable`](../../../../record/callable/classes/Callable.md)\<`string`, [`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md), `CallOptions`\>

A new [CallableBind](../../../../record/callable/classes/CallableBind.md) instance with the given keyword arguments.

#### Inherited from

[`BaseEvent`](../../../base/classes/BaseEvent.md) . [`bind`](../../../base/classes/BaseEvent.md#bind)

#### Source

[packages/core/src/record/callable.ts:343](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L343)

***

### embed()

> **embed**(`document`, `options`?, `callbacks`?): `Promise` \<[`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md)\>

Provides the core logic to interface with the language model, handling both
cached and uncached embeddings.

#### Parameters

• **document**: `string`

A string.

• **options?**: `CallOptions`

Optional call options.

• **callbacks?**: `any`

Optional callbacks.

#### Returns

`Promise` \<[`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md)\>

The result from the language model embeddings.

#### Source

[packages/core/src/events/embeddings/base.ts:111](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/base.ts#L111)

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

> `optional` **callables**: [`SerializedCallableFields`](../../../../record/callable/type-aliases/SerializedCallableFields.md)

##### metadata.type

> **type**: `string`

##### secrets

> **secrets**: `SecretFields`

#### Inherited from

[`BaseEvent`](../../../base/classes/BaseEvent.md) . [`getAttributes`](../../../base/classes/BaseEvent.md#getattributes)

#### Source

[packages/core/src/record/callable.ts:511](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L511)

***

### getParams()

> `abstract` **getParams**(`options`?): `Record`\<`string`, `unknown`\>

#### Parameters

• **options?**: `Omit`\<`CallOptions`, keyof [`CallableConfig`](../../../../record/callable/type-aliases/CallableConfig.md)\>

#### Returns

`Record`\<`string`, `unknown`\>

#### Source

[packages/core/src/events/embeddings/base.ts:184](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/base.ts#L184)

***

### invoke()

> **invoke**(`input`, `options`?): `Promise` \<[`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md)\>

Embeds a single document as input and returns a promise that resolves to a
vector for the query document.

#### Parameters

• **input**: `string`

A single document to be embedded.

• **options?**: `CallOptions`

Additional options for embedding.

#### Returns

`Promise` \<[`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md)\>

A promise that resolves to a vector for the query document.

#### Overrides

[`BaseEvent`](../../../base/classes/BaseEvent.md) . [`invoke`](../../../base/classes/BaseEvent.md#invoke)

#### Source

[packages/core/src/events/embeddings/base.ts:93](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/base.ts#L93)

***

### map()

> **map**(): [`Callable`](../../../../record/callable/classes/Callable.md)\<`string`[], [`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md)[], `CallOptions`\>

Creates a new [CallableEach](../../../../record/callable/classes/CallableEach.md) instance for mapping inputs to outputs.
This method allows applying the callable to each input in an array of inputs.

#### Returns

[`Callable`](../../../../record/callable/classes/Callable.md)\<`string`[], [`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md)[], `CallOptions`\>

A new [CallableEach](../../../../record/callable/classes/CallableEach.md) instance for mapping operation.

#### Inherited from

[`BaseEvent`](../../../base/classes/BaseEvent.md) . [`map`](../../../base/classes/BaseEvent.md#map)

#### Source

[packages/core/src/record/callable.ts:355](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L355)

***

### pipe()

> **pipe**\<`NewCallOutput`\>(`callableLike`): [`CallableSequence`](../../../../record/callable/classes/CallableSequence.md)\<`string`, `NewCallOutput`\>

Chains the current callable with another callable, creating a sequence.
This method allows sequential execution of multiple callables.

#### Type parameters

• **NewCallOutput**

#### Parameters

• **callableLike**: [`CallableLike`](../../../../record/callable/type-aliases/CallableLike.md) \<[`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md), `NewCallOutput`\>

The next callable in the sequence.

#### Returns

[`CallableSequence`](../../../../record/callable/classes/CallableSequence.md)\<`string`, `NewCallOutput`\>

A new [CallableSequence](../../../../record/callable/classes/CallableSequence.md) instance representing the chained callables.

#### Inherited from

[`BaseEvent`](../../../base/classes/BaseEvent.md) . [`pipe`](../../../base/classes/BaseEvent.md#pipe)

#### Source

[packages/core/src/record/callable.ts:460](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L460)

***

### stream()

> **stream**(`input`, `options`?): `Promise`\<`ReadableStreamAsyncIterable` \<[`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md)\>\>

Creates a readable stream for the callable outputs.
This method allows streaming the outputs of the callable for continuous data.

#### Parameters

• **input**: `string`

The input for the callable.

• **options?**: `Partial`\<`CallOptions`\>

Optional additional options for the callable.

#### Returns

`Promise`\<`ReadableStreamAsyncIterable` \<[`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md)\>\>

A promise that resolves to a readable stream of callable outputs.

#### Inherited from

[`BaseEvent`](../../../base/classes/BaseEvent.md) . [`stream`](../../../base/classes/BaseEvent.md#stream)

#### Source

[packages/core/src/record/callable.ts:444](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L444)

***

### toJSON()

> **toJSON**(): [`Serialized`](../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized representation based on the object's current state. This method determines whether to use a 'not implemented' or 'constructor' format based on the object's serializability.

#### Returns

[`Serialized`](../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`BaseEvent`](../../../base/classes/BaseEvent.md) . [`toJSON`](../../../base/classes/BaseEvent.md#tojson)

#### Source

[packages/core/src/load/serializable.ts:665](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L665)

***

### toJSONConstructor()

> **toJSONConstructor**(`aliases`, `secrets`, `kwargs`): [`Serialized`](../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized constructor format. This method provides a way to serialize object construction details, including any aliases or secrets.

#### Parameters

• **aliases**: `SerializedKeyAlias`

Key aliases to include in the serialized output.

• **secrets**: `SecretFields`

Secrets to be secured in the serialized output.

• **kwargs**: `SerializedFields`

Additional keyword arguments to include in the serialized output.

#### Returns

[`Serialized`](../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object as a constructor.

#### Inherited from

[`BaseEvent`](../../../base/classes/BaseEvent.md) . [`toJSONConstructor`](../../../base/classes/BaseEvent.md#tojsonconstructor)

#### Source

[packages/core/src/load/serializable.ts:478](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L478)

***

### toJSONNotImplemented()

> **toJSONNotImplemented**(): [`Serialized`](../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized format that is not implemented. This method should be overridden in subclasses to provide specific serialization behavior.

#### Returns

[`Serialized`](../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`BaseEvent`](../../../base/classes/BaseEvent.md) . [`toJSONNotImplemented`](../../../base/classes/BaseEvent.md#tojsonnotimplemented)

#### Source

[packages/core/src/load/serializable.ts:448](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L448)

***

### toJSONSecret()

> **toJSONSecret**(`secretKey`): [`Serialized`](../../../../load/serializable/type-aliases/Serialized.md)

Converts a secret key to its serialized format. This method is typically used for serializing secrets in a secure manner.

#### Parameters

• **secretKey**: `string`

The secret key to serialize.

#### Returns

[`Serialized`](../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the secret key.

#### Inherited from

[`BaseEvent`](../../../base/classes/BaseEvent.md) . [`toJSONSecret`](../../../base/classes/BaseEvent.md#tojsonsecret)

#### Source

[packages/core/src/load/serializable.ts:462](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L462)

***

### withConfig()

> **withConfig**(`config`): [`CallableBind`](../../../../record/callable/classes/CallableBind.md)\<`string`, [`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md), `CallOptions`\>

Creates a new [CallableBind](../../../../record/callable/classes/CallableBind.md) instance with the specified configuration.
This method allows reconfiguration of the callable instance.

#### Parameters

• **config**: [`CallableConfig`](../../../../record/callable/type-aliases/CallableConfig.md)

The configuration to apply to the new callable instance.

#### Returns

[`CallableBind`](../../../../record/callable/classes/CallableBind.md)\<`string`, [`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md), `CallOptions`\>

A new [CallableBind](../../../../record/callable/classes/CallableBind.md) instance with the given configuration.

#### Inherited from

[`BaseEvent`](../../../base/classes/BaseEvent.md) . [`withConfig`](../../../base/classes/BaseEvent.md#withconfig)

#### Source

[packages/core/src/record/callable.ts:314](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L314)

***

### withFallbacks()

> **withFallbacks**(`fields`): [`CallableWithFallbacks`](../../../../record/callable/classes/CallableWithFallbacks.md)\<`string`, [`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md)\>

Creates a new [CallableWithFallbacks](../../../../record/callable/classes/CallableWithFallbacks.md) instance with specified fallbacks.
This method allows defining fallback callables for error handling or retries.

#### Parameters

• **fields**

Object containing an array of fallback callables.

• **fields.fallbacks**: [`Callable`](../../../../record/callable/classes/Callable.md)\<`string`, [`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md), [`CallableConfig`](../../../../record/callable/type-aliases/CallableConfig.md)\>[]

#### Returns

[`CallableWithFallbacks`](../../../../record/callable/classes/CallableWithFallbacks.md)\<`string`, [`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md)\>

A new [CallableWithFallbacks](../../../../record/callable/classes/CallableWithFallbacks.md) instance with the specified fallbacks.

#### Inherited from

[`BaseEvent`](../../../base/classes/BaseEvent.md) . [`withFallbacks`](../../../base/classes/BaseEvent.md#withfallbacks)

#### Source

[packages/core/src/record/callable.ts:327](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L327)

***

### \_name()

> `static` **\_name**(): `string`

Generates a unique name for the class, typically used for serialization identification.

#### Returns

`string`

#### Inherited from

[`BaseEvent`](../../../base/classes/BaseEvent.md) . [`_name`](../../../base/classes/BaseEvent.md#_name)

#### Source

[packages/core/src/load/serializable.ts:178](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L178)

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

[`BaseEvent`](../../../base/classes/BaseEvent.md) . [`isCallable`](../../../base/classes/BaseEvent.md#iscallable)

#### Source

[packages/core/src/record/callable.ts:196](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L196)
