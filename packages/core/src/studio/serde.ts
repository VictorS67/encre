import { RecordId } from '../load/keymap.js';
import { Serialized } from '../load/serializable';
import { NodePortFields, NodePortSizes } from './nodes/index.js';

export type SerializedGraph = {
  _type: 'graph',
  id: RecordId;
  title: string;
  description: string;
  nodes: SerializedNode[];
};

export type SerializedNode = {
  _type: 'node',
  id: RecordId;
  type: string;
  subType: string;
  registerArgs?: Record<string, unknown>;
  title: string;
  description: string;
  runtime: number;
  memory: number;
  data: Serialized;
  visualInfo: {
    position: {
      x: number;
      y: number;
      zIndex?: number;
    };
    size: {
      width: number;
      height: number;
    };
  };
  inputs: NodePortFields | undefined;
  outputs: NodePortFields | undefined;
  outputSizes?: NodePortSizes | undefined;
  outgoingConnections: {
    [key in string]: {
      toNodeId: RecordId;
      toPortName: string;
    };
  };
};