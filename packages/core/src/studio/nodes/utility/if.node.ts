import { BaseRuleCollection } from '../../../events/input/load/rules/base.js';
import { load } from '../../../load/index.js';
import { RecordId } from '../../../load/keymap.js';
import {
  globalImportMap,
  globalSecretMap,
} from '../../../load/registration.js';
import { SerializedConstructor } from '../../../load/serializable.js';
import { getRecordId } from '../../../utils/nanoid.js';
import { isNotNull } from '../../../utils/safeTypes.js';
import {
  BaseIfCondition,
  ConditionFieldVariables,
  IfCondition,
  IfConditionOptions,
  IfConditionSource,
  IfConditionTarget,
} from '../../condition.js';
import { DataType, dataTypes } from '../../data.js';
import {
  ProcessInputMap,
  ProcessContext,
  ProcessOutputMap,
} from '../../processor.js';
import { GuardrailRegistration } from '../../registration/guardrails.js';
import { NodeRegistration } from '../../registration/nodes.js';
import { SerializedNode } from '../../serde.js';
import { UIContext } from '../../ui.js';
import { coerceToData } from '../../utils/coerce.js';
import { displayConditionUI } from '../../utils/display.js';
import { CallableNodeImpl } from '../base.js';
import {
  CallableNode,
  NodeBody,
  NodeConnection,
  NodeInputPortDef,
  NodeOutputPortDef,
  NodePortFields,
  SerializableNode,
} from '../index.js';

export type IfNode = CallableNode<'if', BaseIfCondition>;

export abstract class IfNodeImpl extends CallableNodeImpl<IfNode> {
  async getBody(): Promise<NodeBody> {
    const conditionUIContexts: UIContext[] = await displayConditionUI(
      this.data.sources,
      this.data.actions
    );

    return conditionUIContexts;
  }
}

export class IfConditionNodeImpl extends IfNodeImpl {
  set inputs(newVal: NodePortFields | undefined) {
    this.node.inputs = newVal;
  }

  set outputs(newVal: NodePortFields | undefined) {
    this.node.outputs = newVal;
  }

  getInputPortDefs(
    connections: NodeConnection[],
    nodeMap: Record<RecordId, SerializableNode>
  ): NodeInputPortDef[] {
    return Object.keys(this.inputs ?? {}).map((key: string) => {
      const possibleTypes = connections
        .filter(
          (c) =>
            c.toNodeId === this.id &&
            c.toPortName === key &&
            isNotNull(nodeMap[c.fromNodeId])
        )
        .map((c) => {
          const node: SerializableNode = nodeMap[c.fromNodeId];

          return Object.values(node.outputs ?? {}).flat();
        })
        .flat();

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
        name: key,
        type: possibleTypes,
      };
    });
  }

  getOutputPortDefs(
    connections: NodeConnection[],
    nodeMap: Record<RecordId, SerializableNode>
  ): NodeOutputPortDef[] {
    return Object.keys(this.outputs ?? {}).map((key: string) => {
      const possibleTypes = connections
        .filter(
          (c) =>
            c.fromNodeId === this.id &&
            c.fromPortName === key &&
            isNotNull(nodeMap[c.toNodeId])
        )
        .map((c) => {
          const node: SerializableNode = nodeMap[c.toNodeId];

          return Object.values(node.inputs ?? {}).flat();
        })
        .flat();

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
        name: key,
        type: possibleTypes,
      };
    });
  }

  addInputPort(): string {
    if (this.inputs === undefined) {
      this.inputs = {};
    }

    const newName: string = this._getNewPortName();
    this.inputs[newName] = dataTypes;

    this.data.sources = [...this.data.sources, newName];

    return newName;
  }

  addOutputPort(): string {
    if (this.outputs === undefined) {
      this.outputs = {};
    }

    const newName: string = this._getNewPortName();
    this.outputs[newName] = dataTypes;

    this.data.targets = [...this.data.targets, newName];
    this.data.actions[newName] = [
      {
        type: 'if',
        ruleCollection: new BaseRuleCollection({
          collection: {},
        }),
      },
    ];

    return newName;
  }

  removeInputPort(inputPortName: string): boolean {
    if (!this.inputs || !this.inputs[inputPortName]) {
      return false;
    }

    delete this.inputs[inputPortName];
    this.data.sources = this.data.sources.filter((s) => s !== inputPortName);

    return true;
  }

  removeOutputPort(outputPortName: string): boolean {
    if (!this.outputs || !this.outputs[outputPortName]) {
      return false;
    }

    delete this.outputs[outputPortName];
    this.data.targets = this.data.targets.filter((t) => t !== outputPortName);

    return this.data.removeAction(outputPortName);
  }

  static nodeFrom(callable: IfCondition): IfNode {
    return {
      id: getRecordId(),
      type: 'if',
      subType: 'condition',
      data: callable,
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
      inputs: callable.sources.reduce(
        (acc, source) => {
          acc[source] = dataTypes;
          return acc;
        },
        {} as Record<string, DataType | Readonly<DataType[]>>
      ),
      outputs: callable.targets.reduce(
        (acc, target) => {
          acc[target] = dataTypes;
          return acc;
        },
        {} as Record<string, DataType | Readonly<DataType[]>>
      ),
    };
  }

  static create(): IfNode {
    const ifCondition = new IfCondition({
      sources: ['A'],
      targets: ['B'],
      actions: {
        B: [
          {
            type: 'if',
            ruleCollection: new BaseRuleCollection({
              collection: {},
            }),
          },
        ],
      },
    });

    const node: IfNode = IfConditionNodeImpl.nodeFrom(ifCondition);

    return node;
  }

  static async deserialize(
    serialized: SerializedNode,
    values: Record<string, unknown> = {},
    registry?: {
      nodes?: NodeRegistration;
      guardrails?: GuardrailRegistration;
    }
  ): Promise<IfNode> {
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

    if (type !== 'if') {
      throw new Error(`CANNOT deserialize this type in if node: ${type}`);
    }

    (data as SerializedConstructor)._kwargs['registry'] = registry?.guardrails;
    const ifConditionStr = JSON.stringify(data);
    const ifCondition = await load<IfCondition>(
      ifConditionStr,
      globalSecretMap,
      globalImportMap
    );

    return {
      id,
      type,
      subType,
      registerArgs,
      data: ifCondition,
      visualInfo,
      inputs,
      outputs,
      runtime,
      memory,
      outputSizes,
    };
  }

  protected async _preprocess(
    inputs: ProcessInputMap,
    context: ProcessContext
  ): Promise<{
    inputs: {
      [source: string]: unknown;
    };
    variables?: {
      [target: string]: (ConditionFieldVariables | undefined)[];
    };
  }> {
    return {
      inputs: Object.fromEntries(
        Object.entries(inputs).map(([source, data]) => [
          source,
          data ? data.value : undefined,
        ])
      ),
      variables: context.memory?.[this.id] as any,
    };
  }

  protected async _postprocess(
    rawOutputs: IfConditionTarget,
    context: ProcessContext
  ): Promise<ProcessOutputMap> {
    return Object.fromEntries(
      Object.entries(rawOutputs).map(([k, v]) => [
        k,
        v ? coerceToData(v) : undefined,
      ])
    );
  }

  async invoke<CallInput, CallOutput, CallOptions>(
    input: CallInput,
    options?: Partial<CallOptions> | undefined
  ): Promise<CallOutput> {
    if (!this.data.isIfConditionSource(input)) {
      throw new Error(
        `${this.type} Node ${this.title} failed in invoke because of invalid inputs.`
      );
    }

    return this.data.invoke(input, options) as CallOutput;
  }

  async process(
    inputs: ProcessInputMap,
    context: ProcessContext
  ): Promise<ProcessOutputMap> {
    if (!this.validateInputs(inputs)) {
      throw new Error(`${this.type} Node ${this.title} has invalid inputs`);
    }

    const { inputs: rawInputs, variables } = await this._preprocess(
      inputs,
      context
    );

    const rawOutputs = await this.invoke<
      IfConditionSource,
      IfConditionTarget,
      IfConditionOptions
    >(rawInputs, { variables });

    return this._postprocess(rawOutputs, context);
  }

  private _getNewPortName(): string {
    const existingPortNames: string[] = Object.keys(this.inputs ?? {}).concat(
      Object.keys(this.outputs ?? {})
    );
    const pivotIndex: number = existingPortNames.length;

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const baseIndex = pivotIndex % 26;
    let baseSuffix = Math.floor(pivotIndex / 26);

    // Function to check uniqueness and form the element with suffix
    const formElement = (index: number, suffix: number) =>
      suffix > 0 ? `${alphabet[index]}${suffix - 1}` : alphabet[index];

    // Check if an element is unique
    const isUnique = (element: string) => !existingPortNames.includes(element);

    // Start checking at the pivot and expand outwards
    let range = 0;
    for (;;) {
      // Check 'left' from the base (going back in the alphabet)
      const leftIndex = baseIndex - range;
      const rightIndex = baseIndex + range;

      // Check within valid alphabet bounds
      if (leftIndex >= 0) {
        const leftElement = formElement(leftIndex, baseSuffix);
        if (isUnique(leftElement)) return leftElement;
      }

      // Check 'right' from the base (going forward in the alphabet)
      if (rightIndex < 26) {
        const rightElement = formElement(rightIndex, baseSuffix);
        if (isUnique(rightElement)) return rightElement;
      }

      // If no valid element found within the current suffix, increase range
      if (leftIndex < 0 && rightIndex >= 26) {
        baseSuffix++; // Increase suffix when all alphabet has been checked
        range = 0; // Reset range to start from the new base
      } else {
        range++;
      }
    }
  }
}
