## GeminiChat

The `GeminiChat` manages chat operations by configuring and controlling the generative process based on the provided options and contents, including handling of streaming content.

---

| Reference | Link |
| --- | --- |
| Encre Concept | [Callable, GeminiContent, GeminiSafetySetting](**-a-link-to-the-corresponding-concept-documentation-**) |
| Encre Node | [** A reference to the node that uses this component **](**-a-link-to-the-corresponding-node-documentation-**) |
| API | [** A reference to API Documentation **](**-a-link-to-the-corresponding-api-documentation-**) |

### Overview

The `GeminiChat` class is useful for managing chat functionalities with Google's Gemini models. It is designed to handle interactions, process messages, and provide responses based on the model specified. This class abstracts the complexities involved in setting up and making requests to the Google Generative AI API, making it easier for developers to integrate advanced language model capabilities into their applications.


Prerequisites:
```bash
npm install @google/generative-ai

or

yarn add @google/generative-ai
```


### Usage

#### Creating with Parameters

Here's an example of how to create `GeminiChat` with parameters:

```typescript
import { GeminiChat

 } from "@encrejs/core";

const geminiAI = new GeminiChat({
  modelName: 'gemini-pro',
  googleApiKey: 'your-api-key',
});

```

Component parameters:

| Parameter | Runtime Type | Description |
| --- | --- | --- |
| modelName | string | ID of the model to use. |
| googleApiKey | string | API key to use when making requests to Google Generative AI. |
| streaming | boolean | Whether the response comes with stream. |
| temperature | number | Controls the degree of randomness in token selection. |
| topP | number | Changes how the model selects tokens for output based on probability mass. |
| candidateCount | number | Number of response variations to return (must be 1). |
| maxOutputTokens | number | Maximum number of tokens that can be generated in the response. |
| topK | number | Changes how the model selects tokens for output based on highest probabilities. |
| stopSequences | string[] | Sequences where the API will strop generating text. |
| additionalKwargs | Record<string, unknown> | Additional keyword arguments to pass to the API. |
| contents | GeminiContent[] | 	Gemini contents to pass as a prefix to the prompt. |
| saftetySettings | Array<GeminiSafetySetting> | Safety attributes and their configured blocking thresholds. |



### Inputs and Outputs

This example shows an invoking example that demonstrates the functionality of using `GeminiChat`.

```typescript
import { GeminiChat, HumanMessage } from '@encrejs/core';

const geminiAI = new GeminiChat({
  modelName: 'gemini-pro',
  googleApiKey: 'your-api-key',
});

const message = new HumanMessage("Hello, world!");
const response = await geminiAI.invoke([message]);
console.log(response);

```



Invoking details:

<table>
  <tr>
    <td> <strong>Input variables</strong> </td> 
    <td>  Array of messages to be processed in the chat. This includes `HumanMessage`, `BotMessage`, `SystemMessage`, and other message types. </td>
  </tr>
  <tr>
    <td> <strong>Invoke options</strong> </td> 
    <td>  Configuration options for the chat completion, such as `safetySettings`, `stopSequences`, and `additionalKwargs`. </td>
  </tr>
  <tr>
    <td> <strong>Output variables</strong> </td> 
    <td> The language model result with chat completions, including `generations` and `llmOutput` with token usage details. </td>
  </tr>

  
</table>

