# Class: CallableSequence\<CallInput, CallOutput\>

Manages a sequence of Callables where the output of one callable serves as the input to the next.
This class facilitates creating pipelines of operations that process data in a sequential manner.

## Extends

- [`Callable`](Callable.md)\<`CallInput`, `CallOutput`\>

## Type parameters

• **CallInput** = `unknown`

Type of the initial input accepted by the sequence.

• **CallOutput** = `unknown`

Type of the final output produced by the sequence.

## Constructors

### new CallableSequence()

> **new CallableSequence**\<`CallInput`, `CallOutput`\>(`fields`): [`CallableSequence`](CallableSequence.md)\<`CallInput`, `CallOutput`\>

Constructs a new CallableSequence.

#### Parameters

• **fields**

An object specifying the first, middle, and last callables in the sequence.

• **fields.first**: [`Callable`](Callable.md)\<`CallInput`, `unknown`, [`CallableConfig`](../type-aliases/CallableConfig.md)\>

• **fields.last**: [`Callable`](Callable.md)\<`unknown`, `CallOutput`, [`CallableConfig`](../type-aliases/CallableConfig.md)\>

• **fields.middle?**: [`Callable`](Callable.md)\<`unknown`, `unknown`, [`CallableConfig`](../type-aliases/CallableConfig.md)\>[]

#### Returns

[`CallableSequence`](CallableSequence.md)\<`CallInput`, `CallOutput`\>

#### Overrides

[`Callable`](Callable.md) . [`constructor`](Callable.md#constructors)

#### Source

[packages/core/src/record/callable.ts:1593](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L1593)

## Properties

### \_isCallable

> **\_isCallable**: `boolean` = `true`

Indicates if the instance is callable. If false, then the callable cannot be invoked.

#### Overrides

[`Callable`](Callable.md) . [`_isCallable`](Callable.md#_iscallable)

#### Source

[packages/core/src/record/callable.ts:1564](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L1564)

***

### \_isSerializable

> **\_isSerializable**: `boolean` = `true`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Overrides

[`Callable`](Callable.md) . [`_isSerializable`](Callable.md#_isserializable)

#### Source

[packages/core/src/record/callable.ts:1566](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L1566)

***

### \_kwargs

> **\_kwargs**: `SerializedFields`

Key-value pairs of properties to be serialized.

#### Inherited from

[`Callable`](Callable.md) . [`_kwargs`](Callable.md#_kwargs)

#### Source

[packages/core/src/load/serializable.ts:168](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L168)

***

### \_namespace

> **\_namespace**: `string`[]

Unique namespace identifier for the serialized object, represented as an array of strings.

#### Overrides

[`Callable`](Callable.md) . [`_namespace`](Callable.md#_namespace)

#### Source

[packages/core/src/record/callable.ts:1568](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L1568)

***

### first

> `protected` **first**: [`Callable`](Callable.md)\<`CallInput`, `unknown`, [`CallableConfig`](../type-aliases/CallableConfig.md)\>

The first callable in the sequence.

#### Source

[packages/core/src/record/callable.ts:1577](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L1577)

***

### last

> `protected` **last**: [`Callable`](Callable.md)\<`unknown`, `CallOutput`, [`CallableConfig`](../type-aliases/CallableConfig.md)\>

The last callable in the sequence, producing the final output.

#### Source

[packages/core/src/record/callable.ts:1587](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L1587)

***

### middle

> `protected` **middle**: [`Callable`](Callable.md)\<`unknown`, `unknown`, [`CallableConfig`](../type-aliases/CallableConfig.md)\>[] = `[]`

An array of intermediate callables that process data between the first and the last callable.

#### Source

[packages/core/src/record/callable.ts:1582](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L1582)

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

### steps

> `get` **steps**(): [`Callable`](Callable.md)\<`CallInput`, `unknown`, [`CallableConfig`](../type-aliases/CallableConfig.md)\>[]

Gets the sequence of callables as an array.

#### Returns

[`Callable`](Callable.md)\<`CallInput`, `unknown`, [`CallableConfig`](../type-aliases/CallableConfig.md)\>[]

An array of callables including first, middle, and last.

#### Source

[packages/core/src/record/callable.ts:1609](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L1609)

## Methods

### \_streamIterator()

`Internal`

> **\_streamIterator**(`input`, `options`?): `AsyncGenerator`\<`CallOutput`, `any`, `unknown`\>

Creates an async generator for streaming callable outputs.
This protected method is used internally for streaming operations.

#### Parameters

• **input**: `CallInput`

The input for the callable.

• **options?**: `Partial` \<[`CallableConfig`](../type-aliases/CallableConfig.md)\>

Optional additional options for the callable.

#### Returns

`AsyncGenerator`\<`CallOutput`, `any`, `unknown`\>

An async generator yielding callable outputs.

#### Inherited from

[`Callable`](Callable.md) . [`_streamIterator`](Callable.md#_streamiterator)

#### Source

[packages/core/src/record/callable.ts:429](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L429)

***

### batch()

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<`CallOutput`[]\>

Batch calls invoke N times, where N is the length of inputs.
Subclasses would override this method with different arguments and returns.

##### Parameters

• **inputs**: `CallInput`[]

Array of inputs in each call in a batch.

• **options?**: `Partial` \<[`CallableConfig`](../type-aliases/CallableConfig.md)\> \| `Partial` \<[`CallableConfig`](../type-aliases/CallableConfig.md)\>[]

Either a single call options to apply to each call or an array of options for each call.

• **batchOptions?**: [`CallableBatchOptions`](../type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise`\<`CallOutput`[]\>

An arrays of CallOutputs, or mixed CallOutputs and Errors (if returnExceptions is true).

##### Overrides

[`Callable`](Callable.md) . [`batch`](Callable.md#batch)

##### Source

[packages/core/src/record/callable.ts:1684](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L1684)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| `CallOutput`)[]\>

##### Parameters

• **inputs**: `CallInput`[]

• **options?**: `Partial` \<[`CallableConfig`](../type-aliases/CallableConfig.md)\> \| `Partial` \<[`CallableConfig`](../type-aliases/CallableConfig.md)\>[]

• **batchOptions?**: [`CallableBatchOptions`](../type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise`\<(`Error` \| `CallOutput`)[]\>

##### Overrides

[`Callable`](Callable.md) . [`batch`](Callable.md#batch)

##### Source

[packages/core/src/record/callable.ts:1690](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L1690)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| `CallOutput`)[]\>

##### Parameters

• **inputs**: `CallInput`[]

• **options?**: `Partial` \<[`CallableConfig`](../type-aliases/CallableConfig.md)\> \| `Partial` \<[`CallableConfig`](../type-aliases/CallableConfig.md)\>[]

• **batchOptions?**: [`CallableBatchOptions`](../type-aliases/CallableBatchOptions.md)

##### Returns

`Promise`\<(`Error` \| `CallOutput`)[]\>

##### Overrides

[`Callable`](Callable.md) . [`batch`](Callable.md#batch)

##### Source

[packages/core/src/record/callable.ts:1696](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L1696)

***

### bind()

> **bind**(`kwargs`): [`Callable`](Callable.md)\<`CallInput`, `CallOutput`, [`CallableConfig`](../type-aliases/CallableConfig.md)\>

Creates a new [CallableBind](CallableBind.md) instance with the specified keyword arguments.
This method allows partial reconfiguration of the callable instance.

#### Parameters

• **kwargs**: `Partial` \<[`CallableConfig`](../type-aliases/CallableConfig.md)\>

Partial keyword arguments for the callable configuration.

#### Returns

[`Callable`](Callable.md)\<`CallInput`, `CallOutput`, [`CallableConfig`](../type-aliases/CallableConfig.md)\>

A new [CallableBind](CallableBind.md) instance with the given keyword arguments.

#### Inherited from

[`Callable`](Callable.md) . [`bind`](Callable.md#bind)

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

> `optional` **callables**: [`SerializedCallableFields`](../type-aliases/SerializedCallableFields.md)

##### metadata.type

> **type**: `string`

##### secrets

> **secrets**: `SecretFields`

#### Inherited from

[`Callable`](Callable.md) . [`getAttributes`](Callable.md#getattributes)

#### Source

[packages/core/src/record/callable.ts:511](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L511)

***

### invoke()

> **invoke**(`input`, `options`?): `Promise`\<`CallOutput`\>

Invokes the sequence of callables with the given input.
Each callable's output is passed as the input to the next callable.

#### Parameters

• **input**: `CallInput`

The input for the first callable in the sequence.

• **options?**: `Partial` \<[`CallableConfig`](../type-aliases/CallableConfig.md)\>

Optional callable configuration options.

#### Returns

`Promise`\<`CallOutput`\>

A promise that resolves to the output of the last callable in the sequence.

#### Overrides

[`Callable`](Callable.md) . [`invoke`](Callable.md#invoke)

#### Throws

An error if any callable in the sequence fails.

#### Source

[packages/core/src/record/callable.ts:1652](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L1652)

***

### map()

> **map**(): [`Callable`](Callable.md)\<`CallInput`[], `CallOutput`[], [`CallableConfig`](../type-aliases/CallableConfig.md)\>

Creates a new [CallableEach](CallableEach.md) instance for mapping inputs to outputs.
This method allows applying the callable to each input in an array of inputs.

#### Returns

[`Callable`](Callable.md)\<`CallInput`[], `CallOutput`[], [`CallableConfig`](../type-aliases/CallableConfig.md)\>

A new [CallableEach](CallableEach.md) instance for mapping operation.

#### Inherited from

[`Callable`](Callable.md) . [`map`](Callable.md#map)

#### Source

[packages/core/src/record/callable.ts:355](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L355)

***

### pipe()

> **pipe**\<`NewCallOutput`\>(`callableLike`): [`CallableSequence`](CallableSequence.md)\<`CallInput`, `NewCallOutput`\>

Extends the current callable sequence by adding another callable or callable sequence to the end.
This method allows for dynamic extension of the callable sequence, maintaining the flow of data.

#### Type parameters

• **NewCallOutput**

#### Parameters

• **callableLike**: [`CallableLike`](../type-aliases/CallableLike.md)\<`CallOutput`, `NewCallOutput`\>

The callable or callable sequence to be added to the end of the current sequence.

#### Returns

[`CallableSequence`](CallableSequence.md)\<`CallInput`, `NewCallOutput`\>

A new CallableSequence instance representing the extended sequence.

#### Overrides

[`Callable`](Callable.md) . [`pipe`](Callable.md#pipe)

#### Source

[packages/core/src/record/callable.ts:1736](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L1736)

***

### stream()

> **stream**(`input`, `options`?): `Promise`\<`ReadableStreamAsyncIterable`\<`CallOutput`\>\>

Creates a readable stream for the callable outputs.
This method allows streaming the outputs of the callable for continuous data.

#### Parameters

• **input**: `CallInput`

The input for the callable.

• **options?**: `Partial` \<[`CallableConfig`](../type-aliases/CallableConfig.md)\>

Optional additional options for the callable.

#### Returns

`Promise`\<`ReadableStreamAsyncIterable`\<`CallOutput`\>\>

A promise that resolves to a readable stream of callable outputs.

#### Inherited from

[`Callable`](Callable.md) . [`stream`](Callable.md#stream)

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

[`Callable`](Callable.md) . [`toJSON`](Callable.md#tojson)

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

[`Callable`](Callable.md) . [`toJSONConstructor`](Callable.md#tojsonconstructor)

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

[`Callable`](Callable.md) . [`toJSONNotImplemented`](Callable.md#tojsonnotimplemented)

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

[`Callable`](Callable.md) . [`toJSONSecret`](Callable.md#tojsonsecret)

#### Source

[packages/core/src/load/serializable.ts:462](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L462)

***

### withConfig()

> **withConfig**(`config`): [`CallableBind`](CallableBind.md)\<`CallInput`, `CallOutput`, [`CallableConfig`](../type-aliases/CallableConfig.md)\>

Creates a new [CallableBind](CallableBind.md) instance with the specified configuration.
This method allows reconfiguration of the callable instance.

#### Parameters

• **config**: [`CallableConfig`](../type-aliases/CallableConfig.md)

The configuration to apply to the new callable instance.

#### Returns

[`CallableBind`](CallableBind.md)\<`CallInput`, `CallOutput`, [`CallableConfig`](../type-aliases/CallableConfig.md)\>

A new [CallableBind](CallableBind.md) instance with the given configuration.

#### Inherited from

[`Callable`](Callable.md) . [`withConfig`](Callable.md#withconfig)

#### Source

[packages/core/src/record/callable.ts:314](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L314)

***

### withFallbacks()

> **withFallbacks**(`fields`): [`CallableWithFallbacks`](CallableWithFallbacks.md)\<`CallInput`, `CallOutput`\>

Creates a new [CallableWithFallbacks](CallableWithFallbacks.md) instance with specified fallbacks.
This method allows defining fallback callables for error handling or retries.

#### Parameters

• **fields**

Object containing an array of fallback callables.

• **fields.fallbacks**: [`Callable`](Callable.md)\<`CallInput`, `CallOutput`, [`CallableConfig`](../type-aliases/CallableConfig.md)\>[]

#### Returns

[`CallableWithFallbacks`](CallableWithFallbacks.md)\<`CallInput`, `CallOutput`\>

A new [CallableWithFallbacks](CallableWithFallbacks.md) instance with the specified fallbacks.

#### Inherited from

[`Callable`](Callable.md) . [`withFallbacks`](Callable.md#withfallbacks)

#### Source

[packages/core/src/record/callable.ts:327](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L327)

***

### \_name()

> `static` **\_name**(): `string`

Generates a unique name for the class, typically used for serialization identification.

#### Returns

`string`

#### Overrides

[`Callable`](Callable.md) . [`_name`](Callable.md#_name)

#### Source

[packages/core/src/record/callable.ts:1570](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L1570)

***

### from()

> `static` **from**\<`CallInput`, `CallOutput`\>(`callables`): [`CallableSequence`](CallableSequence.md)\<`CallInput`, `CallOutput`\>

Static method to create a `CallableSequence` instance from an array of callable-like objects.

#### Type parameters

• **CallInput**

• **CallOutput**

#### Parameters

• **callables**: [[`CallableLike`](../type-aliases/CallableLike.md)\<`CallInput`, `unknown`\>, `...CallableLike<unknown, unknown>[]`, [`CallableLike`](../type-aliases/CallableLike.md)\<`unknown`, `CallOutput`\>]

An array of callable-like objects including first, optional middle, and last callables.

#### Returns

[`CallableSequence`](CallableSequence.md)\<`CallInput`, `CallOutput`\>

A new `CallableSequence` instance created from the provided callable-like objects.

#### Source

[packages/core/src/record/callable.ts:1629](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L1629)

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

[`Callable`](Callable.md) . [`isCallable`](Callable.md#iscallable)

#### Source

[packages/core/src/record/callable.ts:196](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L196)

***

### isCallableSequence()

> `static` **isCallableSequence**(`anything`): `anything is CallableSequence<unknown, unknown>`

Static method to check if a given object is an instance of [CallableSequence](CallableSequence.md).

#### Parameters

• **anything**: `any`

The object to check.

#### Returns

`anything is CallableSequence<unknown, unknown>`

True if the object is a [CallableSequence](CallableSequence.md), false otherwise.

#### Source

[packages/core/src/record/callable.ts:1619](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L1619)
