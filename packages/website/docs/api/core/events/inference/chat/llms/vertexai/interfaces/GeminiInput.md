# Interface: GeminiInput

Overall input structure for a Gemini model call, incorporating various elements
like temperature, topP, and specific contents.

## Extends

- [`VertexAIBaseInput`](VertexAIBaseInput.md)

## Properties

### additionalKwargs?

> `optional` **additionalKwargs**: `Record`\<`string`, `unknown`\>

Holds any additional parameters that are valid to pass to
VertexAI models that are not explicitly specified on the class.

#### Inherited from

[`VertexAIBaseInput`](VertexAIBaseInput.md) . [`additionalKwargs`](VertexAIBaseInput.md#additionalkwargs)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/index.ts:248](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/index.ts#L248)

***

### candidateCount

> **candidateCount**: `number`

The number of response variations to return.

This value must be 1.

#### Inherited from

[`VertexAIBaseInput`](VertexAIBaseInput.md) . [`candidateCount`](VertexAIBaseInput.md#candidatecount)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/index.ts:200](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/index.ts#L200)

***

### contents

> **contents**: [`GeminiContent`](GeminiContent.md)[]

Gemini contents to pass as a prefix to the prompt

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/index.ts:370](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/index.ts#L370)

***

### googleApiKey?

> `optional` **googleApiKey**: `string`

API key to use when making requests to Gemini. Defaults to the value of
`GOOGLE_API_KEY` environment variable.

#### Inherited from

[`VertexAIBaseInput`](VertexAIBaseInput.md) . [`googleApiKey`](VertexAIBaseInput.md#googleapikey)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/index.ts:242](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/index.ts#L242)

***

### maxOutputTokens

> **maxOutputTokens**: `number`

Maximum number of tokens that can be generated in the response. A token
is approximately four characters. 100 tokens correspond to roughly 60-80
words. Specify a lower value for shorter responses and a higher value for
potentially longer responses.

Range: 1-2048

#### Inherited from

[`VertexAIBaseInput`](VertexAIBaseInput.md) . [`maxOutputTokens`](VertexAIBaseInput.md#maxoutputtokens)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/index.ts:210](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/index.ts#L210)

***

### modelName

> **modelName**: `string`

ID of the model to use. You can use the
[https://cloud.google.com/vertex-ai/docs/start/explore-models](https://cloud.google.com/vertex-ai/docs/start/explore-models) API to
see all of your available models and the descriptions of them.

Gemini model: [https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini#model_versions](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini#model_versions)
Text model: [https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/text#model_versions](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/text#model_versions)
Chat model: [https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/text-chat#model_versions](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/text-chat#model_versions)

#### Inherited from

[`VertexAIBaseInput`](VertexAIBaseInput.md) . [`modelName`](VertexAIBaseInput.md#modelname)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/index.ts:228](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/index.ts#L228)

***

### stopSequences?

> `optional` **stopSequences**: `string`[]

Up to 5 sequences where the API will stop generating text if one of the
strings is encountered in the response. If a string appears multiple
times in the response, then the response truncates where it's first
encountered. The strings are case-sensitive.

#### Inherited from

[`VertexAIBaseInput`](VertexAIBaseInput.md) . [`stopSequences`](VertexAIBaseInput.md#stopsequences)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/index.ts:236](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/index.ts#L236)

***

### streaming

> **streaming**: `boolean`

Streaming involves receiving responses to prompts as they are generated.
That is, as soon as the model generates output tokens, the output tokens
are sent.

#### Inherited from

[`VertexAIBaseInput`](VertexAIBaseInput.md) . [`streaming`](VertexAIBaseInput.md#streaming)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/index.ts:217](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/index.ts#L217)

***

### temperature

> **temperature**: `number`

The temperature is used for sampling during the response generation,
which occurs when topP and topK are applied. Temperature controls the
degree of randomness in token selection. Lower temperatures are good
for prompts that require a more deterministic and less open-ended or
creative response, while higher temperatures can lead to more diverse
or creative results.

A temperature of 0 is deterministic: the highest probability response
is always selected.

Range: 0.0 - 1.0

#### Inherited from

[`VertexAIBaseInput`](VertexAIBaseInput.md) . [`temperature`](VertexAIBaseInput.md#temperature)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/index.ts:159](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/index.ts#L159)

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

#### Inherited from

[`VertexAIBaseInput`](VertexAIBaseInput.md) . [`topK`](VertexAIBaseInput.md#topk)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/index.ts:193](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/index.ts#L193)

***

### topP

> **topP**: `number`

Top-P changes how the model selects tokens for output. Tokens are
selected from the most (see top-K) to least probable until the sum of
their probabilities equals the top-P value.

For example, if tokens A, B, and C have a probability of 0.3, 0.2, and
0.1 and the top-P value is 0.5, then the model will select either A or
B as the next token by using temperature and excludes C as a candidate.

Specify a lower value for less random responses and a higher value for
more random responses.

Range: 0.0 - 1.0

#### Inherited from

[`VertexAIBaseInput`](VertexAIBaseInput.md) . [`topP`](VertexAIBaseInput.md#topp)

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/index.ts:175](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/index.ts#L175)
