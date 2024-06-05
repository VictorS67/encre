# Function: isSerializedMessage()

> **isSerializedMessage**(`value`): `value is SerializedMessageData`

Validates if a given value is a SerializedMessageData by checking required fields and types.
Ensures the value contains all necessary attributes with appropriate types for representing a serialized message.

## Parameters

• **value**: `unknown`

The value to check for compliance with SerializedMessageData structure.

## Returns

`value is SerializedMessageData`

True if the value matches the SerializedMessageData structure, false otherwise.

## Source

[packages/core/src/events/output/provide/message.ts:155](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/output/provide/message.ts#L155)
