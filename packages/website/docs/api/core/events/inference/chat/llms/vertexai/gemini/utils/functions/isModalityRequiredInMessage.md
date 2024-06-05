# Function: isModalityRequiredInMessage()

> **isModalityRequiredInMessage**(`message`): `boolean`

Checks whether a message requires a multi-modal response based on the presence of 
inline data.

## Parameters

• **message**: [`BaseMessage`](../../../../../../../input/load/msgs/base/classes/BaseMessage.md)

The message to check.

## Returns

`boolean`

A boolean indicating whether multi-modal capabilities are needed.

## Example

```typescript
const message = new BaseMessage({ content: [{ mimeType: GeminiMimeType.PNG, data: '...' }] });
const required = isModalityRequiredInMessage(message);
console.log(required); // Outputs true if the message contains non-text content.
```

## Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/utils.ts:181](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/utils.ts#L181)
