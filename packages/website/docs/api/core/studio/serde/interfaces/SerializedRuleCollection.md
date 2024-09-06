# Interface: SerializedRuleCollection

Represents a collection of rules grouped together, often used to apply a set of related rules
collectively. This collection can include individual rules or other nested rule collections.

## Properties

### \_type

> **\_type**: `"rule-collection"`

Identifies the type of serialization; always 'rule-collection'.

#### Source

[packages/core/src/studio/serde.ts:125](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L125)

***

### collection

> **collection**: `Record`\<`string`, [`SerializedRuleCollection`](SerializedRuleCollection.md) \| [`SerializedRule`](SerializedRule.md)\>

A record containing rules or other rule collections, indexed by a key.

#### Source

[packages/core/src/studio/serde.ts:127](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L127)

***

### conjunction

> **conjunction**: `"and"` \| `"or"`

Specifies how rules within the collection are logically combined ('and' or 'or').

#### Source

[packages/core/src/studio/serde.ts:128](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L128)

***

### description

> **description**: `string`

Description of the collection's purpose and the context in which it is used.

#### Source

[packages/core/src/studio/serde.ts:126](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/serde.ts#L126)
