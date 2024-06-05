# Interface: BaseChatLMCallOptions

Options for language model invocation.

## Extends

- [`BaseLMCallOptions`](BaseLMCallOptions.md)

## Properties

### callbacks?

> `optional` **callbacks**: `any`

not-implemented yet

#### Inherited from

[`BaseLMCallOptions`](BaseLMCallOptions.md) . [`callbacks`](BaseLMCallOptions.md#callbacks)

#### Source

[packages/core/src/record/callable.ts:56](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L56)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Inherited from

[`BaseLMCallOptions`](BaseLMCallOptions.md) . [`metadata`](BaseLMCallOptions.md#metadata)

#### Source

[packages/core/src/record/callable.ts:51](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L51)

***

### name?

> `optional` **name**: `string`

The name of the callable, used for identification or logging. not-implemented yet

#### Inherited from

[`BaseLMCallOptions`](BaseLMCallOptions.md) . [`name`](BaseLMCallOptions.md#name)

#### Source

[packages/core/src/record/callable.ts:41](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L41)

***

### signal?

> `optional` **signal**: `AbortSignal`

Optional abort signal to cancel the request prematurely.

#### Inherited from

[`BaseLMCallOptions`](BaseLMCallOptions.md) . [`signal`](BaseLMCallOptions.md#signal)

#### Source

[packages/core/src/events/inference/chat/base.ts:44](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/base.ts#L44)

***

### stopWords?

> `optional` **stopWords**: `string`[]

Optional array of tokens that should stop the language model's generation.

#### Inherited from

[`BaseLMCallOptions`](BaseLMCallOptions.md) . [`stopWords`](BaseLMCallOptions.md#stopwords)

#### Source

[packages/core/src/events/inference/chat/base.ts:34](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/base.ts#L34)

***

### tags?

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables. not-implemented yet

#### Inherited from

[`BaseLMCallOptions`](BaseLMCallOptions.md) . [`tags`](BaseLMCallOptions.md#tags)

#### Source

[packages/core/src/record/callable.ts:46](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L46)

***

### timeout?

> `optional` **timeout**: `number`

Maximum time in milliseconds to wait for a response from the language model.

#### Inherited from

[`BaseLMCallOptions`](BaseLMCallOptions.md) . [`timeout`](BaseLMCallOptions.md#timeout)

#### Source

[packages/core/src/events/inference/chat/base.ts:39](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/base.ts#L39)

***

### verbose?

`Experimental`

> `optional` **verbose**: `boolean`

Specifies whether the event should provide verbose output, such as detailed logs or response texts.
This can be useful for debugging or detailed monitoring of event handling processes.

not-implement yet

#### Inherited from

[`BaseLMCallOptions`](BaseLMCallOptions.md) . [`verbose`](BaseLMCallOptions.md#verbose)

#### Source

[packages/core/src/events/base.ts:23](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L23)
