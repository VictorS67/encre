# Type alias: SerializedNode

> **SerializedNode**: `object`

Represents a serialized node within a graph, containing all necessary details to reconstruct
or interpret the node outside of its execution environment.

## Type declaration

### \_type

> **\_type**: `"node"`

### data

> **data**: [`Serialized`](../../../load/serializable/type-aliases/Serialized.md)

### description

> **description**: `string`

### id

> **id**: `RecordId`

### inputs

> **inputs**: [`NodePortFields`](../../nodes/type-aliases/NodePortFields.md) \| `undefined`

### memory

> **memory**: `number`

### outgoingConnections

> **outgoingConnections**: `{ [key in string]: Object }`

### outputSizes?

> `optional` **outputSizes**: [`NodePortSizes`](../../nodes/type-aliases/NodePortSizes.md)

### outputs

> **outputs**: [`NodePortFields`](../../nodes/type-aliases/NodePortFields.md) \| `undefined`

### registerArgs?

> `optional` **registerArgs**: `Record`\<`string`, `unknown`\>

### runtime

> **runtime**: `number`

### subType

> **subType**: `string`

### title

> **title**: `string`

### type

> **type**: `string`

### visualInfo

> **visualInfo**: `object`

### visualInfo.position

> **position**: `object`

### visualInfo.position.x

> **x**: `number`

### visualInfo.position.y

> **y**: `number`

### visualInfo.position.zIndex?

> `optional` **zIndex**: `number`

### visualInfo.size

> **size**: `object`

### visualInfo.size.height

> **height**: `number`

### visualInfo.size.width

> **width**: `number`

## Source

[packages/core/src/studio/serde.ts:43](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/serde.ts#L43)
