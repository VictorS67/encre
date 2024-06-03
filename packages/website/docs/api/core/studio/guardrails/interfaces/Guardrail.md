# Interface: Guardrail\<GuardType, RuntimeType, Guard\>

## Extends

- [`BaseGuardrail`](BaseGuardrail.md)

## Type parameters

• **GuardType** *extends* `string` = `string`

• **RuntimeType** = `any`

• **Guard** *extends* [`BaseRule`](../../../events/inference/validate/guardrails/base/classes/BaseRule.md)\<`RuntimeType`\> = [`BaseRule`](../../../events/inference/validate/guardrails/base/classes/BaseRule.md)\<`RuntimeType`\>

## Properties

### dataType

> **dataType**: `"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"unknown"` \| `"blob"` \| `"context"` \| `"chat-message"` \| `"string[]"` \| `"number[]"` \| `"boolean[]"` \| `"object[]"` \| `"unknown[]"` \| `"blob[]"` \| `"context[]"` \| `"chat-message[]"` \| readonly (`"string"` \| `"number"` \| `"boolean"` \| `"object"` \| `"unknown"` \| `"blob"` \| `"context"` \| `"chat-message"` \| `"string[]"` \| `"number[]"` \| `"boolean[]"` \| `"object[]"` \| `"unknown[]"` \| `"blob[]"` \| `"context[]"` \| `"chat-message[]"`)[]

#### Source

[packages/core/src/studio/guardrails/index.ts:20](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/guardrails/index.ts#L20)

***

### detail?

> `optional` **detail**: `string`

#### Inherited from

[`BaseGuardrail`](BaseGuardrail.md) . [`detail`](BaseGuardrail.md#detail)

#### Source

[packages/core/src/studio/guardrails/index.ts:10](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/guardrails/index.ts#L10)

***

### guard

> **guard**: `Guard`

#### Source

[packages/core/src/studio/guardrails/index.ts:22](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/guardrails/index.ts#L22)

***

### id

> **id**: `RecordId`

#### Inherited from

[`BaseGuardrail`](BaseGuardrail.md) . [`id`](BaseGuardrail.md#id)

#### Source

[packages/core/src/studio/guardrails/index.ts:6](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/guardrails/index.ts#L6)

***

### name

> **name**: `string`

#### Inherited from

[`BaseGuardrail`](BaseGuardrail.md) . [`name`](BaseGuardrail.md#name)

#### Source

[packages/core/src/studio/guardrails/index.ts:8](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/guardrails/index.ts#L8)

***

### type

> **type**: `GuardType`

#### Source

[packages/core/src/studio/guardrails/index.ts:18](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/guardrails/index.ts#L18)
