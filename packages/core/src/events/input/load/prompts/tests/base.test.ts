import { expect, test } from '@jest/globals';
import { stringify } from 'yaml';
import { BaseMessage } from '../../msgs/base.js';
import { SystemMessage } from '../../msgs/system.js';
import {
  BasePrompt,
  BasePromptTemplate,
  BasePromptTemplateInput,
} from '../base.js';
import { StringPrompt } from '../text.js';

test('test custom BasePrompt', async () => {
  class TestPrompt extends BasePrompt {
    _namespace: string[] = ['tests'];

    prompt: string;

    constructor(prompt: string, ...args) {
      super(...args);
      this.prompt = prompt;
    }

    _promptType(): string {
      return 'test';
    }

    toString(): string {
      return this.prompt;
    }

    toChatMessages(): BaseMessage[] {
      return [
        new SystemMessage('this is a system message.'),
        new SystemMessage(this.prompt),
      ];
    }
  }

  const testPrompt = new TestPrompt('this is a test prompt.');

  // BasePrompt is not serializable
  const serializedStr: string = JSON.stringify(testPrompt, null, 2);
  expect(stringify(JSON.parse(serializedStr))).toMatchSnapshot();

  expect(testPrompt.toString()).toBe('this is a test prompt.');

  // ChatMessages are serializable
  const serializedStr2: string = JSON.stringify(
    testPrompt.toChatMessages(),
    null,
    2
  );
  expect(stringify(JSON.parse(serializedStr2))).toMatchSnapshot();
});

test('test custom BasePromptTemplate', async () => {
  class TestPromptTemplate extends BasePromptTemplate<
    BasePromptTemplateInput,
    StringPrompt
  > {
    _namespace: string[] = ['tests'];

    _templateType(): string {
      return 'test';
    }

    async format(input: BasePromptTemplateInput): Promise<string> {
      return this.template;
    }

    async formatPrompt(input: BasePromptTemplateInput): Promise<StringPrompt> {
      const formattedTemplate: string = await this.format({});

      return new StringPrompt(formattedTemplate);
    }
  }

  const testPromptTemplate = new TestPromptTemplate({
    template: 'this is a template',
  });

  // BasePromptTemplate is not serializable
  const serializedStr: string = JSON.stringify(testPromptTemplate, null, 2);
  expect(stringify(JSON.parse(serializedStr))).toMatchSnapshot();

  expect(await testPromptTemplate.format({})).toBe('this is a template');
  expect((await testPromptTemplate.formatPrompt({})).value).toBe(
    'this is a template'
  );
});
