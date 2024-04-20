import {
  Serializable,
  SerializedConstructor,
} from '../../../../load/serializable.js';
import { isDeepEqual } from '../../../../utils/equal.js';
import { exhaustiveTuple } from '../../../../utils/exhuastive.js';
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

export type ContentLike = string | { [key: string]: unknown };

/**
 * Interface that defines the fields in `BaseMessage`.
 */
export interface BaseMessageFields {
  content: ContentLike | ContentLike[];
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
  _namespace: string[] = ['events', 'input', 'load', 'msgs', this._role()];

  content: ContentLike | ContentLike[];

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

  coerceToBoolean(): boolean | undefined {
    const coerceContentLikeToBoolean = (contentLike: ContentLike): boolean => {
      if (typeof contentLike === 'string') {
        return contentLike.length > 0 && contentLike.toLowerCase() !== 'false';
      }

      return true;
    };

    if (Array.isArray(this.content)) {
      return (
        this.content.length > 0 &&
        this.content.every((c) => coerceContentLikeToBoolean(c))
      );
    }

    return coerceContentLikeToBoolean(this.content);
  }

  abstract concat(message: BaseMessage): BaseMessage;

  static _mergeContent(
    left: NonNullable<BaseMessageFields['content']>,
    right: NonNullable<BaseMessageFields['content']>
  ): NonNullable<BaseMessageFields['content']> {
    if (!Array.isArray(left) && !Array.isArray(right)) {
      if (typeof left === 'string' && typeof right === 'string') {
        return left + right;
      }

      if (typeof left === 'object' && typeof right === 'object') {
        return {
          ...left,
          ...right,
        };
      }

      throw new Error(
        'Message cannot be merged. Content should follow the same type.'
      );
    }

    if (!Array.isArray(left) && Array.isArray(right)) {
      return [left, ...right];
    }

    if (Array.isArray(left) && !Array.isArray(right)) {
      return [...left, right];
    }

    if (Array.isArray(left) && Array.isArray(right)) {
      return [...left, ...right];
    }

    throw new Error(
      'Message cannot be merged. Content should follow the same type.'
    );
  }

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

  static isEqualMessage(message1: BaseMessage, message2: BaseMessage) {
    return isDeepEqual(message1.toSerialized(), message2.toSerialized());
  }

  static isEqualMessageArray(messageArray1: BaseMessage[], messageArray2: BaseMessage[]) {
    if (messageArray1.length !== messageArray2.length) {
      return false;
    }

    for (let i = 0; i < messageArray1.length; i++) {
      if (!this.isEqualMessage(messageArray1[i], messageArray2[i])) {
        return false;
      }
    }

    return true;
  }
}