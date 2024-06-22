import { GraphComment } from '@encrejs/core';
import { SerializableNode as Node, NodeConnection } from '@encrejs/core';

export type NodeGraph = {
  nodes: Node[];
  connections: NodeConnection[];
  comments: GraphComment[];
};
