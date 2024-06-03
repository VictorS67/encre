# Function: isTextData()

> **isTextData**(`partLike`): `boolean`

Determines whether a given part-like object qualifies as valid text data for the Gemini API.

## Parameters

• **partLike**: `any`

The object to check.

## Returns

`boolean`

A boolean indicating if the object contains text data suitable for the API.

## Example

```typescript
const content = { text: "Example text" };
const isText = isTextData(content);
console.log(isText); // Outputs: true
```

## Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/utils.ts:253](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/utils.ts#L253)
