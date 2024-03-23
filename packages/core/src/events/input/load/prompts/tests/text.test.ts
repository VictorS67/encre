import { expect, test, describe } from '@jest/globals';
import { stringify } from 'yaml';
import { GeneralRule } from '../../../../inference/validate/guardrails/base.js';
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

  test('adding guardrails', async () => {
    const isStringRule = new GeneralRule({
      description: 'is string',
      func: async (input: unknown) => {
        return typeof input === 'string';
      }
    });

    const promptTemplate = new StringPromptTemplate({
      template: '{{name}}',
      inputVariables: ['name'],
      guardrails: {
        default: isStringRule
      }
    });

    expect(() => promptTemplate.invoke({ name: 1 })).rejects.toThrow(
      "CANNOT format prompt because of error - Validation failed in variable 'name'"
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
