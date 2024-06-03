# Interface: ChatGeneration

Extends MessageGeneration for chat-specific use cases, including the actual message involved in the generation.

## Extends

- [`MessageGeneration`](MessageGeneration.md)

## Extended by

- [`ChatGenerationChunkField`](ChatGenerationChunkField.md)

## Properties

### info?

> `optional` **info**: `Record`\<`string`, `unknown`\>

Optional metadata associated with the generation. This may include diagnostics, statistics,
or reasons why the generation process was concluded, structured as a record of key-value pairs.

#### Inherited from

[`MessageGeneration`](MessageGeneration.md) . [`info`](MessageGeneration.md#info)

#### Source

[packages/core/src/events/output/provide/generation.ts:14](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/generation.ts#L14)

***

### message

> **message**: [`BaseMessage`](../../../../input/load/msgs/base/classes/BaseMessage.md)

The chat message associated with this generation, detailing the specifics of the chat interaction.

#### Source

[packages/core/src/events/output/provide/message.ts:90](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/message.ts#L90)

***

### output

> **output**: `string`

Generated text output, representing the processed or computed response.

#### Inherited from

[`MessageGeneration`](MessageGeneration.md) . [`output`](MessageGeneration.md#output)

#### Source

[packages/core/src/events/output/provide/message.ts:80](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/message.ts#L80)
