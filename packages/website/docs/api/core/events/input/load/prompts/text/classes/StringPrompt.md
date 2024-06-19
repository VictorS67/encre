# Class: StringPrompt

A concrete implementation of BasePrompt for text-based prompts. This class stores a string value
and provides methods to output this value as a string or a chat message.

## Extends

- [`BasePrompt`](../../base/classes/BasePrompt.md)

## Constructors

### new StringPrompt()

> **new StringPrompt**(`value`, ...`args`): [`StringPrompt`](StringPrompt.md)

Constructs a new StringPrompt instance.

#### Parameters

• **value**: `string`

The string value of the prompt.

• ...**args**: `any`[]

#### Returns

[`StringPrompt`](StringPrompt.md)

#### Overrides

[`BasePrompt`](../../base/classes/BasePrompt.md) . [`constructor`](../../base/classes/BasePrompt.md#constructors)

#### Source

[packages/core/src/events/input/load/prompts/text.ts:30](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/prompts/text.ts#L30)

## Properties

### \_isSerializable

> **\_isSerializable**: `boolean` = `true`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Overrides

[`BasePrompt`](../../base/classes/BasePrompt.md) . [`_isSerializable`](../../base/classes/BasePrompt.md#_isserializable)

#### Source

[packages/core/src/events/input/load/prompts/text.ts:15](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/prompts/text.ts#L15)

***

### \_kwargs

> **\_kwargs**: `SerializedFields`

Key-value pairs of properties to be serialized.

#### Inherited from

[`BasePrompt`](../../base/classes/BasePrompt.md) . [`_kwargs`](../../base/classes/BasePrompt.md#_kwargs)

#### Source

[packages/core/src/load/serializable.ts:168](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L168)

***

### \_namespace

> **\_namespace**: `string`[]

Unique namespace identifier for the serialized object, represented as an array of strings.

#### Inherited from

[`BasePrompt`](../../base/classes/BasePrompt.md) . [`_namespace`](../../base/classes/BasePrompt.md#_namespace)

#### Source

[packages/core/src/events/input/load/prompts/base.ts:18](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/prompts/base.ts#L18)

***

### value

> **value**: `string`

The textual value of the prompt.

#### Source

[packages/core/src/events/input/load/prompts/text.ts:24](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/prompts/text.ts#L24)

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

## Methods

### \_promptType()

> **\_promptType**(): `string`

Abstract method to return the specific type of prompt.

#### Returns

`string`

The prompt type as a string.

#### Overrides

[`BasePrompt`](../../base/classes/BasePrompt.md) . [`_promptType`](../../base/classes/BasePrompt.md#_prompttype)

#### Source

[packages/core/src/events/input/load/prompts/text.ts:35](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/prompts/text.ts#L35)

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

[`BasePrompt`](../../base/classes/BasePrompt.md) . [`getAttributes`](../../base/classes/BasePrompt.md#getattributes)

#### Source

[packages/core/src/load/serializable.ts:430](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L430)

***

### toChatMessages()

> **toChatMessages**(): [`BaseMessage`](../../../msgs/base/classes/BaseMessage.md)[]

Converts this prompt into an array of chat messages.

#### Returns

[`BaseMessage`](../../../msgs/base/classes/BaseMessage.md)[]

An array containing a single HumanMessage with the prompt's value.

#### Overrides

[`BasePrompt`](../../base/classes/BasePrompt.md) . [`toChatMessages`](../../base/classes/BasePrompt.md#tochatmessages)

#### Source

[packages/core/src/events/input/load/prompts/text.ts:51](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/prompts/text.ts#L51)

***

### toJSON()

> **toJSON**(): [`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized representation based on the object's current state. This method determines whether to use a 'not implemented' or 'constructor' format based on the object's serializability.

#### Returns

[`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`BasePrompt`](../../base/classes/BasePrompt.md) . [`toJSON`](../../base/classes/BasePrompt.md#tojson)

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

[`BasePrompt`](../../base/classes/BasePrompt.md) . [`toJSONConstructor`](../../base/classes/BasePrompt.md#tojsonconstructor)

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

[`BasePrompt`](../../base/classes/BasePrompt.md) . [`toJSONNotImplemented`](../../base/classes/BasePrompt.md#tojsonnotimplemented)

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

[`BasePrompt`](../../base/classes/BasePrompt.md) . [`toJSONSecret`](../../base/classes/BasePrompt.md#tojsonsecret)

#### Source

[packages/core/src/load/serializable.ts:462](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L462)

***

### toString()

> **toString**(): `string`

Returns the string value of the prompt.

#### Returns

`string`

The string value.

#### Overrides

[`BasePrompt`](../../base/classes/BasePrompt.md) . [`toString`](../../base/classes/BasePrompt.md#tostring)

#### Source

[packages/core/src/events/input/load/prompts/text.ts:43](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/prompts/text.ts#L43)

***

### \_name()

> `static` **\_name**(): `string`

Generates a unique name for the class, typically used for serialization identification.

#### Returns

`string`

#### Overrides

[`BasePrompt`](../../base/classes/BasePrompt.md) . [`_name`](../../base/classes/BasePrompt.md#_name)

#### Source

[packages/core/src/events/input/load/prompts/text.ts:17](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/prompts/text.ts#L17)
