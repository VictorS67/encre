import { FC } from 'react';

import { Node } from './node.type';

export type UnknownNodeContentDescriptor = {
  Body?: FC<{ node: Node }>;
  useMarkdownInDefault?: boolean;
};

export type NodeContentDescriptor<T extends NodeContentType> = {
  Body?: FC<{ node: KnownNode<T> }>;
  useMarkdownInDefault?: boolean;
};

export type NodeContentDescriptors = {
  [K in NodeContentType]: NodeContentDescriptor<K>;
};

export type NodeContentType = NodeContent['type'];

export type KnownNode<T extends NodeContentType> = Extract<
  NodeContent,
  { type: T }
>;

export type NodeContent =
  | TextNodeContent
  | ChatNodeContent
  | ImageNodeContent
  | JsonNodeContent;

export type TextNodeContent = {
  type: 'text';
  content: string;
};

export type ChatContext = string | { [key: string]: unknown };

export type ChatContent = {
  role: 'human' | 'assistant' | 'system' | 'function' | 'general';
  name?: string;
  context: ChatContext;
};

export type ChatNodeContent = {
  type: 'chat';
  content: ChatContent | ChatContent[];
};

export type ImageContent = {
  mimeType: string;
  data?: string;
  path?: string;
  description?: string;
};

export type ImageNodeContent = {
  type: 'image';
  content: ImageContent;
};

export type JsonContext = { [key: string]: unknown };
export type JsonTemplate ={ [key: string]: string };

export type JsonContent = {
  jsonTemplate: JsonTemplate;
  context: JsonContext;
};

export type JsonNodeContent = {
  type: 'json';
  content: JsonContent;
};

export type NodeContentBodyProps = {
  node: Node;
};

export type UnknownNodeContentBodyProps = {
  node: Node;
};
