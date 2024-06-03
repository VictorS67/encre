# Type alias: BuiltInNodeTypes

> **BuiltInNodeTypes**: *typeof* `globalNodeRegistry.registeredNodeTypes`

Represents the distinct node types that are available within the built-in registry. This type is useful for
operations that require a reference to the types of nodes without needing to know the specifics of their
implementation or internal structure. It enhances type safety by ensuring that only valid node types are
referenced within typed operations.

## Source

[packages/core/src/studio/registration/nodes.ts:462](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/studio/registration/nodes.ts#L462)
