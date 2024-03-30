import {
  BaseMessage,
  ContentLike,
  MessageRole,
} from '../../input/load/msgs/base.js';
import { BotMessage } from '../../input/load/msgs/bot.js';
import { ChatMessage, ChatMessageFields } from '../../input/load/msgs/chat.js';
import { FunctionMessage } from '../../input/load/msgs/function.js';
import { HumanMessage } from '../../input/load/msgs/human.js';
import { SystemMessage } from '../../input/load/msgs/system.js';
import { checkMessageRole } from '../../input/load/msgs/utils.js';
import { Generation, GenerationChunk } from './generation.js';

export interface SerializedMessageData {
  content: ContentLike | ContentLike[];
  role?: MessageRole;
  name?: string;
  additionalKwargs?: {
    [key: string]: unknown;
  };
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

export function isMessageContentLike(value: unknown): value is ContentLike {
  return typeof value === 'string' || typeof value === 'object';
}

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
