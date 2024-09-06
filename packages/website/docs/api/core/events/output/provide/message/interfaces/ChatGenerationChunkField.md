# Interface: ChatGenerationChunkField

Defines the fields required to create a ChatGenerationChunk, essentially mirroring the ChatGeneration interface.

## Extends

- [`ChatGeneration`](ChatGeneration.md)

## Properties

### info?

> `optional` **info**: `Record`\<`string`, `unknown`\>

Optional metadata associated with the generation. This may include diagnostics, statistics,
or reasons why the generation process was concluded, structured as a record of key-value pairs.

#### Inherited from

[`ChatGeneration`](ChatGeneration.md) . [`info`](ChatGeneration.md#info)

#### Source

[packages/core/src/events/output/provide/generation.ts:14](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/output/provide/generation.ts#L14)

***

### message

> **message**: [`BaseMessage`](../../../../input/load/msgs/base/classes/BaseMessage.md)

The chat message associated with this generation, detailing the specifics of the chat interaction.

#### Inherited from

[`ChatGeneration`](ChatGeneration.md) . [`message`](ChatGeneration.md#message)

#### Source

[packages/core/src/events/output/provide/message.ts:90](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/output/provide/message.ts#L90)

***

### output

> **output**: `string`

Generated text output, representing the processed or computed response.

#### Inherited from

[`ChatGeneration`](ChatGeneration.md) . [`output`](ChatGeneration.md#output)

#### Source

[packages/core/src/events/output/provide/message.ts:80](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/output/provide/message.ts#L80)
