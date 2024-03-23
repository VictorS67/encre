import { HTMLAttributes } from 'react';

import {
  DataType,
  Node,
  NodeConnection,
  NodeInputPortDef,
  NodeOutputPortDef,
} from './studio.type';
import { DraggingWire } from './wire.type';

export type DraggingWireClosestPort = {
  nodeId: string;
  portName: string;
  input: NodeInputPortDef;
  portEl: HTMLElement;
};

export type HighlightedPort = {
  nodeId: string;
  portName: string;
  definition: NodeInputPortDef | NodeOutputPortDef;
  isInput?: boolean;
};

export type PortPositons = Record<string, { x: number; y: number }>;

export type PortProps = {
  nodeId: string;
  title: string;
  definition: NodeInputPortDef | NodeOutputPortDef;
  attributeListeners?: HTMLAttributes<HTMLDivElement>;
  draggingDataType?: DataType | Readonly<DataType[]>;
  isDragToEnabled?: boolean;
  isClosestPortToWire?: boolean;
  isInput?: boolean;
  isConnected?: boolean;
  onMouseDown?: (
    e: React.MouseEvent<HTMLDivElement>,
    portName: string,
    isInput?: boolean,
  ) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLDivElement>, portName: string) => void;
};

export type NodePortGroupProps = {
  node: Node;
  connections: NodeConnection[];
  nodeWidth: number;
  attributeListeners?: HTMLAttributes<HTMLDivElement>;
  draggingWire?: DraggingWire;
  draggingWireClosestPort?: DraggingWireClosestPort;
  onWireStartDrag?: (
    event: React.MouseEvent<HTMLElement>,
    fromNodeId: string,
    fromPortName: string,
    isInput?: boolean,
  ) => void;
  onWireEndDrag?: (event: React.MouseEvent<HTMLElement>) => void;
};

export type WirePortProps = {
  id: string;
  centerX: number;
  centerY: number;
  isHighlighted?: boolean;
  isHoveringPort?: boolean;
  radius?: number;
  strokeWidth?: number;
  onMouseDown?: (e: React.MouseEvent) => void;
};
