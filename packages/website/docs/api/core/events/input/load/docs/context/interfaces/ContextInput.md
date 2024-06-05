# Interface: ContextInput\<Metadata\>

Defines the structure for inputs used to create a readable context. This interface is for feeding page
content and associated metadata into processing workflows.

## Type parameters

• **Metadata** = `Record`\<`string`, `unknown`\>

The type for metadata associated with the context, allowing for custom data structures.

## Properties

### metadata?

> `optional` **metadata**: `Metadata`

Optional metadata associated with the page content, providing additional information or annotations.

#### Source

[packages/core/src/events/input/load/docs/context.ts:16](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/docs/context.ts#L16)

***

### pageContent

> **pageContent**: `string`

The main content of the page, typically as a string.

#### Source

[packages/core/src/events/input/load/docs/context.ts:11](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/docs/context.ts#L11)
