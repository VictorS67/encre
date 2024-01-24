import { HTMLAttributes } from 'react';

import { NodeConnection } from './nodeconnection.type';

export type VisualInfo = {
  position: {
    x: number;
    y: number;
    zIndex: number;
  };
  size: {
    width: number;
    height: number;
  };
};

export type Node = {
  id: string;
  state: 'init' | 'pending' | 'success' | 'failed';
  isDebug: boolean;
  visualInfo: VisualInfo;
};

export type DraggableNodeProps = {
  node: Node;
  connections?: NodeConnection[];
  canvasZoom: number;
  isMinimized?: boolean;
  isSelecting?: boolean;
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
};

export type VisualNodeProps = {
  node: Node;
  connections?: NodeConnection[];
  xDelta?: number;
  yDelta?: number;
  attributes?: HTMLAttributes<HTMLDivElement>;
  attributeListeners?: HTMLAttributes<HTMLDivElement>;
  isDragging?: boolean;
  isMinimized?: boolean;
  isSelecting?: boolean;
  scale?: number;
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
};

export type MinimizedVisualNodeContentProps = {
  node: Node;
  connections?: NodeConnection[];
  attributeListeners?: HTMLAttributes<HTMLDivElement>;
  onNodeGrabClick?: (event: React.MouseEvent<HTMLElement>) => void;
};

export type VisualNodeContentProps = {
  node: Node;
  connections?: NodeConnection[];
  attributeListeners?: HTMLAttributes<HTMLDivElement>;
  onNodeGrabClick?: (event: React.MouseEvent<HTMLElement>) => void;
};
