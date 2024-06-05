# Class: `abstract` BasePrompt

Abstract base class representing a generic prompt. This class must be extended to provide specific types of prompts.
The class is serializable and defines the namespace and type of the prompt.

## Extends

- [`Serializable`](../../../../../../load/serializable/classes/Serializable.md)

## Extended by

- [`StringPrompt`](../../text/classes/StringPrompt.md)
- [`ChatPrompt`](../../chat/classes/ChatPrompt.md)

## Constructors

### new BasePrompt()

> **new BasePrompt**(`kwargs`?, ...`_args`?): [`BasePrompt`](BasePrompt.md)

Initializes a new instance of the `Serializable` class.

#### Parameters

• **kwargs?**: `object`

Optional parameters for initializing the serializable properties.

• ...**\_args?**: `never`[]

Additional parameters that are never used, demonstrating variable argument handling in constructors.

#### Returns

[`BasePrompt`](BasePrompt.md)

#### Inherited from

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`constructor`](../../../../../../load/serializable/classes/Serializable.md#constructors)

#### Source

[packages/core/src/load/serializable.ts:233](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L233)

## Properties

### \_isSerializable

> **\_isSerializable**: `boolean` = `false`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Overrides

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`_isSerializable`](../../../../../../load/serializable/classes/Serializable.md#_isserializable)

#### Source

[packages/core/src/events/input/load/prompts/base.ts:16](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/prompts/base.ts#L16)

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

[packages/core/src/events/input/load/prompts/base.ts:18](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/prompts/base.ts#L18)

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

> `abstract` **\_promptType**(): `string`

Abstract method to return the specific type of prompt.

#### Returns

`string`

The prompt type as a string.

#### Source

[packages/core/src/events/input/load/prompts/base.ts:30](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/prompts/base.ts#L30)

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

### toChatMessages()

> `abstract` **toChatMessages**(): [`BaseMessage`](../../../msgs/base/classes/BaseMessage.md)[]

Converts the prompt to an array of chat messages.

#### Returns

[`BaseMessage`](../../../msgs/base/classes/BaseMessage.md)[]

An array of BaseMessage instances representing the prompt in chat form.

#### Source

[packages/core/src/events/input/load/prompts/base.ts:42](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/prompts/base.ts#L42)

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

### toString()

> `abstract` **toString**(): `string`

Converts the prompt to a string representation.

#### Returns

`string`

A string representing the prompt.

#### Source

[packages/core/src/events/input/load/prompts/base.ts:36](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/prompts/base.ts#L36)

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
