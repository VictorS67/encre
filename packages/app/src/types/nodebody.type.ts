import { Node, UIContext } from '../types/studio.type';

export type NodeContentBodyProps = {
  node: Node;
};

export type KnownNodeContentBodyProps = {
  node: Node;
  uiContexts: UIContext[];
};

export type UnknownNodeContentBodyProps = {
  node: Node;
};
