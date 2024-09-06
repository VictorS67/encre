# Interface: GeminiTool

Represents a collection of Gemini functions that can be utilized by the model.

## Example

```typescript
const tools: GeminiTool = {
  functionDeclarations: [
    {
      name: 'get_current_weather',
      description: 'get weather in a given location',
      parameters: {
        type: FunctionDeclarationSchemaType.OBJECT,
        properties: {
          location: {type: FunctionDeclarationSchemaType.STRING},
          unit: {
            type: FunctionDeclarationSchemaType.STRING,
            enum: ['celsius', 'fahrenheit'],
          }
        },
        required: ['location']
      }
    }
  ]
};
```

## Properties

### functionDeclarations

> **functionDeclarations**: [`GeminiFunction`](GeminiFunction.md)[]

One or more function declarations. Each function declaration contains
information about one function.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/index.ts:119](https://github.com/VictorS67/encre/blob/c09849eb59af073bf23be826a912f2ba4f635f93/packages/core/src/events/inference/chat/llms/vertexai/index.ts#L119)
