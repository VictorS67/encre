# Type alias: BuiltInNodeTypes

> **BuiltInNodeTypes**: *typeof* `globalNodeRegistry.registeredNodeTypes`

Represents the distinct node types that are available within the built-in registry. This type is useful for
operations that require a reference to the types of nodes without needing to know the specifics of their
implementation or internal structure. It enhances type safety by ensuring that only valid node types are
referenced within typed operations.

## Source

[packages/core/src/studio/registration/nodes.ts:463](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/studio/registration/nodes.ts#L463)
