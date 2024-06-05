# Type alias: LLMResult

> **LLMResult**: `object`

Contains all relevant information returned by an LLM.

## Type declaration

### generations

> **generations**: [`Generation`](../../generation/interfaces/Generation.md)[]

One input could have multiple [Generation](../../generation/interfaces/Generation.md), hence this is a list.

### llmOutput?

> `optional` **llmOutput**: `Record`\<`string`, `any`\>

LLM-provider specific output.

## Source

[packages/core/src/events/output/provide/llmresult.ts:6](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/output/provide/llmresult.ts#L6)
