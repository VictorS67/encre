# Function: calculateMaxToken()

> **calculateMaxToken**(`prompt`, `modelName`): `Promise`\<`number`\>

Utility function to calculate the maximum number of tokens that can be sent to the model
after accounting for the tokens in the prompt.

## Parameters

• **prompt**: `string`

The text to be sent to the model.

• **modelName**: `TiktokenModel`

The model's name, which determines the total context size.

## Returns

`Promise`\<`number`\>

Maximum number of tokens that can be added to the prompt.

## Example

```typescript
const remainingTokens = await calculateMaxToken("Example prompt", "gpt-3.5-turbo-16k");
console.log(remainingTokens);
```

## Source

[packages/core/src/events/inference/chat/base.ts:580](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/base.ts#L580)
