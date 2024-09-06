# Interface: GeminiParamsBase

Base interface for all Gemini API call parameters, specifying the essential prompt
required for generating content.

## Extends

- `ModelParams`

## Extended by

- [`GeminiParamsNonStreaming`](GeminiParamsNonStreaming.md)
- [`GeminiParamsStreaming`](GeminiParamsStreaming.md)

## Properties

### generationConfig?

> `optional` **generationConfig**: `GenerationConfig`

#### Inherited from

`ModelParams.generationConfig`

#### Source

node\_modules/@google/generative-ai/dist/generative-ai.d.ts:7

***

### model

> **model**: `string`

#### Inherited from

`ModelParams.model`

#### Source

node\_modules/@google/generative-ai/dist/generative-ai.d.ts:388

***

### prompt

> **prompt**: `string`

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts:38](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/gemini/text.ts#L38)

***

### safetySettings?

> `optional` **safetySettings**: `SafetySetting`[]

#### Inherited from

`ModelParams.safetySettings`

#### Source

node\_modules/@google/generative-ai/dist/generative-ai.d.ts:6
