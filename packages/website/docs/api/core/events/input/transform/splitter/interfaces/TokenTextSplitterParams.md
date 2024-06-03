# Interface: TokenTextSplitterParams

Defines parameters for the [TokenTextSplitter](../classes/TokenTextSplitter.md) that extends the [TextSplitterParams](TextSplitterParams.md).

## Extends

- [`TextSplitterParams`](TextSplitterParams.md)

## Properties

### allowedSpecial

> **allowedSpecial**: `string`[] \| `"all"`

An array of allowed special characters or tokens. This allows for the inclusion of
specific characters or tokens in the tokenization process. If set to "all",
it implies that all special characters are allowed during tokenization.

#### Source

[packages/core/src/events/input/transform/splitter.ts:1133](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/transform/splitter.ts#L1133)

***

### callbacks?

> `optional` **callbacks**: `any`

not-implemented yet

#### Inherited from

[`TextSplitterParams`](TextSplitterParams.md) . [`callbacks`](TextSplitterParams.md#callbacks)

#### Source

[packages/core/src/record/callable.ts:56](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L56)

***

### computeContextSize?

> `optional` **computeContextSize**: (`text`) => `number` \| (`text`) => `Promise`\<`number`\>

Optional function to compute the size of a context, which can be asynchronous.

#### Inherited from

[`TextSplitterParams`](TextSplitterParams.md) . [`computeContextSize`](TextSplitterParams.md#computecontextsize)

#### Source

[packages/core/src/events/input/transform/splitter.ts:38](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/transform/splitter.ts#L38)

***

### disallowedSpecial

> **disallowedSpecial**: `string`[] \| `"all"`

An array of disallowed special characters or tokens. This parameter is used
to explicitly exclude certain characters or tokens from the tokenization process.
If set to "all", it implies that all special characters are disallowed.

#### Source

[packages/core/src/events/input/transform/splitter.ts:1140](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/transform/splitter.ts#L1140)

***

### keepSeparator

> **keepSeparator**: `boolean`

Flag to determine if the separator should be kept in the output

#### Inherited from

[`TextSplitterParams`](TextSplitterParams.md) . [`keepSeparator`](TextSplitterParams.md#keepseparator)

#### Source

[packages/core/src/events/input/transform/splitter.ts:317](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/transform/splitter.ts#L317)

***

### maxSize

> **maxSize**: `number`

The maximum size of a single context chunk.

#### Inherited from

[`TextSplitterParams`](TextSplitterParams.md) . [`maxSize`](TextSplitterParams.md#maxsize)

#### Source

[packages/core/src/events/input/transform/splitter.ts:28](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/transform/splitter.ts#L28)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Inherited from

[`TextSplitterParams`](TextSplitterParams.md) . [`metadata`](TextSplitterParams.md#metadata)

#### Source

[packages/core/src/record/callable.ts:51](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L51)

***

### modelName

> **modelName**: `string`

The name of the model used for tokenization. This typically would be a name
identifying a specific language model that understands how to tokenize the input text.

#### Source

[packages/core/src/events/input/transform/splitter.ts:1126](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/transform/splitter.ts#L1126)

***

### name?

> `optional` **name**: `string`

The name of the callable, used for identification or logging. not-implemented yet

#### Inherited from

[`TextSplitterParams`](TextSplitterParams.md) . [`name`](TextSplitterParams.md#name)

#### Source

[packages/core/src/record/callable.ts:41](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L41)

***

### overlap

> **overlap**: `number`

The number of characters to overlap between adjacent context chunks.

#### Inherited from

[`TextSplitterParams`](TextSplitterParams.md) . [`overlap`](TextSplitterParams.md#overlap)

#### Source

[packages/core/src/events/input/transform/splitter.ts:33](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/transform/splitter.ts#L33)

***

### separator

> **separator**: `string`

Separator in splitting text

#### Inherited from

[`TextSplitterParams`](TextSplitterParams.md) . [`separator`](TextSplitterParams.md#separator)

#### Source

[packages/core/src/events/input/transform/splitter.ts:312](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/transform/splitter.ts#L312)

***

### tags?

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables. not-implemented yet

#### Inherited from

[`TextSplitterParams`](TextSplitterParams.md) . [`tags`](TextSplitterParams.md#tags)

#### Source

[packages/core/src/record/callable.ts:46](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L46)

***

### verbose?

`Experimental`

> `optional` **verbose**: `boolean`

Specifies whether the event should provide verbose output, such as detailed logs or response texts.
This can be useful for debugging or detailed monitoring of event handling processes.

not-implement yet

#### Inherited from

[`TextSplitterParams`](TextSplitterParams.md) . [`verbose`](TextSplitterParams.md#verbose)

#### Source

[packages/core/src/events/base.ts:23](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L23)
