# Function: swapKeysInVariables()

> **swapKeysInVariables**(`oldVariables`, `suffix`): `Record`\<`string`, `unknown`\>

Creates a new variables record by appending a suffix to each key in the original variables record.
This function is useful for namespace management or when duplicating variable sets with modified keys.

### Example
```typescript
const oldVariables = { key1: "value1", key2: "value2" };
const newVariables = swapKeysInVariables(oldVariables, "_new");

console.log(newVariables);
// Outputs: { key1_new: "value1", key2_new: "value2" }
```

## Parameters

• **oldVariables**: `Record`\<`string`, `unknown`\>

The original record of variables whose keys need to be modified.

• **suffix**: `string`

The suffix to append to each key in the original record.

## Returns

`Record`\<`string`, `unknown`\>

A new record with the keys modified by appending the specified suffix.

## Source

[packages/core/src/events/inference/validate/utils.ts:90](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/utils.ts#L90)
