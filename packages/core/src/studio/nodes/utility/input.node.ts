import { load } from '../../../load/index.js';
import { type RecordId } from '../../../load/keymap.js';
import { globalImportMap, globalSecretMap } from '../../../load/registration.js';
import { getRecordId } from '../../../utils/nanoid.js';
import { isNotNull } from '../../../utils/safeTypes.js';
import {
  type DataFields,
  type DataType,
  dataTypes,
  getDefaultValue,
} from '../../data.js';
import { BaseInput } from '../../input.js';
import {
  type ProcessInputMap,
  type ProcessContext,
  type ProcessOutputMap,
} from '../../processor.js';
import { type SerializedNode } from '../../serde.js';
import { displayUIFromDataFields } from '../../utils/display.js';
import { NodeImpl } from '../base.js';
import {
  type NodeBody,
  type NodeConnection,
  type NodeInputPortDef,
  type NodePortFields,
  type SerializableNode,
} from '../index.js';

/**
 * A type alias for a specialized node focused on input operations.
 * This node type is specialized for handling user or automated inputs, making it a
 * fundamental part of user-interactive or data-driven workflows.
 */
export type InputNode = SerializableNode<'input', BaseInput>;

/**
 * An implementation class for InputNode. This class extends the basic node implementation to provide
 * specialized functionalities for input handling. It supports dynamic definition of inputs and outputs
 * based on connected node configurations and the data types defined in the serialized data.
 *
 * ### Node Properties
 *
 * | Field       | Type           | Description                                                                  |
 * |-------------|----------------|------------------------------------------------------------------------------|
 * | `type`      | `'input'`      | Indicates the node's role in handling inputs.                                |
 * | `subtype`   | `'input'`      | Further specifies the nature of input handling, typically not varying much.  |
 * | `data`      | {@link BaseInput} | Encapsulates the data and configuration specific to input handling.       |
 *
 * ### Input Ports
 *
 * None in default. Input ports are dynamically configured based on the node's current connections and may vary.
 *
 * ### Output Ports
 *
 * Output ports in an input node are from `dataTypes` of {@link BaseInput}.
 *
 */
export class InputNodeImpl extends NodeImpl<InputNode> {
  /**
   * Sets new input definitions for the node. Allows dynamic configuration of node inputs based on external factors.
   * @param newVal A structure defining the input ports and their data types, or undefined to clear inputs.
   */
  set inputs(newVal: NodePortFields | undefined) {
    this.node.inputs = newVal;
  }

  /**
   * Factory method to create an InputNode from a serializable instance of BaseInput.
   * @param serializable An instance of BaseInput that defines the structure and capabilities of the input node.
   * @returns A fully configured InputNode.
   */
  static nodeFrom(serializable: BaseInput): InputNode {
    return {
      id: getRecordId(),
      type: 'input',
      subType: 'input',
      data: serializable,
      visualInfo: {
        position: {
          x: 0,
          y: 0,
        },
        size: {
          width: 300,
          height: 500,
        },
      },
      inputs: undefined,
      outputs: serializable.dataTypes,
    };
  }

  /**
   * Factory method to create a new instance of InputNode with default settings.
   * The instance is initialized with default data types for outputs, typically used at the start of node creation.
   *
   * @returns An instance of InputNode initialized with default settings for data inputs.
   */
  static create(): InputNode {
    const input = new BaseInput({
      dataTypes: {
        output: dataTypes,
      },
    });

    return InputNodeImpl.nodeFrom(input);
  }

  /**
   * Deserializes a serialized input node representation into an executable input node,
   * reconstituting the node with its operational parameters and data.
   *
   * @param serialized The serialized node data.
   * @returns A promise resolving to a deserialized input node.
   */
  static async deserialize(
    serialized: SerializedNode,
  ): Promise<InputNode> {
    const {
      id,
      type,
      subType,
      registerArgs,
      data,
      visualInfo,
      inputs,
      outputs,
      runtime,
      memory,
      outputSizes,
    } = serialized;

    if (type !== 'input') {
      throw new Error(`CANNOT deserialize this type in input node: ${type}`);
    }

    const userInputStr = JSON.stringify(data);
    const userInput = await load<BaseInput>(
      userInputStr,
      globalSecretMap,
      globalImportMap
    );

    return {
      id,
      type,
      subType,
      registerArgs,
      data: userInput,
      visualInfo,
      inputs,
      outputs,
      runtime,
      memory,
      outputSizes,
    };
  }

  /**
   * Derives the input port definitions based on connections to this node.
   * This method dynamically adjusts input ports based on the connected nodes and the data types they provide.
   *
   * @param connections Array of node connections that connect to this node.
   * @param nodeMap A mapping from node IDs to SerializableNode instances, to fetch output definitions.
   * @returns An array of input port definitions with potential data types they can accept.
   */
  getInputPortDefs(
    connections: NodeConnection[],
    nodeMap: Record<RecordId, SerializableNode>
  ): NodeInputPortDef[] {
    const fromConnections = connections.filter(
      (c: NodeConnection) =>
        c.toNodeId === this.id && isNotNull(nodeMap[c.fromNodeId])
    );

    const ports: Record<string, DataType | Readonly<DataType[]>> = {};

    for (const c of fromConnections) {
      const portName: string = c.toPortName;
      const node: SerializableNode = nodeMap[c.fromNodeId];
      const possibleType = node.outputs?.[c.fromPortName];

      const possibleTypes: DataType[] = possibleType 
        ? Array.isArray(possibleType)
          ? possibleType
          : [possibleType] 
        : [];

      if (portName in ports) {
        const dataTypes = Array.isArray(ports[portName])
          ? [...ports[portName], ...possibleTypes]
          : [ports[portName], ...possibleTypes];

        ports[portName] = [...new Set(dataTypes as DataType[])];
      } else {
        ports[portName] = possibleType ?? [];
      }
    }

    return Object.entries(ports).map(([k, v]) => {
      const possibleTypes: DataType[] = Array.isArray(v) ? v : [v];

      const unknownArrIndex = possibleTypes.indexOf('unknown[]');
      if (unknownArrIndex !== -1) {
        possibleTypes.splice(unknownArrIndex, 1);
        possibleTypes.push('unknown[]');
      }

      const unknownIndex = possibleTypes.indexOf('unknown');
      if (unknownIndex !== -1) {
        possibleTypes.splice(unknownIndex, 1);
        possibleTypes.push('unknown');
      }

      return {
        nodeId: this.id,
        name: k,
        type: possibleTypes,
      };
    });
  }

  /**
   * Processes inputs to produce outputs based on the current configuration of the node.
   * This method takes user inputs or automated inputs and generates outputs accordingly,
   * maintaining the state in `data`.
   *
   * @param inputs A map containing input data for the node.
   * @param context The processing context, providing additional data and operations for processing.
   * @returns A map of process outputs keyed by their output port names.
   */
  async process(
    inputs: ProcessInputMap | undefined,
    context: ProcessContext
  ): Promise<ProcessOutputMap> {
    const _inputs = inputs ?? {};

    // If inputs are presented, then it means user provide the input
    if (Object.keys(_inputs).length > 0) {
      const userInput: DataFields = {};

      for (const k of this.data.variables) {
        userInput[k] = _inputs[k];
      }

      this.data.data = userInput;
    }

    const output: ProcessOutputMap = {};

    for (const k of this.data.variables) {
      output[k] = this.data.data?.[k];
    }

    return output;
  }

  /**
   * Retrieves the body of the node, typically used for UI rendering or further processing.
   * @returns A promise that resolves to the node's body, suitable for rendering in UIs or other outputs.
   */
  async getBody(): Promise<NodeBody> {
    const dataFields: DataFields = Object.fromEntries(
      Object.entries(this.data.dataTypes).map(([k, v]) => [
        k,
        this.data.data?.[k] ?? Array.isArray(v)
          ? getDefaultValue(v[0] as DataType)
          : getDefaultValue(v as DataType),
      ])
    ) as DataFields;

    return displayUIFromDataFields(dataFields);
  }
}
