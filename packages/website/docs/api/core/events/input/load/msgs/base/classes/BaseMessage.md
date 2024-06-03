# Class: `abstract` BaseMessage

An abstract base class for messages, implementing the BaseMessageFields interface and extending Serializable for data persistence.
BaseMessage provides foundational attributes and methods for message handling, serving as a blueprint for more specific message types.

## Extends

- [`Serializable`](../../../../../../load/serializable/classes/Serializable.md)

## Extended by

- [`BotMessage`](../../bot/classes/BotMessage.md)
- [`HumanMessage`](../../human/classes/HumanMessage.md)
- [`SystemMessage`](../../system/classes/SystemMessage.md)
- [`FunctionMessage`](../../function/classes/FunctionMessage.md)
- [`ChatMessage`](../../chat/classes/ChatMessage.md)

## Implements

- [`BaseMessageFields`](../interfaces/BaseMessageFields.md)

## Constructors

### new BaseMessage()

> **new BaseMessage**(`fields`): [`BaseMessage`](BaseMessage.md)

Constructs a new instance of BaseMessage, initializing with the provided fields.

#### Parameters

• **fields**: `string` \| [`BaseMessageFields`](../interfaces/BaseMessageFields.md)

Either a string or an object conforming to BaseMessageFields to initialize the message content.

#### Returns

[`BaseMessage`](BaseMessage.md)

#### Overrides

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`constructor`](../../../../../../load/serializable/classes/Serializable.md#constructors)

#### Source

[packages/core/src/events/input/load/msgs/base.ts:117](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/msgs/base.ts#L117)

## Properties

### \_isSerializable

> **\_isSerializable**: `boolean` = `false`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Inherited from

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`_isSerializable`](../../../../../../load/serializable/classes/Serializable.md#_isserializable)

#### Source

[packages/core/src/load/serializable.ts:163](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L163)

***

### \_kwargs

> **\_kwargs**: `SerializedFields`

Key-value pairs of properties to be serialized.

#### Inherited from

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`_kwargs`](../../../../../../load/serializable/classes/Serializable.md#_kwargs)

#### Source

[packages/core/src/load/serializable.ts:168](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L168)

***

### \_namespace

> **\_namespace**: `string`[]

Unique namespace identifier for the serialized object, represented as an array of strings.

#### Overrides

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`_namespace`](../../../../../../load/serializable/classes/Serializable.md#_namespace)

#### Source

[packages/core/src/events/input/load/msgs/base.ts:88](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/msgs/base.ts#L88)

***

### additionalKwargs?

> `optional` **additionalKwargs**: `object`

Optional additional keyword arguments that provide extended functionality and flexibility
in handling the message. These might include additional data fields not covered by the standard properties.

#### Index signature

 \[`key`: `string`\]: `unknown`

#### Implementation of

[`BaseMessageFields`](../interfaces/BaseMessageFields.md) . [`additionalKwargs`](../interfaces/BaseMessageFields.md#additionalkwargs)

#### Source

[packages/core/src/events/input/load/msgs/base.ts:105](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/msgs/base.ts#L105)

***

### content

> **content**: [`ContentLike`](../type-aliases/ContentLike.md) \| [`ContentLike`](../type-aliases/ContentLike.md)[]

The main content of the message. It can be a string or a more complex structure
represented by an object with key-value pairs.

#### Implementation of

[`BaseMessageFields`](../interfaces/BaseMessageFields.md) . [`content`](../interfaces/BaseMessageFields.md#content)

#### Source

[packages/core/src/events/input/load/msgs/base.ts:94](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/msgs/base.ts#L94)

***

### name?

> `optional` **name**: `string`

An optional name for the message, which could be used for identifying or categorizing the message.

#### Implementation of

[`BaseMessageFields`](../interfaces/BaseMessageFields.md) . [`name`](../interfaces/BaseMessageFields.md#name)

#### Source

[packages/core/src/events/input/load/msgs/base.ts:99](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/msgs/base.ts#L99)

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

## Methods

### \_role()

> `abstract` **\_role**(): [`MessageRole`](../type-aliases/MessageRole.md)

Abstract method to define the role of the message, which must be implemented by derived classes.

#### Returns

[`MessageRole`](../type-aliases/MessageRole.md)

The role of the message as a string.

#### Source

[packages/core/src/events/input/load/msgs/base.ts:111](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/msgs/base.ts#L111)

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

#### Source

[packages/core/src/events/input/load/msgs/base.ts:151](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/msgs/base.ts#L151)

***

### concat()

> `abstract` **concat**(`message`): [`BaseMessage`](BaseMessage.md)

Abstract method to concatenate this message with another message, producing a new BaseMessage instance.

#### Parameters

• **message**: [`BaseMessage`](BaseMessage.md)

The message to concatenate with this instance.

#### Returns

[`BaseMessage`](BaseMessage.md)

A new instance of BaseMessage resulting from the concatenation.

#### Source

[packages/core/src/events/input/load/msgs/base.ts:176](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/msgs/base.ts#L176)

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

[packages/core/src/load/serializable.ts:430](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L430)

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

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`toJSONConstructor`](../../../../../../load/serializable/classes/Serializable.md#tojsonconstructor)

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

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`toJSONNotImplemented`](../../../../../../load/serializable/classes/Serializable.md#tojsonnotimplemented)

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

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`toJSONSecret`](../../../../../../load/serializable/classes/Serializable.md#tojsonsecret)

#### Source

[packages/core/src/load/serializable.ts:462](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L462)

***

### toSerialized()

> **toSerialized**(): [`SerializedMessage`](../../../../../output/provide/message/interfaces/SerializedMessage.md)

Serializes the message to a structured format that includes the role and the JSON-converted content.

#### Returns

[`SerializedMessage`](../../../../../output/provide/message/interfaces/SerializedMessage.md)

An object representing the serialized state of the message.

#### Source

[packages/core/src/events/input/load/msgs/base.ts:132](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/msgs/base.ts#L132)

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

#### Source

[packages/core/src/events/input/load/msgs/base.ts:232](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/msgs/base.ts#L232)

***

### \_mergeContent()

`Internal`

> `static` **\_mergeContent**(`left`, `right`): `NonNullable` \<[`ContentLike`](../type-aliases/ContentLike.md) \| [`ContentLike`](../type-aliases/ContentLike.md)[]\>

Internal method for merging two message conents.

#### Parameters

• **left**: `NonNullable` \<[`ContentLike`](../type-aliases/ContentLike.md) \| [`ContentLike`](../type-aliases/ContentLike.md)[]\>

left message content.

• **right**: `NonNullable` \<[`ContentLike`](../type-aliases/ContentLike.md) \| [`ContentLike`](../type-aliases/ContentLike.md)[]\>

right message content.

#### Returns

`NonNullable` \<[`ContentLike`](../type-aliases/ContentLike.md) \| [`ContentLike`](../type-aliases/ContentLike.md)[]\>

merged message content.

#### Source

[packages/core/src/events/input/load/msgs/base.ts:186](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/msgs/base.ts#L186)

***

### \_name()

> `static` **\_name**(): `string`

Generates a unique name for the class, typically used for serialization identification.

#### Returns

`string`

#### Inherited from

[`Serializable`](../../../../../../load/serializable/classes/Serializable.md) . [`_name`](../../../../../../load/serializable/classes/Serializable.md#_name)

#### Source

[packages/core/src/load/serializable.ts:178](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L178)

***

### isEqualMessage()

> `static` **isEqualMessage**(`message1`, `message2`): `boolean`

Check if two messages are strictly equal.

#### Parameters

• **message1**: [`BaseMessage`](BaseMessage.md)

message object.

• **message2**: [`BaseMessage`](BaseMessage.md)

message object.

#### Returns

`boolean`

true if strictly equal.

#### Source

[packages/core/src/events/input/load/msgs/base.ts:275](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/msgs/base.ts#L275)

***

### isEqualMessageArray()

> `static` **isEqualMessageArray**(`messageArray1`, `messageArray2`): `boolean`

Check if two message arrays are strictly equal.

#### Parameters

• **messageArray1**: [`BaseMessage`](BaseMessage.md)[]

message object array.

• **messageArray2**: [`BaseMessage`](BaseMessage.md)[]

message object array.

#### Returns

`boolean`

true if strictly equal.

#### Source

[packages/core/src/events/input/load/msgs/base.ts:286](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/msgs/base.ts#L286)
