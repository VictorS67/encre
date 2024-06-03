import { BaseMessage, BaseMessageFields, MessageRole } from './base.js';

/**
 * Extends BaseMessageFields with a mandatory role property specific to chat messages.
 * This interface is tailored for chat message data structures, ensuring each message includes a designated role.
 */
export interface ChatMessageFields extends BaseMessageFields {
  /**
   * The role associated with the chat message, typically indicating the sender's category such as 'user', 'bot', or 'system'.
   */
  role: string;
}

/**
 * Represents a chat message in the system, extending the functionality of BaseMessage by adding chat-specific logic,
 * such as role management. This class is designed to work within communication systems where messages are categorized by role.
 */
export class ChatMessage extends BaseMessage {
  _isSerializable = true;

  static _name(): string {
    return 'ChatMessage';
  }

  /**
   * The role of the message, specifying the category of the sender or the purpose of the message within the chat system.
   */
  role: string;

  constructor(content: string, role: string);

  constructor(fields: ChatMessageFields);

  /**
   * Constructs a new instance of ChatMessage. The constructor is overloaded to accept either a string and a role or a structured object.
   *
   * @param fields Either a string representing the message content or an object conforming to ChatMessageFields.
   * @param role The role of the message if the content is provided as a string.
   */
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

  /**
   * A static method to determine if a given BaseMessage instance is actually an instance of ChatMessage.
   *
   *  @param message A BaseMessage to check.
   * @returns True if the provided message is an instance of ChatMessage, false otherwise.
   */
  static isInstance(message: BaseMessage): message is ChatMessage {
    return message._role() === 'general';
  }
}
