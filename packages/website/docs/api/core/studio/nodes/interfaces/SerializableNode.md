# Interface: SerializableNode\<NodeType, NodeData\>

Extends `BaseNode` to include serialization capabilities along with additional
runtime properties.

## Extends

- [`BaseNode`](BaseNode.md)

## Extended by

- [`CallableNode`](CallableNode.md)

## Type parameters

• **NodeType** *extends* `string` = `string`

• **NodeData** *extends* [`Serializable`](../../../load/serializable/classes/Serializable.md) = [`Serializable`](../../../load/serializable/classes/Serializable.md)

## Properties

### data

> **data**: `NodeData`

Data associated with the node, which must be serializable.

#### Source

[packages/core/src/studio/nodes/index.ts:128](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L128)

***

### description?

> `optional` **description**: `string`

Optional description of the node's functionality.

#### Inherited from

[`BaseNode`](BaseNode.md) . [`description`](BaseNode.md#description)

#### Source

[packages/core/src/studio/nodes/index.ts:83](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L83)

***

### id

> **id**: `RecordId`

Unique identifier for the node.

#### Inherited from

[`BaseNode`](BaseNode.md) . [`id`](BaseNode.md#id)

#### Source

[packages/core/src/studio/nodes/index.ts:30](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L30)

***

### inputs

> **inputs**: `undefined` \| [`NodePortFields`](../type-aliases/NodePortFields.md)

Input ports for the node, mapping port names to data types.

#### Inherited from

[`BaseNode`](BaseNode.md) . [`inputs`](BaseNode.md#inputs)

#### Source

[packages/core/src/studio/nodes/index.ts:68](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L68)

***

### memory?

> `optional` **memory**: `number`

Estimated RAM usage per process in megabytes.

#### Source

[packages/core/src/studio/nodes/index.ts:123](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L123)

***

### outputSizes?

> `optional` **outputSizes**: [`NodePortSizes`](../type-aliases/NodePortSizes.md)

Optional mapping of output ports to their respective data sizes.
Default is 0.

#### Inherited from

[`BaseNode`](BaseNode.md) . [`outputSizes`](BaseNode.md#outputsizes)

#### Source

[packages/core/src/studio/nodes/index.ts:89](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L89)

***

### outputs

> **outputs**: `undefined` \| [`NodePortFields`](../type-aliases/NodePortFields.md)

Output ports for the node, mapping port names to data types.

#### Inherited from

[`BaseNode`](BaseNode.md) . [`outputs`](BaseNode.md#outputs)

#### Source

[packages/core/src/studio/nodes/index.ts:73](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L73)

***

### registerArgs?

> `optional` **registerArgs**: `Record`\<`string`, `unknown`\>

Optional arguments used to register or initialize the node.

#### Source

[packages/core/src/studio/nodes/index.ts:113](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L113)

***

### runtime?

> `optional` **runtime**: `number`

Estimated runtime per process in milliseconds.

#### Source

[packages/core/src/studio/nodes/index.ts:118](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L118)

***

### subType

> **subType**: `string`

Subtype of the node, providing further specification within its type.

#### Source

[packages/core/src/studio/nodes/index.ts:108](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L108)

***

### title?

> `optional` **title**: `string`

Optional title for the node.

#### Inherited from

[`BaseNode`](BaseNode.md) . [`title`](BaseNode.md#title)

#### Source

[packages/core/src/studio/nodes/index.ts:78](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L78)

***

### type

> **type**: `NodeType`

Type of the node, typically defining its category or functionality.

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

[`BaseNode`](BaseNode.md) . [`visualInfo`](BaseNode.md#visualinfo)

#### Source

[packages/core/src/studio/nodes/index.ts:35](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L35)
