import { HTMLAttributes } from 'react';

import { Node, NodeConnection } from './studio.type';
import { DraggingWire } from './wire.type';

export type DraggableNodeProps = {
  node: Node;
  connections?: NodeConnection[];
  canvasZoom: number;
  isMinimized?: boolean;
  isSelecting?: boolean;
  isPinning?: boolean;
  onNodeSizeChange?: (node: Node, width: number, height: number) => void;
  onNodeSelect?: (node: Node) => void;
  onNodeMouseOver?: (
    event: React.MouseEvent<HTMLElement>,
    nodeId: string,
  ) => void;
  onNodeMouseOut?: (
    event: React.MouseEvent<HTMLElement>,
    nodeId: string,
  ) => void;
  onWireStartDrag?: (
    event: React.MouseEvent<HTMLElement>,
    fromNodeId: string,
    fromPortName: string,
    isInput?: boolean,
  ) => void;
  onWireEndDrag?: (event: React.MouseEvent<HTMLElement>) => void;
};

export type VisualNodeProps = {
  node: Node;
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
  scale?: number;
  canvasZoom: number;
  onNodeSizeChange?: (width: number, height: number) => void;
  onNodeSelect?: () => void;
  onNodeMouseOver?: (
    event: React.MouseEvent<HTMLElement>,
    nodeId: string,
  ) => void;
  onNodeMouseOut?: (
    event: React.MouseEvent<HTMLElement>,
    nodeId: string,
  ) => void;
  onWireStartDrag?: (
    event: React.MouseEvent<HTMLElement>,
    fromNodeId: string,
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
  canvasZoom: number;
  attributeListeners?: HTMLAttributes<HTMLDivElement>;
  onNodeGrabClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onNodeSizeChange?: (width: number, height: number) => void;
  onWireStartDrag?: (
    event: React.MouseEvent<HTMLElement>,
    fromNodeId: string,
    fromPortName: string,
    isInput?: boolean,
  ) => void;
  onWireEndDrag?: (event: React.MouseEvent<HTMLElement>) => void;
};
