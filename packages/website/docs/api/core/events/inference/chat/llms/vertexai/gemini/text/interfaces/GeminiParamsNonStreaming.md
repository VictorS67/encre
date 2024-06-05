# Interface: GeminiParamsNonStreaming

Interface for non-streaming Gemini API call parameters, indicating that responses
will not be streamed.

## Extends

- [`GeminiParamsBase`](GeminiParamsBase.md)

## Properties

### generationConfig?

> `optional` **generationConfig**: `GenerationConfig`

#### Inherited from

[`GeminiParamsBase`](GeminiParamsBase.md) . [`generationConfig`](GeminiParamsBase.md#generationconfig)

#### Source

node\_modules/@google/generative-ai/dist/generative-ai.d.ts:7

***

### model

> **model**: `string`

#### Inherited from

[`GeminiParamsBase`](GeminiParamsBase.md) . [`model`](GeminiParamsBase.md#model)

#### Source

node\_modules/@google/generative-ai/dist/generative-ai.d.ts:388

***

### prompt

> **prompt**: `string`

#### Inherited from

[`GeminiParamsBase`](GeminiParamsBase.md) . [`prompt`](GeminiParamsBase.md#prompt)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:38](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L38)

***

### safetySettings?

> `optional` **safetySettings**: `SafetySetting`[]

#### Inherited from

[`GeminiParamsBase`](GeminiParamsBase.md) . [`safetySettings`](GeminiParamsBase.md#safetysettings)

#### Source

node\_modules/@google/generative-ai/dist/generative-ai.d.ts:6

***

### stream

> **stream**: `false`

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:46](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L46)
