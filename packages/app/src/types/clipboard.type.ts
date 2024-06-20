import { GraphComment } from '@encrejs/core/studio/comments';
import {
  SerializableNode as Node,
  NodeConnection,
} from '@encrejs/core/studio/nodes';

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
