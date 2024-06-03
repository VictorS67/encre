# Class: `abstract` GuardrailImpl\<T, GuardDataType, GuardType\>

## Extended by

- [`ArrayGuardrailImpl`](../../data/array.guard/classes/ArrayGuardrailImpl.md)
- [`BooleanGuardrailImpl`](../../data/boolean.guard/classes/BooleanGuardrailImpl.md)
- [`NumberGuardrailImpl`](../../data/number.guard/classes/NumberGuardrailImpl.md)
- [`JSONObjectGuardrailImpl`](../../data/object.guard/classes/JSONObjectGuardrailImpl.md)
- [`StringGuardrailImpl`](../../data/string.guard/classes/StringGuardrailImpl.md)

## Type parameters

• **T** *extends* [`Guardrail`](../../interfaces/Guardrail.md)\<`string`, `GuardDataType`, [`BaseRule`](../../../../events/inference/validate/guardrails/base/classes/BaseRule.md)\<`GuardDataType`\>\>

• **GuardDataType** = `any`

• **GuardType** *extends* `T`\[`"type"`\] = `T`\[`"type"`\]

## Constructors

### new GuardrailImpl()

> **new GuardrailImpl**\<`T`, `GuardDataType`, `GuardType`\>(`guardrail`): [`GuardrailImpl`](GuardrailImpl.md)\<`T`, `GuardDataType`, `GuardType`\>

#### Parameters

• **guardrail**: `T`

#### Returns

[`GuardrailImpl`](GuardrailImpl.md)\<`T`, `GuardDataType`, `GuardType`\>

#### Source

[packages/core/src/studio/guardrails/base.ts:21](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/guardrails/base.ts#L21)

## Properties

### guardrail

> `readonly` **guardrail**: `T`

#### Source

[packages/core/src/studio/guardrails/base.ts:19](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/guardrails/base.ts#L19)

## Accessors

### dataType

> `get` **dataType**(): `T`\[`"dataType"`\]

#### Returns

`T`\[`"dataType"`\]

#### Source

[packages/core/src/studio/guardrails/base.ts:45](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/guardrails/base.ts#L45)

***

### description

> `get` **description**(): `string`

> `set` **description**(`newVal`): `void`

#### Parameters

• **newVal**: `string`

#### Returns

`string`

#### Source

[packages/core/src/studio/guardrails/base.ts:41](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/guardrails/base.ts#L41)

***

### detail

> `get` **detail**(): `string`

#### Returns

`string`

#### Source

[packages/core/src/studio/guardrails/base.ts:29](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/guardrails/base.ts#L29)

***

### function

> `get` **function**(): `string`

> `set` **function**(`newVal`): `void`

#### Parameters

• **newVal**: `string`

#### Returns

`string`

#### Source

[packages/core/src/studio/guardrails/base.ts:49](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/guardrails/base.ts#L49)

***

### id

> `get` **id**(): `RecordId`

#### Returns

`RecordId`

#### Source

[packages/core/src/studio/guardrails/base.ts:33](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/guardrails/base.ts#L33)

***

### name

> `get` **name**(): `string`

#### Returns

`string`

#### Source

[packages/core/src/studio/guardrails/base.ts:25](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/guardrails/base.ts#L25)

***

### type

> `get` **type**(): `GuardType`

#### Returns

`GuardType`

#### Source

[packages/core/src/studio/guardrails/base.ts:37](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/guardrails/base.ts#L37)

***

### variables

> `get` **variables**(): `undefined` \| `Record`\<`string`, `unknown`\>

> `set` **variables**(`newVal`): `void`

#### Parameters

• **newVal**: `undefined` \| `Record`\<`string`, `unknown`\>

#### Returns

`undefined` \| `Record`\<`string`, `unknown`\>

#### Source

[packages/core/src/studio/guardrails/base.ts:57](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/guardrails/base.ts#L57)

## Methods

### \_postprocess()

> `protected` `abstract` **\_postprocess**(`rawData`, `context`): `Promise` \<[`Data`](../../../data/type-aliases/Data.md)\>

#### Parameters

• **rawData**: `GuardDataType`

• **context**: [`ProcessContext`](../../../processor/type-aliases/ProcessContext.md)

#### Returns

`Promise` \<[`Data`](../../../data/type-aliases/Data.md)\>

#### Source

[packages/core/src/studio/guardrails/base.ts:110](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/guardrails/base.ts#L110)

***

### \_preprocess()

> `protected` `abstract` **\_preprocess**(`data`, `context`): `Promise`\<`GuardDataType`\>

#### Parameters

• **data**: [`Data`](../../../data/type-aliases/Data.md)

• **context**: [`ProcessContext`](../../../processor/type-aliases/ProcessContext.md)

#### Returns

`Promise`\<`GuardDataType`\>

#### Source

[packages/core/src/studio/guardrails/base.ts:105](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/guardrails/base.ts#L105)

***

### parse()

> **parse**(`data`, `context`): `Promise` \<[`Data`](../../../data/type-aliases/Data.md)\>

#### Parameters

• **data**: [`Data`](../../../data/type-aliases/Data.md)

• **context**: [`ProcessContext`](../../../processor/type-aliases/ProcessContext.md)

#### Returns

`Promise` \<[`Data`](../../../data/type-aliases/Data.md)\>

#### Source

[packages/core/src/studio/guardrails/base.ts:115](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/guardrails/base.ts#L115)

***

### validate()

> **validate**(`data`, `context`): `Promise`\<`boolean`\>

#### Parameters

• **data**: [`Data`](../../../data/type-aliases/Data.md)

• **context**: [`ProcessContext`](../../../processor/type-aliases/ProcessContext.md)

#### Returns

`Promise`\<`boolean`\>

#### Source

[packages/core/src/studio/guardrails/base.ts:141](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/guardrails/base.ts#L141)

***

### validateData()

> **validateData**(`data`): `boolean`

#### Parameters

• **data**: [`Data`](../../../data/type-aliases/Data.md)

#### Returns

`boolean`

#### Source

[packages/core/src/studio/guardrails/base.ts:101](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/guardrails/base.ts#L101)
