import { GraphComment, Node, NodeConnection } from './studio.type';

export type NodeGraph = {
  nodes: Node[];
  connections: NodeConnection[];
  comments: GraphComment[];
};
