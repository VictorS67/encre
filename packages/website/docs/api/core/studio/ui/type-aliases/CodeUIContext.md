# Type alias: CodeUIContext

> **CodeUIContext**: `object`

UI context for code snippets.

## Type declaration

### isHoldingValues?

> `optional` **isHoldingValues**: `boolean`

Optional flag indicating whether the code context holds variable values.

### keywords?

> `optional` **keywords**: `string`[]

Optional list of keywords highlighted in the code.

### language?

> `optional` **language**: `string`

Optional programming language of the code.

### text

> **text**: `string`

The code text content.

### type

> **type**: `"code"`

Specifies the context type as 'code'.

## Source

[packages/core/src/studio/ui.ts:59](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/ui.ts#L59)
