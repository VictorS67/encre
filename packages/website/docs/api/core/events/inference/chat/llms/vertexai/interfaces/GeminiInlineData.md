# Interface: GeminiInlineData

Represents inline media data, such as images or videos, to be included directly in model
inputs. It includes the media type and the base64-encoded data.

## Example

```typescript
const inlineData: GeminiInlineData = {
  mimeType: GeminiMimeType.PNG,
  data: 'iVBORw0KGgoAAAANSUhEUgAAAAUA...'
};
```

## Properties

### data

> **data**: `string`

The base64 encoding of the image or video to include inline in the prompt.
When including media inline, you must also specify [GeminiMimeType](../enumerations/GeminiMimeType.md).

size limit: 20MB

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/index.ts:292](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/index.ts#L292)

***

### mimeType

> **mimeType**: [`GeminiMimeType`](../enumerations/GeminiMimeType.md)

The media type of the image or video specified in the `data` fields.

Maximum video length: 2 minutes.

No limit on image resolution.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/index.ts:284](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/index.ts#L284)
