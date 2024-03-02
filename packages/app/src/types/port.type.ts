import {
  Node,
  NodeConnection,
  NodeInputPortDef,
  NodeOutputPortDef,
} from './studio.type';

export type PortProps = {
  nodeId: string;
  key: string;
  title: string;
  definition: NodeInputPortDef | NodeOutputPortDef;
  isInput?: boolean;
  isConnected?: boolean;
};

export type NodePortGroupProps = {
  node: Node;
  connections: NodeConnection[];
  nodeWidth: number;
};
