import { MessageRole } from '../events/input/load/msgs/base.js';
import { exhaustiveTuple } from '../utils/exhuastive.js';
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
  blob: Array<ImageUIContext | AudioUIContext | FileUIContext>;
  size: number;
  blobType: string;
};

export type ContextUIContext = {
  type: 'context';
  text: Array<PlainUIContext | MarkdownUIContext | CodeUIContext>;
  metadata: Array<PlainUIContext | MarkdownUIContext | CodeUIContext>;
};

export type MessageUIContext = {
  type: 'message';
  content: Array<PlainUIContext | MarkdownUIContext | CodeUIContext>;
  kwargs: Array<PlainUIContext | MarkdownUIContext | CodeUIContext>;
  role: string | MessageRole;

  name?: string;
};

export type ImageUIContext = {
  type: 'image';
  mimeType: 'image/png' | 'image/jpeg' | 'image/gif' | 'image/svg+xml';
  data: Uint8Array;
};

export type AudioUIContext = {
  type: 'audio';
  mimeType: 'audio/mp3' | 'audio/wav' | 'audio/ogg';
  data: Uint8Array;
};

export type FileUIContext = {
  type: 'file';
  mimeType:
    | 'text/plain'
    | 'text/html'
    | 'text/javascript'
    | 'text/css'
    | 'application/json'
    | 'application/pdf'
    | 'application/xml';
  data: Uint8Array;
};

export type UIContext = BaseUIContext &
  (
    | PlainUIContext
    | MarkdownUIContext
    | CodeUIContext
    | BlobUIContext
    | ContextUIContext
    | MessageUIContext
    | ImageUIContext
    | AudioUIContext
    | FileUIContext
  );

export const imageTypes = exhaustiveTuple<ImageUIContext['mimeType']>()(
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/svg+xml'
);

export const audioTypes = exhaustiveTuple<AudioUIContext['mimeType']>()(
  'audio/mp3',
  'audio/ogg',
  'audio/wav'
);

export const fileTypes = exhaustiveTuple<FileUIContext['mimeType']>()(
  'text/plain',
  'text/html',
  'text/javascript',
  'text/css',
  'application/json',
  'application/pdf',
  'application/xml'
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

export const extMap: Record<
  | ImageUIContext['mimeType']
  | AudioUIContext['mimeType']
  | FileUIContext['mimeType'],
  string
> = {
  'text/plain': 'bin',
  'text/html': 'html',
  'text/javascript': 'js',
  'text/css': 'css',
  'application/json': 'json',
  'application/pdf': 'pdf',
  'application/xml': 'xml',
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'audio/mp3': 'mp3',
  'audio/ogg': 'ogg',
  'audio/wav': 'wav',
};
