import { expect, test } from '@jest/globals';
import { stringify } from 'yaml';
import { BaseMessage, SystemMessage } from '../../msgs/base';
import { BasePrompt, StringPrompt } from '../base';

test('test custom BasePrompt', async () => {
  class TestPrompt extends BasePrompt {
    _namespace: string[] = ['tests'];

    prompt: string;

    constructor(prompt: string, ...args) {
      super(...args);
      this.prompt = prompt;
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
