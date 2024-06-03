# Class: ChatGenerationChunk

Represents a chunk of chat generation, managing both the output text and the associated chat message.
This class is used to handle segments of chat data, particularly useful in systems that process large or complex dialogues.

## Extends

- [`GenerationChunk`](../../generation/classes/GenerationChunk.md)

## Implements

- [`ChatGeneration`](../interfaces/ChatGeneration.md)

## Constructors

### new ChatGenerationChunk()

> **new ChatGenerationChunk**(`fields`): [`ChatGenerationChunk`](ChatGenerationChunk.md)

#### Parameters

• **fields**: [`ChatGenerationChunkField`](../interfaces/ChatGenerationChunkField.md)

#### Returns

[`ChatGenerationChunk`](ChatGenerationChunk.md)

#### Overrides

[`GenerationChunk`](../../generation/classes/GenerationChunk.md) . [`constructor`](../../generation/classes/GenerationChunk.md#constructors)

#### Source

[packages/core/src/events/output/provide/message.ts:114](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/message.ts#L114)

## Properties

### info?

> `optional` **info**: `Record`\<`string`, `unknown`\>

Optional metadata providing additional information about this particular chunk's generation.

#### Implementation of

[`ChatGeneration`](../interfaces/ChatGeneration.md) . [`info`](../interfaces/ChatGeneration.md#info)

#### Inherited from

[`GenerationChunk`](../../generation/classes/GenerationChunk.md) . [`info`](../../generation/classes/GenerationChunk.md#info)

#### Source

[packages/core/src/events/output/provide/generation.ts:41](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/generation.ts#L41)

***

### message

> **message**: [`BaseMessage`](../../../../input/load/msgs/base/classes/BaseMessage.md)

The associated BaseMessage for this chunk of chat generation.

#### Implementation of

[`ChatGeneration`](../interfaces/ChatGeneration.md) . [`message`](../interfaces/ChatGeneration.md#message)

#### Source

[packages/core/src/events/output/provide/message.ts:112](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/message.ts#L112)

## Methods

### concat()

> **concat**(`chunk`): [`ChatGenerationChunk`](ChatGenerationChunk.md)

Concatenates this chat generation chunk with another, combining their outputs and messages.

#### Parameters

• **chunk**: [`ChatGenerationChunk`](ChatGenerationChunk.md)

Another ChatGenerationChunk to concatenate with this one.

#### Returns

[`ChatGenerationChunk`](ChatGenerationChunk.md)

A new ChatGenerationChunk representing the combined result.

#### Overrides

[`GenerationChunk`](../../generation/classes/GenerationChunk.md) . [`concat`](../../generation/classes/GenerationChunk.md#concat)

#### Source

[packages/core/src/events/output/provide/message.ts:125](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/message.ts#L125)
