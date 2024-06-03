# Interface: TextSplitterParams

Defines the parameters for the text splitter.

## Example

```typescript
const splitterParams: ContextSplitterParams = {
  separator: "\n\n",
  keepSeparator: true,
  maxSize: 2048,
  overlap: 200,
  computeContextSize: async (text: string) => {
    return text.length;  // Simple length-based computation.
  }
};
```

## Extends

- [`ContextSplitterParams`](ContextSplitterParams.md)

## Extended by

- [`TokenTextSplitterParams`](TokenTextSplitterParams.md)

## Properties

### callbacks?

> `optional` **callbacks**: `any`

not-implemented yet

#### Inherited from

[`ContextSplitterParams`](ContextSplitterParams.md) . [`callbacks`](ContextSplitterParams.md#callbacks)

#### Source

[packages/core/src/record/callable.ts:56](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L56)

***

### computeContextSize?

> `optional` **computeContextSize**: (`text`) => `number` \| (`text`) => `Promise`\<`number`\>

Optional function to compute the size of a context, which can be asynchronous.

#### Inherited from

[`ContextSplitterParams`](ContextSplitterParams.md) . [`computeContextSize`](ContextSplitterParams.md#computecontextsize)

#### Source

[packages/core/src/events/input/transform/splitter.ts:38](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/transform/splitter.ts#L38)

***

### keepSeparator

> **keepSeparator**: `boolean`

Flag to determine if the separator should be kept in the output

#### Source

[packages/core/src/events/input/transform/splitter.ts:317](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/transform/splitter.ts#L317)

***

### maxSize

> **maxSize**: `number`

The maximum size of a single context chunk.

#### Inherited from

[`ContextSplitterParams`](ContextSplitterParams.md) . [`maxSize`](ContextSplitterParams.md#maxsize)

#### Source

[packages/core/src/events/input/transform/splitter.ts:28](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/transform/splitter.ts#L28)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Inherited from

[`ContextSplitterParams`](ContextSplitterParams.md) . [`metadata`](ContextSplitterParams.md#metadata)

#### Source

[packages/core/src/record/callable.ts:51](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L51)

***

### name?

> `optional` **name**: `string`

The name of the callable, used for identification or logging. not-implemented yet

#### Inherited from

[`ContextSplitterParams`](ContextSplitterParams.md) . [`name`](ContextSplitterParams.md#name)

#### Source

[packages/core/src/record/callable.ts:41](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L41)

***

### overlap

> **overlap**: `number`

The number of characters to overlap between adjacent context chunks.

#### Inherited from

[`ContextSplitterParams`](ContextSplitterParams.md) . [`overlap`](ContextSplitterParams.md#overlap)

#### Source

[packages/core/src/events/input/transform/splitter.ts:33](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/transform/splitter.ts#L33)

***

### separator

> **separator**: `string`

Separator in splitting text

#### Source

[packages/core/src/events/input/transform/splitter.ts:312](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/transform/splitter.ts#L312)

***

### tags?

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables. not-implemented yet

#### Inherited from

[`ContextSplitterParams`](ContextSplitterParams.md) . [`tags`](ContextSplitterParams.md#tags)

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

[`ContextSplitterParams`](ContextSplitterParams.md) . [`verbose`](ContextSplitterParams.md#verbose)

#### Source

[packages/core/src/events/base.ts:23](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L23)
