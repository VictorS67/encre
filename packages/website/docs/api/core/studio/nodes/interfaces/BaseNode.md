# Interface: BaseNode

Represents the basic structure of a node within a graphical or data flow environment.
This node carries both visual and functional properties.

## Extended by

- [`SerializableNode`](SerializableNode.md)

## Properties

### description?

> `optional` **description**: `string`

Optional description of the node's functionality.

#### Source

[packages/core/src/studio/nodes/index.ts:83](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L83)

***

### id

> **id**: `RecordId`

Unique identifier for the node.

#### Source

[packages/core/src/studio/nodes/index.ts:30](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L30)

***

### inputs

> **inputs**: `undefined` \| [`NodePortFields`](../type-aliases/NodePortFields.md)

Input ports for the node, mapping port names to data types.

#### Source

[packages/core/src/studio/nodes/index.ts:68](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L68)

***

### outputSizes?

> `optional` **outputSizes**: [`NodePortSizes`](../type-aliases/NodePortSizes.md)

Optional mapping of output ports to their respective data sizes.
Default is 0.

#### Source

[packages/core/src/studio/nodes/index.ts:89](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L89)

***

### outputs

> **outputs**: `undefined` \| [`NodePortFields`](../type-aliases/NodePortFields.md)

Output ports for the node, mapping port names to data types.

#### Source

[packages/core/src/studio/nodes/index.ts:73](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L73)

***

### title?

> `optional` **title**: `string`

Optional title for the node.

#### Source

[packages/core/src/studio/nodes/index.ts:78](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L78)

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

#### Source

[packages/core/src/studio/nodes/index.ts:35](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/nodes/index.ts#L35)
