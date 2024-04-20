import { Node, UIContext } from '../types/studio.type';

export type NodeContentBodyProps = {
  node: Node;
};

export type KnownNodeContentBodyProps = {
  node: Node;
  uiContexts: UIContext[];
  onClick?: (node: Node, uiContext: UIContext) => void;
};

export type UnknownNodeContentBodyProps = {
  node: Node;
};
