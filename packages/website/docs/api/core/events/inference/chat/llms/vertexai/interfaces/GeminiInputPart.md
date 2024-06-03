# Interface: GeminiInputPart

Defines a part of the input for a Gemini model call, which can be either text
or inline data like images.

## Example

```typescript
const textData: GeminiInputPart = {
  text: "this is a text prompt"
};

const imageData: GeminiInputPart = {
  inlineData: {
    mimeType: GeminiMimeType.PNG,
    data: 'iVBORw0KGgoAAAANSUhEUgAAAAUA...'
  }
};
```

## Properties

### inlineData?

> `optional` **inlineData**: [`GeminiInlineData`](GeminiInlineData.md)

Serialized bytes data of the image or video. You can specify at most 1
image with [GeminiInlineData](GeminiInlineData.md). To specify up to 16 images, use
GeminiFileData.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/index.ts:323](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/index.ts#L323)

***

### text?

> `optional` **text**: `string`

The text instructions or chat dialogue to include in the prompt.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/index.ts:316](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/index.ts#L316)
