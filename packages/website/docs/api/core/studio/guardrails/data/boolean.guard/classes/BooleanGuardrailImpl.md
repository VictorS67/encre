# Class: BooleanGuardrailImpl

## Extends

- [`GuardrailImpl`](../../../base/classes/GuardrailImpl.md) \<[`BooleanGuard`](../type-aliases/BooleanGuard.md), `boolean`\>

## Constructors

### new BooleanGuardrailImpl()

> **new BooleanGuardrailImpl**(`guardrail`): [`BooleanGuardrailImpl`](BooleanGuardrailImpl.md)

#### Parameters

• **guardrail**: [`BooleanGuard`](../type-aliases/BooleanGuard.md)

#### Returns

[`BooleanGuardrailImpl`](BooleanGuardrailImpl.md)

#### Inherited from

[`GuardrailImpl`](../../../base/classes/GuardrailImpl.md) . [`constructor`](../../../base/classes/GuardrailImpl.md#constructors)

#### Source

[packages/core/src/studio/guardrails/base.ts:21](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/guardrails/base.ts#L21)

## Properties

### guardrail

> `readonly` **guardrail**: [`BooleanGuard`](../type-aliases/BooleanGuard.md)

#### Inherited from

[`GuardrailImpl`](../../../base/classes/GuardrailImpl.md) . [`guardrail`](../../../base/classes/GuardrailImpl.md#guardrail)

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

> `protected` **\_postprocess**(`rawData`, `context`): `Promise` \<[`Data`](../../../../data/type-aliases/Data.md)\>

#### Parameters

• **rawData**: `boolean`

• **context**: [`ProcessContext`](../../../../processor/type-aliases/ProcessContext.md)

#### Returns

`Promise` \<[`Data`](../../../../data/type-aliases/Data.md)\>

#### Overrides

[`GuardrailImpl`](../../../base/classes/GuardrailImpl.md) . [`_postprocess`](../../../base/classes/GuardrailImpl.md#_postprocess)

#### Source

[packages/core/src/studio/guardrails/data/boolean.guard.ts:56](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/guardrails/data/boolean.guard.ts#L56)

***

### \_preprocess()

> `protected` **\_preprocess**(`data`, `context`): `Promise`\<`boolean`\>

#### Parameters

• **data**: [`Data`](../../../../data/type-aliases/Data.md)

• **context**: [`ProcessContext`](../../../../processor/type-aliases/ProcessContext.md)

#### Returns

`Promise`\<`boolean`\>

#### Overrides

[`GuardrailImpl`](../../../base/classes/GuardrailImpl.md) . [`_preprocess`](../../../base/classes/GuardrailImpl.md#_preprocess)

#### Source

[packages/core/src/studio/guardrails/data/boolean.guard.ts:42](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/guardrails/data/boolean.guard.ts#L42)

***

### parse()

> **parse**(`data`, `context`): `Promise` \<[`Data`](../../../../data/type-aliases/Data.md)\>

#### Parameters

• **data**: [`Data`](../../../../data/type-aliases/Data.md)

• **context**: [`ProcessContext`](../../../../processor/type-aliases/ProcessContext.md)

#### Returns

`Promise` \<[`Data`](../../../../data/type-aliases/Data.md)\>

#### Inherited from

[`GuardrailImpl`](../../../base/classes/GuardrailImpl.md) . [`parse`](../../../base/classes/GuardrailImpl.md#parse)

#### Source

[packages/core/src/studio/guardrails/base.ts:115](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/guardrails/base.ts#L115)

***

### validate()

> **validate**(`data`, `context`): `Promise`\<`boolean`\>

#### Parameters

• **data**: [`Data`](../../../../data/type-aliases/Data.md)

• **context**: [`ProcessContext`](../../../../processor/type-aliases/ProcessContext.md)

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

[`GuardrailImpl`](../../../base/classes/GuardrailImpl.md) . [`validate`](../../../base/classes/GuardrailImpl.md#validate)

#### Source

[packages/core/src/studio/guardrails/base.ts:141](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/guardrails/base.ts#L141)

***

### validateData()

> **validateData**(`data`): `boolean`

#### Parameters

• **data**: [`Data`](../../../../data/type-aliases/Data.md)

#### Returns

`boolean`

#### Inherited from

[`GuardrailImpl`](../../../base/classes/GuardrailImpl.md) . [`validateData`](../../../base/classes/GuardrailImpl.md#validatedata)

#### Source

[packages/core/src/studio/guardrails/base.ts:101](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/guardrails/base.ts#L101)

***

### create()

> `static` **create**(`method`): [`BooleanGuard`](../type-aliases/BooleanGuard.md)

#### Parameters

• **method**: `string`

#### Returns

[`BooleanGuard`](../type-aliases/BooleanGuard.md)

#### Source

[packages/core/src/studio/guardrails/data/boolean.guard.ts:16](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/guardrails/data/boolean.guard.ts#L16)
