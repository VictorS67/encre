import { BaseMessage, BaseMessageFields, MessageRole } from './base.js';

/**
 * Class that stores the Function message in a conversation.
 */
export class FunctionMessage extends BaseMessage {
  _isSerializable = true;

  _role(): MessageRole {
    return 'function';
  }

  static _name(): string {
    return 'FunctionMessage';
  }

  concat(message: FunctionMessage): FunctionMessage {
    return new FunctionMessage({
      content: FunctionMessage._mergeContent(this.content, message.content),
      additionalKwargs: FunctionMessage._mergeAdditionalKwargs(
        this.additionalKwargs as NonNullable<
          BaseMessageFields['additionalKwargs']
        >,
        message.additionalKwargs as NonNullable<
          BaseMessageFields['additionalKwargs']
        >
      ),
      name: this.name ?? '',
    });
  }
}
