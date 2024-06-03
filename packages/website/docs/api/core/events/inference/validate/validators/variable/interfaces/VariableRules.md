# Interface: VariableRules

Defines the rules applied to variables including default rules,
specific rules for particular variables, and exclusions.

## Properties

### default?

> `optional` **default**: [`BaseRule`](../../../guardrails/base/classes/BaseRule.md)\<`any`\>

The default rule applied to all variables unless specifically overridden or excluded.

#### Source

[packages/core/src/events/inference/validate/validators/variable.ts:14](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/validators/variable.ts#L14)

***

### exclude?

> `optional` **exclude**: `string`[]

A list of variable names to be excluded from validation.

#### Source

[packages/core/src/events/inference/validate/validators/variable.ts:24](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/validators/variable.ts#L24)

***

### specific?

> `optional` **specific**: `Record`\<`string`, [`BaseRule`](../../../guardrails/base/classes/BaseRule.md)\<`any`\>\>

A dictionary of rules specific to certain variables.

#### Source

[packages/core/src/events/inference/validate/validators/variable.ts:19](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/validators/variable.ts#L19)
