## OpenAIChat

Class for handling interactions with the OpenAI API, specifically designed to manage chat functionalities.


---

| Reference | Link |
| --- | --- |
| Encre Concept | [Callable](**-a-link-to-the-corresponding-concept-documentation-**) |
| Encre Node | [** A reference to the node that uses this component **](**-a-link-to-the-corresponding-node-documentation-**) |
| API | [** A reference to API Documentation **](**-a-link-to-the-corresponding-api-documentation-**) |

### Overview

The `OpenAIChat` class is useful for managing chat functionalities with the OpenAI API. It is designed to handle interactions, process messages, and provide responses based on the model specified. This class abstracts the complexities involved in setting up and making requests to the OpenAI API, making it easier for developers to integrate advanced language model capabilities into their applications.


Prerequisites:
```bash
npm install openai

or

yarn add openai
```


### Usage

#### Creating with Parameters

Here's an example of how to create `OpenAIChat` with parameters:

```typescript
import { OpenAIChat

 } from "@encrejs/core";

const openAI = new OpenAIChat({
  modelName: 'gpt-3.5-turbo',
  openAIApiKey: 'your-api-key',
});

```

Component parameters:

| Parameter | Runtime Type | Description |
| --- | --- | --- |
| modelName | string | ID of the model to use. |
| openAIApiKey | string | API key to use when making requests to OpenAI. |
| frequencyPenalty | number | Positive values penalize new tokens based on their existing frequency in the text so far. |
| presencePenalty | number | Positive values penalize new tokens based on whether they appear in the text so far. |
| streaming | boolean | Whether to stream back partial progress. |
| temperature | number | Sampling temperature to use, between 0 and 2. |
| maxTokens | number | The maximum number of tokens to generate in the completion. |
| topP | number | Nucleus sampling parameter, where the model considers the results of the tokens with topP probability mass. |
| n | number | Number of completions to generate for each prompt. |
|logitBias | Record<string, number> | Modify the likelihood of specified tokens appearing in the completion. |
| responseFormat | 'json' or 'text' | The format of the response. |
| seed | number | Seed for deterministic sampling. |
| stopWords | string[] | Sequences where the API will stop generating tokens. |
| user | string | A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. |
| timeout | number | Timeout for the API requests. |
| additionalKwargs | Record<string, unknown> | Additional keyword arguments to pass to the API. |



### Inputs and Outputs

This example shows an invoking example that demonstrates the functionality of using `OpenAIChat`.

```typescript
import { OpenAIChat, HumanMessage } from '@encrejs/core';

const openAI = new OpenAIChat({
  modelName: 'gpt-3.5-turbo',
  openAIApiKey: 'your-api-key',
});

const message = new HumanMessage("Hello, world!");
const response = await openAI.invoke([message]);
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
    <td>  Configuration options for the chat completion, such as `stopWords`, `functions`, and `functionCallOption`. </td>
  </tr>
  <tr>
    <td> <strong>Output variables</strong> </td> 
    <td> The language model result with chat completions, including `generations` and `llmOutput` with token usage details. </td>
  </tr>

  
</table>

