# Class: FileProvider

A source provider that handles file sources, capable of managing both file paths and binary data (Blobs).
This class is responsible for supplying file-based data to consumers, supporting operations such as replace and add,
which manipulate the underlying source.

## Extends

- [`BaseSourceProvider`](../../base/classes/BaseSourceProvider.md)

## Constructors

### new FileProvider()

> **new FileProvider**(`source`): [`FileProvider`](FileProvider.md)

Initializes a new FileProvider with a given source.

#### Parameters

• **source**: `string` \| `Blob`

Either a string representing a file path or a Blob object.

#### Returns

[`FileProvider`](FileProvider.md)

#### Overrides

[`BaseSourceProvider`](../../base/classes/BaseSourceProvider.md) . [`constructor`](../../base/classes/BaseSourceProvider.md#constructors)

#### Source

[packages/core/src/events/output/provide/file.ts:94](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/file.ts#L94)

## Methods

### add()

> **add**(`source`): `void`

Adds a new source to the existing one, effectively concatenating them if applicable.

#### Parameters

• **source**: `string` \| `Blob`

A new source, either a file path or a Blob, to add to the existing source.

#### Returns

`void`

#### Overrides

[`BaseSourceProvider`](../../base/classes/BaseSourceProvider.md) . [`add`](../../base/classes/BaseSourceProvider.md#add)

#### Source

[packages/core/src/events/output/provide/file.ts:126](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/file.ts#L126)

***

### provide()

> **provide**(): `string` \| `Blob`

Provides the current source output.

#### Returns

`string` \| `Blob`

The current source, either as the original string (file path) or Blob.

#### Overrides

[`BaseSourceProvider`](../../base/classes/BaseSourceProvider.md) . [`provide`](../../base/classes/BaseSourceProvider.md#provide)

#### Source

[packages/core/src/events/output/provide/file.ts:143](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/file.ts#L143)

***

### replace()

> **replace**(`source`): `void`

Replaces the current source with a new one.

#### Parameters

• **source**: `string` \| `Blob`

A new source, either a file path or a Blob, to replace the existing one.

#### Returns

`void`

#### Overrides

[`BaseSourceProvider`](../../base/classes/BaseSourceProvider.md) . [`replace`](../../base/classes/BaseSourceProvider.md#replace)

#### Source

[packages/core/src/events/output/provide/file.ts:111](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/output/provide/file.ts#L111)
