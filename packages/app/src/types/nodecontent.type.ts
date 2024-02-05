import { FC } from "react";

import { Node } from "./node.type";

export type UnknownNodeContentDescriptor = {
  Body?: FC<{ node: Node }>;
  PopUpWindow?: FC<{ node: Node; onChange?: (node: Node) => void }>;
  useMarkdownInDefault?: boolean;
};

export type NodeContentDescriptor<T extends NodeContentType> = {
  Body?: FC<{ node: KnownNode<T> }>;
  PopUpWindow?: FC<{ node: Node; onChange?: (node: Node) => void }>;
  useMarkdownInDefault?: boolean;
};

export type NodeContentDescriptors = {
  [K in NodeContentType]: NodeContentDescriptor<K>;
};

export type NodeContentType = NodeContent["type"];

export type KnownNode<T extends NodeContentType> = Extract<
  NodeContent,
  { type: T }
>;

export type NodeContent =
  | TextNodeContent
  | ChatNodeContent
  | ImageNodeContent
  | JsonNodeContent;

export type TextContent = string | { [key: string]: unknown };

export type TextNodeContent = {
  type: "text";
  content: TextContent;
};

export type ChatContent = {
  role: "human" | "assistant" | "system" | "function" | "general";
  name?: string;
  context: TextContent;
};

export type ChatNodeContent = {
  type: "chat";
  content: ChatContent | ChatContent[];
};

export type ImageContent = {
  mimeType: string;
  data?: string;
  description?: string;
};

export type ImageNodeContent = {
  type: "image";
  content: ImageContent;
};

export type JsonContext = { [key: string]: unknown };
export type JsonTemplate = { [key: string]: string };

export type JsonContent = {
  jsonTemplate: JsonTemplate;
  context: JsonContext;
};

export type JsonNodeContent = {
  type: "json";
  content: JsonContent;
};

export type NodeContentBodyProps = {
  node: Node;
};

export type UnknownNodeContentBodyProps = {
  node: Node;
};
