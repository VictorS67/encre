# Function: getInlinePartFromInlineData()

> **getInlinePartFromInlineData**(`inlineData`): `InlineDataPart`

Creates an inline data part for the Gemini API using the specified inline data, 
typically used for including media like images in API requests.

## Parameters

• **inlineData**: [`GeminiInlineData`](../../../interfaces/GeminiInlineData.md)

The inline data containing mimeType and base64-encoded data.

## Returns

`InlineDataPart`

An object that represents an inline data part for use in Gemini API calls.

## Example

```typescript
const inlineData: GeminiInlineData = {
  mimeType: GeminiMimeType.PNG,
  data: 'base64-encoded-image-data'
};
const inlinePart = getInlinePartFromInlineData(inlineData);
console.log(inlinePart); 
// Outputs: { inlineData: { mimeType: 'image/png', data: 'base64-encoded-image-data' } }
```

## Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/utils.ts:230](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/utils.ts#L230)
