# Interface: BaseDocLoaderCallOptions

Extends BaseEventParams to include options specific to document loaders, such as whether to split the context into chunks.
This interface is designed to provide customizable options for document loading processes.

## Extends

- [`BaseEventParams`](../../../../../base/interfaces/BaseEventParams.md)

## Extended by

- [`BaseLoaderParams`](BaseLoaderParams.md)

## Properties

### callbacks?

> `optional` **callbacks**: `any`

not-implemented yet

#### Inherited from

[`BaseEventParams`](../../../../../base/interfaces/BaseEventParams.md) . [`callbacks`](../../../../../base/interfaces/BaseEventParams.md#callbacks)

#### Source

[packages/core/src/record/callable.ts:56](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L56)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Inherited from

[`BaseEventParams`](../../../../../base/interfaces/BaseEventParams.md) . [`metadata`](../../../../../base/interfaces/BaseEventParams.md#metadata)

#### Source

[packages/core/src/record/callable.ts:51](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L51)

***

### name?

> `optional` **name**: `string`

The name of the callable, used for identification or logging. not-implemented yet

#### Inherited from

[`BaseEventParams`](../../../../../base/interfaces/BaseEventParams.md) . [`name`](../../../../../base/interfaces/BaseEventParams.md#name)

#### Source

[packages/core/src/record/callable.ts:41](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L41)

***

### shouldSplit?

> `optional` **shouldSplit**: `boolean`

Optional flag indicating whether the loader should split the loaded context into separate chunks.
This can be useful for handling large datasets or distributing processing load.

#### Source

[packages/core/src/events/input/load/docs/base.ts:32](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/docs/base.ts#L32)

***

### tags?

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables. not-implemented yet

#### Inherited from

[`BaseEventParams`](../../../../../base/interfaces/BaseEventParams.md) . [`tags`](../../../../../base/interfaces/BaseEventParams.md#tags)

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

[`BaseEventParams`](../../../../../base/interfaces/BaseEventParams.md) . [`verbose`](../../../../../base/interfaces/BaseEventParams.md#verbose)

#### Source

[packages/core/src/events/base.ts:23](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L23)
