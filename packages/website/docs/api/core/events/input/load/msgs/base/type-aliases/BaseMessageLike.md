# Type alias: BaseMessageLike

> **BaseMessageLike**: [`BaseMessage`](../classes/BaseMessage.md) \| [[`MessageRole`](MessageRole.md), `string`] \| `string`

Represents a flexible representation of a message, which can be either a complete BaseMessage instance, a tuple of role and string content,
or a simple string. This type is useful for functions that need to accept messages in various formats.

## Source

[packages/core/src/events/input/load/msgs/base.ts:46](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/msgs/base.ts#L46)
