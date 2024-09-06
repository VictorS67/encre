# Interface: SerializedRule

Represents a serialized rule, capturing the logic and conditions that define the rule's behavior.
This can include a function name and associated variables, along with a description and optional metadata.

## Properties

### \_ruleType

> **\_ruleType**: `string`

The type of rule, typically indicating the nature or purpose of the rule.

#### Source

[packages/core/src/studio/serde.ts:107](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L107)

***

### \_type

> **\_type**: `"rule"`

Identifies the type of serialization; always 'rule'.

#### Source

[packages/core/src/studio/serde.ts:106](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L106)

***

### description

> **description**: `string`

Descriptive text explaining what the rule checks or enforces.

#### Source

[packages/core/src/studio/serde.ts:108](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L108)

***

### func

> **func**: `string`

The function name associated with the rule's logic.

#### Source

[packages/core/src/studio/serde.ts:109](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L109)

***

### metadata?

> `optional` **metadata**: [`SerializedRuleMetadata`](SerializedRuleMetadata.md)

Optional metadata providing additional structure or relationships with other rules.

#### Source

[packages/core/src/studio/serde.ts:111](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L111)

***

### variables?

> `optional` **variables**: `Record`\<`string`, `unknown`\>

Variables or parameters used within the rule's logic.

#### Source

[packages/core/src/studio/serde.ts:110](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L110)
