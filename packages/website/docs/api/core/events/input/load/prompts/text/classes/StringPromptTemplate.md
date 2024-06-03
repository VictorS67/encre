# Class: StringPromptTemplate

A template class for creating string-based prompts, capable of formatting input data into a structured prompt
using a template with optional prefix and suffix.

## Extends

- [`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) \<[`BasePromptTemplateInput`](../../base/interfaces/BasePromptTemplateInput.md), [`StringPrompt`](StringPrompt.md)\>

## Implements

- [`StringPromptTemplateParams`](../interfaces/StringPromptTemplateParams.md)

## Constructors

### new StringPromptTemplate()

> **new StringPromptTemplate**(`fields`): [`StringPromptTemplate`](StringPromptTemplate.md)

#### Parameters

• **fields**: `Partial` \<[`StringPromptTemplateParams`](../interfaces/StringPromptTemplateParams.md)\>

#### Returns

[`StringPromptTemplate`](StringPromptTemplate.md)

#### Overrides

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`constructor`](../../base/classes/BasePromptTemplate.md#constructors)

#### Source

[packages/core/src/events/input/load/prompts/text.ts:95](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/prompts/text.ts#L95)

## Properties

### \_isCallable

> **\_isCallable**: `boolean` = `true`

Indicates if the instance is callable. If false, then the callable cannot be invoked.

#### Inherited from

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`_isCallable`](../../base/classes/BasePromptTemplate.md#_iscallable)

#### Source

[packages/core/src/record/callable.ts:188](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L188)

***

### \_isSerializable

> **\_isSerializable**: `boolean` = `true`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Overrides

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`_isSerializable`](../../base/classes/BasePromptTemplate.md#_isserializable)

#### Source

[packages/core/src/events/input/load/prompts/text.ts:79](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/prompts/text.ts#L79)

***

### \_kwargs

> **\_kwargs**: `SerializedFields`

Key-value pairs of properties to be serialized.

#### Inherited from

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`_kwargs`](../../base/classes/BasePromptTemplate.md#_kwargs)

#### Source

[packages/core/src/load/serializable.ts:168](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L168)

***

### \_namespace

> **\_namespace**: `string`[]

Unique namespace identifier for the serialized object, represented as an array of strings.

#### Inherited from

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`_namespace`](../../base/classes/BasePromptTemplate.md#_namespace)

#### Source

[packages/core/src/events/base.ts:44](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L44)

***

### callbacks?

`Experimental`

> `optional` **callbacks**: `any`

not-implemented yet

#### Implementation of

[`StringPromptTemplateParams`](../interfaces/StringPromptTemplateParams.md) . [`callbacks`](../interfaces/StringPromptTemplateParams.md#callbacks)

#### Inherited from

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`callbacks`](../../base/classes/BasePromptTemplate.md#callbacks)

#### Source

[packages/core/src/events/base.ts:79](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L79)

***

### guardrails?

> `optional` **guardrails**: [`VariableRules`](../../../../../inference/validate/validators/variable/interfaces/VariableRules.md)

Optional rules for validating the input variables.

#### Implementation of

[`StringPromptTemplateParams`](../interfaces/StringPromptTemplateParams.md) . [`guardrails`](../interfaces/StringPromptTemplateParams.md#guardrails)

#### Inherited from

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`guardrails`](../../base/classes/BasePromptTemplate.md#guardrails)

#### Source

[packages/core/src/events/input/load/prompts/base.ts:106](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/prompts/base.ts#L106)

***

### inputVariables

> **inputVariables**: `string`[] = `[]`

List of input variables explicitly declared, used within the template.

#### Implementation of

[`StringPromptTemplateParams`](../interfaces/StringPromptTemplateParams.md) . [`inputVariables`](../interfaces/StringPromptTemplateParams.md#inputvariables)

#### Inherited from

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`inputVariables`](../../base/classes/BasePromptTemplate.md#inputvariables)

#### Source

[packages/core/src/events/input/load/prompts/base.ts:101](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/prompts/base.ts#L101)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Implementation of

[`StringPromptTemplateParams`](../interfaces/StringPromptTemplateParams.md) . [`metadata`](../interfaces/StringPromptTemplateParams.md#metadata)

#### Inherited from

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`metadata`](../../base/classes/BasePromptTemplate.md#metadata)

#### Source

[packages/core/src/events/base.ts:74](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L74)

***

### name?

`Experimental`

> `optional` **name**: `string`

The name of the callable, used for identification or logging.

not-implement yet

#### Implementation of

[`StringPromptTemplateParams`](../interfaces/StringPromptTemplateParams.md) . [`name`](../interfaces/StringPromptTemplateParams.md#name)

#### Inherited from

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`name`](../../base/classes/BasePromptTemplate.md#name)

#### Source

[packages/core/src/events/base.ts:61](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L61)

***

### prefix?

> `optional` **prefix**: `string`

Optional prefix to be added before the formatted template string.

#### Implementation of

[`StringPromptTemplateParams`](../interfaces/StringPromptTemplateParams.md) . [`prefix`](../interfaces/StringPromptTemplateParams.md#prefix)

#### Source

[packages/core/src/events/input/load/prompts/text.ts:88](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/prompts/text.ts#L88)

***

### suffix?

> `optional` **suffix**: `string`

Optional suffix to be added after the formatted template string.

#### Implementation of

[`StringPromptTemplateParams`](../interfaces/StringPromptTemplateParams.md) . [`suffix`](../interfaces/StringPromptTemplateParams.md#suffix)

#### Source

[packages/core/src/events/input/load/prompts/text.ts:93](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/prompts/text.ts#L93)

***

### tags?

`Experimental`

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables.

not-implement yet

#### Implementation of

[`StringPromptTemplateParams`](../interfaces/StringPromptTemplateParams.md) . [`tags`](../interfaces/StringPromptTemplateParams.md#tags)

#### Inherited from

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`tags`](../../base/classes/BasePromptTemplate.md#tags)

#### Source

[packages/core/src/events/base.ts:69](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L69)

***

### template

> **template**: `string` = `''`

Template string used to generate prompts.

#### Implementation of

[`StringPromptTemplateParams`](../interfaces/StringPromptTemplateParams.md) . [`template`](../interfaces/StringPromptTemplateParams.md#template)

#### Inherited from

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`template`](../../base/classes/BasePromptTemplate.md#template)

#### Source

[packages/core/src/events/input/load/prompts/base.ts:96](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/prompts/base.ts#L96)

***

### verbose

`Experimental`

> **verbose**: `boolean`

Specifies whether the event should provide verbose output, such as detailed logs or response texts.
This can be useful for debugging or detailed monitoring of event handling processes.

not-implement yet

#### Implementation of

[`StringPromptTemplateParams`](../interfaces/StringPromptTemplateParams.md) . [`verbose`](../interfaces/StringPromptTemplateParams.md#verbose)

#### Inherited from

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`verbose`](../../base/classes/BasePromptTemplate.md#verbose)

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

#### Inherited from

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`_eventNamespace`](../../base/classes/BasePromptTemplate.md#_eventnamespace)

#### Source

[packages/core/src/events/input/load/prompts/base.ts:89](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/prompts/base.ts#L89)

***

### \_streamIterator()

`Internal`

> **\_streamIterator**(`input`, `options`?): `AsyncGenerator` \<[`StringPrompt`](StringPrompt.md), `any`, `unknown`\>

Creates an async generator for streaming callable outputs.
This protected method is used internally for streaming operations.

#### Parameters

• **input**: [`BasePromptTemplateInput`](../../base/interfaces/BasePromptTemplateInput.md)

The input for the callable.

• **options?**: `Partial` \<[`CallableConfig`](../../../../../../record/callable/type-aliases/CallableConfig.md)\>

Optional additional options for the callable.

#### Returns

`AsyncGenerator` \<[`StringPrompt`](StringPrompt.md), `any`, `unknown`\>

An async generator yielding callable outputs.

#### Inherited from

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`_streamIterator`](../../base/classes/BasePromptTemplate.md#_streamiterator)

#### Source

[packages/core/src/record/callable.ts:429](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L429)

***

### \_templateType()

> **\_templateType**(): `string`

Returns the specific template type.

#### Returns

`string`

The type of the template.

#### Overrides

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`_templateType`](../../base/classes/BasePromptTemplate.md#_templatetype)

#### Source

[packages/core/src/events/input/load/prompts/text.ts:102](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/prompts/text.ts#L102)

***

### batch()

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise` \<[`StringPrompt`](StringPrompt.md)[]\>

Batch calls invoke N times, where N is the length of inputs.

##### Parameters

• **inputs**: [`BasePromptTemplateInput`](../../base/interfaces/BasePromptTemplateInput.md)[]

Array of inputs in each call in a batch.

• **options?**: `Partial` \<[`CallableConfig`](../../../../../../record/callable/type-aliases/CallableConfig.md)\> \| `Partial` \<[`CallableConfig`](../../../../../../record/callable/type-aliases/CallableConfig.md)\>[]

Either a single call options to apply to each call or an array of options for each call.

• **batchOptions?**: [`CallableBatchOptions`](../../../../../../record/callable/type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise` \<[`StringPrompt`](StringPrompt.md)[]\>

An arrays of CallOutputs, or mixed CallOutputs and Errors (if returnExceptions is true).

##### Inherited from

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`batch`](../../base/classes/BasePromptTemplate.md#batch)

##### Source

[packages/core/src/record/callable.ts:368](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L368)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| [`StringPrompt`](StringPrompt.md))[]\>

##### Parameters

• **inputs**: [`BasePromptTemplateInput`](../../base/interfaces/BasePromptTemplateInput.md)[]

• **options?**: `Partial` \<[`CallableConfig`](../../../../../../record/callable/type-aliases/CallableConfig.md)\> \| `Partial` \<[`CallableConfig`](../../../../../../record/callable/type-aliases/CallableConfig.md)\>[]

• **batchOptions?**: [`CallableBatchOptions`](../../../../../../record/callable/type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise`\<(`Error` \| [`StringPrompt`](StringPrompt.md))[]\>

##### Inherited from

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`batch`](../../base/classes/BasePromptTemplate.md#batch)

##### Source

[packages/core/src/record/callable.ts:374](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L374)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| [`StringPrompt`](StringPrompt.md))[]\>

##### Parameters

• **inputs**: [`BasePromptTemplateInput`](../../base/interfaces/BasePromptTemplateInput.md)[]

• **options?**: `Partial` \<[`CallableConfig`](../../../../../../record/callable/type-aliases/CallableConfig.md)\> \| `Partial` \<[`CallableConfig`](../../../../../../record/callable/type-aliases/CallableConfig.md)\>[]

• **batchOptions?**: [`CallableBatchOptions`](../../../../../../record/callable/type-aliases/CallableBatchOptions.md)

##### Returns

`Promise`\<(`Error` \| [`StringPrompt`](StringPrompt.md))[]\>

##### Inherited from

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`batch`](../../base/classes/BasePromptTemplate.md#batch)

##### Source

[packages/core/src/record/callable.ts:380](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L380)

***

### bind()

> **bind**(`kwargs`): [`Callable`](../../../../../../record/callable/classes/Callable.md) \<[`BasePromptTemplateInput`](../../base/interfaces/BasePromptTemplateInput.md), [`StringPrompt`](StringPrompt.md), [`CallableConfig`](../../../../../../record/callable/type-aliases/CallableConfig.md)\>

Creates a new [CallableBind](../../../../../../record/callable/classes/CallableBind.md) instance with the specified keyword arguments.
This method allows partial reconfiguration of the callable instance.

#### Parameters

• **kwargs**: `Partial` \<[`CallableConfig`](../../../../../../record/callable/type-aliases/CallableConfig.md)\>

Partial keyword arguments for the callable configuration.

#### Returns

[`Callable`](../../../../../../record/callable/classes/Callable.md) \<[`BasePromptTemplateInput`](../../base/interfaces/BasePromptTemplateInput.md), [`StringPrompt`](StringPrompt.md), [`CallableConfig`](../../../../../../record/callable/type-aliases/CallableConfig.md)\>

A new [CallableBind](../../../../../../record/callable/classes/CallableBind.md) instance with the given keyword arguments.

#### Inherited from

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`bind`](../../base/classes/BasePromptTemplate.md#bind)

#### Source

[packages/core/src/record/callable.ts:343](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L343)

***

### format()

> **format**(`input`): `Promise`\<`string`\>

Formats the input data into a string based on the template, with any specified prefix or suffix.

#### Parameters

• **input**: [`BasePromptTemplateInput`](../../base/interfaces/BasePromptTemplateInput.md)

The input data containing variables for the template.

#### Returns

`Promise`\<`string`\>

A promise resolving to the fully formatted string.

#### Overrides

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`format`](../../base/classes/BasePromptTemplate.md#format)

#### Throws

Error if a required variable is missing in the input.

#### Example

```ts
const template = new StringPromptTemplate({
  template: "Hello, {{name}}!",
  inputVariables: ["name"],
  prefix: "Greeting: ",
  suffix: " Have a nice day."
});
const formatted = await template.format({ name: "John" });
console.log(formatted);
// Outputs: "Greeting: Hello, John! Have a nice day."
```

#### Source

[packages/core/src/events/input/load/prompts/text.ts:122](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/prompts/text.ts#L122)

***

### formatPrompt()

> **formatPrompt**(`input`): `Promise` \<[`StringPrompt`](StringPrompt.md)\>

Formats the input data and creates a StringPrompt from the resulting string.

#### Parameters

• **input**: [`BasePromptTemplateInput`](../../base/interfaces/BasePromptTemplateInput.md)

The input data containing variables for the template.

#### Returns

`Promise` \<[`StringPrompt`](StringPrompt.md)\>

A promise resolving to a StringPrompt constructed from the formatted string.

#### Overrides

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`formatPrompt`](../../base/classes/BasePromptTemplate.md#formatprompt)

#### Source

[packages/core/src/events/input/load/prompts/text.ts:147](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/prompts/text.ts#L147)

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

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`getAttributes`](../../base/classes/BasePromptTemplate.md#getattributes)

#### Source

[packages/core/src/record/callable.ts:511](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L511)

***

### invoke()

> **invoke**(`input`, `options`?): `Promise` \<[`StringPrompt`](StringPrompt.md)\>

Invokes the template processing with input validation. Returns the generated prompt.

#### Parameters

• **input**: [`BasePromptTemplateInput`](../../base/interfaces/BasePromptTemplateInput.md)

The input data for generating the prompt.

• **options?**: `Partial` \<[`CallableConfig`](../../../../../../record/callable/type-aliases/CallableConfig.md)\>

Optional configuration.

#### Returns

`Promise` \<[`StringPrompt`](StringPrompt.md)\>

A promise resolving to the generated prompt.

#### Inherited from

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`invoke`](../../base/classes/BasePromptTemplate.md#invoke)

#### Throws

Error if input validation fails.

#### Source

[packages/core/src/events/input/load/prompts/base.ts:161](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/prompts/base.ts#L161)

***

### map()

> **map**(): [`Callable`](../../../../../../record/callable/classes/Callable.md) \<[`BasePromptTemplateInput`](../../base/interfaces/BasePromptTemplateInput.md)[], [`StringPrompt`](StringPrompt.md)[], [`CallableConfig`](../../../../../../record/callable/type-aliases/CallableConfig.md)\>

Creates a new [CallableEach](../../../../../../record/callable/classes/CallableEach.md) instance for mapping inputs to outputs.
This method allows applying the callable to each input in an array of inputs.

#### Returns

[`Callable`](../../../../../../record/callable/classes/Callable.md) \<[`BasePromptTemplateInput`](../../base/interfaces/BasePromptTemplateInput.md)[], [`StringPrompt`](StringPrompt.md)[], [`CallableConfig`](../../../../../../record/callable/type-aliases/CallableConfig.md)\>

A new [CallableEach](../../../../../../record/callable/classes/CallableEach.md) instance for mapping operation.

#### Inherited from

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`map`](../../base/classes/BasePromptTemplate.md#map)

#### Source

[packages/core/src/record/callable.ts:355](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L355)

***

### pipe()

> **pipe**\<`NewCallOutput`\>(`callableLike`): [`CallableSequence`](../../../../../../record/callable/classes/CallableSequence.md) \<[`BasePromptTemplateInput`](../../base/interfaces/BasePromptTemplateInput.md), `NewCallOutput`\>

Chains the current callable with another callable, creating a sequence.
This method allows sequential execution of multiple callables.

#### Type parameters

• **NewCallOutput**

#### Parameters

• **callableLike**: [`CallableLike`](../../../../../../record/callable/type-aliases/CallableLike.md) \<[`StringPrompt`](StringPrompt.md), `NewCallOutput`\>

The next callable in the sequence.

#### Returns

[`CallableSequence`](../../../../../../record/callable/classes/CallableSequence.md) \<[`BasePromptTemplateInput`](../../base/interfaces/BasePromptTemplateInput.md), `NewCallOutput`\>

A new [CallableSequence](../../../../../../record/callable/classes/CallableSequence.md) instance representing the chained callables.

#### Inherited from

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`pipe`](../../base/classes/BasePromptTemplate.md#pipe)

#### Source

[packages/core/src/record/callable.ts:460](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L460)

***

### stream()

> **stream**(`input`, `options`?): `Promise`\<`ReadableStreamAsyncIterable` \<[`StringPrompt`](StringPrompt.md)\>\>

Creates a readable stream for the callable outputs.
This method allows streaming the outputs of the callable for continuous data.

#### Parameters

• **input**: [`BasePromptTemplateInput`](../../base/interfaces/BasePromptTemplateInput.md)

The input for the callable.

• **options?**: `Partial` \<[`CallableConfig`](../../../../../../record/callable/type-aliases/CallableConfig.md)\>

Optional additional options for the callable.

#### Returns

`Promise`\<`ReadableStreamAsyncIterable` \<[`StringPrompt`](StringPrompt.md)\>\>

A promise that resolves to a readable stream of callable outputs.

#### Inherited from

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`stream`](../../base/classes/BasePromptTemplate.md#stream)

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

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`toJSON`](../../base/classes/BasePromptTemplate.md#tojson)

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

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`toJSONConstructor`](../../base/classes/BasePromptTemplate.md#tojsonconstructor)

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

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`toJSONNotImplemented`](../../base/classes/BasePromptTemplate.md#tojsonnotimplemented)

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

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`toJSONSecret`](../../base/classes/BasePromptTemplate.md#tojsonsecret)

#### Source

[packages/core/src/load/serializable.ts:462](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L462)

***

### validate()

> **validate**(`input`): `Promise` \<[`ValidateResult`](../../../../../inference/validate/type-aliases/ValidateResult.md)\>

Validates the input data using any configured guardrails.

#### Parameters

• **input**: [`BasePromptTemplateInput`](../../base/interfaces/BasePromptTemplateInput.md)

The input data to validate.

#### Returns

`Promise` \<[`ValidateResult`](../../../../../inference/validate/type-aliases/ValidateResult.md)\>

A promise resolving to a validation result.

#### Inherited from

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`validate`](../../base/classes/BasePromptTemplate.md#validate)

#### Source

[packages/core/src/events/input/load/prompts/base.ts:181](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/prompts/base.ts#L181)

***

### withConfig()

> **withConfig**(`config`): [`CallableBind`](../../../../../../record/callable/classes/CallableBind.md) \<[`BasePromptTemplateInput`](../../base/interfaces/BasePromptTemplateInput.md), [`StringPrompt`](StringPrompt.md), [`CallableConfig`](../../../../../../record/callable/type-aliases/CallableConfig.md)\>

Creates a new [CallableBind](../../../../../../record/callable/classes/CallableBind.md) instance with the specified configuration.
This method allows reconfiguration of the callable instance.

#### Parameters

• **config**: [`CallableConfig`](../../../../../../record/callable/type-aliases/CallableConfig.md)

The configuration to apply to the new callable instance.

#### Returns

[`CallableBind`](../../../../../../record/callable/classes/CallableBind.md) \<[`BasePromptTemplateInput`](../../base/interfaces/BasePromptTemplateInput.md), [`StringPrompt`](StringPrompt.md), [`CallableConfig`](../../../../../../record/callable/type-aliases/CallableConfig.md)\>

A new [CallableBind](../../../../../../record/callable/classes/CallableBind.md) instance with the given configuration.

#### Inherited from

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`withConfig`](../../base/classes/BasePromptTemplate.md#withconfig)

#### Source

[packages/core/src/record/callable.ts:314](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L314)

***

### withFallbacks()

> **withFallbacks**(`fields`): [`CallableWithFallbacks`](../../../../../../record/callable/classes/CallableWithFallbacks.md) \<[`BasePromptTemplateInput`](../../base/interfaces/BasePromptTemplateInput.md), [`StringPrompt`](StringPrompt.md)\>

Creates a new [CallableWithFallbacks](../../../../../../record/callable/classes/CallableWithFallbacks.md) instance with specified fallbacks.
This method allows defining fallback callables for error handling or retries.

#### Parameters

• **fields**

Object containing an array of fallback callables.

• **fields.fallbacks**: [`Callable`](../../../../../../record/callable/classes/Callable.md) \<[`BasePromptTemplateInput`](../../base/interfaces/BasePromptTemplateInput.md), [`StringPrompt`](StringPrompt.md), [`CallableConfig`](../../../../../../record/callable/type-aliases/CallableConfig.md)\>[]

#### Returns

[`CallableWithFallbacks`](../../../../../../record/callable/classes/CallableWithFallbacks.md) \<[`BasePromptTemplateInput`](../../base/interfaces/BasePromptTemplateInput.md), [`StringPrompt`](StringPrompt.md)\>

A new [CallableWithFallbacks](../../../../../../record/callable/classes/CallableWithFallbacks.md) instance with the specified fallbacks.

#### Inherited from

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`withFallbacks`](../../base/classes/BasePromptTemplate.md#withfallbacks)

#### Source

[packages/core/src/record/callable.ts:327](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L327)

***

### \_name()

> `static` **\_name**(): `string`

Generates a unique name for the class, typically used for serialization identification.

#### Returns

`string`

#### Overrides

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`_name`](../../base/classes/BasePromptTemplate.md#_name)

#### Source

[packages/core/src/events/input/load/prompts/text.ts:81](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/prompts/text.ts#L81)

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

[`BasePromptTemplate`](../../base/classes/BasePromptTemplate.md) . [`isCallable`](../../base/classes/BasePromptTemplate.md#iscallable)

#### Source

[packages/core/src/record/callable.ts:196](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L196)
