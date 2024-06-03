# Function: isInlineData()

> **isInlineData**(`partLike`): `partLike is GeminiInlineData`

Checks if a given object conforms to the structure of inline data as expected by the 
Gemini API, typically for media content.

## Parameters

• **partLike**: `any`

The object to verify as inline data.

## Returns

`partLike is GeminiInlineData`

A boolean indicating if the object is valid inline data.

## Example

```typescript
const part = { mimeType: GeminiMimeType.PNG, data: 'base64-encoded-data' };
const isValid = isInlineData(part);
console.log(isValid); // Outputs: true
```

## Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/utils.ts:275](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/utils.ts#L275)
