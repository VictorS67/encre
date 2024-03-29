import { exhaustiveTuple } from '../../../../utils/exhuastive.js';
import { BaseMessage, BaseMessageLike, MessageRole } from './base.js';
import { BotMessage } from './bot.js';
import { ChatMessage } from './chat.js';
import { HumanMessage } from './human.js';
import { SystemMessage } from './system.js';

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
  } else if (messageLike instanceof BaseMessage) {
    return messageLike;
  }

  const [role, content] = messageLike;
  if (role === 'human') {
    return new HumanMessage({ content });
  } else if (role === 'assistant') {
    return new BotMessage({ content });
  } else if (role === 'system') {
    return new SystemMessage({ content });
  } else if (role === 'general') {
    return new ChatMessage({ role: 'unknown', content });
  }

  // Does not support converting array type of BaseMessageLike to FunctionMessage
  throw new Error('CANNOT convert MessageLike to Message');
}

export function isMessageLike(value: unknown): value is BaseMessageLike {
  if (Array.isArray(value)) {
    if (value.length !== 2) return false;

    return checkMessageRole(value[0]) && typeof value[1] === 'string';
  }

  return typeof value === 'string' || value instanceof BaseMessage;
}

export function checkMessageRole(role: unknown): role is MessageRole {
  return (
    typeof role === 'string' &&
    exhaustiveTuple<MessageRole>()(
      'human',
      'assistant',
      'system',
      'function',
      'general'
    ).includes(role as MessageRole)
  );
};
