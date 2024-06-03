# Interface: VectorStoreRetrieverParams\<V\>

Parameters for initializing a VectorStoreRetriever, specifying the vector store,
optional filtering criteria, and search strategy.

## Extends

- [`BaseEmbeddingRetrieverParams`](../../../base/interfaces/BaseEmbeddingRetrieverParams.md)

## Type parameters

• **V** *extends* [`BaseVectorStore`](../../../../../input/load/vectorstore/base/classes/BaseVectorStore.md) = [`BaseVectorStore`](../../../../../input/load/vectorstore/base/classes/BaseVectorStore.md)

## Properties

### callbacks?

> `optional` **callbacks**: `any`

not-implemented yet

#### Inherited from

[`BaseEmbeddingRetrieverParams`](../../../base/interfaces/BaseEmbeddingRetrieverParams.md) . [`callbacks`](../../../base/interfaces/BaseEmbeddingRetrieverParams.md#callbacks)

#### Source

[packages/core/src/record/callable.ts:56](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L56)

***

### filter?

> `optional` **filter**: `V`\[`"FilterType"`\]

Optional filtering type specific to the vector store.

#### Source

[packages/core/src/events/inference/retrieve/embedding/vectorstore.ts:28](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/retrieve/embedding/vectorstore.ts#L28)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Inherited from

[`BaseEmbeddingRetrieverParams`](../../../base/interfaces/BaseEmbeddingRetrieverParams.md) . [`metadata`](../../../base/interfaces/BaseEmbeddingRetrieverParams.md#metadata)

#### Source

[packages/core/src/record/callable.ts:51](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L51)

***

### name?

> `optional` **name**: `string`

The name of the callable, used for identification or logging. not-implemented yet

#### Inherited from

[`BaseEmbeddingRetrieverParams`](../../../base/interfaces/BaseEmbeddingRetrieverParams.md) . [`name`](../../../base/interfaces/BaseEmbeddingRetrieverParams.md#name)

#### Source

[packages/core/src/record/callable.ts:41](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L41)

***

### search?

> `optional` **search**: [`VectorStoreRetrieverSearch`](../../type-aliases/VectorStoreRetrieverSearch.md)

Search strategy to use, can be either similarity search or max marginal
relevance (MMR) search.

#### Source

[packages/core/src/events/inference/retrieve/embedding/vectorstore.ts:34](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/retrieve/embedding/vectorstore.ts#L34)

***

### tags?

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables. not-implemented yet

#### Inherited from

[`BaseEmbeddingRetrieverParams`](../../../base/interfaces/BaseEmbeddingRetrieverParams.md) . [`tags`](../../../base/interfaces/BaseEmbeddingRetrieverParams.md#tags)

#### Source

[packages/core/src/record/callable.ts:46](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L46)

***

### vectorstore

> **vectorstore**: [`BaseVectorStore`](../../../../../input/load/vectorstore/base/classes/BaseVectorStore.md)

The vector store used for retrieving vectors.

#### Source

[packages/core/src/events/inference/retrieve/embedding/vectorstore.ts:23](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/retrieve/embedding/vectorstore.ts#L23)

***

### verbose?

`Experimental`

> `optional` **verbose**: `boolean`

Specifies whether the event should provide verbose output, such as detailed logs or response texts.
This can be useful for debugging or detailed monitoring of event handling processes.

not-implement yet

#### Inherited from

[`BaseEmbeddingRetrieverParams`](../../../base/interfaces/BaseEmbeddingRetrieverParams.md) . [`verbose`](../../../base/interfaces/BaseEmbeddingRetrieverParams.md#verbose)

#### Source

[packages/core/src/events/base.ts:23](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L23)
