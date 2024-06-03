# Interface: OpenAIEmbeddingsParams

Parameters for the OpenAI embeddings, including model and API key specifics.

## Extends

- [`BaseEmbeddingsParams`](../../base/interfaces/BaseEmbeddingsParams.md)

## Properties

### cache?

> `optional` **cache**: `boolean` \| [`BaseCache`](../../../../cache/base/classes/BaseCache.md)\<`number`[]\>

Optional cache to use for storing results, can be a cache instance or a boolean
to use a global cache.

#### Inherited from

[`BaseEmbeddingsParams`](../../base/interfaces/BaseEmbeddingsParams.md) . [`cache`](../../base/interfaces/BaseEmbeddingsParams.md#cache)

#### Source

[packages/core/src/events/embeddings/base.ts:33](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/embeddings/base.ts#L33)

***

### callbacks?

> `optional` **callbacks**: `any`

not-implemented yet

#### Inherited from

[`BaseEmbeddingsParams`](../../base/interfaces/BaseEmbeddingsParams.md) . [`callbacks`](../../base/interfaces/BaseEmbeddingsParams.md#callbacks)

#### Source

[packages/core/src/record/callable.ts:56](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L56)

***

### dimensions?

> `optional` **dimensions**: `number`

The number of dimensions the resulting output embeddings should have.
Only supported in `text-embedding-3` and later models.

#### Source

[packages/core/src/events/embeddings/openai.ts:30](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/embeddings/openai.ts#L30)

***

### maxConcurrency?

> `optional` **maxConcurrency**: `number`

The max number of concurrent calls that can be made.
Defaults to `Infinity`.

#### Inherited from

[`BaseEmbeddingsParams`](../../base/interfaces/BaseEmbeddingsParams.md) . [`maxConcurrency`](../../base/interfaces/BaseEmbeddingsParams.md#maxconcurrency)

#### Source

[packages/core/src/utils/asyncCaller.ts:33](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/utils/asyncCaller.ts#L33)

***

### maxRetries?

> `optional` **maxRetries**: `number`

The max number of retries that can be made for a single call.
Defaults to 7.

#### Inherited from

[`BaseEmbeddingsParams`](../../base/interfaces/BaseEmbeddingsParams.md) . [`maxRetries`](../../base/interfaces/BaseEmbeddingsParams.md#maxretries)

#### Source

[packages/core/src/utils/asyncCaller.ts:39](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/utils/asyncCaller.ts#L39)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Inherited from

[`BaseEmbeddingsParams`](../../base/interfaces/BaseEmbeddingsParams.md) . [`metadata`](../../base/interfaces/BaseEmbeddingsParams.md#metadata)

#### Source

[packages/core/src/record/callable.ts:51](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L51)

***

### modelName

> **modelName**: `string`

ID of the model to use. You can use the [List models]([https://platform.openai.com/docs/api-reference/models/list](https://platform.openai.com/docs/api-reference/models/list)}
API to see all of your avaliable models, or see our
[Model overview]([https://platform.openai.com/docs/models/overview](https://platform.openai.com/docs/models/overview)) for description of them.

#### Source

[packages/core/src/events/embeddings/openai.ts:24](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/embeddings/openai.ts#L24)

***

### name?

> `optional` **name**: `string`

The name of the callable, used for identification or logging. not-implemented yet

#### Inherited from

[`BaseEmbeddingsParams`](../../base/interfaces/BaseEmbeddingsParams.md) . [`name`](../../base/interfaces/BaseEmbeddingsParams.md#name)

#### Source

[packages/core/src/record/callable.ts:41](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L41)

***

### onFailedAttempt()?

> `optional` **onFailedAttempt**: (`e`) => `any`

Custom handler to handle failed attempts

#### Parameters

• **e**: `AsyncCallError`

Throwed error object

#### Returns

`any`

#### Inherited from

[`BaseEmbeddingsParams`](../../base/interfaces/BaseEmbeddingsParams.md) . [`onFailedAttempt`](../../base/interfaces/BaseEmbeddingsParams.md#onfailedattempt)

#### Source

[packages/core/src/utils/asyncCaller.ts:45](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/utils/asyncCaller.ts#L45)

***

### openAIApiKey?

> `optional` **openAIApiKey**: `string`

API key to use when making requests to OpenAI. Defaults to the value of
`OPENAI_API_KEY` environment variable.

#### Source

[packages/core/src/events/embeddings/openai.ts:44](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/embeddings/openai.ts#L44)

***

### tags?

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables. not-implemented yet

#### Inherited from

[`BaseEmbeddingsParams`](../../base/interfaces/BaseEmbeddingsParams.md) . [`tags`](../../base/interfaces/BaseEmbeddingsParams.md#tags)

#### Source

[packages/core/src/record/callable.ts:46](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L46)

***

### timeout?

> `optional` **timeout**: `number`

Timeout for the API requests.

#### Source

[packages/core/src/events/embeddings/openai.ts:49](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/embeddings/openai.ts#L49)

***

### user?

> `optional` **user**: `string`

A unique identifier representing your end-user, which can help OpenAI to monitor
and detect abuse.

[Learn more]([https://platform.openai.com/docs/guides/safety-best-practices](https://platform.openai.com/docs/guides/safety-best-practices))

#### Source

[packages/core/src/events/embeddings/openai.ts:38](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/embeddings/openai.ts#L38)

***

### verbose?

`Experimental`

> `optional` **verbose**: `boolean`

Specifies whether the event should provide verbose output, such as detailed logs or response texts.
This can be useful for debugging or detailed monitoring of event handling processes.

not-implement yet

#### Inherited from

[`BaseEmbeddingsParams`](../../base/interfaces/BaseEmbeddingsParams.md) . [`verbose`](../../base/interfaces/BaseEmbeddingsParams.md#verbose)

#### Source

[packages/core/src/events/base.ts:23](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L23)
