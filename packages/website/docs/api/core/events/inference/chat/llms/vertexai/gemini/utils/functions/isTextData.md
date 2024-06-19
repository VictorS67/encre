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

[packages/core/src/events/inference/chat/llms/vertexai/gemini/utils.ts:253](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/utils.ts#L253)
