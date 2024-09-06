# Class: TextSplitter\<CallInput, CallOutput, CallOptions\>

The TextSplitter class is responsible for splitting a given text into multiple contexts
based on specified parameters. It extends the functionality of ContextSplitter by allowing
the text to be split using a custom separator and controlling whether the separator should
be retained in the outputs.

## Example

```typescript
const textSplitter = new TextSplitter({
  maxSize: 1024,
  overlap: 50,
  separator: "\n\n",
  keepSeparator: true
});

const inputText = `First paragraph.\n\nSecond paragraph.\n\nThird paragraph.`;
const contexts = await textSplitter.invoke(inputText);
console.log(contexts); // Outputs the text split into contexts with separators included.
```

## Extends

- [`ContextSplitter`](ContextSplitter.md)\<`CallInput`, `CallOutput`, `CallOptions`\>

## Extended by

- [`RecursiveTextSplitter`](RecursiveTextSplitter.md)
- [`TokenTextSplitter`](TokenTextSplitter.md)

## Type parameters

• **CallInput** = [`ContextLike`](../../../load/docs/context/type-aliases/ContextLike.md)

The type of input the splitter handles.

• **CallOutput** = [`Context`](../../../load/docs/context/classes/Context.md)[]

The type of output returned after splitting.

• **CallOptions** *extends* [`CallableConfig`](../../../../../record/callable/type-aliases/CallableConfig.md) = [`CallableConfig`](../../../../../record/callable/type-aliases/CallableConfig.md)

Configuration options passed to each call.

## Implements

- [`TextSplitterParams`](../interfaces/TextSplitterParams.md)

## Constructors

### new TextSplitter()

> **new TextSplitter**\<`CallInput`, `CallOutput`, `CallOptions`\>(`fields`?): [`TextSplitter`](TextSplitter.md)\<`CallInput`, `CallOutput`, `CallOptions`\>

#### Parameters

• **fields?**: `Partial` \<[`TextSplitterParams`](../interfaces/TextSplitterParams.md)\>

#### Returns

[`TextSplitter`](TextSplitter.md)\<`CallInput`, `CallOutput`, `CallOptions`\>

#### Overrides

[`ContextSplitter`](ContextSplitter.md) . [`constructor`](ContextSplitter.md#constructors)

#### Source

[packages/core/src/events/input/transform/splitter.ts:362](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L362)

## Properties

### \_isCallable

> **\_isCallable**: `boolean` = `true`

Indicates if the instance is callable. If false, then the callable cannot be invoked.

#### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`_isCallable`](ContextSplitter.md#_iscallable)

#### Source

[packages/core/src/record/callable.ts:188](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L188)

***

### \_isSerializable

> **\_isSerializable**: `boolean` = `true`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`_isSerializable`](ContextSplitter.md#_isserializable)

#### Source

[packages/core/src/events/input/transform/splitter.ts:58](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L58)

***

### \_kwargs

> **\_kwargs**: `SerializedFields`

Key-value pairs of properties to be serialized.

#### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`_kwargs`](ContextSplitter.md#_kwargs)

#### Source

[packages/core/src/load/serializable.ts:168](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L168)

***

### \_namespace

> **\_namespace**: `string`[]

Unique namespace identifier for the serialized object, represented as an array of strings.

#### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`_namespace`](ContextSplitter.md#_namespace)

#### Source

[packages/core/src/events/base.ts:44](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L44)

***

### callbacks?

`Experimental`

> `optional` **callbacks**: `any`

not-implemented yet

#### Implementation of

[`TextSplitterParams`](../interfaces/TextSplitterParams.md) . [`callbacks`](../interfaces/TextSplitterParams.md#callbacks)

#### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`callbacks`](ContextSplitter.md#callbacks)

#### Source

[packages/core/src/events/base.ts:79](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L79)

***

### computeContextSize

> **computeContextSize**: (`text`) => `number` \| (`text`) => `Promise`\<`number`\>

Optional function to compute the size of a context, which can be asynchronous.

#### Implementation of

[`TextSplitterParams`](../interfaces/TextSplitterParams.md) . [`computeContextSize`](../interfaces/TextSplitterParams.md#computecontextsize)

#### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`computeContextSize`](ContextSplitter.md#computecontextsize)

#### Source

[packages/core/src/events/input/transform/splitter.ts:77](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L77)

***

### keepSeparator

> **keepSeparator**: `boolean` = `false`

Flag to determine if the separator should be kept in the output

#### Implementation of

[`TextSplitterParams`](../interfaces/TextSplitterParams.md) . [`keepSeparator`](../interfaces/TextSplitterParams.md#keepseparator)

#### Source

[packages/core/src/events/input/transform/splitter.ts:360](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L360)

***

### maxSize

> **maxSize**: `number` = `2048`

The maximum size of a single context chunk.

#### Implementation of

[`TextSplitterParams`](../interfaces/TextSplitterParams.md) . [`maxSize`](../interfaces/TextSplitterParams.md#maxsize)

#### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`maxSize`](ContextSplitter.md#maxsize)

#### Source

[packages/core/src/events/input/transform/splitter.ts:67](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L67)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Implementation of

[`TextSplitterParams`](../interfaces/TextSplitterParams.md) . [`metadata`](../interfaces/TextSplitterParams.md#metadata)

#### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`metadata`](ContextSplitter.md#metadata)

#### Source

[packages/core/src/events/base.ts:74](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L74)

***

### name?

`Experimental`

> `optional` **name**: `string`

The name of the callable, used for identification or logging.

not-implement yet

#### Implementation of

[`TextSplitterParams`](../interfaces/TextSplitterParams.md) . [`name`](../interfaces/TextSplitterParams.md#name)

#### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`name`](ContextSplitter.md#name)

#### Source

[packages/core/src/events/base.ts:61](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L61)

***

### overlap

> **overlap**: `number` = `10`

The number of characters to overlap between adjacent context chunks.

#### Implementation of

[`TextSplitterParams`](../interfaces/TextSplitterParams.md) . [`overlap`](../interfaces/TextSplitterParams.md#overlap)

#### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`overlap`](ContextSplitter.md#overlap)

#### Source

[packages/core/src/events/input/transform/splitter.ts:72](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L72)

***

### separator

> **separator**: `string` = `'\n\n'`

Separator in splitting text

#### Implementation of

[`TextSplitterParams`](../interfaces/TextSplitterParams.md) . [`separator`](../interfaces/TextSplitterParams.md#separator)

#### Source

[packages/core/src/events/input/transform/splitter.ts:357](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L357)

***

### tags?

`Experimental`

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables.

not-implement yet

#### Implementation of

[`TextSplitterParams`](../interfaces/TextSplitterParams.md) . [`tags`](../interfaces/TextSplitterParams.md#tags)

#### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`tags`](ContextSplitter.md#tags)

#### Source

[packages/core/src/events/base.ts:69](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L69)

***

### verbose

`Experimental`

> **verbose**: `boolean`

Specifies whether the event should provide verbose output, such as detailed logs or response texts.
This can be useful for debugging or detailed monitoring of event handling processes.

not-implement yet

#### Implementation of

[`TextSplitterParams`](../interfaces/TextSplitterParams.md) . [`verbose`](../interfaces/TextSplitterParams.md#verbose)

#### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`verbose`](ContextSplitter.md#verbose)

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

### \_eventNamespace()

> **\_eventNamespace**(): `string`[]

#### Returns

`string`[]

#### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`_eventNamespace`](ContextSplitter.md#_eventnamespace)

#### Source

[packages/core/src/events/input/transform/splitter.ts:81](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L81)

***

### \_joinTextWithSeparator()

`Internal`

> `protected` **\_joinTextWithSeparator**(`texts`, `separator`): `null` \| `string`

Joins an array of strings into a single string with the provided separator,
returns null if the result is empty.

#### Parameters

• **texts**: `string`[]

The array of text pieces to join.

• **separator**: `string`

The separator to use between text pieces.

#### Returns

`null` \| `string`

The joined text or null if the resulting text is empty.

#### Source

[packages/core/src/events/input/transform/splitter.ts:418](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L418)

***

### \_mergeSplits()

`Internal`

> `protected` **\_mergeSplits**(`splits`, `separator`): `Promise`\<`string`[]\>

Merges smaller text splits into larger chunks based on the maximum context size.
Ensures that the merged text does not exceed the specified size limits.

#### Parameters

• **splits**: `string`[]

The text splits to merge.

• **separator**: `string`

The separator used between merged text pieces.

#### Returns

`Promise`\<`string`[]\>

An array of merged text pieces.

#### Source

[packages/core/src/events/input/transform/splitter.ts:435](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L435)

***

### \_splitWithSeparator()

`Internal`

> `protected` **\_splitWithSeparator**(`text`, `separator`): `string`[]

Splits the text into segments based on the defined separator.
If `keepSeparator` is true, the separator is included in the output segments.

#### Parameters

• **text**: `string`

The text to split.

• **separator**: `string`

The separator used to split the text.

#### Returns

`string`[]

An array of text segments.

#### Source

[packages/core/src/events/input/transform/splitter.ts:385](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L385)

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

[`ContextSplitter`](ContextSplitter.md) . [`_streamIterator`](ContextSplitter.md#_streamiterator)

#### Source

[packages/core/src/record/callable.ts:429](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L429)

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

• **batchOptions?**: [`CallableBatchOptions`](../../../../../record/callable/type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise`\<`CallOutput`[]\>

An arrays of CallOutputs, or mixed CallOutputs and Errors (if returnExceptions is true).

##### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`batch`](ContextSplitter.md#batch)

##### Source

[packages/core/src/record/callable.ts:368](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L368)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| `CallOutput`)[]\>

##### Parameters

• **inputs**: `CallInput`[]

• **options?**: `Partial`\<`CallOptions`\> \| `Partial`\<`CallOptions`\>[]

• **batchOptions?**: [`CallableBatchOptions`](../../../../../record/callable/type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise`\<(`Error` \| `CallOutput`)[]\>

##### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`batch`](ContextSplitter.md#batch)

##### Source

[packages/core/src/record/callable.ts:374](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L374)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| `CallOutput`)[]\>

##### Parameters

• **inputs**: `CallInput`[]

• **options?**: `Partial`\<`CallOptions`\> \| `Partial`\<`CallOptions`\>[]

• **batchOptions?**: [`CallableBatchOptions`](../../../../../record/callable/type-aliases/CallableBatchOptions.md)

##### Returns

`Promise`\<(`Error` \| `CallOutput`)[]\>

##### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`batch`](ContextSplitter.md#batch)

##### Source

[packages/core/src/record/callable.ts:380](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L380)

***

### bind()

> **bind**(`kwargs`): [`Callable`](../../../../../record/callable/classes/Callable.md)\<`CallInput`, `CallOutput`, `CallOptions`\>

Creates a new [CallableBind](../../../../../record/callable/classes/CallableBind.md) instance with the specified keyword arguments.
This method allows partial reconfiguration of the callable instance.

#### Parameters

• **kwargs**: `Partial`\<`CallOptions`\>

Partial keyword arguments for the callable configuration.

#### Returns

[`Callable`](../../../../../record/callable/classes/Callable.md)\<`CallInput`, `CallOutput`, `CallOptions`\>

A new [CallableBind](../../../../../record/callable/classes/CallableBind.md) instance with the given keyword arguments.

#### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`bind`](ContextSplitter.md#bind)

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

> `optional` **callables**: [`SerializedCallableFields`](../../../../../record/callable/type-aliases/SerializedCallableFields.md)

##### metadata.type

> **type**: `string`

##### secrets

> **secrets**: `SecretFields`

#### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`getAttributes`](ContextSplitter.md#getattributes)

#### Source

[packages/core/src/record/callable.ts:511](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L511)

***

### getNumberOfNewLines()

> **getNumberOfNewLines**(`text`, `start`?, `end`?): `number`

Calculates the number of newline characters in a given text segment.
This method can be used to determine the number of lines within a specified portion of text.
If start and end parameters are not provided, it counts new lines in the entire string.

#### Parameters

• **text**: `string`

The text within which to count newline characters.

• **start?**: `number`

The starting index from which to begin counting (inclusive).

• **end?**: `number`

The ending index at which to stop counting (exclusive).

#### Returns

`number`

The count of newline characters found in the specified text segment.

#### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`getNumberOfNewLines`](ContextSplitter.md#getnumberofnewlines)

#### Example

```typescript
const text = "Line one\nLine two\nLine three";
const totalNewLines = splitter.getNumberOfNewLines(text);
console.log(totalNewLines); // Outputs: 2

// To count new lines in a substring
const newLinesInSubstring = splitter.getNumberOfNewLines(text, 0, 15);
console.log(newLinesInSubstring); // Outputs: 1 (only counts new lines up to "Line two")
```

#### Source

[packages/core/src/events/input/transform/splitter.ts:277](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L277)

***

### getParams()

> **getParams**(): `Partial` \<[`TextSplitterParams`](../interfaces/TextSplitterParams.md)\>

Returns the parameters of the context splitter.

#### Returns

`Partial` \<[`TextSplitterParams`](../interfaces/TextSplitterParams.md)\>

#### Overrides

[`ContextSplitter`](ContextSplitter.md) . [`getParams`](ContextSplitter.md#getparams)

#### Source

[packages/core/src/events/input/transform/splitter.ts:368](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L368)

***

### invoke()

> **invoke**(`input`, `options`?): `Promise`\<`CallOutput`\>

Processes the input according to the splitter's logic and returns the split contexts.
This method orchestrates the overall process of context splitting.

#### Parameters

• **input**: `CallInput`

The input to be processed. This can be a string, a Context, or an array of Contexts.

• **options?**: `Partial`\<`CallOptions`\>

Optional configuration and options for the call.

#### Returns

`Promise`\<`CallOutput`\>

An array of Contexts, each representing a chunk of the original input.

#### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`invoke`](ContextSplitter.md#invoke)

#### Source

[packages/core/src/events/input/transform/splitter.ts:121](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L121)

***

### map()

> **map**(): [`Callable`](../../../../../record/callable/classes/Callable.md)\<`CallInput`[], `CallOutput`[], `CallOptions`\>

Creates a new [CallableEach](../../../../../record/callable/classes/CallableEach.md) instance for mapping inputs to outputs.
This method allows applying the callable to each input in an array of inputs.

#### Returns

[`Callable`](../../../../../record/callable/classes/Callable.md)\<`CallInput`[], `CallOutput`[], `CallOptions`\>

A new [CallableEach](../../../../../record/callable/classes/CallableEach.md) instance for mapping operation.

#### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`map`](ContextSplitter.md#map)

#### Source

[packages/core/src/record/callable.ts:355](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L355)

***

### pipe()

> **pipe**\<`NewCallOutput`\>(`callableLike`): [`CallableSequence`](../../../../../record/callable/classes/CallableSequence.md)\<`CallInput`, `NewCallOutput`\>

Chains the current callable with another callable, creating a sequence.
This method allows sequential execution of multiple callables.

#### Type parameters

• **NewCallOutput**

#### Parameters

• **callableLike**: [`CallableLike`](../../../../../record/callable/type-aliases/CallableLike.md)\<`CallOutput`, `NewCallOutput`\>

The next callable in the sequence.

#### Returns

[`CallableSequence`](../../../../../record/callable/classes/CallableSequence.md)\<`CallInput`, `NewCallOutput`\>

A new [CallableSequence](../../../../../record/callable/classes/CallableSequence.md) instance representing the chained callables.

#### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`pipe`](ContextSplitter.md#pipe)

#### Source

[packages/core/src/record/callable.ts:460](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L460)

***

### provide()

> **provide**(`texts`, `metadatas`): `Promise` \<[`Context`](../../../load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

Splits the given texts into smaller contexts based on the configured `maxSize` and `overlap`.
This method should handle the actual logic of dividing the text, possibly using the `split` method.

#### Parameters

• **texts**: `string`[]

Array of text strings to split.

• **metadatas**: `Record`\<`string`, `unknown`\>[]

Array of metadata corresponding to each text string.

#### Returns

`Promise` \<[`Context`](../../../load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

An array of Contexts created from the split text chunks.

#### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`provide`](ContextSplitter.md#provide)

#### Source

[packages/core/src/events/input/transform/splitter.ts:158](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L158)

***

### split()

> **split**(`text`): `Promise`\<`string`[]\>

Split text based on the configured separator and merge strategy.

#### Parameters

• **text**: `string`

The text to split.

#### Returns

`Promise`\<`string`[]\>

A promise that resolves to an array of split text pieces.

#### Overrides

[`ContextSplitter`](ContextSplitter.md) . [`split`](ContextSplitter.md#split)

#### Source

[packages/core/src/events/input/transform/splitter.ts:515](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L515)

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

[`ContextSplitter`](ContextSplitter.md) . [`stream`](ContextSplitter.md#stream)

#### Source

[packages/core/src/record/callable.ts:444](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L444)

***

### toJSON()

> **toJSON**(): [`Serialized`](../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized representation based on the object's current state. This method determines whether to use a 'not implemented' or 'constructor' format based on the object's serializability.

#### Returns

[`Serialized`](../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`toJSON`](ContextSplitter.md#tojson)

#### Source

[packages/core/src/load/serializable.ts:665](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L665)

***

### toJSONConstructor()

> **toJSONConstructor**(`aliases`, `secrets`, `kwargs`): [`Serialized`](../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized constructor format. This method provides a way to serialize object construction details, including any aliases or secrets.

#### Parameters

• **aliases**: `SerializedKeyAlias`

Key aliases to include in the serialized output.

• **secrets**: `SecretFields`

Secrets to be secured in the serialized output.

• **kwargs**: `SerializedFields`

Additional keyword arguments to include in the serialized output.

#### Returns

[`Serialized`](../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object as a constructor.

#### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`toJSONConstructor`](ContextSplitter.md#tojsonconstructor)

#### Source

[packages/core/src/load/serializable.ts:478](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L478)

***

### toJSONNotImplemented()

> **toJSONNotImplemented**(): [`Serialized`](../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized format that is not implemented. This method should be overridden in subclasses to provide specific serialization behavior.

#### Returns

[`Serialized`](../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`toJSONNotImplemented`](ContextSplitter.md#tojsonnotimplemented)

#### Source

[packages/core/src/load/serializable.ts:448](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L448)

***

### toJSONSecret()

> **toJSONSecret**(`secretKey`): [`Serialized`](../../../../../load/serializable/type-aliases/Serialized.md)

Converts a secret key to its serialized format. This method is typically used for serializing secrets in a secure manner.

#### Parameters

• **secretKey**: `string`

The secret key to serialize.

#### Returns

[`Serialized`](../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the secret key.

#### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`toJSONSecret`](ContextSplitter.md#tojsonsecret)

#### Source

[packages/core/src/load/serializable.ts:462](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L462)

***

### withConfig()

> **withConfig**(`config`): [`CallableBind`](../../../../../record/callable/classes/CallableBind.md)\<`CallInput`, `CallOutput`, `CallOptions`\>

Creates a new [CallableBind](../../../../../record/callable/classes/CallableBind.md) instance with the specified configuration.
This method allows reconfiguration of the callable instance.

#### Parameters

• **config**: [`CallableConfig`](../../../../../record/callable/type-aliases/CallableConfig.md)

The configuration to apply to the new callable instance.

#### Returns

[`CallableBind`](../../../../../record/callable/classes/CallableBind.md)\<`CallInput`, `CallOutput`, `CallOptions`\>

A new [CallableBind](../../../../../record/callable/classes/CallableBind.md) instance with the given configuration.

#### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`withConfig`](ContextSplitter.md#withconfig)

#### Source

[packages/core/src/record/callable.ts:314](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L314)

***

### withFallbacks()

> **withFallbacks**(`fields`): [`CallableWithFallbacks`](../../../../../record/callable/classes/CallableWithFallbacks.md)\<`CallInput`, `CallOutput`\>

Creates a new [CallableWithFallbacks](../../../../../record/callable/classes/CallableWithFallbacks.md) instance with specified fallbacks.
This method allows defining fallback callables for error handling or retries.

#### Parameters

• **fields**

Object containing an array of fallback callables.

• **fields.fallbacks**: [`Callable`](../../../../../record/callable/classes/Callable.md)\<`CallInput`, `CallOutput`, [`CallableConfig`](../../../../../record/callable/type-aliases/CallableConfig.md)\>[]

#### Returns

[`CallableWithFallbacks`](../../../../../record/callable/classes/CallableWithFallbacks.md)\<`CallInput`, `CallOutput`\>

A new [CallableWithFallbacks](../../../../../record/callable/classes/CallableWithFallbacks.md) instance with the specified fallbacks.

#### Inherited from

[`ContextSplitter`](ContextSplitter.md) . [`withFallbacks`](ContextSplitter.md#withfallbacks)

#### Source

[packages/core/src/record/callable.ts:327](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L327)

***

### \_name()

> `static` **\_name**(): `string`

Generates a unique name for the class, typically used for serialization identification.

#### Returns

`string`

#### Overrides

[`ContextSplitter`](ContextSplitter.md) . [`_name`](ContextSplitter.md#_name)

#### Source

[packages/core/src/events/input/transform/splitter.ts:352](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L352)

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

[`ContextSplitter`](ContextSplitter.md) . [`isCallable`](ContextSplitter.md#iscallable)

#### Source

[packages/core/src/record/callable.ts:196](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L196)
