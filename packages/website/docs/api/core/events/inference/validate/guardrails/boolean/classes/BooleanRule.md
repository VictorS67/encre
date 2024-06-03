# Class: BooleanRule\<T\>

A specialized rule class designed for handling boolean-based validations.
This class provides various static methods to create boolean-specific validation.

## Example

```typescript
const rule = new BooleanRule({
  description: 'is true',
  func: await (input: boolean) => input === true
});
```

## Extends

- [`BaseRule`](../../base/classes/BaseRule.md)\<`T`\>

## Type parameters

• **T** *extends* `unknown` = `boolean`

The type of input data the rule will validate, defaulting to boolean.

## Constructors

### new BooleanRule()

> **new BooleanRule**\<`T`\>(`fields`): [`BooleanRule`](BooleanRule.md)\<`T`\>

Constructs a new instance of a rule with the specified fields.

#### Parameters

• **fields**: [`BaseRuleFields`](../../base/interfaces/BaseRuleFields.md)\<`T`\>

#### Returns

[`BooleanRule`](BooleanRule.md)\<`T`\>

#### Inherited from

[`BaseRule`](../../base/classes/BaseRule.md) . [`constructor`](../../base/classes/BaseRule.md#constructors)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:116](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/base.ts#L116)

## Properties

### \_isSerializable

> **\_isSerializable**: `boolean` = `true`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Overrides

[`BaseRule`](../../base/classes/BaseRule.md) . [`_isSerializable`](../../base/classes/BaseRule.md#_isserializable)

#### Source

[packages/core/src/events/inference/validate/guardrails/boolean.ts:21](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/boolean.ts#L21)

***

### \_kwargs

> **\_kwargs**: `SerializedFields`

Key-value pairs of properties to be serialized.

#### Inherited from

[`BaseRule`](../../base/classes/BaseRule.md) . [`_kwargs`](../../base/classes/BaseRule.md#_kwargs)

#### Source

[packages/core/src/load/serializable.ts:168](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L168)

***

### \_namespace

> **\_namespace**: `string`[]

Unique namespace identifier for the serialized object, represented as an array of strings.

#### Inherited from

[`BaseRule`](../../base/classes/BaseRule.md) . [`_namespace`](../../base/classes/BaseRule.md#_namespace)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:59](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/base.ts#L59)

***

### description

> **description**: `string`

A human-readable description of what the rule checks or enforces.

#### Inherited from

[`BaseRule`](../../base/classes/BaseRule.md) . [`description`](../../base/classes/BaseRule.md#description)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:70](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/base.ts#L70)

***

### metadata

> **metadata**: `undefined` \| [`RuleMetadata`](../../base/type-aliases/RuleMetadata.md)

Optional track-back metadata of rules that are used for merging to the current rule.

#### Inherited from

[`BaseRule`](../../base/classes/BaseRule.md) . [`metadata`](../../base/classes/BaseRule.md#metadata)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:80](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/base.ts#L80)

***

### variables

> **variables**: `undefined` \| `Record`\<`string`, `unknown`\>

An optional set of variables that can be used within the rule's validation function.

#### Inherited from

[`BaseRule`](../../base/classes/BaseRule.md) . [`variables`](../../base/classes/BaseRule.md#variables)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:75](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/base.ts#L75)

## Accessors

### \_aliases

> `get` **\_aliases**(): `undefined` \| `SerializedFields`

Retrieves alias mappings for the object's attribute names.

#### Returns

`undefined` \| `SerializedFields`

An object representing key aliases, or undefined if none are defined.

#### Source

[packages/core/src/load/serializable.ts:217](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L217)

***

### \_attributes

> `get` **\_attributes**(): `undefined` \| `SerializedFields`

Retrieves attributes of the object.

#### Returns

`undefined` \| `SerializedFields`

An object representing attributes, or undefined if none are defined.

#### Source

[packages/core/src/load/serializable.ts:208](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L208)

***

### \_id

> `get` **\_id**(): `string`[]

Retrieves the name of the class. This provides a unique identifier for serialization.

#### Returns

`string`[]

The path of serializable.

#### Source

[packages/core/src/load/serializable.ts:187](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L187)

***

### \_secrets

> `get` **\_secrets**(): `undefined` \| `SecretFields`

Retrieves any secrets defined in the object.

#### Returns

`undefined` \| `SecretFields`

An object representing secret fields, or undefined if none are defined.

#### Source

[packages/core/src/load/serializable.ts:199](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L199)

***

### func

> `get` **func**(): [`ValidateFunc`](../../../type-aliases/ValidateFunc.md)\<`T`\>

Gets the validation function.

> `set` **func**(`newVal`): `void`

Sets the validation function, with conversion from string format if necessary.

#### Parameters

• **newVal**: `string` \| [`ValidateFunc`](../../../type-aliases/ValidateFunc.md)\<`T`\>

#### Returns

[`ValidateFunc`](../../../type-aliases/ValidateFunc.md)\<`T`\>

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:92](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/base.ts#L92)

## Methods

### \_ruleType()

> **\_ruleType**(): `"boolean"`

Specifies the rule type. For `BooleanRule`, the type is explicitly "boolean".

#### Returns

`"boolean"`

The type identifier for this rule class.

#### Overrides

[`BaseRule`](../../base/classes/BaseRule.md) . [`_ruleType`](../../base/classes/BaseRule.md#_ruletype)

#### Source

[packages/core/src/events/inference/validate/guardrails/boolean.ts:31](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/boolean.ts#L31)

***

### \_validateFuncStr()

> `protected` **\_validateFuncStr**(`funcStr`, `variables`): `void`

Validate if function is formatted correctly as a callable rule function.

A correct formatted rule function should:
- include `input` in the arguments;
- if any variables are included in the rule, those variable names should in the arguments;

#### Parameters

• **funcStr**: `string`

function string

• **variables**: `undefined` \| `Record`\<`string`, `unknown`\>

variables in the function

#### Returns

`void`

#### Inherited from

[`BaseRule`](../../base/classes/BaseRule.md) . [`_validateFuncStr`](../../base/classes/BaseRule.md#_validatefuncstr)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:447](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/base.ts#L447)

***

### concat()

> **concat**\<`U`\>(`rule`, `conjunction`): [`BaseRule`](../../base/classes/BaseRule.md)\<`T` \| `U`\>

Combines two boolean rules into one using a specified logical conjunction ('and' or 'or').

#### Type parameters

• **U**

#### Parameters

• **rule**: [`BaseRule`](../../base/classes/BaseRule.md)\<`U`\>

The rule to concatenate with the current rule.

• **conjunction**: `"and"` \| `"or"`

The type of logical conjunction to apply ('and' | 'or').

#### Returns

[`BaseRule`](../../base/classes/BaseRule.md)\<`T` \| `U`\>

A new `BooleanRule` instance representing the combined rule.

#### Overrides

[`BaseRule`](../../base/classes/BaseRule.md) . [`concat`](../../base/classes/BaseRule.md#concat)

#### Source

[packages/core/src/events/inference/validate/guardrails/boolean.ts:41](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/boolean.ts#L41)

***

### getAttributes()

> **getAttributes**(): `object`

Retrieves a comprehensive representation of the object's attributes, secrets, and aliases.

#### Returns

`object`

An object containing aliases, secrets, and keyword arguments.

##### aliases

> **aliases**: `SerializedKeyAlias`

##### kwargs

> **kwargs**: `SerializedFields`

##### secrets

> **secrets**: `SecretFields`

#### Inherited from

[`BaseRule`](../../base/classes/BaseRule.md) . [`getAttributes`](../../base/classes/BaseRule.md#getattributes)

#### Source

[packages/core/src/load/serializable.ts:430](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L430)

***

### getCleanDescription()

> **getCleanDescription**(): `string`

Cleans and formats the rule description by replacing variable placeholders with actual values.

#### Returns

`string`

A formatted description with variable values substituted.

#### Inherited from

[`BaseRule`](../../base/classes/BaseRule.md) . [`getCleanDescription`](../../base/classes/BaseRule.md#getcleandescription)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:212](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/base.ts#L212)

***

### serialize()

> **serialize**(): [`SerializedRule`](../../../../../../studio/serde/type-aliases/SerializedRule.md)

Serializes the rule into a structured format for storage or transmission.

#### Returns

[`SerializedRule`](../../../../../../studio/serde/type-aliases/SerializedRule.md)

A `SerializedRule` object containing the serialized state.

#### Inherited from

[`BaseRule`](../../base/classes/BaseRule.md) . [`serialize`](../../base/classes/BaseRule.md#serialize)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:190](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/base.ts#L190)

***

### toCallableLambda()

> **toCallableLambda**(): [`CallableLambda`](../../../../../../record/callable/classes/CallableLambda.md)\<`T`, `boolean`\>

Converts the rule's validation function into a `CallableLambda`.

#### Returns

[`CallableLambda`](../../../../../../record/callable/classes/CallableLambda.md)\<`T`, `boolean`\>

A new `CallableLambda` based on the rule's validation function.

#### Inherited from

[`BaseRule`](../../base/classes/BaseRule.md) . [`toCallableLambda`](../../base/classes/BaseRule.md#tocallablelambda)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:264](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/base.ts#L264)

***

### toJSON()

> **toJSON**(): [`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized representation based on the object's current state. This method determines whether to use a 'not implemented' or 'constructor' format based on the object's serializability.

#### Returns

[`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`BaseRule`](../../base/classes/BaseRule.md) . [`toJSON`](../../base/classes/BaseRule.md#tojson)

#### Source

[packages/core/src/load/serializable.ts:665](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L665)

***

### toJSONConstructor()

> **toJSONConstructor**(`aliases`, `secrets`, `kwargs`): [`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized constructor format. This method provides a way to serialize object construction details, including any aliases or secrets.

#### Parameters

• **aliases**: `SerializedKeyAlias`

Key aliases to include in the serialized output.

• **secrets**: `SecretFields`

Secrets to be secured in the serialized output.

• **kwargs**: `SerializedFields`

Additional keyword arguments to include in the serialized output.

#### Returns

[`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object as a constructor.

#### Inherited from

[`BaseRule`](../../base/classes/BaseRule.md) . [`toJSONConstructor`](../../base/classes/BaseRule.md#tojsonconstructor)

#### Source

[packages/core/src/load/serializable.ts:478](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L478)

***

### toJSONNotImplemented()

> **toJSONNotImplemented**(): [`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized format that is not implemented. This method should be overridden in subclasses to provide specific serialization behavior.

#### Returns

[`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`BaseRule`](../../base/classes/BaseRule.md) . [`toJSONNotImplemented`](../../base/classes/BaseRule.md#tojsonnotimplemented)

#### Source

[packages/core/src/load/serializable.ts:448](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L448)

***

### toJSONSecret()

> **toJSONSecret**(`secretKey`): [`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

Converts a secret key to its serialized format. This method is typically used for serializing secrets in a secure manner.

#### Parameters

• **secretKey**: `string`

The secret key to serialize.

#### Returns

[`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the secret key.

#### Inherited from

[`BaseRule`](../../base/classes/BaseRule.md) . [`toJSONSecret`](../../base/classes/BaseRule.md#tojsonsecret)

#### Source

[packages/core/src/load/serializable.ts:462](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L462)

***

### validate()

> **validate**(`input`, `variables`?): `Promise`\<`boolean`\>

Validates an input against the rule.

#### Parameters

• **input**: `T`

The data to validate.

• **variables?**: `Record`\<`string`, `unknown`\>

Optional additional variables for the validation.

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to true if the input is valid according to the rule.

#### Inherited from

[`BaseRule`](../../base/classes/BaseRule.md) . [`validate`](../../base/classes/BaseRule.md#validate)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:274](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/base.ts#L274)

***

### \_mergeDescription()

`Internal`

> `static` `protected` **\_mergeDescription**(`left`, `right`, `conjunction`): `string`

Internal method for merging two rule description.

#### Parameters

• **left**: [`BaseRule`](../../base/classes/BaseRule.md)\<`unknown`\>

left rule

• **right**: [`BaseRule`](../../base/classes/BaseRule.md)\<`unknown`\>

right rule

• **conjunction**: `"and"` \| `"or"`

conjunction can be either 'or' or 'and'

#### Returns

`string`

merged rule description.

#### Inherited from

[`BaseRule`](../../base/classes/BaseRule.md) . [`_mergeDescription`](../../base/classes/BaseRule.md#_mergedescription)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:312](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/base.ts#L312)

***

### \_mergeFunc()

`Internal`

> `static` `protected` **\_mergeFunc**(`left`, `right`, `conjunction`): `string` \| [`ValidateFunc`](../../../type-aliases/ValidateFunc.md)

Internal method for merging two rule functions.

#### Parameters

• **left**: [`BaseRule`](../../base/classes/BaseRule.md)\<`unknown`\>

left rule

• **right**: [`BaseRule`](../../base/classes/BaseRule.md)\<`unknown`\>

right rule

• **conjunction**: `"and"` \| `"or"`

conjunction can be either 'or' or 'and'

#### Returns

`string` \| [`ValidateFunc`](../../../type-aliases/ValidateFunc.md)

merged rule functions.

#### Inherited from

[`BaseRule`](../../base/classes/BaseRule.md) . [`_mergeFunc`](../../base/classes/BaseRule.md#_mergefunc)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:388](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/base.ts#L388)

***

### \_mergeMetadata()

`Internal`

> `static` `protected` **\_mergeMetadata**(`left`, `right`, `conjunction`): [`RuleMetadata`](../../base/type-aliases/RuleMetadata.md)

Internal method for creating the trace-back metadata.

#### Parameters

• **left**: [`BaseRule`](../../base/classes/BaseRule.md)\<`unknown`\>

left rule

• **right**: [`BaseRule`](../../base/classes/BaseRule.md)\<`unknown`\>

right rule

• **conjunction**: `"and"` \| `"or"`

conjunction can be either 'or' or 'and'

#### Returns

[`RuleMetadata`](../../base/type-aliases/RuleMetadata.md)

the trace-back metadata..

#### Inherited from

[`BaseRule`](../../base/classes/BaseRule.md) . [`_mergeMetadata`](../../base/classes/BaseRule.md#_mergemetadata)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:425](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/base.ts#L425)

***

### \_mergeVariables()

`Internal`

> `static` `protected` **\_mergeVariables**(`left`, `right`): `Record`\<`string`, `unknown`\>

Internal method for merging two rule variables.

#### Parameters

• **left**: [`BaseRule`](../../base/classes/BaseRule.md)\<`unknown`\>

left rule

• **right**: [`BaseRule`](../../base/classes/BaseRule.md)\<`unknown`\>

right rule

#### Returns

`Record`\<`string`, `unknown`\>

merged rule variables.

#### Inherited from

[`BaseRule`](../../base/classes/BaseRule.md) . [`_mergeVariables`](../../base/classes/BaseRule.md#_mergevariables)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:364](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/base.ts#L364)

***

### \_name()

> `static` **\_name**(): `string`

Generates a unique name for the class, typically used for serialization identification.

#### Returns

`string`

#### Overrides

[`BaseRule`](../../base/classes/BaseRule.md) . [`_name`](../../base/classes/BaseRule.md#_name)

#### Source

[packages/core/src/events/inference/validate/guardrails/boolean.ts:23](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/boolean.ts#L23)

***

### deserialize()

> `static` **deserialize**(`serialized`, `values`?): `Promise` \<[`BooleanRule`](BooleanRule.md)\<`boolean`\>\>

Deserializes a serialized rule object into a `BooleanRule` instance.

#### Parameters

• **serialized**: [`SerializedRule`](../../../../../../studio/serde/type-aliases/SerializedRule.md)

The serialized rule data.

• **values?**: `Record`\<`string`, `unknown`\>

Optional additional values to merge into the rule's variables.

#### Returns

`Promise` \<[`BooleanRule`](BooleanRule.md)\<`boolean`\>\>

A promise that resolves to a new instance of `BooleanRule`.

#### Overrides

[`BaseRule`](../../base/classes/BaseRule.md) . [`deserialize`](../../base/classes/BaseRule.md#deserialize)

#### Source

[packages/core/src/events/inference/validate/guardrails/boolean.ts:71](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/boolean.ts#L71)

***

### doesNotExist()

> `static` **doesNotExist**(): [`BooleanRule`](BooleanRule.md)\<`undefined` \| `boolean`\>

Creates a rule to check if a boolean value does not exist (is undefined).

#### Returns

[`BooleanRule`](BooleanRule.md)\<`undefined` \| `boolean`\>

A `BooleanRule` instance to check if the value is undefined.

#### Example

```ts
const doesNotExistRule = BooleanRule.doesNotExist();
console.log(doesNotExistRule.func(undefined)); // Outputs: true
console.log(doesNotExistRule.func(false)); // Outputs: false
```

#### Source

[packages/core/src/events/inference/validate/guardrails/boolean.ts:112](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/boolean.ts#L112)

***

### exists()

> `static` **exists**(): [`BooleanRule`](BooleanRule.md)\<`undefined` \| `boolean`\>

Creates a rule to check if a boolean value exists (is not undefined).

#### Returns

[`BooleanRule`](BooleanRule.md)\<`undefined` \| `boolean`\>

A `BooleanRule` instance to check if the value is not undefined.

#### Example

```ts
const existsRule = BooleanRule.exists();
console.log(existsRule.func(true)); // Outputs: true
console.log(existsRule.func(undefined)); // Outputs: false
```

#### Source

[packages/core/src/events/inference/validate/guardrails/boolean.ts:95](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/boolean.ts#L95)

***

### isEqual()

> `static` **isEqual**(`value`?): [`BooleanRule`](BooleanRule.md)\<`boolean`\>

Creates a rule to check if a boolean value is equal to a specified value.

#### Parameters

• **value?**: `boolean`

The value to compare against.

#### Returns

[`BooleanRule`](BooleanRule.md)\<`boolean`\>

A `BooleanRule` instance to check equality.

#### Example

```ts
const isEqualTrue = BooleanRule.isEqual(true);
console.log(isEqualTrue.func(true)); // Outputs: true
console.log(isEqualTrue.func(false)); // Outputs: false
```

#### Source

[packages/core/src/events/inference/validate/guardrails/boolean.ts:130](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/boolean.ts#L130)

***

### isFalse()

> `static` **isFalse**(): [`BooleanRule`](BooleanRule.md)\<`boolean`\>

Creates a rule to check if a boolean value is false.

#### Returns

[`BooleanRule`](BooleanRule.md)\<`boolean`\>

A `BooleanRule` instance to validate if the value is false.

#### Example

```ts
const isFalseRule = BooleanRule.isFalse();
console.log(isFalseRule.func(false)); // Outputs: true
console.log(isFalseRule.func(true)); // Outputs: false
```

#### Source

[packages/core/src/events/inference/validate/guardrails/boolean.ts:184](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/boolean.ts#L184)

***

### isNotEqual()

> `static` **isNotEqual**(`value`?): [`BooleanRule`](BooleanRule.md)\<`boolean`\>

Creates a rule to check if a boolean value is not equal to a specified value.

#### Parameters

• **value?**: `boolean`

The value to compare against.

#### Returns

[`BooleanRule`](BooleanRule.md)\<`boolean`\>

A `BooleanRule` instance to check inequality.

#### Example

```ts
const isNotEqualTrue = BooleanRule.isNotEqual(true);
console.log(isNotEqualTrue.func(false)); // Outputs: true
console.log(isNotEqualTrue.func(true)); // Outputs: false
```

#### Source

[packages/core/src/events/inference/validate/guardrails/boolean.ts:149](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/boolean.ts#L149)

***

### isTrue()

> `static` **isTrue**(): [`BooleanRule`](BooleanRule.md)\<`boolean`\>

Creates a rule to check if a boolean value is true.

#### Returns

[`BooleanRule`](BooleanRule.md)\<`boolean`\>

A `BooleanRule` instance to validate if the value is true.

#### Example

```ts
const isTrueRule = BooleanRule.isTrue();
console.log(isTrueRule.func(true)); // Outputs: true
console.log(isTrueRule.func(false)); // Outputs: false
```

#### Source

[packages/core/src/events/inference/validate/guardrails/boolean.ts:167](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/boolean.ts#L167)
