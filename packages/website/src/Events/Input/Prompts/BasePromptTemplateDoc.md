## BasePromptTemplate

Abstract base class for prompt templates that generate specific types of prompts based on input data.
---

| Reference | Link |
| --- | --- |
| Encre Concept | [ Callable, VariableRules ](**-a-link-to-the-corresponding-concept-documentation-**) |
| Encre Node | [** A reference to the node that uses this component **](**-a-link-to-the-corresponding-node-documentation-**) |
| API | [** A reference to API Documentation **](**-a-link-to-the-corresponding-api-documentation-**) |

### Overview

The `BasePromptTemplate` class serves as a foundational structure for creating prompt templates. It ensures that all input variables are validated and formatted correctly, making it easier to generate consistent and accurate prompts.


### Usage

#### Creating with Parameters

Here's an example of how to create `BasePromptTemplate` with parameters:

```typescript
import { BasePromptTemplate } from 'your/path/to/packages/core/src/events/input/load/prompts/base.ts';

class CustomPromptTemplate extends BasePromptTemplate {
  _templateType(): string {
    return 'custom';
  }

  async format(input: BasePromptTemplateInput): Promise<string> {
    // Format input data into a string
    return `Hello, ${input['name']}!`;
  }

  async formatPrompt(input: BasePromptTemplateInput): Promise<BasePrompt> {
    // Format input data into a BasePrompt instance
    return new CustomPrompt();
  }
}

// Initialize your component
const promptTemplate = new CustomPromptTemplate({
  template: 'Hello, {{name}}!',
  inputVariables: ['name'],
});


```

Component parameters:

| Parameter | Runtime Type | Description |
| --- | --- | --- |
| template | string | Template string used to generate prompts. |
| inputVariables | string[] | List of input variables explicitly declared, used within the template. |
| guardrails | VariableRules | Optional rules for validating the input variables.|



<table>
  <tr>
    <td> <strong>Input variables</strong> </td> 
    <td> The input data for generating the prompt. </td>
  </tr>
  <tr>
    <td> <strong>Invoke options</strong> </td> 
    <td> Optional configuration. </td>
  </tr>
  <tr>
    <td> <strong>Output variables</strong> </td> 
    <td> A promise resolving to the generated prompt. </td>
  </tr>
</table>