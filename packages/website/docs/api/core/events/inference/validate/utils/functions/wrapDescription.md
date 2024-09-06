# Function: wrapDescription()

> **wrapDescription**(`description`, `conjunction`): `string`

Conditionally wraps a description in parentheses based on the logical operators present
and the intended conjunction for the description. This function is typically used to ensure
logical grouping in expressions when modifying or combining conditions.

### Example
```typescript
const description = "condition1 OR condition2";
const wrapped = wrapDescription(description, 'and');

console.log(wrapped); 
// Outputs: "(condition1 OR condition2)"
```

## Parameters

• **description**: `string`

The description text that might need to be wrapped.

• **conjunction**: `"and"` \| `"or"`

The logical conjunction ('or' | 'and') that determines how the description should be wrapped.

## Returns

`string`

The description, possibly wrapped in parentheses to ensure correct logical grouping.

## Source

[packages/core/src/events/inference/validate/utils.ts:51](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/utils.ts#L51)
