# Type alias: ChromaVectorStoreFilterType

> **ChromaVectorStoreFilterType**: `object`

Defines the filter type used in ChromaVectorStore operations to refine search and deletion operations.

## Example

```typescript
// Example filter to include embeddings and filter based on metadata
const filter: ChromaVectorStoreFilterType = {
  where: { field: 'status', value: 'active', operation: 'EQUAL' },
  includeEmbeddings: true
};
```

## Type declaration

### includeEmbeddings?

> `optional` **includeEmbeddings**: `boolean`

Optional. Indicates whether to include vector embeddings in the results.

### where?

> `optional` **where**: `Where`

Optional. Specifies conditions used to filter vectors based on their metadata.

## Source

[packages/core/src/events/input/load/vectorstore/chroma.ts:102](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/vectorstore/chroma.ts#L102)
