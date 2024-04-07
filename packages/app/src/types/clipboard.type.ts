import { GraphComment, Node, NodeConnection } from './studio.type';

export type ClipboardNodesItem = {
  type: 'nodes';
  nodes: Node[];
  connections: NodeConnection[];
};

export type ClipboardCommentsItem = {
  type: 'comments';
  comments: GraphComment[];
};

export type ClipboardItem = ClipboardNodesItem | ClipboardCommentsItem;
