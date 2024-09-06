# Class: OpenAIChat\<CallOptions\>

Class for handling interactions with the OpenAI API, specifically designed to manage chat
functionalities.

## Example

```typescript
const openAI = new OpenAIChat({
  modelName: 'gpt-3.5-turbo',
  openAIApiKey: 'your-api-key',
});
const message = new HumanMessage("Hello, world!");
const response = await openAI.invoke([message]);
console.log(response);
```

## Extends

- [`BaseChatLM`](../../../../base/classes/BaseChatLM.md)\<`CallOptions`\>

## Type parameters

• **CallOptions** *extends* `OpenAIChatCallOptions` = `OpenAIChatCallOptions`

Extends OpenAIChatCallOptions for detailed API call configurations.

## Implements

- `OpenAIChatInput`

## Constructors

### new OpenAIChat()

> **new OpenAIChat**\<`CallOptions`\>(`fields`?): [`OpenAIChat`](OpenAIChat.md)\<`CallOptions`\>

Constructs an instance of the OpenAIChat class with options to configure the OpenAI
client.

#### Parameters

• **fields?**: `Partial`\<`OpenAIChatInput`\> & [`BaseLLMParams`](../../../../base/interfaces/BaseLLMParams.md) & `object`

Configuration options for the OpenAI client and chat behavior.

#### Returns

[`OpenAIChat`](OpenAIChat.md)\<`CallOptions`\>

#### Overrides

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`constructor`](../../../../base/classes/BaseChatLM.md#constructors)

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:272](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L272)

## Properties

### \_client

`Internal`

> `private` **\_client**: `OpenAI`

OpenAI API Client.

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:252](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L252)

***

### \_clientOptions

`Internal`

> `private` **\_clientOptions**: `ClientOptions`

OpenAI API request options.

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:258](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L258)

***

### \_isCallable

> **\_isCallable**: `boolean` = `true`

Indicates if the instance is callable. If false, then the callable cannot be invoked.

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`_isCallable`](../../../../base/classes/BaseChatLM.md#_iscallable)

#### Source

[packages/core/src/record/callable.ts:188](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L188)

***

### \_isMultimodal

`Internal`

> `private` **\_isMultimodal**: `boolean` = `false`

Whether the model supports vision (i.e. multimodal)

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:264](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L264)

***

### \_isSerializable

> **\_isSerializable**: `boolean` = `true`

Indicates if the instance is serializable. If false, toJSON returns a non-implementable serialization.

#### Overrides

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`_isSerializable`](../../../../base/classes/BaseChatLM.md#_isserializable)

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:69](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L69)

***

### \_kwargs

> **\_kwargs**: `SerializedFields`

Key-value pairs of properties to be serialized.

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`_kwargs`](../../../../base/classes/BaseChatLM.md#_kwargs)

#### Source

[packages/core/src/load/serializable.ts:168](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L168)

***

### \_namespace

> **\_namespace**: `string`[]

Unique namespace identifier for the serialized object, represented as an array of strings.

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`_namespace`](../../../../base/classes/BaseChatLM.md#_namespace)

#### Source

[packages/core/src/events/base.ts:44](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L44)

***

### additionalKwargs?

> `optional` **additionalKwargs**: `Record`\<`string`, `unknown`\>

Holds any additional parameters that are valid to pass to
[OpenAI API Reference]([https://platform.openai.com/docs/api-reference/introduction](https://platform.openai.com/docs/api-reference/introduction))
that are not explicitly specified on this class.

#### Implementation of

`OpenAIChatInput.additionalKwargs`

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:227](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L227)

***

### cache?

> `optional` **cache**: [`BaseCache`](../../../../../../../cache/base/classes/BaseCache.md) \<[`Generation`](../../../../../../output/provide/generation/interfaces/Generation.md)[]\>

Cache instance to store and retrieve results for given prompts.

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`cache`](../../../../base/classes/BaseChatLM.md#cache)

#### Source

[packages/core/src/events/inference/chat/base.ts:93](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/base.ts#L93)

***

### callbacks?

`Experimental`

> `optional` **callbacks**: `any`

not-implemented yet

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`callbacks`](../../../../base/classes/BaseChatLM.md#callbacks)

#### Source

[packages/core/src/events/base.ts:79](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L79)

***

### caller

> **caller**: `AsyncCaller`

Instance responsible for making asynchronous calls.

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`caller`](../../../../base/classes/BaseChatLM.md#caller)

#### Source

[packages/core/src/events/inference/chat/base.ts:88](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/base.ts#L88)

***

### chatMessages?

> `optional` **chatMessages**: `ChatCompletionMessageParam`[]

ChatGPT messages to pass as a prefix to the prompt

#### Implementation of

`OpenAIChatInput.chatMessages`

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:241](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L241)

***

### frequencyPenalty

> **frequencyPenalty**: `number` = `0`

Number between -2.0 and 2.0. Positive values penalize new tokens based on their
existing frequency in the text so far, decreasing the model's likelihood to
repeat the same line verbatim.

[See more information about frequency and presence panalties]([https://platform.openai.com/docs/guides/text-generation/parameter-details](https://platform.openai.com/docs/guides/text-generation/parameter-details))

#### Implementation of

`OpenAIChatInput.frequencyPenalty`

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:104](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L104)

***

### logitBias?

> `optional` **logitBias**: `Record`\<`string`, `number`\>

Modify the likelihood of specified tokens appearing in the completion.

Accepts a json object that maps tokens (specified by their token ID in the GPT
tokenizer) to an associated bias value from -100 to 100. You can use this
[tokenizer tool]([https://platform.openai.com/tokenizer?view=bpe](https://platform.openai.com/tokenizer?view=bpe))
(which works for both GPT-2 and GPT-3) to convert text to token IDs. Mathematically,
the bias is added to the logits generated by the model prior to sampling.
The exact effect will vary per model, but values between -1 and 1 should
decrease or increase likelihood of selection; values like -100 or 100 should
result in a ban or exclusive selection of the relevant token.

As an example, you can pass `{"50256": -100}` to prevent the end-of-text token
from being generated.

#### Implementation of

`OpenAIChatInput.logitBias`

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:197](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L197)

***

### maxTokens

> **maxTokens**: `number` = `2048`

The maximum number of [tokens]([https://platform.openai.com/tokenizer](https://platform.openai.com/tokenizer))
to generate in the completion.

The token count of your prompt plus `maxTokens` cannot exceed the model's
context length.

[Example Python code]([https://cookbook.openai.com/examples/how_to_count_tokens_with_tiktoken](https://cookbook.openai.com/examples/how_to_count_tokens_with_tiktoken)) f
or counting tokens.

#### Implementation of

`OpenAIChatInput.maxTokens`

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:144](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L144)

***

### metadata?

> `optional` **metadata**: [`CallableConfigFields`](../../../../../../../record/callable/type-aliases/CallableConfigFields.md)

A dictionary containing metadata related to the callable, defined as [CallableConfigFields](../../../../../../../record/callable/type-aliases/CallableConfigFields.md).

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`metadata`](../../../../base/classes/BaseChatLM.md#metadata)

#### Source

[packages/core/src/events/base.ts:74](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L74)

***

### modelName

> **modelName**: `string` = `'gpt-3.5-turbo'`

ID of the model to use. You can use the [List models]([https://platform.openai.com/docs/api-reference/models/list](https://platform.openai.com/docs/api-reference/models/list))
API to see all of your available models, or see [Model overview]([https://platform.openai.com/docs/models/overview](https://platform.openai.com/docs/models/overview))
for descriptions of them.

#### Implementation of

`OpenAIChatInput.modelName`

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:95](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L95)

***

### n

> **n**: `number` = `1`

How many completions to generate for each prompt.

**Note:** Because this parameter generates many completions, it can quickly
consume your token quota. Use carefully and ensure that you have reasonable
settings for `maxTokens` and `stopWords`.

#### Implementation of

`OpenAIChatInput.n`

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:162](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L162)

***

### name?

`Experimental`

> `optional` **name**: `string`

The name of the callable, used for identification or logging.

not-implement yet

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`name`](../../../../base/classes/BaseChatLM.md#name)

#### Source

[packages/core/src/events/base.ts:61](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L61)

***

### openAIApiKey?

> `optional` **openAIApiKey**: `string`

API key to use when making requests to OpenAI. Defaults to the value of
`OPENAI_API_KEY` environment variable.

#### Implementation of

`OpenAIChatInput.openAIApiKey`

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:238](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L238)

***

### organization?

> `optional` **organization**: `string`

Identifier for organization sometimes used in API requests。

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:246](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L246)

***

### presencePenalty

> **presencePenalty**: `number` = `0`

Number between -2.0 and 2.0. Positive values penalize new tokens based on
whether they appear in the text so far, increasing the model's likelihood to
talk about new topics.

[See more information about frequency and presence penalties]([https://platform.openai.com/docs/guides/text-generation/parameter-details](https://platform.openai.com/docs/guides/text-generation/parameter-details))

#### Implementation of

`OpenAIChatInput.presencePenalty`

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:113](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L113)

***

### responseFormatType?

> `optional` **responseFormatType**: `"json"` \| `"text"`

An object specifying the format that the model must output. Compatible with
[GPT-4 Turbo](https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo) and
all GPT-3.5 Turbo models newer than `gpt-3.5-turbo-1106`.

Setting to `"json"` enables JSON mode, which guarantees the message the model
generates is valid JSON.

**Important:** when using JSON mode, you **must** also instruct the model to
produce JSON yourself via a system or user message. Without this, the model may
generate an unending stream of whitespace until the generation reaches the token
limit, resulting in a long-running and seemingly "stuck" request. Also note that
the message content may be partially cut off if `finish_reason="length"`, which
indicates the generation exceeded `maxTokens` or the conversation exceeded the
max context length.

#### Implementation of

`OpenAIChatInput.responseFormatType`

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:180](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L180)

***

### seed?

> `optional` **seed**: `number`

This feature is in Beta. If specified, our system will make a best effort to
sample deterministically, such that repeated requests with the same `seed` and
parameters should return the same result. Determinism is not guaranteed, and you
should refer to the `system_fingerprint` response parameter to monitor changes
in the backend.

#### Implementation of

`OpenAIChatInput.seed`

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:206](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L206)

***

### stopWords?

> `optional` **stopWords**: `string`[]

Up to 4 sequences where the API will stop generating further tokens. The
returned text will not contain the stop sequence.

#### Implementation of

`OpenAIChatInput.stopWords`

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:212](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L212)

***

### streaming

> **streaming**: `boolean` = `false`

Whether to stream back partial progress. If set, tokens will be sent as
data-only [server-sent events]([https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format))
as they become available, with the stream terminated by a `data: [DONE]`
message.

[Example Python code]([https://cookbook.openai.com/examples/how_to_stream_completions](https://cookbook.openai.com/examples/how_to_stream_completions))

#### Implementation of

`OpenAIChatInput.streaming`

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:123](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L123)

***

### tags?

`Experimental`

> `optional` **tags**: `string`[]

An array of strings used for categorizing or filtering callables.

not-implement yet

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`tags`](../../../../base/classes/BaseChatLM.md#tags)

#### Source

[packages/core/src/events/base.ts:69](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/base.ts#L69)

***

### temperature

> **temperature**: `number` = `1`

What sampling temperature to use, between 0 and 2. Higher values like 0.8 will
make the output more random, while lower values like 0.2 will make it more
focused and deterministic.

We generally recommend altering this or `topP` but not both.

#### Implementation of

`OpenAIChatInput.temperature`

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:132](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L132)

***

### timeout?

> `optional` **timeout**: `number`

Timeout to use when making requests to OpenAI.

#### Implementation of

`OpenAIChatInput.timeout`

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:232](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L232)

***

### topP

> **topP**: `number` = `1`

An alternative to sampling with temperature, called nucleus sampling, where the
model considers the results of the tokens with temperature probability mass. So 0.1
means only the tokens comprising the top 10% probability mass are considered.

We generally recommend altering this or `temperature` but not both.

#### Implementation of

`OpenAIChatInput.topP`

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:153](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L153)

***

### user?

> `optional` **user**: `string`

A unique identifier representing your end-user, which can help OpenAI to monitor
and detect abuse.

[Learn more]([https://platform.openai.com/docs/guides/safety-best-practices](https://platform.openai.com/docs/guides/safety-best-practices))

#### Implementation of

`OpenAIChatInput.user`

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:220](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L220)

***

### verbose

`Experimental`

> **verbose**: `boolean`

Specifies whether the event should provide verbose output, such as detailed logs or response texts.
This can be useful for debugging or detailed monitoring of event handling processes.

not-implement yet

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`verbose`](../../../../base/classes/BaseChatLM.md#verbose)

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

[packages/core/src/events/inference/chat/llms/openai/chat.ts:78](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L78)

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

[packages/core/src/events/inference/chat/llms/openai/chat.ts:71](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L71)

## Methods

### \_completionWithStream()

`Internal`

> `private` **\_completionWithStream**(`params`, `messages`, `options`): `AsyncGenerator` \<[`ChatGenerationChunk`](../../../../../../output/provide/message/classes/ChatGenerationChunk.md), `any`, `unknown`\>

Handles streaming completions from OpenAI's Chat API. This method initiates a streaming
API call and processes the incoming data chunks to form a complete chat response.

#### Parameters

• **params**: `Omit`\<`ChatCompletionCreateParams`, `"messages"`\>

Parameters for the streaming completion, excluding the 'messages' parameter.

• **messages**: `ChatCompletionMessageParam`[]

The chat messages formatted for the OpenAI API.

• **options**: `Omit`\<`CallOptions`, `never`\>

Additional call options that may include signal handling for abort operations.

#### Returns

`AsyncGenerator` \<[`ChatGenerationChunk`](../../../../../../output/provide/message/classes/ChatGenerationChunk.md), `any`, `unknown`\>

An async generator that yields chat generation chunks as they arrive from the API.

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:577](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L577)

***

### \_eventNamespace()

> **\_eventNamespace**(): `string`[]

A predefined namespace array to identify the type of language model and other related namespaces.

#### Returns

`string`[]

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`_eventNamespace`](../../../../base/classes/BaseChatLM.md#_eventnamespace)

#### Source

[packages/core/src/events/inference/chat/base.ts:415](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/base.ts#L415)

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

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`_failedAttemptHandler`](../../../../base/classes/BaseChatLM.md#_failedattempthandler)

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:354](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L354)

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

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`_getLLMStrKey`](../../../../base/classes/BaseChatLM.md#_getllmstrkey)

#### Source

[packages/core/src/events/inference/chat/base.ts:185](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/base.ts#L185)

***

### \_getRequestOptions()

`Internal`

> `private` **\_getRequestOptions**(`options`?): `RequestOptions`

Configures and returns the request options for API calls, merging any additional options
provided with the default client options.

#### Parameters

• **options?**: `RequestOptions`

Optional request configurations that may override default settings.

#### Returns

`RequestOptions`

The complete request options for API calls.

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:1168](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L1168)

***

### \_identifyParams()

`Internal`

> `protected` **\_identifyParams**(): `Record`\<`string`, `any`\>

Method to identify additional parameters specific to implementations.

#### Returns

`Record`\<`string`, `any`\>

A record of identified parameters.

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`_identifyParams`](../../../../base/classes/BaseChatLM.md#_identifyparams)

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

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`_llmType`](../../../../base/classes/BaseChatLM.md#_llmtype)

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:350](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L350)

***

### \_modelType()

> **\_modelType**(): `string`

Returns the type of the model.

#### Returns

`string`

The type of the model.

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`_modelType`](../../../../base/classes/BaseChatLM.md#_modeltype)

#### Source

[packages/core/src/events/inference/chat/base.ts:427](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/base.ts#L427)

***

### \_provide()

> **\_provide**(`messages`, `options`): `Promise` \<[`LLMResult`](../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

Provides the implementation for fetching chat completions from OpenAI based on the
provided messages and options.
This method can handle both multimodal responses and standard text, adjusting parameters
based on model capabilities.

#### Parameters

• **messages**: [`BaseMessage`](../../../../../../input/load/msgs/base/classes/BaseMessage.md)[]

Array of messages to be processed in the chat.

• **options**: `Omit`\<`CallOptions`, `never`\>

Configuration options for the chat completion.

#### Returns

`Promise` \<[`LLMResult`](../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

A promise resolving to the language model result with chat completions.

#### Overrides

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`_provide`](../../../../base/classes/BaseChatLM.md#_provide)

#### Example

```typescript
const openaiChat = new OpenAIChat({
  modelName: 'gpt-3.5-turbo',
  openAIApiKey: 'your-api-key',
});
const messages = [new HumanMessage({ content: "Hello, world!" })];
const result = await openaiChat._provide(messages);
console.log(result);
```

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:417](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L417)

***

### \_provideUncached()

> `protected` **\_provideUncached**(`messages`, `serializedCallOptions`): `Promise` \<[`LLMResult`](../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

Handles uncached prompts and calls the `_provide` method.

#### Parameters

• **messages**: [`BaseMessage`](../../../../../../input/load/msgs/base/classes/BaseMessage.md)[]

An array of messages.

• **serializedCallOptions**: `Omit`\<`CallOptions`, `never`\>

Serialized call options.

#### Returns

`Promise` \<[`LLMResult`](../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

The result from the language model.

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`_provideUncached`](../../../../base/classes/BaseChatLM.md#_provideuncached)

#### Source

[packages/core/src/events/inference/chat/base.ts:527](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/base.ts#L527)

***

### \_splitCallableOptionsFromCallOptions()

> `protected` **\_splitCallableOptionsFromCallOptions**(`options`?): [[`CallableConfig`](../../../../../../../record/callable/type-aliases/CallableConfig.md), `Omit`\<`CallOptions`, `never`\>]

Splits the provided call options into callable options and serialized options.

#### Parameters

• **options?**: `Partial`\<`CallOptions`\>

Call options.

#### Returns

[[`CallableConfig`](../../../../../../../record/callable/type-aliases/CallableConfig.md), `Omit`\<`CallOptions`, `never`\>]

A tuple containing callable options and serialized options.

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`_splitCallableOptionsFromCallOptions`](../../../../base/classes/BaseChatLM.md#_splitcallableoptionsfromcalloptions)

#### Source

[packages/core/src/events/inference/chat/base.ts:548](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/base.ts#L548)

***

### \_streamIterator()

`Internal`

> **\_streamIterator**(`input`, `options`?): `AsyncGenerator` \<[`LLMResult`](../../../../../../output/provide/llmresult/type-aliases/LLMResult.md), `any`, `unknown`\>

Creates an async generator for streaming callable outputs.
This protected method is used internally for streaming operations.

#### Parameters

• **input**: [`BaseLMInput`](../../../../base/type-aliases/BaseLMInput.md)

The input for the callable.

• **options?**: `Partial`\<`CallOptions`\>

Optional additional options for the callable.

#### Returns

`AsyncGenerator` \<[`LLMResult`](../../../../../../output/provide/llmresult/type-aliases/LLMResult.md), `any`, `unknown`\>

An async generator yielding callable outputs.

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`_streamIterator`](../../../../base/classes/BaseChatLM.md#_streamiterator)

#### Source

[packages/core/src/record/callable.ts:429](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L429)

***

### batch()

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise` \<[`LLMResult`](../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)[]\>

Batch calls invoke N times, where N is the length of inputs.

##### Parameters

• **inputs**: [`BaseLMInput`](../../../../base/type-aliases/BaseLMInput.md)[]

Array of inputs in each call in a batch.

• **options?**: `Partial`\<`CallOptions`\> \| `Partial`\<`CallOptions`\>[]

Either a single call options to apply to each call or an array of options for each call.

• **batchOptions?**: [`CallableBatchOptions`](../../../../../../../record/callable/type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise` \<[`LLMResult`](../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)[]\>

An arrays of CallOutputs, or mixed CallOutputs and Errors (if returnExceptions is true).

##### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`batch`](../../../../base/classes/BaseChatLM.md#batch)

##### Source

[packages/core/src/record/callable.ts:368](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L368)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| [`LLMResult`](../../../../../../output/provide/llmresult/type-aliases/LLMResult.md))[]\>

##### Parameters

• **inputs**: [`BaseLMInput`](../../../../base/type-aliases/BaseLMInput.md)[]

• **options?**: `Partial`\<`CallOptions`\> \| `Partial`\<`CallOptions`\>[]

• **batchOptions?**: [`CallableBatchOptions`](../../../../../../../record/callable/type-aliases/CallableBatchOptions.md) & `object`

##### Returns

`Promise`\<(`Error` \| [`LLMResult`](../../../../../../output/provide/llmresult/type-aliases/LLMResult.md))[]\>

##### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`batch`](../../../../base/classes/BaseChatLM.md#batch)

##### Source

[packages/core/src/record/callable.ts:374](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L374)

#### batch(inputs, options, batchOptions)

> **batch**(`inputs`, `options`?, `batchOptions`?): `Promise`\<(`Error` \| [`LLMResult`](../../../../../../output/provide/llmresult/type-aliases/LLMResult.md))[]\>

##### Parameters

• **inputs**: [`BaseLMInput`](../../../../base/type-aliases/BaseLMInput.md)[]

• **options?**: `Partial`\<`CallOptions`\> \| `Partial`\<`CallOptions`\>[]

• **batchOptions?**: [`CallableBatchOptions`](../../../../../../../record/callable/type-aliases/CallableBatchOptions.md)

##### Returns

`Promise`\<(`Error` \| [`LLMResult`](../../../../../../output/provide/llmresult/type-aliases/LLMResult.md))[]\>

##### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`batch`](../../../../base/classes/BaseChatLM.md#batch)

##### Source

[packages/core/src/record/callable.ts:380](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L380)

***

### bind()

> **bind**(`kwargs`): [`Callable`](../../../../../../../record/callable/classes/Callable.md) \<[`BaseLMInput`](../../../../base/type-aliases/BaseLMInput.md), [`LLMResult`](../../../../../../output/provide/llmresult/type-aliases/LLMResult.md), `CallOptions`\>

Creates a new [CallableBind](../../../../../../../record/callable/classes/CallableBind.md) instance with the specified keyword arguments.
This method allows partial reconfiguration of the callable instance.

#### Parameters

• **kwargs**: `Partial`\<`CallOptions`\>

Partial keyword arguments for the callable configuration.

#### Returns

[`Callable`](../../../../../../../record/callable/classes/Callable.md) \<[`BaseLMInput`](../../../../base/type-aliases/BaseLMInput.md), [`LLMResult`](../../../../../../output/provide/llmresult/type-aliases/LLMResult.md), `CallOptions`\>

A new [CallableBind](../../../../../../../record/callable/classes/CallableBind.md) instance with the given keyword arguments.

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`bind`](../../../../base/classes/BaseChatLM.md#bind)

#### Source

[packages/core/src/record/callable.ts:343](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L343)

***

### completionWithRetry()

#### completionWithRetry(request, options)

> **completionWithRetry**(`request`, `options`?): `Promise`\<`AsyncIterable`\<`ChatCompletionChunk`\>\>

Attempts to get a chat completion from the OpenAIClient and retries if an error occurs.
This method supports both streaming and non-streaming requests.

##### Parameters

• **request**: `ChatCompletionCreateParamsStreaming`

The request parameters, which can be for streaming or non-streaming chat completions.

• **options?**: `RequestOptions`

Optional client request configurations.

##### Returns

`Promise`\<`AsyncIterable`\<`ChatCompletionChunk`\>\>

Depending on the request type, either a stream of chat completion chunks or a single chat completion.

##### Example

```typescript
const openAIChat = new OpenAIChat({
  modelName: 'gpt-3.5-turbo',
  openAIApiKey: 'your-api-key',
});

const message = {
  role: 'user',
  content: [
    { text: "Hello, world!" }
  ]
};

try {
  const response = await openAIChat.completionWithRetry(
    { messages: [message], stream: false }
  );
  console.log(response);
} catch (error) {
  console.error("Completion failed:", error);
}
```

##### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:658](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L658)

#### completionWithRetry(request, options)

> **completionWithRetry**(`request`, `options`?): `Promise`\<`ChatCompletion`\>

##### Parameters

• **request**: `ChatCompletionCreateParamsNonStreaming`

• **options?**: `RequestOptions`

##### Returns

`Promise`\<`ChatCompletion`\>

##### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:663](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L663)

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

> `optional` **callables**: [`SerializedCallableFields`](../../../../../../../record/callable/type-aliases/SerializedCallableFields.md)

##### metadata.type

> **type**: `string`

##### secrets

> **secrets**: `SecretFields`

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`getAttributes`](../../../../base/classes/BaseChatLM.md#getattributes)

#### Source

[packages/core/src/record/callable.ts:511](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L511)

***

### getParams()

> **getParams**(`options`?): `Omit`\<`ChatCompletionCreateParams`, `"messages"`\>

Get the current set of parameters for the OpenAIClient's chat completion API call,
excluding the 'messages' parameter.

#### Parameters

• **options?**: `Omit`\<`CallOptions`, `never`\>

An optional configuration object that can override certain default
               parameters, particularly `stopWords`, `functions`, and
               `functionCallOption`.

#### Returns

`Omit`\<`ChatCompletionCreateParams`, `"messages"`\>

An object containing parameters for the OpenAIClient's chat completion
         API call without the 'messages'.

#### Overrides

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`getParams`](../../../../base/classes/BaseChatLM.md#getparams)

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:368](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L368)

***

### invoke()

> **invoke**(`input`, `options`?): `Promise` \<[`LLMResult`](../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

Invokes the chat language model with a given input and options.

#### Parameters

• **input**: [`BaseLMInput`](../../../../base/type-aliases/BaseLMInput.md)

The input for the chat language model.

• **options?**: `CallOptions`

Optional call options.

#### Returns

`Promise` \<[`LLMResult`](../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

The output llm result from the language model.

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`invoke`](../../../../base/classes/BaseChatLM.md#invoke)

#### Source

[packages/core/src/events/inference/chat/base.ts:445](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/base.ts#L445)

***

### map()

> **map**(): [`Callable`](../../../../../../../record/callable/classes/Callable.md) \<[`BaseLMInput`](../../../../base/type-aliases/BaseLMInput.md)[], [`LLMResult`](../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)[], `CallOptions`\>

Creates a new [CallableEach](../../../../../../../record/callable/classes/CallableEach.md) instance for mapping inputs to outputs.
This method allows applying the callable to each input in an array of inputs.

#### Returns

[`Callable`](../../../../../../../record/callable/classes/Callable.md) \<[`BaseLMInput`](../../../../base/type-aliases/BaseLMInput.md)[], [`LLMResult`](../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)[], `CallOptions`\>

A new [CallableEach](../../../../../../../record/callable/classes/CallableEach.md) instance for mapping operation.

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`map`](../../../../base/classes/BaseChatLM.md#map)

#### Source

[packages/core/src/record/callable.ts:355](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L355)

***

### pipe()

> **pipe**\<`NewCallOutput`\>(`callableLike`): [`CallableSequence`](../../../../../../../record/callable/classes/CallableSequence.md) \<[`BaseLMInput`](../../../../base/type-aliases/BaseLMInput.md), `NewCallOutput`\>

Chains the current callable with another callable, creating a sequence.
This method allows sequential execution of multiple callables.

#### Type parameters

• **NewCallOutput**

#### Parameters

• **callableLike**: [`CallableLike`](../../../../../../../record/callable/type-aliases/CallableLike.md) \<[`LLMResult`](../../../../../../output/provide/llmresult/type-aliases/LLMResult.md), `NewCallOutput`\>

The next callable in the sequence.

#### Returns

[`CallableSequence`](../../../../../../../record/callable/classes/CallableSequence.md) \<[`BaseLMInput`](../../../../base/type-aliases/BaseLMInput.md), `NewCallOutput`\>

A new [CallableSequence](../../../../../../../record/callable/classes/CallableSequence.md) instance representing the chained callables.

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`pipe`](../../../../base/classes/BaseChatLM.md#pipe)

#### Source

[packages/core/src/record/callable.ts:460](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L460)

***

### provide()

> **provide**(`messages`, `options`?, `callbacks`?): `Promise` \<[`LLMResult`](../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

Provides the core logic to interface with the chat language model, handling both cached and uncached predictions.

#### Parameters

• **messages**: [`BaseMessageLike`](../../../../../../input/load/msgs/base/type-aliases/BaseMessageLike.md)[]

An array of messages.

• **options?**: `string`[] \| `CallOptions`

Optional call options or an array of stop words.

• **callbacks?**: `any`

Optional callbacks.

#### Returns

`Promise` \<[`LLMResult`](../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

The result from the language model.

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`provide`](../../../../base/classes/BaseChatLM.md#provide)

#### Source

[packages/core/src/events/inference/chat/base.ts:463](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/base.ts#L463)

***

### stream()

> **stream**(`input`, `options`?): `Promise`\<`ReadableStreamAsyncIterable` \<[`LLMResult`](../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>\>

Creates a readable stream for the callable outputs.
This method allows streaming the outputs of the callable for continuous data.

#### Parameters

• **input**: [`BaseLMInput`](../../../../base/type-aliases/BaseLMInput.md)

The input for the callable.

• **options?**: `Partial`\<`CallOptions`\>

Optional additional options for the callable.

#### Returns

`Promise`\<`ReadableStreamAsyncIterable` \<[`LLMResult`](../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>\>

A promise that resolves to a readable stream of callable outputs.

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`stream`](../../../../base/classes/BaseChatLM.md#stream)

#### Source

[packages/core/src/record/callable.ts:444](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L444)

***

### toJSON()

> **toJSON**(): [`Serialized`](../../../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized representation based on the object's current state. This method determines whether to use a 'not implemented' or 'constructor' format based on the object's serializability.

#### Returns

[`Serialized`](../../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`toJSON`](../../../../base/classes/BaseChatLM.md#tojson)

#### Source

[packages/core/src/load/serializable.ts:665](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L665)

***

### toJSONConstructor()

> **toJSONConstructor**(`aliases`, `secrets`, `kwargs`): [`Serialized`](../../../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized constructor format. This method provides a way to serialize object construction details, including any aliases or secrets.

#### Parameters

• **aliases**: `SerializedKeyAlias`

Key aliases to include in the serialized output.

• **secrets**: `SecretFields`

Secrets to be secured in the serialized output.

• **kwargs**: `SerializedFields`

Additional keyword arguments to include in the serialized output.

#### Returns

[`Serialized`](../../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object as a constructor.

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`toJSONConstructor`](../../../../base/classes/BaseChatLM.md#tojsonconstructor)

#### Source

[packages/core/src/load/serializable.ts:478](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L478)

***

### toJSONNotImplemented()

> **toJSONNotImplemented**(): [`Serialized`](../../../../../../../load/serializable/type-aliases/Serialized.md)

Converts the object to a serialized format that is not implemented. This method should be overridden in subclasses to provide specific serialization behavior.

#### Returns

[`Serialized`](../../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the object.

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`toJSONNotImplemented`](../../../../base/classes/BaseChatLM.md#tojsonnotimplemented)

#### Source

[packages/core/src/load/serializable.ts:448](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L448)

***

### toJSONSecret()

> **toJSONSecret**(`secretKey`): [`Serialized`](../../../../../../../load/serializable/type-aliases/Serialized.md)

Converts a secret key to its serialized format. This method is typically used for serializing secrets in a secure manner.

#### Parameters

• **secretKey**: `string`

The secret key to serialize.

#### Returns

[`Serialized`](../../../../../../../load/serializable/type-aliases/Serialized.md)

A serialized representation of the secret key.

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`toJSONSecret`](../../../../base/classes/BaseChatLM.md#tojsonsecret)

#### Source

[packages/core/src/load/serializable.ts:462](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/load/serializable.ts#L462)

***

### withConfig()

> **withConfig**(`config`): [`CallableBind`](../../../../../../../record/callable/classes/CallableBind.md) \<[`BaseLMInput`](../../../../base/type-aliases/BaseLMInput.md), [`LLMResult`](../../../../../../output/provide/llmresult/type-aliases/LLMResult.md), `CallOptions`\>

Creates a new [CallableBind](../../../../../../../record/callable/classes/CallableBind.md) instance with the specified configuration.
This method allows reconfiguration of the callable instance.

#### Parameters

• **config**: [`CallableConfig`](../../../../../../../record/callable/type-aliases/CallableConfig.md)

The configuration to apply to the new callable instance.

#### Returns

[`CallableBind`](../../../../../../../record/callable/classes/CallableBind.md) \<[`BaseLMInput`](../../../../base/type-aliases/BaseLMInput.md), [`LLMResult`](../../../../../../output/provide/llmresult/type-aliases/LLMResult.md), `CallOptions`\>

A new [CallableBind](../../../../../../../record/callable/classes/CallableBind.md) instance with the given configuration.

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`withConfig`](../../../../base/classes/BaseChatLM.md#withconfig)

#### Source

[packages/core/src/record/callable.ts:314](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L314)

***

### withFallbacks()

> **withFallbacks**(`fields`): [`CallableWithFallbacks`](../../../../../../../record/callable/classes/CallableWithFallbacks.md) \<[`BaseLMInput`](../../../../base/type-aliases/BaseLMInput.md), [`LLMResult`](../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

Creates a new [CallableWithFallbacks](../../../../../../../record/callable/classes/CallableWithFallbacks.md) instance with specified fallbacks.
This method allows defining fallback callables for error handling or retries.

#### Parameters

• **fields**

Object containing an array of fallback callables.

• **fields.fallbacks**: [`Callable`](../../../../../../../record/callable/classes/Callable.md) \<[`BaseLMInput`](../../../../base/type-aliases/BaseLMInput.md), [`LLMResult`](../../../../../../output/provide/llmresult/type-aliases/LLMResult.md), [`CallableConfig`](../../../../../../../record/callable/type-aliases/CallableConfig.md)\>[]

#### Returns

[`CallableWithFallbacks`](../../../../../../../record/callable/classes/CallableWithFallbacks.md) \<[`BaseLMInput`](../../../../base/type-aliases/BaseLMInput.md), [`LLMResult`](../../../../../../output/provide/llmresult/type-aliases/LLMResult.md)\>

A new [CallableWithFallbacks](../../../../../../../record/callable/classes/CallableWithFallbacks.md) instance with the specified fallbacks.

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`withFallbacks`](../../../../base/classes/BaseChatLM.md#withfallbacks)

#### Source

[packages/core/src/record/callable.ts:327](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L327)

***

### \_convertInputToPrompt()

`Internal`

> `static` `protected` **\_convertInputToPrompt**(`input`): [`BasePrompt`](../../../../../../input/load/prompts/base/classes/BasePrompt.md)

Converts a given [BaseLMInput](../../../../base/type-aliases/BaseLMInput.md) to a [BasePrompt](../../../../../../input/load/prompts/base/classes/BasePrompt.md).

#### Parameters

• **input**: [`BaseLMInput`](../../../../base/type-aliases/BaseLMInput.md)

The input for the language model.

#### Returns

[`BasePrompt`](../../../../../../input/load/prompts/base/classes/BasePrompt.md)

The corresponding prompt.

#### Inherited from

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`_convertInputToPrompt`](../../../../base/classes/BaseChatLM.md#_convertinputtoprompt)

#### Source

[packages/core/src/events/inference/chat/base.ts:158](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/base.ts#L158)

***

### \_name()

> `static` **\_name**(): `string`

Generates a unique name for the class, typically used for serialization identification.

#### Returns

`string`

#### Overrides

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`_name`](../../../../base/classes/BaseChatLM.md#_name)

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:86](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L86)

***

### getNumTokensInChat()

> `static` **getNumTokensInChat**(`modelName`, `messages`, `tools`?, `toolChoiceOption`?): `Promise`\<`number`\>

Estimates the total number of tokens used in a chat session. This includes messages
and any defined tools or function calls.

Reference:

#### Parameters

• **modelName**: `string`

The model name used for token calculations.

• **messages**: [`BaseMessage`](../../../../../../input/load/msgs/base/classes/BaseMessage.md)[]

The array of base messages from the chat.

• **tools?**: `ChatCompletionTool`[]

Optional array of tools that may influence token usage.

• **toolChoiceOption?**: `ChatCompletionToolChoiceOption`

Optional tool choice configuration.

#### Returns

`Promise`\<`number`\>

The total number of tokens estimated to be used in the chat.

#### See

 - https://github.com/hmarr/openai-chat-tokens/blob/main/src/index.ts
 - https://github.com/forestwanglin/openai-java/blob/main/jtokkit/src/main/java/xyz/felh/openai/jtokkit/utils/TikTokenUtils.java

#### Example

```typescript
const tokenCount = await OpenAIChat.getNumTokensInChat(
  'gpt-3.5-turbo',
  [new HumanMessage('Hello!')]
);
console.log(tokenCount);
```

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:710](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L710)

***

### getNumTokensInGenerations()

> `static` **getNumTokensInGenerations**(`modelName`, `generations`): `Promise`\<`number`\>

Estimates the total number of tokens generated in response to chat interactions, useful
for API quota management.

#### Parameters

• **modelName**: `string`

The model used for token calculations.

• **generations**: [`ChatGenerationChunk`](../../../../../../output/provide/message/classes/ChatGenerationChunk.md)[]

Array of chat generation chunks produced by the model.

#### Returns

`Promise`\<`number`\>

The total number of tokens used in the generations.

#### Example

```typescript
const tokenCount = await OpenAIChat.getNumTokensInGenerations(
  'gpt-4-turbo',
  [new ChatGenerationChunk({ message: new BotMessage('Hello!') })]
);
console.log(tokenCount);
```

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:1077](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L1077)

***

### getNumTokensInMessage()

> `static` **getNumTokensInMessage**(`modelName`, `message`, `toolMessageSize`): `Promise`\<`number`\>

Calculates the number of tokens for a single chat message, considering non-tool content
and tool-related adjustments.

Reference:

#### Parameters

• **modelName**: `string`

The model used for token calculations.

• **message**: `ChatCompletionMessageParam`

A single chat message.

• **toolMessageSize**: `number`

Number of tool messages which can affect token calculations.

#### Returns

`Promise`\<`number`\>

The number of tokens used by the message.

#### See

https://github.com/forestwanglin/openai-java/blob/main/jtokkit/src/main/java/xyz/felh/openai/jtokkit/utils/TikTokenUtils.java

#### Example

```typescript
const tokenCount = await OpenAIChat.getNumTokensInMessage(
  'gpt-3.5-turbo',
  [{ role: 'user', content: 'Hello!' }]
);
console.log(tokenCount);
```

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:852](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L852)

***

### getNumTokensInMessageNonToolContent()

> `static` **getNumTokensInMessageNonToolContent**(`modelName`, `content`): `Promise`\<`number`\>

Estimates token count for message content that does not involve tool operations, such as
plain text or structured data.

#### Parameters

• **modelName**: `string`

The model used for token calculations.

• **content**: `undefined` \| `null` \| `string` \| `ChatCompletionContentPart`[]

The content of the message, either a string or structured content.

#### Returns

`Promise`\<`number`\>

The number of tokens estimated for the non-tool content.

#### Example

```typescript
const tokenCount = await OpenAIChat.getNumTokensInMessageNonToolContent(
  'gpt-3.5-turbo',
  [{ type: 'text', content: 'Hello!' }]
);
console.log(tokenCount);
```

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:923](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L923)

***

### getNumTokensInMessageToolCalls()

> `static` **getNumTokensInMessageToolCalls**(`modelName`, `toolCalls`): `Promise`\<`number`\>

Estimates the number of tokens used by tool calls within a message, accounting for
function names and arguments.

#### Parameters

• **modelName**: `string`

The model used for token calculations.

• **toolCalls**: `undefined` \| `ChatCompletionMessageToolCall`[]

Array of tool calls within the message.

#### Returns

`Promise`\<`number`\>

The number of tokens used by all tool calls in the message.

#### Example

```typescript
const tokenCount = await OpenAIChat.getNumTokensInMessageToolCalls(
  'gpt-4-turbo',
  [
    {
      id: 'tool-id-from-api',
      type: 'function',
      function: {
        name: 'get_current_weather',
        arguments: "{\n\"location\": \"Boston, MA\"\n}"
      }
    }
  ]
);
console.log(tokenCount);
```

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:1033](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L1033)

***

### getNumTokensInMessages()

> `static` **getNumTokensInMessages**(`modelName`, `messages`, `tools`?): `Promise`\<`number`\>

Estimates the number of tokens for an array of messages formatted for the OpenAI Chat API.

Reference:

#### Parameters

• **modelName**: `string`

The model used for token calculations.

• **messages**: `ChatCompletionMessageParam`[]

Chat messages formatted for the API.

• **tools?**: `ChatCompletionTool`[]

Tools that may be present in the chat influencing token usage.

#### Returns

`Promise`\<`number`\>

The total number of tokens estimated for the provided messages.

#### See

https://github.com/forestwanglin/openai-java/blob/main/jtokkit/src/main/java/xyz/felh/openai/jtokkit/utils/TikTokenUtils.java

#### Example

```typescript
const tokenCount = await OpenAIChat.getNumTokensInMessages(
  'gpt-3.5-turbo',
  [{ role: 'user', content: 'Hello!' }]
);
console.log(tokenCount);
```

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:778](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L778)

***

### getNumTokensInTools()

> `static` **getNumTokensInTools**(`modelName`, `tools`): `Promise`\<`number`\>

Calculates the number of tokens associated with the tools defined for use in the chat.

#### Parameters

• **modelName**: `string`

The model used for token calculations.

• **tools**: `ChatCompletionTool`[]

Tools configured for the chat.

#### Returns

`Promise`\<`number`\>

The total number of tokens estimated for all tools.

#### Example

```typescript
const tokenCount = await OpenAIChat.getNumTokensInTools(
  'gpt-4-turbo',
  [
    {
      type: 'function',
      function: {
        name: 'get_current_weather',
        description: 'get weather in a given location',
        parameters: {
          type: 'object',
          properties: {
            location: {
              type: 'string'
            },
            unit: {
              type: 'string',
              enum: ['celsius', 'fahrenheit'],
            }
          },
          required: ['location']
        }
      }
    }
  ]
);
console.log(tokenCount);
```

#### Source

[packages/core/src/events/inference/chat/llms/openai/chat.ts:1146](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/openai/chat.ts#L1146)

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

[`BaseChatLM`](../../../../base/classes/BaseChatLM.md) . [`isCallable`](../../../../base/classes/BaseChatLM.md#iscallable)

#### Source

[packages/core/src/record/callable.ts:196](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/record/callable.ts#L196)
