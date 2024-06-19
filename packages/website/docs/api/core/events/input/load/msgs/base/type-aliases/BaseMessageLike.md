# Type alias: BaseMessageLike

> **BaseMessageLike**: [`BaseMessage`](../classes/BaseMessage.md) \| [[`MessageRole`](MessageRole.md), `string`] \| `string`

Represents a flexible representation of a message, which can be either a complete BaseMessage instance, a tuple of role and string content,
or a simple string. This type is useful for functions that need to accept messages in various formats.

## Source

[packages/core/src/events/input/load/msgs/base.ts:46](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/msgs/base.ts#L46)
