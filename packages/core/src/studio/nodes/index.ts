import { RecordId } from '../../load/keymap.js';
import { Serializable } from '../../load/serializable.js';
import { Callable } from '../../record/callable.js';
import { DataType, ValueOf } from '../data.js';
import { UIContext } from '../ui.js';

/**
 * Maps port names to their respective data types within a node.
 */
export type NodePortFields = {
  [key: string]: DataType | Readonly<DataType[]>;
};

/**
 * Maps port names to their respective data sizes, used to handle the flow or
 * limitations of data through each port.
 */
export type NodePortSizes = {
  [key: string]: number;
};

/**
 * Represents the basic structure of a node within a graphical or data flow environment.
 * This node carries both visual and functional properties.
 */
export interface BaseNode {
  /**
   * Unique identifier for the node.
   */
  id: RecordId;

  /**
   * Visual presentation details of the node, including position and size.
   */
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
    };
  };

  /**
   * Input ports for the node, mapping port names to data types.
   */
  inputs: NodePortFields | undefined;

  /**
   * Output ports for the node, mapping port names to data types.
   */
  outputs: NodePortFields | undefined;

  /**
   * Optional title for the node.
   */
  title?: string | undefined;

  /**
   * Optional description of the node's functionality.
   */
  description?: string | undefined;

  /**
   * Optional mapping of output ports to their respective data sizes.
   * Default is 0.
   */
  outputSizes?: NodePortSizes | undefined;
}

/**
 * Extends `BaseNode` to include serialization capabilities along with additional
 * runtime properties.
 */
export interface SerializableNode<
  NodeType extends string = string,
  NodeData extends Serializable = Serializable,
> extends BaseNode {
  /**
   * Type of the node, typically defining its category or functionality.
   */
  type: NodeType;

  /**
   * Subtype of the node, providing further specification within its type.
   */
  subType: string;

  /**
   * Optional arguments used to register or initialize the node.
   */
  registerArgs?: Record<string, unknown>;

  /**
   * Estimated runtime per process in milliseconds.
   */
  runtime?: number;

  /**
   * Estimated RAM usage per process in megabytes.
   */
  memory?: number;

  /**
   * Data associated with the node, which must be serializable.
   */
  data: NodeData;
}

/**
 * Specialized version of `SerializableNode` that represents nodes capable of performing
 * callable actions.
 */
export interface CallableNode<
  NodeType extends string = string,
  NodeData extends Callable = Callable,
> extends SerializableNode<NodeType, NodeData> {}

/**
 * Defines a node port, which can be either an input or output port, including details
 * about data types, requirements, and defaults.
 */
export type NodePortDef = NodeInputPortDef | NodeOutputPortDef;

/**
 * Defines the structure of an input port on a node. It specifies the port's data type,
 * requirements, and optional default values.
 */
export type NodeInputPortDef = {
  /**
   * Identifier for the node to which this port belongs.
   */
  nodeId: RecordId;

  /**
   * The name of the port.
   */
  name: string;

  /**
   * The data type or types that this port accepts.
   */
  type: DataType | Readonly<DataType[]>;

  /**
   * Indicates whether this port must be connected.
   */
  required?: boolean;

  /**
   * Stored data that can be provided to the port.
   */
  data?: ValueOf<DataType> | Readonly<ValueOf<DataType>[]>;

  /**
   * A default value for the port, used if no input is provided.
   */
  default?: unknown;
};

/**
 * Defines the structure of an output port on a node. It details the port's data type,
 * optional requirements, and possible default values.
 */
export type NodeOutputPortDef = {
  /**
   * Identifier for the node to which this port belongs.
   */
  nodeId: RecordId;

  /**
   * The name of the port.
   */
  name: string;

  /**
   * The data type or types that this port outputs.
   */
  type: DataType | Readonly<DataType[]>;

  /**
   * Indicates whether this port must be connected.
   */
  required?: boolean;

  /**
   * Stored data associated with the port, potentially for initial output or defaults.
   */
  data?: ValueOf<DataType> | Readonly<ValueOf<DataType>[]>;

  /**
   * A default value for the port, used if the output is unspecified.
   */
  default?: unknown;
};

/**
 * Represents a connection between two node ports, specifying the source and destination nodes
 * and ports.
 * 
 * For example, we have connection: A.portA ---> B.portB
 *
 * Then, we should have:
 * - fromNodeId: A
 * - fromPortName: portA
 * - toNodeId: B
 * - toPortName: portB
 */
export type NodeConnection = {
  /**
   * The identifier of the node from which the connection originates.
   */
  fromNodeId: RecordId;

  /**
   * The name of the port from which the connection originates.
   */
  fromPortName: string;

  /**
   * The identifier of the node to which the connection is made.
   */
  toNodeId: RecordId;

  /**
   * The name of the port to which the connection is made.
   */
  toPortName: string;
};

/**
 * Represents various forms of body content that can be associated with a node,
 * such as strings or UI context objects.
 */
export type NodeBody = string | UIContext | UIContext[] | undefined;
