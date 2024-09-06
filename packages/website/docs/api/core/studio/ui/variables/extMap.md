# Variable: extMap

> `const` **extMap**: `Record` \<[`ImageUIContext`](../type-aliases/ImageUIContext.md)\[`"mimeType"`\] \| [`AudioUIContext`](../type-aliases/AudioUIContext.md)\[`"mimeType"`\] \| [`FileUIContext`](../type-aliases/FileUIContext.md)\[`"mimeType"`\], `string`\>

Mapping of MIME types to their corresponding file extensions.
This map is used primarily for file operations like downloads and uploads, ensuring that files have the correct extensions based on their MIME type.

Examples include mapping 'text/plain' to 'bin', 'application/json' to 'json', or 'image/jpeg' to 'jpeg'.

## Source

[packages/core/src/studio/ui.ts:440](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/ui.ts#L440)
