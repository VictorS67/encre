import {
  ContextMenuConfigContext,
  ContextMenuConfigContextData,
} from './contextmenu.type';
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
  onNodesSelect: (newNodes: Node[], isMulti?: boolean) => void;
  onWiresSelect: (newWireIds: string[], isMulti?: boolean) => void;
  onContextMenuSelect?: (
    menuItemId: string,
    context: ContextMenuConfigContextData,
    meta: { x: number; y: number },
    data: unknown,
  ) => void;
};
