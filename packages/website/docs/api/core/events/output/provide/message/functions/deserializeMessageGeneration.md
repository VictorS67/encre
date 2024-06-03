# Function: deserializeMessageGeneration()

> **deserializeMessageGeneration**(`serializedMsgGeneration`): [`MessageGeneration`](../interfaces/MessageGeneration.md) \| [`ChatGeneration`](../interfaces/ChatGeneration.md)

Deserializes a SerializedMessageGeneration back into a MessageGeneration or ChatGeneration object.
This function is essential for reconstructing message generation instances from their serialized forms.

## Parameters

• **serializedMsgGeneration**: [`SerializedMessageGeneration`](../interfaces/SerializedMessageGeneration.md)

A SerializedMessageGeneration object containing the serialized data.

## Returns

[`MessageGeneration`](../interfaces/MessageGeneration.md) \| [`ChatGeneration`](../interfaces/ChatGeneration.md)

A MessageGeneration or ChatGeneration object reconstructed from the serialized data.

## Source

[packages/core/src/events/output/provide/message.ts:238](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/message.ts#L238)
