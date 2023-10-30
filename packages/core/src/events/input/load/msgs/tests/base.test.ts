import { expect, test } from '@jest/globals';
import { stringify } from 'yaml';
import {
  BaseMessage,
  BotMessage,
  HumanMessage,
  MessageRole,
  convertMessageLikeToMessage,
  getChatString,
} from '../base';

test('test custom BaseMessage', async () => {
  class TestMessage extends BaseMessage {
    _role(): MessageRole {
      return 'human';
    }

    static _name(): string {
      return 'TestHumanMessage';
    }
  }

  const testMessage = new TestMessage('this is a message.');
  const testMessageWithName = new TestMessage({
    content: 'this is a message with a name',
    name: 'Mike',
  });

  const serializedStr: string = JSON.stringify(testMessage, null, 2);
  expect(stringify(JSON.parse(serializedStr))).toMatchSnapshot();

  const serializedMessage: string = JSON.stringify(
    testMessage.toSerialized(),
    null,
    2
  );
  expect(stringify(JSON.parse(serializedMessage))).toMatchSnapshot();

  const serializedStr2: string = JSON.stringify(testMessageWithName, null, 2);
  expect(stringify(JSON.parse(serializedStr2))).toMatchSnapshot();

  const serializedMessage2: string = JSON.stringify(
    testMessageWithName.toSerialized(),
    null,
    2
  );
  expect(stringify(JSON.parse(serializedMessage2))).toMatchSnapshot();

  const testMessageWithName2 = new TestMessage({
    content: 'this is another message',
    name: 'Lily',
  });

  const chatmessage = getChatString([
    testMessageWithName,
    testMessageWithName2,
  ]);
  expect(chatmessage).toBe(
    'Human: this is a message with a name\nHuman: this is another message'
  );

  const chatmessageWithCustomIdentifier = getChatString(
    [testMessageWithName, testMessageWithName2],
    false,
    'Person',
    'Bot'
  );
  expect(chatmessageWithCustomIdentifier).toBe(
    'Person: this is a message with a name\nPerson: this is another message'
  );

  const chatmessageWithName = getChatString(
    [testMessageWithName, testMessageWithName2],
    true
  );
  expect(chatmessageWithName).toBe(
    'Mike: this is a message with a name\nLily: this is another message'
  );
});

test('test convertMessageLikeToMessage', async () => {
  const baseMessageLike = 'this is a message.';

  const message: BaseMessage = convertMessageLikeToMessage(baseMessageLike);
  expect(message).toBeInstanceOf(HumanMessage);
  const serializedStr: string = JSON.stringify(message, null, 2);
  expect(stringify(JSON.parse(serializedStr))).toMatchSnapshot();

  const message2: BaseMessage = convertMessageLikeToMessage([
    'assistant',
    'this is a bot message',
  ]);
  expect(message2).toBeInstanceOf(BotMessage);
  const serializedStr2: string = JSON.stringify(message2, null, 2);
  expect(stringify(JSON.parse(serializedStr2))).toMatchSnapshot();
});
