# Class: CallableEach\<CallInputItem, CallOutputItem, CallOptions\>

A Callable extension that applies a given callable to each item in a collection of inputs.
This class is especially useful for batch operations where the same processing needs to be applied to each element in a list.

## Extends

- [`Callable`](Callable.md)\<`CallInputItem`[], `CallOutputItem`[], `CallOptions`\>

## Type parameters

• **CallInputItem**

Type of each individual input item that the callable will accept.

• **CallOutputItem**

Type of each individual output item that the callable will produce.

• **CallOptions** *extends* [`CallableConfig`](../type-aliases/CallableConfig.md)

Configuration options extending [CallableConfig](../type-aliases/CallableConfig.md), applicable to each individual call.

## Constructors

### new CallableEach()

> **new CallableEach**\<`CallInputItem`, `CallOutputItem`, `CallOptions`\>(`fields`): [`CallableEach`](CallableEach.md)\<`CallInputItem`, `CallOutputItem`, `CallOptions`\>

Constructor for creating an instance of CallableEach.

#### Parameters

• **fields**: [`CallableEachArgs`](../type-aliases/CallableEachArgs.md)\<`CallInputItem`, `CallOutputItem`, `CallOptions`\>

Contains the bound callable, which is applied to each item in the input array.

#### Returns

[`CallableEach`](CallableEach.md)\<`CallInputItem`, `CallOutputItem`, `CallOptions`\>

#### Overrides

[`Callable`](Callable.md) . [`constructor`](Callable.md#constructors)

#### Source

[packages/core/src/record/callable.ts:1139](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L1139)

## Properties

### \_isCallable

> **\_isCallable**: `boolean` = `true`

Indicates if the instance is callable. If false, then the callable cannot be invoked.

#### Overrides

[`Callable`](Callable.md) . [`_isCallable`](Callable.md#_iscallable)

#### Source

[packages/core/src/record/callable.ts:1120](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L1120)

***

### \_isSerializable

> **\_isSerializable**: `boolean` = `true`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Overrides

[`Callable`](Callable.md) . [`_isSerializable`](Callable.md#_isserializable)

#### Source

[packages/core/src/record/callable.ts:1122](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L1122)

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

[packages/core/src/record/callable.ts:1124](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L1124)

***

### bound

> **bound**: [`Callable`](Callable.md)\<`CallInputItem`, `CallOutputItem`, `CallOptions`\>

The callable bound to each item in the input array.

#### Source

[packages/core/src/record/callable.ts:1133](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L1133)

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

### \_invoke()

`Internal`

> `protected` **\_invoke**(`inputs`, `options`?): `Promise`\<`CallOutputItem`[]\>

#### Parameters

• **inputs**: `CallInputItem`[]

• **options?**: `Partial`\<`CallOptions`\>

#### Returns

`Promise`\<`CallOutputItem`[]\>

#### Source

[packages/core/src/record/callable.ts:1185](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L1185)

***

### \_streamIterator()

`Internal`

> **\_streamIterator**(`input`, `options`?): `AsyncGenerator`\<`CallOutputItem`[], `any`, `unknown`\>

Creates an async generator for streaming callable outputs.
This protected method is used internally for streaming operations.

#### Parameters

• **input**: `CallInputItem`[]

The input for the callable.

• **options?**: `Partial`\<`CallOptions`\>

Optional additional options for the callable.

#### Returns

`AsyncGenerator`\<`CallOutputItem`[], `any`, `unknown`\>

An async generator yielding callable outputs.

#### Inherited from

[`Callable`](Callable.md) . [`_streamIterator`](Callable.md#_streamiterator)

#### Source

[packages/core/src/record/callable.ts:429](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L429)

***

### batch()

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<`CallOutputItem`[][]\>

Batch calls invoke N times, where N is the length of inputs.

##### Parameters

• **inputs**: `CallInputItem`[][]

Array of inputs in each call in a batch.

• **options?**: `Partial`\<`CallOptions`\> \| `Partial`\<`CallOptions`\>[]

Either a single call options to apply to each call or an array of options for each call.

• **batchOptions?**: [`CallableBatchOptions`](../type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise`\<`CallOutputItem`[][]\>

An arrays of CallOutputs, or mixed CallOutputs and Errors (if returnExceptions is true).

##### Inherited from

[`Callable`](Callable.md) . [`batch`](Callable.md#batch)

##### Source

[packages/core/src/record/callable.ts:368](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L368)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| `CallOutputItem`[])[]\>

##### Parameters

• **inputs**: `CallInputItem`[][]

• **options?**: `Partial`\<`CallOptions`\> \| `Partial`\<`CallOptions`\>[]

• **batchOptions?**: [`CallableBatchOptions`](../type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise`\<(`Error` \| `CallOutputItem`[])[]\>

##### Inherited from

[`Callable`](Callable.md) . [`batch`](Callable.md#batch)

##### Source

[packages/core/src/record/callable.ts:374](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L374)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| `CallOutputItem`[])[]\>

##### Parameters

• **inputs**: `CallInputItem`[][]

• **options?**: `Partial`\<`CallOptions`\> \| `Partial`\<`CallOptions`\>[]

• **batchOptions?**: [`CallableBatchOptions`](../type-aliases/CallableBatchOptions.md)

##### Returns

`Promise`\<(`Error` \| `CallOutputItem`[])[]\>

##### Inherited from

[`Callable`](Callable.md) . [`batch`](Callable.md#batch)

##### Source

[packages/core/src/record/callable.ts:380](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L380)

***

### bind()

> **bind**(`kwargs`): [`CallableEach`](CallableEach.md)\<`CallInputItem`, `CallOutputItem`, `CallOptions`\>

Binds the given options to the callable and returns a new CallableEach instance.

#### Parameters

• **kwargs**: `Partial`\<`CallOptions`\>

Partial keyword arguments for the callable configuration.

#### Returns

[`CallableEach`](CallableEach.md)\<`CallInputItem`, `CallOutputItem`, `CallOptions`\>

A new CallableEach instance with the bound callable and given options.

#### Overrides

[`Callable`](Callable.md) . [`bind`](Callable.md#bind)

#### Source

[packages/core/src/record/callable.ts:1152](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L1152)

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

> **invoke**(`inputs`, `options`?): `Promise`\<`CallOutputItem`[]\>

Invokes the callable for each item in the provided array of inputs.
Each invocation is independent, and this method aggregates the results into an array.

#### Parameters

• **inputs**: `CallInputItem`[]

Array of input items, each will be passed individually to the bound callable.

• **options?**: `Partial`\<`CallOptions`\>

Optional configuration options applicable to each invocation.

#### Returns

`Promise`\<`CallOutputItem`[]\>

A promise that resolves to an array of results, where each result corresponds to an item in the input array.

#### Overrides

[`Callable`](Callable.md) . [`invoke`](Callable.md#invoke)

#### Source

[packages/core/src/record/callable.ts:1166](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L1166)

***

### map()

> **map**(): [`Callable`](Callable.md)\<`CallInputItem`[][], `CallOutputItem`[][], `CallOptions`\>

Creates a new [CallableEach](CallableEach.md) instance for mapping inputs to outputs.
This method allows applying the callable to each input in an array of inputs.

#### Returns

[`Callable`](Callable.md)\<`CallInputItem`[][], `CallOutputItem`[][], `CallOptions`\>

A new [CallableEach](CallableEach.md) instance for mapping operation.

#### Inherited from

[`Callable`](Callable.md) . [`map`](Callable.md#map)

#### Source

[packages/core/src/record/callable.ts:355](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L355)

***

### pipe()

> **pipe**\<`NewCallOutput`\>(`callableLike`): [`CallableSequence`](CallableSequence.md)\<`CallInputItem`[], `NewCallOutput`\>

Chains the current callable with another callable, creating a sequence.
This method allows sequential execution of multiple callables.

#### Type parameters

• **NewCallOutput**

#### Parameters

• **callableLike**: [`CallableLike`](../type-aliases/CallableLike.md)\<`CallOutputItem`[], `NewCallOutput`\>

The next callable in the sequence.

#### Returns

[`CallableSequence`](CallableSequence.md)\<`CallInputItem`[], `NewCallOutput`\>

A new [CallableSequence](CallableSequence.md) instance representing the chained callables.

#### Inherited from

[`Callable`](Callable.md) . [`pipe`](Callable.md#pipe)

#### Source

[packages/core/src/record/callable.ts:460](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L460)

***

### stream()

> **stream**(`input`, `options`?): `Promise`\<`ReadableStreamAsyncIterable`\<`CallOutputItem`[]\>\>

Creates a readable stream for the callable outputs.
This method allows streaming the outputs of the callable for continuous data.

#### Parameters

• **input**: `CallInputItem`[]

The input for the callable.

• **options?**: `Partial`\<`CallOptions`\>

Optional additional options for the callable.

#### Returns

`Promise`\<`ReadableStreamAsyncIterable`\<`CallOutputItem`[]\>\>

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

> **withConfig**(`config`): [`CallableBind`](CallableBind.md)\<`CallInputItem`[], `CallOutputItem`[], `CallOptions`\>

Creates a new [CallableBind](CallableBind.md) instance with the specified configuration.
This method allows reconfiguration of the callable instance.

#### Parameters

• **config**: [`CallableConfig`](../type-aliases/CallableConfig.md)

The configuration to apply to the new callable instance.

#### Returns

[`CallableBind`](CallableBind.md)\<`CallInputItem`[], `CallOutputItem`[], `CallOptions`\>

A new [CallableBind](CallableBind.md) instance with the given configuration.

#### Inherited from

[`Callable`](Callable.md) . [`withConfig`](Callable.md#withconfig)

#### Source

[packages/core/src/record/callable.ts:314](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L314)

***

### withFallbacks()

> **withFallbacks**(`fields`): [`CallableWithFallbacks`](CallableWithFallbacks.md)\<`CallInputItem`[], `CallOutputItem`[]\>

Creates a new [CallableWithFallbacks](CallableWithFallbacks.md) instance with specified fallbacks.
This method allows defining fallback callables for error handling or retries.

#### Parameters

• **fields**

Object containing an array of fallback callables.

• **fields.fallbacks**: [`Callable`](Callable.md)\<`CallInputItem`[], `CallOutputItem`[], [`CallableConfig`](../type-aliases/CallableConfig.md)\>[]

#### Returns

[`CallableWithFallbacks`](CallableWithFallbacks.md)\<`CallInputItem`[], `CallOutputItem`[]\>

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

[packages/core/src/record/callable.ts:1126](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L1126)

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
