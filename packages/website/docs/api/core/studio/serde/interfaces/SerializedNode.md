# Interface: SerializedNode

Represents a serialized node within a graph, containing all necessary details to reconstruct
or interpret the node outside of its execution environment.

## Properties

### \_type

> **\_type**: `"node"`

Identifies the type of serialization; always 'node'.

#### Source

[packages/core/src/studio/serde.ts:46](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L46)

***

### data

> **data**: [`Serialized`](../../../load/serializable/type-aliases/Serialized.md)

Serialized form of the node's internal state or configuration.

#### Source

[packages/core/src/studio/serde.ts:55](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L55)

***

### description

> **description**: `string`

Description of what the node does and its role in the graph.

#### Source

[packages/core/src/studio/serde.ts:52](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L52)

***

### id

> **id**: `RecordId`

Unique identifier of the node.

#### Source

[packages/core/src/studio/serde.ts:47](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L47)

***

### inputs

> **inputs**: `undefined` \| [`NodePortFields`](../../nodes/type-aliases/NodePortFields.md)

Definitions of input ports, if any.

#### Source

[packages/core/src/studio/serde.ts:67](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L67)

***

### memory

> **memory**: `number`

Estimated or measured memory usage of the node in megabytes.

#### Source

[packages/core/src/studio/serde.ts:54](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L54)

***

### outgoingConnections

> **outgoingConnections**: `object`

Mapping of output port names to connections leading to other nodes.

#### Source

[packages/core/src/studio/serde.ts:70](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L70)

***

### outputSizes?

> `optional` **outputSizes**: [`NodePortSizes`](../../nodes/type-aliases/NodePortSizes.md)

Optional sizes of outputs, used in certain graph visualizations or calculations.

#### Source

[packages/core/src/studio/serde.ts:69](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L69)

***

### outputs

> **outputs**: `undefined` \| [`NodePortFields`](../../nodes/type-aliases/NodePortFields.md)

Definitions of output ports, if any.

#### Source

[packages/core/src/studio/serde.ts:68](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L68)

***

### registerArgs?

> `optional` **registerArgs**: `Record`\<`string`, `unknown`\>

Arguments used to register or configure the node in its environment.

#### Source

[packages/core/src/studio/serde.ts:50](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L50)

***

### runtime

> **runtime**: `number`

Estimated or measured runtime of the node in milliseconds.

#### Source

[packages/core/src/studio/serde.ts:53](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L53)

***

### subType

> **subType**: `string`

More specific classification or subtype of the node.

#### Source

[packages/core/src/studio/serde.ts:49](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L49)

***

### title

> **title**: `string`

Human-readable title of the node.

#### Source

[packages/core/src/studio/serde.ts:51](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L51)

***

### type

> **type**: `string`

General classification of the node.

#### Source

[packages/core/src/studio/serde.ts:48](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L48)

***

### visualInfo

> **visualInfo**: `object`

Contains position and size information for visual representations.

#### position

> **position**: `object`

#### position.x

> **x**: `number`

#### position.y

> **y**: `number`

#### position.zIndex?

> `optional` **zIndex**: `number`

#### size

> **size**: `object`

#### size.height

> **height**: `number`

#### size.width

> **width**: `number`

#### Source

[packages/core/src/studio/serde.ts:56](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L56)
