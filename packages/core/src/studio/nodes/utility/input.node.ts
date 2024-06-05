import { RecordId } from '../../../load/keymap.js';
import { getRecordId } from '../../../utils/nanoid.js';
import { isNotNull } from '../../../utils/safeTypes.js';
import {
  DataFields,
  DataType,
  dataTypes,
  getDefaultValue,
} from '../../data.js';
import { BaseInput } from '../../input.js';
import {
  ProcessInputMap,
  ProcessContext,
  ProcessOutputMap,
} from '../../processor.js';
import { displayUIFromDataFields } from '../../utils/display.js';
import { NodeImpl } from '../base.js';
import {
  NodeBody,
  NodeConnection,
  NodeInputPortDef,
  NodePortFields,
  SerializableNode,
} from '../index.js';

export type InputNode = SerializableNode<'input', BaseInput>;

export class InputNodeImpl extends NodeImpl<InputNode> {
  set inputs(newVal: NodePortFields | undefined) {
    this.node.inputs = newVal;
  }

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

  static create(): InputNode {
    const input = new BaseInput({
      dataTypes: {
        output: dataTypes,
      },
    });

    return InputNodeImpl.nodeFrom(input);
  }

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

      const possibleTypes: DataType[] = Array.isArray(possibleType)
        ? possibleType
        : [possibleType];

      if (portName in ports) {
        const dataTypes: DataType[] = Array.isArray(ports[portName])
          ? [...ports[portName], ...possibleTypes]
          : [ports[portName], ...possibleTypes];

        ports[portName] = [...new Set(dataTypes)];
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

  async process(
    inputs: ProcessInputMap,
    context: ProcessContext
  ): Promise<ProcessOutputMap> {
    // If inputs are presented, then it means user provide the input
    if (Object.keys(inputs).length > 0) {
      const userInput: DataFields = {};

      for (const k of this.data.variables) {
        userInput[k] = inputs[k];
      }

      this.data.data = userInput;
    }

    const output: ProcessOutputMap = {};

    for (const k of this.data.variables) {
      output[k] = this.data.data?.[k];
    }

    return output;
  }

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
