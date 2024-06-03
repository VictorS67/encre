# Interface: MemoryDeleteParams\<T\>

Defines the parameters for the delete operation in a MemoryVectorStore. This allows
specifying vector IDs to delete or applying a filter to determine which vectors to delete.

## Type parameters

• **T**

The type of the filter used in the delete operation.

## Properties

### filter?

> `optional` **filter**: `T`

An optional filter used to determine which vectors should be deleted. The filter must be
compatible with the type of filtering logic implemented in the vector store.

#### Source

[packages/core/src/events/input/load/vectorstore/memory.ts:48](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/vectorstore/memory.ts#L48)

***

### ids?

> `optional` **ids**: `string`[]

Optional list of vector IDs to be deleted. If specified, only vectors with these IDs
will be considered for deletion.

#### Source

[packages/core/src/events/input/load/vectorstore/memory.ts:42](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/vectorstore/memory.ts#L42)
