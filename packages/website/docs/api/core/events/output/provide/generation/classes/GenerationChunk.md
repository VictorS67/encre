# Class: `abstract` GenerationChunk

Abstract class that defines the structure and functionality of a generation chunk.
A generation chunk represents a segment or part of a larger data generation process,
encapsulating both the data itself and optional metadata about the generation.

Implementations of this class are expected to provide a method for concatenating
multiple chunks into a single coherent unit, facilitating the handling of streamed or
segmented data.

## Extended by

- [`GenerationFileChunk`](../../file/classes/GenerationFileChunk.md)
- [`ChatGenerationChunk`](../../message/classes/ChatGenerationChunk.md)

## Implements

- [`Generation`](../interfaces/Generation.md)

## Constructors

### new GenerationChunk()

> **new GenerationChunk**(`fields`): [`GenerationChunk`](GenerationChunk.md)

Constructs a new instance of GenerationChunk.

#### Parameters

• **fields**: [`Generation`](../interfaces/Generation.md)

An object conforming to the GenerationChunkField interface, providing initial values for the output and optional info.

#### Returns

[`GenerationChunk`](GenerationChunk.md)

#### Source

[packages/core/src/events/output/provide/generation.ts:48](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/generation.ts#L48)

## Properties

### info?

> `optional` **info**: `Record`\<`string`, `unknown`\>

Optional metadata providing additional information about this particular chunk's generation.

#### Implementation of

[`Generation`](../interfaces/Generation.md) . [`info`](../interfaces/Generation.md#info)

#### Source

[packages/core/src/events/output/provide/generation.ts:41](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/generation.ts#L41)

***

### output

> **output**: `unknown`

The generated output of this chunk. The nature of this data is determined by the specific implementation.

#### Implementation of

[`Generation`](../interfaces/Generation.md) . [`output`](../interfaces/Generation.md#output)

#### Source

[packages/core/src/events/output/provide/generation.ts:36](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/generation.ts#L36)

## Methods

### concat()

> `abstract` **concat**(`chunk`): [`GenerationChunk`](GenerationChunk.md)

Abstract method that must be implemented by subclasses to support concatenation of this chunk with another.
The method should define how two chunks are combined into a single, larger chunk.

#### Parameters

• **chunk**: [`GenerationChunk`](GenerationChunk.md)

Another instance of a GenerationChunk to be concatenated with this instance.

#### Returns

[`GenerationChunk`](GenerationChunk.md)

A new instance of GenerationChunk representing the concatenated result.

#### Source

[packages/core/src/events/output/provide/generation.ts:60](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/generation.ts#L60)
