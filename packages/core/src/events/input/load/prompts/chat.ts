import { BaseMessage, getChatString } from '../msgs/base';
import { BasePrompt } from './base';

export interface ChatPromptFields {
  messages: BaseMessage[];
}

export class ChatPrompt extends BasePrompt {
  _namespace: string[] = ['events', 'input', 'load', 'prompts'];

  _isSerializable = true;

  static _name(): string {
    return 'ChatPrompt';
  }

  messages: BaseMessage[];

  constructor(fields: BaseMessage[] | ChatPromptFields) {
    if (Array.isArray(fields)) {
      fields = { messages: fields };
    }

    super(fields);
    this.messages = fields.messages;
  }

  toString(): string {
    return getChatString(this.messages);
  }

  toChatMessages(): BaseMessage[] {
    return this.messages;
  }
}
