## OpenAIEmbeddings

Class to handle embeddings via the OpenAI API, extending the base embeddings functionality.


---

| Reference | Link |
| --- | --- |
| Encre Concept | [Callable](**-a-link-to-the-corresponding-concept-documentation-**) |
| Encre Node | [** A reference to the node that uses this component **](**-a-link-to-the-corresponding-node-documentation-**) |
| API | [** A reference to API Documentation **](**-a-link-to-the-corresponding-api-documentation-**) |

### Overview

The `OpenAIEmbeddings` class is essential for generating vector embeddings using the OpenAI API. It allows applications to leverage powerful language models to create embeddings that can be used for various tasks such as similarity search, clustering, and more.

Prerequisites:
```bash
npm install openai

or

yarn add openai
```


### Usage

#### Creating with Parameters

Here's an example of how to create `OpenAIEmbeddings` with parameters:

```typescript
import { OpenAIEmbeddings } from "@encrejs/core";

const openaiEmbeddings = new OpenAIEmbeddings({
    openAIApiKey: OPENAI_API_KEY,
    modelName: 'text-embedding-3-small',
});

const embeddings = await openaiEmbeddings.invoke(
      'Your text string goes here'
);

```

Component parameters:

| Parameter | Runtime Type | Description |
| --- | --- | --- |
| modelName | string | ID of the model to use. |
| dimensions | number | Optional. The number of dimensions the resulting output embeddings should have. |
| user | string |Optional. A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. |
| openAIApiKey | string | Optional. API key to use when making requests to OpenAI. Defaults to the value of OPENAI_API_KEY environment variable. |
| timeout | number | Optional. Timeout for the API requests. |


Invoking details:

<table>
  <tr>
    <td> <strong>Input variables</strong> </td> 
    <td> The input variables are defined in the `OpenAIEmbeddingsParams` interface, which includes model configurations and API key details. </td>
  </tr>
  <tr>
    <td> <strong>Invoke options</strong> </td> 
    <td>  Optional configuration for the invocation, described by the `OpenAIEmbeddingsCallOptions` interface. This includes format and additional request options. </td>
  </tr>
  <tr>
    <td> <strong>Output variables</strong> </td> 
    <td> The output is an instance of the `EmbedResult` interface, which contains the embedding vector and additional output details. </td>
  </tr>

  
</table>

