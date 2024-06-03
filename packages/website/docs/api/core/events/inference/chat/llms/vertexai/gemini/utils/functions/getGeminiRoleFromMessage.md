# Function: getGeminiRoleFromMessage()

> **getGeminiRoleFromMessage**(`message`): [`GeminiContentRole`](../../../type-aliases/GeminiContentRole.md)

Determines the Gemini content role for a given message based on its internal role.

## Parameters

• **message**: [`BaseMessage`](../../../../../../../input/load/msgs/base/classes/BaseMessage.md)

The message whose role is to be determined.

## Returns

[`GeminiContentRole`](../../../type-aliases/GeminiContentRole.md)

The corresponding Gemini content role.

## Throws

Error if the message's role does not support mapping to a Gemini role.

## Example

```typescript
const message = new BotMessage({ content: 'Processing your request.' });
const role = getGeminiRoleFromMessage(message);
console.log(role); // Outputs 'model'
```

## Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/utils.ts:116](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/utils.ts#L116)
