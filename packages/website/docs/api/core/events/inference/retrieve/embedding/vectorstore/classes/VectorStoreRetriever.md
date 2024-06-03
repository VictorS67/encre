# Class: VectorStoreRetriever\<V\>

A retriever that utilizes a vector store to fetch contextually relevant data based
on the provided vector query. It supports configurable search strategies such as
similarity search and max marginal relevance (MMR).

## Example

```
const vectorStore = new MemoryVectorStore();
const retriever = new VectorStoreRetriever<MemoryVectorStore>({
  vectorstore: vectorStore,
  search: {
    type: 'similarity',
    topK: 5
  }
});

// To retrieve using a vector query
const results = await retriever.invoke([0.1, 0.2, 0.3, 0.4]);
console.log(results);
```

## Extends

- [`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md)

## Type parameters

• **V** *extends* [`BaseVectorStore`](../../../../../input/load/vectorstore/base/classes/BaseVectorStore.md) = [`BaseVectorStore`](../../../../../input/load/vectorstore/base/classes/BaseVectorStore.md)

The type of the vector store, extending from `BaseVectorStore`.

## Implements

- [`VectorStoreRetrieverParams`](../interfaces/VectorStoreRetrieverParams.md)\<`V`\>

## Constructors

### new VectorStoreRetriever()

> **new VectorStoreRetriever**\<`V`\>(`fields`): [`VectorStoreRetriever`](VectorStoreRetriever.md)\<`V`\>

#### Parameters

• **fields**: [`VectorStoreRetrieverParams`](../interfaces/VectorStoreRetrieverParams.md)\<`V`\>

#### Returns

[`VectorStoreRetriever`](VectorStoreRetriever.md)\<`V`\>

#### Overrides

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`constructor`](../../../base/classes/BaseEmbeddingRetriever.md#constructors)

#### Source

[packages/core/src/events/inference/retrieve/embedding/vectorstore.ts:90](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/retrieve/embedding/vectorstore.ts#L90)

## Properties

### \_isCallable

> **\_isCallable**: `boolean` = `true`

Indicates if the instance is callable. If false, then the callable cannot be invoked.

#### Inherited from

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`_isCallable`](../../../base/classes/BaseEmbeddingRetriever.md#_iscallable)

#### Source

[packages/core/src/record/callable.ts:188](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L188)

***

### \_isSerializable

> **\_isSerializable**: `boolean` = `true`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Overrides

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`_isSerializable`](../../../base/classes/BaseEmbeddingRetriever.md#_isserializable)

#### Source

[packages/core/src/events/inference/retrieve/embedding/vectorstore.ts:64](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/retrieve/embedding/vectorstore.ts#L64)

***

### \_kwargs

> **\_kwargs**: `SerializedFields`

Key-value pairs of properties to be serialized.

#### Inherited from

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`_kwargs`](../../../base/classes/BaseEmbeddingRetriever.md#_kwargs)

#### Source

[packages/core/src/load/serializable.ts:168](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L168)

***

### \_namespace

> **\_namespace**: `string`[]

Unique namespace identifier for the serialized object, represented as an array of strings.

#### Inherited from

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`_namespace`](../../../base/classes/BaseEmbeddingRetriever.md#_namespace)

#### Source

[packages/core/src/events/base.ts:44](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L44)

***

### callbacks?

`Experimental`

> `optional` **callbacks**: `any`

not-implemented yet

#### Implementation of

[`VectorStoreRetrieverParams`](../interfaces/VectorStoreRetrieverParams.md) . [`callbacks`](../interfaces/VectorStoreRetrieverParams.md#callbacks)

#### Inherited from

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`callbacks`](../../../base/classes/BaseEmbeddingRetriever.md#callbacks)

#### Source

[packages/core/src/events/base.ts:79](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L79)

***

### filter?

> `optional` **filter**: `V`\[`"FilterType"`\]

Optional filtering type specific to the vector store.

#### Implementation of

[`VectorStoreRetrieverParams`](../interfaces/VectorStoreRetrieverParams.md) . [`filter`](../interfaces/VectorStoreRetrieverParams.md#filter)

#### Source

[packages/core/src/events/inference/retrieve/embedding/vectorstore.ts:82](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/retrieve/embedding/vectorstore.ts#L82)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Implementation of

[`VectorStoreRetrieverParams`](../interfaces/VectorStoreRetrieverParams.md) . [`metadata`](../interfaces/VectorStoreRetrieverParams.md#metadata)

#### Inherited from

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`metadata`](../../../base/classes/BaseEmbeddingRetriever.md#metadata)

#### Source

[packages/core/src/events/base.ts:74](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L74)

***

### name?

`Experimental`

> `optional` **name**: `string`

The name of the callable, used for identification or logging.

not-implement yet

#### Implementation of

[`VectorStoreRetrieverParams`](../interfaces/VectorStoreRetrieverParams.md) . [`name`](../interfaces/VectorStoreRetrieverParams.md#name)

#### Inherited from

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`name`](../../../base/classes/BaseEmbeddingRetriever.md#name)

#### Source

[packages/core/src/events/base.ts:61](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L61)

***

### search

> **search**: [`VectorStoreRetrieverSearch`](../../type-aliases/VectorStoreRetrieverSearch.md)

Search strategy to use, can be either similarity search or max marginal
relevance (MMR) search.

#### Implementation of

[`VectorStoreRetrieverParams`](../interfaces/VectorStoreRetrieverParams.md) . [`search`](../interfaces/VectorStoreRetrieverParams.md#search)

#### Source

[packages/core/src/events/inference/retrieve/embedding/vectorstore.ts:88](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/retrieve/embedding/vectorstore.ts#L88)

***

### tags?

`Experimental`

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables.

not-implement yet

#### Implementation of

[`VectorStoreRetrieverParams`](../interfaces/VectorStoreRetrieverParams.md) . [`tags`](../interfaces/VectorStoreRetrieverParams.md#tags)

#### Inherited from

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`tags`](../../../base/classes/BaseEmbeddingRetriever.md#tags)

#### Source

[packages/core/src/events/base.ts:69](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L69)

***

### vectorstore

> **vectorstore**: [`BaseVectorStore`](../../../../../input/load/vectorstore/base/classes/BaseVectorStore.md)

The vector store used for retrieving vectors.

#### Implementation of

[`VectorStoreRetrieverParams`](../interfaces/VectorStoreRetrieverParams.md) . [`vectorstore`](../interfaces/VectorStoreRetrieverParams.md#vectorstore)

#### Source

[packages/core/src/events/inference/retrieve/embedding/vectorstore.ts:77](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/retrieve/embedding/vectorstore.ts#L77)

***

### verbose

`Experimental`

> **verbose**: `boolean`

Specifies whether the event should provide verbose output, such as detailed logs or response texts.
This can be useful for debugging or detailed monitoring of event handling processes.

not-implement yet

#### Implementation of

[`VectorStoreRetrieverParams`](../interfaces/VectorStoreRetrieverParams.md) . [`verbose`](../interfaces/VectorStoreRetrieverParams.md#verbose)

#### Inherited from

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`verbose`](../../../base/classes/BaseEmbeddingRetriever.md#verbose)

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

#### Returns

`string`[]

#### Inherited from

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`_eventNamespace`](../../../base/classes/BaseEmbeddingRetriever.md#_eventnamespace)

#### Source

[packages/core/src/events/inference/retrieve/base.ts:36](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/retrieve/base.ts#L36)

***

### \_retrieve()

`Internal`

> **\_retrieve**(`query`, `options`): `Promise` \<[`Context`](../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

Retrieves contextually relevant data from the vector store based on the provided query vector.
The method of retrieval depends on the configured search type, which can be either a similarity search
or a max marginal relevance (MMR) search.

#### Parameters

• **query**: `number`[]

The query vector used to find similar vectors in the vector store.

• **options**: `Omit` \<[`BaseRetrieverCallOptions`](../../../base/interfaces/BaseRetrieverCallOptions.md), keyof [`CallableConfig`](../../../../../../record/callable/type-aliases/CallableConfig.md)\>

Additional serialized options that may affect retrieval, such as safety settings.

#### Returns

`Promise` \<[`Context`](../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

A promise that resolves to an array of contexts, which are the retrieved data elements based on the query.

#### Overrides

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`_retrieve`](../../../base/classes/BaseEmbeddingRetriever.md#_retrieve)

#### Throws

Throws an error if the search type is unsupported, indicating a configuration or implementation issue.

#### Example

Using Similarity Search:
```typescript
// Assuming 'retriever' is an instance of VectorStoreRetriever and initialized properly
const queryVector = [0.1, 0.2, 0.3, 0.4];
retriever.search = {
  type: 'similarity',
  topK: 5
};
const results = await retriever._retrieve(queryVector, {});
console.log(results); // logs contexts similar to the query vector
```

Using Max Marginal Relevance (MMR) Search:
```typescript
// Setting up the retriever for MMR search
retriever.search = {
  type: 'mmr',
  topK: 5,
  lambda: 0.65
};
const mmrResults = await retriever._retrieve(queryVector, {});
console.log(mmrResults); // logs diversified search results balancing similarity and diversity
```

#### Source

[packages/core/src/events/inference/retrieve/embedding/vectorstore.ts:149](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/retrieve/embedding/vectorstore.ts#L149)

***

### \_retrieverType()

> **\_retrieverType**(): `string`

Returns the specific retriever type.

#### Returns

`string`

#### Overrides

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`_retrieverType`](../../../base/classes/BaseEmbeddingRetriever.md#_retrievertype)

#### Source

[packages/core/src/events/inference/retrieve/embedding/vectorstore.ts:70](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/retrieve/embedding/vectorstore.ts#L70)

***

### \_sourceType()

> **\_sourceType**(): `string`

Returns the source type handled by the retriever.

#### Returns

`string`

#### Inherited from

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`_sourceType`](../../../base/classes/BaseEmbeddingRetriever.md#_sourcetype)

#### Source

[packages/core/src/events/inference/retrieve/base.ts:196](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/retrieve/base.ts#L196)

***

### \_streamIterator()

`Internal`

> **\_streamIterator**(`input`, `options`?): `AsyncGenerator` \<[`Context`](../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], `any`, `unknown`\>

Creates an async generator for streaming callable outputs.
This protected method is used internally for streaming operations.

#### Parameters

• **input**: `number`[]

The input for the callable.

• **options?**: `Partial` \<[`BaseRetrieverCallOptions`](../../../base/interfaces/BaseRetrieverCallOptions.md)\>

Optional additional options for the callable.

#### Returns

`AsyncGenerator` \<[`Context`](../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], `any`, `unknown`\>

An async generator yielding callable outputs.

#### Inherited from

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`_streamIterator`](../../../base/classes/BaseEmbeddingRetriever.md#_streamiterator)

#### Source

[packages/core/src/record/callable.ts:429](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L429)

***

### batch()

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise` \<[`Context`](../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[][]\>

Batch calls invoke N times, where N is the length of inputs.

##### Parameters

• **inputs**: `number`[][]

Array of inputs in each call in a batch.

• **options?**: `Partial` \<[`BaseRetrieverCallOptions`](../../../base/interfaces/BaseRetrieverCallOptions.md)\> \| `Partial` \<[`BaseRetrieverCallOptions`](../../../base/interfaces/BaseRetrieverCallOptions.md)\>[]

Either a single call options to apply to each call or an array of options for each call.

• **batchOptions?**: [`CallableBatchOptions`](../../../../../../record/callable/type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise` \<[`Context`](../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[][]\>

An arrays of CallOutputs, or mixed CallOutputs and Errors (if returnExceptions is true).

##### Inherited from

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`batch`](../../../base/classes/BaseEmbeddingRetriever.md#batch)

##### Source

[packages/core/src/record/callable.ts:368](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L368)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| [`Context`](../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[])[]\>

##### Parameters

• **inputs**: `number`[][]

• **options?**: `Partial` \<[`BaseRetrieverCallOptions`](../../../base/interfaces/BaseRetrieverCallOptions.md)\> \| `Partial` \<[`BaseRetrieverCallOptions`](../../../base/interfaces/BaseRetrieverCallOptions.md)\>[]

• **batchOptions?**: [`CallableBatchOptions`](../../../../../../record/callable/type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise`\<(`Error` \| [`Context`](../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[])[]\>

##### Inherited from

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`batch`](../../../base/classes/BaseEmbeddingRetriever.md#batch)

##### Source

[packages/core/src/record/callable.ts:374](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L374)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| [`Context`](../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[])[]\>

##### Parameters

• **inputs**: `number`[][]

• **options?**: `Partial` \<[`BaseRetrieverCallOptions`](../../../base/interfaces/BaseRetrieverCallOptions.md)\> \| `Partial` \<[`BaseRetrieverCallOptions`](../../../base/interfaces/BaseRetrieverCallOptions.md)\>[]

• **batchOptions?**: [`CallableBatchOptions`](../../../../../../record/callable/type-aliases/CallableBatchOptions.md)

##### Returns

`Promise`\<(`Error` \| [`Context`](../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[])[]\>

##### Inherited from

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`batch`](../../../base/classes/BaseEmbeddingRetriever.md#batch)

##### Source

[packages/core/src/record/callable.ts:380](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L380)

***

### bind()

> **bind**(`kwargs`): [`Callable`](../../../../../../record/callable/classes/Callable.md)\<`number`[], [`Context`](../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], [`BaseRetrieverCallOptions`](../../../base/interfaces/BaseRetrieverCallOptions.md)\>

Creates a new [CallableBind](../../../../../../record/callable/classes/CallableBind.md) instance with the specified keyword arguments.
This method allows partial reconfiguration of the callable instance.

#### Parameters

• **kwargs**: `Partial` \<[`BaseRetrieverCallOptions`](../../../base/interfaces/BaseRetrieverCallOptions.md)\>

Partial keyword arguments for the callable configuration.

#### Returns

[`Callable`](../../../../../../record/callable/classes/Callable.md)\<`number`[], [`Context`](../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], [`BaseRetrieverCallOptions`](../../../base/interfaces/BaseRetrieverCallOptions.md)\>

A new [CallableBind](../../../../../../record/callable/classes/CallableBind.md) instance with the given keyword arguments.

#### Inherited from

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`bind`](../../../base/classes/BaseEmbeddingRetriever.md#bind)

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

> `optional` **callables**: [`SerializedCallableFields`](../../../../../../record/callable/type-aliases/SerializedCallableFields.md)

##### metadata.type

> **type**: `string`

##### secrets

> **secrets**: `SecretFields`

#### Inherited from

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`getAttributes`](../../../base/classes/BaseEmbeddingRetriever.md#getattributes)

#### Source

[packages/core/src/record/callable.ts:511](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L511)

***

### invoke()

> **invoke**(`input`, `options`?): `Promise` \<[`Context`](../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

Invokes the retrieval process. This is a wrapper around the abstract retrieve method,
handling standard invocation logic.

#### Parameters

• **input**: `number`[]

The input data for retrieval.

• **options?**: [`BaseRetrieverCallOptions`](../../../base/interfaces/BaseRetrieverCallOptions.md)

Optional retrieval options.

#### Returns

`Promise` \<[`Context`](../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

A promise that resolves to the retrieved contexts.

#### Inherited from

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`invoke`](../../../base/classes/BaseEmbeddingRetriever.md#invoke)

#### Source

[packages/core/src/events/inference/retrieve/base.ts:61](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/retrieve/base.ts#L61)

***

### map()

> **map**(): [`Callable`](../../../../../../record/callable/classes/Callable.md)\<`number`[][], [`Context`](../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[][], [`BaseRetrieverCallOptions`](../../../base/interfaces/BaseRetrieverCallOptions.md)\>

Creates a new [CallableEach](../../../../../../record/callable/classes/CallableEach.md) instance for mapping inputs to outputs.
This method allows applying the callable to each input in an array of inputs.

#### Returns

[`Callable`](../../../../../../record/callable/classes/Callable.md)\<`number`[][], [`Context`](../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[][], [`BaseRetrieverCallOptions`](../../../base/interfaces/BaseRetrieverCallOptions.md)\>

A new [CallableEach](../../../../../../record/callable/classes/CallableEach.md) instance for mapping operation.

#### Inherited from

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`map`](../../../base/classes/BaseEmbeddingRetriever.md#map)

#### Source

[packages/core/src/record/callable.ts:355](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L355)

***

### pipe()

> **pipe**\<`NewCallOutput`\>(`callableLike`): [`CallableSequence`](../../../../../../record/callable/classes/CallableSequence.md)\<`number`[], `NewCallOutput`\>

Chains the current callable with another callable, creating a sequence.
This method allows sequential execution of multiple callables.

#### Type parameters

• **NewCallOutput**

#### Parameters

• **callableLike**: [`CallableLike`](../../../../../../record/callable/type-aliases/CallableLike.md) \<[`Context`](../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], `NewCallOutput`\>

The next callable in the sequence.

#### Returns

[`CallableSequence`](../../../../../../record/callable/classes/CallableSequence.md)\<`number`[], `NewCallOutput`\>

A new [CallableSequence](../../../../../../record/callable/classes/CallableSequence.md) instance representing the chained callables.

#### Inherited from

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`pipe`](../../../base/classes/BaseEmbeddingRetriever.md#pipe)

#### Source

[packages/core/src/record/callable.ts:460](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L460)

***

### retrieve()

> **retrieve**(`query`, `options`?, `callbacks`?): `Promise` \<[`Context`](../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

Retrieves contextual data based on the given numerical embedding query.

#### Parameters

• **query**: `number`[]

The numerical embedding array for which to retrieve context.

• **options?**: [`BaseRetrieverCallOptions`](../../../base/interfaces/BaseRetrieverCallOptions.md)

Optional parameters and configurations for the retrieval.

• **callbacks?**: `any`

#### Returns

`Promise` \<[`Context`](../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

A promise resolving to an array of contexts matching the embedding query.

#### Inherited from

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`retrieve`](../../../base/classes/BaseEmbeddingRetriever.md#retrieve)

#### Source

[packages/core/src/events/inference/retrieve/base.ts:227](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/retrieve/base.ts#L227)

***

### stream()

> **stream**(`input`, `options`?): `Promise`\<`ReadableStreamAsyncIterable` \<[`Context`](../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>\>

Creates a readable stream for the callable outputs.
This method allows streaming the outputs of the callable for continuous data.

#### Parameters

• **input**: `number`[]

The input for the callable.

• **options?**: `Partial` \<[`BaseRetrieverCallOptions`](../../../base/interfaces/BaseRetrieverCallOptions.md)\>

Optional additional options for the callable.

#### Returns

`Promise`\<`ReadableStreamAsyncIterable` \<[`Context`](../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>\>

A promise that resolves to a readable stream of callable outputs.

#### Inherited from

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`stream`](../../../base/classes/BaseEmbeddingRetriever.md#stream)

#### Source

[packages/core/src/record/callable.ts:444](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L444)

***

### toJSON()

> **toJSON**(): [`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized representation based on the object's current state. This method determines whether to use a 'not implemented' or 'constructor' format based on the object's serializability.

#### Returns

[`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`toJSON`](../../../base/classes/BaseEmbeddingRetriever.md#tojson)

#### Source

[packages/core/src/load/serializable.ts:665](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L665)

***

### toJSONConstructor()

> **toJSONConstructor**(`aliases`, `secrets`, `kwargs`): [`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized constructor format. This method provides a way to serialize object construction details, including any aliases or secrets.

#### Parameters

• **aliases**: `SerializedKeyAlias`

Key aliases to include in the serialized output.

• **secrets**: `SecretFields`

Secrets to be secured in the serialized output.

• **kwargs**: `SerializedFields`

Additional keyword arguments to include in the serialized output.

#### Returns

[`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object as a constructor.

#### Inherited from

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`toJSONConstructor`](../../../base/classes/BaseEmbeddingRetriever.md#tojsonconstructor)

#### Source

[packages/core/src/load/serializable.ts:478](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L478)

***

### toJSONNotImplemented()

> **toJSONNotImplemented**(): [`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized format that is not implemented. This method should be overridden in subclasses to provide specific serialization behavior.

#### Returns

[`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`toJSONNotImplemented`](../../../base/classes/BaseEmbeddingRetriever.md#tojsonnotimplemented)

#### Source

[packages/core/src/load/serializable.ts:448](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L448)

***

### toJSONSecret()

> **toJSONSecret**(`secretKey`): [`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

Converts a secret key to its serialized format. This method is typically used for serializing secrets in a secure manner.

#### Parameters

• **secretKey**: `string`

The secret key to serialize.

#### Returns

[`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the secret key.

#### Inherited from

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`toJSONSecret`](../../../base/classes/BaseEmbeddingRetriever.md#tojsonsecret)

#### Source

[packages/core/src/load/serializable.ts:462](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L462)

***

### withConfig()

> **withConfig**(`config`): [`CallableBind`](../../../../../../record/callable/classes/CallableBind.md)\<`number`[], [`Context`](../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], [`BaseRetrieverCallOptions`](../../../base/interfaces/BaseRetrieverCallOptions.md)\>

Creates a new [CallableBind](../../../../../../record/callable/classes/CallableBind.md) instance with the specified configuration.
This method allows reconfiguration of the callable instance.

#### Parameters

• **config**: [`CallableConfig`](../../../../../../record/callable/type-aliases/CallableConfig.md)

The configuration to apply to the new callable instance.

#### Returns

[`CallableBind`](../../../../../../record/callable/classes/CallableBind.md)\<`number`[], [`Context`](../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], [`BaseRetrieverCallOptions`](../../../base/interfaces/BaseRetrieverCallOptions.md)\>

A new [CallableBind](../../../../../../record/callable/classes/CallableBind.md) instance with the given configuration.

#### Inherited from

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`withConfig`](../../../base/classes/BaseEmbeddingRetriever.md#withconfig)

#### Source

[packages/core/src/record/callable.ts:314](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L314)

***

### withFallbacks()

> **withFallbacks**(`fields`): [`CallableWithFallbacks`](../../../../../../record/callable/classes/CallableWithFallbacks.md)\<`number`[], [`Context`](../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

Creates a new [CallableWithFallbacks](../../../../../../record/callable/classes/CallableWithFallbacks.md) instance with specified fallbacks.
This method allows defining fallback callables for error handling or retries.

#### Parameters

• **fields**

Object containing an array of fallback callables.

• **fields.fallbacks**: [`Callable`](../../../../../../record/callable/classes/Callable.md)\<`number`[], [`Context`](../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], [`CallableConfig`](../../../../../../record/callable/type-aliases/CallableConfig.md)\>[]

#### Returns

[`CallableWithFallbacks`](../../../../../../record/callable/classes/CallableWithFallbacks.md)\<`number`[], [`Context`](../../../../../input/load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

A new [CallableWithFallbacks](../../../../../../record/callable/classes/CallableWithFallbacks.md) instance with the specified fallbacks.

#### Inherited from

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`withFallbacks`](../../../base/classes/BaseEmbeddingRetriever.md#withfallbacks)

#### Source

[packages/core/src/record/callable.ts:327](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L327)

***

### \_name()

> `static` **\_name**(): `string`

Generates a unique name for the class, typically used for serialization identification.

#### Returns

`string`

#### Overrides

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`_name`](../../../base/classes/BaseEmbeddingRetriever.md#_name)

#### Source

[packages/core/src/events/inference/retrieve/embedding/vectorstore.ts:66](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/retrieve/embedding/vectorstore.ts#L66)

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

[`BaseEmbeddingRetriever`](../../../base/classes/BaseEmbeddingRetriever.md) . [`isCallable`](../../../base/classes/BaseEmbeddingRetriever.md#iscallable)

#### Source

[packages/core/src/record/callable.ts:196](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L196)
