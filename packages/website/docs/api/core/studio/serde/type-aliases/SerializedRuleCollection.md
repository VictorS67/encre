# Type alias: SerializedRuleCollection

> **SerializedRuleCollection**: `object`

Represents a collection of rules grouped together, often used to apply a set of related rules
collectively. This collection can include individual rules or other nested rule collections.

## Type declaration

### \_type

> **\_type**: `"rule-collection"`

### collection

> **collection**: `Record`\<`string`, [`SerializedRule`](SerializedRule.md) \| [`SerializedRuleCollection`](SerializedRuleCollection.md)\>

### conjunction

> **conjunction**: `"and"` \| `"or"`

### description

> **description**: `string`

## Source

[packages/core/src/studio/serde.ts:119](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/serde.ts#L119)
