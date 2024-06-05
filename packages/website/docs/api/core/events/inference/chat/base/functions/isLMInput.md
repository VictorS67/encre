# Function: isLMInput()

> **isLMInput**(`value`): `value is BaseLMInput`

Type guard to check if a value is a valid BaseLMInput.

## Parameters

• **value**: `unknown`

Value to check.

## Returns

`value is BaseLMInput`

True if the value is a BaseLMInput, false otherwise.

## Example

```typescript
if (isLMInput(someInput)) {
  console.log("Valid input for language model.");
}
```

## Source

[packages/core/src/events/inference/chat/base.ts:635](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/base.ts#L635)
