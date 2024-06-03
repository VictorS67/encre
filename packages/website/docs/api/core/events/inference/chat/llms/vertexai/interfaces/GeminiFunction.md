# Interface: GeminiFunction

Defines a function that can be called by the model during its execution. Functions
allow the model to perform actions or fetch data as needed.

## Example

```typescript
const function: GeminiFunction = {
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
};
```

## Properties

### description?

> `optional` **description**: `string`

The description and purpose of the function. The model uses this to
decide how and whether to call the function. For the best results,
we recommend that you include a description.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/index.ts:76](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/index.ts#L76)

***

### name

> **name**: `string`

The name of the function to call. Must start with a letter or an
underscore. Must be a-z, A-Z, 0-9, or contain underscores and dashes,
with a maximum length of 64.

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/index.ts:69](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/index.ts#L69)

***

### parameters

> **parameters**: `object`

The parameters of this function in a format that's compatible with
the OpenAPI schema format.

#### See

https://spec.openapis.org/oas/v3.0.3#schema

#### Index signature

 \[`key`: `string`\]: `unknown`

#### Source

[packages/core/src/events/inference/chat/llms/vertexai/index.ts:84](https://github.com/VictorS67/encre/blob/42c3bddca4be2d23ad959c1c99381eefbf43789c/packages/core/src/events/inference/chat/llms/vertexai/index.ts#L84)
