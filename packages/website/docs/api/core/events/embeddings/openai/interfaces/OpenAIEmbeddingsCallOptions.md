# Interface: OpenAIEmbeddingsCallOptions

Call options for OpenAI embeddings, including format and additional request options.

## Extends

- [`BaseEmbeddingsCallOptions`](../../base/interfaces/BaseEmbeddingsCallOptions.md)

## Properties

### callbacks?

> `optional` **callbacks**: `any`

not-implemented yet

#### Inherited from

[`BaseEmbeddingsCallOptions`](../../base/interfaces/BaseEmbeddingsCallOptions.md) . [`callbacks`](../../base/interfaces/BaseEmbeddingsCallOptions.md#callbacks)

#### Source

[packages/core/src/record/callable.ts:56](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L56)

***

### encondingFormat?

> `optional` **encondingFormat**: `"float"` \| `"base64"`

Format of the encoding for the embeddings, either as 'float' or 'base64'.

#### Source

[packages/core/src/events/embeddings/openai.ts:59](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/embeddings/openai.ts#L59)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Inherited from

[`BaseEmbeddingsCallOptions`](../../base/interfaces/BaseEmbeddingsCallOptions.md) . [`metadata`](../../base/interfaces/BaseEmbeddingsCallOptions.md#metadata)

#### Source

[packages/core/src/record/callable.ts:51](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L51)

***

### name?

> `optional` **name**: `string`

The name of the callable, used for identification or logging. not-implemented yet

#### Inherited from

[`BaseEmbeddingsCallOptions`](../../base/interfaces/BaseEmbeddingsCallOptions.md) . [`name`](../../base/interfaces/BaseEmbeddingsCallOptions.md#name)

#### Source

[packages/core/src/record/callable.ts:41](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L41)

***

### options?

> `optional` **options**: `RequestOptions`

Additional options to pass to the underlying axios request.

#### Source

[packages/core/src/events/embeddings/openai.ts:64](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/embeddings/openai.ts#L64)

***

### signal?

> `optional` **signal**: `AbortSignal`

Abort signal for the call.
If provided, the call will be aborted when the signal is aborted.

#### Inherited from

[`BaseEmbeddingsCallOptions`](../../base/interfaces/BaseEmbeddingsCallOptions.md) . [`signal`](../../base/interfaces/BaseEmbeddingsCallOptions.md#signal)

#### Source

[packages/core/src/events/embeddings/base.ts:19](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/embeddings/base.ts#L19)

***

### tags?

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables. not-implemented yet

#### Inherited from

[`BaseEmbeddingsCallOptions`](../../base/interfaces/BaseEmbeddingsCallOptions.md) . [`tags`](../../base/interfaces/BaseEmbeddingsCallOptions.md#tags)

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

[`BaseEmbeddingsCallOptions`](../../base/interfaces/BaseEmbeddingsCallOptions.md) . [`verbose`](../../base/interfaces/BaseEmbeddingsCallOptions.md#verbose)

#### Source

[packages/core/src/events/base.ts:23](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L23)
