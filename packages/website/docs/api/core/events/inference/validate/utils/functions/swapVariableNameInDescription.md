# Function: swapVariableNameInDescription()

> **swapVariableNameInDescription**(`description`, `oldVarName`, `newVarName`): `string`

Replaces occurrences of a specified variable placeholder within a string description with a new variable name.
This function is useful for dynamically updating templates or text that include variable placeholders.

### Example
```typescript
const description = "The value of {{oldName}} will be updated.";
const updatedDescription = swapVariableNameInDescription(description, "oldName", "newName");

console.log(updatedDescription); 
// Outputs: "The value of {{newName}} will be updated."
```

## Parameters

• **description**: `string`

The string containing the variable placeholders to be swapped.

• **oldVarName**: `string`

The current variable name (placeholder) to be replaced.

• **newVarName**: `string`

The new variable name to replace the old variable name.

## Returns

`string`

A new string with the old variable names replaced by the new variable names.

## Source

[packages/core/src/events/inference/validate/utils.ts:19](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/utils.ts#L19)
