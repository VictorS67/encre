# Type alias: SerializedGraph

> **SerializedGraph**: `object`

Represents a serialized version of a graph, including metadata and details about its nodes.
This structure is used for storing graph data in a format that can be easily transferred or saved.

## Type declaration

### \_type

> **\_type**: `"graph"`

### description

> **description**: `string`

### id

> **id**: `RecordId`

### nodes

> **nodes**: [`SerializedNode`](SerializedNode.md)[]

### title

> **title**: `string`

## Source

[packages/core/src/studio/serde.ts:15](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/serde.ts#L15)
