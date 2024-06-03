# Interface: VertexAICallOptions

Options specific to Vertex AI calls, extending the base language model call options.

## Extends

- [`BaseLMCallOptions`](../../../base/interfaces/BaseLMCallOptions.md)

## Extended by

- [`GeminiCallOptions`](GeminiCallOptions.md)

## Properties

### apiEndpoint?

> `optional` **apiEndpoint**: `string`

The base Vertex AI endpoint to use for the request.
If not provided, the default regionalized endpoint
(i.e. us-central1-aiplatform.googleapis.com) will be used.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/index.ts:15](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/index.ts#L15)

***

### callbacks?

> `optional` **callbacks**: `any`

not-implemented yet

#### Inherited from

[`BaseLMCallOptions`](../../../base/interfaces/BaseLMCallOptions.md) . [`callbacks`](../../../base/interfaces/BaseLMCallOptions.md#callbacks)

#### Source

[packages/core/src/record/callable.ts:56](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L56)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Inherited from

[`BaseLMCallOptions`](../../../base/interfaces/BaseLMCallOptions.md) . [`metadata`](../../../base/interfaces/BaseLMCallOptions.md#metadata)

#### Source

[packages/core/src/record/callable.ts:51](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L51)

***

### name?

> `optional` **name**: `string`

The name of the callable, used for identification or logging. not-implemented yet

#### Inherited from

[`BaseLMCallOptions`](../../../base/interfaces/BaseLMCallOptions.md) . [`name`](../../../base/interfaces/BaseLMCallOptions.md#name)

#### Source

[packages/core/src/record/callable.ts:41](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L41)

***

### signal?

> `optional` **signal**: `AbortSignal`

Optional abort signal to cancel the request prematurely.

#### Inherited from

[`BaseLMCallOptions`](../../../base/interfaces/BaseLMCallOptions.md) . [`signal`](../../../base/interfaces/BaseLMCallOptions.md#signal)

#### Source

[packages/core/src/events/inference/chat/base.ts:44](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L44)

***

### stopWords?

> `optional` **stopWords**: `string`[]

Optional array of tokens that should stop the language model's generation.

#### Inherited from

[`BaseLMCallOptions`](../../../base/interfaces/BaseLMCallOptions.md) . [`stopWords`](../../../base/interfaces/BaseLMCallOptions.md#stopwords)

#### Source

[packages/core/src/events/inference/chat/base.ts:34](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L34)

***

### tags?

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables. not-implemented yet

#### Inherited from

[`BaseLMCallOptions`](../../../base/interfaces/BaseLMCallOptions.md) . [`tags`](../../../base/interfaces/BaseLMCallOptions.md#tags)

#### Source

[packages/core/src/record/callable.ts:46](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L46)

***

### timeout?

> `optional` **timeout**: `number`

Maximum time in milliseconds to wait for a response from the language model.

#### Inherited from

[`BaseLMCallOptions`](../../../base/interfaces/BaseLMCallOptions.md) . [`timeout`](../../../base/interfaces/BaseLMCallOptions.md#timeout)

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

[`BaseLMCallOptions`](../../../base/interfaces/BaseLMCallOptions.md) . [`verbose`](../../../base/interfaces/BaseLMCallOptions.md#verbose)

#### Source

[packages/core/src/events/base.ts:23](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L23)
