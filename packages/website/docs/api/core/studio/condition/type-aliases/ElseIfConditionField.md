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

[packages/core/src/studio/condition.ts:31](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/condition.ts#L31)
