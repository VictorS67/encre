import { MessageRole } from '../events/input/load/msgs/base.js';
import { DataType } from './data.js';

export type BaseUIContext = {
  fontSize?: number;
  fontFamily?: 'monospace' | 'sans-serif';
  isReadOnly?: boolean;
};

export type PlainUIContext = {
  type: 'plain';
  text: string;
};

export type MarkdownUIContext = {
  type: 'markdown';
  text: string;
};

export type CodeUIContext = {
  type: 'code';
  text: string;

  language?: string;
  keywords?: string[];
  isHoldingValues?: boolean;
};

export type BlobUIContext = {
  type: 'blob';
  blob: Blob;
  size: number;
  blobType: string;
};

export type ContextUIContext = {
  type: 'context';
  text: string;

  metadata?: {
    [key: string]: unknown;
  };
};

export type MessageUIContext = {
  type: 'message';
  text: string;
  role: string | MessageRole;

  name?: string;
  additionalKwargs?: {
    [key: string]: unknown;
  };
};

export type UIContext = BaseUIContext &
  (
    | PlainUIContext
    | MarkdownUIContext
    | CodeUIContext
    | BlobUIContext
    | ContextUIContext
    | MessageUIContext
  );

export const UIDataTypesMap: Record<DataType, UIContext['type']> = {
  string: 'code',
  number: 'code',
  boolean: 'code',
  object: 'code',
  unknown: 'code',
  blob: 'blob',
  context: 'context',
  'chat-message': 'message',
  'string[]': 'code',
  'number[]': 'code',
  'boolean[]': 'code',
  'object[]': 'code',
  'unknown[]': 'code',
  'blob[]': 'blob',
  'context[]': 'context',
  'chat-message[]': 'message',
};
