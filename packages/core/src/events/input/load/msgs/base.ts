import {
  Serializable,
  SerializedConstructor,
} from '../../../../load/serializable.js';
import {
  SerializedMessage,
  SerializedMessageData,
} from '../../../output/provide/message.js';

export type MessageRole =
  | 'human'
  | 'assistant'
  | 'system'
  | 'function'
  | 'general';

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
  additionalKwargs?: {
    [key: string]: unknown;
  };
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

  content: string;

  name?: string;

  additionalKwargs?: NonNullable<BaseMessageFields['additionalKwargs']>;

  abstract _role(): MessageRole;

  constructor(fields: string | BaseMessageFields) {
    if (typeof fields === 'string') {
      fields = { content: fields };
    }
    super(fields);

    this.name = fields.name;
    this.content = fields.content;
    this.additionalKwargs = fields.additionalKwargs;
  }

  toSerialized(): SerializedMessage {
    return {
      role: this._role(),
      json: (this.toJSON() as SerializedConstructor)
        ._kwargs as object as SerializedMessageData,
    };
  }

  abstract concat(message: BaseMessage): BaseMessage;

  static _mergeAdditionalKwargs(
    left: NonNullable<BaseMessageFields['additionalKwargs']>,
    right: NonNullable<BaseMessageFields['additionalKwargs']>
  ): NonNullable<BaseMessageFields['additionalKwargs']> {
    const additionalKwargs = { ...left };
    const newKwargs = { ...right };

    for (const [k, v] of Object.entries(newKwargs)) {
      if (typeof additionalKwargs[k] !== typeof v) {
        throw new Error(
          `key ${k} in additionalKwargs but values do not match types.`
        );
      } else if (additionalKwargs[k] === undefined) {
        additionalKwargs[k] = v;
      } else if (typeof additionalKwargs[k] === 'string') {
        additionalKwargs[k] = (additionalKwargs[k] as string) + v;
      } else if (
        !Array.isArray(additionalKwargs[k]) &&
        typeof additionalKwargs[k] === 'object'
      ) {
        additionalKwargs[k] = this._mergeAdditionalKwargs(
          additionalKwargs[k] as NonNullable<
            BaseMessageFields['additionalKwargs']
          >,
          v as NonNullable<BaseMessageFields['additionalKwargs']>
        );
      } else {
        throw new Error(
          `key ${k} already in additionalKwargs but failed to merge.`
        );
      }
    }

    return additionalKwargs;
  }
}

export interface ChatMessageFields extends BaseMessageFields {
  role: string;
}

export class ChatMessage extends BaseMessage {
  _isSerializable = true;

  static _name(): string {
    return 'ChatMessage';
  }

  role: string;

  constructor(content: string, role: string);

  constructor(fields: ChatMessageFields);

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
      content: this.content + message.content,
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

  static isInstance(message: BaseMessage): message is ChatMessage {
    return message._role() === 'general';
  }
}

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
      content: this.content + message.content,
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

/**
 * Class that stores the Bot message in a conversation.
 */
export class BotMessage extends BaseMessage {
  _isSerializable = true;

  _role(): MessageRole {
    return 'assistant';
  }

  static _name(): string {
    return 'BotMessage';
  }

  concat(message: BotMessage): BotMessage {
    return new BotMessage({
      content: this.content + message.content,
      additionalKwargs: BotMessage._mergeAdditionalKwargs(
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
      content: this.content + message.content,
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
      content: this.content + message.content,
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
    } else if (msg._role() === 'function') {
      role = 'Function';
    } else if (ChatMessage.isInstance(msg)) {
      role = msg.role;
    } else {
      throw new Error(
        `Current message role unsupported: ${JSON.stringify(msg)}`
      );
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
