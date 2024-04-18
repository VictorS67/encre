import { BaseMessage, BaseMessageFields, MessageRole } from './base.js';

/**
 * Class that stores the System message in a conversation.
 */
export class SystemMessage extends BaseMessage {
  _isSerializable = true;

  _role(): MessageRole {
    return 'system';
  }

  static _name(): string {
    return 'SystemMessage';
  }

  concat(message: SystemMessage): SystemMessage {
    return new SystemMessage({
      content: SystemMessage._mergeContent(this.content, message.content),
      additionalKwargs: SystemMessage._mergeAdditionalKwargs(
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
