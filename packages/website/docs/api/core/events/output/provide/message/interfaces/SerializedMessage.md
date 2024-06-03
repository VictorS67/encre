# Interface: SerializedMessage

Represents a fully serialized message, combining the role with its detailed data.

## Properties

### json

> **json**: [`SerializedMessageData`](SerializedMessageData.md)

The detailed data of the message, structured as per SerializedMessageData.

#### Source

[packages/core/src/events/output/provide/message.ts:55](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/message.ts#L55)

***

### role

> **role**: [`MessageRole`](../../../../input/load/msgs/base/type-aliases/MessageRole.md)

The role of the message, defining how it should be interpreted or handled within the system.

#### Source

[packages/core/src/events/output/provide/message.ts:50](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/message.ts#L50)
