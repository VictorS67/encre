# Type alias: IfConditionUI

> **IfConditionUI**: `object`

UI representation for an 'if' condition.

## Type declaration

### description?

> `optional` **description**: `string`

Optional description of the condition for better readability or documentation.

### metadata?

> `optional` **metadata**: [`SerializedRuleCollection`](../../serde/interfaces/SerializedRuleCollection.md)

Optional metadata holding a serialized rule collection that defines the logical structure of the condition.

### source?

> `optional` **source**: `string`

Optional source identifier that this condition can obtain the data from.

### type

> **type**: `"if"`

Specifies the context type as 'if'.

## Source

[packages/core/src/studio/ui.ts:231](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/ui.ts#L231)
