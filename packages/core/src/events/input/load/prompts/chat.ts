import { type BaseMessage } from '../msgs/index.js';
import { getChatString } from '../msgs/utils.js';
import { BasePrompt } from './base.js';

/**
 * Defines the structure for the fields required to initialize a ChatPrompt.
 */
export interface ChatPromptFields {
  /**
   * An array of messages that compose the chat prompt.
   */
  messages: BaseMessage[];
}

/**
 * Represents a prompt consisting of a series of chat messages. This class can output the collected messages
 * as a single formatted string or return them as an array of `BaseMessage` instances.
 */
export class ChatPrompt extends BasePrompt {
  _isSerializable = true;

  static _name(): string {
    return 'ChatPrompt';
  }

  /**
   * The collection of chat messages for this prompt.
   */
  messages: BaseMessage[];

  /**
   * Constructs a new ChatPrompt instance. Accepts either an array of `BaseMessage` instances or an object
   * conforming to `ChatPromptFields`.
   * @param fields An array of `BaseMessage` instances or a `ChatPromptFields` object specifying the messages.
   */
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

  /**
   * Converts the chat messages into a single string. This method uses a utility function `getChatString` to
   * format the messages.
   * @returns A string representing the concatenated chat messages.
   */
  toString(): string {
    return getChatString(this.messages);
  }

  /**
   * Returns the original array of `BaseMessage` instances that compose the chat.
   * @returns An array of `BaseMessage` instances.
   */
  toChatMessages(): BaseMessage[] {
    return this.messages;
  }
}
