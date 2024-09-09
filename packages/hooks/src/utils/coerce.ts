import {
  Context,
  EncreData,
  Message,
  MessageContent,
  MessageRole,
} from '../types';

function coerceMessageRole(roleLike: any): {
  role: MessageRole;
  name?: string;
} {
  if (roleLike === MessageRole.Assistant) {
    return { role: roleLike };
  } else if (roleLike === MessageRole.System) {
    return { role: roleLike };
  } else if (roleLike === MessageRole.User) {
    return { role: roleLike };
  } else if (roleLike === MessageRole.Tool) {
    return { role: roleLike };
  } else if (roleLike === MessageRole.General) {
    return { role: roleLike };
  } else {
    return { role: MessageRole.General, name: roleLike };
  }
}

function coerceMessageContent(
  contentLike: any,
): MessageContent | MessageContent[] {
  try {
    const json = JSON.parse(contentLike);

    return json;
  } catch (e) {
    return String(contentLike);
  }
}

function coerceMessageObject(messageObj: {
  _id: string[];
  _kwargs: {
    content: MessageContent | MessageContent[];
    additional_kwargs: Record<string, unknown>;
    name?: string;
  };
}): Message {
  const msgClass: string = messageObj._id[messageObj._id.length - 1];

  let role: MessageRole;
  if (msgClass === 'BotMessage') {
    role = MessageRole.Assistant;
  } else if (msgClass === 'FunctionMessage') {
    role = MessageRole.Tool;
  } else if (msgClass === 'HumanMessage') {
    role = MessageRole.User;
  } else if (msgClass === 'SystemMessage') {
    role = MessageRole.System;
  } else {
    role = MessageRole.General;
  }

  return {
    role,
    content: messageObj._kwargs.content,
    name: messageObj._kwargs.name,
    additionalKwargs:
      Object.keys(messageObj._kwargs.additional_kwargs).length === 0
        ? undefined
        : messageObj._kwargs.additional_kwargs,
  };
}

function truncateQuotesFromString(text: string) {
  const regex = /^"|"$/g;

  return text.replace(regex, '');
}

export function coerceEncreData(
  text: string,
  dataType: EncreData['type'],
): string | number | boolean | Context | Message | undefined | null {
  if (dataType === 'string') {
    return truncateQuotesFromString(text.toString());
  } else if (dataType === 'number') {
    return parseInt(text, 10);
  } else if (dataType === 'boolean') {
    return truncateQuotesFromString(text.toLowerCase()) === 'true';
  } else if (dataType === 'object') {
    return JSON.parse(text);
  } else if (dataType === 'context') {
    return JSON.parse(text) as Context;
  } else if (dataType === 'chat-message') {
    try {
      const messageLike = JSON.parse(text);

      if (Array.isArray(messageLike)) {
        const [role, content] = messageLike;

        return {
          ...coerceMessageRole(role),
          content: coerceMessageContent(content),
        } as Message;
      } else {
        return coerceMessageObject(messageLike);
      }
    } catch (e) {
      return {
        role: MessageRole.User,
        content: truncateQuotesFromString(text.toString()),
      } as Message;
    }
  } else if (dataType === 'unknown') {
    if (text === 'undefined') {
      return undefined;
    } else if (text === 'null') {
      return null;
    } else {
      try {
        return JSON.parse(text);
      } catch (e) {
        return truncateQuotesFromString(text.toString());
      }
    }
  }
}
