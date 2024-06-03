# Interface: IfConditionParams

Defines the parameters required for initializing an IfCondition, including the
rule sources, targets, and actions.

## Example

```
const ifConditionParams: IfConditionParams = {
  sources: ['userInput', 'appState'],
  targets: ['display', 'log'],
  actions: {
    display: [{
      type: 'if',
      ruleCollection: new RuleCollection(...),
      source: 'userInput',
    }, {
      type: 'otherwise',
      source: 'appState'
    }]
  }
};
```

## Properties

### actions

> **actions**: `object`

Defines a map of conditional actions. Each target can have a sequence of condition fields,
starting with an 'if' and optionally followed by 'else-if' and 'otherwise'.

#### Index signature

 \[`target`: `string`\]: [[`IfConditionField`](../type-aliases/IfConditionField.md), `...ElseConditionField[]`]

#### Source

[packages/core/src/studio/condition.ts:114](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/condition.ts#L114)

***

### registry?

> `optional` **registry**: [`GuardrailRegistration`](../../registration/guardrails/classes/GuardrailRegistration.md)\<`never`, `never`, `never`\>

Optional registration of guardrails that provide additional constraints or rules in plugins.

#### Source

[packages/core/src/studio/condition.ts:98](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/condition.ts#L98)

***

### sources

> **sources**: `string`[]

List of identifiers for data sources that are evaluated by the conditions.

#### Source

[packages/core/src/studio/condition.ts:103](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/condition.ts#L103)

***

### targets

> **targets**: `string`[]

List of identifiers for targets that are affected based on the evaluation of the conditions.

#### Source

[packages/core/src/studio/condition.ts:108](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/condition.ts#L108)
