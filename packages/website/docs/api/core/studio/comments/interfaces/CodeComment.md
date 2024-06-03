# Interface: CodeComment

Extends `BaseComment` for comments intended to display code snippets. 
This type supports syntax highlighting by specifying a programming language.

## Extends

- [`BaseComment`](BaseComment.md)

## Properties

### description?

> `optional` **description**: `string`

Optional descriptive text for the comment.

#### Inherited from

[`BaseComment`](BaseComment.md) . [`description`](BaseComment.md#description)

#### Source

[packages/core/src/studio/comments/index.ts:58](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/comments/index.ts#L58)

***

### id

> **id**: `RecordId`

The unique identifier for the comment.

#### Inherited from

[`BaseComment`](BaseComment.md) . [`id`](BaseComment.md#id)

#### Source

[packages/core/src/studio/comments/index.ts:12](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/comments/index.ts#L12)

***

### keywords?

> `optional` **keywords**: `string`[]

Optional list of keywords important in the context of the code snippet, 
which could be highlighted or indexed.

#### Source

[packages/core/src/studio/comments/index.ts:118](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/comments/index.ts#L118)

***

### language?

> `optional` **language**: `string`

Optional programming language for syntax highlighting.

#### Source

[packages/core/src/studio/comments/index.ts:112](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/comments/index.ts#L112)

***

### text

> **text**: `string`

The code snippet to be displayed in the comment.

#### Source

[packages/core/src/studio/comments/index.ts:107](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/comments/index.ts#L107)

***

### title?

> `optional` **title**: `string`

Optional title for the comment.

#### Inherited from

[`BaseComment`](BaseComment.md) . [`title`](BaseComment.md#title)

#### Source

[packages/core/src/studio/comments/index.ts:53](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/comments/index.ts#L53)

***

### type

> **type**: `"code"`

Literal type indicating that this is a code comment.

#### Source

[packages/core/src/studio/comments/index.ts:102](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/comments/index.ts#L102)

***

### visualInfo

> **visualInfo**: `object`

Information about the visual presentation of the comment including its position, size, 
and optional content styling such as text alignment and color.

#### content?

> `optional` **content**: `object`

#### content.color?

> `optional` **color**: `"red"` \| `"orange"` \| `"gold"` \| `"yellow"` \| `"palmera"` \| `"green"` \| `"meadow"` \| `"cyan"` \| `"blue"` \| `"cornflower"` \| `"purple"` \| `"pink"` \| `"razzmatazz"` \| `"silver"` \| `"dark"`

#### content.horitontal?

> `optional` **horitontal**: `"center"` \| `"start"` \| `"end"` \| `"justify"`

#### content.vertical?

> `optional` **vertical**: `"center"` \| `"start"` \| `"end"`

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

[`BaseComment`](BaseComment.md) . [`visualInfo`](BaseComment.md#visualinfo)

#### Source

[packages/core/src/studio/comments/index.ts:18](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/comments/index.ts#L18)
