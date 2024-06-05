# Interface: BaseLMCallOptions

Options for language model invocation.

## Extends

- [`BaseEventParams`](../../../../base/interfaces/BaseEventParams.md)

## Extended by

- [`BaseLLMCallOptions`](BaseLLMCallOptions.md)
- [`BaseChatLMCallOptions`](BaseChatLMCallOptions.md)
- [`VertexAICallOptions`](../../llms/vertexai/interfaces/VertexAICallOptions.md)

## Properties

### callbacks?

> `optional` **callbacks**: `any`

not-implemented yet

#### Inherited from

[`BaseEventParams`](../../../../base/interfaces/BaseEventParams.md) . [`callbacks`](../../../../base/interfaces/BaseEventParams.md#callbacks)

#### Source

[packages/core/src/record/callable.ts:56](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L56)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Inherited from

[`BaseEventParams`](../../../../base/interfaces/BaseEventParams.md) . [`metadata`](../../../../base/interfaces/BaseEventParams.md#metadata)

#### Source

[packages/core/src/record/callable.ts:51](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L51)

***

### name?

> `optional` **name**: `string`

The name of the callable, used for identification or logging. not-implemented yet

#### Inherited from

[`BaseEventParams`](../../../../base/interfaces/BaseEventParams.md) . [`name`](../../../../base/interfaces/BaseEventParams.md#name)

#### Source

[packages/core/src/record/callable.ts:41](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L41)

***

### signal?

> `optional` **signal**: `AbortSignal`

Optional abort signal to cancel the request prematurely.

#### Source

[packages/core/src/events/inference/chat/base.ts:44](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L44)

***

### stopWords?

> `optional` **stopWords**: `string`[]

Optional array of tokens that should stop the language model's generation.

#### Source

[packages/core/src/events/inference/chat/base.ts:34](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L34)

***

### tags?

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables. not-implemented yet

#### Inherited from

[`BaseEventParams`](../../../../base/interfaces/BaseEventParams.md) . [`tags`](../../../../base/interfaces/BaseEventParams.md#tags)

#### Source

[packages/core/src/record/callable.ts:46](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L46)

***

### timeout?

> `optional` **timeout**: `number`

Maximum time in milliseconds to wait for a response from the language model.

#### Source

[packages/core/src/events/inference/chat/base.ts:39](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L39)

***

### verbose?

`Experimental`

> `optional` **verbose**: `boolean`

Specifies whether the event should provide verbose output, such as detailed logs or response texts.
This can be useful for debugging or detailed monitoring of event handling processes.

not-implement yet

#### Inherited from

[`BaseEventParams`](../../../../base/interfaces/BaseEventParams.md) . [`verbose`](../../../../base/interfaces/BaseEventParams.md#verbose)

#### Source

[packages/core/src/events/base.ts:23](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L23)