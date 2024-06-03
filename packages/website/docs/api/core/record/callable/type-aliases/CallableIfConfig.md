# Type alias: CallableIfConfig

> **CallableIfConfig**: [`CallableConfig`](CallableConfig.md) & `object`

Extends [CallableConfig](CallableConfig.md) to include additional 'variables' used specifically for guardrail
rule validation in conditional callable scenarios.

## Type declaration

### variables?

> `optional` **variables**: `Record`\<`string`, `unknown`\>

Additional variables that may be used to enhance or modify the behavior of the callable based on dynamic contexts.

## Source

[packages/core/src/record/callable.ts:63](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L63)
