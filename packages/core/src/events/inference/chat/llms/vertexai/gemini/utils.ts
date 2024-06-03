import { Content, InlineDataPart, Part } from '@google/generative-ai';

import {
  BaseMessage,
  ContentLike,
} from '../../../../../input/load/msgs/base.js';
import { BotMessage } from '../../../../../input/load/msgs/bot.js';
import { ChatMessage } from '../../../../../input/load/msgs/chat.js';
import { HumanMessage } from '../../../../../input/load/msgs/human.js';
import {
  GeminiContentRole,
  GeminiInlineData,
  GeminiMimeType,
} from '../index.js';

/**
 * Converts a Gemini content structure to a BaseMessage based on the specified role.
 * If no role is provided, it defaults to the role specified in the content.
 *
 * @param content - The content object from Gemini API containing parts and roles.
 * @param defaultRole - Optional. Default role to assume if the content does not specify one.
 * @returns A BaseMessage instance appropriate to the content's role.
 * @example
 * ```typescript
 * const geminiContent: Content = { role: 'user', parts: [{ text: 'Hello, how can I assist you today?' }] };
 * const message = getMessageFromContentWithRole(geminiContent, 'user');
 * console.log(message); // Outputs a HumanMessage with the content text.
 * ```
 */
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

/**
 * Creates a BaseMessage instance from a Gemini content object, determining the message type 
 * based on the role provided in the content.
 *
 * @param content - The content object containing the message parts and role.
 * @returns A BaseMessage instance derived from the content's role and text.
 * @example
 * ```typescript
 * const content: Content = { role: 'model', parts: [{ text: 'Welcome to our service!' }] };
 * const message = getMessageFromContent(content);
 * console.log(message); // Outputs a BotMessage with the provided text.
 * ```
 */
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

/**
 * Transforms a BaseMessage into a Gemini content structure, suitable for sending to the 
 * Gemini API.
 *
 * @param message - The message to transform into Gemini content format.
 * @returns A Content object representing the original message in a format accepted by Gemini.
 * @example
 * ```typescript
 * const message = new HumanMessage({ content: 'Hello, world!' });
 * const content = getContentFromMessage(message);
 * console.log(content); // Outputs Content with role 'user' and text 'Hello, world!'
 * ```
 */
export function getContentFromMessage(message: BaseMessage): Content {
  return {
    role: getGeminiRoleFromMessage(message),
    parts: getPartsFromMessage(message),
  };
}

/**
 * Determines the Gemini content role for a given message based on its internal role.
 *
 * @param message - The message whose role is to be determined.
 * @throws Error if the message's role does not support mapping to a Gemini role.
 * @returns The corresponding Gemini content role.
 * @example
 * ```typescript
 * const message = new BotMessage({ content: 'Processing your request.' });
 * const role = getGeminiRoleFromMessage(message);
 * console.log(role); // Outputs 'model'
 * ```
 */
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

/**
 * Extracts parts from a message, suitable for forming the parts array in a Gemini content 
 * structure.
 *
 * @param message - The message to extract parts from.
 * @throws Error if the message content type is unsupported.
 * @returns An array of Parts derived from the message content.
 * @example
 * ```typescript
 * const message = new HumanMessage({ content: 'Can you provide more details?' });
 * const parts = getPartsFromMessage(message);
 * console.log(parts); // Outputs [{ text: 'Can you provide more details?' }]
 * ```
 */
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

/**
 * Checks whether a message requires a multi-modal response based on the presence of 
 * inline data.
 *
 * @param message - The message to check.
 * @returns A boolean indicating whether multi-modal capabilities are needed.
 * @example
 * ```typescript
 * const message = new BaseMessage({ content: [{ mimeType: GeminiMimeType.PNG, data: '...' }] });
 * const required = isModalityRequiredInMessage(message);
 * console.log(required); // Outputs true if the message contains non-text content.
 * ```
 */
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

/**
 * Constructs a text part suitable for use in Gemini API calls from a given content object.
 *
 * @param content - The content object containing the text.
 * @returns An object representing a text part for the Gemini API.
 * @example
 * ```typescript
 * const textContent = { text: "Hello, world!" };
 * const textPart = getTextPart(textContent);
 * console.log(textPart); // Outputs: { text: "Hello, world!" }
 * ```
 */
export function getTextPart(content: any): any {
  return {
    text: content.text,
  };
}

/**
 * Creates an inline data part for the Gemini API using the specified inline data, 
 * typically used for including media like images in API requests.
 *
 * @param inlineData - The inline data containing mimeType and base64-encoded data.
 * @returns An object that represents an inline data part for use in Gemini API calls.
 * @example
 * ```typescript
 * const inlineData: GeminiInlineData = {
 *   mimeType: GeminiMimeType.PNG,
 *   data: 'base64-encoded-image-data'
 * };
 * const inlinePart = getInlinePartFromInlineData(inlineData);
 * console.log(inlinePart); 
 * // Outputs: { inlineData: { mimeType: 'image/png', data: 'base64-encoded-image-data' } }
 * ```
 */
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

/**
 * Determines whether a given part-like object qualifies as valid text data for the Gemini API.
 *
 * @param partLike - The object to check.
 * @returns A boolean indicating if the object contains text data suitable for the API.
 * @example
 * ```typescript
 * const content = { text: "Example text" };
 * const isText = isTextData(content);
 * console.log(isText); // Outputs: true
 * ```
 */
export function isTextData(partLike: any): boolean {
  return (
    typeof partLike === 'object' &&
    'text' in partLike &&
    typeof partLike['text'] === 'string' &&
    partLike['text'].length > 0
  );
}

/**
 * Checks if a given object conforms to the structure of inline data as expected by the 
 * Gemini API, typically for media content.
 *
 * @param partLike - The object to verify as inline data.
 * @returns A boolean indicating if the object is valid inline data.
 * @example
 * ```typescript
 * const part = { mimeType: GeminiMimeType.PNG, data: 'base64-encoded-data' };
 * const isValid = isInlineData(part);
 * console.log(isValid); // Outputs: true
 * ```
 */
export function isInlineData(partLike: any): partLike is GeminiInlineData {
  return (
    typeof partLike === 'object' &&
    'mimeType' in partLike &&
    'data' in partLike &&
    isValidMime(partLike['mimeType']) &&
    typeof partLike['data'] === 'string'
  );
}

/**
 * Validates if a given value is a supported MIME type in the context of the Gemini API.
 *
 * @param mimeLike - The value to check against known MIME types.
 * @returns A boolean indicating if the value is a recognized MIME type.
 * @example
 * ```typescript
 * const mimeType = 'image/png';
 * const isValid = isValidMime(mimeType);
 * console.log(isValid); // Outputs: true
 * ```
 */
export function isValidMime(mimeLike: any): mimeLike is GeminiMimeType {
  return Object.values(GeminiMimeType).includes(mimeLike as GeminiMimeType);
}
