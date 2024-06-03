# Class: Context\<Metadata\>

Represents a single readable context derived from a page of content. This class encapsulates the content
and metadata, providing a structured way to handle such information within processing or analytical operations.

## Type parameters

• **Metadata** = `Record`\<`string`, `unknown`\>

The type for metadata that augments the page content with additional data or annotations.

## Implements

- [`ContextInput`](../interfaces/ContextInput.md)\<`Metadata`\>

## Constructors

### new Context()

> **new Context**\<`Metadata`\>(`fields`): [`Context`](Context.md)\<`Metadata`\>

Constructs a new instance of Context, initializing it with specified page content and optional metadata.

#### Parameters

• **fields**: [`ContextInput`](../interfaces/ContextInput.md)\<`Metadata`\>

An object containing pageContent and optionally metadata, conforming to ContextInput.

#### Returns

[`Context`](Context.md)\<`Metadata`\>

#### Source

[packages/core/src/events/input/load/docs/context.ts:42](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/docs/context.ts#L42)

## Properties

### metadata

> **metadata**: `Metadata`

Metadata associated with the page content, of type Metadata.

#### Implementation of

[`ContextInput`](../interfaces/ContextInput.md) . [`metadata`](../interfaces/ContextInput.md#metadata)

#### Source

[packages/core/src/events/input/load/docs/context.ts:36](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/docs/context.ts#L36)

***

### pageContent

> **pageContent**: `string` = `''`

The content of the page stored as a string.

#### Implementation of

[`ContextInput`](../interfaces/ContextInput.md) . [`pageContent`](../interfaces/ContextInput.md#pagecontent)

#### Source

[packages/core/src/events/input/load/docs/context.ts:31](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/docs/context.ts#L31)

## Methods

### isContext()

> `static` **isContext**(`value`): `value is Context<Record<string, unknown>>`

Static method to check if a given value is an instance of Context.

#### Parameters

• **value**: `unknown`

The value to check.

#### Returns

`value is Context<Record<string, unknown>>`

True if the value is an instance of Context, false otherwise.

#### Source

[packages/core/src/events/input/load/docs/context.ts:54](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/input/load/docs/context.ts#L54)
