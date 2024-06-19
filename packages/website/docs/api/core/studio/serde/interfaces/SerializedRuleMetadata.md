# Interface: SerializedRuleMetadata

Represents metadata for a rule, providing additional structure for complex logical expressions.
This metadata can define relationships between rules using conjunctions.

## Properties

### conjunction

> **conjunction**: `"and"` \| `"or"`

Specifies the logical operation ('and' or 'or') to apply between `left` and `right`.

#### Source

[packages/core/src/studio/serde.ts:90](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L90)

***

### left

> **left**: [`SerializedRule`](SerializedRule.md)

The left-hand side of the rule expression.

#### Source

[packages/core/src/studio/serde.ts:88](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L88)

***

### right?

> `optional` **right**: [`SerializedRule`](SerializedRule.md)

Optional right-hand side of the rule expression; used for binary operations.

#### Source

[packages/core/src/studio/serde.ts:89](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L89)
