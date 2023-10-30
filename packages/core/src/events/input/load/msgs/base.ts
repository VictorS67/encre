import {
  Serializable,
  SerializedConstructor,
} from '../../../../load/serializable.js';
import {
  SerializedMessage,
  SerializedMessageData,
} from '../../../output/provide/message.js';

export type MessageRole = 'human' | 'assistant' | 'system';

export type Message = {
  content: string;
  role?: MessageRole;
  name?: string;
};

export type BaseMessageLike = BaseMessage | [MessageRole, string] | string;

/**
 * Interface that defines the fields in `BaseMessage`.
 */
export interface BaseMessageFields {
  content: string;
  name?: string;
}

/**
 * Abstract class that stores the message from the `BaseMessageFields`
 * interface.
 */
export abstract class BaseMessage
  extends Serializable
  implements BaseMessageFields
{
  _namespace: string[] = ['input', 'load', 'msgs'];

  _isSerializable = true;

  content: string;

  name?: string;

  abstract _role(): MessageRole;

  constructor(fields: string | BaseMessageFields) {
    if (typeof fields === 'string') {
      fields = { content: fields };
    }
    super(fields);

    this.name = fields.name;
    this.content = fields.content;
  }

  toSerialized(): SerializedMessage {
    return {
      role: this._role(),
      json: (this.toJSON() as SerializedConstructor)
        ._kwargs as object as SerializedMessageData,
    };
  }
}

/**
 * Class that stores the Human message in a conversation.
 */
export class HumanMessage extends BaseMessage {
  _role(): MessageRole {
    return 'human';
  }

  static _name(): string {
    return 'HumanMessage';
  }
}

/**
 * Class that stores the Bot message in a conversation.
 */
export class BotMessage extends BaseMessage {
  _role(): MessageRole {
    return 'assistant';
  }

  static _name(): string {
    return 'BotMessage';
  }
}

/**
 * Class that stores the System message in a conversation.
 */
export class SystemMessage extends BaseMessage {
  _role(): MessageRole {
    return 'system';
  }

  static _name(): string {
    return 'SystemMessage';
  }
}

export function getChatString(
  messages: BaseMessage[],
  replaceIdentityByName: boolean = false,
  humanIndentity: string = 'Human',
  botIdentity: string = 'AI'
): string {
  const messagesStr: string[] = [];
  for (const msg of messages) {
    let role: string;
    if (msg._role() === 'human') {
      role = humanIndentity;
    } else if (msg._role() === 'assistant') {
      role = botIdentity;
    } else if (msg._role() === 'system') {
      role = 'System';
    } else {
      throw new Error(`Current message role unsupported: ${msg}`);
    }

    if (replaceIdentityByName && msg.name) {
      role = msg.name;
    }

    messagesStr.push(`${role}: ${msg.content}`);
  }

  return messagesStr.join('\n');
}

export function convertMessageLikeToMessage(
  messageLike: BaseMessageLike
): BaseMessage {
  if (typeof messageLike === 'string') {
    return new HumanMessage(messageLike);
  } else if (isBaseMessage(messageLike)) {
    return messageLike;
  }

  const [role, content] = messageLike;
  if (role === 'human') {
    return new HumanMessage({ content });
  } else if (role === 'assistant') {
    return new BotMessage({ content });
  } else if (role === 'system') {
    return new SystemMessage({ content });
  } else {
    throw new Error('CANNOT convert MessageLike to Message');
  }
}

export function isBaseMessage(
  messageLike: unknown
): messageLike is BaseMessage {
  return 'content' in (messageLike as BaseMessage);
}
