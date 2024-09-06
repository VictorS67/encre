# Class: CallableWithFallbacks\<CallInput, CallOutput\>

A Callable extension that manages a primary callable along with a list of fallback callables.
This structure is used to attempt an operation with the primary callable first and then sequentially
try the fallback callables until one succeeds or all fail.

## Extends

- [`Callable`](Callable.md)\<`CallInput`, `CallOutput`\>

## Type parameters

• **CallInput**

Type of input the callable and its fallbacks will accept.

• **CallOutput**

Type of output the callable and its fallbacks will produce.

## Constructors

### new CallableWithFallbacks()

> **new CallableWithFallbacks**\<`CallInput`, `CallOutput`\>(`fields`): [`CallableWithFallbacks`](CallableWithFallbacks.md)\<`CallInput`, `CallOutput`\>

Constructs a new instance of CallableWithFallbacks with specified primary callable and fallbacks.

#### Parameters

• **fields**: [`CallableWithFallbacksArg`](../type-aliases/CallableWithFallbacksArg.md)\<`CallInput`, `CallOutput`\>

An object specifying the primary callable and a list of fallback callables.

#### Returns

[`CallableWithFallbacks`](CallableWithFallbacks.md)\<`CallInput`, `CallOutput`\>

#### Overrides

[`Callable`](Callable.md) . [`constructor`](Callable.md#constructors)

#### Source

[packages/core/src/record/callable.ts:1330](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L1330)

## Properties

### \_isCallable

> **\_isCallable**: `boolean` = `true`

Indicates if the instance is callable. If false, then the callable cannot be invoked.

#### Overrides

[`Callable`](Callable.md) . [`_isCallable`](Callable.md#_iscallable)

#### Source

[packages/core/src/record/callable.ts:1306](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L1306)

***

### \_isSerializable

> **\_isSerializable**: `boolean` = `true`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Overrides

[`Callable`](Callable.md) . [`_isSerializable`](Callable.md#_isserializable)

#### Source

[packages/core/src/record/callable.ts:1308](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L1308)

***

### \_kwargs

> **\_kwargs**: `SerializedFields`

Key-value pairs of properties to be serialized.

#### Inherited from

[`Callable`](Callable.md) . [`_kwargs`](Callable.md#_kwargs)

#### Source

[packages/core/src/load/serializable.ts:168](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L168)

***

### \_namespace

> **\_namespace**: `string`[]

Unique namespace identifier for the serialized object, represented as an array of strings.

#### Overrides

[`Callable`](Callable.md) . [`_namespace`](Callable.md#_namespace)

#### Source

[packages/core/src/record/callable.ts:1310](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L1310)

***

### callable

> `protected` **callable**: [`Callable`](Callable.md)\<`CallInput`, `CallOutput`, [`CallableConfig`](../type-aliases/CallableConfig.md)\>

The primary callable to be invoked initially.

#### Source

[packages/core/src/record/callable.ts:1319](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L1319)

***

### fallbacks

> `protected` **fallbacks**: [`Callable`](Callable.md)\<`CallInput`, `CallOutput`, [`CallableConfig`](../type-aliases/CallableConfig.md)\>[]

An array of fallback callables to be invoked in order if the primary callable fails.

#### Source

[packages/core/src/record/callable.ts:1324](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L1324)

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

[packages/core/src/record/callable.ts:429](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L429)

***

### batch()

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<`CallOutput`[]\>

Batch processes the input array by invoking the primary callable and fallbacks for each input.
This method applies the same fallback mechanism to each individual input in parallel.

##### Parameters

• **inputs**: `CallInput`[]

Array of inputs to process.

• **options?**: `Partial` \<[`CallableConfig`](../type-aliases/CallableConfig.md)\> \| `Partial` \<[`CallableConfig`](../type-aliases/CallableConfig.md)\>[]

Optional configuration for each invocation or a single configuration for all.

• **batchOptions?**: [`CallableBatchOptions`](../type-aliases/CallableBatchOptions.md) & `object`

Optional settings for batch execution, such as concurrency limits and error handling strategies.

##### Returns

`Promise`\<`CallOutput`[]\>

A promise that resolves to an array of results or errors, based on the execution and batch options.

##### Overrides

[`Callable`](Callable.md) . [`batch`](Callable.md#batch)

##### Source

[packages/core/src/record/callable.ts:1391](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L1391)

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

[packages/core/src/record/callable.ts:1397](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L1397)

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

[packages/core/src/record/callable.ts:1403](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L1403)

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

[packages/core/src/record/callable.ts:343](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L343)

***

### callables()

> **callables**(): `Generator` \<[`Callable`](Callable.md)\<`CallInput`, `CallOutput`, [`CallableConfig`](../type-aliases/CallableConfig.md)\>, `void`, `unknown`\>

Generator function to iterate over the primary callable and fallbacks.

#### Returns

`Generator` \<[`Callable`](Callable.md)\<`CallInput`, `CallOutput`, [`CallableConfig`](../type-aliases/CallableConfig.md)\>, `void`, `unknown`\>

#### Yields

Each callable in the sequence (primary followed by fallbacks).

#### Source

[packages/core/src/record/callable.ts:1341](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L1341)

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

[packages/core/src/record/callable.ts:511](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L511)

***

### invoke()

> **invoke**(`input`, `options`?): `Promise`\<`CallOutput`\>

Invokes the primary callable with the given input, and on failure, tries each fallback callable in sequence.
If all callables fail, it rethrows the first encountered error.

#### Parameters

• **input**: `CallInput`

The input for the callables.

• **options?**: `Partial` \<[`CallableConfig`](../type-aliases/CallableConfig.md)\>

Optional callable configuration options, which may influence execution.

#### Returns

`Promise`\<`CallOutput`\>

A promise that resolves to the output of the first successful callable or rejects if all fail.

#### Overrides

[`Callable`](Callable.md) . [`invoke`](Callable.md#invoke)

#### Throws

Error if all callables fail, with the first error encountered being propagated.

#### Source

[packages/core/src/record/callable.ts:1357](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L1357)

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

[packages/core/src/record/callable.ts:355](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L355)

***

### pipe()

> **pipe**\<`NewCallOutput`\>(`callableLike`): [`CallableSequence`](CallableSequence.md)\<`CallInput`, `NewCallOutput`\>

Chains the current callable with another callable, creating a sequence.
This method allows sequential execution of multiple callables.

#### Type parameters

• **NewCallOutput**

#### Parameters

• **callableLike**: [`CallableLike`](../type-aliases/CallableLike.md)\<`CallOutput`, `NewCallOutput`\>

The next callable in the sequence.

#### Returns

[`CallableSequence`](CallableSequence.md)\<`CallInput`, `NewCallOutput`\>

A new [CallableSequence](CallableSequence.md) instance representing the chained callables.

#### Inherited from

[`Callable`](Callable.md) . [`pipe`](Callable.md#pipe)

#### Source

[packages/core/src/record/callable.ts:460](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L460)

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

[packages/core/src/record/callable.ts:444](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L444)

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

[packages/core/src/load/serializable.ts:665](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L665)

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

[packages/core/src/load/serializable.ts:478](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L478)

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

[packages/core/src/load/serializable.ts:448](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L448)

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

[packages/core/src/load/serializable.ts:462](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L462)

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

[packages/core/src/record/callable.ts:314](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L314)

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

[packages/core/src/record/callable.ts:327](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L327)

***

### \_name()

> `static` **\_name**(): `string`

Generates a unique name for the class, typically used for serialization identification.

#### Returns

`string`

#### Overrides

[`Callable`](Callable.md) . [`_name`](Callable.md#_name)

#### Source

[packages/core/src/record/callable.ts:1312](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L1312)

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

[packages/core/src/record/callable.ts:196](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L196)
