# Class: `abstract` BaseRule\<T\>

An abstract class that serves as the base for creating rules within the system.
A rule is a logical construct that evaluates whether a piece of data meets a specified criterion.

## Extends

- [`Serializable`](../../../../../../load/serializable/classes/Serializable.md)

## Extended by

- [`GeneralRule`](GeneralRule.md)
- [`ArrayRule`](../../array/classes/ArrayRule.md)
- [`BooleanRule`](../../boolean/classes/BooleanRule.md)
- [`JSONObjectRule`](../../object/classes/JSONObjectRule.md)
- [`NumberRule`](../../number/classes/NumberRule.md)
- [`StringRule`](../../string/classes/StringRule.md)

## Type parameters

• **T** = `any`

The type of input data the rule will validate.

## Implements

- [`BaseRuleFields`](../interfaces/BaseRuleFields.md)\<`T`\>

## Constructors

### new BaseRule()

> **new BaseRule**\<`T`\>(`fields`): [`BaseRule`](BaseRule.md)\<`T`\>

Constructs a new instance of a rule with the specified fields.

#### Parameters

• **fields**: [`BaseRuleFields`](../interfaces/BaseRuleFields.md)\<`T`\>

#### Returns

[`BaseRule`](BaseRule.md)\<`T`\>

#### Overrides

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`constructor`](../../../../../../load/serializable/classes/Serializable.md#constructors)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:116](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L116)

## Properties

### \_isSerializable

> **\_isSerializable**: `boolean` = `false`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Overrides

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`_isSerializable`](../../../../../../load/serializable/classes/Serializable.md#_isserializable)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:57](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L57)

***

### \_kwargs

> **\_kwargs**: `SerializedFields`

Key-value pairs of properties to be serialized.

#### Inherited from

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`_kwargs`](../../../../../../load/serializable/classes/Serializable.md#_kwargs)

#### Source

[packages/core/src/load/serializable.ts:168](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L168)

***

### \_namespace

> **\_namespace**: `string`[]

Unique namespace identifier for the serialized object, represented as an array of strings.

#### Overrides

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`_namespace`](../../../../../../load/serializable/classes/Serializable.md#_namespace)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:59](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L59)

***

### description

> **description**: `string`

A human-readable description of what the rule checks or enforces.

#### Implementation of

[`BaseRuleFields`](../interfaces/BaseRuleFields.md) . [`description`](../interfaces/BaseRuleFields.md#description)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:70](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L70)

***

### metadata

> **metadata**: `undefined` \| [`RuleMetadata`](../type-aliases/RuleMetadata.md)

Optional track-back metadata of rules that are used for merging to the current rule.

#### Implementation of

[`BaseRuleFields`](../interfaces/BaseRuleFields.md) . [`metadata`](../interfaces/BaseRuleFields.md#metadata)

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:80](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L80)

***

### variables

> **variables**: `undefined` \| `Record`\<`string`, `unknown`\>

An optional set of variables that can be used within the rule's validation function.

#### Implementation of

[`BaseRuleFields`](../interfaces/BaseRuleFields.md) . [`variables`](../interfaces/BaseRuleFields.md#variables)

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

> `abstract` **\_ruleType**(): `string`

Abstract method to determine the rule's type.

#### Returns

`string`

The type of the rule as a string.

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:301](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L301)

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

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:447](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L447)

***

### concat()

> `abstract` **concat**\<`U`\>(`rule`, `conjunction`): [`BaseRule`](BaseRule.md)\<`T` \| `U`\>

Abstract method to concatenate two rules with a specified logical conjunction.

#### Type parameters

• **U**

The type of input data the other rule will validate.

#### Parameters

• **rule**: [`BaseRule`](BaseRule.md)\<`U`\>

The rule to concatenate with this rule.

• **conjunction**: `"and"` \| `"or"`

The type of logical conjunction ('and' | 'or').

#### Returns

[`BaseRule`](BaseRule.md)\<`T` \| `U`\>

A new `BaseRule` that represents the combination of this rule and the other rule.

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:292](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L292)

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

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`getAttributes`](../../../../../../load/serializable/classes/Serializable.md#getattributes)

#### Source

[packages/core/src/load/serializable.ts:430](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L430)

***

### getCleanDescription()

> **getCleanDescription**(): `string`

Cleans and formats the rule description by replacing variable placeholders with actual values.

#### Returns

`string`

A formatted description with variable values substituted.

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:212](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L212)

***

### serialize()

> **serialize**(): [`SerializedRule`](../../../../../../studio/serde/interfaces/SerializedRule.md)

Serializes the rule into a structured format for storage or transmission.

#### Returns

[`SerializedRule`](../../../../../../studio/serde/interfaces/SerializedRule.md)

A `SerializedRule` object containing the serialized state.

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:190](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L190)

***

### toCallableLambda()

> **toCallableLambda**(): [`CallableLambda`](../../../../../../record/callable/classes/CallableLambda.md)\<`T`, `boolean`\>

Converts the rule's validation function into a `CallableLambda`.

#### Returns

[`CallableLambda`](../../../../../../record/callable/classes/CallableLambda.md)\<`T`, `boolean`\>

A new `CallableLambda` based on the rule's validation function.

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

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`toJSON`](../../../../../../load/serializable/classes/Serializable.md#tojson)

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

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`toJSONConstructor`](../../../../../../load/serializable/classes/Serializable.md#tojsonconstructor)

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

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`toJSONNotImplemented`](../../../../../../load/serializable/classes/Serializable.md#tojsonnotimplemented)

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

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`toJSONSecret`](../../../../../../load/serializable/classes/Serializable.md#tojsonsecret)

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

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:364](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L364)

***

### \_name()

> `static` **\_name**(): `string`

Generates a unique name for the class, typically used for serialization identification.

#### Returns

`string`

#### Inherited from

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`_name`](../../../../../../load/serializable/classes/Serializable.md#_name)

#### Source

[packages/core/src/load/serializable.ts:178](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L178)

***

### deserialize()

> `static` **deserialize**(`serialized`, `values`): `Promise` \<[`BaseRule`](BaseRule.md)\<`any`\>\>

Deserializes a SerializedRule back into a BaseRule object (based on their rule types).
This function is essential for reconstructing rule instances from their serialized forms.

#### Parameters

• **serialized**: [`SerializedRule`](../../../../../../studio/serde/interfaces/SerializedRule.md)

A SerializedRule object containing the serialized data.

• **values**: `Record`\<`string`, `unknown`\>= `{}`

Variable values to the rules. If not provided, it will use the variable values in the serialized data.

#### Returns

`Promise` \<[`BaseRule`](BaseRule.md)\<`any`\>\>

A BaseRule object reconstructed from the serialized data.

#### Source

[packages/core/src/events/inference/validate/guardrails/base.ts:148](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/validate/guardrails/base.ts#L148)
