# Class: GenerationFileChunk

Represents a chunk of a generation process that deals specifically with file outputs. This class extends GenerationChunk
to handle file-based data, either as paths or as binary data (Blobs), providing functionality for concatenating such chunks.

## Extends

- [`GenerationChunk`](../../generation/classes/GenerationChunk.md)

## Constructors

### new GenerationFileChunk()

> **new GenerationFileChunk**(`fields`): [`GenerationFileChunk`](GenerationFileChunk.md)

Constructs a new instance of GenerationFileChunk.

#### Parameters

• **fields**: [`GenerationFileChunkField`](../type-aliases/GenerationFileChunkField.md)

An object containing the file output and optional metadata.

#### Returns

[`GenerationFileChunk`](GenerationFileChunk.md)

#### Overrides

[`GenerationChunk`](../../generation/classes/GenerationChunk.md) . [`constructor`](../../generation/classes/GenerationChunk.md#constructors)

#### Source

[packages/core/src/events/output/provide/file.ts:35](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/file.ts#L35)

## Properties

### info?

> `optional` **info**: `Record`\<`string`, `unknown`\>

Optional metadata providing additional information about this particular chunk's generation.

#### Inherited from

[`GenerationChunk`](../../generation/classes/GenerationChunk.md) . [`info`](../../generation/classes/GenerationChunk.md#info)

#### Source

[packages/core/src/events/output/provide/generation.ts:41](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/generation.ts#L41)

## Methods

### \_getOutputBlob()

> `protected` **\_getOutputBlob**(): `Blob`

Retrieves the output as a Blob object, converting from a file path if necessary.

#### Returns

`Blob`

A Blob representation of the output.

#### Source

[packages/core/src/events/output/provide/file.ts:43](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/file.ts#L43)

***

### concat()

> **concat**(`chunk`): [`GenerationFileChunk`](GenerationFileChunk.md)

Concatenates this file chunk with another, combining their contents into a single Blob.

#### Parameters

• **chunk**: [`GenerationFileChunk`](GenerationFileChunk.md)

Another GenerationFileChunk to concatenate with this chunk.

#### Returns

[`GenerationFileChunk`](GenerationFileChunk.md)

A new GenerationFileChunk representing the concatenated output.

#### Overrides

[`GenerationChunk`](../../generation/classes/GenerationChunk.md) . [`concat`](../../generation/classes/GenerationChunk.md#concat)

#### Source

[packages/core/src/events/output/provide/file.ts:58](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/file.ts#L58)
