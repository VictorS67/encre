# Class: BaseRuleCollection

A collection of rules that can be evaluated together. This provides functionality
to validate a set of inputs against the rules defined in the collection.

## Extends

- [`Serializable`](../../../../../../load/serializable/classes/Serializable.md)

## Implements

- [`BaseRuleCollectionField`](../interfaces/BaseRuleCollectionField.md)

## Constructors

### new BaseRuleCollection()

> **new BaseRuleCollection**(`fields`): [`BaseRuleCollection`](BaseRuleCollection.md)

Initializes a new instance of BaseRuleCollection with the specified rules
and conjunction.

#### Parameters

• **fields**: [`BaseRuleCollectionField`](../interfaces/BaseRuleCollectionField.md)

The fields required to initialize the rule collection.

#### Returns

[`BaseRuleCollection`](BaseRuleCollection.md)

#### Overrides

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`constructor`](../../../../../../load/serializable/classes/Serializable.md#constructors)

#### Source

[packages/core/src/events/input/load/rules/base.ts:54](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/rules/base.ts#L54)

## Properties

### \_isSerializable

> **\_isSerializable**: `boolean` = `true`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Overrides

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`_isSerializable`](../../../../../../load/serializable/classes/Serializable.md#_isserializable)

#### Source

[packages/core/src/events/input/load/rules/base.ts:33](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/rules/base.ts#L33)

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

[packages/core/src/events/input/load/rules/base.ts:35](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/rules/base.ts#L35)

***

### collection

> **collection**: `Record`\<`string`, [`BaseRule`](../../../../../inference/validate/guardrails/base/classes/BaseRule.md)\<`any`\> \| [`BaseRuleCollection`](BaseRuleCollection.md)\>

A collection of rules, each identified by a string key. The value can be
either a BaseRule or another BaseRuleCollection.

#### Implementation of

[`BaseRuleCollectionField`](../interfaces/BaseRuleCollectionField.md) . [`collection`](../interfaces/BaseRuleCollectionField.md#collection)

#### Source

[packages/core/src/events/input/load/rules/base.ts:41](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/rules/base.ts#L41)

***

### conjunction

> **conjunction**: `"and"` \| `"or"`

The logical conjunction used to evaluate the rules. Default is "and".
Possible values are 'and' or 'or'.

#### Implementation of

[`BaseRuleCollectionField`](../interfaces/BaseRuleCollectionField.md) . [`conjunction`](../interfaces/BaseRuleCollectionField.md#conjunction)

#### Source

[packages/core/src/events/input/load/rules/base.ts:47](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/rules/base.ts#L47)

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

### description

> `get` **description**(): `string`

Provides a human-readable description of the rule collection, detailing the
rules and their logical relationship.

#### Returns

`string`

#### Source

[packages/core/src/events/input/load/rules/base.ts:65](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/rules/base.ts#L65)

## Methods

### \_getOutermostConjunction()

`Internal`

> `protected` **\_getOutermostConjunction**(`description`): `string`

Extracts the outermost logical conjunction ('AND' or 'OR') from a rule description.
This method analyzes the rule description to determine the highest-level logical operator
governing its logic.

#### Parameters

• **description**: `string`

The rule description to analyze.

#### Returns

`string`

The outermost logical conjunction ('AND' or 'OR').

#### Throws

Throws if the description does not contain a clear outermost conjunction.

#### Source

[packages/core/src/events/input/load/rules/base.ts:326](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/rules/base.ts#L326)

***

### \_isCompositeRule()

`Internal`

> `protected` **\_isCompositeRule**(`description`): `boolean`

Determines whether a given description represents a composite rule.
This method checks if the description includes logical operators such as 'AND' or 'OR',
indicating a composite of multiple rules.

#### Parameters

• **description**: `string`

The rule description to check.

#### Returns

`boolean`

True if the description includes composite rule indicators, false otherwise.

#### Source

[packages/core/src/events/input/load/rules/base.ts:313](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/rules/base.ts#L313)

***

### \_isIdenticalKeySet()

> `protected` **\_isIdenticalKeySet**(`keyset1`, `keyset2`): `boolean`

#### Parameters

• **keyset1**: `string`[]

• **keyset2**: `string`[]

#### Returns

`boolean`

#### Source

[packages/core/src/events/input/load/rules/base.ts:288](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/rules/base.ts#L288)

***

### \_isInvertLogic()

`Internal`

> `protected` **\_isInvertLogic**(`description`, `conjunction`): `boolean`

Checks if the logic of a rule description is inverted relative to a given conjunction.
This method is used to determine if the description's logic needs to be presented 
differently based on the specified conjunction.

#### Parameters

• **description**: `string`

The description of the rule.

• **conjunction**: `"and"` \| `"or"`

The conjunction to compare against.

#### Returns

`boolean`

True if the rule's logic is inverted relative to the conjunction, false otherwise.

#### Source

[packages/core/src/events/input/load/rules/base.ts:385](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/rules/base.ts#L385)

***

### \_validate()

`Internal`

> `protected` **\_validate**(`subject`, `rule`, `recordHistory`, `input`, `variables`?): `Promise`\<`boolean`\>

Validates a specific input against a specific rule within the rule collection.
This protected method is used internally by the `validate` method to apply individual
rules  to corresponding parts of the input data.

#### Parameters

• **subject**: `string`

The key representing the specific part of input data to validate.

• **rule**: [`BaseRule`](../../../../../inference/validate/guardrails/base/classes/BaseRule.md)\<`any`\> \| [`BaseRuleCollection`](BaseRuleCollection.md)

The rule or rule collection to apply.

• **recordHistory**: `Set`\<`RecordId`\>

A set of record IDs to track rule application and prevent recursion.

• **input**

The entire input data.

• **variables?**

Optional additional variables needed for validation.

#### Returns

`Promise`\<`boolean`\>

The result of the validation for the specific input part.

#### Source

[packages/core/src/events/input/load/rules/base.ts:242](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/rules/base.ts#L242)

***

### concat()

> **concat**(`ruleCollection`, `conjunction`): [`BaseRuleCollection`](BaseRuleCollection.md)

Combines two rule collections into a new rule collection with a specified conjunction.

#### Parameters

• **ruleCollection**: [`BaseRuleCollection`](BaseRuleCollection.md)

Another rule collection to combine with this one.

• **conjunction**: `"and"` \| `"or"`

The conjunction to use for the new combined rule collection.

#### Returns

[`BaseRuleCollection`](BaseRuleCollection.md)

The new combined rule collection.

#### Source

[packages/core/src/events/input/load/rules/base.ts:217](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/rules/base.ts#L217)

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

Generates a simplified description of the rule collection without any special formatting.
This method provides a clean, readable description of each rule's logic without including
XML-like tags or additional decorators used in more complex descriptions.

#### Returns

`string`

A simplified string representation of the rule collection's logic.

#### Source

[packages/core/src/events/input/load/rules/base.ts:155](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/rules/base.ts#L155)

***

### serialize()

> **serialize**(): [`SerializedRuleCollection`](../../../../../../studio/serde/interfaces/SerializedRuleCollection.md)

Serializes the current state of the rule collection to a format suitable for storage or transmission.
This method facilitates the conversion of the rule collection into a simplified JSON format,
capturing essential properties like description, collection, and conjunction.

#### Returns

[`SerializedRuleCollection`](../../../../../../studio/serde/interfaces/SerializedRuleCollection.md)

The serialized form of the rule collection.

#### Source

[packages/core/src/events/input/load/rules/base.ts:135](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/rules/base.ts#L135)

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

Validates the provided inputs against the rules in the collection.

#### Parameters

• **input**

Inputs to validate.

• **variables?**

Optional variables for rule validation.

#### Returns

`Promise`\<`boolean`\>

The result of the validation.

#### Source

[packages/core/src/events/input/load/rules/base.ts:178](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/rules/base.ts#L178)

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

> `static` **deserialize**(`serialized`, `values`): `Promise` \<[`BaseRuleCollection`](BaseRuleCollection.md)\>

Deserializes a given serialized rule collection into an instance of BaseRuleCollection.

#### Parameters

• **serialized**: [`SerializedRuleCollection`](../../../../../../studio/serde/interfaces/SerializedRuleCollection.md)

The serialized rule collection.

• **values**: `Record`\<`string`, `unknown`\>= `{}`

Optional additional values for rule deserialization.

#### Returns

`Promise` \<[`BaseRuleCollection`](BaseRuleCollection.md)\>

The deserialized rule collection.

#### Source

[packages/core/src/events/input/load/rules/base.ts:92](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/rules/base.ts#L92)
