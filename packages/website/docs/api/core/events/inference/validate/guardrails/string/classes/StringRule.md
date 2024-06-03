# Class: StringRule\<T\>

A specialized rule class designed for handling string-based validations.
This class provides various static methods to create string-specific validation
rules such as checking string length, content, and pattern matching.

## Example

```typescript
const rule = new StringRule({
  description: `is 'name'`,
  func: await (input: string) => input === 'name'
});
```

## Extends

- [`BaseRule`](../../base/classes/BaseRule.md)\<`T`\>

## Type parameters

• **T** *extends* `unknown` = `string`

The type of input data the rule will validate, defaulting to string.

## Constructors

### new StringRule()

> **new StringRule**\<`T`\>(`fields`): [`StringRule`](StringRule.md)\<`T`\>

Constructs a new instance of a rule with the specified fields.

#### Parameters

• **fields**: [`BaseRuleFields`](../../base/interfaces/BaseRuleFields.md)\<`T`\>

#### Returns

[`StringRule`](StringRule.md)\<`T`\>

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

[packages/core/src/events/inference/validate/guardrails/string.ts:22](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/string.ts#L22)

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

> **\_ruleType**(): `"string"`

Specifies the rule type. For `StringRule`, the type is explicitly "string".

#### Returns

`"string"`

The type identifier for this rule class.

#### Overrides

[`BaseRule`](../../base/classes/BaseRule.md) . [`_ruleType`](../../base/classes/BaseRule.md#_ruletype)

#### Source

[packages/core/src/events/inference/validate/guardrails/string.ts:32](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/string.ts#L32)

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

Combines this rule with another rule using a specified logical conjunction ('and' | 'or').
This method merges two rules into a new `StringRule` instance, combining their conditions.

#### Type parameters

• **U**

The type of input data the other rule will validate.

#### Parameters

• **rule**: [`BaseRule`](../../base/classes/BaseRule.md)\<`U`\>

The other rule to concatenate with this rule.

• **conjunction**: `"and"` \| `"or"`

The logical conjunction to apply ("and" | "or").

#### Returns

[`BaseRule`](../../base/classes/BaseRule.md)\<`T` \| `U`\>

A new `StringRule` instance representing the combination of this rule and the other rule.

#### Overrides

[`BaseRule`](../../base/classes/BaseRule.md) . [`concat`](../../base/classes/BaseRule.md#concat)

#### Source

[packages/core/src/events/inference/validate/guardrails/string.ts:45](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/string.ts#L45)

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

[packages/core/src/events/inference/validate/guardrails/string.ts:24](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/string.ts#L24)

***

### contains()

> `static` **contains**(`value`?): [`StringRule`](StringRule.md)\<`string`\>

Creates a rule to check if a string contains a specified substring.

#### Parameters

• **value?**: `string`

The substring to check within the input string.

#### Returns

[`StringRule`](StringRule.md)\<`string`\>

A new `StringRule` instance to validate the presence of the substring.

#### Example

```ts
// Usage
const containsRule = StringRule.contains("test");
console.log(containsRule.func("testing"));  // Outputs: true
console.log(containsRule.func("check"));  // Outputs: false
```

#### Source

[packages/core/src/events/inference/validate/guardrails/string.ts:176](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/string.ts#L176)

***

### deserialize()

> `static` **deserialize**(`serialized`, `values`?): `Promise` \<[`StringRule`](StringRule.md)\<`string`\>\>

Deserializes a `SerializedRule` object into a `StringRule` instance.
This static method provides a mechanism to reconstruct a `StringRule` from its serialized form.

#### Parameters

• **serialized**: [`SerializedRule`](../../../../../../studio/serde/type-aliases/SerializedRule.md)

The serialized rule data.

• **values?**: `Record`\<`string`, `unknown`\>

Optional additional variables that may be needed for rule initialization.

#### Returns

`Promise` \<[`StringRule`](StringRule.md)\<`string`\>\>

A promise that resolves to a new `StringRule` instance based on the serialized data.

#### Overrides

[`BaseRule`](../../base/classes/BaseRule.md) . [`deserialize`](../../base/classes/BaseRule.md#deserialize)

#### Source

[packages/core/src/events/inference/validate/guardrails/string.ts:74](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/string.ts#L74)

***

### doesNotContain()

> `static` **doesNotContain**(`value`?): [`StringRule`](StringRule.md)\<`string`\>

Creates a rule to check if a string does not contain a specified substring.

#### Parameters

• **value?**: `string`

The substring to check absence within the input string.

#### Returns

[`StringRule`](StringRule.md)\<`string`\>

A new `StringRule` instance to validate the absence of the substring.

#### Example

```ts
// Usage
const doesNotContainRule = StringRule.doesNotContain("test");
console.log(doesNotContainRule.func("testing"));  // Outputs: false
console.log(doesNotContainRule.func("check"));  // Outputs: true
```

#### Source

[packages/core/src/events/inference/validate/guardrails/string.ts:196](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/string.ts#L196)

***

### doesNotEndWith()

> `static` **doesNotEndWith**(`value`?): [`StringRule`](StringRule.md)\<`string`\>

Creates a rule to check if a string does not end with a specified substring.

#### Parameters

• **value?**: `string`

The substring that the input string should not end with.

#### Returns

[`StringRule`](StringRule.md)\<`string`\>

A new `StringRule` instance to validate that the string does not end with the specified substring.

#### Example

```ts
// Usage
const doesNotEndWithRule = StringRule.doesNotEndWith("World");
console.log(doesNotEndWithRule.func("Hello World"));  // Outputs: false
console.log(doesNotEndWithRule.func("World Hello"));  // Outputs: true
```

#### Source

[packages/core/src/events/inference/validate/guardrails/string.ts:276](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/string.ts#L276)

***

### doesNotExist()

> `static` **doesNotExist**(): [`StringRule`](StringRule.md)\<`undefined` \| `string`\>

Creates a rule to determine if a string value does not exist (is undefined).

#### Returns

[`StringRule`](StringRule.md)\<`undefined` \| `string`\>

A new `StringRule` instance to validate the non-existence of a string.

#### Example

```ts
// Usage
const doesNotExistRule = StringRule.doesNotExist();
console.log(doesNotExistRule.func("Hello"));  // Outputs: false
console.log(doesNotExistRule.func(undefined));  // Outputs: true
```

#### Source

[packages/core/src/events/inference/validate/guardrails/string.ts:117](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/string.ts#L117)

***

### doesNotMatchRegex()

> `static` **doesNotMatchRegex**(`regex`?): [`StringRule`](StringRule.md)\<`string`\>

Creates a rule to check if a string does not match a specified regular expression.

#### Parameters

• **regex?**: `RegExp`

The regular expression that the input string should not match.

#### Returns

[`StringRule`](StringRule.md)\<`string`\>

A new `StringRule` instance to validate that the string does not match the specified regex.

#### Example

```ts
// Usage
const doesNotMatchRegexRule = StringRule.doesNotMatchRegex(/^test$/);
console.log(doesNotMatchRegexRule.func("test"));  // Outputs: false
console.log(doesNotMatchRegexRule.func("hello"));  // Outputs: true
```

#### Source

[packages/core/src/events/inference/validate/guardrails/string.ts:316](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/string.ts#L316)

***

### doesNotStartWith()

> `static` **doesNotStartWith**(`value`?): [`StringRule`](StringRule.md)\<`string`\>

Creates a rule to check if a string does not start with a specified substring.

#### Parameters

• **value?**: `string`

The substring that the input string should not start with.

#### Returns

[`StringRule`](StringRule.md)\<`string`\>

A new `StringRule` instance to validate that the string does not start with the specified substring.

#### Example

```ts
// Usage
const doesNotStartWithRule = StringRule.doesNotStartWith("Hello");
console.log(doesNotStartWithRule.func("Hello World"));  // Outputs: false
console.log(doesNotStartWithRule.func("World Hello"));  // Outputs: true
```

#### Source

[packages/core/src/events/inference/validate/guardrails/string.ts:236](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/string.ts#L236)

***

### endsWith()

> `static` **endsWith**(`value`?): [`StringRule`](StringRule.md)\<`string`\>

Creates a rule to check if a string ends with a specified substring.

#### Parameters

• **value?**: `string`

The substring to check at the end of the input string.

#### Returns

[`StringRule`](StringRule.md)\<`string`\>

A new `StringRule` instance to validate that the string ends with the specified substring.

#### Example

```ts
// Usage
const endsWithRule = StringRule.endsWith("World");
console.log(endsWithRule.func("Hello World"));  // Outputs: true
console.log(endsWithRule.func("World Hello"));  // Outputs: false
```

#### Source

[packages/core/src/events/inference/validate/guardrails/string.ts:256](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/string.ts#L256)

***

### exists()

> `static` **exists**(): [`StringRule`](StringRule.md)\<`undefined` \| `string`\>

Creates a rule to determine if a string value exists (is not undefined).

#### Returns

[`StringRule`](StringRule.md)\<`undefined` \| `string`\>

A new `StringRule` instance to validate the existence of a string.

#### Example

```ts
// Usage
const existsRule = StringRule.exists();
console.log(existsRule.func("Hello"));  // Outputs: true
console.log(existsRule.func(undefined));  // Outputs: false
```

#### Source

[packages/core/src/events/inference/validate/guardrails/string.ts:99](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/string.ts#L99)

***

### isEqual()

> `static` **isEqual**(`value`?): [`StringRule`](StringRule.md)\<`string`\>

Creates a rule to check if a string is equal to a specified value.

#### Parameters

• **value?**: `string`

The string value to compare against the input.

#### Returns

[`StringRule`](StringRule.md)\<`string`\>

A new `StringRule` instance to validate equality to the specified value.

#### Example

```ts
// Usage
const isEqualRule = StringRule.isEqual("test");
console.log(isEqualRule.func("test"));  // Outputs: true
console.log(isEqualRule.func("hello"));  // Outputs: false
```

#### Source

[packages/core/src/events/inference/validate/guardrails/string.ts:136](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/string.ts#L136)

***

### isNotEqual()

> `static` **isNotEqual**(`value`?): [`StringRule`](StringRule.md)\<`string`\>

Creates a rule to check if a string is not equal to a specified value.

#### Parameters

• **value?**: `string`

The string value to compare against the input.

#### Returns

[`StringRule`](StringRule.md)\<`string`\>

A new `StringRule` instance to validate inequality to the specified value.

#### Example

```ts
// Usage
const isNotEqualRule = StringRule.isNotEqual("test");
console.log(isNotEqualRule.func("test"));  // Outputs: false
console.log(isNotEqualRule.func("hello"));  // Outputs: true
```

#### Source

[packages/core/src/events/inference/validate/guardrails/string.ts:156](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/string.ts#L156)

***

### lengthEqual()

> `static` **lengthEqual**(`value`?): [`StringRule`](StringRule.md)\<`string`\>

Creates a rule to check if the length of a string is equal to a specified value.

#### Parameters

• **value?**: `number`

The length that the input string should match.

#### Returns

[`StringRule`](StringRule.md)\<`string`\>

A new `StringRule` instance to validate that the length of the string is equal to the specified value.

#### Example

```ts
// Usage
const lengthEqualRule = StringRule.lengthEqual(5);
console.log(lengthEqualRule.func("Hello"));  // Outputs: true
console.log(lengthEqualRule.func("Hello World"));  // Outputs: false
```

#### Source

[packages/core/src/events/inference/validate/guardrails/string.ts:336](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/string.ts#L336)

***

### lengthGreaterThan()

> `static` **lengthGreaterThan**(`value`?): [`StringRule`](StringRule.md)\<`string`\>

Creates a rule to check if the length of a string is greater than a specified value.

#### Parameters

• **value?**: `number`

The number to compare against the length of the input string.

#### Returns

[`StringRule`](StringRule.md)\<`string`\>

A new `StringRule` instance that validates whether the length of the string is greater than the specified value.

#### Example

```ts
// Usage
const lengthGreaterThanRule = StringRule.lengthGreaterThan(5);
console.log(lengthGreaterThanRule.func("Hello"));  // Outputs: false
console.log(lengthGreaterThanRule.func("Hello World"));  // Outputs: true
```

#### Source

[packages/core/src/events/inference/validate/guardrails/string.ts:376](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/string.ts#L376)

***

### lengthGreaterThanOrEqual()

> `static` **lengthGreaterThanOrEqual**(`value`?): [`StringRule`](StringRule.md)\<`string`\>

Creates a rule to check if the length of a string is greater than or equal to a specified value.

#### Parameters

• **value?**: `number`

The number to compare against the length of the input string.

#### Returns

[`StringRule`](StringRule.md)\<`string`\>

A new `StringRule` instance that validates whether the length of the string is greater than or equal to the specified value.

#### Example

```ts
// Usage
const lengthGreaterThanOrEqualRule = StringRule.lengthGreaterThanOrEqual(5);
console.log(lengthGreaterThanOrEqualRule.func("Hello"));  // Outputs: true
console.log(lengthGreaterThanOrEqualRule.func("Hi"));  // Outputs: false
```

#### Source

[packages/core/src/events/inference/validate/guardrails/string.ts:416](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/string.ts#L416)

***

### lengthLessThan()

> `static` **lengthLessThan**(`value`?): [`StringRule`](StringRule.md)\<`string`\>

Creates a rule to check if the length of a string is less than a specified value.

#### Parameters

• **value?**: `number`

The number to compare against the length of the input string.

#### Returns

[`StringRule`](StringRule.md)\<`string`\>

A new `StringRule` instance that validates whether the length of the string is less than the specified value.

#### Example

```ts
// Usage
const lengthLessThanRule = StringRule.lengthLessThan(10);
console.log(lengthLessThanRule.func("Hello"));  // Outputs: true
console.log(lengthLessThanRule.func("Hello World"));  // Outputs: false
```

#### Source

[packages/core/src/events/inference/validate/guardrails/string.ts:396](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/string.ts#L396)

***

### lengthLessThanOrEqual()

> `static` **lengthLessThanOrEqual**(`value`?): [`StringRule`](StringRule.md)\<`string`\>

Creates a rule to check if the length of a string is less than or equal to a specified value.

#### Parameters

• **value?**: `number`

The number to compare against the length of the input string.

#### Returns

[`StringRule`](StringRule.md)\<`string`\>

A new `StringRule` instance that validates whether the length of the string is less than or equal to the specified value.

#### Example

```ts
// Usage
const lengthLessThanOrEqualRule = StringRule.lengthLessThanOrEqual(5);
console.log(lengthLessThanOrEqualRule.func("Three"));  // Outputs: true
console.log(lengthLessThanOrEqualRule.func("Hello World"));  // Outputs: false
```

#### Source

[packages/core/src/events/inference/validate/guardrails/string.ts:436](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/string.ts#L436)

***

### lengthNotEqual()

> `static` **lengthNotEqual**(`value`?): [`StringRule`](StringRule.md)\<`string`\>

Creates a rule to check if the length of a string is not equal to a specified value.

#### Parameters

• **value?**: `number`

The length that the input string should not match.

#### Returns

[`StringRule`](StringRule.md)\<`string`\>

A new `StringRule` instance to validate that the length of the string is not equal to the specified value.

#### Example

```ts
// Usage
const lengthNotEqualRule = StringRule.lengthNotEqual(5);
console.log(lengthNotEqualRule.func("Hello"));  // Outputs: false
console.log(lengthNotEqualRule.func("Hello World"));  // Outputs: true
```

#### Source

[packages/core/src/events/inference/validate/guardrails/string.ts:356](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/string.ts#L356)

***

### matchesRegex()

> `static` **matchesRegex**(`regex`?): [`StringRule`](StringRule.md)\<`string`\>

Creates a rule to check if a string matches a specified regular expression.

#### Parameters

• **regex?**: `RegExp`

The regular expression to match against the input string.

#### Returns

[`StringRule`](StringRule.md)\<`string`\>

A new `StringRule` instance to validate that the string matches the specified regex.

#### Example

```ts
// Usage
const matchesRegexRule = StringRule.matchesRegex(/^test$/);
console.log(matchesRegexRule.func("test"));  // Outputs: true
console.log(matchesRegexRule.func("test123"));  // Outputs: false
```

#### Source

[packages/core/src/events/inference/validate/guardrails/string.ts:296](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/string.ts#L296)

***

### startsWith()

> `static` **startsWith**(`value`?): [`StringRule`](StringRule.md)\<`string`\>

Creates a rule to check if a string starts with a specified substring.

#### Parameters

• **value?**: `string`

The substring to check at the start of the input string.

#### Returns

[`StringRule`](StringRule.md)\<`string`\>

A new `StringRule` instance to validate that the string starts with the specified substring.

#### Example

```ts
// Usage
const startsWithRule = StringRule.startsWith("Hello");
console.log(startsWithRule.func("Hello World"));  // Outputs: true
console.log(startsWithRule.func("World Hello"));  // Outputs: false
```

#### Source

[packages/core/src/events/inference/validate/guardrails/string.ts:216](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/guardrails/string.ts#L216)
