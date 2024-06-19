# Class: GuardrailRegistration\<GuardrailTypes, GuardrailNames, Guardrails\>

## Type parameters

• **GuardrailTypes** *extends* `string` = `never`

• **GuardrailNames** *extends* `string` = `never`

• **Guardrails** *extends* [`Guardrail`](../../../guardrails/interfaces/Guardrail.md) = `never`

## Constructors

### new GuardrailRegistration()

> **new GuardrailRegistration**\<`GuardrailTypes`, `GuardrailNames`, `Guardrails`\>(): [`GuardrailRegistration`](GuardrailRegistration.md)\<`GuardrailTypes`, `GuardrailNames`, `Guardrails`\>

#### Returns

[`GuardrailRegistration`](GuardrailRegistration.md)\<`GuardrailTypes`, `GuardrailNames`, `Guardrails`\>

## Properties

### guardrailTypePairs

> `readonly` **guardrailTypePairs**: `{ [P in string]: GuardrailNames[] }`

#### Source

[packages/core/src/studio/registration/guardrails.ts:45](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/registration/guardrails.ts#L45)

***

### guardrailTypes

> `readonly` **guardrailTypes**: `Set`\<`GuardrailTypes`\>

#### Source

[packages/core/src/studio/registration/guardrails.ts:43](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/registration/guardrails.ts#L43)

***

### implsMap

> **implsMap**: `Record`\<`string`, `object`\>

#### Source

[packages/core/src/studio/registration/guardrails.ts:38](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/registration/guardrails.ts#L38)

***

### info

> **info**: \{ \[P in \`$\{string\}-$\{string\}\`\]: Object \}

#### Source

[packages/core/src/studio/registration/guardrails.ts:30](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/registration/guardrails.ts#L30)

***

### registeredGuardrailTypePairs

> **registeredGuardrailTypePairs**: `{ [P in string]: GuardrailNames[] }`

#### Source

[packages/core/src/studio/registration/guardrails.ts:27](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/registration/guardrails.ts#L27)

***

### registeredGuardrailTypes

> **registeredGuardrailTypes**: `GuardrailTypes`

#### Source

[packages/core/src/studio/registration/guardrails.ts:25](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/registration/guardrails.ts#L25)

***

### registeredGuardrails

> **registeredGuardrails**: `Guardrails`

#### Source

[packages/core/src/studio/registration/guardrails.ts:23](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/registration/guardrails.ts#L23)

## Accessors

### dynamicImplsMap

> `get` **dynamicImplsMap**(): `Record`\<`string`, `object`\>

#### Returns

`Record`\<`string`, `object`\>

#### Source

[packages/core/src/studio/registration/guardrails.ts:55](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/registration/guardrails.ts#L55)

***

### guardrailConstructors

> `get` **guardrailConstructors**(): [`GuardrailImplConstructor`](../interfaces/GuardrailImplConstructor.md) \<[`Guardrail`](../../../guardrails/interfaces/Guardrail.md)\<`string`, `any`, [`BaseRule`](../../../../events/inference/validate/guardrails/base/classes/BaseRule.md)\<`any`\>\>\>[]

#### Returns

[`GuardrailImplConstructor`](../interfaces/GuardrailImplConstructor.md) \<[`Guardrail`](../../../guardrails/interfaces/Guardrail.md)\<`string`, `any`, [`BaseRule`](../../../../events/inference/validate/guardrails/base/classes/BaseRule.md)\<`any`\>\>\>[]

#### Source

[packages/core/src/studio/registration/guardrails.ts:49](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/registration/guardrails.ts#L49)

## Methods

### create()

> **create**\<`T`, `U`\>(`type`, `name`, `method`): `Extract`\<`Guardrails`, `object`\>

#### Type parameters

• **T** *extends* `string`

• **U** *extends* `string`

#### Parameters

• **type**: `T`

• **name**: `U`

• **method**: `string`

#### Returns

`Extract`\<`Guardrails`, `object`\>

#### Source

[packages/core/src/studio/registration/guardrails.ts:106](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/registration/guardrails.ts#L106)

***

### createDynamic()

> **createDynamic**(`type`, `name`, `method`): [`Guardrail`](../../../guardrails/interfaces/Guardrail.md)\<`string`, `any`, [`BaseRule`](../../../../events/inference/validate/guardrails/base/classes/BaseRule.md)\<`any`\>\>

#### Parameters

• **type**: `string`

• **name**: `string`

• **method**: `string`

#### Returns

[`Guardrail`](../../../guardrails/interfaces/Guardrail.md)\<`string`, `any`, [`BaseRule`](../../../../events/inference/validate/guardrails/base/classes/BaseRule.md)\<`any`\>\>

#### Source

[packages/core/src/studio/registration/guardrails.ts:150](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/registration/guardrails.ts#L150)

***

### createDynamicImpl()

> **createDynamicImpl**(`guardrail`): [`GuardrailImpl`](../../../guardrails/base/classes/GuardrailImpl.md) \<[`Guardrail`](../../../guardrails/interfaces/Guardrail.md)\<`string`, `any`, [`BaseRule`](../../../../events/inference/validate/guardrails/base/classes/BaseRule.md)\<`any`\>\>, `any`, `string`\>

#### Parameters

• **guardrail**: [`Guardrail`](../../../guardrails/interfaces/Guardrail.md)\<`string`, `any`, [`BaseRule`](../../../../events/inference/validate/guardrails/base/classes/BaseRule.md)\<`any`\>\>

#### Returns

[`GuardrailImpl`](../../../guardrails/base/classes/GuardrailImpl.md) \<[`Guardrail`](../../../guardrails/interfaces/Guardrail.md)\<`string`, `any`, [`BaseRule`](../../../../events/inference/validate/guardrails/base/classes/BaseRule.md)\<`any`\>\>, `any`, `string`\>

#### Source

[packages/core/src/studio/registration/guardrails.ts:161](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/registration/guardrails.ts#L161)

***

### createImpl()

> **createImpl**\<`T`\>(`guardrail`): [`GuardrailImpl`](../../../guardrails/base/classes/GuardrailImpl.md)\<`T`, `any`, `T`\[`"type"`\]\>

#### Type parameters

• **T** *extends* [`Guardrail`](../../../guardrails/interfaces/Guardrail.md)\<`string`, `any`, [`BaseRule`](../../../../events/inference/validate/guardrails/base/classes/BaseRule.md)\<`any`\>\>

#### Parameters

• **guardrail**: `T`

#### Returns

[`GuardrailImpl`](../../../guardrails/base/classes/GuardrailImpl.md)\<`T`, `any`, `T`\[`"type"`\]\>

#### Source

[packages/core/src/studio/registration/guardrails.ts:124](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/registration/guardrails.ts#L124)

***

### isRegistered()

> **isRegistered**(`type`, `name`): `boolean`

#### Parameters

• **type**: `string`

• **name**: `string`

#### Returns

`boolean`

#### Source

[packages/core/src/studio/registration/guardrails.ts:180](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/registration/guardrails.ts#L180)

***

### register()

> **register**\<`T`\>(`impl`, `method`): [`GuardrailRegistration`](GuardrailRegistration.md)\<`GuardrailTypes` \| `T`\[`"type"`\], `GuardrailNames` \| `T`\[`"name"`\], `Guardrails` \| `T`\>

#### Type parameters

• **T** *extends* [`Guardrail`](../../../guardrails/interfaces/Guardrail.md)\<`string`, `any`, [`BaseRule`](../../../../events/inference/validate/guardrails/base/classes/BaseRule.md)\<`any`\>\>

#### Parameters

• **impl**: [`GuardrailImplConstructor`](../interfaces/GuardrailImplConstructor.md)\<`T`\>

• **method**: `string`

#### Returns

[`GuardrailRegistration`](GuardrailRegistration.md)\<`GuardrailTypes` \| `T`\[`"type"`\], `GuardrailNames` \| `T`\[`"name"`\], `Guardrails` \| `T`\>

#### Source

[packages/core/src/studio/registration/guardrails.ts:62](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/registration/guardrails.ts#L62)
