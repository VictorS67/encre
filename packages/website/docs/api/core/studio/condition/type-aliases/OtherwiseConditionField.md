# Type alias: OtherwiseConditionField

> **OtherwiseConditionField**: `object`

Represents an 'otherwise' condition, a fallback that executes if all other 'if' and 'else-if' conditions fail.

## Type declaration

### source?

> `optional` **source**: `string`

Optional identifier for the source of the data, typically unused as it's a default fallback.

### type

> **type**: `"otherwise"`

Indicates the type of condition ('otherwise').

## Source

[packages/core/src/studio/condition.ts:51](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/condition.ts#L51)
