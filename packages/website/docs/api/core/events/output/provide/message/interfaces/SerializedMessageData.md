# Interface: SerializedMessageData

Represents the data structure of a serialized message, which includes all essential fields that describe a message.

## Properties

### additionalKwargs?

> `optional` **additionalKwargs**: `object`

Optional additional keyword arguments that provide extended functionality and flexibility
in handling the message. These might include additional data fields not covered by the standard properties.

#### Index signature

 \[`key`: `string`\]: `unknown`

#### Source

[packages/core/src/events/output/provide/message.ts:38](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/output/provide/message.ts#L38)

***

### content

> **content**: [`ContentLike`](../../../../input/load/msgs/base/type-aliases/ContentLike.md) \| [`ContentLike`](../../../../input/load/msgs/base/type-aliases/ContentLike.md)[]

The main content of the message. It can be a string or a more complex structure
represented by an object with key-value pairs.

#### Source

[packages/core/src/events/output/provide/message.ts:22](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/output/provide/message.ts#L22)

***

### name?

> `optional` **name**: `string`

An optional name for the message, which could be used for identifying or categorizing the message.

#### Source

[packages/core/src/events/output/provide/message.ts:32](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/output/provide/message.ts#L32)

***

### role?

> `optional` **role**: [`MessageRole`](../../../../input/load/msgs/base/type-aliases/MessageRole.md)

The role of the message, specifying the category of the sender or purpose within the system.

#### Source

[packages/core/src/events/output/provide/message.ts:27](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/output/provide/message.ts#L27)
