import { expect, test, describe } from '@jest/globals';
import { stringify } from 'yaml';
import { VariableValidator } from '../../../../../utils/promptTemplateValidator/variableValidator.js';
import { StringPrompt, StringPromptTemplate } from '../text.js';

test('test custom StringPrompt', async () => {
  const testStringPrompt = new StringPrompt('this is a test prompt.');

  // StringPrompt is not serializable
  const serializedStr: string = JSON.stringify(testStringPrompt, null, 2);
  expect(stringify(JSON.parse(serializedStr))).toMatchSnapshot();

  expect(testStringPrompt.toString()).toBe('this is a test prompt.');

  // ChatMessages are serializable
  const serializedStr2: string = JSON.stringify(
    testStringPrompt.toChatMessages(),
    null,
    2
  );
  expect(stringify(JSON.parse(serializedStr2))).toMatchSnapshot();
});

describe('test StringPromptTemplate', () => {
  test('declare not exist input variables', async () => {
    const inputVariables = ['usedVariable', 'unusedVariable'];
    const template = 'This is a template with {{usedVariable}}';

    expect(() => {
      new StringPromptTemplate({
        template: template,
        inputVariables: inputVariables,
      });
    }).toThrow(
      "Variable 'unusedVariable' is declared but not used in the template."
    );
  });

  test('validator', async () => {
    const isString = (s) => typeof s === 'string';

    const validator = new VariableValidator(['name']);
    validator.addSpecificRule('name', isString);

    const promptTemplate = new StringPromptTemplate({
      template: '{{name}}',
      inputVariables: ['name'],
      validator: validator,
    });

    await expect(promptTemplate.invoke({ name: 1 })).rejects.toThrow(
      'the validation for inputValue failed'
    );
  });

  test('prefix and suffix in the template', async () => {
    const promptTemplate = new StringPromptTemplate({
      template: '{{name}}',
      inputVariables: ['name'],

      prefix: 'Hello, ',
      suffix: '!',
    });

    const formattedString = await promptTemplate.invoke({ name: 'Alice' });
    expect(formattedString.toString()).toBe('Hello, Alice!');
  });
});
