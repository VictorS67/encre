# Interface: Generation

Represents the result of a generation process, encapsulating the generated output and any associated metadata.

## Extended by

- [`MessageGeneration`](../../message/interfaces/MessageGeneration.md)

## Properties

### info?

> `optional` **info**: `Record`\<`string`, `unknown`\>

Optional metadata associated with the generation. This may include diagnostics, statistics,
or reasons why the generation process was concluded, structured as a record of key-value pairs.

#### Source

[packages/core/src/events/output/provide/generation.ts:14](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/generation.ts#L14)

***

### output

> **output**: `unknown`

The primary data that was generated. The type is unspecified (`unknown`), allowing for flexibility.

#### Source

[packages/core/src/events/output/provide/generation.ts:8](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/generation.ts#L8)
