# Interface: GeminiSafetySetting

Settings to manage safety thresholds for content generated or processed by the model.

## Example

```typescript
const safetySetting: GeminiSafetySetting = {
  category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
  threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
};
```

## Properties

### category

> **category**: `HarmCategory`

The safety category to configure a threshold for.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/index.ts:32](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/index.ts#L32)

***

### threshold

> **threshold**: `HarmBlockThreshold`

The threshold for blocking responses that could belong to the specified
safety category based on probability.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/index.ts:38](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/index.ts#L38)
