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

[packages/core/src/studio/guardrails/base.ts:20](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/guardrails/base.ts#L20)

## Properties

### guardrail

> `readonly` **guardrail**: `T`

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

> `protected` `abstract` **\_postprocess**(`rawData`, `context`): `Promise` \<[`Data`](../../../data/type-aliases/Data.md)\>

#### Parameters

• **rawData**: `GuardDataType`

• **context**: [`ProcessContext`](../../../processor/type-aliases/ProcessContext.md)

#### Returns

`Promise` \<[`Data`](../../../data/type-aliases/Data.md)\>

#### Source

[packages/core/src/studio/guardrails/base.ts:109](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/guardrails/base.ts#L109)

***

### \_preprocess()

> `protected` `abstract` **\_preprocess**(`data`, `context`): `Promise`\<`GuardDataType`\>

#### Parameters

• **data**: [`Data`](../../../data/type-aliases/Data.md)

• **context**: [`ProcessContext`](../../../processor/type-aliases/ProcessContext.md)

#### Returns

`Promise`\<`GuardDataType`\>

#### Source

[packages/core/src/studio/guardrails/base.ts:104](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/guardrails/base.ts#L104)

***

### parse()

> **parse**(`data`, `context`): `Promise` \<[`Data`](../../../data/type-aliases/Data.md)\>

#### Parameters

• **data**: [`Data`](../../../data/type-aliases/Data.md)

• **context**: [`ProcessContext`](../../../processor/type-aliases/ProcessContext.md)

#### Returns

`Promise` \<[`Data`](../../../data/type-aliases/Data.md)\>

#### Source

[packages/core/src/studio/guardrails/base.ts:114](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/guardrails/base.ts#L114)

***

### validate()

> **validate**(`data`, `context`): `Promise`\<`boolean`\>

#### Parameters

• **data**: [`Data`](../../../data/type-aliases/Data.md)

• **context**: [`ProcessContext`](../../../processor/type-aliases/ProcessContext.md)

#### Returns

`Promise`\<`boolean`\>

#### Source

[packages/core/src/studio/guardrails/base.ts:140](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/guardrails/base.ts#L140)

***

### validateData()

> **validateData**(`data`): `boolean`

#### Parameters

• **data**: [`Data`](../../../data/type-aliases/Data.md)

#### Returns

`boolean`

#### Source

[packages/core/src/studio/guardrails/base.ts:100](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/guardrails/base.ts#L100)
