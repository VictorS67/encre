# Interface: RemoteRetrieverParams

Interface representing configuration parameters for initializing a `BaseTextRetriever`.
Extends from `BaseRetrieverParams`, incorporating all base event parameters.

## Extends

- `AsyncCallerParams`.[`BaseTextRetrieverParams`](../../../../base/interfaces/BaseTextRetrieverParams.md)

## Properties

### auth

> **auth**: [`RemoteRetrieverAuth`](../../type-aliases/RemoteRetrieverAuth.md)

#### Source

[packages/core/src/events/inference/retrieve/text/remote/base.ts:15](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/retrieve/text/remote/base.ts#L15)

***

### callbacks?

> `optional` **callbacks**: `any`

not-implemented yet

#### Inherited from

[`BaseTextRetrieverParams`](../../../../base/interfaces/BaseTextRetrieverParams.md) . [`callbacks`](../../../../base/interfaces/BaseTextRetrieverParams.md#callbacks)

#### Source

[packages/core/src/record/callable.ts:56](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L56)

***

### maxConcurrency?

> `optional` **maxConcurrency**: `number`

The max number of concurrent calls that can be made.
Defaults to `Infinity`.

#### Inherited from

`AsyncCallerParams.maxConcurrency`

#### Source

[packages/core/src/utils/asyncCaller.ts:33](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/utils/asyncCaller.ts#L33)

***

### maxRetries?

> `optional` **maxRetries**: `number`

The max number of retries that can be made for a single call.
Defaults to 7.

#### Inherited from

`AsyncCallerParams.maxRetries`

#### Source

[packages/core/src/utils/asyncCaller.ts:39](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/utils/asyncCaller.ts#L39)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Inherited from

[`BaseTextRetrieverParams`](../../../../base/interfaces/BaseTextRetrieverParams.md) . [`metadata`](../../../../base/interfaces/BaseTextRetrieverParams.md#metadata)

#### Source

[packages/core/src/record/callable.ts:51](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L51)

***

### name?

> `optional` **name**: `string`

The name of the callable, used for identification or logging. not-implemented yet

#### Inherited from

[`BaseTextRetrieverParams`](../../../../base/interfaces/BaseTextRetrieverParams.md) . [`name`](../../../../base/interfaces/BaseTextRetrieverParams.md#name)

#### Source

[packages/core/src/record/callable.ts:41](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L41)

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

`AsyncCallerParams.onFailedAttempt`

#### Source

[packages/core/src/utils/asyncCaller.ts:45](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/utils/asyncCaller.ts#L45)

***

### tags?

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables. not-implemented yet

#### Inherited from

[`BaseTextRetrieverParams`](../../../../base/interfaces/BaseTextRetrieverParams.md) . [`tags`](../../../../base/interfaces/BaseTextRetrieverParams.md#tags)

#### Source

[packages/core/src/record/callable.ts:46](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L46)

***

### url

> **url**: `string`

#### Source

[packages/core/src/events/inference/retrieve/text/remote/base.ts:13](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/retrieve/text/remote/base.ts#L13)

***

### verbose?

`Experimental`

> `optional` **verbose**: `boolean`

Specifies whether the event should provide verbose output, such as detailed logs or response texts.
This can be useful for debugging or detailed monitoring of event handling processes.

not-implement yet

#### Inherited from

[`BaseTextRetrieverParams`](../../../../base/interfaces/BaseTextRetrieverParams.md) . [`verbose`](../../../../base/interfaces/BaseTextRetrieverParams.md#verbose)

#### Source

[packages/core/src/events/base.ts:23](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L23)
