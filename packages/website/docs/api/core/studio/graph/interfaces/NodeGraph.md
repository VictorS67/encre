# Interface: NodeGraph

## Properties

### comments?

> `optional` **comments**: [`GraphComment`](../../comments/type-aliases/GraphComment.md)[]

Optional comments associated with the graph, for user notes or documentation purposes.

#### Source

[packages/core/src/studio/graph.ts:54](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L54)

***

### connections

> **connections**: [`NodeConnection`](../../nodes/type-aliases/NodeConnection.md)[]

Connections between nodes within the graph, specifying data flow from node to node.
Connections can be connected to/from `SubGraphNode`.

#### Source

[packages/core/src/studio/graph.ts:49](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L49)

***

### description?

> `optional` **description**: `string`

Description of the graph's purpose and contents.

#### Source

[packages/core/src/studio/graph.ts:35](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L35)

***

### id?

> `optional` **id**: `RecordId`

Unique identifier for the graph.

#### Source

[packages/core/src/studio/graph.ts:25](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L25)

***

### nodes

> **nodes**: [`SerializableNode`](../../nodes/interfaces/SerializableNode.md)\<`string`, [`Serializable`](../../../load/serializable/classes/Serializable.md)\>[]

Collection of nodes that compose the graph. Nodes can be of any type
derived from `SerializableNode`, including `SubGraphNode`.

#### Source

[packages/core/src/studio/graph.ts:43](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L43)

***

### registry?

> `optional` **registry**: [`NodeRegistration`](../../registration/nodes/classes/NodeRegistration.md)\<`never`, `never`, `never`\>

#### Source

[packages/core/src/studio/graph.ts:37](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L37)

***

### title?

> `optional` **title**: `string`

Human-readable title for the graph.

#### Source

[packages/core/src/studio/graph.ts:30](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/graph.ts#L30)
