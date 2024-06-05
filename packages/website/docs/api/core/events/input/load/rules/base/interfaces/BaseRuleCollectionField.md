# Interface: BaseRuleCollectionField

Defines the structure for initializing a BaseRuleCollection.
It specifies a collection of rules and optionally a conjunction to define how
the rules should be evaluated.

## Properties

### collection

> **collection**: `Record`\<`string`, [`BaseRule`](../../../../../inference/validate/guardrails/base/classes/BaseRule.md)\<`any`\> \| [`BaseRuleCollection`](../classes/BaseRuleCollection.md)\>

A collection of rules, each identified by a string key. The value can be
either a BaseRule or another BaseRuleCollection.

#### Source

[packages/core/src/events/input/load/rules/base.ts:16](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/rules/base.ts#L16)

***

### conjunction?

> `optional` **conjunction**: `"and"` \| `"or"`

The logical conjunction used to evaluate the rules. Default is "and".
Possible values are 'and' or 'or'.

#### Source

[packages/core/src/events/input/load/rules/base.ts:22](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/rules/base.ts#L22)
