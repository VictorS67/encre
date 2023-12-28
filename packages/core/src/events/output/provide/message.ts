import {
  BaseMessage,
  BotMessage,
  ContentLike,
  HumanMessage,
  MessageRole,
  SystemMessage,
} from '../../input/load/msgs/base';
import { Generation, GenerationChunk } from './generation';

export interface SerializedMessageData {
  content: ContentLike;
  role?: MessageRole;
  name?: string;
}

export interface SerializedMessage {
  role: MessageRole;
  json: SerializedMessageData;
}

export interface SerializedMessageGeneration {
  text: string;
  message?: SerializedMessage;
}

export interface MessageGeneration extends Generation {
  /**
   * Generated text output
   */
  output: string;
}

export interface ChatGeneration extends MessageGeneration {
  message: BaseMessage;
}

export interface ChatGenerationChunkField extends ChatGeneration {}

export class ChatGenerationChunk
  extends GenerationChunk
  implements ChatGeneration
{
  declare output: string;

  message: BaseMessage;

  constructor(fields: ChatGenerationChunkField) {
    super(fields);
    this.message = fields.message;
  }

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

export function mapSerializedMessageToChatMessage(
  message: SerializedMessage
): BaseMessage {
  if (message.role === 'human') {
    return new HumanMessage(message.json);
  } else if (message.role === 'assistant') {
    return new BotMessage(message.json);
  } else if (message.role === 'system') {
    return new SystemMessage(message.json);
  } else {
    throw new Error(`Role is invalid: ${message.role}`);
  }
}

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
