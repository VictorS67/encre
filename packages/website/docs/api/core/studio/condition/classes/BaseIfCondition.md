# Class: `abstract` BaseIfCondition\<CallInput, CallOutput, CallOptions\>

Abstract base class for defining conditional logic with various branches ('if', 'else-if', 'otherwise').

## Extends

- [`Callable`](../../../record/callable/classes/Callable.md)\<`CallInput`, `CallOutput`, `CallOptions`\>

## Extended by

- [`IfCondition`](IfCondition.md)

## Type parameters

• **CallInput** *extends* [`IfConditionSource`](../type-aliases/IfConditionSource.md) = [`IfConditionSource`](../type-aliases/IfConditionSource.md)

• **CallOutput** *extends* [`IfConditionTarget`](../type-aliases/IfConditionTarget.md) = [`IfConditionTarget`](../type-aliases/IfConditionTarget.md)

• **CallOptions** *extends* [`IfConditionOptions`](../type-aliases/IfConditionOptions.md) = [`IfConditionOptions`](../type-aliases/IfConditionOptions.md)

## Implements

- [`IfConditionParams`](../interfaces/IfConditionParams.md)

## Constructors

### new BaseIfCondition()

> **new BaseIfCondition**\<`CallInput`, `CallOutput`, `CallOptions`\>(`fields`?): [`BaseIfCondition`](BaseIfCondition.md)\<`CallInput`, `CallOutput`, `CallOptions`\>

#### Parameters

• **fields?**: [`IfConditionParams`](../interfaces/IfConditionParams.md)

#### Returns

[`BaseIfCondition`](BaseIfCondition.md)\<`CallInput`, `CallOutput`, `CallOptions`\>

#### Overrides

[`Callable`](../../../record/callable/classes/Callable.md) . [`constructor`](../../../record/callable/classes/Callable.md#constructors)

#### Source

[packages/core/src/studio/condition.ts:209](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/condition.ts#L209)

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

> **\_isSerializable**: `boolean` = `true`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Overrides

[`Callable`](../../../record/callable/classes/Callable.md) . [`_isSerializable`](../../../record/callable/classes/Callable.md#_isserializable)

#### Source

[packages/core/src/studio/condition.ts:174](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/condition.ts#L174)

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

[packages/core/src/studio/condition.ts:176](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/condition.ts#L176)

***

### actions

> **actions**: `object`

A map of actions tied to specific targets, each associated with a series of conditions.

#### Index signature

 \[`target`: `string`\]: [[`IfConditionField`](../type-aliases/IfConditionField.md), `...ElseConditionField[]`]

#### Implementation of

[`IfConditionParams`](../interfaces/IfConditionParams.md) . [`actions`](../interfaces/IfConditionParams.md#actions)

#### Source

[packages/core/src/studio/condition.ts:191](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/condition.ts#L191)

***

### registry

> `readonly` **registry**: [`GuardrailRegistration`](../../registration/guardrails/classes/GuardrailRegistration.md)\<`never`, `never`, `never`\>

Optional registration of guardrails that provide additional constraints or rules in plugins.

#### Implementation of

[`IfConditionParams`](../interfaces/IfConditionParams.md) . [`registry`](../interfaces/IfConditionParams.md#registry)

#### Source

[packages/core/src/studio/condition.ts:198](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/condition.ts#L198)

***

### sources

> **sources**: `string`[]

List of source identifiers involved in the conditions.

#### Implementation of

[`IfConditionParams`](../interfaces/IfConditionParams.md) . [`sources`](../interfaces/IfConditionParams.md#sources)

#### Source

[packages/core/src/studio/condition.ts:181](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/condition.ts#L181)

***

### targets

> **targets**: `string`[]

List of target identifiers that results may be assigned to.

#### Implementation of

[`IfConditionParams`](../interfaces/IfConditionParams.md) . [`targets`](../interfaces/IfConditionParams.md#targets)

#### Source

[packages/core/src/studio/condition.ts:186](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/condition.ts#L186)

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

> `get` **\_attributes**(): `object`

Retrieves attributes of the object.

#### Returns

`object`

An object representing attributes, or undefined if none are defined.

##### actions

> **actions**: `object` = `{}`

##### sources

> **sources**: `never`[] = `[]`

##### targets

> **targets**: `never`[] = `[]`

##### variables

> **variables**: `object` = `{}`

#### Source

[packages/core/src/studio/condition.ts:200](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/condition.ts#L200)

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

### \_isValidIfConditionField()

`Internal`

> `protected` **\_isValidIfConditionField**(`conditions`): `boolean`

Validates the sequence of condition fields to ensure they are in the correct order and of correct types.
Specifically, it checks that the sequence starts with an 'if', followed by zero or more 'else-if', and
optionally ends with an 'otherwise'.

#### Parameters

• **conditions**: [[`IfConditionField`](../type-aliases/IfConditionField.md), `...ElseConditionField[]`]

An array of condition fields.

#### Returns

`boolean`

True if the sequence is valid, false otherwise.

#### Example

```
const conditions = [
  { type: 'if', ruleCollection: new RuleCollection(...) },
  { type: 'else-if', ruleCollection: new RuleCollection(...) },
  { type: 'otherwise' }
];
const isValid = ifCondition._isValidIfConditionField(conditions);
console.log(isValid); // Output: true or false
```

#### Source

[packages/core/src/studio/condition.ts:486](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/condition.ts#L486)

***

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

### addConditionToAction()

> **addConditionToAction**(`target`, `conditionField`): `boolean`

Adds a new condition to an existing action sequence. The condition can be either 'else-if' or 'otherwise'.
This method enforces that 'otherwise' can only be added at the end and only once.

#### Parameters

• **target**: `string`

The target key where the condition should be added.

• **conditionField**: [`ElseConditionField`](../type-aliases/ElseConditionField.md)

The condition field (either 'else-if' or 'otherwise') to add.

#### Returns

`boolean`

True if the condition was added successfully, false if it could not be added.

#### Example

```
const success = ifCondition.addConditionToAction('logEntry', {
  type: 'else-if',
  ruleCollection: new RuleCollection(...),
  source: 'appState'
});
console.log(success); // Output: true or false based on addition success
```

#### Source

[packages/core/src/studio/condition.ts:277](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/condition.ts#L277)

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

### insertConditionToAction()

> **insertConditionToAction**(`target`, `index`, `conditionField`): `boolean`

Inserts a condition into an existing action sequence at a specified index.
The method enforces that no 'else-if' conditions can be added after an 'otherwise'.

#### Parameters

• **target**: `string`

The target key where the condition should be inserted.

• **index**: `number`

The index at which to insert the condition.

• **conditionField**: [`ElseConditionField`](../type-aliases/ElseConditionField.md)

The condition field to insert.

#### Returns

`boolean`

True if the condition was inserted successfully, false if it could not be inserted.

#### Example

```
const success = ifCondition.insertConditionToAction('displayMessage', 1, {
  type: 'else-if',
  ruleCollection: new RuleCollection(...),
  source: 'userInput'
});
console.log(success); // Output: true or false
```

#### Source

[packages/core/src/studio/condition.ts:326](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/condition.ts#L326)

***

### invoke()

> `abstract` **invoke**(`input`, `options`?): `Promise`\<`CallOutput`\>

Abstract method to invoke the conditional logic based on the provided input and options.
Implementations must define how to process the input and apply conditions.

#### Parameters

• **input**: `CallInput`

The source data to evaluate against the conditions.

• **options?**: `Partial`\<`CallOptions`\>

Optional parameters that may influence the conditional logic.

#### Returns

`Promise`\<`CallOutput`\>

A promise that resolves to the outcome of the conditional logic.

#### Overrides

[`Callable`](../../../record/callable/classes/Callable.md) . [`invoke`](../../../record/callable/classes/Callable.md#invoke)

#### Source

[packages/core/src/studio/condition.ts:463](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/condition.ts#L463)

***

### isIfConditionSource()

> **isIfConditionSource**(`input`): `input is IfConditionSource`

Checks if a given input conforms to the expected sources for the if conditions.

#### Parameters

• **input**: `any`

The input object to check.

#### Returns

`input is IfConditionSource`

True if the input contains all expected source keys, false otherwise.

#### Example

```
const input = { userData: {...}, systemData: {...} };
const isValidSource = ifCondition.isIfConditionSource(input);
console.log(isValidSource); // Output: true or false
```

#### Source

[packages/core/src/studio/condition.ts:452](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/condition.ts#L452)

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

### removeAction()

> **removeAction**(`target`): `boolean`

Removes a specified action from the conditions map based on the target.

#### Parameters

• **target**: `string`

The target key corresponding to the action to be removed.

#### Returns

`boolean`

True if the action was successfully removed, false if the action did not exist.

#### Example

```
const removed = ifCondition.removeAction('logEntry');
console.log(removed); // Output: true or false based on existence and removal success
```

#### Source

[packages/core/src/studio/condition.ts:250](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/condition.ts#L250)

***

### removeConditionFromAction()

> **removeConditionFromAction**(`target`, `index`): `boolean`

Removes a condition from an action sequence at a specified index.
The method ensures that 'if' conditions cannot be removed.

#### Parameters

• **target**: `string`

The target key from which the condition should be removed.

• **index**: `number`

The index of the condition to remove.

#### Returns

`boolean`

True if the condition was removed successfully, false if it could not be removed.

#### Example

```
const success = ifCondition.removeConditionFromAction('displayMessage', 2);
console.log(success); // Output: true or false
```

#### Source

[packages/core/src/studio/condition.ts:385](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/condition.ts#L385)

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

### updateConditionInAction()

> **updateConditionInAction**(`target`, `index`, `conditionField`): `boolean`

Updates a specific condition within an action sequence at a given index.
The method ensures that the type of the condition matches the type being updated.

#### Parameters

• **target**: `string`

The target key of the action where the condition update should occur.

• **index**: `number`

The index of the condition to update.

• **conditionField**: [`ConditionField`](../type-aliases/ConditionField.md)

The new condition field to replace the existing one.

#### Returns

`boolean`

True if the condition was updated successfully, false otherwise.

#### Example

```
const success = ifCondition.updateConditionInAction('logEntry', 1, {
  type: 'else-if',
  ruleCollection: new RuleCollection(...),
  source: 'userActivity'
});
console.log(success); // Output: true or false
```

#### Source

[packages/core/src/studio/condition.ts:419](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/condition.ts#L419)

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
