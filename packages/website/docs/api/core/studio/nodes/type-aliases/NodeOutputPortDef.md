# Type alias: NodeOutputPortDef

> **NodeOutputPortDef**: `object`

Defines the structure of an output port on a node. It details the port's data type,
optional requirements, and possible default values.

## Type declaration

### data?

> `optional` **data**: [`ValueOf`](../../data/type-aliases/ValueOf.md) \<[`DataType`](../../data/type-aliases/DataType.md)\> \| `Readonly` \<[`ValueOf`](../../data/type-aliases/ValueOf.md) \<[`DataType`](../../data/type-aliases/DataType.md)\>[]\>

Stored data associated with the port, potentially for initial output or defaults.

### default?

> `optional` **default**: `unknown`

A default value for the port, used if the output is unspecified.

### name

> **name**: `string`

The name of the port.

### nodeId

> **nodeId**: `RecordId`

Identifier for the node to which this port belongs.

### required?

> `optional` **required**: `boolean`

Indicates whether this port must be connected.

### type

> **type**: [`DataType`](../../data/type-aliases/DataType.md) \| `Readonly` \<[`DataType`](../../data/type-aliases/DataType.md)[]\>

The data type or types that this port outputs.

## Source

[packages/core/src/studio/nodes/index.ts:186](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/nodes/index.ts#L186)
