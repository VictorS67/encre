# Interface: BaseLoaderParams

Defines parameters for initializing BaseLoader instances, including all options from BaseDocLoaderCallOptions.
This interface is typically used to pass configuration options when creating new loader instances.

## Extends

- [`BaseDocLoaderCallOptions`](BaseDocLoaderCallOptions.md)

## Extended by

- [`PDFLoaderParams`](../../pdf/interfaces/PDFLoaderParams.md)

## Properties

### callbacks?

> `optional` **callbacks**: `any`

not-implemented yet

#### Inherited from

[`BaseDocLoaderCallOptions`](BaseDocLoaderCallOptions.md) . [`callbacks`](BaseDocLoaderCallOptions.md#callbacks)

#### Source

[packages/core/src/record/callable.ts:56](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L56)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Inherited from

[`BaseDocLoaderCallOptions`](BaseDocLoaderCallOptions.md) . [`metadata`](BaseDocLoaderCallOptions.md#metadata)

#### Source

[packages/core/src/record/callable.ts:51](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L51)

***

### name?

> `optional` **name**: `string`

The name of the callable, used for identification or logging. not-implemented yet

#### Inherited from

[`BaseDocLoaderCallOptions`](BaseDocLoaderCallOptions.md) . [`name`](BaseDocLoaderCallOptions.md#name)

#### Source

[packages/core/src/record/callable.ts:41](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L41)

***

### shouldSplit?

> `optional` **shouldSplit**: `boolean`

Optional flag indicating whether the loader should split the loaded context into separate chunks.
This can be useful for handling large datasets or distributing processing load.

#### Inherited from

[`BaseDocLoaderCallOptions`](BaseDocLoaderCallOptions.md) . [`shouldSplit`](BaseDocLoaderCallOptions.md#shouldsplit)

#### Source

[packages/core/src/events/input/load/docs/base.ts:32](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/docs/base.ts#L32)

***

### tags?

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables. not-implemented yet

#### Inherited from

[`BaseDocLoaderCallOptions`](BaseDocLoaderCallOptions.md) . [`tags`](BaseDocLoaderCallOptions.md#tags)

#### Source

[packages/core/src/record/callable.ts:46](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L46)

***

### verbose?

`Experimental`

> `optional` **verbose**: `boolean`

Specifies whether the event should provide verbose output, such as detailed logs or response texts.
This can be useful for debugging or detailed monitoring of event handling processes.

not-implement yet

#### Inherited from

[`BaseDocLoaderCallOptions`](BaseDocLoaderCallOptions.md) . [`verbose`](BaseDocLoaderCallOptions.md#verbose)

#### Source

[packages/core/src/events/base.ts:23](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L23)
