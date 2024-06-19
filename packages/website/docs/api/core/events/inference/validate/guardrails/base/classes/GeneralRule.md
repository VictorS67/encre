# Class: GeneralRule\<T\>

A general-purpose rule class that extends the BaseRule abstract class.
This class is intended to be used for rules where the specific type or category
might not be known or when a rule does not fit into a specific category.

## Example

```typescript
const rule = new GeneralRule({
  description: 'is greater than {{value}}',
  variables: { value: 1 },
  func: await (input: number, variables: { value: number }) => input > variables.value
});
```

## Extends

- [`BaseRule`](BaseRule.md)\<`T`\>

## Type parameters

• **T** = `unknown`

The type of input data the rule will validate.

## Constructors

### new GeneralRule()

> **new GeneralRule**\<`T`\>(`fields`): [`GeneralRule`](GeneralRule.md)\<`T`\>

Constructs a new instance of a rule with the specified fields.

#### Parameters

• **fields**: [`BaseRuleFields`](../interfaces/BaseRuleFields.md)\<`T`\>

#### Returns

[`GeneralRule`](GeneralRule.md)\<`T`\>

#### Inherited from

[`BaseRule`](BaseRule.md) . [`constructor`](BaseRule.md#constructors)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:116](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L116)

## Properties

### \_isSerializable

> **\_isSerializable**: `boolean` = `true`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Overrides

[`BaseRule`](BaseRule.md) . [`_isSerializable`](BaseRule.md#_isserializable)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:495](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L495)

***

### \_kwargs

> **\_kwargs**: `SerializedFields`

Key-value pairs of properties to be serialized.

#### Inherited from

[`BaseRule`](BaseRule.md) . [`_kwargs`](BaseRule.md#_kwargs)

#### Source

[packages/core/src/load/serializable.ts:168](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L168)

***

### \_namespace

> **\_namespace**: `string`[]

Unique namespace identifier for the serialized object, represented as an array of strings.

#### Inherited from

[`BaseRule`](BaseRule.md) . [`_namespace`](BaseRule.md#_namespace)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:59](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L59)

***

### description

> **description**: `string`

A human-readable description of what the rule checks or enforces.

#### Inherited from

[`BaseRule`](BaseRule.md) . [`description`](BaseRule.md#description)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:70](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L70)

***

### metadata

> **metadata**: `undefined` \| [`RuleMetadata`](../type-aliases/RuleMetadata.md)

Optional track-back metadata of rules that are used for merging to the current rule.

#### Inherited from

[`BaseRule`](BaseRule.md) . [`metadata`](BaseRule.md#metadata)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:80](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L80)

***

### variables

> **variables**: `undefined` \| `Record`\<`string`, `unknown`\>

An optional set of variables that can be used within the rule's validation function.

#### Inherited from

[`BaseRule`](BaseRule.md) . [`variables`](BaseRule.md#variables)

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

> **\_ruleType**(): `string`

Specifies the rule type. For `GeneralRule`, the type is "unknown" as it can handle general cases.

#### Returns

`string`

The type identifier for this class, used in classification and serialization.

#### Overrides

[`BaseRule`](BaseRule.md) . [`_ruleType`](BaseRule.md#_ruletype)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:505](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L505)

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

[`BaseRule`](BaseRule.md) . [`_validateFuncStr`](BaseRule.md#_validatefuncstr)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:447](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L447)

***

### concat()

> **concat**\<`U`\>(`rule`, `conjunction`): [`BaseRule`](BaseRule.md)\<`T` \| `U`\>

Concatenates this rule with another rule using a specified logical conjunction.
This method effectively merges two rules into a new `GeneralRule` instance, combining their logic.

#### Type parameters

• **U**

The type of input data the other rule will validate.

#### Parameters

• **rule**: [`BaseRule`](BaseRule.md)\<`U`\>

The other rule to concatenate with this rule.

• **conjunction**: `"and"` \| `"or"`

The logical conjunction to apply ("and" | "or").

#### Returns

[`BaseRule`](BaseRule.md)\<`T` \| `U`\>

A new `GeneralRule` instance that represents the logical combination of this rule and the other rule.

#### Overrides

[`BaseRule`](BaseRule.md) . [`concat`](BaseRule.md#concat)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:518](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L518)

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

[`BaseRule`](BaseRule.md) . [`getAttributes`](BaseRule.md#getattributes)

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

[`BaseRule`](BaseRule.md) . [`getCleanDescription`](BaseRule.md#getcleandescription)

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

[`BaseRule`](BaseRule.md) . [`serialize`](BaseRule.md#serialize)

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

[`BaseRule`](BaseRule.md) . [`toCallableLambda`](BaseRule.md#tocallablelambda)

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

[`BaseRule`](BaseRule.md) . [`toJSON`](BaseRule.md#tojson)

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

[`BaseRule`](BaseRule.md) . [`toJSONConstructor`](BaseRule.md#tojsonconstructor)

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

[`BaseRule`](BaseRule.md) . [`toJSONNotImplemented`](BaseRule.md#tojsonnotimplemented)

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

[`BaseRule`](BaseRule.md) . [`toJSONSecret`](BaseRule.md#tojsonsecret)

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

[`BaseRule`](BaseRule.md) . [`validate`](BaseRule.md#validate)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:274](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L274)

***

### \_mergeDescription()

`Internal`

> `static` `protected` **\_mergeDescription**(`left`, `right`, `conjunction`): `string`

Internal method for merging two rule description.

#### Parameters

• **left**: [`BaseRule`](BaseRule.md)\<`unknown`\>

left rule

• **right**: [`BaseRule`](BaseRule.md)\<`unknown`\>

right rule

• **conjunction**: `"and"` \| `"or"`

conjunction can be either 'or' or 'and'

#### Returns

`string`

merged rule description.

#### Inherited from

[`BaseRule`](BaseRule.md) . [`_mergeDescription`](BaseRule.md#_mergedescription)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:312](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L312)

***

### \_mergeFunc()

`Internal`

> `static` `protected` **\_mergeFunc**(`left`, `right`, `conjunction`): `string` \| [`ValidateFunc`](../../../type-aliases/ValidateFunc.md)

Internal method for merging two rule functions.

#### Parameters

• **left**: [`BaseRule`](BaseRule.md)\<`unknown`\>

left rule

• **right**: [`BaseRule`](BaseRule.md)\<`unknown`\>

right rule

• **conjunction**: `"and"` \| `"or"`

conjunction can be either 'or' or 'and'

#### Returns

`string` \| [`ValidateFunc`](../../../type-aliases/ValidateFunc.md)

merged rule functions.

#### Inherited from

[`BaseRule`](BaseRule.md) . [`_mergeFunc`](BaseRule.md#_mergefunc)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:388](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L388)

***

### \_mergeMetadata()

`Internal`

> `static` `protected` **\_mergeMetadata**(`left`, `right`, `conjunction`): [`RuleMetadata`](../type-aliases/RuleMetadata.md)

Internal method for creating the trace-back metadata.

#### Parameters

• **left**: [`BaseRule`](BaseRule.md)\<`unknown`\>

left rule

• **right**: [`BaseRule`](BaseRule.md)\<`unknown`\>

right rule

• **conjunction**: `"and"` \| `"or"`

conjunction can be either 'or' or 'and'

#### Returns

[`RuleMetadata`](../type-aliases/RuleMetadata.md)

the trace-back metadata..

#### Inherited from

[`BaseRule`](BaseRule.md) . [`_mergeMetadata`](BaseRule.md#_mergemetadata)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:425](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L425)

***

### \_mergeVariables()

`Internal`

> `static` `protected` **\_mergeVariables**(`left`, `right`): `Record`\<`string`, `unknown`\>

Internal method for merging two rule variables.

#### Parameters

• **left**: [`BaseRule`](BaseRule.md)\<`unknown`\>

left rule

• **right**: [`BaseRule`](BaseRule.md)\<`unknown`\>

right rule

#### Returns

`Record`\<`string`, `unknown`\>

merged rule variables.

#### Inherited from

[`BaseRule`](BaseRule.md) . [`_mergeVariables`](BaseRule.md#_mergevariables)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:364](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L364)

***

### \_name()

> `static` **\_name**(): `string`

Generates a unique name for the class, typically used for serialization identification.

#### Returns

`string`

#### Overrides

[`BaseRule`](BaseRule.md) . [`_name`](BaseRule.md#_name)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:497](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L497)

***

### deserialize()

> `static` **deserialize**(`serialized`, `values`?): `Promise` \<[`GeneralRule`](GeneralRule.md)\<`unknown`\>\>

Deserializes a `SerializedRule` object into a `GeneralRule` instance.
This static method provides a mechanism to reconstruct a `GeneralRule` from its serialized form.

#### Parameters

• **serialized**: [`SerializedRule`](../../../../../../studio/serde/interfaces/SerializedRule.md)

The serialized rule data.

• **values?**: `Record`\<`string`, `unknown`\>

Optional additional variables that may be needed for rule initialization.

#### Returns

`Promise` \<[`GeneralRule`](GeneralRule.md)\<`unknown`\>\>

A promise that resolves to a new `GeneralRule` instance based on the serialized data.

#### Overrides

[`BaseRule`](BaseRule.md) . [`deserialize`](BaseRule.md#deserialize)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:550](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L550)
