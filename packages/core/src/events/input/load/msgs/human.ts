import { BaseMessage, type BaseMessageFields, MessageRole } from './base.js';

/**
 * Class that stores the Human message in a conversation.
 */
export class HumanMessage extends BaseMessage {
  _isSerializable = true;

  _role(): MessageRole {
    return 'human';
  }

  static _name(): string {
    return 'HumanMessage';
  }

  concat(message: HumanMessage): HumanMessage {
    return new HumanMessage({
      content: HumanMessage._mergeContent(this.content, message.content),
      additionalKwargs: HumanMessage._mergeAdditionalKwargs(
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