import { Node, NodeConnection } from './studio.type';

export type CanvasPosition = {
  x: number;
  y: number;
  zoom: number;
};

export type MousePosition = {
  x: number;
  y: number;
};

export type CanvasViewBounds = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type NodeCanvasProps = {
  nodes: Node[];
  connections: NodeConnection[];
  onNodesChange: (newNodes: Node[]) => void;
  onConnectionsChange: (newConnections: NodeConnection[]) => void;
  onNodesSelect: (newNodes: Node[]) => void;
};
