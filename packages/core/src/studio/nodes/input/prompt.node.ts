import { BasePrompt } from '../../../events/input/load/prompts/base.js';
import { ChatPrompt } from '../../../events/input/load/prompts/chat.js';
import { StringPrompt } from '../../../events/input/load/prompts/text.js';
import { load } from '../../../load/index.js';
import {
  globalImportMap,
  globalSecretMap,
} from '../../../load/registration.js';
import { getRecordId } from '../../../utils/nanoid.js';
import { scalarDefaults } from '../../data.js';
import {
  ProcessContext,
  ProcessInputMap,
  ProcessOutputMap,
} from '../../processor.js';
import { SerializedNode } from '../../serde.js';
import { coerceToData } from '../../utils/coerce.js';
import { NodeImpl } from '../base.js';
import { SerializableNode } from '../index.js';

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

    // TODO: This depends on the connected input type,
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
 * None
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
      inputs: {},
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
      inputs: {},
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
}
