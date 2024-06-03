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

[packages/core/src/studio/condition.ts:51](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/condition.ts#L51)
