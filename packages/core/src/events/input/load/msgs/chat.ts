import { BaseMessage, BaseMessageFields, MessageRole } from './base.js';

export interface ChatMessageFields extends BaseMessageFields {
  role: string;
}

export class ChatMessage extends BaseMessage {
  _isSerializable = true;

  static _name(): string {
    return 'ChatMessage';
  }

  role: string;

  constructor(content: string, role: string);

  constructor(fields: ChatMessageFields);

  constructor(fields: string | ChatMessageFields, role?: string) {
    if (typeof fields === 'string') {
      fields = { content: fields, role: role! as MessageRole };
    }
    super(fields);

    this.role = fields.role;
  }

  _role(): MessageRole {
    return 'general';
  }

  concat(message: ChatMessage): ChatMessage {
    return new ChatMessage({
      content: ChatMessage._mergeContent(this.content, message.content),
      additionalKwargs: ChatMessage._mergeAdditionalKwargs(
        this.additionalKwargs as NonNullable<
          BaseMessageFields['additionalKwargs']
        >,
        message.additionalKwargs as NonNullable<
          BaseMessageFields['additionalKwargs']
        >
      ),
      role: this.role,
    });
  }

  static isInstance(message: BaseMessage): message is ChatMessage {
    return message._role() === 'general';
  }
}
