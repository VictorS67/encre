# Type alias: SerializedRuleMetadata

> **SerializedRuleMetadata**: `object`

Represents metadata for a rule, providing additional structure for complex logical expressions.
This metadata can define relationships between rules using conjunctions.

## Type declaration

### conjunction

> **conjunction**: `"and"` \| `"or"`

### left

> **left**: [`SerializedRule`](SerializedRule.md)

### right?

> `optional` **right**: [`SerializedRule`](SerializedRule.md)

## Source

[packages/core/src/studio/serde.ts:84](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/serde.ts#L84)
