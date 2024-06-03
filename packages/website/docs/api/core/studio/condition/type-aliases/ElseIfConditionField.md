# Type alias: ElseIfConditionField

> **ElseIfConditionField**: `object`

Represents an 'else-if' condition which is evaluated if the preceding 'if' or 'else-if' conditions fail.

## Type declaration

### ruleCollection

> **ruleCollection**: [`BaseRuleCollection`](../../../events/input/load/rules/base/classes/BaseRuleCollection.md)

Collection of rules that determine when this condition should apply.

### source?

> `optional` **source**: `string`

Optional identifier for the source of the data to be evaluated by the condition.

### type

> **type**: `"else-if"`

Indicates the type of condition ('else-if').

## Source

[packages/core/src/studio/condition.ts:31](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/condition.ts#L31)
