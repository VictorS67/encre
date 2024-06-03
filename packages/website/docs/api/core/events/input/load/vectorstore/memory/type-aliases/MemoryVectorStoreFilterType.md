# Type alias: MemoryVectorStoreFilterType

> **MemoryVectorStoreFilterType**: `object`

Defines the filter type for the MemoryVectorStore. Filters can include a function to
determine inclusion based on context, and an option to include embeddings in the returned data.

## Type declaration

### filterFunc()?

> `optional` **filterFunc**: (`context`) => `Promise`\<`boolean`\>

An optional function that determines whether a given context meets certain criteria.
This function should be asynchronous and return a boolean indicating whether the context
passes the filter. This allows for dynamic and complex filtering logic based on the
context's properties.

#### Parameters

• **context**: [`Context`](../../../docs/context/classes/Context.md)

#### Returns

`Promise`\<`boolean`\>

### includeEmbeddings?

> `optional` **includeEmbeddings**: `boolean`

Specifies whether embeddings should be included in the retrieval results. If set to true,
the embeddings associated with the vectors are included in the returned data, allowing
further operations or analyses that require access to the raw embeddings.

## Source

[packages/core/src/events/input/load/vectorstore/memory.ts:86](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/vectorstore/memory.ts#L86)
