# Class: VariableValidator\<CallInput, CallOutput, CallOptions\>

A class responsible for validating a set of variables against defined rules.
Extends `BaseEvent` to utilize event-driven architecture for validation processes.

## Example

```typescript
const validator = new VariableValidator({
  variables: ['username', 'email'],
  rules: {
    specific: {
      username: StringRule.exists()
    },
    default: BooleanRule.isTrue(),
    exclude: ['email']
  }
});
const result = await validator.invoke({ username: 'john_doe', email: 'john@example.com' });
console.log(result);
```

## Extends

- [`BaseEvent`](../../../../../base/classes/BaseEvent.md)\<`CallInput`, `CallOutput`, `CallOptions`\>

## Type parameters

• **CallInput** *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

The type of the input record, typically a dictionary.

• **CallOutput** = [`ValidateResult`](../../../type-aliases/ValidateResult.md)

The expected output type, typically a validation result.

• **CallOptions** *extends* [`CallableConfig`](../../../../../../record/callable/type-aliases/CallableConfig.md) = [`CallableConfig`](../../../../../../record/callable/type-aliases/CallableConfig.md)

Configuration options inherited from CallableConfig.

## Implements

- [`VariableValidatorParams`](../interfaces/VariableValidatorParams.md)

## Constructors

### new VariableValidator()

> **new VariableValidator**\<`CallInput`, `CallOutput`, `CallOptions`\>(`fields`?): [`VariableValidator`](VariableValidator.md)\<`CallInput`, `CallOutput`, `CallOptions`\>

Initializes a new instance of VariableValidator with optional configuration parameters.
Throws an error if specific rules are provided for variables not included in the list.

#### Parameters

• **fields?**: `Partial` \<[`VariableValidatorParams`](../interfaces/VariableValidatorParams.md)\>

Optional parameters to set up the validator.

#### Returns

[`VariableValidator`](VariableValidator.md)\<`CallInput`, `CallOutput`, `CallOptions`\>

#### Overrides

[`BaseEvent`](../../../../../base/classes/BaseEvent.md) . [`constructor`](../../../../../base/classes/BaseEvent.md#constructors)

#### Source

[packages/core/src/events/inference/validate/validators/variable.ts:100](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/validators/variable.ts#L100)

## Properties

### \_isCallable

> **\_isCallable**: `boolean` = `true`

Indicates if the instance is callable. If false, then the callable cannot be invoked.

#### Inherited from

[`BaseEvent`](../../../../../base/classes/BaseEvent.md) . [`_isCallable`](../../../../../base/classes/BaseEvent.md#_iscallable)

#### Source

[packages/core/src/record/callable.ts:188](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L188)

***

### \_isSerializable

> **\_isSerializable**: `boolean` = `true`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Overrides

[`BaseEvent`](../../../../../base/classes/BaseEvent.md) . [`_isSerializable`](../../../../../base/classes/BaseEvent.md#_isserializable)

#### Source

[packages/core/src/events/inference/validate/validators/variable.ts:74](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/validators/variable.ts#L74)

***

### \_kwargs

> **\_kwargs**: `SerializedFields`

Key-value pairs of properties to be serialized.

#### Inherited from

[`BaseEvent`](../../../../../base/classes/BaseEvent.md) . [`_kwargs`](../../../../../base/classes/BaseEvent.md#_kwargs)

#### Source

[packages/core/src/load/serializable.ts:168](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L168)

***

### \_namespace

> **\_namespace**: `string`[]

Unique namespace identifier for the serialized object, represented as an array of strings.

#### Inherited from

[`BaseEvent`](../../../../../base/classes/BaseEvent.md) . [`_namespace`](../../../../../base/classes/BaseEvent.md#_namespace)

#### Source

[packages/core/src/events/base.ts:44](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L44)

***

### callbacks?

`Experimental`

> `optional` **callbacks**: `any`

not-implemented yet

#### Implementation of

[`VariableValidatorParams`](../interfaces/VariableValidatorParams.md) . [`callbacks`](../interfaces/VariableValidatorParams.md#callbacks)

#### Inherited from

[`BaseEvent`](../../../../../base/classes/BaseEvent.md) . [`callbacks`](../../../../../base/classes/BaseEvent.md#callbacks)

#### Source

[packages/core/src/events/base.ts:79](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L79)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Implementation of

[`VariableValidatorParams`](../interfaces/VariableValidatorParams.md) . [`metadata`](../interfaces/VariableValidatorParams.md#metadata)

#### Inherited from

[`BaseEvent`](../../../../../base/classes/BaseEvent.md) . [`metadata`](../../../../../base/classes/BaseEvent.md#metadata)

#### Source

[packages/core/src/events/base.ts:74](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L74)

***

### name?

`Experimental`

> `optional` **name**: `string`

The name of the callable, used for identification or logging.

not-implement yet

#### Implementation of

[`VariableValidatorParams`](../interfaces/VariableValidatorParams.md) . [`name`](../interfaces/VariableValidatorParams.md#name)

#### Inherited from

[`BaseEvent`](../../../../../base/classes/BaseEvent.md) . [`name`](../../../../../base/classes/BaseEvent.md#name)

#### Source

[packages/core/src/events/base.ts:61](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L61)

***

### rules

> **rules**: [`VariableRules`](../interfaces/VariableRules.md)

Structured rules for validation as defined by VariableRules.

#### Implementation of

[`VariableValidatorParams`](../interfaces/VariableValidatorParams.md) . [`rules`](../interfaces/VariableValidatorParams.md#rules)

#### Source

[packages/core/src/events/inference/validate/validators/variable.ts:92](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/validators/variable.ts#L92)

***

### tags?

`Experimental`

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables.

not-implement yet

#### Implementation of

[`VariableValidatorParams`](../interfaces/VariableValidatorParams.md) . [`tags`](../interfaces/VariableValidatorParams.md#tags)

#### Inherited from

[`BaseEvent`](../../../../../base/classes/BaseEvent.md) . [`tags`](../../../../../base/classes/BaseEvent.md#tags)

#### Source

[packages/core/src/events/base.ts:69](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L69)

***

### variables

> **variables**: `string`[]

List of variables to validate.

#### Implementation of

[`VariableValidatorParams`](../interfaces/VariableValidatorParams.md) . [`variables`](../interfaces/VariableValidatorParams.md#variables)

#### Source

[packages/core/src/events/inference/validate/validators/variable.ts:87](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/validators/variable.ts#L87)

***

### verbose

`Experimental`

> **verbose**: `boolean`

Specifies whether the event should provide verbose output, such as detailed logs or response texts.
This can be useful for debugging or detailed monitoring of event handling processes.

not-implement yet

#### Implementation of

[`VariableValidatorParams`](../interfaces/VariableValidatorParams.md) . [`verbose`](../interfaces/VariableValidatorParams.md#verbose)

#### Inherited from

[`BaseEvent`](../../../../../base/classes/BaseEvent.md) . [`verbose`](../../../../../base/classes/BaseEvent.md#verbose)

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

### \_eventNamespace()

> **\_eventNamespace**(): `string`[]

#### Returns

`string`[]

#### Overrides

`BaseEvent._eventNamespace`

#### Source

[packages/core/src/events/inference/validate/validators/variable.ts:76](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/validators/variable.ts#L76)

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

[`BaseEvent`](../../../../../base/classes/BaseEvent.md) . [`_streamIterator`](../../../../../base/classes/BaseEvent.md#_streamiterator)

#### Source

[packages/core/src/record/callable.ts:429](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L429)

***

### \_validate()

`Internal`

> `protected` **\_validate**(`variableValues`): `Promise` \<[`ValidateResult`](../../../type-aliases/ValidateResult.md)\>

Executes validation against a set of variable values. Validates each variable against its applicable rule.
Returns a `ValidateResult` indicating whether all validations passed.

#### Parameters

• **variableValues**: `Record`\<`string`, `unknown`\>

A record of variable names and their corresponding values to validate.

#### Returns

`Promise` \<[`ValidateResult`](../../../type-aliases/ValidateResult.md)\>

A promise resolving to a `ValidateResult`.

#### Example

```typescript
const validator = new VariableValidator({
  variables: ['username', 'email'],
  rules: {
    specific: {
      username: StringRule.exists()
    },
    default: BooleanRule.isTrue(),
    exclude: ['email']
  }
});

const result = await validator._validate({ username: 'john_doe', email: 'john@example.com' });
console.log(result);
// Outputs: { isValid: true }
```

#### Source

[packages/core/src/events/inference/validate/validators/variable.ts:448](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/validators/variable.ts#L448)

***

### addDefaultRule()

> **addDefaultRule**(`guardrail`): `void`

Sets or replaces the default rule applied to all variables unless specifically overridden or excluded.
Warns if replacing an existing default rule.

#### Parameters

• **guardrail**: [`BaseRule`](../../../guardrails/base/classes/BaseRule.md)\<`any`\>

The default rule to apply to all non-excluded variables.

#### Returns

`void`

#### Example

```typescript
const validator = new VariableValidator({
  variables: ['username', 'email'],
  rules: {
    specific: {
      username: StringRule.exists()
    },
    exclude: ['email']
  }
});

const defaultRule = BooleanRule.isTrue();
validator.addDefaultRule(defaultRule);
// Sets a new default rule for all applicable variables.
```

#### Source

[packages/core/src/events/inference/validate/validators/variable.ts:384](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/validators/variable.ts#L384)

***

### addExcludeVariable()

> **addExcludeVariable**(`variable`): `void`

Adds a variable to the exclusion list, which will prevent it from being validated.
Throws an error if the variable is not known to this validator.

#### Parameters

• **variable**: `string`

The variable name to exclude from validation.

#### Returns

`void`

#### Throws

Error if the variable is not managed by this validator.

#### Example

```typescript
const validator = new VariableValidator({
  variables: ['username', 'email'],
  rules: {
    specific: {
      username: StringRule.exists()
    },
    default: BooleanRule.isTrue(),
  }
});

validator.addExcludeVariable('email');
// 'email' will now be excluded from validation.
```

#### Source

[packages/core/src/events/inference/validate/validators/variable.ts:223](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/validators/variable.ts#L223)

***

### addSpecificRule()

> **addSpecificRule**(`variable`, `guardrail`): `void`

Adds a specific rule to a variable. If the variable is excluded, a warning is logged but the rule is added.
Throws an error if the variable is not known to this validator.

#### Parameters

• **variable**: `string`

The variable to apply the specific rule.

• **guardrail**: [`BaseRule`](../../../guardrails/base/classes/BaseRule.md)\<`any`\>

The rule to apply to the variable.

#### Returns

`void`

#### Throws

Error if the variable is not managed by this validator.

#### Example

```typescript
const validator = new VariableValidator({
  variables: ['username', 'email'],
  rules: {
    specific: {
      username: StringRule.exists()
    },
    default: BooleanRule.isTrue(),
    exclude: ['email']
  }
});

const lengthRule = new StringRule({
  description: "Must be at least 10 characters long",
  func: await (input) => input.length >= 10
});

validator.addSpecificRule('password', lengthRule);
// Adds a specific rule for 'password'.
```

#### Source

[packages/core/src/events/inference/validate/validators/variable.ts:299](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/validators/variable.ts#L299)

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

• **batchOptions?**: [`CallableBatchOptions`](../../../../../../record/callable/type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise`\<`CallOutput`[]\>

An arrays of CallOutputs, or mixed CallOutputs and Errors (if returnExceptions is true).

##### Inherited from

[`BaseEvent`](../../../../../base/classes/BaseEvent.md) . [`batch`](../../../../../base/classes/BaseEvent.md#batch)

##### Source

[packages/core/src/record/callable.ts:368](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L368)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| `CallOutput`)[]\>

##### Parameters

• **inputs**: `CallInput`[]

• **options?**: `Partial`\<`CallOptions`\> \| `Partial`\<`CallOptions`\>[]

• **batchOptions?**: [`CallableBatchOptions`](../../../../../../record/callable/type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise`\<(`Error` \| `CallOutput`)[]\>

##### Inherited from

[`BaseEvent`](../../../../../base/classes/BaseEvent.md) . [`batch`](../../../../../base/classes/BaseEvent.md#batch)

##### Source

[packages/core/src/record/callable.ts:374](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L374)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| `CallOutput`)[]\>

##### Parameters

• **inputs**: `CallInput`[]

• **options?**: `Partial`\<`CallOptions`\> \| `Partial`\<`CallOptions`\>[]

• **batchOptions?**: [`CallableBatchOptions`](../../../../../../record/callable/type-aliases/CallableBatchOptions.md)

##### Returns

`Promise`\<(`Error` \| `CallOutput`)[]\>

##### Inherited from

[`BaseEvent`](../../../../../base/classes/BaseEvent.md) . [`batch`](../../../../../base/classes/BaseEvent.md#batch)

##### Source

[packages/core/src/record/callable.ts:380](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L380)

***

### bind()

> **bind**(`kwargs`): [`Callable`](../../../../../../record/callable/classes/Callable.md)\<`CallInput`, `CallOutput`, `CallOptions`\>

Creates a new [CallableBind](../../../../../../record/callable/classes/CallableBind.md) instance with the specified keyword arguments.
This method allows partial reconfiguration of the callable instance.

#### Parameters

• **kwargs**: `Partial`\<`CallOptions`\>

Partial keyword arguments for the callable configuration.

#### Returns

[`Callable`](../../../../../../record/callable/classes/Callable.md)\<`CallInput`, `CallOutput`, `CallOptions`\>

A new [CallableBind](../../../../../../record/callable/classes/CallableBind.md) instance with the given keyword arguments.

#### Inherited from

[`BaseEvent`](../../../../../base/classes/BaseEvent.md) . [`bind`](../../../../../base/classes/BaseEvent.md#bind)

#### Source

[packages/core/src/record/callable.ts:343](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L343)

***

### getAllRules()

> **getAllRules**(): `Record`\<`string`, `null` \| [`BaseRule`](../../../guardrails/base/classes/BaseRule.md)\<`any`\>\>

Retrieves all applicable rules for each variable, considering exclusions and specific rules.
Returns a mapping from variable names to their applicable rules, or `null` if excluded.

#### Returns

`Record`\<`string`, `null` \| [`BaseRule`](../../../guardrails/base/classes/BaseRule.md)\<`any`\>\>

A record mapping each variable to its applicable rule or `null`.

#### Example

```typescript
const validator = new VariableValidator({
  variables: ['username', 'email'],
  rules: {
    specific: {
      username: StringRule.exists()
    },
    default: BooleanRule.isTrue(),
    exclude: ['email']
  }
});
const allRules = validator.getAllRules();
console.log(allRules);
// Outputs: { username: <specific rule equvalent to StringRule.exists()>, email: null }
```

#### Source

[packages/core/src/events/inference/validate/validators/variable.ts:141](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/validators/variable.ts#L141)

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

[`BaseEvent`](../../../../../base/classes/BaseEvent.md) . [`getAttributes`](../../../../../base/classes/BaseEvent.md#getattributes)

#### Source

[packages/core/src/record/callable.ts:511](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L511)

***

### getRule()

> **getRule**(`variable`): `null` \| [`BaseRule`](../../../guardrails/base/classes/BaseRule.md)\<`any`\>

Retrieves the applicable rule for a given variable, considering exclusions and specific rules.
Throws an error if the variable is not managed by this validator.

#### Parameters

• **variable**: `string`

The variable name to retrieve the rule for.

#### Returns

`null` \| [`BaseRule`](../../../guardrails/base/classes/BaseRule.md)\<`any`\>

The applicable rule for the variable or `null` if excluded.

#### Throws

Error if the variable is not known to this validator.

#### Example

```typescript
const validator = new VariableValidator({
  variables: ['username', 'email'],
  rules: {
    specific: {
      username: StringRule.exists()
    },
    default: BooleanRule.isTrue(),
    exclude: ['email']
  }
});

const rule = validator.getRule('username');
console.log(rule);
// Outputs: <specific rule equvalent to StringRule.exists()>
```

#### Source

[packages/core/src/events/inference/validate/validators/variable.ts:185](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/validators/variable.ts#L185)

***

### invoke()

> **invoke**(`input`, `options`?): `Promise`\<`CallOutput`\>

Invokes the validation process for the given input variables, using the `validate` method.
This method is typically used when this class is treated as a callable in a system where `invoke` is the standard method for execution.

#### Parameters

• **input**: `CallInput`

The input variables to validate.

• **options?**: `Partial`\<`CallOptions`\>

Optional additional configuration.

#### Returns

`Promise`\<`CallOutput`\>

The validation result as a `CallOutput`, essentially a `ValidateResult`.

#### Overrides

[`BaseEvent`](../../../../../base/classes/BaseEvent.md) . [`invoke`](../../../../../base/classes/BaseEvent.md#invoke)

#### Example

```typescript
const validator = new VariableValidator({
  variables: ['username', 'email'],
  rules: {
    specific: {
      username: StringRule.exists()
    },
    default: BooleanRule.isTrue(),
    exclude: ['email']
  }
});

const result = await validator.invoke({ username: 'john_doe', email: 'john@example.com' });
console.log(result);
// Outputs: { isValid: true }
```

#### Source

[packages/core/src/events/inference/validate/validators/variable.ts:570](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/validators/variable.ts#L570)

***

### map()

> **map**(): [`Callable`](../../../../../../record/callable/classes/Callable.md)\<`CallInput`[], `CallOutput`[], `CallOptions`\>

Creates a new [CallableEach](../../../../../../record/callable/classes/CallableEach.md) instance for mapping inputs to outputs.
This method allows applying the callable to each input in an array of inputs.

#### Returns

[`Callable`](../../../../../../record/callable/classes/Callable.md)\<`CallInput`[], `CallOutput`[], `CallOptions`\>

A new [CallableEach](../../../../../../record/callable/classes/CallableEach.md) instance for mapping operation.

#### Inherited from

[`BaseEvent`](../../../../../base/classes/BaseEvent.md) . [`map`](../../../../../base/classes/BaseEvent.md#map)

#### Source

[packages/core/src/record/callable.ts:355](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L355)

***

### pipe()

> **pipe**\<`NewCallOutput`\>(`callableLike`): [`CallableSequence`](../../../../../../record/callable/classes/CallableSequence.md)\<`CallInput`, `NewCallOutput`\>

Chains the current callable with another callable, creating a sequence.
This method allows sequential execution of multiple callables.

#### Type parameters

• **NewCallOutput**

#### Parameters

• **callableLike**: [`CallableLike`](../../../../../../record/callable/type-aliases/CallableLike.md)\<`CallOutput`, `NewCallOutput`\>

The next callable in the sequence.

#### Returns

[`CallableSequence`](../../../../../../record/callable/classes/CallableSequence.md)\<`CallInput`, `NewCallOutput`\>

A new [CallableSequence](../../../../../../record/callable/classes/CallableSequence.md) instance representing the chained callables.

#### Inherited from

[`BaseEvent`](../../../../../base/classes/BaseEvent.md) . [`pipe`](../../../../../base/classes/BaseEvent.md#pipe)

#### Source

[packages/core/src/record/callable.ts:460](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L460)

***

### removeDefaultRule()

> **removeDefaultRule**(): `void`

Removes the current default rule, if it exists. Warns if no default rule is set.

#### Returns

`void`

#### Example

```typescript
const validator = new VariableValidator({
  variables: ['username', 'email'],
  rules: {
    specific: {
      username: StringRule.exists()
    },
    default: BooleanRule.isTrue(),
    exclude: ['email']
  }
});

validator.removeDefaultRule();
// The default rule is now removed.
```

#### Source

[packages/core/src/events/inference/validate/validators/variable.ts:414](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/validators/variable.ts#L414)

***

### removeExcludeVariable()

> **removeExcludeVariable**(`variable`): `void`

Removes a variable from the exclusion list, allowing it to be validated again.
Throws an error if the variable is not known to this validator.

#### Parameters

• **variable**: `string`

The variable name to include back into validation.

#### Returns

`void`

#### Throws

Error if the variable is not managed by this validator.

#### Example

```typescript
const validator = new VariableValidator({
  variables: ['username', 'email'],
  rules: {
    specific: {
      username: StringRule.exists()
    },
    default: BooleanRule.isTrue(),
    exclude: ['email']
  }
});

validator.removeExcludeVariable('email');
// 'email' is now eligible for validation.
```

#### Source

[packages/core/src/events/inference/validate/validators/variable.ts:260](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/validators/variable.ts#L260)

***

### removeSpecificRule()

> **removeSpecificRule**(`variable`): `void`

Removes a specific rule from a variable.
Logs a warning if no specific rule exists or if the variable is excluded.
Throws an error if the variable is not known to this validator.

#### Parameters

• **variable**: `string`

The variable from which to remove the specific rule.

#### Returns

`void`

#### Throws

Error if the variable is not managed by this validator.

#### Example

```typescript
const validator = new VariableValidator({
  variables: ['username', 'email'],
  rules: {
    specific: {
      username: StringRule.exists()
    },
    default: BooleanRule.isTrue(),
    exclude: ['email']
  }
});

validator.removeSpecificRule('username');
// Removes the specific rule associated with 'username'.
```

#### Source

[packages/core/src/events/inference/validate/validators/variable.ts:340](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/validators/variable.ts#L340)

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

[`BaseEvent`](../../../../../base/classes/BaseEvent.md) . [`stream`](../../../../../base/classes/BaseEvent.md#stream)

#### Source

[packages/core/src/record/callable.ts:444](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L444)

***

### toJSON()

> **toJSON**(): [`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized representation based on the object's current state. This method determines whether to use a 'not implemented' or 'constructor' format based on the object's serializability.

#### Returns

[`Serialized`](../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`BaseEvent`](../../../../../base/classes/BaseEvent.md) . [`toJSON`](../../../../../base/classes/BaseEvent.md#tojson)

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

[`BaseEvent`](../../../../../base/classes/BaseEvent.md) . [`toJSONConstructor`](../../../../../base/classes/BaseEvent.md#tojsonconstructor)

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

[`BaseEvent`](../../../../../base/classes/BaseEvent.md) . [`toJSONNotImplemented`](../../../../../base/classes/BaseEvent.md#tojsonnotimplemented)

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

[`BaseEvent`](../../../../../base/classes/BaseEvent.md) . [`toJSONSecret`](../../../../../base/classes/BaseEvent.md#tojsonsecret)

#### Source

[packages/core/src/load/serializable.ts:462](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L462)

***

### validateVariable()

> **validateVariable**(`variable`, `value`): `Promise` \<[`ValidateResult`](../../../type-aliases/ValidateResult.md)\>

Validates a single variable against its applicable rule. Returns a `ValidateResult`.
Throws an error if the variable is not known or has no applicable rule.

#### Parameters

• **variable**: `string`

The name of the variable to validate.

• **value**: `unknown`

The value of the variable to validate.

#### Returns

`Promise` \<[`ValidateResult`](../../../type-aliases/ValidateResult.md)\>

A promise resolving to a `ValidateResult`.

#### Throws

Error if there is no applicable rule or if the variable is not managed by this validator.

#### Example

```typescript
const validator = new VariableValidator({
  variables: ['username', 'email'],
  rules: {
    specific: {
      username: StringRule.exists()
    },
    default: BooleanRule.isTrue(),
    exclude: ['email']
  }
});

const result = await validator.validateVariable('email', 'test@example.com');
console.log(result);
// Outputs: { isValid: true }
```

#### Source

[packages/core/src/events/inference/validate/validators/variable.ts:511](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/validators/variable.ts#L511)

***

### withConfig()

> **withConfig**(`config`): [`CallableBind`](../../../../../../record/callable/classes/CallableBind.md)\<`CallInput`, `CallOutput`, `CallOptions`\>

Creates a new [CallableBind](../../../../../../record/callable/classes/CallableBind.md) instance with the specified configuration.
This method allows reconfiguration of the callable instance.

#### Parameters

• **config**: [`CallableConfig`](../../../../../../record/callable/type-aliases/CallableConfig.md)

The configuration to apply to the new callable instance.

#### Returns

[`CallableBind`](../../../../../../record/callable/classes/CallableBind.md)\<`CallInput`, `CallOutput`, `CallOptions`\>

A new [CallableBind](../../../../../../record/callable/classes/CallableBind.md) instance with the given configuration.

#### Inherited from

[`BaseEvent`](../../../../../base/classes/BaseEvent.md) . [`withConfig`](../../../../../base/classes/BaseEvent.md#withconfig)

#### Source

[packages/core/src/record/callable.ts:314](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L314)

***

### withFallbacks()

> **withFallbacks**(`fields`): [`CallableWithFallbacks`](../../../../../../record/callable/classes/CallableWithFallbacks.md)\<`CallInput`, `CallOutput`\>

Creates a new [CallableWithFallbacks](../../../../../../record/callable/classes/CallableWithFallbacks.md) instance with specified fallbacks.
This method allows defining fallback callables for error handling or retries.

#### Parameters

• **fields**

Object containing an array of fallback callables.

• **fields.fallbacks**: [`Callable`](../../../../../../record/callable/classes/Callable.md)\<`CallInput`, `CallOutput`, [`CallableConfig`](../../../../../../record/callable/type-aliases/CallableConfig.md)\>[]

#### Returns

[`CallableWithFallbacks`](../../../../../../record/callable/classes/CallableWithFallbacks.md)\<`CallInput`, `CallOutput`\>

A new [CallableWithFallbacks](../../../../../../record/callable/classes/CallableWithFallbacks.md) instance with the specified fallbacks.

#### Inherited from

[`BaseEvent`](../../../../../base/classes/BaseEvent.md) . [`withFallbacks`](../../../../../base/classes/BaseEvent.md#withfallbacks)

#### Source

[packages/core/src/record/callable.ts:327](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L327)

***

### \_name()

> `static` **\_name**(): `string`

Generates a unique name for the class, typically used for serialization identification.

#### Returns

`string`

#### Overrides

[`BaseEvent`](../../../../../base/classes/BaseEvent.md) . [`_name`](../../../../../base/classes/BaseEvent.md#_name)

#### Source

[packages/core/src/events/inference/validate/validators/variable.ts:80](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/validate/validators/variable.ts#L80)

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

[`BaseEvent`](../../../../../base/classes/BaseEvent.md) . [`isCallable`](../../../../../base/classes/BaseEvent.md#iscallable)

#### Source

[packages/core/src/record/callable.ts:196](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L196)
