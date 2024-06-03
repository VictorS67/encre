# Interface: RecursiveTextSplitterParams

Parameters for configuring the RecursiveTextSplitter.
Extends the basic TextSplitterParams with additional functionality to handle multiple separators.

## Extends

- `Partial` \<[`TextSplitterParams`](TextSplitterParams.md)\>

## Properties

### callbacks?

> `optional` **callbacks**: `any`

not-implemented yet

#### Inherited from

`Partial.callbacks`

#### Source

[packages/core/src/record/callable.ts:56](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L56)

***

### computeContextSize?

> `optional` **computeContextSize**: (`text`) => `number` \| (`text`) => `Promise`\<`number`\>

Optional function to compute the size of a context, which can be asynchronous.

#### Inherited from

`Partial.computeContextSize`

#### Source

[packages/core/src/events/input/transform/splitter.ts:38](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/transform/splitter.ts#L38)

***

### keepSeparator?

> `optional` **keepSeparator**: `boolean`

Flag to determine if the separator should be kept in the output

#### Inherited from

`Partial.keepSeparator`

#### Source

[packages/core/src/events/input/transform/splitter.ts:317](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/transform/splitter.ts#L317)

***

### maxSize?

> `optional` **maxSize**: `number`

The maximum size of a single context chunk.

#### Inherited from

`Partial.maxSize`

#### Source

[packages/core/src/events/input/transform/splitter.ts:28](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/transform/splitter.ts#L28)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Inherited from

`Partial.metadata`

#### Source

[packages/core/src/record/callable.ts:51](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L51)

***

### name?

> `optional` **name**: `string`

The name of the callable, used for identification or logging. not-implemented yet

#### Inherited from

`Partial.name`

#### Source

[packages/core/src/record/callable.ts:41](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L41)

***

### overlap?

> `optional` **overlap**: `number`

The number of characters to overlap between adjacent context chunks.

#### Inherited from

`Partial.overlap`

#### Source

[packages/core/src/events/input/transform/splitter.ts:33](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/transform/splitter.ts#L33)

***

### separator?

> `optional` **separator**: `string`

Separator in splitting text

#### Inherited from

`Partial.separator`

#### Source

[packages/core/src/events/input/transform/splitter.ts:312](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/transform/splitter.ts#L312)

***

### separators

> **separators**: `string`[]

An array of strings defining the multiple separators to be used for splitting text.
The order of separators can influence the granularity of the resulting text splits.

#### Source

[packages/core/src/events/input/transform/splitter.ts:534](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/transform/splitter.ts#L534)

***

### tags?

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables. not-implemented yet

#### Inherited from

`Partial.tags`

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

`Partial.verbose`

#### Source

[packages/core/src/events/base.ts:23](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L23)
