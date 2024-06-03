# Type alias: BlobUIContext

> **BlobUIContext**: `object`

UI context for handling binary large objects (BLOBs) such as images, audio, or files.

## Type declaration

### blob

> **blob**: ([`ImageUIContext`](ImageUIContext.md) \| [`AudioUIContext`](AudioUIContext.md) \| [`FileUIContext`](FileUIContext.md))[]

Array of UI contexts for each BLOB item, can include images, audio files, or other file types.

### blobType

> **blobType**: `string`

A string describing the type of blob (e.g., 'image', 'audio').

### size

> **size**: `number`

The total size of all blobs combined.

### type

> **type**: `"blob"`

Specifies the context type as 'blob'.

## Source

[packages/core/src/studio/ui.ts:89](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/ui.ts#L89)
