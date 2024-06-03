# Type alias: SimilaritySearch

> **SimilaritySearch**: `object`

Represents a similarity search strategy where the top most similar items are retrieved.

## Type declaration

### topK?

> `optional` **topK**: `number`

The number of top similar items to retrieve. If unspecified, a default value is used.

### type

> **type**: `"similarity"`

Specifies the type of search, always 'similarity' for this structure.

## Source

[packages/core/src/events/inference/retrieve/embedding/index.ts:12](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/retrieve/embedding/index.ts#L12)
