# Interface: GeminiCallOptions

Configuration options for making calls to the Gemini model, including tools and
safety settings.

## Extends

- [`VertexAICallOptions`](VertexAICallOptions.md)

## Properties

### apiEndpoint?

> `optional` **apiEndpoint**: `string`

The base Vertex AI endpoint to use for the request.
If not provided, the default regionalized endpoint
(i.e. us-central1-aiplatform.googleapis.com) will be used.

#### Inherited from

[`VertexAICallOptions`](VertexAICallOptions.md) . [`apiEndpoint`](VertexAICallOptions.md#apiendpoint)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/index.ts:15](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/index.ts#L15)

***

### callbacks?

> `optional` **callbacks**: `any`

not-implemented yet

#### Inherited from

[`VertexAICallOptions`](VertexAICallOptions.md) . [`callbacks`](VertexAICallOptions.md#callbacks)

#### Source

[packages/core/src/record/callable.ts:56](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L56)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Inherited from

[`VertexAICallOptions`](VertexAICallOptions.md) . [`metadata`](VertexAICallOptions.md#metadata)

#### Source

[packages/core/src/record/callable.ts:51](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L51)

***

### name?

> `optional` **name**: `string`

The name of the callable, used for identification or logging. not-implemented yet

#### Inherited from

[`VertexAICallOptions`](VertexAICallOptions.md) . [`name`](VertexAICallOptions.md#name)

#### Source

[packages/core/src/record/callable.ts:41](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L41)

***

### safetySettings

> **safetySettings**: [`GeminiSafetySetting`](GeminiSafetySetting.md)[]

The Vertex AI Gemini API blocks unsafe content based on a list of safety
attributes and their configured blocking thresholds.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/index.ts:138](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/index.ts#L138)

***

### signal?

> `optional` **signal**: `AbortSignal`

Optional abort signal to cancel the request prematurely.

#### Inherited from

[`VertexAICallOptions`](VertexAICallOptions.md) . [`signal`](VertexAICallOptions.md#signal)

#### Source

[packages/core/src/events/inference/chat/base.ts:44](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L44)

***

### stopWords?

> `optional` **stopWords**: `string`[]

Optional array of tokens that should stop the language model's generation.

#### Inherited from

[`VertexAICallOptions`](VertexAICallOptions.md) . [`stopWords`](VertexAICallOptions.md#stopwords)

#### Source

[packages/core/src/events/inference/chat/base.ts:34](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L34)

***

### tags?

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables. not-implemented yet

#### Inherited from

[`VertexAICallOptions`](VertexAICallOptions.md) . [`tags`](VertexAICallOptions.md#tags)

#### Source

[packages/core/src/record/callable.ts:46](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L46)

***

### timeout?

> `optional` **timeout**: `number`

Maximum time in milliseconds to wait for a response from the language model.

#### Inherited from

[`VertexAICallOptions`](VertexAICallOptions.md) . [`timeout`](VertexAICallOptions.md#timeout)

#### Source

[packages/core/src/events/inference/chat/base.ts:39](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L39)

***

### tools?

> `optional` **tools**: [`GeminiTool`](GeminiTool.md)[]

A piece of code that enables the system to interact with external systems
to perform an action, or set of actions, outside of knowledge and scope
of the model.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/index.ts:132](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/index.ts#L132)

***

### verbose?

`Experimental`

> `optional` **verbose**: `boolean`

Specifies whether the event should provide verbose output, such as detailed logs or response texts.
This can be useful for debugging or detailed monitoring of event handling processes.

not-implement yet

#### Inherited from

[`VertexAICallOptions`](VertexAICallOptions.md) . [`verbose`](VertexAICallOptions.md#verbose)

#### Source

[packages/core/src/events/base.ts:23](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L23)
