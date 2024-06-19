# Class: `abstract` BufferLoader\<CallInput\>

An abstract class that extends `BaseLoader` to specifically handle the loading of documents from buffers.
This class is designed to facilitate the reading of file contents or blob data, parse them, and convert them into a structured format (`Context` objects).
Implementations need to define the `parse` method to specify how the buffer is processed.

## Extends

- [`BaseLoader`](../../base/classes/BaseLoader.md)\<`CallInput`\>

## Extended by

- [`PDFLoader`](../../pdf/classes/PDFLoader.md)

## Type parameters

• **CallInput** *extends* `string` \| `Blob` = `string` \| `Blob`

The type of input this loader accepts, either a file path (`string`) or a blob (`Blob`).

## Constructors

### new BufferLoader()

> **new BufferLoader**\<`CallInput`\>(`fields`?): [`BufferLoader`](BufferLoader.md)\<`CallInput`\>

#### Parameters

• **fields?**: [`BaseLoaderParams`](../../base/interfaces/BaseLoaderParams.md)

#### Returns

[`BufferLoader`](BufferLoader.md)\<`CallInput`\>

#### Inherited from

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`constructor`](../../base/classes/BaseLoader.md#constructors)

#### Source

[packages/core/src/events/input/load/docs/base.ts:71](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/docs/base.ts#L71)

## Properties

### \_isCallable

> **\_isCallable**: `boolean` = `true`

Indicates if the instance is callable. If false, then the callable cannot be invoked.

#### Inherited from

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`_isCallable`](../../base/classes/BaseLoader.md#_iscallable)

#### Source

[packages/core/src/record/callable.ts:188](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L188)

***

### \_isSerializable

> **\_isSerializable**: `boolean` = `true`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Overrides

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`_isSerializable`](../../base/classes/BaseLoader.md#_isserializable)

#### Source

[packages/core/src/events/input/load/docs/buffer.ts:16](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/docs/buffer.ts#L16)

***

### \_kwargs

> **\_kwargs**: `SerializedFields`

Key-value pairs of properties to be serialized.

#### Inherited from

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`_kwargs`](../../base/classes/BaseLoader.md#_kwargs)

#### Source

[packages/core/src/load/serializable.ts:168](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L168)

***

### \_namespace

> **\_namespace**: `string`[]

Unique namespace identifier for the serialized object, represented as an array of strings.

#### Inherited from

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`_namespace`](../../base/classes/BaseLoader.md#_namespace)

#### Source

[packages/core/src/events/base.ts:44](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L44)

***

### callbacks?

`Experimental`

> `optional` **callbacks**: `any`

not-implemented yet

#### Inherited from

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`callbacks`](../../base/classes/BaseLoader.md#callbacks)

#### Source

[packages/core/src/events/base.ts:79](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L79)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Inherited from

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`metadata`](../../base/classes/BaseLoader.md#metadata)

#### Source

[packages/core/src/events/base.ts:74](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L74)

***

### name?

`Experimental`

> `optional` **name**: `string`

The name of the callable, used for identification or logging.

not-implement yet

#### Inherited from

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`name`](../../base/classes/BaseLoader.md#name)

#### Source

[packages/core/src/events/base.ts:61](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L61)

***

### shouldSplit?

> `optional` **shouldSplit**: `boolean`

Whether the loader should split the output into chunks.

#### Inherited from

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`shouldSplit`](../../base/classes/BaseLoader.md#shouldsplit)

#### Source

[packages/core/src/events/input/load/docs/base.ts:69](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/docs/base.ts#L69)

***

### tags?

`Experimental`

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables.

not-implement yet

#### Inherited from

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`tags`](../../base/classes/BaseLoader.md#tags)

#### Source

[packages/core/src/events/base.ts:69](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L69)

***

### verbose

`Experimental`

> **verbose**: `boolean`

Specifies whether the event should provide verbose output, such as detailed logs or response texts.
This can be useful for debugging or detailed monitoring of event handling processes.

not-implement yet

#### Inherited from

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`verbose`](../../base/classes/BaseLoader.md#verbose)

#### Source

[packages/core/src/events/base.ts:53](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L53)

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

[packages/core/src/events/base.ts:81](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L81)

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

### \_docType()

> **\_docType**(): `string`

Defines the document type that this loader handles.

#### Returns

`string`

A string representing the document type.

#### Overrides

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`_docType`](../../base/classes/BaseLoader.md#_doctype)

#### Source

[packages/core/src/events/input/load/docs/buffer.ts:22](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/docs/buffer.ts#L22)

***

### \_eventNamespace()

> **\_eventNamespace**(): `string`[]

#### Returns

`string`[]

#### Inherited from

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`_eventNamespace`](../../base/classes/BaseLoader.md#_eventnamespace)

#### Source

[packages/core/src/events/input/load/docs/base.ts:62](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/docs/base.ts#L62)

***

### \_streamIterator()

`Internal`

> **\_streamIterator**(`input`, `options`?): `AsyncGenerator` \<[`Context`](../../context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], `any`, `unknown`\>

Creates an async generator for streaming callable outputs.
This protected method is used internally for streaming operations.

#### Parameters

• **input**: `CallInput`

The input for the callable.

• **options?**: `Partial` \<[`BaseDocLoaderCallOptions`](../../base/interfaces/BaseDocLoaderCallOptions.md)\>

Optional additional options for the callable.

#### Returns

`AsyncGenerator` \<[`Context`](../../context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], `any`, `unknown`\>

An async generator yielding callable outputs.

#### Inherited from

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`_streamIterator`](../../base/classes/BaseLoader.md#_streamiterator)

#### Source

[packages/core/src/record/callable.ts:429](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L429)

***

### batch()

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise` \<[`Context`](../../context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[][]\>

Batch calls invoke N times, where N is the length of inputs.

##### Parameters

• **inputs**: `CallInput`[]

Array of inputs in each call in a batch.

• **options?**: `Partial` \<[`BaseDocLoaderCallOptions`](../../base/interfaces/BaseDocLoaderCallOptions.md)\> \| `Partial` \<[`BaseDocLoaderCallOptions`](../../base/interfaces/BaseDocLoaderCallOptions.md)\>[]

Either a single call options to apply to each call or an array of options for each call.

• **batchOptions?**: [`CallableBatchOptions`](../../../../../../record/callable/type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise` \<[`Context`](../../context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[][]\>

An arrays of CallOutputs, or mixed CallOutputs and Errors (if returnExceptions is true).

##### Inherited from

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`batch`](../../base/classes/BaseLoader.md#batch)

##### Source

[packages/core/src/record/callable.ts:368](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L368)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| [`Context`](../../context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[])[]\>

##### Parameters

• **inputs**: `CallInput`[]

• **options?**: `Partial` \<[`BaseDocLoaderCallOptions`](../../base/interfaces/BaseDocLoaderCallOptions.md)\> \| `Partial` \<[`BaseDocLoaderCallOptions`](../../base/interfaces/BaseDocLoaderCallOptions.md)\>[]

• **batchOptions?**: [`CallableBatchOptions`](../../../../../../record/callable/type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise`\<(`Error` \| [`Context`](../../context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[])[]\>

##### Inherited from

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`batch`](../../base/classes/BaseLoader.md#batch)

##### Source

[packages/core/src/record/callable.ts:374](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L374)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| [`Context`](../../context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[])[]\>

##### Parameters

• **inputs**: `CallInput`[]

• **options?**: `Partial` \<[`BaseDocLoaderCallOptions`](../../base/interfaces/BaseDocLoaderCallOptions.md)\> \| `Partial` \<[`BaseDocLoaderCallOptions`](../../base/interfaces/BaseDocLoaderCallOptions.md)\>[]

• **batchOptions?**: [`CallableBatchOptions`](../../../../../../record/callable/type-aliases/CallableBatchOptions.md)

##### Returns

`Promise`\<(`Error` \| [`Context`](../../context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[])[]\>

##### Inherited from

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`batch`](../../base/classes/BaseLoader.md#batch)

##### Source

[packages/core/src/record/callable.ts:380](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L380)

***

### bind()

> **bind**(`kwargs`): [`Callable`](../../../../../../record/callable/classes/Callable.md)\<`CallInput`, [`Context`](../../context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], [`BaseDocLoaderCallOptions`](../../base/interfaces/BaseDocLoaderCallOptions.md)\>

Creates a new [CallableBind](../../../../../../record/callable/classes/CallableBind.md) instance with the specified keyword arguments.
This method allows partial reconfiguration of the callable instance.

#### Parameters

• **kwargs**: `Partial` \<[`BaseDocLoaderCallOptions`](../../base/interfaces/BaseDocLoaderCallOptions.md)\>

Partial keyword arguments for the callable configuration.

#### Returns

[`Callable`](../../../../../../record/callable/classes/Callable.md)\<`CallInput`, [`Context`](../../context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], [`BaseDocLoaderCallOptions`](../../base/interfaces/BaseDocLoaderCallOptions.md)\>

A new [CallableBind](../../../../../../record/callable/classes/CallableBind.md) instance with the given keyword arguments.

#### Inherited from

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`bind`](../../base/classes/BaseLoader.md#bind)

#### Source

[packages/core/src/record/callable.ts:343](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L343)

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

##### metadata

> **metadata**: `object`

##### metadata.callables?

> `optional` **callables**: [`SerializedCallableFields`](../../../../../../record/callable/type-aliases/SerializedCallableFields.md)

##### metadata.type

> **type**: `string`

##### secrets

> **secrets**: `SecretFields`

#### Inherited from

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`getAttributes`](../../base/classes/BaseLoader.md#getattributes)

#### Source

[packages/core/src/record/callable.ts:511](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L511)

***

### invoke()

> **invoke**(`input`, `options`?): `Promise` \<[`Context`](../../context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

Invokes the loading process with the given input and options.

#### Parameters

• **input**: `CallInput`

The input data to load.

• **options?**: `Partial` \<[`BaseDocLoaderCallOptions`](../../base/interfaces/BaseDocLoaderCallOptions.md)\>

Optional settings to customize the loading process.

#### Returns

`Promise` \<[`Context`](../../context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

A Promise resolving to the output, typically an array of contexts.

#### Inherited from

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`invoke`](../../base/classes/BaseLoader.md#invoke)

#### Source

[packages/core/src/events/input/load/docs/base.ts:84](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/docs/base.ts#L84)

***

### load()

> **load**(`filePathOrBlob`): `Promise` \<[`Context`](../../context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

Loads and parses document data from a buffer, converting it into an array of `Context` instances.
This method orchestrates the reading of file or blob data and their subsequent parsing into structured formats.

#### Parameters

• **filePathOrBlob**: `CallInput`

The file path or blob object containing the document data to be loaded.

#### Returns

`Promise` \<[`Context`](../../context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

A promise resolving to an array of `Context` instances, representing the parsed documents.

#### Overrides

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`load`](../../base/classes/BaseLoader.md#load)

#### Source

[packages/core/src/events/input/load/docs/buffer.ts:58](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/docs/buffer.ts#L58)

***

### map()

> **map**(): [`Callable`](../../../../../../record/callable/classes/Callable.md)\<`CallInput`[], [`Context`](../../context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[][], [`BaseDocLoaderCallOptions`](../../base/interfaces/BaseDocLoaderCallOptions.md)\>

Creates a new [CallableEach](../../../../../../record/callable/classes/CallableEach.md) instance for mapping inputs to outputs.
This method allows applying the callable to each input in an array of inputs.

#### Returns

[`Callable`](../../../../../../record/callable/classes/Callable.md)\<`CallInput`[], [`Context`](../../context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[][], [`BaseDocLoaderCallOptions`](../../base/interfaces/BaseDocLoaderCallOptions.md)\>

A new [CallableEach](../../../../../../record/callable/classes/CallableEach.md) instance for mapping operation.

#### Inherited from

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`map`](../../base/classes/BaseLoader.md#map)

#### Source

[packages/core/src/record/callable.ts:355](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L355)

***

### parse()

`Internal`

> `protected` `abstract` **parse**(`rawData`, `metadata`): `Promise` \<[`Context`](../../context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

Abstract method that parse the buffer and return the documents.

#### Parameters

• **rawData**: `Buffer`

The buffer to parse.

• **metadata**: `Record`\<`string`, `unknown`\>

The metadata of the document.

#### Returns

`Promise` \<[`Context`](../../context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

Promise that resolves with an array of `Context` objects.

#### Source

[packages/core/src/events/input/load/docs/buffer.ts:34](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/docs/buffer.ts#L34)

***

### pipe()

> **pipe**\<`NewCallOutput`\>(`callableLike`): [`CallableSequence`](../../../../../../record/callable/classes/CallableSequence.md)\<`CallInput`, `NewCallOutput`\>

Chains the current callable with another callable, creating a sequence.
This method allows sequential execution of multiple callables.

#### Type parameters

• **NewCallOutput**

#### Parameters

• **callableLike**: [`CallableLike`](../../../../../../record/callable/type-aliases/CallableLike.md) \<[`Context`](../../context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], `NewCallOutput`\>

The next callable in the sequence.

#### Returns

[`CallableSequence`](../../../../../../record/callable/classes/CallableSequence.md)\<`CallInput`, `NewCallOutput`\>

A new [CallableSequence](../../../../../../record/callable/classes/CallableSequence.md) instance representing the chained callables.

#### Inherited from

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`pipe`](../../base/classes/BaseLoader.md#pipe)

#### Source

[packages/core/src/record/callable.ts:460](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L460)

***

### stream()

> **stream**(`input`, `options`?): `Promise`\<`ReadableStreamAsyncIterable` \<[`Context`](../../context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>\>

Creates a readable stream for the callable outputs.
This method allows streaming the outputs of the callable for continuous data.

#### Parameters

• **input**: `CallInput`

The input for the callable.

• **options?**: `Partial` \<[`BaseDocLoaderCallOptions`](../../base/interfaces/BaseDocLoaderCallOptions.md)\>

Optional additional options for the callable.

#### Returns

`Promise`\<`ReadableStreamAsyncIterable` \<[`Context`](../../context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>\>

A promise that resolves to a readable stream of callable outputs.

#### Inherited from

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`stream`](../../base/classes/BaseLoader.md#stream)

#### Source

[packages/core/src/record/callable.ts:444](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L444)

***

### toJSON()

> **toJSON**(): [`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized representation based on the object's current state. This method determines whether to use a 'not implemented' or 'constructor' format based on the object's serializability.

#### Returns

[`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`toJSON`](../../base/classes/BaseLoader.md#tojson)

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

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`toJSONConstructor`](../../base/classes/BaseLoader.md#tojsonconstructor)

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

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`toJSONNotImplemented`](../../base/classes/BaseLoader.md#tojsonnotimplemented)

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

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`toJSONSecret`](../../base/classes/BaseLoader.md#tojsonsecret)

#### Source

[packages/core/src/load/serializable.ts:462](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L462)

***

### withConfig()

> **withConfig**(`config`): [`CallableBind`](../../../../../../record/callable/classes/CallableBind.md)\<`CallInput`, [`Context`](../../context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], [`BaseDocLoaderCallOptions`](../../base/interfaces/BaseDocLoaderCallOptions.md)\>

Creates a new [CallableBind](../../../../../../record/callable/classes/CallableBind.md) instance with the specified configuration.
This method allows reconfiguration of the callable instance.

#### Parameters

• **config**: [`CallableConfig`](../../../../../../record/callable/type-aliases/CallableConfig.md)

The configuration to apply to the new callable instance.

#### Returns

[`CallableBind`](../../../../../../record/callable/classes/CallableBind.md)\<`CallInput`, [`Context`](../../context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], [`BaseDocLoaderCallOptions`](../../base/interfaces/BaseDocLoaderCallOptions.md)\>

A new [CallableBind](../../../../../../record/callable/classes/CallableBind.md) instance with the given configuration.

#### Inherited from

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`withConfig`](../../base/classes/BaseLoader.md#withconfig)

#### Source

[packages/core/src/record/callable.ts:314](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L314)

***

### withFallbacks()

> **withFallbacks**(`fields`): [`CallableWithFallbacks`](../../../../../../record/callable/classes/CallableWithFallbacks.md)\<`CallInput`, [`Context`](../../context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

Creates a new [CallableWithFallbacks](../../../../../../record/callable/classes/CallableWithFallbacks.md) instance with specified fallbacks.
This method allows defining fallback callables for error handling or retries.

#### Parameters

• **fields**

Object containing an array of fallback callables.

• **fields.fallbacks**: [`Callable`](../../../../../../record/callable/classes/Callable.md)\<`CallInput`, [`Context`](../../context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], [`CallableConfig`](../../../../../../record/callable/type-aliases/CallableConfig.md)\>[]

#### Returns

[`CallableWithFallbacks`](../../../../../../record/callable/classes/CallableWithFallbacks.md)\<`CallInput`, [`Context`](../../context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

A new [CallableWithFallbacks](../../../../../../record/callable/classes/CallableWithFallbacks.md) instance with the specified fallbacks.

#### Inherited from

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`withFallbacks`](../../base/classes/BaseLoader.md#withfallbacks)

#### Source

[packages/core/src/record/callable.ts:327](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L327)

***

### \_name()

> `static` **\_name**(): `string`

Generates a unique name for the class, typically used for serialization identification.

#### Returns

`string`

#### Overrides

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`_name`](../../base/classes/BaseLoader.md#_name)

#### Source

[packages/core/src/events/input/load/docs/buffer.ts:18](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/docs/buffer.ts#L18)

***

### isCallable()

> `static` **isCallable**(`anything`): `anything is Callable<unknown, unknown, CallableConfig>`

Checks if a given object is an instance of Callable.

#### Parameters

• **anything**: `any`

Object to be checked.

#### Returns

`anything is Callable<unknown, unknown, CallableConfig>`

True if the object is an instance of Callable, false otherwise.

#### Inherited from

[`BaseLoader`](../../base/classes/BaseLoader.md) . [`isCallable`](../../base/classes/BaseLoader.md#iscallable)

#### Source

[packages/core/src/record/callable.ts:196](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L196)
