# Function: serializeMessageGeneration()

> **serializeMessageGeneration**(`generation`): [`SerializedMessageGeneration`](../interfaces/SerializedMessageGeneration.md)

Serializes a MessageGeneration object into a SerializedMessageGeneration structure.
This function is used primarily for converting MessageGeneration instances into a format suitable for storage or transmission.

## Parameters

• **generation**: [`MessageGeneration`](../interfaces/MessageGeneration.md)

A MessageGeneration object to be serialized.

## Returns

[`SerializedMessageGeneration`](../interfaces/SerializedMessageGeneration.md)

A SerializedMessageGeneration containing the text output and optionally a serialized message.

## Source

[packages/core/src/events/output/provide/message.ts:217](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/message.ts#L217)
