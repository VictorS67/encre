import {
  BaseMessage,
  type ContentLike,
  BotMessage,
  ChatMessage,
  type ChatMessageFields,
  FunctionMessage,
  HumanMessage,
  SystemMessage,
} from '../../input/load/msgs/index.js';
import { checkMessageRole } from '../../input/load/msgs/utils.js';
import { type Generation, GenerationChunk } from './generation.js';
import {
  type SerializedMessage,
  type SerializedMessageData,
  type SerializedMessageGeneration,
} from './serde.js';

/**
 * Extends the basic Generation interface to specifically handle text output, commonly used in messaging systems.
 */
export interface MessageGeneration extends Generation {
  /**
   * Generated text output, representing the processed or computed response.
   */
  output: string;
}

/**
 * Extends MessageGeneration for chat-specific use cases, including the actual message involved in the generation.
 */
export interface ChatGeneration extends MessageGeneration {
  /**
   * The chat message associated with this generation, detailing the specifics of the chat interaction.
   */
  message: BaseMessage;
}

/**
 * Defines the fields required to create a ChatGenerationChunk, essentially mirroring the ChatGeneration interface.
 */
export interface ChatGenerationChunkField extends ChatGeneration {}

/**
 * Represents a chunk of chat generation, managing both the output text and the associated chat message.
 * This class is used to handle segments of chat data, particularly useful in systems that process large or complex dialogues.
 */
export class ChatGenerationChunk
  extends GenerationChunk
  implements ChatGeneration
{
  /** @hidden */
  declare output: string;

  /**
   * The associated BaseMessage for this chunk of chat generation.
   */
  message: BaseMessage;

  constructor(fields: ChatGenerationChunkField) {
    super(fields);
    this.message = fields.message;
  }

  /**
   * Concatenates this chat generation chunk with another, combining their outputs and messages.
   *
   * @param chunk Another ChatGenerationChunk to concatenate with this one.
   * @returns A new ChatGenerationChunk representing the combined result.
   */
  concat(chunk: ChatGenerationChunk): ChatGenerationChunk {
    return new ChatGenerationChunk({
      output: this.output + chunk.output,
      info: {
        ...this.info,
        ...chunk.info,
      },
      message: this.message.concat(chunk.message),
    });
  }
}

/**
 * Determines whether a given value qualifies as valid content for a message.
 * This function checks if the value is either a string or an object, aligning with the ContentLike type requirements.
 *
 * @param value The value to be evaluated as potential message content.
 * @returns True if the value is a string or an object, false otherwise.
 */
export function isMessageContentLike(value: unknown): value is ContentLike {
  return typeof value === 'string' || typeof value === 'object';
}

/**
 * Validates if a given value is a SerializedMessageData by checking required fields and types.
 * Ensures the value contains all necessary attributes with appropriate types for representing a serialized message.
 *
 * @param value The value to check for compliance with SerializedMessageData structure.
 * @returns True if the value matches the SerializedMessageData structure, false otherwise.
 */
export function isSerializedMessage(
  value: unknown
): value is SerializedMessageData {
  if (typeof value === 'object' && value !== null) {
    let requireContent: boolean =
      'content' in value && isMessageContentLike(value['content']);

    if ('role' in value) {
      requireContent = requireContent && checkMessageRole(value['role']);
    }

    if ('name' in value) {
      requireContent = requireContent && typeof value['name'] === 'string';
    }

    if ('additionalKwargs' in value) {
      requireContent =
        requireContent && typeof value['additionalKwargs'] === 'object';
    }

    return requireContent;
  }

  return false;
}

/**
 * Converts a SerializedMessage into a BaseMessage instance based on the message's role.
 * This function maps serialized message data to concrete message classes like HumanMessage, BotMessage, etc.
 *
 * @param message A SerializedMessage to be converted into a BaseMessage.
 * @returns A BaseMessage instance corresponding to the specified role in the SerializedMessage.
 * @throws Error if the role is invalid or unsupported for conversion.
 */
export function mapSerializedMessageToChatMessage(
  message: SerializedMessage
): BaseMessage {
  if (message.role === 'human') {
    return new HumanMessage(message.json);
  } else if (message.role === 'assistant') {
    return new BotMessage(message.json);
  } else if (message.role === 'system') {
    return new SystemMessage(message.json);
  } else if (message.role === 'function') {
    return new FunctionMessage(message.json);
  } else if (message.role === 'general') {
    if (message.json.role !== undefined) {
      return new ChatMessage(message.json as ChatMessageFields);
    }
    throw new Error('ChatMessage cannot be created because role is undefined');
  } else {
    throw new Error(`Role is invalid: ${message.role}`);
  }
}

/**
 * Serializes a MessageGeneration object into a SerializedMessageGeneration structure.
 * This function is used primarily for converting MessageGeneration instances into a format suitable for storage or transmission.
 *
 * @param generation A MessageGeneration object to be serialized.
 * @returns A SerializedMessageGeneration containing the text output and optionally a serialized message.
 */
export function serializeMessageGeneration(generation: MessageGeneration) {
  const serializedMessageGeneration: SerializedMessageGeneration = {
    text: generation.output as string,
  };

  if ((generation as ChatGeneration).message !== undefined) {
    serializedMessageGeneration.message = (
      generation as ChatGeneration
    ).message.toSerialized();
  }

  return serializedMessageGeneration;
}

/**
 * Deserializes a SerializedMessageGeneration back into a MessageGeneration or ChatGeneration object.
 * This function is essential for reconstructing message generation instances from their serialized forms.
 *
 * @param serializedMsgGeneration A SerializedMessageGeneration object containing the serialized data.
 * @returns A MessageGeneration or ChatGeneration object reconstructed from the serialized data.
 */
export function deserializeMessageGeneration(
  serializedMsgGeneration: SerializedMessageGeneration
): MessageGeneration | ChatGeneration {
  if (serializedMsgGeneration.message === undefined) {
    return { output: serializedMsgGeneration.text };
  }

  return {
    output: serializedMsgGeneration.text,
    message: mapSerializedMessageToChatMessage(serializedMsgGeneration.message),
  };
}
