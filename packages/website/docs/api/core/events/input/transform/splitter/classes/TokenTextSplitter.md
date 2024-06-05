# Class: TokenTextSplitter

The `TokenTextSplitter` is a specialized text splitter that utilizes a tokenization
model to split text. It is particularly useful for applications where precise control
over the inclusion and exclusion of specific tokens or characters is necessary, such as
in natural language processing or data sanitization tasks.

## Example

```typescript
const splitter = new TokenTextSplitter({
  maxSize: 512,
  overlap: 50,
  modelName: "gpt3-3.5-turbo",
  allowedSpecial: ["{", "}"], // Allow curly braces
  disallowedSpecial: "all"   // Disallow all other special characters
});

const text = "Here is some text with {special characters} that need to be handled properly.";
const chunks = await splitter.invoke(text);
console.log(chunks);
```

## Extends

- [`TextSplitter`](TextSplitter.md)

## Implements

- [`TokenTextSplitterParams`](../interfaces/TokenTextSplitterParams.md)

## Constructors

### new TokenTextSplitter()

> **new TokenTextSplitter**(`fields`?): [`TokenTextSplitter`](TokenTextSplitter.md)

#### Parameters

• **fields?**: `Partial` \<[`TokenTextSplitterParams`](../interfaces/TokenTextSplitterParams.md)\>

#### Returns

[`TokenTextSplitter`](TokenTextSplitter.md)

#### Overrides

[`TextSplitter`](TextSplitter.md) . [`constructor`](TextSplitter.md#constructors)

#### Source

[packages/core/src/events/input/transform/splitter.ts:1197](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L1197)

## Properties

### \_isCallable

> **\_isCallable**: `boolean` = `true`

Indicates if the instance is callable. If false, then the callable cannot be invoked.

#### Inherited from

[`TextSplitter`](TextSplitter.md) . [`_isCallable`](TextSplitter.md#_iscallable)

#### Source

[packages/core/src/record/callable.ts:188](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L188)

***

### \_isSerializable

> **\_isSerializable**: `boolean` = `true`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Inherited from

[`TextSplitter`](TextSplitter.md) . [`_isSerializable`](TextSplitter.md#_isserializable)

#### Source

[packages/core/src/events/input/transform/splitter.ts:58](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L58)

***

### \_kwargs

> **\_kwargs**: `SerializedFields`

Key-value pairs of properties to be serialized.

#### Inherited from

[`TextSplitter`](TextSplitter.md) . [`_kwargs`](TextSplitter.md#_kwargs)

#### Source

[packages/core/src/load/serializable.ts:168](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L168)

***

### \_namespace

> **\_namespace**: `string`[]

Unique namespace identifier for the serialized object, represented as an array of strings.

#### Inherited from

[`TextSplitter`](TextSplitter.md) . [`_namespace`](TextSplitter.md#_namespace)

#### Source

[packages/core/src/events/base.ts:44](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L44)

***

### allowedSpecial

> **allowedSpecial**: `string`[] \| `"all"`

An array of allowed special characters or tokens. This allows for the inclusion of
specific characters or tokens in the tokenization process. If set to "all",
it implies that all special characters are allowed during tokenization.

#### Implementation of

[`TokenTextSplitterParams`](../interfaces/TokenTextSplitterParams.md) . [`allowedSpecial`](../interfaces/TokenTextSplitterParams.md#allowedspecial)

#### Source

[packages/core/src/events/input/transform/splitter.ts:1183](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L1183)

***

### callbacks?

`Experimental`

> `optional` **callbacks**: `any`

not-implemented yet

#### Implementation of

[`TokenTextSplitterParams`](../interfaces/TokenTextSplitterParams.md) . [`callbacks`](../interfaces/TokenTextSplitterParams.md#callbacks)

#### Inherited from

[`TextSplitter`](TextSplitter.md) . [`callbacks`](TextSplitter.md#callbacks)

#### Source

[packages/core/src/events/base.ts:79](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L79)

***

### computeContextSize

> **computeContextSize**: (`text`) => `number` \| (`text`) => `Promise`\<`number`\>

Optional function to compute the size of a context, which can be asynchronous.

#### Implementation of

[`TokenTextSplitterParams`](../interfaces/TokenTextSplitterParams.md) . [`computeContextSize`](../interfaces/TokenTextSplitterParams.md#computecontextsize)

#### Inherited from

[`TextSplitter`](TextSplitter.md) . [`computeContextSize`](TextSplitter.md#computecontextsize)

#### Source

[packages/core/src/events/input/transform/splitter.ts:77](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L77)

***

### disallowedSpecial

> **disallowedSpecial**: `string`[] \| `"all"`

An array of disallowed special characters or tokens. This parameter is used
to explicitly exclude certain characters or tokens from the tokenization process.
If set to "all", it implies that all special characters are disallowed.

#### Implementation of

[`TokenTextSplitterParams`](../interfaces/TokenTextSplitterParams.md) . [`disallowedSpecial`](../interfaces/TokenTextSplitterParams.md#disallowedspecial)

#### Source

[packages/core/src/events/input/transform/splitter.ts:1190](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L1190)

***

### keepSeparator

> **keepSeparator**: `boolean` = `false`

Flag to determine if the separator should be kept in the output

#### Implementation of

[`TokenTextSplitterParams`](../interfaces/TokenTextSplitterParams.md) . [`keepSeparator`](../interfaces/TokenTextSplitterParams.md#keepseparator)

#### Inherited from

[`TextSplitter`](TextSplitter.md) . [`keepSeparator`](TextSplitter.md#keepseparator)

#### Source

[packages/core/src/events/input/transform/splitter.ts:360](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L360)

***

### maxSize

> **maxSize**: `number` = `2048`

The maximum size of a single context chunk.

#### Implementation of

[`TokenTextSplitterParams`](../interfaces/TokenTextSplitterParams.md) . [`maxSize`](../interfaces/TokenTextSplitterParams.md#maxsize)

#### Inherited from

[`TextSplitter`](TextSplitter.md) . [`maxSize`](TextSplitter.md#maxsize)

#### Source

[packages/core/src/events/input/transform/splitter.ts:67](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L67)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Implementation of

[`TokenTextSplitterParams`](../interfaces/TokenTextSplitterParams.md) . [`metadata`](../interfaces/TokenTextSplitterParams.md#metadata)

#### Inherited from

[`TextSplitter`](TextSplitter.md) . [`metadata`](TextSplitter.md#metadata)

#### Source

[packages/core/src/events/base.ts:74](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L74)

***

### modelName

> **modelName**: `string`

The name of the model used for tokenization. This typically would be a name
identifying a specific language model that understands how to tokenize the input text.

#### Implementation of

[`TokenTextSplitterParams`](../interfaces/TokenTextSplitterParams.md) . [`modelName`](../interfaces/TokenTextSplitterParams.md#modelname)

#### Source

[packages/core/src/events/input/transform/splitter.ts:1176](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L1176)

***

### name?

`Experimental`

> `optional` **name**: `string`

The name of the callable, used for identification or logging.

not-implement yet

#### Implementation of

[`TokenTextSplitterParams`](../interfaces/TokenTextSplitterParams.md) . [`name`](../interfaces/TokenTextSplitterParams.md#name)

#### Inherited from

[`TextSplitter`](TextSplitter.md) . [`name`](TextSplitter.md#name)

#### Source

[packages/core/src/events/base.ts:61](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L61)

***

### overlap

> **overlap**: `number` = `10`

The number of characters to overlap between adjacent context chunks.

#### Implementation of

[`TokenTextSplitterParams`](../interfaces/TokenTextSplitterParams.md) . [`overlap`](../interfaces/TokenTextSplitterParams.md#overlap)

#### Inherited from

[`TextSplitter`](TextSplitter.md) . [`overlap`](TextSplitter.md#overlap)

#### Source

[packages/core/src/events/input/transform/splitter.ts:72](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L72)

***

### separator

> **separator**: `string` = `'\n\n'`

Separator in splitting text

#### Implementation of

[`TokenTextSplitterParams`](../interfaces/TokenTextSplitterParams.md) . [`separator`](../interfaces/TokenTextSplitterParams.md#separator)

#### Inherited from

[`TextSplitter`](TextSplitter.md) . [`separator`](TextSplitter.md#separator)

#### Source

[packages/core/src/events/input/transform/splitter.ts:357](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L357)

***

### tags?

`Experimental`

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables.

not-implement yet

#### Implementation of

[`TokenTextSplitterParams`](../interfaces/TokenTextSplitterParams.md) . [`tags`](../interfaces/TokenTextSplitterParams.md#tags)

#### Inherited from

[`TextSplitter`](TextSplitter.md) . [`tags`](TextSplitter.md#tags)

#### Source

[packages/core/src/events/base.ts:69](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L69)

***

### tokenizer

> `private` **tokenizer**: `Tiktoken`

Tiktokenizer used for encoding text.

#### Source

[packages/core/src/events/input/transform/splitter.ts:1195](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L1195)

***

### verbose

`Experimental`

> **verbose**: `boolean`

Specifies whether the event should provide verbose output, such as detailed logs or response texts.
This can be useful for debugging or detailed monitoring of event handling processes.

not-implement yet

#### Implementation of

[`TokenTextSplitterParams`](../interfaces/TokenTextSplitterParams.md) . [`verbose`](../interfaces/TokenTextSplitterParams.md#verbose)

#### Inherited from

[`TextSplitter`](TextSplitter.md) . [`verbose`](TextSplitter.md#verbose)

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

[`TextSplitter`](TextSplitter.md) . [`_eventNamespace`](TextSplitter.md#_eventnamespace)

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

#### Inherited from

[`TextSplitter`](TextSplitter.md) . [`_joinTextWithSeparator`](TextSplitter.md#_jointextwithseparator)

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

#### Inherited from

[`TextSplitter`](TextSplitter.md) . [`_mergeSplits`](TextSplitter.md#_mergesplits)

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

#### Inherited from

[`TextSplitter`](TextSplitter.md) . [`_splitWithSeparator`](TextSplitter.md#_splitwithseparator)

#### Source

[packages/core/src/events/input/transform/splitter.ts:385](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L385)

***

### \_streamIterator()

`Internal`

> **\_streamIterator**(`input`, `options`?): `AsyncGenerator` \<[`Context`](../../../load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], `any`, `unknown`\>

Creates an async generator for streaming callable outputs.
This protected method is used internally for streaming operations.

#### Parameters

• **input**: [`ContextLike`](../../../load/docs/context/type-aliases/ContextLike.md)

The input for the callable.

• **options?**: `Partial` \<[`CallableConfig`](../../../../../record/callable/type-aliases/CallableConfig.md)\>

Optional additional options for the callable.

#### Returns

`AsyncGenerator` \<[`Context`](../../../load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], `any`, `unknown`\>

An async generator yielding callable outputs.

#### Inherited from

[`TextSplitter`](TextSplitter.md) . [`_streamIterator`](TextSplitter.md#_streamiterator)

#### Source

[packages/core/src/record/callable.ts:429](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L429)

***

### batch()

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise` \<[`Context`](../../../load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[][]\>

Batch calls invoke N times, where N is the length of inputs.

##### Parameters

• **inputs**: [`ContextLike`](../../../load/docs/context/type-aliases/ContextLike.md)[]

Array of inputs in each call in a batch.

• **options?**: `Partial` \<[`CallableConfig`](../../../../../record/callable/type-aliases/CallableConfig.md)\> \| `Partial` \<[`CallableConfig`](../../../../../record/callable/type-aliases/CallableConfig.md)\>[]

Either a single call options to apply to each call or an array of options for each call.

• **batchOptions?**: [`CallableBatchOptions`](../../../../../record/callable/type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise` \<[`Context`](../../../load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[][]\>

An arrays of CallOutputs, or mixed CallOutputs and Errors (if returnExceptions is true).

##### Inherited from

[`TextSplitter`](TextSplitter.md) . [`batch`](TextSplitter.md#batch)

##### Source

[packages/core/src/record/callable.ts:368](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L368)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| [`Context`](../../../load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[])[]\>

##### Parameters

• **inputs**: [`ContextLike`](../../../load/docs/context/type-aliases/ContextLike.md)[]

• **options?**: `Partial` \<[`CallableConfig`](../../../../../record/callable/type-aliases/CallableConfig.md)\> \| `Partial` \<[`CallableConfig`](../../../../../record/callable/type-aliases/CallableConfig.md)\>[]

• **batchOptions?**: [`CallableBatchOptions`](../../../../../record/callable/type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise`\<(`Error` \| [`Context`](../../../load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[])[]\>

##### Inherited from

[`TextSplitter`](TextSplitter.md) . [`batch`](TextSplitter.md#batch)

##### Source

[packages/core/src/record/callable.ts:374](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L374)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| [`Context`](../../../load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[])[]\>

##### Parameters

• **inputs**: [`ContextLike`](../../../load/docs/context/type-aliases/ContextLike.md)[]

• **options?**: `Partial` \<[`CallableConfig`](../../../../../record/callable/type-aliases/CallableConfig.md)\> \| `Partial` \<[`CallableConfig`](../../../../../record/callable/type-aliases/CallableConfig.md)\>[]

• **batchOptions?**: [`CallableBatchOptions`](../../../../../record/callable/type-aliases/CallableBatchOptions.md)

##### Returns

`Promise`\<(`Error` \| [`Context`](../../../load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[])[]\>

##### Inherited from

[`TextSplitter`](TextSplitter.md) . [`batch`](TextSplitter.md#batch)

##### Source

[packages/core/src/record/callable.ts:380](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L380)

***

### bind()

> **bind**(`kwargs`): [`Callable`](../../../../../record/callable/classes/Callable.md) \<[`ContextLike`](../../../load/docs/context/type-aliases/ContextLike.md), [`Context`](../../../load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], [`CallableConfig`](../../../../../record/callable/type-aliases/CallableConfig.md)\>

Creates a new [CallableBind](../../../../../record/callable/classes/CallableBind.md) instance with the specified keyword arguments.
This method allows partial reconfiguration of the callable instance.

#### Parameters

• **kwargs**: `Partial` \<[`CallableConfig`](../../../../../record/callable/type-aliases/CallableConfig.md)\>

Partial keyword arguments for the callable configuration.

#### Returns

[`Callable`](../../../../../record/callable/classes/Callable.md) \<[`ContextLike`](../../../load/docs/context/type-aliases/ContextLike.md), [`Context`](../../../load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], [`CallableConfig`](../../../../../record/callable/type-aliases/CallableConfig.md)\>

A new [CallableBind](../../../../../record/callable/classes/CallableBind.md) instance with the given keyword arguments.

#### Inherited from

[`TextSplitter`](TextSplitter.md) . [`bind`](TextSplitter.md#bind)

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

[`TextSplitter`](TextSplitter.md) . [`getAttributes`](TextSplitter.md#getattributes)

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

[`TextSplitter`](TextSplitter.md) . [`getNumberOfNewLines`](TextSplitter.md#getnumberofnewlines)

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

> **getParams**(): `Partial` \<[`TokenTextSplitterParams`](../interfaces/TokenTextSplitterParams.md)\>

Returns the parameters of the context splitter.

#### Returns

`Partial` \<[`TokenTextSplitterParams`](../interfaces/TokenTextSplitterParams.md)\>

#### Overrides

[`TextSplitter`](TextSplitter.md) . [`getParams`](TextSplitter.md#getparams)

#### Source

[packages/core/src/events/input/transform/splitter.ts:1205](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L1205)

***

### invoke()

> **invoke**(`input`, `options`?): `Promise` \<[`Context`](../../../load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

Processes the input according to the splitter's logic and returns the split contexts.
This method orchestrates the overall process of context splitting.

#### Parameters

• **input**: [`ContextLike`](../../../load/docs/context/type-aliases/ContextLike.md)

The input to be processed. This can be a string, a Context, or an array of Contexts.

• **options?**: `Partial` \<[`CallableConfig`](../../../../../record/callable/type-aliases/CallableConfig.md)\>

Optional configuration and options for the call.

#### Returns

`Promise` \<[`Context`](../../../load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

An array of Contexts, each representing a chunk of the original input.

#### Inherited from

[`TextSplitter`](TextSplitter.md) . [`invoke`](TextSplitter.md#invoke)

#### Source

[packages/core/src/events/input/transform/splitter.ts:121](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L121)

***

### map()

> **map**(): [`Callable`](../../../../../record/callable/classes/Callable.md) \<[`ContextLike`](../../../load/docs/context/type-aliases/ContextLike.md)[], [`Context`](../../../load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[][], [`CallableConfig`](../../../../../record/callable/type-aliases/CallableConfig.md)\>

Creates a new [CallableEach](../../../../../record/callable/classes/CallableEach.md) instance for mapping inputs to outputs.
This method allows applying the callable to each input in an array of inputs.

#### Returns

[`Callable`](../../../../../record/callable/classes/Callable.md) \<[`ContextLike`](../../../load/docs/context/type-aliases/ContextLike.md)[], [`Context`](../../../load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[][], [`CallableConfig`](../../../../../record/callable/type-aliases/CallableConfig.md)\>

A new [CallableEach](../../../../../record/callable/classes/CallableEach.md) instance for mapping operation.

#### Inherited from

[`TextSplitter`](TextSplitter.md) . [`map`](TextSplitter.md#map)

#### Source

[packages/core/src/record/callable.ts:355](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L355)

***

### pipe()

> **pipe**\<`NewCallOutput`\>(`callableLike`): [`CallableSequence`](../../../../../record/callable/classes/CallableSequence.md) \<[`ContextLike`](../../../load/docs/context/type-aliases/ContextLike.md), `NewCallOutput`\>

Chains the current callable with another callable, creating a sequence.
This method allows sequential execution of multiple callables.

#### Type parameters

• **NewCallOutput**

#### Parameters

• **callableLike**: [`CallableLike`](../../../../../record/callable/type-aliases/CallableLike.md) \<[`Context`](../../../load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], `NewCallOutput`\>

The next callable in the sequence.

#### Returns

[`CallableSequence`](../../../../../record/callable/classes/CallableSequence.md) \<[`ContextLike`](../../../load/docs/context/type-aliases/ContextLike.md), `NewCallOutput`\>

A new [CallableSequence](../../../../../record/callable/classes/CallableSequence.md) instance representing the chained callables.

#### Inherited from

[`TextSplitter`](TextSplitter.md) . [`pipe`](TextSplitter.md#pipe)

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

[`TextSplitter`](TextSplitter.md) . [`provide`](TextSplitter.md#provide)

#### Source

[packages/core/src/events/input/transform/splitter.ts:158](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L158)

***

### split()

> **split**(`text`): `Promise`\<`string`[]\>

Splits the given text into tokens based on the tokenizer configuration.

#### Parameters

• **text**: `string`

#### Returns

`Promise`\<`string`[]\>

#### Overrides

[`TextSplitter`](TextSplitter.md) . [`split`](TextSplitter.md#split)

#### Source

[packages/core/src/events/input/transform/splitter.ts:1218](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L1218)

***

### stream()

> **stream**(`input`, `options`?): `Promise`\<`ReadableStreamAsyncIterable` \<[`Context`](../../../load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>\>

Creates a readable stream for the callable outputs.
This method allows streaming the outputs of the callable for continuous data.

#### Parameters

• **input**: [`ContextLike`](../../../load/docs/context/type-aliases/ContextLike.md)

The input for the callable.

• **options?**: `Partial` \<[`CallableConfig`](../../../../../record/callable/type-aliases/CallableConfig.md)\>

Optional additional options for the callable.

#### Returns

`Promise`\<`ReadableStreamAsyncIterable` \<[`Context`](../../../load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>\>

A promise that resolves to a readable stream of callable outputs.

#### Inherited from

[`TextSplitter`](TextSplitter.md) . [`stream`](TextSplitter.md#stream)

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

[`TextSplitter`](TextSplitter.md) . [`toJSON`](TextSplitter.md#tojson)

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

[`TextSplitter`](TextSplitter.md) . [`toJSONConstructor`](TextSplitter.md#tojsonconstructor)

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

[`TextSplitter`](TextSplitter.md) . [`toJSONNotImplemented`](TextSplitter.md#tojsonnotimplemented)

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

[`TextSplitter`](TextSplitter.md) . [`toJSONSecret`](TextSplitter.md#tojsonsecret)

#### Source

[packages/core/src/load/serializable.ts:462](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L462)

***

### withConfig()

> **withConfig**(`config`): [`CallableBind`](../../../../../record/callable/classes/CallableBind.md) \<[`ContextLike`](../../../load/docs/context/type-aliases/ContextLike.md), [`Context`](../../../load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], [`CallableConfig`](../../../../../record/callable/type-aliases/CallableConfig.md)\>

Creates a new [CallableBind](../../../../../record/callable/classes/CallableBind.md) instance with the specified configuration.
This method allows reconfiguration of the callable instance.

#### Parameters

• **config**: [`CallableConfig`](../../../../../record/callable/type-aliases/CallableConfig.md)

The configuration to apply to the new callable instance.

#### Returns

[`CallableBind`](../../../../../record/callable/classes/CallableBind.md) \<[`ContextLike`](../../../load/docs/context/type-aliases/ContextLike.md), [`Context`](../../../load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], [`CallableConfig`](../../../../../record/callable/type-aliases/CallableConfig.md)\>

A new [CallableBind](../../../../../record/callable/classes/CallableBind.md) instance with the given configuration.

#### Inherited from

[`TextSplitter`](TextSplitter.md) . [`withConfig`](TextSplitter.md#withconfig)

#### Source

[packages/core/src/record/callable.ts:314](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L314)

***

### withFallbacks()

> **withFallbacks**(`fields`): [`CallableWithFallbacks`](../../../../../record/callable/classes/CallableWithFallbacks.md) \<[`ContextLike`](../../../load/docs/context/type-aliases/ContextLike.md), [`Context`](../../../load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

Creates a new [CallableWithFallbacks](../../../../../record/callable/classes/CallableWithFallbacks.md) instance with specified fallbacks.
This method allows defining fallback callables for error handling or retries.

#### Parameters

• **fields**

Object containing an array of fallback callables.

• **fields.fallbacks**: [`Callable`](../../../../../record/callable/classes/Callable.md) \<[`ContextLike`](../../../load/docs/context/type-aliases/ContextLike.md), [`Context`](../../../load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[], [`CallableConfig`](../../../../../record/callable/type-aliases/CallableConfig.md)\>[]

#### Returns

[`CallableWithFallbacks`](../../../../../record/callable/classes/CallableWithFallbacks.md) \<[`ContextLike`](../../../load/docs/context/type-aliases/ContextLike.md), [`Context`](../../../load/docs/context/classes/Context.md)\<`Record`\<`string`, `unknown`\>\>[]\>

A new [CallableWithFallbacks](../../../../../record/callable/classes/CallableWithFallbacks.md) instance with the specified fallbacks.

#### Inherited from

[`TextSplitter`](TextSplitter.md) . [`withFallbacks`](TextSplitter.md#withfallbacks)

#### Source

[packages/core/src/record/callable.ts:327](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L327)

***

### \_name()

> `static` **\_name**(): `string`

Generates a unique name for the class, typically used for serialization identification.

#### Returns

`string`

#### Overrides

[`TextSplitter`](TextSplitter.md) . [`_name`](TextSplitter.md#_name)

#### Source

[packages/core/src/events/input/transform/splitter.ts:1168](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/transform/splitter.ts#L1168)

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

[`TextSplitter`](TextSplitter.md) . [`isCallable`](TextSplitter.md#iscallable)

#### Source

[packages/core/src/record/callable.ts:196](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L196)
