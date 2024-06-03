# Interface: CallableNode\<NodeType, NodeData\>

Specialized version of `SerializableNode` that represents nodes capable of performing
callable actions.

## Extends

- [`SerializableNode`](SerializableNode.md)\<`NodeType`, `NodeData`\>

## Type parameters

• **NodeType** *extends* `string` = `string`

• **NodeData** *extends* [`Callable`](../../../record/callable/classes/Callable.md) = [`Callable`](../../../record/callable/classes/Callable.md)

## Properties

### data

> **data**: `NodeData`

Data associated with the node, which must be serializable.

#### Inherited from

[`SerializableNode`](SerializableNode.md) . [`data`](SerializableNode.md#data)

#### Source

[packages/core/src/studio/nodes/index.ts:128](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L128)

***

### description?

> `optional` **description**: `string`

Optional description of the node's functionality.

#### Inherited from

[`SerializableNode`](SerializableNode.md) . [`description`](SerializableNode.md#description)

#### Source

[packages/core/src/studio/nodes/index.ts:83](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L83)

***

### id

> **id**: `RecordId`

Unique identifier for the node.

#### Inherited from

[`SerializableNode`](SerializableNode.md) . [`id`](SerializableNode.md#id)

#### Source

[packages/core/src/studio/nodes/index.ts:30](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L30)

***

### inputs

> **inputs**: `undefined` \| [`NodePortFields`](../type-aliases/NodePortFields.md)

Input ports for the node, mapping port names to data types.

#### Inherited from

[`SerializableNode`](SerializableNode.md) . [`inputs`](SerializableNode.md#inputs)

#### Source

[packages/core/src/studio/nodes/index.ts:68](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L68)

***

### memory?

> `optional` **memory**: `number`

Estimated RAM usage per process in megabytes.

#### Inherited from

[`SerializableNode`](SerializableNode.md) . [`memory`](SerializableNode.md#memory)

#### Source

[packages/core/src/studio/nodes/index.ts:123](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L123)

***

### outputSizes?

> `optional` **outputSizes**: [`NodePortSizes`](../type-aliases/NodePortSizes.md)

Optional mapping of output ports to their respective data sizes.
Default is 0.

#### Inherited from

[`SerializableNode`](SerializableNode.md) . [`outputSizes`](SerializableNode.md#outputsizes)

#### Source

[packages/core/src/studio/nodes/index.ts:89](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L89)

***

### outputs

> **outputs**: `undefined` \| [`NodePortFields`](../type-aliases/NodePortFields.md)

Output ports for the node, mapping port names to data types.

#### Inherited from

[`SerializableNode`](SerializableNode.md) . [`outputs`](SerializableNode.md#outputs)

#### Source

[packages/core/src/studio/nodes/index.ts:73](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L73)

***

### registerArgs?

> `optional` **registerArgs**: `Record`\<`string`, `unknown`\>

Optional arguments used to register or initialize the node.

#### Inherited from

[`SerializableNode`](SerializableNode.md) . [`registerArgs`](SerializableNode.md#registerargs)

#### Source

[packages/core/src/studio/nodes/index.ts:113](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L113)

***

### runtime?

> `optional` **runtime**: `number`

Estimated runtime per process in milliseconds.

#### Inherited from

[`SerializableNode`](SerializableNode.md) . [`runtime`](SerializableNode.md#runtime)

#### Source

[packages/core/src/studio/nodes/index.ts:118](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L118)

***

### subType

> **subType**: `string`

Subtype of the node, providing further specification within its type.

#### Inherited from

[`SerializableNode`](SerializableNode.md) . [`subType`](SerializableNode.md#subtype)

#### Source

[packages/core/src/studio/nodes/index.ts:108](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L108)

***

### title?

> `optional` **title**: `string`

Optional title for the node.

#### Inherited from

[`SerializableNode`](SerializableNode.md) . [`title`](SerializableNode.md#title)

#### Source

[packages/core/src/studio/nodes/index.ts:78](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L78)

***

### type

> **type**: `NodeType`

Type of the node, typically defining its category or functionality.

#### Inherited from

[`SerializableNode`](SerializableNode.md) . [`type`](SerializableNode.md#type)

#### Source

[packages/core/src/studio/nodes/index.ts:103](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L103)

***

### visualInfo

> **visualInfo**: `object`

Visual presentation details of the node, including position and size.

#### content?

> `optional` **content**: `object`

#### content.color?

> `optional` **color**: `"red"` \| `"orange"` \| `"gold"` \| `"yellow"` \| `"palmera"` \| `"green"` \| `"meadow"` \| `"cyan"` \| `"blue"` \| `"cornflower"` \| `"purple"` \| `"pink"` \| `"razzmatazz"` \| `"silver"` \| `"dark"`

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

#### Inherited from

[`SerializableNode`](SerializableNode.md) . [`visualInfo`](SerializableNode.md#visualinfo)

#### Source

[packages/core/src/studio/nodes/index.ts:35](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L35)
