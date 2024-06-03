# Type alias: NodeOf\<T\>

> **NodeOf**\<`T`\>: `Extract` \<[`BuiltInNodes`](BuiltInNodes.md), `object`\>

A utility type that extracts nodes of a specific type from the built-in nodes based on the provided node type.
This type is particularly useful when you need to obtain a subset of nodes that match a given type, allowing
for operations that are specific to that type while maintaining type safety.

## Type parameters

• **T** *extends* [`BuiltInNodeTypes`](BuiltInNodeTypes.md)

The type of the node to extract from the built-in nodes.

## Source

[packages/core/src/studio/registration/nodes.ts:480](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/registration/nodes.ts#L480)
