# Interface: DocLoader\<Input, Output\>

Interface for defining a loader that is responsible for loading readable sources and returning them in a specified output format.
This loader is typically used for processing input data and transforming it into a structured context suitable for further processing.

## Type parameters

• **Input** = `unknown`

The type of input that the loader accepts.

• **Output** = [`Context`](../../context/classes/Context.md)[]

The type of output that the loader produces, typically an array of Context objects.

## Methods

### load()

> **load**(`source`): `Promise`\<`Output`\>

Loads data from the provided source and returns it as structured output.

#### Parameters

• **source**: `Input`

The source input to load.

#### Returns

`Promise`\<`Output`\>

A promise that resolves to the output, typically an array of contexts.

#### Source

[packages/core/src/events/input/load/docs/base.ts:18](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/docs/base.ts#L18)
