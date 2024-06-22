import { GraphComment } from '@encrejs/core';
import { SerializableNode as Node, NodeConnection } from '@encrejs/core';

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
