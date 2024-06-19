# Interface: BaseEmbeddingsCallOptions

Options for base embeddings call.

## Extends

- [`BaseEventParams`](../../../base/interfaces/BaseEventParams.md)

## Extended by

- [`OpenAIEmbeddingsCallOptions`](../../openai/interfaces/OpenAIEmbeddingsCallOptions.md)

## Properties

### callbacks?

> `optional` **callbacks**: `any`

not-implemented yet

#### Inherited from

[`BaseEventParams`](../../../base/interfaces/BaseEventParams.md) . [`callbacks`](../../../base/interfaces/BaseEventParams.md#callbacks)

#### Source

[packages/core/src/record/callable.ts:56](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L56)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Inherited from

[`BaseEventParams`](../../../base/interfaces/BaseEventParams.md) . [`metadata`](../../../base/interfaces/BaseEventParams.md#metadata)

#### Source

[packages/core/src/record/callable.ts:51](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L51)

***

### name?

> `optional` **name**: `string`

The name of the callable, used for identification or logging. not-implemented yet

#### Inherited from

[`BaseEventParams`](../../../base/interfaces/BaseEventParams.md) . [`name`](../../../base/interfaces/BaseEventParams.md#name)

#### Source

[packages/core/src/record/callable.ts:41](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L41)

***

### signal?

> `optional` **signal**: `AbortSignal`

Abort signal for the call.
If provided, the call will be aborted when the signal is aborted.

#### Source

[packages/core/src/events/embeddings/base.ts:19](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/embeddings/base.ts#L19)

***

### tags?

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables. not-implemented yet

#### Inherited from

[`BaseEventParams`](../../../base/interfaces/BaseEventParams.md) . [`tags`](../../../base/interfaces/BaseEventParams.md#tags)

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

[`BaseEventParams`](../../../base/interfaces/BaseEventParams.md) . [`verbose`](../../../base/interfaces/BaseEventParams.md#verbose)

#### Source

[packages/core/src/events/base.ts:23](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L23)
