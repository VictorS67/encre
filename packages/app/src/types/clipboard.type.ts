import { Node, NodeConnection } from './studio.type';

export type ClipboardItem = {
  type: 'nodes';
  nodes: Node[];
  connections: NodeConnection[];
};
