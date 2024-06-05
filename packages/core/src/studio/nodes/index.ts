import { RecordId } from '../../load/keymap.js';
import { Serializable } from '../../load/serializable.js';
import { Callable } from '../../record/callable.js';
import { DataType, ValueOf } from '../data.js';
import { UIContext } from '../ui.js';

export type NodePortFields = {
  [key: string]: DataType | Readonly<DataType[]>;
};

export type NodePortSizes = {
  [key: string]: number;
}

export interface BaseNode {
  id: RecordId;

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
    content?: {
      color?:
      | 'red'
      | 'orange'
      | 'gold'
      | 'yellow'
      | 'palmera'
      | 'green'
      | 'meadow'
      | 'cyan'
      | 'blue'
      | 'cornflower'
      | 'purple'
      | 'pink'
      | 'razzmatazz'
      | 'silver'
      | 'dark';
    }
  };

  inputs: NodePortFields | undefined;

  outputs: NodePortFields | undefined;

  title?: string | undefined;

  description?: string | undefined;

  // data size for each output port, default is 0
  outputSizes?: NodePortSizes | undefined;
}

export interface SerializableNode<
  NodeType extends string = string,
  NodeData extends Serializable = Serializable,
> extends BaseNode {
  type: NodeType;

  subType: string;

  registerArgs?: Record<string, unknown>;

  // runtime per process, default is 0
  runtime?: number;

  // RAM used per process, default is 0
  memory?: number;

  data: NodeData;
}

export interface CallableNode<
  NodeType extends string = string,
  NodeData extends Callable = Callable,
> extends SerializableNode<NodeType, NodeData> {}

export type NodePortDef = NodeInputPortDef | NodeOutputPortDef;

export type NodeInputPortDef = {
  nodeId: RecordId;

  name: string;

  type: DataType | Readonly<DataType[]>;

  required?: boolean;

  data?: ValueOf<DataType> | Readonly<ValueOf<DataType>[]>;

  default?: unknown;
};

export type NodeOutputPortDef = {
  nodeId: RecordId;

  name: string;

  type: DataType | Readonly<DataType[]>;

  required?: boolean;

  data?: ValueOf<DataType> | Readonly<ValueOf<DataType>[]>;

  default?: unknown;
};

/**
 * A.portA ---> B.portB
 * 
 * fromNodeId: A
 * fromPortName: portA
 * toNodeId: B
 * toPortName: portB
 */
export type NodeConnection = {
  fromNodeId: RecordId;

  fromPortName: string;

  toNodeId: RecordId;

  toPortName: string;
};

export type NodeBody =
  | string
  | UIContext
  | UIContext[]
  | undefined;
