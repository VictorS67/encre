# Type alias: ArrayData

> **ArrayData**: `{ [P in ScalarData["type"]]: ArrayOf<Extract<ScalarData, Object>> }`\[[`ScalarData`](ScalarData.md)\[`"type"`\]\]

Generic type for array data based on scalar data types, defining the structure
of data arrays.

## Source

[packages/core/src/studio/data.ts:100](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/data.ts#L100)
