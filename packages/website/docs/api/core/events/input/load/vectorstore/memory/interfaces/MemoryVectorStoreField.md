# Interface: MemoryVectorStoreField

Represents the fields for the MemoryVectorStore which include a list of vectors and a
similarity function definition, with optional filters.

## Extends

- [`BaseVectorStoreField`](../../base/interfaces/BaseVectorStoreField.md)

## Properties

### filter?

> `optional` **filter**: [`MemoryVectorStoreFilterType`](../type-aliases/MemoryVectorStoreFilterType.md)

Optional filters that can be applied during vector retrieval operations to limit the
results based on custom logic.

#### Source

[packages/core/src/events/input/load/vectorstore/memory.ts:29](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/vectorstore/memory.ts#L29)

***

### similarity()

> **similarity**: (`a`, `b`) => `number`

The function used to calculate the similarity between two vectors. This is typically a
cosine similarity function from a machine learning library.

#### Parameters

• **a**: `NumberArray`

• **b**: `NumberArray`

#### Returns

`number`

#### Source

[packages/core/src/events/input/load/vectorstore/memory.ts:23](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/vectorstore/memory.ts#L23)

***

### vectors

> **vectors**: [`Vector`](../type-aliases/Vector.md)[]

A list of all vectors currently stored in the memory. Each vector includes its content,
embedding, and metadata.

#### Source

[packages/core/src/events/input/load/vectorstore/memory.ts:17](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/vectorstore/memory.ts#L17)
