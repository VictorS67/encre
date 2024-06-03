# Type alias: SerializedRule

> **SerializedRule**: `object`

Represents a serialized rule, capturing the logic and conditions that define the rule's behavior.
This can include a function name and associated variables, along with a description and optional metadata.

## Type declaration

### \_ruleType

> **\_ruleType**: `string`

### \_type

> **\_type**: `"rule"`

### description

> **description**: `string`

### func

> **func**: `string`

### metadata?

> `optional` **metadata**: [`SerializedRuleMetadata`](SerializedRuleMetadata.md)

### variables?

> `optional` **variables**: `Record`\<`string`, `unknown`\>

## Source

[packages/core/src/studio/serde.ts:101](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/serde.ts#L101)
