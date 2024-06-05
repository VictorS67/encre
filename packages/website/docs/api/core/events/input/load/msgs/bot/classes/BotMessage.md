# Class: BotMessage

Class that stores the Bot message in a conversation.

## Extends

- [`BaseMessage`](../../base/classes/BaseMessage.md)

## Constructors

### new BotMessage()

> **new BotMessage**(`fields`): [`BotMessage`](BotMessage.md)

Constructs a new instance of BaseMessage, initializing with the provided fields.

#### Parameters

• **fields**: `string` \| [`BaseMessageFields`](../../base/interfaces/BaseMessageFields.md)

Either a string or an object conforming to BaseMessageFields to initialize the message content.

#### Returns

[`BotMessage`](BotMessage.md)

#### Inherited from

[`BaseMessage`](../../base/classes/BaseMessage.md) . [`constructor`](../../base/classes/BaseMessage.md#constructors)

#### Source

[packages/core/src/events/input/load/msgs/base.ts:117](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/msgs/base.ts#L117)

## Properties

### \_isSerializable

> **\_isSerializable**: `boolean` = `true`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Overrides

[`BaseMessage`](../../base/classes/BaseMessage.md) . [`_isSerializable`](../../base/classes/BaseMessage.md#_isserializable)

#### Source

[packages/core/src/events/input/load/msgs/bot.ts:7](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/msgs/bot.ts#L7)

***

### \_kwargs

> **\_kwargs**: `SerializedFields`

Key-value pairs of properties to be serialized.

#### Inherited from

[`BaseMessage`](../../base/classes/BaseMessage.md) . [`_kwargs`](../../base/classes/BaseMessage.md#_kwargs)

#### Source

[packages/core/src/load/serializable.ts:168](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L168)

***

### \_namespace

> **\_namespace**: `string`[]

Unique namespace identifier for the serialized object, represented as an array of strings.

#### Inherited from

[`BaseMessage`](../../base/classes/BaseMessage.md) . [`_namespace`](../../base/classes/BaseMessage.md#_namespace)

#### Source

[packages/core/src/events/input/load/msgs/base.ts:88](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/msgs/base.ts#L88)

***

### additionalKwargs?

> `optional` **additionalKwargs**: `object`

Optional additional keyword arguments that provide extended functionality and flexibility
in handling the message. These might include additional data fields not covered by the standard properties.

#### Index signature

 \[`key`: `string`\]: `unknown`

#### Inherited from

[`BaseMessage`](../../base/classes/BaseMessage.md) . [`additionalKwargs`](../../base/classes/BaseMessage.md#additionalkwargs)

#### Source

[packages/core/src/events/input/load/msgs/base.ts:105](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/msgs/base.ts#L105)

***

### content

> **content**: [`ContentLike`](../../base/type-aliases/ContentLike.md) \| [`ContentLike`](../../base/type-aliases/ContentLike.md)[]

The main content of the message. It can be a string or a more complex structure
represented by an object with key-value pairs.

#### Inherited from

[`BaseMessage`](../../base/classes/BaseMessage.md) . [`content`](../../base/classes/BaseMessage.md#content)

#### Source

[packages/core/src/events/input/load/msgs/base.ts:94](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/msgs/base.ts#L94)

***

### name?

> `optional` **name**: `string`

An optional name for the message, which could be used for identifying or categorizing the message.

#### Inherited from

[`BaseMessage`](../../base/classes/BaseMessage.md) . [`name`](../../base/classes/BaseMessage.md#name)

#### Source

[packages/core/src/events/input/load/msgs/base.ts:99](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/msgs/base.ts#L99)

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

### \_role()

> **\_role**(): [`MessageRole`](../../base/type-aliases/MessageRole.md)

Abstract method to define the role of the message, which must be implemented by derived classes.

#### Returns

[`MessageRole`](../../base/type-aliases/MessageRole.md)

The role of the message as a string.

#### Overrides

[`BaseMessage`](../../base/classes/BaseMessage.md) . [`_role`](../../base/classes/BaseMessage.md#_role)

#### Source

[packages/core/src/events/input/load/msgs/bot.ts:9](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/msgs/bot.ts#L9)

***

### coerceToBoolean()

> **coerceToBoolean**(): `undefined` \| `boolean`

Coerce the message content to boolean.

Usecases if the message content is coerceable:
- if content equals to either "true" or "false", return corresponding boolean;
- `true` if content length larger than 0, otherwise return `false`;
- `true` if content is not string type;
- if content is array, return `true` if all entries follows the previous three usecases, otherwise return `false`.

#### Returns

`undefined` \| `boolean`

boolean if coerceable, otherwise return undefined.

#### Inherited from

[`BaseMessage`](../../base/classes/BaseMessage.md) . [`coerceToBoolean`](../../base/classes/BaseMessage.md#coercetoboolean)

#### Source

[packages/core/src/events/input/load/msgs/base.ts:151](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/msgs/base.ts#L151)

***

### concat()

> **concat**(`message`): [`BotMessage`](BotMessage.md)

Abstract method to concatenate this message with another message, producing a new BaseMessage instance.

#### Parameters

• **message**: [`BotMessage`](BotMessage.md)

The message to concatenate with this instance.

#### Returns

[`BotMessage`](BotMessage.md)

A new instance of BaseMessage resulting from the concatenation.

#### Overrides

[`BaseMessage`](../../base/classes/BaseMessage.md) . [`concat`](../../base/classes/BaseMessage.md#concat)

#### Source

[packages/core/src/events/input/load/msgs/bot.ts:17](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/msgs/bot.ts#L17)

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

[`BaseMessage`](../../base/classes/BaseMessage.md) . [`getAttributes`](../../base/classes/BaseMessage.md#getattributes)

#### Source

[packages/core/src/load/serializable.ts:430](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L430)

***

### toJSON()

> **toJSON**(): [`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized representation based on the object's current state. This method determines whether to use a 'not implemented' or 'constructor' format based on the object's serializability.

#### Returns

[`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`BaseMessage`](../../base/classes/BaseMessage.md) . [`toJSON`](../../base/classes/BaseMessage.md#tojson)

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

[`BaseMessage`](../../base/classes/BaseMessage.md) . [`toJSONConstructor`](../../base/classes/BaseMessage.md#tojsonconstructor)

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

[`BaseMessage`](../../base/classes/BaseMessage.md) . [`toJSONNotImplemented`](../../base/classes/BaseMessage.md#tojsonnotimplemented)

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

[`BaseMessage`](../../base/classes/BaseMessage.md) . [`toJSONSecret`](../../base/classes/BaseMessage.md#tojsonsecret)

#### Source

[packages/core/src/load/serializable.ts:462](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L462)

***

### toSerialized()

> **toSerialized**(): [`SerializedMessage`](../../../../../output/provide/message/interfaces/SerializedMessage.md)

Serializes the message to a structured format that includes the role and the JSON-converted content.

#### Returns

[`SerializedMessage`](../../../../../output/provide/message/interfaces/SerializedMessage.md)

An object representing the serialized state of the message.

#### Inherited from

[`BaseMessage`](../../base/classes/BaseMessage.md) . [`toSerialized`](../../base/classes/BaseMessage.md#toserialized)

#### Source

[packages/core/src/events/input/load/msgs/base.ts:132](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/msgs/base.ts#L132)

***

### \_mergeAdditionalKwargs()

`Internal`

> `static` **\_mergeAdditionalKwargs**(`left`, `right`): `object`

Internal method for merging two additional keyword arguments.

#### Parameters

• **left**

left additional keyword arguments.

• **right**

right additional keyword arguments.

#### Returns

`object`

merged additional keyword arguments.

#### Inherited from

[`BaseMessage`](../../base/classes/BaseMessage.md) . [`_mergeAdditionalKwargs`](../../base/classes/BaseMessage.md#_mergeadditionalkwargs)

#### Source

[packages/core/src/events/input/load/msgs/base.ts:232](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/msgs/base.ts#L232)

***

### \_mergeContent()

`Internal`

> `static` **\_mergeContent**(`left`, `right`): `NonNullable` \<[`ContentLike`](../../base/type-aliases/ContentLike.md) \| [`ContentLike`](../../base/type-aliases/ContentLike.md)[]\>

Internal method for merging two message conents.

#### Parameters

• **left**: `NonNullable` \<[`ContentLike`](../../base/type-aliases/ContentLike.md) \| [`ContentLike`](../../base/type-aliases/ContentLike.md)[]\>

left message content.

• **right**: `NonNullable` \<[`ContentLike`](../../base/type-aliases/ContentLike.md) \| [`ContentLike`](../../base/type-aliases/ContentLike.md)[]\>

right message content.

#### Returns

`NonNullable` \<[`ContentLike`](../../base/type-aliases/ContentLike.md) \| [`ContentLike`](../../base/type-aliases/ContentLike.md)[]\>

merged message content.

#### Inherited from

[`BaseMessage`](../../base/classes/BaseMessage.md) . [`_mergeContent`](../../base/classes/BaseMessage.md#_mergecontent)

#### Source

[packages/core/src/events/input/load/msgs/base.ts:186](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/msgs/base.ts#L186)

***

### \_name()

> `static` **\_name**(): `string`

Generates a unique name for the class, typically used for serialization identification.

#### Returns

`string`

#### Overrides

[`BaseMessage`](../../base/classes/BaseMessage.md) . [`_name`](../../base/classes/BaseMessage.md#_name)

#### Source

[packages/core/src/events/input/load/msgs/bot.ts:13](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/msgs/bot.ts#L13)

***

### isEqualMessage()

> `static` **isEqualMessage**(`message1`, `message2`): `boolean`

Check if two messages are strictly equal.

#### Parameters

• **message1**: [`BaseMessage`](../../base/classes/BaseMessage.md)

message object.

• **message2**: [`BaseMessage`](../../base/classes/BaseMessage.md)

message object.

#### Returns

`boolean`

true if strictly equal.

#### Inherited from

[`BaseMessage`](../../base/classes/BaseMessage.md) . [`isEqualMessage`](../../base/classes/BaseMessage.md#isequalmessage)

#### Source

[packages/core/src/events/input/load/msgs/base.ts:275](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/msgs/base.ts#L275)

***

### isEqualMessageArray()

> `static` **isEqualMessageArray**(`messageArray1`, `messageArray2`): `boolean`

Check if two message arrays are strictly equal.

#### Parameters

• **messageArray1**: [`BaseMessage`](../../base/classes/BaseMessage.md)[]

message object array.

• **messageArray2**: [`BaseMessage`](../../base/classes/BaseMessage.md)[]

message object array.

#### Returns

`boolean`

true if strictly equal.

#### Inherited from

[`BaseMessage`](../../base/classes/BaseMessage.md) . [`isEqualMessageArray`](../../base/classes/BaseMessage.md#isequalmessagearray)

#### Source

[packages/core/src/events/input/load/msgs/base.ts:286](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/msgs/base.ts#L286)
