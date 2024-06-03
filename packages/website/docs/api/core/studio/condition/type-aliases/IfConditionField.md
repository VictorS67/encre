# Type alias: IfConditionField

> **IfConditionField**: `object`

Represents the base structure for an 'if' condition field in a conditional rule system.

## Type declaration

### ruleCollection

> **ruleCollection**: [`BaseRuleCollection`](../../../events/input/load/rules/base/classes/BaseRuleCollection.md)

Collection of rules that determine when this condition should apply.

### source?

> `optional` **source**: `string`

Optional identifier for the source of the data to be evaluated by the condition.

### type

> **type**: `"if"`

Indicates the type of condition ('if')

## Source

[packages/core/src/studio/condition.ts:11](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/condition.ts#L11)
