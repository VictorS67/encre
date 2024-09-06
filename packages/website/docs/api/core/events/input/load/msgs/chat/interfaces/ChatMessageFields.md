# Interface: ChatMessageFields

Extends BaseMessageFields with a mandatory role property specific to chat messages.
This interface is tailored for chat message data structures, ensuring each message includes a designated role.

## Extends

- [`BaseMessageFields`](../../base/interfaces/BaseMessageFields.md)

## Properties

### additionalKwargs?

> `optional` **additionalKwargs**: `object`

Optional additional keyword arguments that provide extended functionality and flexibility
in handling the message. These might include additional data fields not covered by the standard properties.

#### Index signature

 \[`key`: `string`\]: `unknown`

#### Inherited from

[`BaseMessageFields`](../../base/interfaces/BaseMessageFields.md) . [`additionalKwargs`](../../base/interfaces/BaseMessageFields.md#additionalkwargs)

#### Source

[packages/core/src/events/input/load/msgs/base.ts:75](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/msgs/base.ts#L75)

***

### content

> **content**: [`ContentLike`](../../base/type-aliases/ContentLike.md) \| [`ContentLike`](../../base/type-aliases/ContentLike.md)[]

The main content of the message. It can be a string or a more complex structure
represented by an object with key-value pairs.

#### Inherited from

[`BaseMessageFields`](../../base/interfaces/BaseMessageFields.md) . [`content`](../../base/interfaces/BaseMessageFields.md#content)

#### Source

[packages/core/src/events/input/load/msgs/base.ts:64](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/msgs/base.ts#L64)

***

### name?

> `optional` **name**: `string`

An optional name for the message, which could be used for identifying or categorizing the message.

#### Inherited from

[`BaseMessageFields`](../../base/interfaces/BaseMessageFields.md) . [`name`](../../base/interfaces/BaseMessageFields.md#name)

#### Source

[packages/core/src/events/input/load/msgs/base.ts:69](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/msgs/base.ts#L69)

***

### role

> **role**: `string`

The role associated with the chat message, typically indicating the sender's category such as 'user', 'bot', or 'system'.

#### Source

[packages/core/src/events/input/load/msgs/chat.ts:11](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/msgs/chat.ts#L11)
