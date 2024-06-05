# Function: getTextPart()

> **getTextPart**(`content`): `any`

Constructs a text part suitable for use in Gemini API calls from a given content object.

## Parameters

• **content**: `any`

The content object containing the text.

## Returns

`any`

An object representing a text part for the Gemini API.

## Example

```typescript
const textContent = { text: "Hello, world!" };
const textPart = getTextPart(textContent);
console.log(textPart); // Outputs: { text: "Hello, world!" }
```

## Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/utils.ts:207](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/utils.ts#L207)
