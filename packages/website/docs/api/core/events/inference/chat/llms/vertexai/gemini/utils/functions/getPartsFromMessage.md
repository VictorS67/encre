# Function: getPartsFromMessage()

> **getPartsFromMessage**(`message`): `Part`[]

Extracts parts from a message, suitable for forming the parts array in a Gemini content 
structure.

## Parameters

• **message**: [`BaseMessage`](../../../../../../../input/load/msgs/base/classes/BaseMessage.md)

The message to extract parts from.

## Returns

`Part`[]

An array of Parts derived from the message content.

## Throws

Error if the message content type is unsupported.

## Example

```typescript
const message = new HumanMessage({ content: 'Can you provide more details?' });
const parts = getPartsFromMessage(message);
console.log(parts); // Outputs [{ text: 'Can you provide more details?' }]
```

## Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/utils.ts:146](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/utils.ts#L146)
