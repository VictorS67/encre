import { BaseMessage, HumanMessage } from '../../../events/input/load/msgs/index.js';
import { convertMessageLikeToMessage, getChatString } from '../../../events/input/load/msgs/utils.js';
import {
  type BasePrompt,
  ChatPrompt,
  StringPrompt,
} from '../../../events/input/load/prompts/index.js';
import { load } from '../../../load/index.js';
import { type RecordId } from '../../../load/keymap.js';
import {
  globalImportMap,
  globalSecretMap,
} from '../../../load/registration.js';
import { getRecordId } from '../../../utils/nanoid.js';
import { isNotNull } from '../../../utils/safeTypes.js';
import { DataType, scalarDefaults } from '../../data.js';
import {
  type  ProcessContext,
  type ProcessInputMap,
  type ProcessOutputMap,
} from '../../processor.js';
import { type SerializedNode } from '../../serde.js';
import { coerceToData } from '../../utils/coerce.js';
import { NodeImpl } from '../base.js';
import { NodeConnection, NodeInputPortDef, NodePortFields, type SerializableNode } from '../index.js';

/**
 * A type alias for a specialized serializable node focused on prompts.
 * This node type is specialized for representing prompts, particularly in the
 * context of generating strings or arrays of chat messages.
 */
export type PromptNode = SerializableNode<'prompt', BasePrompt>;

/**
 * An abstract class providing a base implementation for prompt nodes.
 * This class extends the basic node implementation to provide specialized
 * prompt functionalities.
 */
export abstract class PromptNodeImpl extends NodeImpl<PromptNode> {
  /**
   * Sets new input definitions for the node. Allows dynamic configuration of node inputs based on external factors.
   * @param newVal A structure defining the input ports and their data types, or undefined to clear inputs.
   */
  set inputs(newVal: NodePortFields | undefined) {
    this.node.inputs = newVal;
  }

  /**
   * Deserializes a serialized prompt node representation into an executable prompt node,
   * reconstituting the node with its operational parameters and data.
   *
   * @param serialized The serialized node data.
   * @returns A promise resolving to a deserialized prompt node.
   */
  static async deserialize(serialized: SerializedNode): Promise<PromptNode> {
    const subType: string = serialized.subType;

    switch (subType) {
      case 'string':
        return StringPromptNodeImpl.deserialize(serialized);
      case 'chat':
        return ChatPromptNodeImpl.deserialize(serialized);
      default:
        throw new Error('Plugin node is unsupported for now');
    }
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

      if (!possibleType) {
        continue;
      }

      const possibleTypes: DataType[] = possibleType 
      ? Array.isArray(possibleType)
        ? possibleType
        : [possibleType] 
      : [];

      const dataTypes: DataType[] = [];
      const allowTypes: DataType[] = ['string', 'string[]', 'chat-message', 'chat-message[]'];
      for (const allowType of allowTypes) {
        if (possibleTypes.includes(allowType)) {
          dataTypes.push(allowType);
        }
      }

      ports[portName] = [...new Set(dataTypes)];
    }

    return Object.entries(ports).map(([k, v]) => {
      const possibleTypes: DataType[] = Array.isArray(v) ? v : [v];

      return {
        nodeId: this.id,
        name: k,
        type: [...possibleTypes, 'unknown'],
      };
    });
  }

  /**
   * Processes the inputs to generate outputs based on the prompt logic encapsulated by the node.
   * This method orchestrates the validation and processing of input data to generate chat messages
   * or strings, depending on the connected input type and its corresponding output.
   *
   * @param inputs The map containing input data for the node, which can be undefined.
   * @param context The processing context, providing additional data and operations for processing.
   * @returns A map of process outputs keyed by their output port names.
   * @throws Error if the inputs are not valid, indicating issues with input data configuration.
   */
  async process(
    inputs: ProcessInputMap | undefined,
    context: ProcessContext
  ): Promise<ProcessOutputMap> {
    if (!this.validateInputs(inputs)) {
      throw new Error(`${this.type} Node ${this.title} has invalid inputs`);
    }

    // since the output types can be different.
    return { prompt: coerceToData(this.data.toChatMessages()) };
  }
}

/**
 * Implementation of a PromptNode specifically for generating string prompts.
 * This node handles the creation and management of string-based prompts or chat messages,
 * adapting the output based on the serialized data provided.
 *
 * ### Node Properties
 *
 * | Field       | Type                | Description                                                           |
 * |-------------|---------------------|-----------------------------------------------------------------------|
 * | `type`      | `'prompt'`          | The type of the node, indicating it handles prompt generation.       |
 * | `subtype`   | `'string'`          | The subtype of the node, specifying that it is specialized for strings. |
 * | `data`      | {@link StringPrompt}| The serializable data used for generating prompts.                    |
 *
 * ### Input Ports
 *
 * None in default. Input ports are dynamically configured based on the node's current connections and may vary.
 *
 * ### Output Ports
 *
 * | Port Name   | Supported Types     | Description                                                           |
 * |-------------|---------------------|-----------------------------------------------------------------------|
 * | `prompt`    | `string`, `chat-message[]` | Outputs a string or an array of chat messages as prompt.   |
 *
 */
export class StringPromptNodeImpl extends PromptNodeImpl {  
  /**
   * Creates a PromptNode configuration from a StringPrompt serializable instance.
   * @param serializable An instance of StringPrompt defining the prompt generation logic.
   * @returns A fully configured PromptNode specialized for string operations.
   */
  static nodeFrom(serializable: StringPrompt): PromptNode {
    return {
      id: getRecordId(),
      type: 'prompt',
      subType: 'string',
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
      outputs: {
        prompt: ['string', 'chat-message[]'],
      },
    };
  }

  /**
   * Factory method to create a new instance of StringPromptNode.
   * This method provides a simple way to instantiate a prompt node with default settings
   * for generating string prompts.
   *
   * @returns An instance of PromptNode prepared with a default StringPrompt.
   */
  static create(): PromptNode {
    const stringPrompt = new StringPrompt(scalarDefaults['string']);

    const node: PromptNode = StringPromptNodeImpl.nodeFrom(stringPrompt);

    return node;
  }

  static async deserialize(serialized: SerializedNode): Promise<PromptNode> {
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

    if (type !== 'prompt') {
      throw new Error(`CANNOT deserialize this type in prompt node: ${type}`);
    }

    const promptStr = JSON.stringify(data);
    const prompt = await load<StringPrompt>(
      promptStr,
      globalSecretMap,
      globalImportMap
    );

    return {
      id,
      type,
      subType,
      registerArgs,
      data: prompt,
      visualInfo,
      inputs,
      outputs,
      runtime,
      memory,
      outputSizes,
    };
  }

  async process(
    inputs: ProcessInputMap | undefined,
    context: ProcessContext
  ): Promise<ProcessOutputMap> {
    // If inputs are presented, then it means user provide the input
    const filteredInputs = Object.values(inputs ?? {}).filter(isNotNull);
    if (filteredInputs.length > 0) {
      let corecedInputs: string[] = [];

      for (const input of filteredInputs) {
        if (input.type === 'string') {
          corecedInputs.push(input.value);
        } else if (input.type === 'string[]') {
          corecedInputs = corecedInputs.concat(input.value);
        } else if (input.type === 'chat-message') {
          corecedInputs.push(getChatString([convertMessageLikeToMessage(input.value)]));
        } else if (input.type === 'chat-message[]') {
          corecedInputs.push(getChatString(input.value.map(convertMessageLikeToMessage)));
        }
      }

      (this.data as StringPrompt).value = corecedInputs.join('\n');
    }

    // since the output types can be different.
    return { prompt: coerceToData((this.data as StringPrompt).value) };
  }
}

/**
 * Implementation of a PromptNode specifically for generating chat-based prompts.
 * This node handles the creation and management of chat prompts, adapting the output based on the
 * serialized data provided which can include complex chat interactions or simple messages.
 *
 * ### Node Properties
 *
 * | Field       | Type              | Description                                                          |
 * |-------------|-------------------|----------------------------------------------------------------------|
 * | `type`      | `'prompt'`        | The type of the node, indicating it handles prompt generation.      |
 * | `subtype`   | `'chat'`          | The subtype of the node, specifying that it is specialized for chat-based interactions. |
 * | `data`      | {@link ChatPrompt}| The serializable data used for generating chat-based prompts.        |
 *
 * ### Input Ports
 *
 * None in default. Input ports are dynamically configured based on the node's current connections and may vary.
 * 
 * ### Output Ports
 *
 * | Port Name   | Supported Types         | Description                                                           |
 * |-------------|-------------------------|-----------------------------------------------------------------------|
 * | `prompt`    | `string`, `chat-message[]` | Outputs a string or an array of chat messages as the prompt. |
 *
 */
export class ChatPromptNodeImpl extends PromptNodeImpl {
  /**
   * Creates a PromptNode configuration from a ChatPrompt serializable instance.
   * @param serializable An instance of ChatPrompt defining the chat prompt generation logic.
   * @returns A fully configured PromptNode specialized for chat operations.
   */
  static nodeFrom(serializable: ChatPrompt): PromptNode {
    return {
      id: getRecordId(),
      type: 'prompt',
      subType: 'chat',
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
      outputs: {
        prompt: ['string', 'chat-message[]'],
      },
    };
  }

  /**
   * Factory method to create a new instance of ChatPromptNode.
   * This method provides a simple way to instantiate a chat prompt node with default settings
   * for generating chat prompts. It initializes the node with an empty array for chat messages,
   * allowing custom configurations to be added subsequently.
   *
   * @returns An instance of PromptNode prepared with a default ChatPrompt.
   */
  static create(): PromptNode {
    const chatPrompt = new ChatPrompt([]);

    const node: PromptNode = ChatPromptNodeImpl.nodeFrom(chatPrompt);

    return node;
  }

  static async deserialize(serialized: SerializedNode): Promise<PromptNode> {
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

    if (type !== 'prompt') {
      throw new Error(`CANNOT deserialize this type in prompt node: ${type}`);
    }

    const promptStr = JSON.stringify(data);
    const prompt = await load<ChatPrompt>(
      promptStr,
      globalSecretMap,
      globalImportMap
    );

    return {
      id,
      type,
      subType,
      registerArgs,
      data: prompt,
      visualInfo,
      inputs,
      outputs,
      runtime,
      memory,
      outputSizes,
    };
  }

  async process(
    inputs: ProcessInputMap | undefined,
    context: ProcessContext
  ): Promise<ProcessOutputMap> {
    // If inputs are presented, then it means user provide the input
    const filteredInputs = Object.values(inputs ?? {}).filter(isNotNull);
    if (filteredInputs.length > 0) {
      let corecedInputs: BaseMessage[] = [];

      for (const input of filteredInputs) {
        if (input.type === 'string') {
          corecedInputs.push(new HumanMessage(input.value));
        } else if (input.type === 'string[]') {
          corecedInputs = corecedInputs.concat(input.value.map((v) => new HumanMessage(v)));
        } else if (input.type === 'chat-message') {
          corecedInputs.push(convertMessageLikeToMessage(input.value));
        } else if (input.type === 'chat-message[]') {
          corecedInputs = corecedInputs.concat(input.value.map(convertMessageLikeToMessage));
        }
      }

      (this.data as ChatPrompt).messages = corecedInputs;
    }

    // since the output types can be different.
    return { prompt: coerceToData((this.data as ChatPrompt).messages) };
  }
}
