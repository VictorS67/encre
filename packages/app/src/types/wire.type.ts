import { CSSProperties } from 'react';

import { PartialConnection } from './nodeconnection.type';
import { HighlightedPort, PortPositons } from './port.type';
import { Data, DataType, Node, NodeConnection, ValueOf } from './studio.type';

export type Wire = {
  fromNodeId: string;
  fromPortName: string;
  fromPortIsInput: boolean;

  toNodeId?: string;
  toPortName?: string;
};

export type DraggingWire = Wire & {
  readonly dataType: DataType | Readonly<DataType[]>;
};

export type WireData = {
  wireType: WireType;
  wireOptions?: WireOptions;
};

export type WireLayerProps = {
  connections: NodeConnection[];
  portPositions: PortPositons;
  draggingWire?: Wire;
  isDraggingFromNode?: boolean;
  highlightedNodeIds?: string[];
  highlightedPort?: HighlightedPort;
  // selectingWireIds?: string[];
  onWiresSelect?: (wireId: string[], isMulti?: boolean) => void;
};

export type RenderedWireProps = {
  connection: NodeConnection;
  nodeMap: Record<string, Node>;
  portPositions: PortPositons;
  isSelecting?: boolean;
  isHighlighted?: boolean;
  isHoveringPort?: boolean;
};

export type PartialWireProps = {
  connection: PartialConnection;
  portPositions: PortPositons;
};

export type WireControlProps = {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isSelecting?: boolean;
  isHighlighted?: boolean;
  isHoveringPort?: boolean;
};

export type WireProps<T extends WireOptions['type']> = {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isSelecting?: boolean;
  isHighlighted?: boolean;
  isHoveringPort?: boolean;
  wireOptions?: Extract<WireOptions, { type: T }>;
};

export type StraightWireProps = WireProps<StraightWireOptions['type']>;

export type BezierWireProps = WireProps<BezierWireOptions['type']>;

export type AdaptiveBezierWireProps = WireProps<
  AdaptiveBezierWireOptions['type']
>;

export type SmoothStepWireProps = WireProps<SmoothStepWireOptions['type']>;

// TODO: think about how to add labels to the wire
export type BaseWireProps = {
  id: string;
  path: string;
  center?: {
    centerX: number;
    centerY: number;
  };
  wireStyle?: CSSProperties;
  interactionWidth?: number;
  startMarker?: string;
  endMarker?: string;
  isSelecting?: boolean;
  isHighlighted?: boolean;
  isHoveringPort?: boolean;
  className?: string;
};

export type StraightWireOptions = {
  type: 'straight';
};

export type BezierWireOptions = {
  type: 'bezier';
  curvature?: number;
};

export type AdaptiveBezierWireOptions = {
  type: 'adaptive-bezier';
};

export type SmoothStepWireOptions = {
  type: 'smooth-step';
  borderRadius?: number;
  offset?: number;
};

export type WireOptions =
  | StraightWireOptions
  | BezierWireOptions
  | AdaptiveBezierWireOptions
  | SmoothStepWireOptions;

export type WireType = WireOptions['type'];

export type DefaultWireOptions = {
  [K in WireOptions['type']]: Extract<WireOptions, { type: K }>;
};
