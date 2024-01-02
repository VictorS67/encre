import { Content, InlineDataPart, Part } from '@google/generative-ai';

import {
  BaseMessage,
  BotMessage,
  ChatMessage,
  ContentLike,
  HumanMessage,
} from '../../../../../input/load/msgs/base.js';
import {
  GeminiContentRole,
  GeminiInlineData,
  GeminiMimeType,
} from '../index.js';

export function getMessageFromContentWithRole(
  content: Content,
  defaultRole?: GeminiContentRole
): BaseMessage {
  const role = content.role ?? defaultRole;
  const text: string = content.parts[0].text ?? '';
  const additionalKwargs: Record<string, unknown> = {};

  switch (role) {
    case 'user':
      return new HumanMessage({ content: text });
    case 'model':
      return new BotMessage({ content: text, additionalKwargs });
    default:
      return new ChatMessage({
        content: text,
        role: role ?? 'unknown',
        additionalKwargs,
      });
  }
}

export function getMessageFromContent(content: Content): BaseMessage {
  const text: string = content.parts[0].text ?? '';
  const additionalKwargs: Record<string, unknown> = {};

  switch (content.role) {
    case 'user':
      return new HumanMessage({ content: text });
    case 'model':
      return new BotMessage({ content: text, additionalKwargs });
    default:
      return new ChatMessage({
        content: text,
        role: content.role ?? 'unknown',
        additionalKwargs,
      });
  }
}

export function getContentFromMessage(message: BaseMessage): Content {
  return {
    role: getGeminiRoleFromMessage(message),
    parts: getPartsFromMessage(message),
  };
}

export function getGeminiRoleFromMessage(
  message: BaseMessage
): GeminiContentRole {
  switch (message._role()) {
    case 'system':
    case 'human':
      return 'user';
    case 'assistant':
      return 'model';
    default:
      throw new Error(
        `Message role ${message._role()} does not support Gemini.`
      );
  }
}

export function getPartsFromMessage(message: BaseMessage): Part[] {
  const getPart = (content: ContentLike): Part => {
    if (typeof content === 'string') {
      return {
        text: content,
      };
    } else if (isTextData(content)) {
      return getTextPart(content);
    } else if (isInlineData(content)) {
      return getInlinePartFromInlineData(content);
    }

    throw new Error('Message is not valid for Gemini');
  };

  if (!Array.isArray(message.content)) {
    return [getPart(message.content)];
  }

  return message.content.map((content: ContentLike) => getPart(content));
}

export function isModalityRequiredInMessage(message: BaseMessage): boolean {
  const isModalityRequired = (content: ContentLike): boolean => {
    return typeof content !== 'string' && isInlineData(content);
  };

  if (!Array.isArray(message.content)) {
    return isModalityRequired(message.content);
  }

  return message.content.some((content: ContentLike) =>
    isModalityRequired(content)
  );
}

export function getTextPart(content: any): any {
  return {
    text: content.text,
  };
}

export function getInlinePartFromInlineData(
  inlineData: GeminiInlineData
): InlineDataPart {
  return {
    inlineData: {
      mimeType: inlineData.mimeType,
      data: inlineData.data,
    },
  };
}

export function isTextData(partLike: any): boolean {
  return (
    typeof partLike === 'object' &&
    'text' in partLike &&
    typeof partLike['text'] === 'string' &&
    partLike['text'].length > 0
  );
}

export function isInlineData(partLike: any): partLike is GeminiInlineData {
  return (
    typeof partLike === 'object' &&
    'mimeType' in partLike &&
    'data' in partLike &&
    isValidMime(partLike['mimeType']) &&
    typeof partLike['data'] === 'string'
  );
}

export function isValidMime(mimeLike: any): mimeLike is GeminiMimeType {
  return Object.values(GeminiMimeType).includes(mimeLike as GeminiMimeType);
}
