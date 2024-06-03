# Class: `abstract` BaseSourceProvider\<T\>

An abstract base class that implements the SourceProvider interface, providing a foundational structure
for source management within data processing or generation systems. This class requires concrete implementations
to define specific behaviors for replacing, adding, and providing sources, making it highly adaptable to different data workflows.

## Extended by

- [`FileProvider`](../../file/classes/FileProvider.md)

## Type parameters

• **T** = `unknown`

The type of the source data. This generic type allows implementations to specify what kind of data they deal with,
such as streams, documents, datasets, etc.

## Implements

- [`SourceProvider`](../interfaces/SourceProvider.md)\<`T`\>

## Constructors

### new BaseSourceProvider()

> **new BaseSourceProvider**\<`T`\>(): [`BaseSourceProvider`](BaseSourceProvider.md)\<`T`\>

#### Returns

[`BaseSourceProvider`](BaseSourceProvider.md)\<`T`\>

## Properties

### generation

> **generation**: [`GenerationChunk`](../../generation/classes/GenerationChunk.md)

The generation details of the current source, encapsulating the output and any associated metadata about the generation process.

#### Implementation of

[`SourceProvider`](../interfaces/SourceProvider.md) . [`generation`](../interfaces/SourceProvider.md#generation)

#### Source

[packages/core/src/events/output/provide/base.ts:42](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/base.ts#L42)

***

### source

> **source**: `T`

The current source data managed by this provider.

#### Implementation of

[`SourceProvider`](../interfaces/SourceProvider.md) . [`source`](../interfaces/SourceProvider.md#source)

#### Source

[packages/core/src/events/output/provide/base.ts:37](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/base.ts#L37)

## Methods

### add()

> `abstract` **add**(`source`): `void`

Adds a new source to the existing source data. This method must be defined by subclasses to specify how sources are aggregated or combined.

#### Parameters

• **source**: `T`

The source data to be added to the existing source.

#### Returns

`void`

#### Source

[packages/core/src/events/output/provide/base.ts:56](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/base.ts#L56)

***

### provide()

> `abstract` **provide**(): `unknown`

Provides the output of the current generation context. This method must return the processed or generated output associated with the source,
typically used in scenarios where the final data needs to be retrieved for further use or storage.

#### Returns

`unknown`

The output of the generation process, which is defined by the concrete implementation of the generation context.

#### Source

[packages/core/src/events/output/provide/base.ts:64](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/base.ts#L64)

***

### replace()

> `abstract` **replace**(`source`): `void`

Replaces the current source with a new one. Implementations must define how the source is replaced in their specific context.

#### Parameters

• **source**: `T`

The new source data to replace the existing source.

#### Returns

`void`

#### Source

[packages/core/src/events/output/provide/base.ts:49](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/base.ts#L49)
