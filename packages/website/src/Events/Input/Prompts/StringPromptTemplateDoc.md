## StringPromptTemplate

A class to create text-based prompts with optional prefix and suffix.
---

| Reference | Link |
| --- | --- |
| Encre Concept | [ Callable, VariableRules ](**-a-link-to-the-corresponding-concept-documentation-**) |
| Encre Node | [ Prompt Nodes](**-a-link-to-the-corresponding-node-documentation-**) |
| API | [** A reference to API Documentation **](**-a-link-to-the-corresponding-api-documentation-**) |

### Overview

The `StringPromptTemplate` class is useful for creating text-based prompts that can include dynamic content based on input variables. It supports the addition of optional prefixes and suffixes to the formatted template string.


### Usage

#### Creating with Parameters

Here's an example of how to create StringPromptTemplate` with parameters:

```typescript
import { StringPromptTemplate } from "@encrejs/core";

const template = new StringPromptTemplate({
  template: "Hello, {{name}}!",
  inputVariables: ["name"],
  prefix: "Greeting: ",
  suffix: " Have a nice day."
});

const input = { name: "John" };

template.format(input).then((formatted) => {
  console.log(formatted);
  // Outputs: "Greeting: Hello, John! Have a nice day."
});

template.formatPrompt(input).then((prompt) => {
  console.log(prompt.toString());
  // Outputs: "Greeting: Hello, John! Have a nice day."
});


```

Component parameters:

| Parameter | Runtime Type | Description |
| --- | --- | --- |
| template | string | Template string used to generate prompts. |
| inputVariables | string[] | List of input variables explicitly declared, used within the template. |
| prefix | string | Optional prefix to be added before the formatted template string. |
| sufix | string | Optional suffix to be added after the formatted template string. |
| guardrails | VariableRules | Optional rules for validating the input variables.|



<table>
  <tr>
    <td> <strong>Input variables</strong> </td> 
    <td> An object with keys corresponding to the input names. For example: `{ name: 'John' }`. </td>
  </tr>
  <tr>
    <td> <strong>Invoke options</strong> </td> 
    <td> Optional configuration for additional settings like timeout or validation rules. </td>
  </tr>
  <tr>
    <td> <strong>Output variables</strong> </td> 
    <td> a `StringPrompt` object containing the generated prompt string.  </td>
  </tr>
</table>