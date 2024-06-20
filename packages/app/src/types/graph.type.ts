import { GraphComment } from '@encrejs/core/studio/comments';
import {
  SerializableNode as Node,
  NodeConnection,
} from '@encrejs/core/studio/nodes';

export type NodeGraph = {
  nodes: Node[];
  connections: NodeConnection[];
  comments: GraphComment[];
};
