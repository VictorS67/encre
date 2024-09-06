import { HTMLAttributes } from 'react';

import { ColorCache } from './canvas.type';
import { RecordId, Node, NodeConnection } from './studio.type';
import { DraggingWire } from './wire.type';

export type DraggableNodeProps = {
  node: Node;
  // nodeColorCache: ColorCache;
  connections?: NodeConnection[];
  canvasZoom: number;
  isMinimized?: boolean;
  isSelecting?: boolean;
  isPinning?: boolean;
  isCollapsed?: boolean;
  onNodeSizeChange?: (node: Node, width?: number, height?: number) => void;
  onNodeVisualContentChange?: (
    node: Node,
    content: Node['visualInfo']['content'],
  ) => void;
  onNodeSelect?: (node: Node) => void;
  onNodeMouseOver?: (
    event: React.MouseEvent<HTMLElement>,
    nodeId: RecordId,
  ) => void;
  onNodeMouseOut?: (
    event: React.MouseEvent<HTMLElement>,
    nodeId: RecordId,
  ) => void;
  onWireStartDrag?: (
    event: React.MouseEvent<HTMLElement>,
    fromNodeId: RecordId,
    fromPortName: string,
    isInput?: boolean,
  ) => void;
  onWireEndDrag?: (event: React.MouseEvent<HTMLElement>) => void;
};

export type VisualNodeProps = {
  node: Node;
  // nodeColorCache: ColorCache;
  connections?: NodeConnection[];
  xDelta?: number;
  yDelta?: number;
  attributes?: HTMLAttributes<HTMLDivElement>;
  attributeListeners?: HTMLAttributes<HTMLDivElement>;
  isDragging?: boolean;
  isOverlay?: boolean;
  isMinimized?: boolean;
  isSelecting?: boolean;
  isPinning?: boolean;
  isCollapsed?: boolean;
  scale?: number;
  canvasZoom: number;
  onNodeSizeChange?: (width?: number, height?: number) => void;
  onNodeVisualContentChange?: (content: Node['visualInfo']['content']) => void;
  onNodeSelect?: () => void;
  onNodeMouseOver?: (
    event: React.MouseEvent<HTMLElement>,
    nodeId: RecordId,
  ) => void;
  onNodeMouseOut?: (
    event: React.MouseEvent<HTMLElement>,
    nodeId: RecordId,
  ) => void;
  onWireStartDrag?: (
    event: React.MouseEvent<HTMLElement>,
    fromNodeId: RecordId,
    fromPortName: string,
    isInput?: boolean,
  ) => void;
  onWireEndDrag?: (event: React.MouseEvent<HTMLElement>) => void;
};

export type MinimizedVisualNodeContentProps = {
  node: Node;
  connections?: NodeConnection[];
  attributeListeners?: HTMLAttributes<HTMLDivElement>;
  canvasZoom: number;
  onNodeGrabClick?: (event: React.MouseEvent<HTMLElement>) => void;
};

export type VisualNodeContentProps = {
  node: Node;
  connections?: NodeConnection[];
  isMinimized?: boolean;
  isPinning?: boolean;
  isCollapsed?: boolean;
  canvasZoom: number;
  attributeListeners?: HTMLAttributes<HTMLDivElement>;
  onNodeGrabClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onNodeSizeChange?: (width?: number, height?: number) => void;
  onWireStartDrag?: (
    event: React.MouseEvent<HTMLElement>,
    fromNodeId: RecordId,
    fromPortName: string,
    isInput?: boolean,
  ) => void;
  onWireEndDrag?: (event: React.MouseEvent<HTMLElement>) => void;
};

export interface HeightCache {
  get: (id: string) => number;

  has: (id: string) => boolean;

  set: (id: string, height: number) => void;
}

export type NodeVisualContentData = {
  color?: string;
};
