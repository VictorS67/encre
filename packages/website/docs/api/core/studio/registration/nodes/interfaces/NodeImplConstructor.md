# Interface: NodeImplConstructor\<T\>

Provides a constructor interface for node implementations,
allowing creation of node instances and initialization from raw data.

## Type parameters

• **T** *extends* [`SerializableNode`](../../../nodes/interfaces/SerializableNode.md)

## Constructors

### new NodeImplConstructor()

> **new NodeImplConstructor**(`node`): [`NodeImpl`](../../../nodes/base/classes/NodeImpl.md)\<`T`, `T`\[`"type"`\], `T`\[`"subType"`\]\>

Constructor that initializes with a node instance.

#### Parameters

• **node**: `T`

#### Returns

[`NodeImpl`](../../../nodes/base/classes/NodeImpl.md)\<`T`, `T`\[`"type"`\], `T`\[`"subType"`\]\>

#### Source

[packages/core/src/studio/registration/nodes.ts:46](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/registration/nodes.ts#L46)

## Methods

### create()

> **create**(`args`?): `T`

Factory method to create a node with optional arguments.

#### Parameters

• **args?**: `Record`\<`string`, `unknown`\>

registry arguments for creating the specific node.

#### Returns

`T`

#### Source

[packages/core/src/studio/registration/nodes.ts:52](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/registration/nodes.ts#L52)

***

### nodeFrom()

> **nodeFrom**(`raw`, `args`?): `T`

Initializes a node from a serializable object with optional arguments.

#### Parameters

• **raw**: [`Serializable`](../../../../load/serializable/classes/Serializable.md)

customized serializable to attach to the node's data.

• **args?**: `Record`\<`string`, `unknown`\>

registry arguments for creating the specific node.

#### Returns

`T`

#### Source

[packages/core/src/studio/registration/nodes.ts:59](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/registration/nodes.ts#L59)
