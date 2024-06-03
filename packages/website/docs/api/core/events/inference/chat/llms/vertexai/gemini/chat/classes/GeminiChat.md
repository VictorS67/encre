# Class: GeminiChat\<CallOptions\>

The `GeminiChat` class extends `BaseChatLM` to interface with Google's Gemini models.
It manages chat operations by configuring and controlling the generative process
based on the provided options and contents, including handling of streaming content.

## Example

```typescript
const geminiAI = new GeminiChat({
  modelName: 'gemini-pro',
  googleApiKey: 'your-api-key',
});
const message = new HumanMessage("Hello, world!");
const response = await geminiAI.invoke([message]);
console.log(response);
```

## Extends

- [`BaseChatLM`](../../../../../base/classes/BaseChatLM.md)\<`CallOptions`\>

## Type parameters

• **CallOptions** *extends* [`GeminiCallOptions`](../../../interfaces/GeminiCallOptions.md) = [`GeminiCallOptions`](../../../interfaces/GeminiCallOptions.md)

## Implements

- [`GeminiInput`](../../../interfaces/GeminiInput.md)

## Constructors

### new GeminiChat()

> **new GeminiChat**\<`CallOptions`\>(`fields`?): [`GeminiChat`](GeminiChat.md)\<`CallOptions`\>

#### Parameters

• **fields?**: `Partial` \<[`GeminiInput`](../../../interfaces/GeminiInput.md)\> & [`BaseLLMParams`](../../../../../base/interfaces/BaseLLMParams.md)

#### Returns

[`GeminiChat`](GeminiChat.md)\<`CallOptions`\>

#### Overrides

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`constructor`](../../../../../base/classes/BaseChatLM.md#constructors)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:238](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L238)

## Properties

### \_client

`Internal`

> `private` **\_client**: `GoogleGenerativeAI`

VertexAI API Client.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:226](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L226)

***

### \_isCallable

> **\_isCallable**: `boolean` = `true`

Indicates if the instance is callable. If false, then the callable cannot be invoked.

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`_isCallable`](../../../../../base/classes/BaseChatLM.md#_iscallable)

#### Source

[packages/core/src/record/callable.ts:188](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L188)

***

### \_isMultimodal

`Internal`

> `private` **\_isMultimodal**: `boolean` = `false`

Whether the model supports vision (i.e. multimodal)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:232](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L232)

***

### \_isSerializable

> **\_isSerializable**: `boolean` = `true`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Overrides

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`_isSerializable`](../../../../../base/classes/BaseChatLM.md#_isserializable)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:85](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L85)

***

### \_kwargs

> **\_kwargs**: `SerializedFields`

Key-value pairs of properties to be serialized.

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`_kwargs`](../../../../../base/classes/BaseChatLM.md#_kwargs)

#### Source

[packages/core/src/load/serializable.ts:168](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L168)

***

### \_namespace

> **\_namespace**: `string`[]

Unique namespace identifier for the serialized object, represented as an array of strings.

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`_namespace`](../../../../../base/classes/BaseChatLM.md#_namespace)

#### Source

[packages/core/src/events/base.ts:44](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L44)

***

### additionalKwargs?

> `optional` **additionalKwargs**: `Record`\<`string`, `unknown`\>

Holds any additional parameters that are valid to pass to
VertexAI models that are not explicitly specified on the class.

#### Implementation of

[`GeminiInput`](../../../interfaces/GeminiInput.md) . [`additionalKwargs`](../../../interfaces/GeminiInput.md#additionalkwargs)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:211](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L211)

***

### cache?

> `optional` **cache**: [`BaseCache`](../../../../../../../../cache/base/classes/BaseCache.md) \<[`Generation`](../../../../../../../output/provide/generation/interfaces/Generation.md)[]\>

Cache instance to store and retrieve results for given prompts.

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`cache`](../../../../../base/classes/BaseChatLM.md#cache)

#### Source

[packages/core/src/events/inference/chat/base.ts:93](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L93)

***

### callbacks?

`Experimental`

> `optional` **callbacks**: `any`

not-implemented yet

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`callbacks`](../../../../../base/classes/BaseChatLM.md#callbacks)

#### Source

[packages/core/src/events/base.ts:79](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L79)

***

### caller

> **caller**: `AsyncCaller`

Instance responsible for making asynchronous calls.

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`caller`](../../../../../base/classes/BaseChatLM.md#caller)

#### Source

[packages/core/src/events/inference/chat/base.ts:88](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L88)

***

### candidateCount

> **candidateCount**: `number` = `1`

The number of response variations to return.

This value must be 1.

#### Implementation of

[`GeminiInput`](../../../interfaces/GeminiInput.md) . [`candidateCount`](../../../interfaces/GeminiInput.md#candidatecount)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:150](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L150)

***

### contents

> **contents**: [`GeminiContent`](../../../interfaces/GeminiContent.md)[]

Gemini contents to pass as a prefix to the prompt

#### Implementation of

[`GeminiInput`](../../../interfaces/GeminiInput.md) . [`contents`](../../../interfaces/GeminiInput.md#contents)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:214](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L214)

***

### googleApiKey?

> `optional` **googleApiKey**: `string`

API key to use when making requests to Gemini. Defaults to the value of
`GOOGLE_API_KEY` environment variable.

#### Implementation of

[`GeminiInput`](../../../interfaces/GeminiInput.md) . [`googleApiKey`](../../../interfaces/GeminiInput.md#googleapikey)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:197](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L197)

***

### maxOutputTokens

> **maxOutputTokens**: `number` = `2048`

Maximum number of tokens that can be generated in the response. A token
is approximately four characters. 100 tokens correspond to roughly 60-80
words. Specify a lower value for shorter responses and a higher value for
potentially longer responses.

Range: 1-2048

Default for gemini-pro: 2048

Default for gemini-pro-vision: 4096

#### Implementation of

[`GeminiInput`](../../../interfaces/GeminiInput.md) . [`maxOutputTokens`](../../../interfaces/GeminiInput.md#maxoutputtokens)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:164](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L164)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`metadata`](../../../../../base/classes/BaseChatLM.md#metadata)

#### Source

[packages/core/src/events/base.ts:74](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L74)

***

### modelName

> **modelName**: `string` = `'gemini-pro'`

ID of the model to use. `gemini-pro` or `gemini-pro-vision`

#### Implementation of

[`GeminiInput`](../../../interfaces/GeminiInput.md) . [`modelName`](../../../interfaces/GeminiInput.md#modelname)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:106](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L106)

***

### name?

`Experimental`

> `optional` **name**: `string`

The name of the callable, used for identification or logging.

not-implement yet

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`name`](../../../../../base/classes/BaseChatLM.md#name)

#### Source

[packages/core/src/events/base.ts:61](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L61)

***

### safetySettings?

> `optional` **safetySettings**: [`GeminiSafetySetting`](../../../interfaces/GeminiSafetySetting.md)[]

The Vertex AI Gemini API blocks unsafe content based on a list of safety
attributes and their configured blocking thresholds.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:220](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L220)

***

### stopSequences?

> `optional` **stopSequences**: `string`[]

Up to 5 sequences where the API will stop generating text if one of the
strings is encountered in the response. If a string appears multiple
times in the response, then the response truncates where it's first
encountered. The strings are case-sensitive.

#### Implementation of

[`GeminiInput`](../../../interfaces/GeminiInput.md) . [`stopSequences`](../../../interfaces/GeminiInput.md#stopsequences)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:205](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L205)

***

### streaming

> **streaming**: `boolean` = `true`

Whether the response comes with stream

#### Implementation of

[`GeminiInput`](../../../interfaces/GeminiInput.md) . [`streaming`](../../../interfaces/GeminiInput.md#streaming)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:169](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L169)

***

### tags?

`Experimental`

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables.

not-implement yet

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`tags`](../../../../../base/classes/BaseChatLM.md#tags)

#### Source

[packages/core/src/events/base.ts:69](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L69)

***

### temperature

> **temperature**: `number` = `0.9`

The temperature is used for sampling during the response generation,
which occurs when topP and topK are applied. Temperature controls the
degree of randomness in token selection. Lower temperatures are good
for prompts that require a more deterministic and less open-ended or
creative response, while higher temperatures can lead to more diverse
or creative results.

A temperature of 0 is deterministic: the highest probability response
is always selected.

Range: 0.0 - 1.0

Default for gemini-pro: 0.9

Default for gemini-pro-vision: 0.4

#### Implementation of

[`GeminiInput`](../../../interfaces/GeminiInput.md) . [`temperature`](../../../interfaces/GeminiInput.md#temperature)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:125](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L125)

***

### topK

> **topK**: `number`

Top-K changes how the model selects tokens for output. A top-K of 1 means
the next selected token is the most probable among all tokens in the model's
vocabulary (also called greedy decoding), while a top-K of 3 means that
the next token is selected from among the three most probable tokens by
using temperature.

For each token selection step, the top-K tokens with the highest probabilities
are sampled. Then tokens are further filtered based on top-P with the final
token selected using temperature sampling.

Specify a lower value for less random responses and a higher value for more
random responses.

Range: 1 - 40

Default for gemini-pro: none

Default for gemini-pro-vision: 32

#### Implementation of

[`GeminiInput`](../../../interfaces/GeminiInput.md) . [`topK`](../../../interfaces/GeminiInput.md#topk)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:191](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L191)

***

### topP

> **topP**: `number` = `1.0`

Top-P changes how the model selects tokens for output. Tokens are
selected from the most (see top-K) to least probable until the sum of
their probabilities equals the top-P value.

For example, if tokens A, B, and C have a probability of 0.3, 0.2, and
0.1 and the top-P value is 0.5, then the model will select either A or
B as the next token by using temperature and excludes C as a candidate.

Specify a lower value for less random responses and a higher value for
more random responses.

Range: 0.0 - 1.0

Default: 1.0

#### Implementation of

[`GeminiInput`](../../../interfaces/GeminiInput.md) . [`topP`](../../../interfaces/GeminiInput.md#topp)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:143](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L143)

***

### verbose

`Experimental`

> **verbose**: `boolean`

Specifies whether the event should provide verbose output, such as detailed logs or response texts.
This can be useful for debugging or detailed monitoring of event handling processes.

not-implement yet

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`verbose`](../../../../../base/classes/BaseChatLM.md#verbose)

#### Source

[packages/core/src/events/base.ts:53](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L53)

## Accessors

### \_aliases

> `get` **\_aliases**(): `undefined` \| `SerializedFields`

Retrieves alias mappings for the object's attribute names.

#### Returns

`undefined` \| `SerializedFields`

An object representing key aliases, or undefined if none are defined.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:93](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L93)

***

### \_attributes

> `get` **\_attributes**(): `undefined` \| `SerializedFields`

Retrieves attributes of the object.

#### Returns

`undefined` \| `SerializedFields`

An object representing attributes, or undefined if none are defined.

#### Source

[packages/core/src/events/base.ts:81](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/base.ts#L81)

***

### \_id

> `get` **\_id**(): `string`[]

Retrieves the name of the class. This provides a unique identifier for serialization.

#### Returns

`string`[]

The path of serializable.

#### Source

[packages/core/src/load/serializable.ts:187](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L187)

***

### \_secrets

> `get` **\_secrets**(): `undefined` \| `SecretFields`

Retrieves any secrets defined in the object.

#### Returns

`undefined` \| `SecretFields`

An object representing secret fields, or undefined if none are defined.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:87](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L87)

## Methods

### \_completionWithStream()

`Internal`

> `private` **\_completionWithStream**(`params`, `contents`, `options`): `AsyncGenerator` \<[`ChatGenerationChunk`](../../../../../../../output/provide/message/classes/ChatGenerationChunk.md), `any`, `unknown`\>

Handles streaming responses for chat completions. Assembles message parts into complete
chat messages.

#### Parameters

• **params**: `Omit` \<[`GeminiChatParams`](../type-aliases/GeminiChatParams.md), `"contents"`\>

Parameters excluding the contents for the Gemini API.

• **contents**: `Content`[]

The contents to be sent for completion.

• **options**: `Omit`\<`CallOptions`, `never`\>

Additional call options.

#### Returns

`AsyncGenerator` \<[`ChatGenerationChunk`](../../../../../../../output/provide/message/classes/ChatGenerationChunk.md), `any`, `unknown`\>

An async generator yielding chat generation chunks.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:513](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L513)

***

### \_eventNamespace()

> **\_eventNamespace**(): `string`[]

A predefined namespace array to identify the type of language model and other related namespaces.

#### Returns

`string`[]

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`_eventNamespace`](../../../../../base/classes/BaseChatLM.md#_eventnamespace)

#### Source

[packages/core/src/events/inference/chat/base.ts:415](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L415)

***

### \_failedAttemptHandler()

> `protected` **\_failedAttemptHandler**(`e`): `void`

Custom handler for failed asynchronous attempts.

#### Parameters

• **e**: `Error`

The error encountered during an attempt.

#### Returns

`void`

#### Overrides

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`_failedAttemptHandler`](../../../../../base/classes/BaseChatLM.md#_failedattempthandler)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:336](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L336)

***

### \_generateContentIterable()

`Internal`

> `private` **\_generateContentIterable**(`model`, `request`, `options`?): `AsyncIterable`\<`EnhancedGenerateContentResponse`\>

Asynchronously generates content in a streaming fashion, useful for handling continuous
data flows.

#### Parameters

• **model**: `GenerativeModel`

The generative model to use for content generation.

• **request**: `GenerateContentRequest`

The content generation request parameters.

• **options?**: [`GeminiCallOptions`](../../../interfaces/GeminiCallOptions.md)

Options that may influence streaming, such as cancellation tokens.

#### Returns

`AsyncIterable`\<`EnhancedGenerateContentResponse`\>

An async iterable that yields generated content responses.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:576](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L576)

***

### \_getClient()

`Internal`

> `private` **\_getClient**(): `GoogleGenerativeAI`

Retrieves or initializes the client used to interact with the Vertex AI API.

#### Returns

`GoogleGenerativeAI`

The initialized GoogleGenerativeAIClient instance.

#### Throws

Error if the API key is not found or the client could not be initialized.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:821](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L821)

***

### \_getGenerationConfig()

`Internal`

> `protected` **\_getGenerationConfig**(): `GenerationConfig`

Constructs the generation configuration used for making requests to the AI model.
This configuration controls aspects like temperature, token sampling, and response length.

#### Returns

`GenerationConfig`

An object detailing the generation configuration for the model.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:296](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L296)

***

### \_getLLMStrKey()

`Internal`

> `protected` **\_getLLMStrKey**(`callOptions`): `string`

Constructs a string key based on the given call options for caching purposes.

#### Parameters

• **callOptions**: `CallOptions`

The call options.

#### Returns

`string`

The generated key.

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`_getLLMStrKey`](../../../../../base/classes/BaseChatLM.md#_getllmstrkey)

#### Source

[packages/core/src/events/inference/chat/base.ts:185](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L185)

***

### \_getModelParams()

`Internal`

> `private` **\_getModelParams**(`options`?): `ModelParams`

Constructs and returns the model parameters based on the current settings and options.

#### Parameters

• **options?**: [`GeminiCallOptions`](../../../interfaces/GeminiCallOptions.md)

Optional parameters that might influence the generated model parameters.

#### Returns

`ModelParams`

The constructed model parameters.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:840](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L840)

***

### \_getSafetySettings()

`Internal`

> `protected` **\_getSafetySettings**(`options`?): `SafetySetting`[]

Retrieves safety settings for the generative model, potentially from serialized call options.

#### Parameters

• **options?**: `Omit`\<`CallOptions`, `never`\>

Optional serialized call options to retrieve safety settings from.

#### Returns

`SafetySetting`[]

Array of configured safety settings.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:323](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L323)

***

### \_identifyParams()

`Internal`

> `protected` **\_identifyParams**(): `Record`\<`string`, `any`\>

Method to identify additional parameters specific to implementations.

#### Returns

`Record`\<`string`, `any`\>

A record of identified parameters.

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`_identifyParams`](../../../../../base/classes/BaseChatLM.md#_identifyparams)

#### Source

[packages/core/src/events/inference/chat/base.ts:175](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L175)

***

### \_llmType()

> **\_llmType**(): `string`

Returns the LLM type.

#### Returns

`string`

The type of LLM.

#### Overrides

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`_llmType`](../../../../../base/classes/BaseChatLM.md#_llmtype)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:234](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L234)

***

### \_modelType()

> **\_modelType**(): `string`

Returns the type of the model.

#### Returns

`string`

The type of the model.

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`_modelType`](../../../../../base/classes/BaseChatLM.md#_modeltype)

#### Source

[packages/core/src/events/inference/chat/base.ts:427](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L427)

***

### \_provide()

> **\_provide**(`messages`, `options`): `Promise` \<[`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

Processes input messages and generates responses based on the provided options.
Handles both single response and streaming scenarios.

#### Parameters

• **messages**: [`BaseMessage`](../../../../../../../input/load/msgs/base/classes/BaseMessage.md)[]

The array of base messages to be processed.

• **options**: `Omit`\<`CallOptions`, `never`\>

Serialized call options that may modify the behavior of the method.

#### Returns

`Promise` \<[`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

A promise resolving to the language model result, including generated contents and token usage.

#### Overrides

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`_provide`](../../../../../base/classes/BaseChatLM.md#_provide)

#### Example

```typescript
const geminiChat = new GeminiChat({
  modelName: 'gemini-pro',
  googleApiKey: 'your-api-key',
});
const messages = [new HumanMessage({ content: "Hello, world!" })];
const options = { safetySettings: [{ category: 'hate', threshold: 'high' }] };
const result = await geminiChat._provide(messages, options);
console.log(result);
```

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:373](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L373)

***

### \_provideUncached()

> `protected` **\_provideUncached**(`messages`, `serializedCallOptions`): `Promise` \<[`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

Handles uncached prompts and calls the `_provide` method.

#### Parameters

• **messages**: [`BaseMessage`](../../../../../../../input/load/msgs/base/classes/BaseMessage.md)[]

An array of messages.

• **serializedCallOptions**: `Omit`\<`CallOptions`, `never`\>

Serialized call options.

#### Returns

`Promise` \<[`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

The result from the language model.

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`_provideUncached`](../../../../../base/classes/BaseChatLM.md#_provideuncached)

#### Source

[packages/core/src/events/inference/chat/base.ts:527](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L527)

***

### \_splitCallableOptionsFromCallOptions()

> `protected` **\_splitCallableOptionsFromCallOptions**(`options`?): [[`CallableConfig`](../../../../../../../../record/callable/type-aliases/CallableConfig.md), `Omit`\<`CallOptions`, `never`\>]

Splits the provided call options into callable options and serialized options.

#### Parameters

• **options?**: `Partial`\<`CallOptions`\>

Call options.

#### Returns

[[`CallableConfig`](../../../../../../../../record/callable/type-aliases/CallableConfig.md), `Omit`\<`CallOptions`, `never`\>]

A tuple containing callable options and serialized options.

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`_splitCallableOptionsFromCallOptions`](../../../../../base/classes/BaseChatLM.md#_splitcallableoptionsfromcalloptions)

#### Source

[packages/core/src/events/inference/chat/base.ts:548](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L548)

***

### \_streamIterator()

`Internal`

> **\_streamIterator**(`input`, `options`?): `AsyncGenerator` \<[`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md), `any`, `unknown`\>

Creates an async generator for streaming callable outputs.
This protected method is used internally for streaming operations.

#### Parameters

• **input**: [`BaseLMInput`](../../../../../base/type-aliases/BaseLMInput.md)

The input for the callable.

• **options?**: `Partial`\<`CallOptions`\>

Optional additional options for the callable.

#### Returns

`AsyncGenerator` \<[`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md), `any`, `unknown`\>

An async generator yielding callable outputs.

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`_streamIterator`](../../../../../base/classes/BaseChatLM.md#_streamiterator)

#### Source

[packages/core/src/record/callable.ts:429](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L429)

***

### \_throwErrorForBlockReason()

`Internal`

> `protected` **\_throwErrorForBlockReason**(`blockReason`, `blockReasonMessage`?): `void`

Throws a formatted error based on a provided block reason, potentially including a
custom message.

#### Parameters

• **blockReason**: `string`

The reason provided by the model for blocking the generation.

• **blockReasonMessage?**: `string`

Optional additional message to include in the error.

#### Returns

`void`

#### Throws

An error indicating why the generation was blocked.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:698](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L698)

***

### batch()

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise` \<[`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)[]\>

Batch calls invoke N times, where N is the length of inputs.

##### Parameters

• **inputs**: [`BaseLMInput`](../../../../../base/type-aliases/BaseLMInput.md)[]

Array of inputs in each call in a batch.

• **options?**: `Partial`\<`CallOptions`\> \| `Partial`\<`CallOptions`\>[]

Either a single call options to apply to each call or an array of options for each call.

• **batchOptions?**: [`CallableBatchOptions`](../../../../../../../../record/callable/type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise` \<[`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)[]\>

An arrays of CallOutputs, or mixed CallOutputs and Errors (if returnExceptions is true).

##### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`batch`](../../../../../base/classes/BaseChatLM.md#batch)

##### Source

[packages/core/src/record/callable.ts:368](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L368)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| [`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md))[]\>

##### Parameters

• **inputs**: [`BaseLMInput`](../../../../../base/type-aliases/BaseLMInput.md)[]

• **options?**: `Partial`\<`CallOptions`\> \| `Partial`\<`CallOptions`\>[]

• **batchOptions?**: [`CallableBatchOptions`](../../../../../../../../record/callable/type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise`\<(`Error` \| [`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md))[]\>

##### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`batch`](../../../../../base/classes/BaseChatLM.md#batch)

##### Source

[packages/core/src/record/callable.ts:374](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L374)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| [`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md))[]\>

##### Parameters

• **inputs**: [`BaseLMInput`](../../../../../base/type-aliases/BaseLMInput.md)[]

• **options?**: `Partial`\<`CallOptions`\> \| `Partial`\<`CallOptions`\>[]

• **batchOptions?**: [`CallableBatchOptions`](../../../../../../../../record/callable/type-aliases/CallableBatchOptions.md)

##### Returns

`Promise`\<(`Error` \| [`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md))[]\>

##### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`batch`](../../../../../base/classes/BaseChatLM.md#batch)

##### Source

[packages/core/src/record/callable.ts:380](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L380)

***

### bind()

> **bind**(`kwargs`): [`Callable`](../../../../../../../../record/callable/classes/Callable.md) \<[`BaseLMInput`](../../../../../base/type-aliases/BaseLMInput.md), [`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md), `CallOptions`\>

Creates a new [CallableBind](../../../../../../../../record/callable/classes/CallableBind.md) instance with the specified keyword arguments.
This method allows partial reconfiguration of the callable instance.

#### Parameters

• **kwargs**: `Partial`\<`CallOptions`\>

Partial keyword arguments for the callable configuration.

#### Returns

[`Callable`](../../../../../../../../record/callable/classes/Callable.md) \<[`BaseLMInput`](../../../../../base/type-aliases/BaseLMInput.md), [`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md), `CallOptions`\>

A new [CallableBind](../../../../../../../../record/callable/classes/CallableBind.md) instance with the given keyword arguments.

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`bind`](../../../../../base/classes/BaseChatLM.md#bind)

#### Source

[packages/core/src/record/callable.ts:343](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L343)

***

### completionWithRetry()

#### completionWithRetry(request, options)

> **completionWithRetry**(`request`, `options`?): `Promise`\<`AsyncIterable`\<`GenerateContentResponse`\>\>

Attempts to complete an operation with retries, supporting both streaming and non-streaming responses.
Handles API calls with appropriate retries and error handling.

##### Parameters

• **request**: [`GeminiChatParamsStreaming`](../interfaces/GeminiChatParamsStreaming.md)

The request configuration, determining if streaming is enabled.

• **options?**: [`GeminiCallOptions`](../../../interfaces/GeminiCallOptions.md)

Optional parameters including retry and timeout settings.

##### Returns

`Promise`\<`AsyncIterable`\<`GenerateContentResponse`\>\>

Either an async iterable of chat responses for streaming or a single chat response for non-streaming.

##### Example

```typescript
const geminiChat = new GeminiChat({
  modelName: 'gemini-pro',
  googleApiKey: 'your-api-key',
});

const content = {
  parts: [
    { text: "Hello, world!" }
  ]
};

try {
  const response = await geminiChat.completionWithRetry(
    { contents: [content], stream: false }
  );
  console.log(response);
} catch (error) {
  console.error("Completion failed:", error);
}
```

##### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:640](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L640)

#### completionWithRetry(request, options)

> **completionWithRetry**(`request`, `options`?): `Promise`\<`GenerateContentResponse`\>

##### Parameters

• **request**: [`GeminiChatParamsNonStreaming`](../interfaces/GeminiChatParamsNonStreaming.md)

• **options?**: [`GeminiCallOptions`](../../../interfaces/GeminiCallOptions.md)

##### Returns

`Promise`\<`GenerateContentResponse`\>

##### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:645](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L645)

***

### getAttributes()

> **getAttributes**(): `object`

Retrieves a comprehensive representation of the object's attributes, secrets, and aliases.

#### Returns

`object`

An object containing aliases, secrets, and keyword arguments.

##### aliases

> **aliases**: `SerializedKeyAlias`

##### kwargs

> **kwargs**: `SerializedFields`

##### metadata

> **metadata**: `object`

##### metadata.callables?

> `optional` **callables**: [`SerializedCallableFields`](../../../../../../../../record/callable/type-aliases/SerializedCallableFields.md)

##### metadata.type

> **type**: `string`

##### secrets

> **secrets**: `SecretFields`

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`getAttributes`](../../../../../base/classes/BaseChatLM.md#getattributes)

#### Source

[packages/core/src/record/callable.ts:511](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L511)

***

### getNumTokensInChat()

> **getNumTokensInChat**(`messages`): `Promise`\<`number`\>

Calculates the total number of tokens in an array of chat messages prior to generation.

#### Parameters

• **messages**: [`BaseMessage`](../../../../../../../input/load/msgs/base/classes/BaseMessage.md)[]

An array of base messages to be processed.

#### Returns

`Promise`\<`number`\>

The total number of tokens used in the chat messages.

#### Example

```typescript
const geminiChat = new GeminiChat({
  modelName: 'gemini-pro',
  googleApiKey: 'your-api-key',
});
const messages = [new HumanMessage({ content: "Hello, world!" })];
const tokenCount = await geminiChat.getNumTokensInChat(messages);
console.log(tokenCount);
```

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:775](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L775)

***

### getNumTokensInContents()

> **getNumTokensInContents**(`geminiContents`): `Promise`\<`number`\>

Calculates the total number of tokens in an array of Gemini contents, which can include both text and media.

#### Parameters

• **geminiContents**: `Content`[]

An array of contents each potentially including multiple media types.

#### Returns

`Promise`\<`number`\>

The total number of tokens across all contents.

#### Example

```typescript
const geminiChat = new GeminiChat({
  modelName: 'gemini-pro',
  googleApiKey: 'your-api-key',
});
const contents = [
  { text: "Hello, world!" },
  { inlineData: { mimeType: 'image/png', data: '...' } }
];
const tokenCount = await geminiChat.getNumTokensInContents(contents);
console.log(tokenCount);
```

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:802](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L802)

***

### getNumTokensInGenerations()

> **getNumTokensInGenerations**(`generations`): `Promise`\<`number`\>

Calculates the total number of tokens in an array of generated chat contents.

#### Parameters

• **generations**: [`ChatGenerationChunk`](../../../../../../../output/provide/message/classes/ChatGenerationChunk.md)[]

An array of chat generation chunks.

#### Returns

`Promise`\<`number`\>

The total number of tokens across all provided chat contents.

#### Example

```typescript
const geminiChat = new GeminiChat({
  modelName: 'gemini-pro',
  googleApiKey: 'your-api-key',
});
const tokens = await geminiChat.getNumTokensInGenerations(generations);
console.log("Total tokens in generations:", tokens);
```

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:750](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L750)

***

### getParams()

> **getParams**(`options`?): `Omit` \<[`GeminiChatParams`](../type-aliases/GeminiChatParams.md), `"contents"`\>

Returns the parameters of the model.

#### Parameters

• **options?**: `Omit`\<`CallOptions`, `never`\>

#### Returns

`Omit` \<[`GeminiChatParams`](../type-aliases/GeminiChatParams.md), `"contents"`\>

The parameters of the model.

#### Overrides

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`getParams`](../../../../../base/classes/BaseChatLM.md#getparams)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:341](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L341)

***

### invoke()

> **invoke**(`input`, `options`?): `Promise` \<[`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

Invokes the chat language model with a given input and options.

#### Parameters

• **input**: [`BaseLMInput`](../../../../../base/type-aliases/BaseLMInput.md)

The input for the chat language model.

• **options?**: `CallOptions`

Optional call options.

#### Returns

`Promise` \<[`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

The output llm result from the language model.

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`invoke`](../../../../../base/classes/BaseChatLM.md#invoke)

#### Source

[packages/core/src/events/inference/chat/base.ts:445](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L445)

***

### map()

> **map**(): [`Callable`](../../../../../../../../record/callable/classes/Callable.md) \<[`BaseLMInput`](../../../../../base/type-aliases/BaseLMInput.md)[], [`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)[], `CallOptions`\>

Creates a new [CallableEach](../../../../../../../../record/callable/classes/CallableEach.md) instance for mapping inputs to outputs.
This method allows applying the callable to each input in an array of inputs.

#### Returns

[`Callable`](../../../../../../../../record/callable/classes/Callable.md) \<[`BaseLMInput`](../../../../../base/type-aliases/BaseLMInput.md)[], [`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)[], `CallOptions`\>

A new [CallableEach](../../../../../../../../record/callable/classes/CallableEach.md) instance for mapping operation.

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`map`](../../../../../base/classes/BaseChatLM.md#map)

#### Source

[packages/core/src/record/callable.ts:355](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L355)

***

### pipe()

> **pipe**\<`NewCallOutput`\>(`callableLike`): [`CallableSequence`](../../../../../../../../record/callable/classes/CallableSequence.md) \<[`BaseLMInput`](../../../../../base/type-aliases/BaseLMInput.md), `NewCallOutput`\>

Chains the current callable with another callable, creating a sequence.
This method allows sequential execution of multiple callables.

#### Type parameters

• **NewCallOutput**

#### Parameters

• **callableLike**: [`CallableLike`](../../../../../../../../record/callable/type-aliases/CallableLike.md) \<[`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md), `NewCallOutput`\>

The next callable in the sequence.

#### Returns

[`CallableSequence`](../../../../../../../../record/callable/classes/CallableSequence.md) \<[`BaseLMInput`](../../../../../base/type-aliases/BaseLMInput.md), `NewCallOutput`\>

A new [CallableSequence](../../../../../../../../record/callable/classes/CallableSequence.md) instance representing the chained callables.

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`pipe`](../../../../../base/classes/BaseChatLM.md#pipe)

#### Source

[packages/core/src/record/callable.ts:460](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L460)

***

### provide()

> **provide**(`messages`, `options`?, `callbacks`?): `Promise` \<[`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

Provides the core logic to interface with the chat language model, handling both cached and uncached predictions.

#### Parameters

• **messages**: [`BaseMessageLike`](../../../../../../../input/load/msgs/base/type-aliases/BaseMessageLike.md)[]

An array of messages.

• **options?**: `string`[] \| `CallOptions`

Optional call options or an array of stop words.

• **callbacks?**: `any`

Optional callbacks.

#### Returns

`Promise` \<[`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

The result from the language model.

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`provide`](../../../../../base/classes/BaseChatLM.md#provide)

#### Source

[packages/core/src/events/inference/chat/base.ts:463](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L463)

***

### stream()

> **stream**(`input`, `options`?): `Promise`\<`ReadableStreamAsyncIterable` \<[`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>\>

Creates a readable stream for the callable outputs.
This method allows streaming the outputs of the callable for continuous data.

#### Parameters

• **input**: [`BaseLMInput`](../../../../../base/type-aliases/BaseLMInput.md)

The input for the callable.

• **options?**: `Partial`\<`CallOptions`\>

Optional additional options for the callable.

#### Returns

`Promise`\<`ReadableStreamAsyncIterable` \<[`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>\>

A promise that resolves to a readable stream of callable outputs.

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`stream`](../../../../../base/classes/BaseChatLM.md#stream)

#### Source

[packages/core/src/record/callable.ts:444](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L444)

***

### toJSON()

> **toJSON**(): [`Serialized`](../../../../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized representation based on the object's current state. This method determines whether to use a 'not implemented' or 'constructor' format based on the object's serializability.

#### Returns

[`Serialized`](../../../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`toJSON`](../../../../../base/classes/BaseChatLM.md#tojson)

#### Source

[packages/core/src/load/serializable.ts:665](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L665)

***

### toJSONConstructor()

> **toJSONConstructor**(`aliases`, `secrets`, `kwargs`): [`Serialized`](../../../../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized constructor format. This method provides a way to serialize object construction details, including any aliases or secrets.

#### Parameters

• **aliases**: `SerializedKeyAlias`

Key aliases to include in the serialized output.

• **secrets**: `SecretFields`

Secrets to be secured in the serialized output.

• **kwargs**: `SerializedFields`

Additional keyword arguments to include in the serialized output.

#### Returns

[`Serialized`](../../../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object as a constructor.

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`toJSONConstructor`](../../../../../base/classes/BaseChatLM.md#tojsonconstructor)

#### Source

[packages/core/src/load/serializable.ts:478](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L478)

***

### toJSONNotImplemented()

> **toJSONNotImplemented**(): [`Serialized`](../../../../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized format that is not implemented. This method should be overridden in subclasses to provide specific serialization behavior.

#### Returns

[`Serialized`](../../../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`toJSONNotImplemented`](../../../../../base/classes/BaseChatLM.md#tojsonnotimplemented)

#### Source

[packages/core/src/load/serializable.ts:448](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L448)

***

### toJSONSecret()

> **toJSONSecret**(`secretKey`): [`Serialized`](../../../../../../../../load/serializable/type-aliases/Serialized.md)

Converts a secret key to its serialized format. This method is typically used for serializing secrets in a secure manner.

#### Parameters

• **secretKey**: `string`

The secret key to serialize.

#### Returns

[`Serialized`](../../../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the secret key.

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`toJSONSecret`](../../../../../base/classes/BaseChatLM.md#tojsonsecret)

#### Source

[packages/core/src/load/serializable.ts:462](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/load/serializable.ts#L462)

***

### withConfig()

> **withConfig**(`config`): [`CallableBind`](../../../../../../../../record/callable/classes/CallableBind.md) \<[`BaseLMInput`](../../../../../base/type-aliases/BaseLMInput.md), [`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md), `CallOptions`\>

Creates a new [CallableBind](../../../../../../../../record/callable/classes/CallableBind.md) instance with the specified configuration.
This method allows reconfiguration of the callable instance.

#### Parameters

• **config**: [`CallableConfig`](../../../../../../../../record/callable/type-aliases/CallableConfig.md)

The configuration to apply to the new callable instance.

#### Returns

[`CallableBind`](../../../../../../../../record/callable/classes/CallableBind.md) \<[`BaseLMInput`](../../../../../base/type-aliases/BaseLMInput.md), [`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md), `CallOptions`\>

A new [CallableBind](../../../../../../../../record/callable/classes/CallableBind.md) instance with the given configuration.

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`withConfig`](../../../../../base/classes/BaseChatLM.md#withconfig)

#### Source

[packages/core/src/record/callable.ts:314](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L314)

***

### withFallbacks()

> **withFallbacks**(`fields`): [`CallableWithFallbacks`](../../../../../../../../record/callable/classes/CallableWithFallbacks.md) \<[`BaseLMInput`](../../../../../base/type-aliases/BaseLMInput.md), [`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

Creates a new [CallableWithFallbacks](../../../../../../../../record/callable/classes/CallableWithFallbacks.md) instance with specified fallbacks.
This method allows defining fallback callables for error handling or retries.

#### Parameters

• **fields**

Object containing an array of fallback callables.

• **fields.fallbacks**: [`Callable`](../../../../../../../../record/callable/classes/Callable.md) \<[`BaseLMInput`](../../../../../base/type-aliases/BaseLMInput.md), [`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md), [`CallableConfig`](../../../../../../../../record/callable/type-aliases/CallableConfig.md)\>[]

#### Returns

[`CallableWithFallbacks`](../../../../../../../../record/callable/classes/CallableWithFallbacks.md) \<[`BaseLMInput`](../../../../../base/type-aliases/BaseLMInput.md), [`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

A new [CallableWithFallbacks](../../../../../../../../record/callable/classes/CallableWithFallbacks.md) instance with the specified fallbacks.

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`withFallbacks`](../../../../../base/classes/BaseChatLM.md#withfallbacks)

#### Source

[packages/core/src/record/callable.ts:327](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L327)

***

### \_convertInputToPrompt()

`Internal`

> `static` `protected` **\_convertInputToPrompt**(`input`): [`BasePrompt`](../../../../../../../input/load/prompts/base/classes/BasePrompt.md)

Converts a given [BaseLMInput](../../../../../base/type-aliases/BaseLMInput.md) to a [BasePrompt](../../../../../../../input/load/prompts/base/classes/BasePrompt.md).

#### Parameters

• **input**: [`BaseLMInput`](../../../../../base/type-aliases/BaseLMInput.md)

The input for the language model.

#### Returns

[`BasePrompt`](../../../../../../../input/load/prompts/base/classes/BasePrompt.md)

The corresponding prompt.

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`_convertInputToPrompt`](../../../../../base/classes/BaseChatLM.md#_convertinputtoprompt)

#### Source

[packages/core/src/events/inference/chat/base.ts:158](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/base.ts#L158)

***

### \_name()

> `static` **\_name**(): `string`

Generates a unique name for the class, typically used for serialization identification.

#### Returns

`string`

#### Overrides

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`_name`](../../../../../base/classes/BaseChatLM.md#_name)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:99](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L99)

***

### getModelContextSize()

> `static` **getModelContextSize**(`modelName`): `number`

Retrieves the context size of the specified model, which indicates the maximum number
of tokens that can be considered in one response.

#### Parameters

• **modelName**: `"gemini-pro"` \| `"gemini-pro-vision"`

The name of the model to query.

#### Returns

`number`

The number of tokens in the model's context size.

#### Example

```typescript
const contextSize = GeminiChat.getModelContextSize('gemini-pro-vision');
console.log(contextSize); // Outputs: 16384
```

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:724](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L724)

***

### isCallable()

> `static` **isCallable**(`anything`): `anything is Callable<unknown, unknown, CallableConfig>`

Checks if a given object is an instance of Callable.

#### Parameters

• **anything**: `any`

Object to be checked.

#### Returns

`anything is Callable<unknown, unknown, CallableConfig>`

True if the object is an instance of Callable, false otherwise.

#### Inherited from

[`BaseChatLM`](../../../../../base/classes/BaseChatLM.md) . [`isCallable`](../../../../../base/classes/BaseChatLM.md#iscallable)

#### Source

[packages/core/src/record/callable.ts:196](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/record/callable.ts#L196)
