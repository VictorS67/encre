# Interface: BaseComment

Represents the basic structure of a comment in a graph-based application. 
This interface defines the common properties that all types of comments share, 
including identifier, visual styling, and optional textual content.

## Extended by

- [`PlainTextComment`](PlainTextComment.md)
- [`MarkdownComment`](MarkdownComment.md)
- [`CodeComment`](CodeComment.md)

## Properties

### description?

> `optional` **description**: `string`

Optional descriptive text for the comment.

#### Source

[packages/core/src/studio/comments/index.ts:58](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/comments/index.ts#L58)

***

### id

> **id**: `RecordId`

The unique identifier for the comment.

#### Source

[packages/core/src/studio/comments/index.ts:12](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/comments/index.ts#L12)

***

### title?

> `optional` **title**: `string`

Optional title for the comment.

#### Source

[packages/core/src/studio/comments/index.ts:53](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/comments/index.ts#L53)

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

#### Source

[packages/core/src/studio/comments/index.ts:18](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/comments/index.ts#L18)
