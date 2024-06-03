# Type alias: ElseIfConditionUI

> **ElseIfConditionUI**: `object`

UI representation for an 'else-if' condition.

## Type declaration

### description?

> `optional` **description**: `string`

Optional description of the condition, providing insights into the condition's purpose or logic.

### metadata?

> `optional` **metadata**: [`SerializedRuleCollection`](../../serde/type-aliases/SerializedRuleCollection.md)

Optional metadata containing a serialized rule collection that specifies the condition logic.

### source?

> `optional` **source**: `string`

Optional source identifier that this condition can obtain the data from.

### type

> **type**: `"else-if"`

Specifies the context type as 'else-if'.

## Source

[packages/core/src/studio/ui.ts:256](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/ui.ts#L256)
