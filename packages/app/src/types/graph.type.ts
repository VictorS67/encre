import { Node } from './node.type';
import { NodeConnection } from './nodeconnection.type';

export type NodeGraph = {
  nodes: Node[];
  connections: NodeConnection[];
};
