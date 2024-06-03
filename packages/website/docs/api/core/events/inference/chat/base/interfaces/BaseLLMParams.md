# Interface: BaseLLMParams

Parameters for base language model operations, including caching.

## Extends

- [`BaseLMParams`](BaseLMParams.md)

## Properties

### cache?

> `optional` **cache**: `boolean` \| [`BaseCache`](../../../../../cache/base/classes/BaseCache.md) \<[`Generation`](../../../../output/provide/generation/interfaces/Generation.md)[]\>

Cache instance to store and retrieve results for given prompts.
If cache is boolean and is `true`, then we use a [MemoryCache](../../../../../cache/classes/MemoryCache.md).

#### Inherited from

[`BaseLMParams`](BaseLMParams.md) . [`cache`](BaseLMParams.md#cache)

#### Source

[packages/core/src/events/inference/chat/base.ts:61](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L61)

***

### callbacks?

> `optional` **callbacks**: `any`

not-implemented yet

#### Inherited from

[`BaseLMParams`](BaseLMParams.md) . [`callbacks`](BaseLMParams.md#callbacks)

#### Source

[packages/core/src/record/callable.ts:56](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L56)

***

### maxConcurrency?

> `optional` **maxConcurrency**: `number`

The max number of concurrent calls that can be made.
Defaults to `Infinity`.

#### Inherited from

[`BaseLMParams`](BaseLMParams.md) . [`maxConcurrency`](BaseLMParams.md#maxconcurrency)

#### Source

[packages/core/src/utils/asyncCaller.ts:33](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/utils/asyncCaller.ts#L33)

***

### maxRetries?

> `optional` **maxRetries**: `number`

The max number of retries that can be made for a single call.
Defaults to 7.

#### Inherited from

[`BaseLMParams`](BaseLMParams.md) . [`maxRetries`](BaseLMParams.md#maxretries)

#### Source

[packages/core/src/utils/asyncCaller.ts:39](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/utils/asyncCaller.ts#L39)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Inherited from

[`BaseLMParams`](BaseLMParams.md) . [`metadata`](BaseLMParams.md#metadata)

#### Source

[packages/core/src/record/callable.ts:51](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L51)

***

### name?

> `optional` **name**: `string`

The name of the callable, used for identification or logging. not-implemented yet

#### Inherited from

[`BaseLMParams`](BaseLMParams.md) . [`name`](BaseLMParams.md#name)

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

[`BaseLMParams`](BaseLMParams.md) . [`onFailedAttempt`](BaseLMParams.md#onfailedattempt)

#### Source

[packages/core/src/utils/asyncCaller.ts:45](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/utils/asyncCaller.ts#L45)

***

### tags?

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables. not-implemented yet

#### Inherited from

[`BaseLMParams`](BaseLMParams.md) . [`tags`](BaseLMParams.md#tags)

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

[`BaseLMParams`](BaseLMParams.md) . [`verbose`](BaseLMParams.md#verbose)

#### Source

[packages/core/src/events/base.ts:23](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L23)
