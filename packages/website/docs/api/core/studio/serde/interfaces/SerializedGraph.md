# Interface: SerializedGraph

Represents a serialized version of a graph, including metadata and details about its nodes.
This structure is used for storing graph data in a format that can be easily transferred or saved.

## Properties

### \_type

> **\_type**: `"graph"`

Identifies the type of serialization; always 'graph'.

#### Source

[packages/core/src/studio/serde.ts:17](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L17)

***

### description

> **description**: `string`

Detailed description of the graph's purpose and functionality.

#### Source

[packages/core/src/studio/serde.ts:20](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L20)

***

### id

> **id**: `RecordId`

Unique identifier for the graph.

#### Source

[packages/core/src/studio/serde.ts:18](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L18)

***

### nodes

> **nodes**: [`SerializedNode`](SerializedNode.md)[]

Array of `SerializedNode` representing the nodes within the graph.

#### Source

[packages/core/src/studio/serde.ts:21](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L21)

***

### title

> **title**: `string`

Human-readable title of the graph.

#### Source

[packages/core/src/studio/serde.ts:19](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L19)
