# Class: `abstract` BaseEvent\<CallInput, CallOutput, CallOptions\>

An abstract base class for events that extends the Callable class with additional event-specific properties and behaviors.
This class is designed to be extended by more specific event implementations that define the actual logic to be executed when the event is triggered.

## Implements

BaseEventParams Incorporates basic event parameters including verbosity.

## Extends

- [`Callable`](../../../record/callable/classes/Callable.md)\<`CallInput`, `CallOutput`, `CallOptions`\>

## Extended by

- [`BaseEmbeddings`](../../embeddings/base/classes/BaseEmbeddings.md)
- [`BaseLoader`](../../input/load/docs/base/classes/BaseLoader.md)
- [`BasePromptTemplate`](../../input/load/prompts/base/classes/BasePromptTemplate.md)
- [`ContextSplitter`](../../input/transform/splitter/classes/ContextSplitter.md)
- [`VariableValidator`](../../inference/validate/validators/variable/classes/VariableValidator.md)
- [`BaseLM`](../../inference/chat/base/classes/BaseLM.md)
- [`BaseRetriever`](../../inference/retrieve/base/classes/BaseRetriever.md)

## Type parameters

• **CallInput**

Type of input accepted by the event callable.

• **CallOutput**

Type of output produced by the event callable.

• **CallOptions** *extends* [`CallableConfig`](../../../record/callable/type-aliases/CallableConfig.md) = [`CallableConfig`](../../../record/callable/type-aliases/CallableConfig.md)

Configuration options for the callable, extending the base [CallableConfig](../../../record/callable/type-aliases/CallableConfig.md).

## Implements

- [`BaseEventParams`](../interfaces/BaseEventParams.md)

## Constructors

### new BaseEvent()

> **new BaseEvent**\<`CallInput`, `CallOutput`, `CallOptions`\>(`fields`): [`BaseEvent`](BaseEvent.md)\<`CallInput`, `CallOutput`, `CallOptions`\>

#### Parameters

• **fields**: [`BaseEventParams`](../interfaces/BaseEventParams.md)

#### Returns

[`BaseEvent`](BaseEvent.md)\<`CallInput`, `CallOutput`, `CallOptions`\>

#### Overrides

[`Callable`](../../../record/callable/classes/Callable.md) . [`constructor`](../../../record/callable/classes/Callable.md#constructors)

#### Source

[packages/core/src/events/base.ts:88](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L88)

## Properties

### \_isCallable

> **\_isCallable**: `boolean` = `true`

Indicates if the instance is callable. If false, then the callable cannot be invoked.

#### Inherited from

[`Callable`](../../../record/callable/classes/Callable.md) . [`_isCallable`](../../../record/callable/classes/Callable.md#_iscallable)

#### Source

[packages/core/src/record/callable.ts:188](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L188)

***

### \_isSerializable

> **\_isSerializable**: `boolean` = `false`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Inherited from

[`Callable`](../../../record/callable/classes/Callable.md) . [`_isSerializable`](../../../record/callable/classes/Callable.md#_isserializable)

#### Source

[packages/core/src/load/serializable.ts:163](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L163)

***

### \_kwargs

> **\_kwargs**: `SerializedFields`

Key-value pairs of properties to be serialized.

#### Inherited from

[`Callable`](../../../record/callable/classes/Callable.md) . [`_kwargs`](../../../record/callable/classes/Callable.md#_kwargs)

#### Source

[packages/core/src/load/serializable.ts:168](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L168)

***

### \_namespace

> **\_namespace**: `string`[]

Unique namespace identifier for the serialized object, represented as an array of strings.

#### Overrides

[`Callable`](../../../record/callable/classes/Callable.md) . [`_namespace`](../../../record/callable/classes/Callable.md#_namespace)

#### Source

[packages/core/src/events/base.ts:44](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L44)

***

### callbacks?

`Experimental`

> `optional` **callbacks**: `any`

not-implemented yet

#### Implementation of

[`BaseEventParams`](../interfaces/BaseEventParams.md) . [`callbacks`](../interfaces/BaseEventParams.md#callbacks)

#### Source

[packages/core/src/events/base.ts:79](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L79)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../record/callable/type-aliases/CallableConfigFields.md).

#### Implementation of

[`BaseEventParams`](../interfaces/BaseEventParams.md) . [`metadata`](../interfaces/BaseEventParams.md#metadata)

#### Source

[packages/core/src/events/base.ts:74](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L74)

***

### name?

`Experimental`

> `optional` **name**: `string`

The name of the callable, used for identification or logging.

not-implement yet

#### Implementation of

[`BaseEventParams`](../interfaces/BaseEventParams.md) . [`name`](../interfaces/BaseEventParams.md#name)

#### Source

[packages/core/src/events/base.ts:61](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L61)

***

### tags?

`Experimental`

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables.

not-implement yet

#### Implementation of

[`BaseEventParams`](../interfaces/BaseEventParams.md) . [`tags`](../interfaces/BaseEventParams.md#tags)

#### Source

[packages/core/src/events/base.ts:69](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L69)

***

### verbose

`Experimental`

> **verbose**: `boolean`

Specifies whether the event should provide verbose output, such as detailed logs or response texts.
This can be useful for debugging or detailed monitoring of event handling processes.

not-implement yet

#### Implementation of

[`BaseEventParams`](../interfaces/BaseEventParams.md) . [`verbose`](../interfaces/BaseEventParams.md#verbose)

#### Source

[packages/core/src/events/base.ts:53](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L53)

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

[packages/core/src/events/base.ts:81](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L81)

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

### \_streamIterator()

`Internal`

> **\_streamIterator**(`input`, `options`?): `AsyncGenerator`\<`CallOutput`, `any`, `unknown`\>

Creates an async generator for streaming callable outputs.
This protected method is used internally for streaming operations.

#### Parameters

• **input**: `CallInput`

The input for the callable.

• **options?**: `Partial`\<`CallOptions`\>

Optional additional options for the callable.

#### Returns

`AsyncGenerator`\<`CallOutput`, `any`, `unknown`\>

An async generator yielding callable outputs.

#### Inherited from

[`Callable`](../../../record/callable/classes/Callable.md) . [`_streamIterator`](../../../record/callable/classes/Callable.md#_streamiterator)

#### Source

[packages/core/src/record/callable.ts:429](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L429)

***

### batch()

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<`CallOutput`[]\>

Batch calls invoke N times, where N is the length of inputs.

##### Parameters

• **inputs**: `CallInput`[]

Array of inputs in each call in a batch.

• **options?**: `Partial`\<`CallOptions`\> \| `Partial`\<`CallOptions`\>[]

Either a single call options to apply to each call or an array of options for each call.

• **batchOptions?**: [`CallableBatchOptions`](../../../record/callable/type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise`\<`CallOutput`[]\>

An arrays of CallOutputs, or mixed CallOutputs and Errors (if returnExceptions is true).

##### Inherited from

[`Callable`](../../../record/callable/classes/Callable.md) . [`batch`](../../../record/callable/classes/Callable.md#batch)

##### Source

[packages/core/src/record/callable.ts:368](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L368)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| `CallOutput`)[]\>

##### Parameters

• **inputs**: `CallInput`[]

• **options?**: `Partial`\<`CallOptions`\> \| `Partial`\<`CallOptions`\>[]

• **batchOptions?**: [`CallableBatchOptions`](../../../record/callable/type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise`\<(`Error` \| `CallOutput`)[]\>

##### Inherited from

[`Callable`](../../../record/callable/classes/Callable.md) . [`batch`](../../../record/callable/classes/Callable.md#batch)

##### Source

[packages/core/src/record/callable.ts:374](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L374)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| `CallOutput`)[]\>

##### Parameters

• **inputs**: `CallInput`[]

• **options?**: `Partial`\<`CallOptions`\> \| `Partial`\<`CallOptions`\>[]

• **batchOptions?**: [`CallableBatchOptions`](../../../record/callable/type-aliases/CallableBatchOptions.md)

##### Returns

`Promise`\<(`Error` \| `CallOutput`)[]\>

##### Inherited from

[`Callable`](../../../record/callable/classes/Callable.md) . [`batch`](../../../record/callable/classes/Callable.md#batch)

##### Source

[packages/core/src/record/callable.ts:380](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L380)

***

### bind()

> **bind**(`kwargs`): [`Callable`](../../../record/callable/classes/Callable.md)\<`CallInput`, `CallOutput`, `CallOptions`\>

Creates a new [CallableBind](../../../record/callable/classes/CallableBind.md) instance with the specified keyword arguments.
This method allows partial reconfiguration of the callable instance.

#### Parameters

• **kwargs**: `Partial`\<`CallOptions`\>

Partial keyword arguments for the callable configuration.

#### Returns

[`Callable`](../../../record/callable/classes/Callable.md)\<`CallInput`, `CallOutput`, `CallOptions`\>

A new [CallableBind](../../../record/callable/classes/CallableBind.md) instance with the given keyword arguments.

#### Inherited from

[`Callable`](../../../record/callable/classes/Callable.md) . [`bind`](../../../record/callable/classes/Callable.md#bind)

#### Source

[packages/core/src/record/callable.ts:343](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L343)

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

> `optional` **callables**: [`SerializedCallableFields`](../../../record/callable/type-aliases/SerializedCallableFields.md)

##### metadata.type

> **type**: `string`

##### secrets

> **secrets**: `SecretFields`

#### Inherited from

[`Callable`](../../../record/callable/classes/Callable.md) . [`getAttributes`](../../../record/callable/classes/Callable.md#getattributes)

#### Source

[packages/core/src/record/callable.ts:511](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L511)

***

### invoke()

> `abstract` **invoke**(`input`, `options`?): `Promise`\<`CallOutput`\>

Abstract method to invoke the callable.

#### Parameters

• **input**: `CallInput`

The input required to invoke the callable.

• **options?**: `Partial`\<`CallOptions`\>

Optional partial configuration for the callable.

#### Returns

`Promise`\<`CallOutput`\>

A promise resolving to the callable's output.

#### Inherited from

[`Callable`](../../../record/callable/classes/Callable.md) . [`invoke`](../../../record/callable/classes/Callable.md#invoke)

#### Source

[packages/core/src/record/callable.ts:207](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L207)

***

### map()

> **map**(): [`Callable`](../../../record/callable/classes/Callable.md)\<`CallInput`[], `CallOutput`[], `CallOptions`\>

Creates a new [CallableEach](../../../record/callable/classes/CallableEach.md) instance for mapping inputs to outputs.
This method allows applying the callable to each input in an array of inputs.

#### Returns

[`Callable`](../../../record/callable/classes/Callable.md)\<`CallInput`[], `CallOutput`[], `CallOptions`\>

A new [CallableEach](../../../record/callable/classes/CallableEach.md) instance for mapping operation.

#### Inherited from

[`Callable`](../../../record/callable/classes/Callable.md) . [`map`](../../../record/callable/classes/Callable.md#map)

#### Source

[packages/core/src/record/callable.ts:355](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L355)

***

### pipe()

> **pipe**\<`NewCallOutput`\>(`callableLike`): [`CallableSequence`](../../../record/callable/classes/CallableSequence.md)\<`CallInput`, `NewCallOutput`\>

Chains the current callable with another callable, creating a sequence.
This method allows sequential execution of multiple callables.

#### Type parameters

• **NewCallOutput**

#### Parameters

• **callableLike**: [`CallableLike`](../../../record/callable/type-aliases/CallableLike.md)\<`CallOutput`, `NewCallOutput`\>

The next callable in the sequence.

#### Returns

[`CallableSequence`](../../../record/callable/classes/CallableSequence.md)\<`CallInput`, `NewCallOutput`\>

A new [CallableSequence](../../../record/callable/classes/CallableSequence.md) instance representing the chained callables.

#### Inherited from

[`Callable`](../../../record/callable/classes/Callable.md) . [`pipe`](../../../record/callable/classes/Callable.md#pipe)

#### Source

[packages/core/src/record/callable.ts:460](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L460)

***

### stream()

> **stream**(`input`, `options`?): `Promise`\<`ReadableStreamAsyncIterable`\<`CallOutput`\>\>

Creates a readable stream for the callable outputs.
This method allows streaming the outputs of the callable for continuous data.

#### Parameters

• **input**: `CallInput`

The input for the callable.

• **options?**: `Partial`\<`CallOptions`\>

Optional additional options for the callable.

#### Returns

`Promise`\<`ReadableStreamAsyncIterable`\<`CallOutput`\>\>

A promise that resolves to a readable stream of callable outputs.

#### Inherited from

[`Callable`](../../../record/callable/classes/Callable.md) . [`stream`](../../../record/callable/classes/Callable.md#stream)

#### Source

[packages/core/src/record/callable.ts:444](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L444)

***

### toJSON()

> **toJSON**(): [`Serialized`](../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized representation based on the object's current state. This method determines whether to use a 'not implemented' or 'constructor' format based on the object's serializability.

#### Returns

[`Serialized`](../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`Callable`](../../../record/callable/classes/Callable.md) . [`toJSON`](../../../record/callable/classes/Callable.md#tojson)

#### Source

[packages/core/src/load/serializable.ts:665](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L665)

***

### toJSONConstructor()

> **toJSONConstructor**(`aliases`, `secrets`, `kwargs`): [`Serialized`](../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized constructor format. This method provides a way to serialize object construction details, including any aliases or secrets.

#### Parameters

• **aliases**: `SerializedKeyAlias`

Key aliases to include in the serialized output.

• **secrets**: `SecretFields`

Secrets to be secured in the serialized output.

• **kwargs**: `SerializedFields`

Additional keyword arguments to include in the serialized output.

#### Returns

[`Serialized`](../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object as a constructor.

#### Inherited from

[`Callable`](../../../record/callable/classes/Callable.md) . [`toJSONConstructor`](../../../record/callable/classes/Callable.md#tojsonconstructor)

#### Source

[packages/core/src/load/serializable.ts:478](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L478)

***

### toJSONNotImplemented()

> **toJSONNotImplemented**(): [`Serialized`](../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized format that is not implemented. This method should be overridden in subclasses to provide specific serialization behavior.

#### Returns

[`Serialized`](../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`Callable`](../../../record/callable/classes/Callable.md) . [`toJSONNotImplemented`](../../../record/callable/classes/Callable.md#tojsonnotimplemented)

#### Source

[packages/core/src/load/serializable.ts:448](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L448)

***

### toJSONSecret()

> **toJSONSecret**(`secretKey`): [`Serialized`](../../../load/serializable/type-aliases/Serialized.md)

Converts a secret key to its serialized format. This method is typically used for serializing secrets in a secure manner.

#### Parameters

• **secretKey**: `string`

The secret key to serialize.

#### Returns

[`Serialized`](../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the secret key.

#### Inherited from

[`Callable`](../../../record/callable/classes/Callable.md) . [`toJSONSecret`](../../../record/callable/classes/Callable.md#tojsonsecret)

#### Source

[packages/core/src/load/serializable.ts:462](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L462)

***

### withConfig()

> **withConfig**(`config`): [`CallableBind`](../../../record/callable/classes/CallableBind.md)\<`CallInput`, `CallOutput`, `CallOptions`\>

Creates a new [CallableBind](../../../record/callable/classes/CallableBind.md) instance with the specified configuration.
This method allows reconfiguration of the callable instance.

#### Parameters

• **config**: [`CallableConfig`](../../../record/callable/type-aliases/CallableConfig.md)

The configuration to apply to the new callable instance.

#### Returns

[`CallableBind`](../../../record/callable/classes/CallableBind.md)\<`CallInput`, `CallOutput`, `CallOptions`\>

A new [CallableBind](../../../record/callable/classes/CallableBind.md) instance with the given configuration.

#### Inherited from

[`Callable`](../../../record/callable/classes/Callable.md) . [`withConfig`](../../../record/callable/classes/Callable.md#withconfig)

#### Source

[packages/core/src/record/callable.ts:314](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L314)

***

### withFallbacks()

> **withFallbacks**(`fields`): [`CallableWithFallbacks`](../../../record/callable/classes/CallableWithFallbacks.md)\<`CallInput`, `CallOutput`\>

Creates a new [CallableWithFallbacks](../../../record/callable/classes/CallableWithFallbacks.md) instance with specified fallbacks.
This method allows defining fallback callables for error handling or retries.

#### Parameters

• **fields**

Object containing an array of fallback callables.

• **fields.fallbacks**: [`Callable`](../../../record/callable/classes/Callable.md)\<`CallInput`, `CallOutput`, [`CallableConfig`](../../../record/callable/type-aliases/CallableConfig.md)\>[]

#### Returns

[`CallableWithFallbacks`](../../../record/callable/classes/CallableWithFallbacks.md)\<`CallInput`, `CallOutput`\>

A new [CallableWithFallbacks](../../../record/callable/classes/CallableWithFallbacks.md) instance with the specified fallbacks.

#### Inherited from

[`Callable`](../../../record/callable/classes/Callable.md) . [`withFallbacks`](../../../record/callable/classes/Callable.md#withfallbacks)

#### Source

[packages/core/src/record/callable.ts:327](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L327)

***

### \_name()

> `static` **\_name**(): `string`

Generates a unique name for the class, typically used for serialization identification.

#### Returns

`string`

#### Inherited from

[`Callable`](../../../record/callable/classes/Callable.md) . [`_name`](../../../record/callable/classes/Callable.md#_name)

#### Source

[packages/core/src/load/serializable.ts:178](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L178)

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

[`Callable`](../../../record/callable/classes/Callable.md) . [`isCallable`](../../../record/callable/classes/Callable.md#iscallable)

#### Source

[packages/core/src/record/callable.ts:196](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L196)
