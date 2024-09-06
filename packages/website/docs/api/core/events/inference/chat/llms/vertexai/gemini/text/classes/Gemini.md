# Class: Gemini\<CallOptions\>

The main class for interacting with the Gemini AI model, capable of handling both
streaming and non-streaming responses.

## Example

```typescript
const geminiAI = new Gemini({
  modelName: 'gemini-pro',
  googleApiKey: 'your-api-key',
});
const prompt = "Hello, world!";
const response = await geminiAI.invoke(prompt);
console.log(response);
```

## Extends

- [`BaseLLM`](../../../../../base/classes/BaseLLM.md)\<`CallOptions`\>

## Type parameters

• **CallOptions** *extends* [`GeminiCallOptions`](../../../interfaces/GeminiCallOptions.md) = [`GeminiCallOptions`](../../../interfaces/GeminiCallOptions.md)

## Implements

- [`VertexAIBaseInput`](../../../interfaces/VertexAIBaseInput.md)

## Constructors

### new Gemini()

> **new Gemini**\<`CallOptions`\>(`fields`?): [`Gemini`](Gemini.md)\<`CallOptions`\>

#### Parameters

• **fields?**: `Partial` \<[`VertexAIBaseInput`](../../../interfaces/VertexAIBaseInput.md)\> & [`BaseLLMParams`](../../../../../base/interfaces/BaseLLMParams.md)

#### Returns

[`Gemini`](Gemini.md)\<`CallOptions`\>

#### Overrides

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`constructor`](../../../../../base/classes/BaseLLM.md#constructors)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:228](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L228)

## Properties

### \_client

`Internal`

> `private` **\_client**: `GoogleGenerativeAI`

VertexAI API Client.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:222](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L222)

***

### \_isCallable

> **\_isCallable**: `boolean` = `true`

Indicates if the instance is callable. If false, then the callable cannot be invoked.

#### Inherited from

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`_isCallable`](../../../../../base/classes/BaseLLM.md#_iscallable)

#### Source

[packages/core/src/record/callable.ts:188](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L188)

***

### \_isSerializable

> **\_isSerializable**: `boolean` = `true`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Overrides

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`_isSerializable`](../../../../../base/classes/BaseLLM.md#_isserializable)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:90](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L90)

***

### \_kwargs

> **\_kwargs**: `SerializedFields`

Key-value pairs of properties to be serialized.

#### Inherited from

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`_kwargs`](../../../../../base/classes/BaseLLM.md#_kwargs)

#### Source

[packages/core/src/load/serializable.ts:168](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L168)

***

### \_namespace

> **\_namespace**: `string`[]

Unique namespace identifier for the serialized object, represented as an array of strings.

#### Inherited from

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`_namespace`](../../../../../base/classes/BaseLLM.md#_namespace)

#### Source

[packages/core/src/events/base.ts:44](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L44)

***

### additionalKwargs?

> `optional` **additionalKwargs**: `Record`\<`string`, `unknown`\>

Holds any additional parameters that are valid to pass to
VertexAI models that are not explicitly specified on the class.

#### Implementation of

[`VertexAIBaseInput`](../../../interfaces/VertexAIBaseInput.md) . [`additionalKwargs`](../../../interfaces/VertexAIBaseInput.md#additionalkwargs)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:210](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L210)

***

### cache?

> `optional` **cache**: [`BaseCache`](../../../../../../../../cache/base/classes/BaseCache.md) \<[`Generation`](../../../../../../../output/provide/generation/interfaces/Generation.md)[]\>

Cache instance to store and retrieve results for given prompts.

#### Inherited from

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`cache`](../../../../../base/classes/BaseLLM.md#cache)

#### Source

[packages/core/src/events/inference/chat/base.ts:93](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/base.ts#L93)

***

### callbacks?

`Experimental`

> `optional` **callbacks**: `any`

not-implemented yet

#### Inherited from

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`callbacks`](../../../../../base/classes/BaseLLM.md#callbacks)

#### Source

[packages/core/src/events/base.ts:79](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L79)

***

### caller

> **caller**: `AsyncCaller`

Instance responsible for making asynchronous calls.

#### Inherited from

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`caller`](../../../../../base/classes/BaseLLM.md#caller)

#### Source

[packages/core/src/events/inference/chat/base.ts:88](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/base.ts#L88)

***

### candidateCount

> **candidateCount**: `number` = `1`

The number of response variations to return.

This value must be 1.

#### Implementation of

[`VertexAIBaseInput`](../../../interfaces/VertexAIBaseInput.md) . [`candidateCount`](../../../interfaces/VertexAIBaseInput.md#candidatecount)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:153](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L153)

***

### googleApiKey?

> `optional` **googleApiKey**: `string`

API key to use when making requests to Gemini. Defaults to the value of
`GOOGLE_API_KEY` environment variable.

#### Implementation of

[`VertexAIBaseInput`](../../../interfaces/VertexAIBaseInput.md) . [`googleApiKey`](../../../interfaces/VertexAIBaseInput.md#googleapikey)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:196](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L196)

***

### maxOutputTokens

> **maxOutputTokens**: `number` = `2048`

Maximum number of tokens that can be generated in the response. A token
is approximately four characters. 100 tokens correspond to roughly 60-80
words. Specify a lower value for shorter responses and a higher value for
potentially longer responses.

Range: 1-2048

Default for gemini-pro: 2048

#### Implementation of

[`VertexAIBaseInput`](../../../interfaces/VertexAIBaseInput.md) . [`maxOutputTokens`](../../../interfaces/VertexAIBaseInput.md#maxoutputtokens)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:165](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L165)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Inherited from

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`metadata`](../../../../../base/classes/BaseLLM.md#metadata)

#### Source

[packages/core/src/events/base.ts:74](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L74)

***

### modelName

> **modelName**: `string` = `'gemini-pro'`

ID of the model to use. Only support `gemini-pro` for now

#### Implementation of

[`VertexAIBaseInput`](../../../interfaces/VertexAIBaseInput.md) . [`modelName`](../../../interfaces/VertexAIBaseInput.md#modelname)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:111](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L111)

***

### name?

`Experimental`

> `optional` **name**: `string`

The name of the callable, used for identification or logging.

not-implement yet

#### Inherited from

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`name`](../../../../../base/classes/BaseLLM.md#name)

#### Source

[packages/core/src/events/base.ts:61](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L61)

***

### safetySettings?

> `optional` **safetySettings**: [`GeminiSafetySetting`](../../../interfaces/GeminiSafetySetting.md)[]

The Vertex AI Gemini API blocks unsafe content based on a list of safety
attributes and their configured blocking thresholds.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:216](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L216)

***

### stopSequences?

> `optional` **stopSequences**: `string`[]

Up to 5 sequences where the API will stop generating text if one of the
strings is encountered in the response. If a string appears multiple
times in the response, then the response truncates where it's first
encountered. The strings are case-sensitive.

#### Implementation of

[`VertexAIBaseInput`](../../../interfaces/VertexAIBaseInput.md) . [`stopSequences`](../../../interfaces/VertexAIBaseInput.md#stopsequences)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:204](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L204)

***

### streaming

> **streaming**: `boolean` = `true`

Streaming involves receiving responses to prompts as they are generated.
That is, as soon as the model generates output tokens, the output tokens
are sent.

#### Implementation of

[`VertexAIBaseInput`](../../../interfaces/VertexAIBaseInput.md) . [`streaming`](../../../interfaces/VertexAIBaseInput.md#streaming)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:172](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L172)

***

### tags?

`Experimental`

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables.

not-implement yet

#### Inherited from

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`tags`](../../../../../base/classes/BaseLLM.md#tags)

#### Source

[packages/core/src/events/base.ts:69](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L69)

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

#### Implementation of

[`VertexAIBaseInput`](../../../interfaces/VertexAIBaseInput.md) . [`temperature`](../../../interfaces/VertexAIBaseInput.md#temperature)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:128](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L128)

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

#### Implementation of

[`VertexAIBaseInput`](../../../interfaces/VertexAIBaseInput.md) . [`topK`](../../../interfaces/VertexAIBaseInput.md#topk)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:190](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L190)

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

[`VertexAIBaseInput`](../../../interfaces/VertexAIBaseInput.md) . [`topP`](../../../interfaces/VertexAIBaseInput.md#topp)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:146](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L146)

***

### verbose

`Experimental`

> **verbose**: `boolean`

Specifies whether the event should provide verbose output, such as detailed logs or response texts.
This can be useful for debugging or detailed monitoring of event handling processes.

not-implement yet

#### Inherited from

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`verbose`](../../../../../base/classes/BaseLLM.md#verbose)

#### Source

[packages/core/src/events/base.ts:53](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L53)

## Accessors

### \_aliases

> `get` **\_aliases**(): `undefined` \| `SerializedFields`

Retrieves alias mappings for the object's attribute names.

#### Returns

`undefined` \| `SerializedFields`

An object representing key aliases, or undefined if none are defined.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:98](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L98)

***

### \_attributes

> `get` **\_attributes**(): `undefined` \| `SerializedFields`

Retrieves attributes of the object.

#### Returns

`undefined` \| `SerializedFields`

An object representing attributes, or undefined if none are defined.

#### Source

[packages/core/src/events/base.ts:81](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L81)

***

### \_id

> `get` **\_id**(): `string`[]

Retrieves the name of the class. This provides a unique identifier for serialization.

#### Returns

`string`[]

The path of serializable.

#### Source

[packages/core/src/load/serializable.ts:187](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L187)

***

### \_secrets

> `get` **\_secrets**(): `undefined` \| `SecretFields`

Retrieves any secrets defined in the object.

#### Returns

`undefined` \| `SecretFields`

An object representing secret fields, or undefined if none are defined.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:92](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L92)

## Methods

### \_completionWithStream()

`Internal`

> `private` **\_completionWithStream**(`params`, `prompt`, `options`): `Promise`\<`object`\>

Handles the streaming of data from the Gemini model, aggregating responses as they are
received.

#### Parameters

• **params**: `Omit` \<[`GeminiParams`](../type-aliases/GeminiParams.md), `"prompt"`\>

Parameters for the stream request, excluding the 'prompt'.

• **prompt**: `string`

The prompt to use for generating content.

• **options**: `Omit`\<`CallOptions`, `never`\>

Serialized call options relevant to the request.

#### Returns

`Promise`\<`object`\>

A promise resolving to a structured response aggregating all streamed content.

##### candidates

> **candidates**: [`GeminiTextCandidate`](../type-aliases/GeminiTextCandidate.md)[]

##### promptFeedback?

> `optional` **promptFeedback**: `PromptFeedback`

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:448](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L448)

***

### \_eventNamespace()

> **\_eventNamespace**(): `string`[]

A predefined namespace array to identify the type of language model and other related namespaces.

#### Returns

`string`[]

#### Inherited from

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`_eventNamespace`](../../../../../base/classes/BaseLLM.md#_eventnamespace)

#### Source

[packages/core/src/events/inference/chat/base.ts:240](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/base.ts#L240)

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

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`_failedAttemptHandler`](../../../../../base/classes/BaseLLM.md#_failedattempthandler)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:308](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L308)

***

### \_generateContentIterable()

`Internal`

> `private` **\_generateContentIterable**(`model`, `prompt`, `options`?): `AsyncIterable`\<`EnhancedGenerateContentResponse`\>

Generates content asynchronously by creating an iterable that yields content responses
from the AI model as they are received.

#### Parameters

• **model**: `GenerativeModel`

The generative model to use for content generation.

• **prompt**: `string`

The input prompt based on which the content is generated.

• **options?**: [`GeminiCallOptions`](../../../interfaces/GeminiCallOptions.md)

Optional parameters that may affect the generation process.

#### Returns

`AsyncIterable`\<`EnhancedGenerateContentResponse`\>

An async iterable that yields content responses.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:509](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L509)

***

### \_getClient()

`Internal`

> `private` **\_getClient**(): `GoogleGenerativeAI`

Retrieves or initializes the client for interacting with the AI service.

#### Returns

`GoogleGenerativeAI`

The initialized client.

#### Throws

Error if the API key is not found.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:686](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L686)

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

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:276](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L276)

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

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`_getLLMStrKey`](../../../../../base/classes/BaseLLM.md#_getllmstrkey)

#### Source

[packages/core/src/events/inference/chat/base.ts:185](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/base.ts#L185)

***

### \_getSafetySettings()

`Internal`

> `protected` **\_getSafetySettings**(`options`?): `SafetySetting`[]

Retrieves the safety settings from the provided options, which configure thresholds
for blocking content based on its safety category.

#### Parameters

• **options?**: `Omit`\<`CallOptions`, `never`\>

Optional serialized call options that may include safety settings.

#### Returns

`SafetySetting`[]

An array of safety settings used to configure content blocking.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:295](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L295)

***

### \_identifyParams()

`Internal`

> `protected` **\_identifyParams**(): `Record`\<`string`, `any`\>

Method to identify additional parameters specific to implementations.

#### Returns

`Record`\<`string`, `any`\>

A record of identified parameters.

#### Inherited from

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`_identifyParams`](../../../../../base/classes/BaseLLM.md#_identifyparams)

#### Source

[packages/core/src/events/inference/chat/base.ts:175](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/base.ts#L175)

***

### \_llmType()

> **\_llmType**(): `string`

Returns the LLM type.

#### Returns

`string`

The type of LLM.

#### Overrides

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`_llmType`](../../../../../base/classes/BaseLLM.md#_llmtype)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:224](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L224)

***

### \_modelType()

> **\_modelType**(): `string`

Returns the type of the model.

#### Returns

`string`

The type of the model.

#### Inherited from

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`_modelType`](../../../../../base/classes/BaseLLM.md#_modeltype)

#### Source

[packages/core/src/events/inference/chat/base.ts:256](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/base.ts#L256)

***

### \_provide()

`Internal`

> **\_provide**(`prompt`, `options`): `Promise` \<[`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

Provides a response from the Gemini model based on the given prompt and options.
Handles both streaming and non-streaming responses.

#### Parameters

• **prompt**: `string`

The text prompt to send to the model.

• **options**: `Omit`\<`CallOptions`, `never`\>

Serialized call options that may include request modifiers like streaming.

#### Returns

`Promise` \<[`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

A promise resolving to the language model result.

#### Overrides

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`_provide`](../../../../../base/classes/BaseLLM.md#_provide)

#### Example

```typescript
const geminiAI = new Gemini({
  modelName: 'gemini-pro',
  googleApiKey: 'your-api-key',
});
const prompt = "Explain the theory of relativity.";
const result = await geminiAI._provide(prompt, { streaming: false });
console.log(result);
```

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:344](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L344)

***

### \_provideUncached()

> `protected` **\_provideUncached**(`prompt`, `serializedCallOptions`): `Promise` \<[`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

Handles uncached prompts and calls the `_provide` method.

#### Parameters

• **prompt**: `string`

A prompt.

• **serializedCallOptions**: `Omit`\<`CallOptions`, `never`\>

Serialized call options.

#### Returns

`Promise` \<[`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

The result from the language model.

#### Inherited from

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`_provideUncached`](../../../../../base/classes/BaseLLM.md#_provideuncached)

#### Source

[packages/core/src/events/inference/chat/base.ts:350](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/base.ts#L350)

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

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`_splitCallableOptionsFromCallOptions`](../../../../../base/classes/BaseLLM.md#_splitcallableoptionsfromcalloptions)

#### Source

[packages/core/src/events/inference/chat/base.ts:371](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/base.ts#L371)

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

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`_streamIterator`](../../../../../base/classes/BaseLLM.md#_streamiterator)

#### Source

[packages/core/src/record/callable.ts:429](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L429)

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

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:646](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L646)

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

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`batch`](../../../../../base/classes/BaseLLM.md#batch)

##### Source

[packages/core/src/record/callable.ts:368](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L368)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| [`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md))[]\>

##### Parameters

• **inputs**: [`BaseLMInput`](../../../../../base/type-aliases/BaseLMInput.md)[]

• **options?**: `Partial`\<`CallOptions`\> \| `Partial`\<`CallOptions`\>[]

• **batchOptions?**: [`CallableBatchOptions`](../../../../../../../../record/callable/type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise`\<(`Error` \| [`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md))[]\>

##### Inherited from

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`batch`](../../../../../base/classes/BaseLLM.md#batch)

##### Source

[packages/core/src/record/callable.ts:374](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L374)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| [`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md))[]\>

##### Parameters

• **inputs**: [`BaseLMInput`](../../../../../base/type-aliases/BaseLMInput.md)[]

• **options?**: `Partial`\<`CallOptions`\> \| `Partial`\<`CallOptions`\>[]

• **batchOptions?**: [`CallableBatchOptions`](../../../../../../../../record/callable/type-aliases/CallableBatchOptions.md)

##### Returns

`Promise`\<(`Error` \| [`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md))[]\>

##### Inherited from

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`batch`](../../../../../base/classes/BaseLLM.md#batch)

##### Source

[packages/core/src/record/callable.ts:380](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L380)

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

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`bind`](../../../../../base/classes/BaseLLM.md#bind)

#### Source

[packages/core/src/record/callable.ts:343](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L343)

***

### completionWithRetry()

#### completionWithRetry(request, options)

> **completionWithRetry**(`request`, `options`?): `Promise`\<`AsyncIterable`\<`EnhancedGenerateContentResponse`\>\>

Attempts to complete an operation with the Gemini model, retrying on failure.
Supports both streaming and non-streaming operations based on the provided request configuration.

##### Parameters

• **request**: [`GeminiParamsStreaming`](../interfaces/GeminiParamsStreaming.md)

The request parameters, which may indicate whether the response should be streamed.

• **options?**: [`GeminiCallOptions`](../../../interfaces/GeminiCallOptions.md)

Optional call options including signaling for aborting the request.

##### Returns

`Promise`\<`AsyncIterable`\<`EnhancedGenerateContentResponse`\>\>

Either an async iterable of responses for streaming or a single response for non-streaming.

##### Example

```typescript
const geminiAI = new Gemini({
  modelName: 'gemini-pro',
  googleApiKey: 'your-api-key',
});
try {
  const response = await geminiAI.completionWithRetry({ model: 'gemini-pro', prompt: "Hello, world!", stream: false });
  console.log(response);
} catch (error) {
  console.error("Failed to fetch response:", error);
}
```

##### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:564](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L564)

#### completionWithRetry(request, options)

> **completionWithRetry**(`request`, `options`?): `Promise`\<`EnhancedGenerateContentResponse`\>

##### Parameters

• **request**: [`GeminiParamsNonStreaming`](../interfaces/GeminiParamsNonStreaming.md)

• **options?**: [`GeminiCallOptions`](../../../interfaces/GeminiCallOptions.md)

##### Returns

`Promise`\<`EnhancedGenerateContentResponse`\>

##### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:569](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L569)

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

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`getAttributes`](../../../../../base/classes/BaseLLM.md#getattributes)

#### Source

[packages/core/src/record/callable.ts:511](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L511)

***

### getNumTokens()

> **getNumTokens**(`text`): `Promise`\<`number`\>

Retrieves the number of tokens in the given text using the specified model's tokenizer.

#### Parameters

• **text**: `string`

The text to tokenize.

#### Returns

`Promise`\<`number`\>

The total number of tokens in the text.

#### Example

```
const geminiAI = new Gemini({
  modelName: 'gemini-pro',
  googleApiKey: 'your-api-key',
});
const tokenCount = await geminiAI.getNumTokens("Example text for tokenization.");
console.log(tokenCount); // Outputs the number of tokens
```

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:627](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L627)

***

### getParams()

> **getParams**(`options`?): `Omit` \<[`GeminiParams`](../type-aliases/GeminiParams.md), `"prompt"`\>

Returns the parameters of the model.

#### Parameters

• **options?**: `Omit`\<`CallOptions`, `never`\>

#### Returns

`Omit` \<[`GeminiParams`](../type-aliases/GeminiParams.md), `"prompt"`\>

The parameters of the model.

#### Overrides

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`getParams`](../../../../../base/classes/BaseLLM.md#getparams)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:313](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L313)

***

### invoke()

> **invoke**(`input`, `options`?): `Promise` \<[`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

Invokes the language model with a given input and options.

#### Parameters

• **input**: [`BaseLMInput`](../../../../../base/type-aliases/BaseLMInput.md)

The input for the language model.

• **options?**: `CallOptions`

Optional call options.

#### Returns

`Promise` \<[`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

The output llm result from the language model.

#### Inherited from

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`invoke`](../../../../../base/classes/BaseLLM.md#invoke)

#### Source

[packages/core/src/events/inference/chat/base.ts:274](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/base.ts#L274)

***

### map()

> **map**(): [`Callable`](../../../../../../../../record/callable/classes/Callable.md) \<[`BaseLMInput`](../../../../../base/type-aliases/BaseLMInput.md)[], [`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)[], `CallOptions`\>

Creates a new [CallableEach](../../../../../../../../record/callable/classes/CallableEach.md) instance for mapping inputs to outputs.
This method allows applying the callable to each input in an array of inputs.

#### Returns

[`Callable`](../../../../../../../../record/callable/classes/Callable.md) \<[`BaseLMInput`](../../../../../base/type-aliases/BaseLMInput.md)[], [`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)[], `CallOptions`\>

A new [CallableEach](../../../../../../../../record/callable/classes/CallableEach.md) instance for mapping operation.

#### Inherited from

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`map`](../../../../../base/classes/BaseLLM.md#map)

#### Source

[packages/core/src/record/callable.ts:355](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L355)

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

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`pipe`](../../../../../base/classes/BaseLLM.md#pipe)

#### Source

[packages/core/src/record/callable.ts:460](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L460)

***

### provide()

> **provide**(`prompt`, `options`?, `callbacks`?): `Promise` \<[`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

Provides the core logic to interface with the language model, handling both cached and uncached predictions.

#### Parameters

• **prompt**: `string`

A prompt.

• **options?**: `string`[] \| `CallOptions`

Optional call options or an array of stop words.

• **callbacks?**: `any`

Optional callbacks.

#### Returns

`Promise` \<[`LLMResult`](../../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

The result from the language model.

#### Inherited from

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`provide`](../../../../../base/classes/BaseLLM.md#provide)

#### Source

[packages/core/src/events/inference/chat/base.ts:292](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/base.ts#L292)

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

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`stream`](../../../../../base/classes/BaseLLM.md#stream)

#### Source

[packages/core/src/record/callable.ts:444](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L444)

***

### toJSON()

> **toJSON**(): [`Serialized`](../../../../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized representation based on the object's current state. This method determines whether to use a 'not implemented' or 'constructor' format based on the object's serializability.

#### Returns

[`Serialized`](../../../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`toJSON`](../../../../../base/classes/BaseLLM.md#tojson)

#### Source

[packages/core/src/load/serializable.ts:665](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L665)

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

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`toJSONConstructor`](../../../../../base/classes/BaseLLM.md#tojsonconstructor)

#### Source

[packages/core/src/load/serializable.ts:478](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L478)

***

### toJSONNotImplemented()

> **toJSONNotImplemented**(): [`Serialized`](../../../../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized format that is not implemented. This method should be overridden in subclasses to provide specific serialization behavior.

#### Returns

[`Serialized`](../../../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`toJSONNotImplemented`](../../../../../base/classes/BaseLLM.md#tojsonnotimplemented)

#### Source

[packages/core/src/load/serializable.ts:448](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L448)

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

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`toJSONSecret`](../../../../../base/classes/BaseLLM.md#tojsonsecret)

#### Source

[packages/core/src/load/serializable.ts:462](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L462)

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

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`withConfig`](../../../../../base/classes/BaseLLM.md#withconfig)

#### Source

[packages/core/src/record/callable.ts:314](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L314)

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

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`withFallbacks`](../../../../../base/classes/BaseLLM.md#withfallbacks)

#### Source

[packages/core/src/record/callable.ts:327](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L327)

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

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`_convertInputToPrompt`](../../../../../base/classes/BaseLLM.md#_convertinputtoprompt)

#### Source

[packages/core/src/events/inference/chat/base.ts:158](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/base.ts#L158)

***

### \_name()

> `static` **\_name**(): `string`

Generates a unique name for the class, typically used for serialization identification.

#### Returns

`string`

#### Overrides

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`_name`](../../../../../base/classes/BaseLLM.md#_name)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:104](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L104)

***

### getModelContextSize()

> `static` **getModelContextSize**(`modelName`): `number`

Retrieves the context size of the specified model, which indicates the maximum number 
of tokens that can be considered in one response.

#### Parameters

• **modelName**: `"gemini-pro"`

The name of the model to query.

#### Returns

`number`

The number of tokens in the model's context size.

#### Example

```
const contextSize = Gemini.getModelContextSize('gemini-pro');
console.log(contextSize); // Outputs: 32768
```

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:672](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L672)

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

[`BaseLLM`](../../../../../base/classes/BaseLLM.md) . [`isCallable`](../../../../../base/classes/BaseLLM.md#iscallable)

#### Source

[packages/core/src/record/callable.ts:196](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L196)
