import { SerializableNode as Node } from '@encrejs/core';
import { UIContext } from '@encrejs/core';

export type NodeContentBodyProps = {
  node: Node;
};

export type KnownNodeContentBodyProps = {
  node: Node;
  uiContexts: UIContext[];
  onEditorClick?: (node: Node, uiContext: UIContext, editorId: string) => void;
};

export type UnknownNodeContentBodyProps = {
  node: Node;
};
