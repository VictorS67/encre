# Type alias: NodeConnection

> **NodeConnection**: `object`

Represents a connection between two node ports, specifying the source and destination nodes
and ports.

For example, we have connection: A.portA ---> B.portB

Then, we should have:
- fromNodeId: A
- fromPortName: portA
- toNodeId: B
- toPortName: portB

## Type declaration

### fromNodeId

> **fromNodeId**: `RecordId`

The identifier of the node from which the connection originates.

### fromPortName

> **fromPortName**: `string`

The name of the port from which the connection originates.

### toNodeId

> **toNodeId**: `RecordId`

The identifier of the node to which the connection is made.

### toPortName

> **toPortName**: `string`

The name of the port to which the connection is made.

## Source

[packages/core/src/studio/nodes/index.ts:230](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L230)
