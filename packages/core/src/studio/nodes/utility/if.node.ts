import { BaseRuleCollection } from '../../../events/input/load/rules/base.js';
import { load } from '../../../load/index.js';
import { RecordId } from '../../../load/keymap.js';
import {
  // globalImportMap,
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

/**
 * A type alias for a specialized callable node focused on conditional logic operations.
 * This node type is designed to handle dynamic decision-making based on inputs,
 * typically used in flow control within systems.
 */
export type IfNode = CallableNode<'if', BaseIfCondition>;

/**
 * An abstract class providing a base implementation for conditional nodes.
 * This class extends the callable node implementation to provide specialized functionalities
 * for handling conditions based on configured rules and actions.
 */
export abstract class IfNodeImpl extends CallableNodeImpl<IfNode> {
  /**
   * Deserializes a serialized if node representation into an executable if node,
   * reconstituting the node with its operational parameters and data.
   *
   * @param serialized The serialized node data.
   * @param values Additional values that might be used during deserialization.
   * @param registry Optional registry containing additional configurations such as node types and guardrails.
   * @returns A promise resolving to a deserialized if node.
   * @throws Error if the node type is not compatible with if operations.
   */
  static async deserialize(
    serialized: SerializedNode,
    values: Record<string, unknown> = {},
    registry?: {
      nodes?: NodeRegistration;
      guardrails?: GuardrailRegistration;
    }
  ): Promise<IfNode> {
    const subType: string = serialized.subType;

    switch (subType) {
      case 'condition':
        return IfConditionNodeImpl.deserialize(serialized, values, registry);
      default:
        throw new Error('Plugin node is unsupported for now');
    }
  }

  /**
   * Retrieves a dynamic user interface representation of the condition,
   * typically used for configuring the node in a user interface.
   *
   * @returns A promise that resolves to the condition UI contexts which might include
   * details about the sources and actions associated with the condition.
   */
  async getBody(): Promise<NodeBody> {
    const conditionUIContexts: UIContext[] = await displayConditionUI(
      this.data.sources,
      this.data.actions
    );

    return conditionUIContexts;
  }
}

/**
 * Implementation of an IfNode specifically for managing conditional logic within a node-graph system.
 * This node provides interfaces to dynamically configure input and output ports based on the
 * conditional logic and connections established in a network or system.
 *
 * ### Node Properties
 *
 * | Field        | Type                  | Description                                                                    |
 * |--------------|-----------------------|--------------------------------------------------------------------------------|
 * | `type`       | `'if'`                | The type of the node, indicating it handles conditional logic.                 |
 * | `subType`    | `'condition'`         | The subtype of the node, specifying it is focused on conditional operations.   |
 * | `data`       | {@link IfCondition}   | The actual condition logic being managed by this node.                         |
 *
 * ### Input Ports
 *
 * Input ports in an if node are from `sources` of {@link BaseIfCondition}, default with types of {@link dataTypes}.
 *
 * ### Output Ports
 *
 * Output ports in an if node are from `targets` of {@link BaseIfCondition}, default with types of {@link dataTypes}.
 *
 */
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

  /**
   * Dynamically adds a new input port to the node. This method updates the node's internal
   * input structure and condition source list to include the new port.
   *
   * @returns {string} The name of the newly added input port.
   */
  addInputPort(): string {
    if (this.inputs === undefined) {
      this.inputs = {};
    }

    const newName: string = this._getNewPortName();
    this.inputs[newName] = dataTypes;

    this.data.sources = [...this.data.sources, newName];

    return newName;
  }

  /**
   * Dynamically adds a new output port to the node. This method updates the node's internal
   * output structure and condition target list to include the new port and associated action.
   *
   * @returns {string} The name of the newly added output port.
   */
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

  /**
   * Removes an existing input port from the node by name. This also updates the condition source list
   * to no longer include the removed port.
   *
   * @param inputPortName The name of the input port to remove.
   * @returns {boolean} True if the input port was successfully removed, false otherwise.
   */
  removeInputPort(inputPortName: string): boolean {
    if (!this.inputs || !this.inputs[inputPortName]) {
      return false;
    }

    delete this.inputs[inputPortName];
    this.data.sources = this.data.sources.filter((s) => s !== inputPortName);

    return true;
  }

  /**
   * Removes an existing output port from the node by name. This also updates the condition target list
   * and removes any associated actions.
   *
   * @param outputPortName The name of the output port to remove.
   * @returns {boolean} True if the output port was successfully removed, false otherwise.
   */
  removeOutputPort(outputPortName: string): boolean {
    if (!this.outputs || !this.outputs[outputPortName]) {
      return false;
    }

    delete this.outputs[outputPortName];
    this.data.targets = this.data.targets.filter((t) => t !== outputPortName);

    return this.data.removeAction(outputPortName);
  }

  /**
   * Creates a IfNode configuration from a IfCondition callable instance.
   * @param callable An instance of IfCondition defining the interaction logic with if-else logics.
   * @returns A fully configured IfNode specialized for IfCondition operations.
   */
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

  /**
   * Factory method to create a new instance of IfCondition.
   * This method initializes a new node with a if-condition instance configured
   * for managing conditional logic.
   *
   * @returns An instance of IfCondition.
   */
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
    const ifCondition = await load<IfCondition>(ifConditionStr);

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

  /**
   * Preprocesses the input data to convert it from the process input map format to a structured format
   * that includes the input values and any relevant variable context from memory.
   *
   * @param inputs A map containing input data for the node.
   * @param context The processing context.
   * @internal
   */
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

  /**
   * Postprocesses the raw outputs from the invoke method, converting them to a process output map
   * format by coercing data types as necessary.
   *
   * @param rawOutputs The raw outputs from the condition evaluation.
   * @param context The processing context.
   * @internal
   */
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

  /**
   * Invokes the condition logic defined in the data property with the provided input,
   * handling any dynamic rule evaluation based on the input conditions and specified options.
   *
   * @param input The input data for the condition, expected to be IfConditionSource.
   * @param options Optional additional settings for the condition call.
   * @returns The output from the condition logic as specified by the condition's output type.
   */
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

  /**
   * Processes the inputs based on the conditional logic defined within the node.
   * This process might involve checking conditions and producing outputs accordingly.
   *
   * @param inputs The map containing input data for the node.
   * @param context The processing context.
   * @returns A promise that resolves to a map of process outputs.
   */
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

  /**
   * Generates a new unique port name for input or output ports based on existing port names.
   * This method ensures that each new port name does not conflict with existing names
   * by checking against the current list of input and output ports. It uses a systematic
   * approach to iterate through potential names using a combination of alphabetic characters
   * and numeric suffixes to ensure uniqueness.
   *
   * @returns A unique port name that is not already used in the node's inputs or outputs.
   * @internal
   *
   * @example
   * // Example of generating a new unique port name when adding a new port
   * const newPortName = ifNodeInstance._getNewPortName(); // suppose new name is 'A'
   * const anotherNewPortName = ifNodeInstance._getNewPortName(); // now new name is 'B'
   *
   */
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
