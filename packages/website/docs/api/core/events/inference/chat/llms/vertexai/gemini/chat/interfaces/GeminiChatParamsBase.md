# Interface: GeminiChatParamsBase

## Extends

- `ModelParams`

## Extended by

- [`GeminiChatParamsNonStreaming`](GeminiChatParamsNonStreaming.md)
- [`GeminiChatParamsStreaming`](GeminiChatParamsStreaming.md)

## Properties

### contents

> **contents**: `Content`[]

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts:48](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/gemini/chat.ts#L48)

***

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

### safetySettings?

> `optional` **safetySettings**: `SafetySetting`[]

#### Inherited from

`ModelParams.safetySettings`

#### Source

node\_modules/@google/generative-ai/dist/generative-ai.d.ts:6
