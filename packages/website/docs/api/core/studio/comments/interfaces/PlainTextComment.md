# Interface: PlainTextComment

Extends `BaseComment` to specify a comment that contains plain text. 
This type of comment is straightforward and used for simple annotations without formatting needs.

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

### text

> **text**: `string`

The actual text content of the comment.

#### Source

[packages/core/src/studio/comments/index.ts:74](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/comments/index.ts#L74)

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

> **type**: `"plain"`

Literal type indicating that this is a plain text comment.

#### Source

[packages/core/src/studio/comments/index.ts:69](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/comments/index.ts#L69)

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
