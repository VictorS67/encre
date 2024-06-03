# Interface: BaseMessageFields

Defines the structure for the basic fields of a message within the system.
This interface includes the primary content of the message, an optional name,
and additional keyword arguments that might be used for further customization or processing.

## Extended by

- [`ChatMessageFields`](../../chat/interfaces/ChatMessageFields.md)

## Properties

### additionalKwargs?

> `optional` **additionalKwargs**: `object`

Optional additional keyword arguments that provide extended functionality and flexibility
in handling the message. These might include additional data fields not covered by the standard properties.

#### Index signature

 \[`key`: `string`\]: `unknown`

#### Source

[packages/core/src/events/input/load/msgs/base.ts:75](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/msgs/base.ts#L75)

***

### content

> **content**: [`ContentLike`](../type-aliases/ContentLike.md) \| [`ContentLike`](../type-aliases/ContentLike.md)[]

The main content of the message. It can be a string or a more complex structure
represented by an object with key-value pairs.

#### Source

[packages/core/src/events/input/load/msgs/base.ts:64](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/msgs/base.ts#L64)

***

### name?

> `optional` **name**: `string`

An optional name for the message, which could be used for identifying or categorizing the message.

#### Source

[packages/core/src/events/input/load/msgs/base.ts:69](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/msgs/base.ts#L69)
