# Type alias: ConditionUIContext

> **ConditionUIContext**: `object`

UI context for representing conditions, typically used in conditional rendering or logic scenarios.

## Type declaration

### conditions

> **conditions**: [`ConditionUI`](ConditionUI.md)[]

An array of conditions, each defined by either an IfConditionUI, ElseIfConditionUI, or OtherwiseConditionUI.

### sources

> **sources**: `string`[]

Array of source identifiers that influence the conditions, as well as providing its data to any target.

### target

> **target**: `string`

The target variable can obtain data from by the conditions.

### type

> **type**: `"condition"`

Specifies the context type as 'condition'.

## Source

[packages/core/src/studio/ui.ts:306](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/ui.ts#L306)
