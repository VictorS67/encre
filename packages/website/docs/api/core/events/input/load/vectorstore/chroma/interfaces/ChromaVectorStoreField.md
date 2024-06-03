# Interface: ChromaVectorStoreField

Defines the fields for the ChromaVectorStore class.

## Example

```typescript
const vectorStoreConfig: ChromaVectorStoreField = {
  url: 'my-chroma-instance-url',
  numDimensions: 128,
  collectionName: 'myCollection',
  collectionMetadata: { createdBy: 'Data Science Team' },
  filter: {
    where: { field: 'category', value: 'technology', operation: 'EQUAL' },
    includeEmbeddings: true
  }
};
```

## Extends

- [`BaseVectorStoreField`](../../base/interfaces/BaseVectorStoreField.md)

## Properties

### collectionMetadata?

> `optional` **collectionMetadata**: `CollectionMetadata`

Additional metadata related to the collection.

#### Source

[packages/core/src/events/input/load/vectorstore/chroma.ts:52](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/vectorstore/chroma.ts#L52)

***

### collectionName?

> `optional` **collectionName**: `string`

Name of the collection within Chroma where vectors are stored.

#### Source

[packages/core/src/events/input/load/vectorstore/chroma.ts:47](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/vectorstore/chroma.ts#L47)

***

### filter?

> `optional` **filter**: [`ChromaVectorStoreFilterType`](../type-aliases/ChromaVectorStoreFilterType.md)

Optional filter settings that can be applied during search operations.

#### Source

[packages/core/src/events/input/load/vectorstore/chroma.ts:57](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/vectorstore/chroma.ts#L57)

***

### numDimensions?

> `optional` **numDimensions**: `number`

Number of dimensions for each embedding vector.

#### Source

[packages/core/src/events/input/load/vectorstore/chroma.ts:42](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/vectorstore/chroma.ts#L42)

***

### url

> **url**: `string`

Base URL of the Chroma backend service.

#### Source

[packages/core/src/events/input/load/vectorstore/chroma.ts:37](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/vectorstore/chroma.ts#L37)
