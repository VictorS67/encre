# Interface: SerializedMessage

Represents a fully serialized message, combining the role with its detailed data.

## Properties

### json

> **json**: [`SerializedMessageData`](SerializedMessageData.md)

The detailed data of the message, structured as per SerializedMessageData.

#### Source

[packages/core/src/events/output/provide/message.ts:55](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/output/provide/message.ts#L55)

***

### role

> **role**: [`MessageRole`](../../../../input/load/msgs/base/type-aliases/MessageRole.md)

The role of the message, defining how it should be interpreted or handled within the system.

#### Source

[packages/core/src/events/output/provide/message.ts:50](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/output/provide/message.ts#L50)
