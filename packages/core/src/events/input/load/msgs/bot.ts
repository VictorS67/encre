import { BaseMessage, BaseMessageFields, MessageRole } from './base.js';

/**
 * Class that stores the Bot message in a conversation.
 */
export class BotMessage extends BaseMessage {
  _isSerializable = true;

  _role(): MessageRole {
    return 'assistant';
  }

  static _name(): string {
    return 'BotMessage';
  }

  concat(message: BotMessage): BotMessage {
    return new BotMessage({
      content: BotMessage._mergeContent(this.content, message.content),
      additionalKwargs: BotMessage._mergeAdditionalKwargs(
        this.additionalKwargs as NonNullable<
          BaseMessageFields['additionalKwargs']
        >,
        message.additionalKwargs as NonNullable<
          BaseMessageFields['additionalKwargs']
        >
      ),
    });
  }
}