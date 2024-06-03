# Interface: GeminiContent

Describes the content to be processed by the Gemini model, specifying the role
associated with the content and the parts that make up the input.

## Example

```typescript
const content: GeminiContent = {
  role: "user",
  parts: [
    {
      text: "please describe the picture."
    },
    {
      inlineData: {
        mimeType: GeminiMimeType.PNG,
        data: 'iVBORw0KGgoAAAANSUhEUgAAAAUA...'
      }
    }
  ]
};
```

## Properties

### parts

> **parts**: [`GeminiInputPart`](GeminiInputPart.md)[]

Ordered parts that make up the input. Parts may have different MIME types.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/index.ts:361](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/index.ts#L361)

***

### role

> **role**: [`GeminiContentRole`](../type-aliases/GeminiContentRole.md)

The role in a conversation associated with the content. Specifying a
role is required even in singleturn use cases.

Acceptable values include the following:
- user: Specifies content that's sent by you.
- model: Specifies the model's response.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/index.ts:356](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/index.ts#L356)
