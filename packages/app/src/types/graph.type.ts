import { NodeConnection } from './nodeconnection.type';
import { Node } from './studio.type';

export type NodeGraph = {
  nodes: Node[];
  connections: NodeConnection[];
};
