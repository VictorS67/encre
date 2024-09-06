# Type alias: ElseIfConditionUI

> **ElseIfConditionUI**: `object`

UI representation for an 'else-if' condition.

## Type declaration

### description?

> `optional` **description**: `string`

Optional description of the condition, providing insights into the condition's purpose or logic.

### metadata?

> `optional` **metadata**: [`SerializedRuleCollection`](../../serde/interfaces/SerializedRuleCollection.md)

Optional metadata containing a serialized rule collection that specifies the condition logic.

### source?

> `optional` **source**: `string`

Optional source identifier that this condition can obtain the data from.

### type

> **type**: `"else-if"`

Specifies the context type as 'else-if'.

## Source

[packages/core/src/studio/ui.ts:256](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/ui.ts#L256)
