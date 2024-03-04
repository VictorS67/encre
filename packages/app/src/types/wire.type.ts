import { PartialConnection } from './nodeconnection.type';
import { HighlightedPort, PortPositons } from './port.type';
import { DataType, Node, NodeConnection, ValueOf } from './studio.type';

export type Wire = {
  fromNodeId: string;
  fromPortName: string;

  toNodeId?: string;
  toPortName?: string;
};

export type DraggingWire = Wire & {
  readonly dataType: DataType | Readonly<DataType[]>;
};

export type WireLayerProps = {
  connections: NodeConnection[];
  portPositions: PortPositons;
  draggingWire?: Wire;
  isDraggingFromNode?: boolean;
  highlightedNodeIds?: string[];
  highlightedPort?: HighlightedPort;
};

export type RenderedWireProps = {
  connection: NodeConnection;
  nodeMap: Record<string, Node>;
  portPositions: PortPositons;
  isSelected?: boolean;
  isHighlighted?: boolean;
};

export type PartialWireProps = {
  connection: PartialConnection;
  portPositions: PortPositons;
};

export type WireProps = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isSelected?: boolean;
  isHighlighted?: boolean;
};
