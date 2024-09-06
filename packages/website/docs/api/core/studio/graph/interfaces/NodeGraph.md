# Interface: NodeGraph

## Properties

### comments?

> `optional` **comments**: [`GraphComment`](../../comments/type-aliases/GraphComment.md)[]

Optional comments associated with the graph, for user notes or documentation purposes.

#### Source

[packages/core/src/studio/graph.ts:53](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L53)

***

### connections

> **connections**: [`NodeConnection`](../../nodes/type-aliases/NodeConnection.md)[]

Connections between nodes within the graph, specifying data flow from node to node.
Connections can be connected to/from `SubGraphNode`.

#### Source

[packages/core/src/studio/graph.ts:48](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L48)

***

### description?

> `optional` **description**: `string`

Description of the graph's purpose and contents.

#### Source

[packages/core/src/studio/graph.ts:34](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L34)

***

### id?

> `optional` **id**: `RecordId`

Unique identifier for the graph.

#### Source

[packages/core/src/studio/graph.ts:24](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L24)

***

### nodes

> **nodes**: [`SerializableNode`](../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../load/serializable/classes/Serializable.md)\>[]

Collection of nodes that compose the graph. Nodes can be of any type
derived from `SerializableNode`, including `SubGraphNode`.

#### Source

[packages/core/src/studio/graph.ts:42](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L42)

***

### registry?

> `optional` **registry**: [`NodeRegistration`](../../registration/nodes/classes/NodeRegistration.md)\<`never`, `never`, `never`\>

#### Source

[packages/core/src/studio/graph.ts:36](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L36)

***

### title?

> `optional` **title**: `string`

Human-readable title for the graph.

#### Source

[packages/core/src/studio/graph.ts:29](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/graph.ts#L29)
