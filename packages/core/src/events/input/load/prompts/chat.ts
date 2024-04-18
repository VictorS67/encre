import { BaseMessage } from '../msgs/base.js';
import { getChatString } from '../msgs/utils.js';
import { BasePrompt } from './base.js';

export interface ChatPromptFields {
  messages: BaseMessage[];
}

export class ChatPrompt extends BasePrompt {
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

  _promptType(): string {
    return 'chat';
  }

  toString(): string {
    return getChatString(this.messages);
  }

  toChatMessages(): BaseMessage[] {
    return this.messages;
  }
}
