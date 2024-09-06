# Class: `abstract` RemoteRetriever

Interface representing configuration parameters for initializing a `BaseTextRetriever`.
Extends from `BaseRetrieverParams`, incorporating all base event parameters.

## Extends

- [`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md)

## Implements

- [`RemoteRetrieverParams`](../interfaces/RemoteRetrieverParams.md)

## Constructors

### new RemoteRetriever()

> **new RemoteRetriever**(`fields`): [`RemoteRetriever`](RemoteRetriever.md)

#### Parameters

• **fields**: [`RemoteRetrieverParams`](../interfaces/RemoteRetrieverParams.md)

#### Returns

[`RemoteRetriever`](RemoteRetriever.md)

#### Overrides

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`constructor`](../../../../base/classes/BaseTextRetriever.md#constructors)

#### Source

[packages/core/src/events/inference/retrieve/text/remote/base.ts:40](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/retrieve/text/remote/base.ts#L40)

## Properties

### \_isCallable

> **\_isCallable**: `boolean` = `true`

Indicates if the instance is callable. If false, then the callable cannot be invoked.

#### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`_isCallable`](../../../../base/classes/BaseTextRetriever.md#_iscallable)

#### Source

[packages/core/src/record/callable.ts:188](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L188)

***

### \_isSerializable

> **\_isSerializable**: `boolean` = `false`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`_isSerializable`](../../../../base/classes/BaseTextRetriever.md#_isserializable)

#### Source

[packages/core/src/events/inference/retrieve/base.ts:34](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/retrieve/base.ts#L34)

***

### \_kwargs

> **\_kwargs**: `SerializedFields`

Key-value pairs of properties to be serialized.

#### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`_kwargs`](../../../../base/classes/BaseTextRetriever.md#_kwargs)

#### Source

[packages/core/src/load/serializable.ts:168](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L168)

***

### \_namespace

> **\_namespace**: `string`[]

Unique namespace identifier for the serialized object, represented as an array of strings.

#### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`_namespace`](../../../../base/classes/BaseTextRetriever.md#_namespace)

#### Source

[packages/core/src/events/base.ts:44](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L44)

***

### auth

> **auth**: [`RemoteRetrieverAuth`](../../type-aliases/RemoteRetrieverAuth.md)

#### Implementation of

[`RemoteRetrieverParams`](../interfaces/RemoteRetrieverParams.md) . [`auth`](../interfaces/RemoteRetrieverParams.md#auth)

#### Source

[packages/core/src/events/inference/retrieve/text/remote/base.ts:30](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/retrieve/text/remote/base.ts#L30)

***

### callbacks?

`Experimental`

> `optional` **callbacks**: `any`

not-implemented yet

#### Implementation of

[`RemoteRetrieverParams`](../interfaces/RemoteRetrieverParams.md) . [`callbacks`](../interfaces/RemoteRetrieverParams.md#callbacks)

#### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`callbacks`](../../../../base/classes/BaseTextRetriever.md#callbacks)

#### Source

[packages/core/src/events/base.ts:79](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L79)

***

### caller

> **caller**: `AsyncCaller`

The async caller should be used by subclasses to make any async calls,
which will thus benefit from the concurrency and retry logic.

#### Source

[packages/core/src/events/inference/retrieve/text/remote/base.ts:38](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/retrieve/text/remote/base.ts#L38)

***

### headers

> **headers**: `Record`\<`string`, `string`\>

#### Source

[packages/core/src/events/inference/retrieve/text/remote/base.ts:32](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/retrieve/text/remote/base.ts#L32)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Implementation of

[`RemoteRetrieverParams`](../interfaces/RemoteRetrieverParams.md) . [`metadata`](../interfaces/RemoteRetrieverParams.md#metadata)

#### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`metadata`](../../../../base/classes/BaseTextRetriever.md#metadata)

#### Source

[packages/core/src/events/base.ts:74](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L74)

***

### name?

`Experimental`

> `optional` **name**: `string`

The name of the callable, used for identification or logging.

not-implement yet

#### Implementation of

[`RemoteRetrieverParams`](../interfaces/RemoteRetrieverParams.md) . [`name`](../interfaces/RemoteRetrieverParams.md#name)

#### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`name`](../../../../base/classes/BaseTextRetriever.md#name)

#### Source

[packages/core/src/events/base.ts:61](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L61)

***

### tags?

`Experimental`

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables.

not-implement yet

#### Implementation of

[`RemoteRetrieverParams`](../interfaces/RemoteRetrieverParams.md) . [`tags`](../interfaces/RemoteRetrieverParams.md#tags)

#### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`tags`](../../../../base/classes/BaseTextRetriever.md#tags)

#### Source

[packages/core/src/events/base.ts:69](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L69)

***

### url

> **url**: `string`

#### Implementation of

[`RemoteRetrieverParams`](../interfaces/RemoteRetrieverParams.md) . [`url`](../interfaces/RemoteRetrieverParams.md#url)

#### Source

[packages/core/src/events/inference/retrieve/text/remote/base.ts:28](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/retrieve/text/remote/base.ts#L28)

***

### verbose

`Experimental`

> **verbose**: `boolean`

Specifies whether the event should provide verbose output, such as detailed logs or response texts.
This can be useful for debugging or detailed monitoring of event handling processes.

not-implement yet

#### Implementation of

[`RemoteRetrieverParams`](../interfaces/RemoteRetrieverParams.md) . [`verbose`](../interfaces/RemoteRetrieverParams.md#verbose)

#### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`verbose`](../../../../base/classes/BaseTextRetriever.md#verbose)

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

[packages/core/src/events/inference/retrieve/text/remote/base.ts:22](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/retrieve/text/remote/base.ts#L22)

## Methods

### \_eventNamespace()

> **\_eventNamespace**(): `string`[]

#### Returns

`string`[]

#### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`_eventNamespace`](../../../../base/classes/BaseTextRetriever.md#_eventnamespace)

#### Source

[packages/core/src/events/inference/retrieve/base.ts:36](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/retrieve/base.ts#L36)

***

### \_retrieve()

> **\_retrieve**(`query`, `options`): `Promise` \<[`Context`](../../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

#### Parameters

• **query**: `string`

• **options**: `Omit` \<[`BaseRetrieverCallOptions`](../../../../base/interfaces/BaseRetrieverCallOptions.md), keyof [`CallableConfig`](../../../../../../../record/callable/type-aliases/CallableConfig.md)\>

#### Returns

`Promise` \<[`Context`](../../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

#### Overrides

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`_retrieve`](../../../../base/classes/BaseTextRetriever.md#_retrieve)

#### Source

[packages/core/src/events/inference/retrieve/text/remote/base.ts:62](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/retrieve/text/remote/base.ts#L62)

***

### \_retrieverType()

> `abstract` **\_retrieverType**(): `string`

Returns the specific retriever type.

#### Returns

`string`

#### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`_retrieverType`](../../../../base/classes/BaseTextRetriever.md#_retrievertype)

#### Source

[packages/core/src/events/inference/retrieve/base.ts:52](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/retrieve/base.ts#L52)

***

### \_sourceType()

> **\_sourceType**(): `string`

Returns the source type handled by the retriever.

#### Returns

`string`

#### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`_sourceType`](../../../../base/classes/BaseTextRetriever.md#_sourcetype)

#### Source

[packages/core/src/events/inference/retrieve/base.ts:135](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/retrieve/base.ts#L135)

***

### \_streamIterator()

`Internal`

> **\_streamIterator**(`input`, `options`?): `AsyncGenerator` \<[`Context`](../../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], `any`, `unknown`\>

Creates an async generator for streaming callable outputs.
This protected method is used internally for streaming operations.

#### Parameters

• **input**: `string`

The input for the callable.

• **options?**: `Partial` \<[`BaseRetrieverCallOptions`](../../../../base/interfaces/BaseRetrieverCallOptions.md)\>

Optional additional options for the callable.

#### Returns

`AsyncGenerator` \<[`Context`](../../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], `any`, `unknown`\>

An async generator yielding callable outputs.

#### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`_streamIterator`](../../../../base/classes/BaseTextRetriever.md#_streamiterator)

#### Source

[packages/core/src/record/callable.ts:429](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L429)

***

### batch()

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise` \<[`Context`](../../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[][]\>

Batch calls invoke N times, where N is the length of inputs.

##### Parameters

• **inputs**: `string`[]

Array of inputs in each call in a batch.

• **options?**: `Partial` \<[`BaseRetrieverCallOptions`](../../../../base/interfaces/BaseRetrieverCallOptions.md)\> \| `Partial` \<[`BaseRetrieverCallOptions`](../../../../base/interfaces/BaseRetrieverCallOptions.md)\>[]

Either a single call options to apply to each call or an array of options for each call.

• **batchOptions?**: [`CallableBatchOptions`](../../../../../../../record/callable/type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise` \<[`Context`](../../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[][]\>

An arrays of CallOutputs, or mixed CallOutputs and Errors (if returnExceptions is true).

##### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`batch`](../../../../base/classes/BaseTextRetriever.md#batch)

##### Source

[packages/core/src/record/callable.ts:368](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L368)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| [`Context`](../../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[])[]\>

##### Parameters

• **inputs**: `string`[]

• **options?**: `Partial` \<[`BaseRetrieverCallOptions`](../../../../base/interfaces/BaseRetrieverCallOptions.md)\> \| `Partial` \<[`BaseRetrieverCallOptions`](../../../../base/interfaces/BaseRetrieverCallOptions.md)\>[]

• **batchOptions?**: [`CallableBatchOptions`](../../../../../../../record/callable/type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise`\<(`Error` \| [`Context`](../../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[])[]\>

##### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`batch`](../../../../base/classes/BaseTextRetriever.md#batch)

##### Source

[packages/core/src/record/callable.ts:374](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L374)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| [`Context`](../../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[])[]\>

##### Parameters

• **inputs**: `string`[]

• **options?**: `Partial` \<[`BaseRetrieverCallOptions`](../../../../base/interfaces/BaseRetrieverCallOptions.md)\> \| `Partial` \<[`BaseRetrieverCallOptions`](../../../../base/interfaces/BaseRetrieverCallOptions.md)\>[]

• **batchOptions?**: [`CallableBatchOptions`](../../../../../../../record/callable/type-aliases/CallableBatchOptions.md)

##### Returns

`Promise`\<(`Error` \| [`Context`](../../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[])[]\>

##### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`batch`](../../../../base/classes/BaseTextRetriever.md#batch)

##### Source

[packages/core/src/record/callable.ts:380](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L380)

***

### bind()

> **bind**(`kwargs`): [`Callable`](../../../../../../../record/callable/classes/Callable.md)\<`string`, [`Context`](../../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], [`BaseRetrieverCallOptions`](../../../../base/interfaces/BaseRetrieverCallOptions.md)\>

Creates a new [CallableBind](../../../../../../../record/callable/classes/CallableBind.md) instance with the specified keyword arguments.
This method allows partial reconfiguration of the callable instance.

#### Parameters

• **kwargs**: `Partial` \<[`BaseRetrieverCallOptions`](../../../../base/interfaces/BaseRetrieverCallOptions.md)\>

Partial keyword arguments for the callable configuration.

#### Returns

[`Callable`](../../../../../../../record/callable/classes/Callable.md)\<`string`, [`Context`](../../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], [`BaseRetrieverCallOptions`](../../../../base/interfaces/BaseRetrieverCallOptions.md)\>

A new [CallableBind](../../../../../../../record/callable/classes/CallableBind.md) instance with the given keyword arguments.

#### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`bind`](../../../../base/classes/BaseTextRetriever.md#bind)

#### Source

[packages/core/src/record/callable.ts:343](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L343)

***

### createJSONBody()

> `abstract` **createJSONBody**(`query`): [`RemoteRetrieverValues`](../../type-aliases/RemoteRetrieverValues.md)

#### Parameters

• **query**: `string`

#### Returns

[`RemoteRetrieverValues`](../../type-aliases/RemoteRetrieverValues.md)

#### Source

[packages/core/src/events/inference/retrieve/text/remote/base.ts:58](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/retrieve/text/remote/base.ts#L58)

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

> `optional` **callables**: [`SerializedCallableFields`](../../../../../../../record/callable/type-aliases/SerializedCallableFields.md)

##### metadata.type

> **type**: `string`

##### secrets

> **secrets**: `SecretFields`

#### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`getAttributes`](../../../../base/classes/BaseTextRetriever.md#getattributes)

#### Source

[packages/core/src/record/callable.ts:511](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L511)

***

### invoke()

> **invoke**(`input`, `options`?): `Promise` \<[`Context`](../../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

Invokes the retrieval process. This is a wrapper around the abstract retrieve method,
handling standard invocation logic.

#### Parameters

• **input**: `string`

The input data for retrieval.

• **options?**: [`BaseRetrieverCallOptions`](../../../../base/interfaces/BaseRetrieverCallOptions.md)

Optional retrieval options.

#### Returns

`Promise` \<[`Context`](../../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

A promise that resolves to the retrieved contexts.

#### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`invoke`](../../../../base/classes/BaseTextRetriever.md#invoke)

#### Source

[packages/core/src/events/inference/retrieve/base.ts:61](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/retrieve/base.ts#L61)

***

### map()

> **map**(): [`Callable`](../../../../../../../record/callable/classes/Callable.md)\<`string`[], [`Context`](../../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[][], [`BaseRetrieverCallOptions`](../../../../base/interfaces/BaseRetrieverCallOptions.md)\>

Creates a new [CallableEach](../../../../../../../record/callable/classes/CallableEach.md) instance for mapping inputs to outputs.
This method allows applying the callable to each input in an array of inputs.

#### Returns

[`Callable`](../../../../../../../record/callable/classes/Callable.md)\<`string`[], [`Context`](../../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[][], [`BaseRetrieverCallOptions`](../../../../base/interfaces/BaseRetrieverCallOptions.md)\>

A new [CallableEach](../../../../../../../record/callable/classes/CallableEach.md) instance for mapping operation.

#### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`map`](../../../../base/classes/BaseTextRetriever.md#map)

#### Source

[packages/core/src/record/callable.ts:355](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L355)

***

### pipe()

> **pipe**\<`NewCallOutput`\>(`callableLike`): [`CallableSequence`](../../../../../../../record/callable/classes/CallableSequence.md)\<`string`, `NewCallOutput`\>

Chains the current callable with another callable, creating a sequence.
This method allows sequential execution of multiple callables.

#### Type parameters

• **NewCallOutput**

#### Parameters

• **callableLike**: [`CallableLike`](../../../../../../../record/callable/type-aliases/CallableLike.md) \<[`Context`](../../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], `NewCallOutput`\>

The next callable in the sequence.

#### Returns

[`CallableSequence`](../../../../../../../record/callable/classes/CallableSequence.md)\<`string`, `NewCallOutput`\>

A new [CallableSequence](../../../../../../../record/callable/classes/CallableSequence.md) instance representing the chained callables.

#### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`pipe`](../../../../base/classes/BaseTextRetriever.md#pipe)

#### Source

[packages/core/src/record/callable.ts:460](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L460)

***

### processJSONResponse()

> `abstract` **processJSONResponse**(`json`): [`Context`](../../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]

#### Parameters

• **json**: [`RemoteRetrieverValues`](../../type-aliases/RemoteRetrieverValues.md)

#### Returns

[`Context`](../../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]

#### Source

[packages/core/src/events/inference/retrieve/text/remote/base.ts:60](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/retrieve/text/remote/base.ts#L60)

***

### retrieve()

> **retrieve**(`query`, `options`?, `callbacks`?): `Promise` \<[`Context`](../../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

Retrieves contextual data based on the given text query.

#### Parameters

• **query**: `string`

The text query for which to retrieve context.

• **options?**: [`BaseRetrieverCallOptions`](../../../../base/interfaces/BaseRetrieverCallOptions.md)

Optional parameters and configurations for the retrieval.

• **callbacks?**: `any`

#### Returns

`Promise` \<[`Context`](../../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

A promise resolving to an array of contexts matching the query.

#### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`retrieve`](../../../../base/classes/BaseTextRetriever.md#retrieve)

#### Source

[packages/core/src/events/inference/retrieve/base.ts:150](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/retrieve/base.ts#L150)

***

### stream()

> **stream**(`input`, `options`?): `Promise`\<`ReadableStreamAsyncIterable` \<[`Context`](../../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>\>

Creates a readable stream for the callable outputs.
This method allows streaming the outputs of the callable for continuous data.

#### Parameters

• **input**: `string`

The input for the callable.

• **options?**: `Partial` \<[`BaseRetrieverCallOptions`](../../../../base/interfaces/BaseRetrieverCallOptions.md)\>

Optional additional options for the callable.

#### Returns

`Promise`\<`ReadableStreamAsyncIterable` \<[`Context`](../../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>\>

A promise that resolves to a readable stream of callable outputs.

#### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`stream`](../../../../base/classes/BaseTextRetriever.md#stream)

#### Source

[packages/core/src/record/callable.ts:444](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L444)

***

### toJSON()

> **toJSON**(): [`Serialized`](../../../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized representation based on the object's current state. This method determines whether to use a 'not implemented' or 'constructor' format based on the object's serializability.

#### Returns

[`Serialized`](../../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`toJSON`](../../../../base/classes/BaseTextRetriever.md#tojson)

#### Source

[packages/core/src/load/serializable.ts:665](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L665)

***

### toJSONConstructor()

> **toJSONConstructor**(`aliases`, `secrets`, `kwargs`): [`Serialized`](../../../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized constructor format. This method provides a way to serialize object construction details, including any aliases or secrets.

#### Parameters

• **aliases**: `SerializedKeyAlias`

Key aliases to include in the serialized output.

• **secrets**: `SecretFields`

Secrets to be secured in the serialized output.

• **kwargs**: `SerializedFields`

Additional keyword arguments to include in the serialized output.

#### Returns

[`Serialized`](../../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object as a constructor.

#### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`toJSONConstructor`](../../../../base/classes/BaseTextRetriever.md#tojsonconstructor)

#### Source

[packages/core/src/load/serializable.ts:478](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L478)

***

### toJSONNotImplemented()

> **toJSONNotImplemented**(): [`Serialized`](../../../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized format that is not implemented. This method should be overridden in subclasses to provide specific serialization behavior.

#### Returns

[`Serialized`](../../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`toJSONNotImplemented`](../../../../base/classes/BaseTextRetriever.md#tojsonnotimplemented)

#### Source

[packages/core/src/load/serializable.ts:448](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L448)

***

### toJSONSecret()

> **toJSONSecret**(`secretKey`): [`Serialized`](../../../../../../../load/serializable/type-aliases/Serialized.md)

Converts a secret key to its serialized format. This method is typically used for serializing secrets in a secure manner.

#### Parameters

• **secretKey**: `string`

The secret key to serialize.

#### Returns

[`Serialized`](../../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the secret key.

#### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`toJSONSecret`](../../../../base/classes/BaseTextRetriever.md#tojsonsecret)

#### Source

[packages/core/src/load/serializable.ts:462](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L462)

***

### withConfig()

> **withConfig**(`config`): [`CallableBind`](../../../../../../../record/callable/classes/CallableBind.md)\<`string`, [`Context`](../../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], [`BaseRetrieverCallOptions`](../../../../base/interfaces/BaseRetrieverCallOptions.md)\>

Creates a new [CallableBind](../../../../../../../record/callable/classes/CallableBind.md) instance with the specified configuration.
This method allows reconfiguration of the callable instance.

#### Parameters

• **config**: [`CallableConfig`](../../../../../../../record/callable/type-aliases/CallableConfig.md)

The configuration to apply to the new callable instance.

#### Returns

[`CallableBind`](../../../../../../../record/callable/classes/CallableBind.md)\<`string`, [`Context`](../../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], [`BaseRetrieverCallOptions`](../../../../base/interfaces/BaseRetrieverCallOptions.md)\>

A new [CallableBind](../../../../../../../record/callable/classes/CallableBind.md) instance with the given configuration.

#### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`withConfig`](../../../../base/classes/BaseTextRetriever.md#withconfig)

#### Source

[packages/core/src/record/callable.ts:314](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L314)

***

### withFallbacks()

> **withFallbacks**(`fields`): [`CallableWithFallbacks`](../../../../../../../record/callable/classes/CallableWithFallbacks.md)\<`string`, [`Context`](../../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

Creates a new [CallableWithFallbacks](../../../../../../../record/callable/classes/CallableWithFallbacks.md) instance with specified fallbacks.
This method allows defining fallback callables for error handling or retries.

#### Parameters

• **fields**

Object containing an array of fallback callables.

• **fields.fallbacks**: [`Callable`](../../../../../../../record/callable/classes/Callable.md)\<`string`, [`Context`](../../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], [`CallableConfig`](../../../../../../../record/callable/type-aliases/CallableConfig.md)\>[]

#### Returns

[`CallableWithFallbacks`](../../../../../../../record/callable/classes/CallableWithFallbacks.md)\<`string`, [`Context`](../../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

A new [CallableWithFallbacks](../../../../../../../record/callable/classes/CallableWithFallbacks.md) instance with the specified fallbacks.

#### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`withFallbacks`](../../../../base/classes/BaseTextRetriever.md#withfallbacks)

#### Source

[packages/core/src/record/callable.ts:327](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L327)

***

### \_name()

> `static` **\_name**(): `string`

Generates a unique name for the class, typically used for serialization identification.

#### Returns

`string`

#### Inherited from

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`_name`](../../../../base/classes/BaseTextRetriever.md#_name)

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

[`BaseTextRetriever`](../../../../base/classes/BaseTextRetriever.md) . [`isCallable`](../../../../base/classes/BaseTextRetriever.md#iscallable)

#### Source

[packages/core/src/record/callable.ts:196](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L196)
