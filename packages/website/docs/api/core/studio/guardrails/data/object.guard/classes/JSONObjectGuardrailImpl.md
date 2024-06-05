# Class: JSONObjectGuardrailImpl

## Extends

- [`GuardrailImpl`](../../../base/classes/GuardrailImpl.md) \<[`JSONObjectGuard`](../type-aliases/JSONObjectGuard.md), `object`\>

## Constructors

### new JSONObjectGuardrailImpl()

> **new JSONObjectGuardrailImpl**(`guardrail`): [`JSONObjectGuardrailImpl`](JSONObjectGuardrailImpl.md)

#### Parameters

• **guardrail**: [`JSONObjectGuard`](../type-aliases/JSONObjectGuard.md)

#### Returns

[`JSONObjectGuardrailImpl`](JSONObjectGuardrailImpl.md)

#### Inherited from

[`GuardrailImpl`](../../../base/classes/GuardrailImpl.md) . [`constructor`](../../../base/classes/GuardrailImpl.md#constructors)

#### Source

[packages/core/src/studio/guardrails/base.ts:20](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/guardrails/base.ts#L20)

## Properties

### guardrail

> `readonly` **guardrail**: [`JSONObjectGuard`](../type-aliases/JSONObjectGuard.md)

#### Inherited from

[`GuardrailImpl`](../../../base/classes/GuardrailImpl.md) . [`guardrail`](../../../base/classes/GuardrailImpl.md#guardrail)

#### Source

[packages/core/src/studio/guardrails/base.ts:18](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/guardrails/base.ts#L18)

## Accessors

### dataType

> `get` **dataType**(): `T`\[`"dataType"`\]

#### Returns

`T`\[`"dataType"`\]

#### Source

[packages/core/src/studio/guardrails/base.ts:44](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/guardrails/base.ts#L44)

***

### description

> `get` **description**(): `string`

> `set` **description**(`newVal`): `void`

#### Parameters

• **newVal**: `string`

#### Returns

`string`

#### Source

[packages/core/src/studio/guardrails/base.ts:40](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/guardrails/base.ts#L40)

***

### detail

> `get` **detail**(): `string`

#### Returns

`string`

#### Source

[packages/core/src/studio/guardrails/base.ts:28](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/guardrails/base.ts#L28)

***

### function

> `get` **function**(): `string`

> `set` **function**(`newVal`): `void`

#### Parameters

• **newVal**: `string`

#### Returns

`string`

#### Source

[packages/core/src/studio/guardrails/base.ts:48](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/guardrails/base.ts#L48)

***

### id

> `get` **id**(): `RecordId`

#### Returns

`RecordId`

#### Source

[packages/core/src/studio/guardrails/base.ts:32](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/guardrails/base.ts#L32)

***

### name

> `get` **name**(): `string`

#### Returns

`string`

#### Source

[packages/core/src/studio/guardrails/base.ts:24](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/guardrails/base.ts#L24)

***

### type

> `get` **type**(): `GuardType`

#### Returns

`GuardType`

#### Source

[packages/core/src/studio/guardrails/base.ts:36](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/guardrails/base.ts#L36)

***

### variables

> `get` **variables**(): `undefined` \| `Record`\<`string`, `unknown`\>

> `set` **variables**(`newVal`): `void`

#### Parameters

• **newVal**: `undefined` \| `Record`\<`string`, `unknown`\>

#### Returns

`undefined` \| `Record`\<`string`, `unknown`\>

#### Source

[packages/core/src/studio/guardrails/base.ts:56](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/guardrails/base.ts#L56)

## Methods

### \_postprocess()

> `protected` **\_postprocess**(`rawData`, `context`): `Promise` \<[`Data`](../../../../data/type-aliases/Data.md)\>

#### Parameters

• **rawData**: `object`

• **context**: [`ProcessContext`](../../../../processor/type-aliases/ProcessContext.md)

#### Returns

`Promise` \<[`Data`](../../../../data/type-aliases/Data.md)\>

#### Overrides

[`GuardrailImpl`](../../../base/classes/GuardrailImpl.md) . [`_postprocess`](../../../base/classes/GuardrailImpl.md#_postprocess)

#### Source

[packages/core/src/studio/guardrails/data/object.guard.ts:101](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/guardrails/data/object.guard.ts#L101)

***

### \_preprocess()

> `protected` **\_preprocess**(`data`, `context`): `Promise`\<`object`\>

#### Parameters

• **data**: [`Data`](../../../../data/type-aliases/Data.md)

• **context**: [`ProcessContext`](../../../../processor/type-aliases/ProcessContext.md)

#### Returns

`Promise`\<`object`\>

#### Overrides

[`GuardrailImpl`](../../../base/classes/GuardrailImpl.md) . [`_preprocess`](../../../base/classes/GuardrailImpl.md#_preprocess)

#### Source

[packages/core/src/studio/guardrails/data/object.guard.ts:58](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/guardrails/data/object.guard.ts#L58)

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

[packages/core/src/studio/guardrails/base.ts:114](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/guardrails/base.ts#L114)

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

[packages/core/src/studio/guardrails/base.ts:140](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/guardrails/base.ts#L140)

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

[packages/core/src/studio/guardrails/base.ts:100](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/guardrails/base.ts#L100)

***

### create()

> `static` **create**(`method`): [`JSONObjectGuard`](../type-aliases/JSONObjectGuard.md)

#### Parameters

• **method**: `string`

#### Returns

[`JSONObjectGuard`](../type-aliases/JSONObjectGuard.md)

#### Source

[packages/core/src/studio/guardrails/data/object.guard.ts:32](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/guardrails/data/object.guard.ts#L32)
