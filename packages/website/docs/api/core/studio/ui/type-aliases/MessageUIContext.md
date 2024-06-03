# Type alias: MessageUIContext

> **MessageUIContext**: `object`

UI context for displaying messages, possibly in a chat or log format.

## Type declaration

### content

> **content**: ([`PlainUIContext`](PlainUIContext.md) \| [`MarkdownUIContext`](MarkdownUIContext.md) \| [`CodeUIContext`](CodeUIContext.md))[]

An array of UI contexts that make up the content of the message.

### kwargs

> **kwargs**: ([`PlainUIContext`](PlainUIContext.md) \| [`MarkdownUIContext`](MarkdownUIContext.md) \| [`CodeUIContext`](CodeUIContext.md))[]

An array of UI contexts representing additional data or parameters associated with the message.

### name?

> `optional` **name**: `string`

Optional name of the message sender.

### role

> **role**: `string` \| [`MessageRole`](../../../events/input/load/msgs/base/type-aliases/MessageRole.md)

The role of the message sender, can be a predefined string or a MessageRole enum.

### type

> **type**: `"message"`

Specifies the context type as 'message'.

## Source

[packages/core/src/studio/ui.ts:134](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/ui.ts#L134)
