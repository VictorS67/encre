import { Node } from './studio.type';
import { NodeConnection } from './nodeconnection.type';

export type NodeGraph = {
  nodes: Node[];
  connections: NodeConnection[];
};
