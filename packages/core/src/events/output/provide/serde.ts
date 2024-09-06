import {
  type ContentLike,
  type MessageRole,
} from '../../input/load/msgs/index.js';

/**
 * Represents the data structure of a serialized message, which includes all essential fields that describe a message.
 */
export interface SerializedMessageData {
  /**
   * The main content of the message. It can be a string or a more complex structure
   * represented by an object with key-value pairs.
   */
  content: ContentLike | ContentLike[];

  /**
   * The role of the message, specifying the category of the sender or purpose within the system.
   */
  role?: MessageRole;

  /**
   * An optional name for the message, which could be used for identifying or categorizing the message.
   */
  name?: string;

  /**
   * Optional additional keyword arguments that provide extended functionality and flexibility
   * in handling the message. These might include additional data fields not covered by the standard properties.
   */
  additionalKwargs?: {
    [key: string]: unknown;
  };
}

/**
 * Represents a fully serialized message, combining the role with its detailed data.
 */
export interface SerializedMessage {
  /**
   * The role of the message, defining how it should be interpreted or handled within the system.
   */
  role: MessageRole;

  /**
   * The detailed data of the message, structured as per SerializedMessageData.
   */
  json: SerializedMessageData;
}

/**
 * Defines a structure for storing serialized message data along with generated text, typically used in recording and loading.
 */
export interface SerializedMessageGeneration {
  /**
   * The text content generated, often representing the processed output of the message.
   */
  text: string;

  /**
   * Optional serialized message, providing context or additional information related to the generated text.
   */
  message?: SerializedMessage;
}
