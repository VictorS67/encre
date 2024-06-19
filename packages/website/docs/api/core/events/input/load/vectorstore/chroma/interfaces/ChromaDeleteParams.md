# Interface: ChromaDeleteParams\<T\>

Specifies the parameters for deleting vectors from a Chroma vector store.

## Example

```typescript
// Example of deleting specific vectors by IDs
const deleteParams: ChromaDeleteParams<ChromaVectorStoreFilterType> = {
  ids: ['id1', 'id2']
};

// Example of deleting vectors by a custom filter
const deleteParamsWithFilter: ChromaDeleteParams<ChromaVectorStoreFilterType> = {
  filter: {
    where: { field: 'age', value: 25, operation: 'LESS_THAN' }
  }
};
```

## Type parameters

• **T**

## Properties

### filter?

> `optional` **filter**: `T`

Optional. A filter defining which vectors to delete based on their metadata and content.

#### Source

[packages/core/src/events/input/load/vectorstore/chroma.ts:87](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/chroma.ts#L87)

***

### ids?

> `optional` **ids**: `string`[]

Optional. Array of vector IDs to delete.

#### Source

[packages/core/src/events/input/load/vectorstore/chroma.ts:82](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/chroma.ts#L82)
