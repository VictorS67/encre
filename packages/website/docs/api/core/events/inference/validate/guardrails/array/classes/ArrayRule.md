# Class: ArrayRule\<T\>

A specialized rule class designed for handling array-based validations.
This class provides various static methods to create array-specific validation.

## Example

```typescript
const rule = new ArrayRule({
  description: 'has all 0s',
  func: await (input: Array<unknown>) => input.every((i) => i === 0)
});
```

## Extends

- [`BaseRule`](../../base/classes/BaseRule.md)\<`T`\>

## Type parameters

• **T** *extends* `unknown` = `unknown`[]

The type of input data the rule will validate, defaulting to Array of unknown.

## Constructors

### new ArrayRule()

> **new ArrayRule**\<`T`\>(`fields`): [`ArrayRule`](ArrayRule.md)\<`T`\>

Constructs a new instance of a rule with the specified fields.

#### Parameters

• **fields**: [`BaseRuleFields`](../../base/interfaces/BaseRuleFields.md)\<`T`\>

#### Returns

[`ArrayRule`](ArrayRule.md)\<`T`\>

#### Inherited from

[`BaseRule`](../../base/classes/BaseRule.md) . [`constructor`](../../base/classes/BaseRule.md#constructors)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:116](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L116)

## Properties

### \_isSerializable

> **\_isSerializable**: `boolean` = `true`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Overrides

[`BaseRule`](../../base/classes/BaseRule.md) . [`_isSerializable`](../../base/classes/BaseRule.md#_isserializable)

#### Source

[packages/core/src/events/inference/validate/guardrails/array.ts:21](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/array.ts#L21)

***

### \_kwargs

> **\_kwargs**: `SerializedFields`

Key-value pairs of properties to be serialized.

#### Inherited from

[`BaseRule`](../../base/classes/BaseRule.md) . [`_kwargs`](../../base/classes/BaseRule.md#_kwargs)

#### Source

[packages/core/src/load/serializable.ts:168](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L168)

***

### \_namespace

> **\_namespace**: `string`[]

Unique namespace identifier for the serialized object, represented as an array of strings.

#### Inherited from

[`BaseRule`](../../base/classes/BaseRule.md) . [`_namespace`](../../base/classes/BaseRule.md#_namespace)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:59](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L59)

***

### description

> **description**: `string`

A human-readable description of what the rule checks or enforces.

#### Inherited from

[`BaseRule`](../../base/classes/BaseRule.md) . [`description`](../../base/classes/BaseRule.md#description)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:70](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L70)

***

### metadata

> **metadata**: `undefined` \| [`RuleMetadata`](../../base/type-aliases/RuleMetadata.md)

Optional track-back metadata of rules that are used for merging to the current rule.

#### Inherited from

[`BaseRule`](../../base/classes/BaseRule.md) . [`metadata`](../../base/classes/BaseRule.md#metadata)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:80](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L80)

***

### variables

> **variables**: `undefined` \| `Record`\<`string`, `unknown`\>

An optional set of variables that can be used within the rule's validation function.

#### Inherited from

[`BaseRule`](../../base/classes/BaseRule.md) . [`variables`](../../base/classes/BaseRule.md#variables)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:75](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L75)

## Accessors

### \_aliases

> `get` **\_aliases**(): `undefined` \| `SerializedFields`

Retrieves alias mappings for the object's attribute names.

#### Returns

`undefined` \| `SerializedFields`

An object representing key aliases, or undefined if none are defined.

#### Source

[packages/core/src/load/serializable.ts:217](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L217)

***

### \_attributes

> `get` **\_attributes**(): `undefined` \| `SerializedFields`

Retrieves attributes of the object.

#### Returns

`undefined` \| `SerializedFields`

An object representing attributes, or undefined if none are defined.

#### Source

[packages/core/src/load/serializable.ts:208](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L208)

***

### \_id

> `get` **\_id**(): `string`[]

Retrieves the name of the class. This provides a unique identifier for serialization.

#### Returns

`string`[]

The path of serializable.

#### Source

[packages/core/src/load/serializable.ts:187](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L187)

***

### \_secrets

> `get` **\_secrets**(): `undefined` \| `SecretFields`

Retrieves any secrets defined in the object.

#### Returns

`undefined` \| `SecretFields`

An object representing secret fields, or undefined if none are defined.

#### Source

[packages/core/src/load/serializable.ts:199](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L199)

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

[packages/core/src/events/inference/validate/guardrails/base.ts:92](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L92)

## Methods

### \_ruleType()

> **\_ruleType**(): `"array"`

Specifies the rule type. For `ArrayRule`, the type is explicitly "array".

#### Returns

`"array"`

The type identifier for this rule class.

#### Overrides

[`BaseRule`](../../base/classes/BaseRule.md) . [`_ruleType`](../../base/classes/BaseRule.md#_ruletype)

#### Source

[packages/core/src/events/inference/validate/guardrails/array.ts:31](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/array.ts#L31)

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

[packages/core/src/events/inference/validate/guardrails/base.ts:447](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L447)

***

### concat()

> **concat**\<`U`\>(`rule`, `conjunction`): [`BaseRule`](../../base/classes/BaseRule.md)\<`T` \| `U`\>

Combines two array rules into one using a specified logical conjunction ('and' or 'or').

#### Type parameters

• **U**

#### Parameters

• **rule**: [`BaseRule`](../../base/classes/BaseRule.md)\<`U`\>

The rule to concatenate with the current rule.

• **conjunction**: `"and"` \| `"or"`

The type of logical conjunction to apply ('and' | 'or').

#### Returns

[`BaseRule`](../../base/classes/BaseRule.md)\<`T` \| `U`\>

A new `ArrayRule` instance representing the combined rule.

#### Overrides

[`BaseRule`](../../base/classes/BaseRule.md) . [`concat`](../../base/classes/BaseRule.md#concat)

#### Source

[packages/core/src/events/inference/validate/guardrails/array.ts:41](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/array.ts#L41)

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

[packages/core/src/load/serializable.ts:430](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L430)

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

[packages/core/src/events/inference/validate/guardrails/base.ts:212](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L212)

***

### serialize()

> **serialize**(): [`SerializedRule`](../../../../../../studio/serde/interfaces/SerializedRule.md)

Serializes the rule into a structured format for storage or transmission.

#### Returns

[`SerializedRule`](../../../../../../studio/serde/interfaces/SerializedRule.md)

A `SerializedRule` object containing the serialized state.

#### Inherited from

[`BaseRule`](../../base/classes/BaseRule.md) . [`serialize`](../../base/classes/BaseRule.md#serialize)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:190](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L190)

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

[packages/core/src/events/inference/validate/guardrails/base.ts:264](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L264)

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

[packages/core/src/load/serializable.ts:665](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L665)

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

[packages/core/src/load/serializable.ts:478](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L478)

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

[packages/core/src/load/serializable.ts:448](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L448)

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

[packages/core/src/load/serializable.ts:462](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L462)

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

[packages/core/src/events/inference/validate/guardrails/base.ts:274](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L274)

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

[packages/core/src/events/inference/validate/guardrails/base.ts:312](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L312)

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

[packages/core/src/events/inference/validate/guardrails/base.ts:388](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L388)

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

[packages/core/src/events/inference/validate/guardrails/base.ts:425](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L425)

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

[packages/core/src/events/inference/validate/guardrails/base.ts:364](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L364)

***

### \_name()

> `static` **\_name**(): `string`

Generates a unique name for the class, typically used for serialization identification.

#### Returns

`string`

#### Overrides

[`BaseRule`](../../base/classes/BaseRule.md) . [`_name`](../../base/classes/BaseRule.md#_name)

#### Source

[packages/core/src/events/inference/validate/guardrails/array.ts:23](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/array.ts#L23)

***

### contains()

> `static` **contains**(`value`?): [`ArrayRule`](ArrayRule.md)\<`unknown`[]\>

Creates a rule to check if an array contains a specific value.

#### Parameters

• **value?**: `unknown`

The value to check for within the array.

#### Returns

[`ArrayRule`](ArrayRule.md)\<`unknown`[]\>

A `ArrayRule` instance to check if the value is contained in the array.

#### Example

```ts
// Usage
const containsRule = ArrayRule.contains(2);
console.log(containsRule.func([1, 2, 3])); // Outputs: true
console.log(containsRule.func([4, 5, 6])); // Outputs: false
```

#### Source

[packages/core/src/events/inference/validate/guardrails/array.ts:215](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/array.ts#L215)

***

### deserialize()

> `static` **deserialize**(`serialized`, `values`?): `Promise` \<[`ArrayRule`](ArrayRule.md)\<`unknown`[]\>\>

Deserializes a serialized rule object into an `ArrayRule` instance.

#### Parameters

• **serialized**: [`SerializedRule`](../../../../../../studio/serde/interfaces/SerializedRule.md)

The serialized rule data.

• **values?**: `Record`\<`string`, `unknown`\>

Optional additional values to merge into the rule's variables.

#### Returns

`Promise` \<[`ArrayRule`](ArrayRule.md)\<`unknown`[]\>\>

A promise that resolves to a new instance of `ArrayRule`.

#### Overrides

[`BaseRule`](../../base/classes/BaseRule.md) . [`deserialize`](../../base/classes/BaseRule.md#deserialize)

#### Source

[packages/core/src/events/inference/validate/guardrails/array.ts:71](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/array.ts#L71)

***

### doesNotContain()

> `static` **doesNotContain**(`value`?): [`ArrayRule`](ArrayRule.md)\<`unknown`[]\>

Creates a rule to check if an array does not contain a specific value.

#### Parameters

• **value?**: `unknown`

The value to check for within the array.

#### Returns

[`ArrayRule`](ArrayRule.md)\<`unknown`[]\>

A `ArrayRule` instance to check if the value is not contained in the array.

#### Example

```ts
// Usage
const doesNotContainRule = ArrayRule.doesNotContain(2);
console.log(doesNotContainRule.func([4, 5, 6])); // Outputs: true
console.log(doesNotContainRule.func([1, 2, 3])); // Outputs: false
```

#### Source

[packages/core/src/events/inference/validate/guardrails/array.ts:235](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/array.ts#L235)

***

### doesNotExist()

> `static` **doesNotExist**(): [`ArrayRule`](ArrayRule.md)\<`undefined` \| `unknown`[]\>

Creates a rule to check if an array does not exist (is undefined).

#### Returns

[`ArrayRule`](ArrayRule.md)\<`undefined` \| `unknown`[]\>

A `ArrayRule` instance to check if the array is undefined.

#### Example

```ts
// Usage
const doesNotExistRule = ArrayRule.doesNotExist();
console.log(doesNotExistRule.func(undefined)); // Outputs: true
console.log(doesNotExistRule.func([1, 2, 3])); // Outputs: false
```

#### Source

[packages/core/src/events/inference/validate/guardrails/array.ts:114](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/array.ts#L114)

***

### exists()

> `static` **exists**(): [`ArrayRule`](ArrayRule.md)\<`undefined` \| `unknown`[]\>

Creates a rule to check if an array exists (is not undefined).

#### Returns

[`ArrayRule`](ArrayRule.md)\<`undefined` \| `unknown`[]\>

A `ArrayRule` instance to check if the array is not undefined.

#### Example

```ts
// Usage
const existsRule = ArrayRule.exists();
console.log(existsRule.func([1, 2, 3])); // Outputs: true
console.log(existsRule.func(undefined)); // Outputs: false
```

#### Source

[packages/core/src/events/inference/validate/guardrails/array.ts:96](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/array.ts#L96)

***

### isNotStrictlyEqual()

> `static` **isNotStrictlyEqual**(`value`?): [`ArrayRule`](ArrayRule.md)\<`unknown`[]\>

Creates a rule to check if an array is not strictly equal to a specified array.
This includes checking the inequality of any element in the array.

#### Parameters

• **value?**: `unknown`[]

The array to compare against.

#### Returns

[`ArrayRule`](ArrayRule.md)\<`unknown`[]\>

A `ArrayRule` instance to perform the inequality check.

#### Example

```ts
// Usage
const isNotEqualRule = ArrayRule.isNotStrictlyEqual([1, 2, 3]);
console.log(isNotEqualRule.func([1, 2])); // Outputs: true
console.log(isNotEqualRule.func([1, 2, 3])); // Outputs: false
```

#### Source

[packages/core/src/events/inference/validate/guardrails/array.ts:175](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/array.ts#L175)

***

### isStrictlyEqual()

> `static` **isStrictlyEqual**(`value`?): [`ArrayRule`](ArrayRule.md)\<`unknown`[]\>

Creates a rule to check if an array is strictly equal to a specified array.
This includes checking the equality of all elements in the array.

#### Parameters

• **value?**: `unknown`[]

The array to compare against.

#### Returns

[`ArrayRule`](ArrayRule.md)\<`unknown`[]\>

A `ArrayRule` instance to perform the equality check.

#### Example

```ts
// Usage
const isEqualRule = ArrayRule.isStrictlyEqual([1, 2, 3]);
console.log(isEqualRule.func([1, 2, 3])); // Outputs: true
console.log(isEqualRule.func([1, 2])); // Outputs: false
```

#### Source

[packages/core/src/events/inference/validate/guardrails/array.ts:134](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/array.ts#L134)

***

### lengthEqual()

> `static` **lengthEqual**(`value`?): [`ArrayRule`](ArrayRule.md)\<`unknown`[]\>

Creates a rule to check if an array's length is exactly equal to a specified value.

#### Parameters

• **value?**: `number`

The length value to compare against the array's length.

#### Returns

[`ArrayRule`](ArrayRule.md)\<`unknown`[]\>

A `ArrayRule` instance to perform the equality check on the length.

#### Example

```ts
// Usage
const lengthEqualRule = ArrayRule.lengthEqual(3);
console.log(lengthEqualRule.func([1, 2, 3])); // Outputs: true
console.log(lengthEqualRule.func([1, 2])); // Outputs: false
```

#### Source

[packages/core/src/events/inference/validate/guardrails/array.ts:255](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/array.ts#L255)

***

### lengthGreaterThan()

> `static` **lengthGreaterThan**(`value`?): [`ArrayRule`](ArrayRule.md)\<`unknown`[]\>

Creates a rule to check if an array's length is greater than a specified value.

#### Parameters

• **value?**: `number`

The minimum length value the array should exceed.

#### Returns

[`ArrayRule`](ArrayRule.md)\<`unknown`[]\>

A `ArrayRule` instance to check if the array's length is greater than the specified value.

#### Example

```ts
// Usage
const lengthGreaterThanRule = ArrayRule.lengthGreaterThan(2);
console.log(lengthGreaterThanRule.func([1, 2, 3])); // Outputs: true
console.log(lengthGreaterThanRule.func([1])); // Outputs: false
```

#### Source

[packages/core/src/events/inference/validate/guardrails/array.ts:295](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/array.ts#L295)

***

### lengthGreaterThanOrEqual()

> `static` **lengthGreaterThanOrEqual**(`value`?): [`ArrayRule`](ArrayRule.md)\<`unknown`[]\>

Creates a rule to check if an array's length is greater than or equal to a specified value.

#### Parameters

• **value?**: `number`

The minimum length value the array should meet or exceed.

#### Returns

[`ArrayRule`](ArrayRule.md)\<`unknown`[]\>

A `ArrayRule` instance to check if the array's length is greater than or equal to the specified value.

#### Example

```ts
// Usage
const lengthGreaterThanOrEqualRule = ArrayRule.lengthGreaterThanOrEqual(3);
console.log(lengthGreaterThanOrEqualRule.func([1, 2, 3])); // Outputs: true
console.log(lengthGreaterThanOrEqualRule.func([1, 2])); // Outputs: false
```

#### Source

[packages/core/src/events/inference/validate/guardrails/array.ts:335](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/array.ts#L335)

***

### lengthLessThan()

> `static` **lengthLessThan**(`value`?): [`ArrayRule`](ArrayRule.md)\<`unknown`[]\>

Creates a rule to check if an array's length is less than a specified value.

#### Parameters

• **value?**: `number`

The maximum length value the array should not exceed.

#### Returns

[`ArrayRule`](ArrayRule.md)\<`unknown`[]\>

A `ArrayRule` instance to check if the array's length is less than the specified value.

#### Example

```ts
// Usage
const lengthLessThanRule = ArrayRule.lengthLessThan(3);
console.log(lengthLessThanRule.func([1, 2])); // Outputs: true
console.log(lengthLessThanRule.func([1, 2, 3])); // Outputs: false
```

#### Source

[packages/core/src/events/inference/validate/guardrails/array.ts:315](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/array.ts#L315)

***

### lengthLessThanOrEqual()

> `static` **lengthLessThanOrEqual**(`value`?): [`ArrayRule`](ArrayRule.md)\<`unknown`[]\>

Creates a rule to check if an array's length is less than or equal to a specified value.

#### Parameters

• **value?**: `number`

The maximum length value the array should meet or not exceed.

#### Returns

[`ArrayRule`](ArrayRule.md)\<`unknown`[]\>

A `ArrayRule` instance to check if the array's length is less than or equal to the specified value.

#### Example

```ts
// Usage
const lengthLessThanOrEqualRule = ArrayRule.lengthLessThanOrEqual(2);
console.log(lengthLessThanOrEqualRule.func([1, 2])); // Outputs: true
console.log(lengthLessThanOrEqualRule.func([1, 2, 3])); // Outputs: false
```

#### Source

[packages/core/src/events/inference/validate/guardrails/array.ts:355](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/array.ts#L355)

***

### lengthNotEqual()

> `static` **lengthNotEqual**(`value`?): [`ArrayRule`](ArrayRule.md)\<`unknown`[]\>

Creates a rule to check if an array's length is not equal to a specified value.

#### Parameters

• **value?**: `number`

The length value to compare against the array's length.

#### Returns

[`ArrayRule`](ArrayRule.md)\<`unknown`[]\>

A `ArrayRule` instance to perform the inequality check on the length.

#### Example

```ts
// Usage
const lengthNotEqualRule = ArrayRule.lengthNotEqual(3);
console.log(lengthNotEqualRule.func([1, 2, 3])); // Outputs: false
console.log(lengthNotEqualRule.func([1, 2, 3, 4])); // Outputs: true
```

#### Source

[packages/core/src/events/inference/validate/guardrails/array.ts:275](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/array.ts#L275)
