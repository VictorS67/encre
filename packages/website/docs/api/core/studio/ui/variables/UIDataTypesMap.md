# Variable: UIDataTypesMap

> `const` **UIDataTypesMap**: `Record` \<[`DataType`](../../data/type-aliases/DataType.md), [`UIContext`](../type-aliases/UIContext.md)\[`"type"`\]\>

Map from `DataType` to `UIContext['type']` providing a linkage between internal data types and the UI contexts they should be rendered with.

This map ensures that data types such as strings, numbers, or complex objects are associated with appropriate UI contexts like code or blob, 
facilitating the dynamic rendering of data in a user interface.

## Source

[packages/core/src/studio/ui.ts:415](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/ui.ts#L415)
