# Interface: PDFLoaderParams

Interface of PDFLoader

## Extends

- [`BaseLoaderParams`](../../base/interfaces/BaseLoaderParams.md)

## Properties

### callbacks?

> `optional` **callbacks**: `any`

not-implemented yet

#### Inherited from

[`BaseLoaderParams`](../../base/interfaces/BaseLoaderParams.md) . [`callbacks`](../../base/interfaces/BaseLoaderParams.md#callbacks)

#### Source

[packages/core/src/record/callable.ts:56](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L56)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Inherited from

[`BaseLoaderParams`](../../base/interfaces/BaseLoaderParams.md) . [`metadata`](../../base/interfaces/BaseLoaderParams.md#metadata)

#### Source

[packages/core/src/record/callable.ts:51](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L51)

***

### name?

> `optional` **name**: `string`

The name of the callable, used for identification or logging. not-implemented yet

#### Inherited from

[`BaseLoaderParams`](../../base/interfaces/BaseLoaderParams.md) . [`name`](../../base/interfaces/BaseLoaderParams.md#name)

#### Source

[packages/core/src/record/callable.ts:41](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L41)

***

### shouldSplit?

> `optional` **shouldSplit**: `boolean`

Optional flag indicating whether the loader should split the loaded context into separate chunks.
This can be useful for handling large datasets or distributing processing load.

#### Inherited from

[`BaseLoaderParams`](../../base/interfaces/BaseLoaderParams.md) . [`shouldSplit`](../../base/interfaces/BaseLoaderParams.md#shouldsplit)

#### Source

[packages/core/src/events/input/load/docs/base.ts:32](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/docs/base.ts#L32)

***

### tags?

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables. not-implemented yet

#### Inherited from

[`BaseLoaderParams`](../../base/interfaces/BaseLoaderParams.md) . [`tags`](../../base/interfaces/BaseLoaderParams.md#tags)

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

[`BaseLoaderParams`](../../base/interfaces/BaseLoaderParams.md) . [`verbose`](../../base/interfaces/BaseLoaderParams.md#verbose)

#### Source

[packages/core/src/events/base.ts:23](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L23)
