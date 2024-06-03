# Function: isValidMime()

> **isValidMime**(`mimeLike`): `mimeLike is GeminiMimeType`

Validates if a given value is a supported MIME type in the context of the Gemini API.

## Parameters

• **mimeLike**: `any`

The value to check against known MIME types.

## Returns

`mimeLike is GeminiMimeType`

A boolean indicating if the value is a recognized MIME type.

## Example

```typescript
const mimeType = 'image/png';
const isValid = isValidMime(mimeType);
console.log(isValid); // Outputs: true
```

## Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/utils.ts:297](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/utils.ts#L297)
