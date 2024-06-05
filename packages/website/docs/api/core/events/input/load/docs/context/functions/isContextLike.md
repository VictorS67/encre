# Function: isContextLike()

> **isContextLike**(`value`): `value is ContextLike`

Determines whether a given value qualifies as a ContextLike. This function is used to validate
if a value can either be directly used as a Context, converted to one, or is an array of Contexts.

## Parameters

• **value**: `unknown`

The value to evaluate.

## Returns

`value is ContextLike`

True if the value is a string, a Context instance, or an array of Context instances; false otherwise.

## Source

[packages/core/src/events/input/load/docs/context.ts:72](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/docs/context.ts#L72)
