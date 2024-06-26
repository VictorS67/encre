# Type alias: Vector

> **Vector**: `object`

Represents a vector within the MemoryVectorStore. Each vector has an identifier, content
text, a numerical embedding, and any associated metadata.

## Type declaration

### content

> **content**: `string`

The content associated with the vector, typically a string of text from which the
embedding is derived.

### embedding

> **embedding**: `number`[]

The numerical embedding of the content, represented as an array of numbers. Embeddings
are usually generated by a machine learning model to capture semantic meanings of the
content.

### id

> **id**: `string`

A unique identifier for the vector.

### metadata

> **metadata**: `Record`\<`string`, `unknown`\>

A dictionary containing metadata associated with the vector. This can include additional
information like tags, categories, or any other contextual data that supports the
application's use case.

## Source

[packages/core/src/events/input/load/vectorstore/memory.ts:55](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/input/load/vectorstore/memory.ts#L55)
