# Type alias: IfConditionUI

> **IfConditionUI**: `object`

UI representation for an 'if' condition.

## Type declaration

### description?

> `optional` **description**: `string`

Optional description of the condition for better readability or documentation.

### metadata?

> `optional` **metadata**: [`SerializedRuleCollection`](../../serde/type-aliases/SerializedRuleCollection.md)

Optional metadata holding a serialized rule collection that defines the logical structure of the condition.

### source?

> `optional` **source**: `string`

Optional source identifier that this condition can obtain the data from.

### type

> **type**: `"if"`

Specifies the context type as 'if'.

## Source

[packages/core/src/studio/ui.ts:231](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/ui.ts#L231)
