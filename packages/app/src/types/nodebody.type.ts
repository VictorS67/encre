import { SerializableNode as Node } from '@encrejs/core/studio/nodes';
import { UIContext } from '@encrejs/core/studio/ui';

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
