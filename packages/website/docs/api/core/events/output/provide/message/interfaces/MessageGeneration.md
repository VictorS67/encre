# Interface: MessageGeneration

Extends the basic Generation interface to specifically handle text output, commonly used in messaging systems.

## Extends

- [`Generation`](../../generation/interfaces/Generation.md)

## Extended by

- [`ChatGeneration`](ChatGeneration.md)

## Properties

### info?

> `optional` **info**: `Record`\<`string`, `unknown`\>

Optional metadata associated with the generation. This may include diagnostics, statistics,
or reasons why the generation process was concluded, structured as a record of key-value pairs.

#### Inherited from

[`Generation`](../../generation/interfaces/Generation.md) . [`info`](../../generation/interfaces/Generation.md#info)

#### Source

[packages/core/src/events/output/provide/generation.ts:14](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/generation.ts#L14)

***

### output

> **output**: `string`

Generated text output, representing the processed or computed response.

#### Overrides

[`Generation`](../../generation/interfaces/Generation.md) . [`output`](../../generation/interfaces/Generation.md#output)

#### Source

[packages/core/src/events/output/provide/message.ts:80](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/message.ts#L80)
