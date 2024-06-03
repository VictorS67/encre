# Type alias: Message

> **Message**: `object`

Defines the structure of a typical message within the system, incorporating content and optional metadata such as role and name.

## Type declaration

### content

> **content**: `string`

The main textual content of the message.

### name?

> `optional` **name**: `string`

An optional name associated with the message, which could be used for more specific identification or referencing purposes.

### role?

> `optional` **role**: [`MessageRole`](MessageRole.md)

Optional role of the message, which helps categorize the message's origin or purpose within the system.

## Source

[packages/core/src/events/input/load/msgs/base.ts:25](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/msgs/base.ts#L25)
