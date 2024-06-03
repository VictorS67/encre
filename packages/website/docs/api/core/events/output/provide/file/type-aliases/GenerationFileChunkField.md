# Type alias: GenerationFileChunkField

> **GenerationFileChunkField**: `object`

Defines the structure of fields required for initializing a GenerationFileChunk.
This type supports both file paths and binary Blob objects as output.

## Type declaration

### info?

> `optional` **info**: `Record`\<`string`, `unknown`\>

Optional metadata associated with the generation of the file, such as creation details or processing metadata.

### output

> **output**: `string` \| `Blob`

Either a string representing a file path or a Blob object representing binary data.

## Source

[packages/core/src/events/output/provide/file.ts:9](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/file.ts#L9)
