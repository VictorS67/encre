# Interface: SourceProvider\<T\>

Defines the contract for a source provider responsible for supplying a readable source and its associated generation information.
The interface ensures that any implementing class will provide both the source data and its corresponding generation details,
making it suitable for systems that require data along with metadata about how that data was generated or processed.

## Type parameters

• **T** = `unknown`

The type of the source data, which can be any type depending on the specific requirements of the implementation.

## Properties

### generation

> **generation**: [`GenerationChunk`](../../generation/classes/GenerationChunk.md)

The generation context associated with the source, detailing the processing or generation steps that produced the source.
This is typically used to track how the source was created, which can be critical for debugging or auditing purposes.

#### Source

[packages/core/src/events/output/provide/base.ts:20](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/base.ts#L20)

***

### source

> **source**: `T`

The source data provided by this provider. The type is generic, allowing for flexibility in what can be considered a source.

#### Source

[packages/core/src/events/output/provide/base.ts:14](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/base.ts#L14)
