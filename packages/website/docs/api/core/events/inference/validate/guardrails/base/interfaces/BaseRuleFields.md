# Interface: BaseRuleFields\<T\>

Defines the structure for the base fields of a rule, including a description, variables, function, and metadata.
These fields are used to configure the rule's behavior and how it evaluates input data.

## Type parameters

• **T**

The type of data the rule will operate upon.

## Properties

### description

> **description**: `string`

A human-readable description of what the rule checks or enforces.

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:29](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L29)

***

### func

> **func**: `string` \| [`ValidateFunc`](../../../type-aliases/ValidateFunc.md)\<`T`\>

The function that performs the validation. It can be a string (to be converted to a function) or a direct function reference.

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:39](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L39)

***

### metadata?

> `optional` **metadata**: [`RuleMetadata`](../type-aliases/RuleMetadata.md)

Optional metadata related to the rule, often used for rules that combine other rules.

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:44](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L44)

***

### variables?

> `optional` **variables**: `Record`\<`string`, `unknown`\>

An optional set of variables that can be used within the rule's validation function.

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:34](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L34)
