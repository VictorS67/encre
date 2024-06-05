# Class: OpenAIEmbeddings\<CallOptions\>

Class to handle embeddings via the OpenAI API, extending the base embeddings functionality.

## Example

```typescript
const embeddings = new OpenAIEmbeddings({ modelName: 'text-embedding-ada-002' });
const options = { encondingFormat: 'float' };
const response = await embeddings.invoke('Hello!', options);
console.log(response);
```

## Extends

- [`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md)\<`CallOptions`\>

## Type parameters

• **CallOptions** *extends* [`OpenAIEmbeddingsCallOptions`](../interfaces/OpenAIEmbeddingsCallOptions.md) = [`OpenAIEmbeddingsCallOptions`](../interfaces/OpenAIEmbeddingsCallOptions.md)

## Implements

- [`OpenAIEmbeddingsParams`](../interfaces/OpenAIEmbeddingsParams.md)

## Constructors

### new OpenAIEmbeddings()

> **new OpenAIEmbeddings**\<`CallOptions`\>(`fields`?): [`OpenAIEmbeddings`](OpenAIEmbeddings.md)\<`CallOptions`\>

#### Parameters

• **fields?**: `Partial` \<[`OpenAIEmbeddingsParams`](../interfaces/OpenAIEmbeddingsParams.md)\> & `object`

#### Returns

[`OpenAIEmbeddings`](OpenAIEmbeddings.md)\<`CallOptions`\>

#### Overrides

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`constructor`](../../base/classes/BaseEmbeddings.md#constructors)

#### Source

[packages/core/src/events/embeddings/openai.ts:169](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/openai.ts#L169)

## Properties

### \_client

`Internal`

> `private` **\_client**: `OpenAI`

OpenAI API Client.

#### Source

[packages/core/src/events/embeddings/openai.ts:161](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/openai.ts#L161)

***

### \_clientOptions

`Internal`

> `private` **\_clientOptions**: `ClientOptions`

OpenAI API request options.

#### Source

[packages/core/src/events/embeddings/openai.ts:167](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/openai.ts#L167)

***

### \_isCallable

> **\_isCallable**: `boolean` = `true`

Indicates if the instance is callable. If false, then the callable cannot be invoked.

#### Inherited from

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`_isCallable`](../../base/classes/BaseEmbeddings.md#_iscallable)

#### Source

[packages/core/src/record/callable.ts:188](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L188)

***

### \_isSerializable

> **\_isSerializable**: `boolean` = `true`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Overrides

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`_isSerializable`](../../base/classes/BaseEmbeddings.md#_isserializable)

#### Source

[packages/core/src/events/embeddings/openai.ts:85](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/openai.ts#L85)

***

### \_kwargs

> **\_kwargs**: `SerializedFields`

Key-value pairs of properties to be serialized.

#### Inherited from

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`_kwargs`](../../base/classes/BaseEmbeddings.md#_kwargs)

#### Source

[packages/core/src/load/serializable.ts:168](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L168)

***

### \_namespace

> **\_namespace**: `string`[]

Unique namespace identifier for the serialized object, represented as an array of strings.

#### Inherited from

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`_namespace`](../../base/classes/BaseEmbeddings.md#_namespace)

#### Source

[packages/core/src/events/base.ts:44](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L44)

***

### cache?

> `optional` **cache**: [`BaseCache`](../../../../cache/base/classes/BaseCache.md)\<`number`[]\>

Cache instance to store and retrieve results for given string.

#### Implementation of

[`OpenAIEmbeddingsParams`](../interfaces/OpenAIEmbeddingsParams.md) . [`cache`](../interfaces/OpenAIEmbeddingsParams.md#cache)

#### Inherited from

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`cache`](../../base/classes/BaseEmbeddings.md#cache)

#### Source

[packages/core/src/events/embeddings/base.ts:61](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/base.ts#L61)

***

### callbacks?

`Experimental`

> `optional` **callbacks**: `any`

not-implemented yet

#### Implementation of

[`OpenAIEmbeddingsParams`](../interfaces/OpenAIEmbeddingsParams.md) . [`callbacks`](../interfaces/OpenAIEmbeddingsParams.md#callbacks)

#### Inherited from

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`callbacks`](../../base/classes/BaseEmbeddings.md#callbacks)

#### Source

[packages/core/src/events/base.ts:79](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L79)

***

### caller

> **caller**: `AsyncCaller`

The async caller should be used by subclasses to make any async calls,
which will thus benefit from the concurrency and retry logic.

#### Inherited from

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`caller`](../../base/classes/BaseEmbeddings.md#caller)

#### Source

[packages/core/src/events/embeddings/base.ts:56](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/base.ts#L56)

***

### dimensions?

> `optional` **dimensions**: `number`

The number of dimensions the resulting output embeddings should have.
Only supported in `text-embedding-3` and later models.

#### Implementation of

[`OpenAIEmbeddingsParams`](../interfaces/OpenAIEmbeddingsParams.md) . [`dimensions`](../interfaces/OpenAIEmbeddingsParams.md#dimensions)

#### Source

[packages/core/src/events/embeddings/openai.ts:120](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/openai.ts#L120)

***

### maxConcurrency?

> `optional` **maxConcurrency**: `number`

The max number of concurrent calls that can be made.
Defaults to 2.

#### Implementation of

[`OpenAIEmbeddingsParams`](../interfaces/OpenAIEmbeddingsParams.md) . [`maxConcurrency`](../interfaces/OpenAIEmbeddingsParams.md#maxconcurrency)

#### Source

[packages/core/src/events/embeddings/openai.ts:134](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/openai.ts#L134)

***

### maxRetries?

> `optional` **maxRetries**: `number`

The max number of retries that can be made for a single call.

#### Implementation of

[`OpenAIEmbeddingsParams`](../interfaces/OpenAIEmbeddingsParams.md) . [`maxRetries`](../interfaces/OpenAIEmbeddingsParams.md#maxretries)

#### Source

[packages/core/src/events/embeddings/openai.ts:139](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/openai.ts#L139)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Implementation of

[`OpenAIEmbeddingsParams`](../interfaces/OpenAIEmbeddingsParams.md) . [`metadata`](../interfaces/OpenAIEmbeddingsParams.md#metadata)

#### Inherited from

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`metadata`](../../base/classes/BaseEmbeddings.md#metadata)

#### Source

[packages/core/src/events/base.ts:74](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L74)

***

### modelName

> **modelName**: `string` = `'text-embedding-ada-002'`

ID of the model to use. You can use the [List models]([https://platform.openai.com/docs/api-reference/models/list](https://platform.openai.com/docs/api-reference/models/list)}
API to see all of your avaliable models, or see our
[Model overview]([https://platform.openai.com/docs/models/overview](https://platform.openai.com/docs/models/overview)) for description of them.

#### Implementation of

[`OpenAIEmbeddingsParams`](../interfaces/OpenAIEmbeddingsParams.md) . [`modelName`](../interfaces/OpenAIEmbeddingsParams.md#modelname)

#### Source

[packages/core/src/events/embeddings/openai.ts:114](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/openai.ts#L114)

***

### name?

`Experimental`

> `optional` **name**: `string`

The name of the callable, used for identification or logging.

not-implement yet

#### Implementation of

[`OpenAIEmbeddingsParams`](../interfaces/OpenAIEmbeddingsParams.md) . [`name`](../interfaces/OpenAIEmbeddingsParams.md#name)

#### Inherited from

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`name`](../../base/classes/BaseEmbeddings.md#name)

#### Source

[packages/core/src/events/base.ts:61](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L61)

***

### openAIApiKey?

> `optional` **openAIApiKey**: `string`

API key to use when making requests to OpenAI. Defaults to the value of
`OPENAI_API_KEY` environment variable.

#### Implementation of

[`OpenAIEmbeddingsParams`](../interfaces/OpenAIEmbeddingsParams.md) . [`openAIApiKey`](../interfaces/OpenAIEmbeddingsParams.md#openaiapikey)

#### Source

[packages/core/src/events/embeddings/openai.ts:150](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/openai.ts#L150)

***

### organization?

> `optional` **organization**: `string`

Identifier for organization sometimes used in API requests。

#### Source

[packages/core/src/events/embeddings/openai.ts:155](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/openai.ts#L155)

***

### tags?

`Experimental`

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables.

not-implement yet

#### Implementation of

[`OpenAIEmbeddingsParams`](../interfaces/OpenAIEmbeddingsParams.md) . [`tags`](../interfaces/OpenAIEmbeddingsParams.md#tags)

#### Inherited from

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`tags`](../../base/classes/BaseEmbeddings.md#tags)

#### Source

[packages/core/src/events/base.ts:69](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L69)

***

### timeout?

> `optional` **timeout**: `number`

Timeout for the API requests.

#### Implementation of

[`OpenAIEmbeddingsParams`](../interfaces/OpenAIEmbeddingsParams.md) . [`timeout`](../interfaces/OpenAIEmbeddingsParams.md#timeout)

#### Source

[packages/core/src/events/embeddings/openai.ts:144](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/openai.ts#L144)

***

### user?

> `optional` **user**: `string`

A unique identifier representing your end-user, which can help OpenAI to monitor
and detect abuse.

[Learn more]([https://platform.openai.com/docs/guides/safety-best-practices](https://platform.openai.com/docs/guides/safety-best-practices))

#### Implementation of

[`OpenAIEmbeddingsParams`](../interfaces/OpenAIEmbeddingsParams.md) . [`user`](../interfaces/OpenAIEmbeddingsParams.md#user)

#### Source

[packages/core/src/events/embeddings/openai.ts:128](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/openai.ts#L128)

***

### verbose

`Experimental`

> **verbose**: `boolean`

Specifies whether the event should provide verbose output, such as detailed logs or response texts.
This can be useful for debugging or detailed monitoring of event handling processes.

not-implement yet

#### Implementation of

[`OpenAIEmbeddingsParams`](../interfaces/OpenAIEmbeddingsParams.md) . [`verbose`](../interfaces/OpenAIEmbeddingsParams.md#verbose)

#### Inherited from

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`verbose`](../../base/classes/BaseEmbeddings.md#verbose)

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

[packages/core/src/events/embeddings/openai.ts:94](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/openai.ts#L94)

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

[packages/core/src/events/embeddings/openai.ts:87](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/openai.ts#L87)

## Methods

### \_embed()

`Internal`

> **\_embed**(`document`, `options`): `Promise` \<[`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md)\>

Embeds a document using the OpenAI API.

#### Parameters

• **document**: `string`

The document to embed.

• **options**: `Omit`\<`CallOptions`, keyof [`CallableConfig`](../../../../record/callable/type-aliases/CallableConfig.md)\>

Serialized call options.

#### Returns

`Promise` \<[`EmbedResult`](../../../output/provide/embedresult/type-aliases/EmbedResult.md)\>

A promise resolving to the embedding result.

#### Overrides

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`_embed`](../../base/classes/BaseEmbeddings.md#_embed)

#### Example

```typescript
const embeddings = new OpenAIEmbeddings({ modelName: 'text-embedding-ada-002' });
const result = await embeddings._embed("Hello, world!", {});
console.log(result.embedding);
```

#### Source

[packages/core/src/events/embeddings/openai.ts:259](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/openai.ts#L259)

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

#### Inherited from

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`_embedUncached`](../../base/classes/BaseEmbeddings.md#_embeduncached)

#### Source

[packages/core/src/events/embeddings/base.ts:168](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/base.ts#L168)

***

### \_embeddingsType()

> **\_embeddingsType**(): `string`

Returns the type of the embeddings.

#### Returns

`string`

#### Overrides

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`_embeddingsType`](../../base/classes/BaseEmbeddings.md#_embeddingstype)

#### Source

[packages/core/src/events/embeddings/openai.ts:105](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/openai.ts#L105)

***

### \_eventNamespace()

> **\_eventNamespace**(): `string`[]

#### Returns

`string`[]

#### Inherited from

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`_eventNamespace`](../../base/classes/BaseEmbeddings.md#_eventnamespace)

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

#### Inherited from

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`_getLLMStrKey`](../../base/classes/BaseEmbeddings.md#_getllmstrkey)

#### Source

[packages/core/src/events/embeddings/base.ts:223](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/base.ts#L223)

***

### \_getRequestOptions()

`Internal`

> `private` **\_getRequestOptions**(`options`?): `RequestOptions`

Builds request options for the API call, merging default client options with
method-specific options.

#### Parameters

• **options?**: `RequestOptions`

Optional additional request configurations.

#### Returns

`RequestOptions`

The combined request options.

#### Source

[packages/core/src/events/embeddings/openai.ts:319](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/openai.ts#L319)

***

### \_identifyParams()

`Internal`

> **\_identifyParams**(): `Omit`\<`EmbeddingCreateParams`, `"input"`\> & `object` & `ClientOptions`

Method to identify additional parameters specific to implementations.

#### Returns

`Omit`\<`EmbeddingCreateParams`, `"input"`\> & `object` & `ClientOptions`

A record of identified parameters.

#### Overrides

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`_identifyParams`](../../base/classes/BaseEmbeddings.md#_identifyparams)

#### Source

[packages/core/src/events/embeddings/openai.ts:236](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/openai.ts#L236)

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

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`_streamIterator`](../../base/classes/BaseEmbeddings.md#_streamiterator)

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

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`batch`](../../base/classes/BaseEmbeddings.md#batch)

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

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`batch`](../../base/classes/BaseEmbeddings.md#batch)

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

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`batch`](../../base/classes/BaseEmbeddings.md#batch)

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

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`bind`](../../base/classes/BaseEmbeddings.md#bind)

#### Source

[packages/core/src/record/callable.ts:343](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L343)

***

### completionWithRetry()

> **completionWithRetry**(`request`, `options`?): `Promise`\<`CreateEmbeddingResponse`\>

Handles retries for the embedding creation in case of failures.

#### Parameters

• **request**: `EmbeddingCreateParams`

The embedding creation parameters.

• **options?**: `RequestOptions`

Optional client request configurations.

#### Returns

`Promise`\<`CreateEmbeddingResponse`\>

A promise resolving to the embedding creation response.

#### Example

```typescript
const embeddings = new OpenAIEmbeddings({ modelName: 'text-embedding-ada-002' });
const requestParams = { input: "Example document", model: "text-embedding-ada-002" };
const response = await embeddings.completionWithRetry(requestParams);
console.log(response.data[0].embedding);
```

#### Source

[packages/core/src/events/embeddings/openai.ts:300](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/openai.ts#L300)

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

#### Inherited from

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`embed`](../../base/classes/BaseEmbeddings.md#embed)

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

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`getAttributes`](../../base/classes/BaseEmbeddings.md#getattributes)

#### Source

[packages/core/src/record/callable.ts:511](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L511)

***

### getParams()

> **getParams**(`options`?): `Omit`\<`EmbeddingCreateParams`, `"input"`\>

Retrieves the parameters required for creating an embedding with the OpenAI API.
This method extracts and prepares the parameters based on the model configurations
and any additional options specified in the call.

#### Parameters

• **options?**: `Omit`\<`CallOptions`, keyof [`CallableConfig`](../../../../record/callable/type-aliases/CallableConfig.md)\>

Optional serialized call options which may override default model settings.

#### Returns

`Omit`\<`EmbeddingCreateParams`, `"input"`\>

An object containing the necessary parameters for the OpenAI API request,
         excluding the 'input' parameter which is handled separately.

#### Overrides

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`getParams`](../../base/classes/BaseEmbeddings.md#getparams)

#### Source

[packages/core/src/events/embeddings/openai.ts:225](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/openai.ts#L225)

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

#### Inherited from

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`invoke`](../../base/classes/BaseEmbeddings.md#invoke)

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

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`map`](../../base/classes/BaseEmbeddings.md#map)

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

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`pipe`](../../base/classes/BaseEmbeddings.md#pipe)

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

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`stream`](../../base/classes/BaseEmbeddings.md#stream)

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

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`toJSON`](../../base/classes/BaseEmbeddings.md#tojson)

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

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`toJSONConstructor`](../../base/classes/BaseEmbeddings.md#tojsonconstructor)

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

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`toJSONNotImplemented`](../../base/classes/BaseEmbeddings.md#tojsonnotimplemented)

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

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`toJSONSecret`](../../base/classes/BaseEmbeddings.md#tojsonsecret)

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

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`withConfig`](../../base/classes/BaseEmbeddings.md#withconfig)

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

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`withFallbacks`](../../base/classes/BaseEmbeddings.md#withfallbacks)

#### Source

[packages/core/src/record/callable.ts:327](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L327)

***

### \_name()

> `static` **\_name**(): `string`

Generates a unique name for the class, typically used for serialization identification.

#### Returns

`string`

#### Overrides

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`_name`](../../base/classes/BaseEmbeddings.md#_name)

#### Source

[packages/core/src/events/embeddings/openai.ts:101](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/openai.ts#L101)

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

[`BaseEmbeddings`](../../base/classes/BaseEmbeddings.md) . [`isCallable`](../../base/classes/BaseEmbeddings.md#iscallable)

#### Source

[packages/core/src/record/callable.ts:196](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L196)
