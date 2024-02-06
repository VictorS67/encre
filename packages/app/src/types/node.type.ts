import { HTMLAttributes } from 'react';

import { NodeConnection } from './nodeconnection.type';
import { NodeContentType } from './nodecontent.type';

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

// TODO: modify this based on the workflow file.
export type NodeMetadata = {
  name: string;
  abbreviation: string;
  tags?: Array<string>;
  inputs?: Array<string>;
  outputs?: Array<string>;
};

export type Node = {
  id: string;
  state: 'init' | 'pending' | 'success' | 'failed';
  isDebug: boolean;
  visualInfo: VisualInfo;
  metadata: NodeMetadata;
  type?: NodeContentType;
  content?: Record<string, unknown> | Array<unknown> | unknown;
};

export type DraggableNodeProps = {
  node: Node;
  connections?: NodeConnection[];
  canvasZoom: number;
  isKnownType?: boolean;
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
  isKnownType?: boolean;
  isDragging?: boolean;
  isMinimized?: boolean;
  isSelecting?: boolean;
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
  isKnownType?: boolean;
  isMinimized?: boolean;
  canvasZoom: number;
  attributeListeners?: HTMLAttributes<HTMLDivElement>;
  onNodeGrabClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onNodeSizeChange?: (width: number, height: number) => void;
};
