import { FC } from 'react';

import { BuiltInNodeType, Node } from './studio.type';

export type UnknownNodeContentDescriptor = {
  Body?: FC<{ node: Node }>;
  PopUpWindow?: FC<{ node: Node; onChange?: (node: Node) => void }>;
  useMarkdownInDefault?: boolean;
};

export type NodeContentDescriptor<T extends BuiltInNodeType> = {
  Body?: FC<{ node: Node }>;
  PopUpWindow?: FC<{ node: Node; onChange?: (node: Node) => void }>;
  useMarkdownInDefault?: boolean;
};

export type NodeContentDescriptors = {
  [K in BuiltInNodeType]: NodeContentDescriptor<K>;
};

export type NodeContentBodyProps = {
  node: Node;
};

export type UnknownNodeContentBodyProps = {
  node: Node;
};
