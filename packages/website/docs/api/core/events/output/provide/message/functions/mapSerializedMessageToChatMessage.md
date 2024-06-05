# Function: mapSerializedMessageToChatMessage()

> **mapSerializedMessageToChatMessage**(`message`): [`BaseMessage`](../../../../input/load/msgs/base/classes/BaseMessage.md)

Converts a SerializedMessage into a BaseMessage instance based on the message's role.
This function maps serialized message data to concrete message classes like HumanMessage, BotMessage, etc.

## Parameters

• **message**: [`SerializedMessage`](../interfaces/SerializedMessage.md)

A SerializedMessage to be converted into a BaseMessage.

## Returns

[`BaseMessage`](../../../../input/load/msgs/base/classes/BaseMessage.md)

A BaseMessage instance corresponding to the specified role in the SerializedMessage.

## Throws

Error if the role is invalid or unsupported for conversion.

## Source

[packages/core/src/events/output/provide/message.ts:189](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/output/provide/message.ts#L189)
