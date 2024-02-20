import { RecordId } from '../../load/keymap.js';
import { Serializable } from '../../load/serializable.js';
import { Callable } from '../../record/callable.js';
import { DataType, ValueOf } from '../data.js';
import { UIContext } from '../ui.js';

export type NodePortFields = {
  [key: string]: DataType | Readonly<DataType[]>;
};

export interface BaseNode {
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
}

export interface SerializableNode<
  NodeType extends string = string,
  NodeData extends Serializable = Serializable,
> extends BaseNode {
  type: NodeType;

  subType: string;

  data: NodeData;
}

export interface CallableNode<
  NodeType extends string = string,
  NodeData extends Callable = Callable,
> extends SerializableNode<NodeType, NodeData> {}

export type NodeInputPortDef = {
  id: RecordId;

  name: string;

  type: DataType | Readonly<DataType[]>;

  data?: ValueOf<DataType> | Readonly<ValueOf<DataType>[]>;

  default?: unknown;
};

export type NodeOutputPortDef = {
  id: RecordId;

  name: string;

  type: DataType | Readonly<DataType[]>;

  data?: ValueOf<DataType> | Readonly<ValueOf<DataType>[]>;

  default?: unknown;
};

export type NodeConnection = {
  inputNodeId: RecordId;

  inputId: RecordId;

  outputNodeId: RecordId;

  outputId: RecordId;
};

export type NodeBody =
  | string
  | UIContext
  | UIContext[]
  | undefined;
