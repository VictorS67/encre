import {
  type BaseMessage,
  BotMessage,
  ChatMessage,
  FunctionMessage,
  HumanMessage,
  SystemMessage,
} from '../../../events/input/load/msgs/index.js';
import { load } from '../../../load/index.js';
import {
  globalImportMap,
  globalSecretMap,
} from '../../../load/registration.js';
import { getRecordId } from '../../../utils/nanoid.js';
import { scalarDefaults } from '../../data.js';
import {
  type ProcessInputMap,
  type ProcessContext,
  type ProcessOutputMap,
} from '../../processor.js';
import { type SerializedNode } from '../../serde.js';
import { coerceToData } from '../../utils/coerce.js';
import { NodeImpl } from '../base.js';
import { type SerializableNode } from '../index.js';

/**
 * A type alias for message nodes which are serializable.
 * This type specializes in handling messaging operations within a node-based system architecture.
 */
export type MessageNode = SerializableNode<'message', BaseMessage>;

/**
 * Abstract implementation of a message node that processes incoming messages.
 * This class extends the node implementation to handle specialized messaging functionalities.
 */
export abstract class MessageNodeImpl extends NodeImpl<MessageNode> {
  /**
   * Deserializes a serialized message node representation into an executable message node,
   * reconstituting the node with its operational parameters and data.
   *
   * @param serialized The serialized node data.
   * @returns A promise resolving to a deserialized message node.
   */
  static async deserialize(serialized: SerializedNode): Promise<MessageNode> {
    const subType: string = serialized.subType;

    switch (subType) {
      case 'chat':
        return ChatMessageNodeImpl.deserialize(serialized);
      case 'human':
        return HumanMessageNodeImpl.deserialize(serialized);
      case 'bot':
        return BotMessageNodeImpl.deserialize(serialized);
      case 'prompt':
        return SystemMessageNodeImpl.deserialize(serialized);
      case 'function':
        return FunctionMessageNodeImpl.deserialize(serialized);
      default:
        throw new Error('Plugin node is unsupported for now');
    }
  }

  /**
   * Processes the inputs provided to the node.
   * @param inputs - The input data for the node, may be undefined.
   * @param context - The context in which the node is being processed.
   * @returns A promise that resolves to the output map of the process.
   * @throws Will throw an error if the inputs are invalid.
   */
  async process(
    inputs: ProcessInputMap | undefined,
    context: ProcessContext
  ): Promise<ProcessOutputMap> {
    if (!this.validateInputs(inputs)) {
      throw new Error(`${this.type} Node ${this.title} has invalid inputs`);
    }

    return { message: coerceToData(this.data) };
  }
}

/**
 * Implementation of a message node specifically for handling chat messages.
 * This node processes and routes chat messages within a messaging system.
 *
 * ### Node Properties
 *
 * | Field       | Type                | Description                                                          |
 * |-------------|---------------------|----------------------------------------------------------------------|
 * | `type`      | `'message'`         | Indicates the node type as handling message operations.              |
 * | `subtype`   | `'chat'`            | Specifies the subtype as handling chat messages.                     |
 * | `data`      | {@link ChatMessage} | The data structure used for chat message operations.                 |
 *
 * ### Input Ports
 *
 * None
 *
 * ### Output Ports
 *
 * | Port Name   | Supported Types     | Description                                                          |
 * |-------------|---------------------|----------------------------------------------------------------------|
 * | `message`   | `chat-message`      | Outputs a chat message.                                              |
 */
export class ChatMessageNodeImpl extends MessageNodeImpl {
  /**
   * Converts a serializable chat message into a MessageNode.
   * @param serializable - The chat message to be converted.
   * @returns A new instance of MessageNode.
   */
  static nodeFrom(serializable: ChatMessage): MessageNode {
    return {
      id: getRecordId(),
      type: 'message',
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
        message: 'chat-message',
      },
    };
  }

  /**
   * Factory method to create a new instance of a ChatMessageNode.
   * This method provides a simple way to instantiate a chat message node with default settings.
   * @returns An instance of MessageNode prepared with a default ChatMessage.
   */
  static create(): MessageNode {
    const chatMessage = new ChatMessage({
      content: scalarDefaults['string'],
      role: 'human',
    });

    const node: MessageNode = ChatMessageNodeImpl.nodeFrom(chatMessage);

    return node;
  }

  static async deserialize(serialized: SerializedNode): Promise<MessageNode> {
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

    if (type !== 'message') {
      throw new Error(`CANNOT deserialize this type in message node: ${type}`);
    }

    const messageStr = JSON.stringify(data);
    const message = await load<ChatMessage>(
      messageStr,
      globalSecretMap,
      globalImportMap
    );

    return {
      id,
      type,
      subType,
      registerArgs,
      data: message,
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
 * Implementation of a message node specifically for representing human messages.
 * This node is designed to process and manage messages originating from human interactions,
 * facilitating their integration into a larger messaging system.
 *
 * ### Node Properties
 *
 * | Field       | Type            | Description                                                          |
 * |-------------|-----------------|----------------------------------------------------------------------|
 * | `type`      | `'message'`     | Indicates the node type as handling message operations.              |
 * | `subtype`   | `'human'`       | Specifies that the node is specialized for human-generated messages. |
 * | `data`      | {@link HumanMessage} | The data structure used for human message operations.              |
 *
 * ### Input Ports
 *
 * None
 *
 * ### Output Ports
 *
 * | Port Name   | Supported Types     | Description                                                          |
 * |-------------|---------------------|----------------------------------------------------------------------|
 * | `message`   | `chat-message`      | Outputs a chat message.                                              |
 */
export class HumanMessageNodeImpl extends MessageNodeImpl {
  /**
   * Converts a serializable human message into a MessageNode.
   * @param serializable - The human message to be serialized into node form.
   * @returns A fully configured MessageNode specialized for human messages.
   */
  static nodeFrom(serializable: HumanMessage): MessageNode {
    return {
      id: getRecordId(),
      type: 'message',
      subType: 'human',
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
        message: 'chat-message',
      },
    };
  }

  /**
   * Factory method to create a new instance of a HumanMessageNode.
   * This method provides a simple way to instantiate a human message node with default settings.
   * @returns An instance of MessageNode prepared with a default HumanMessage.
   */
  static create(): MessageNode {
    const humanMessage = new HumanMessage(scalarDefaults['string']);

    const node: MessageNode = HumanMessageNodeImpl.nodeFrom(humanMessage);

    return node;
  }

  static async deserialize(serialized: SerializedNode): Promise<MessageNode> {
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

    if (type !== 'message') {
      throw new Error(`CANNOT deserialize this type in message node: ${type}`);
    }

    const messageStr = JSON.stringify(data);
    const message = await load<HumanMessage>(
      messageStr,
      globalSecretMap,
      globalImportMap
    );

    return {
      id,
      type,
      subType,
      registerArgs,
      data: message,
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
 * Implementation of a message node specifically designed for bot-generated messages.
 * This class processes and manages messages created by automated systems or bots,
 * facilitating their integration and routing within a larger messaging framework.
 *
 * ### Node Properties
 *
 * | Field       | Type         | Description                                                          |
 * |-------------|--------------|----------------------------------------------------------------------|
 * | `type`      | `'message'`  | Indicates the node type as handling message operations.              |
 * | `subtype`   | `'bot'`      | Specifies that the node is specialized for bot-generated messages.   |
 * | `data`      | {@link BotMessage} | The data structure used for bot message operations.             |
 *
 * ### Input Ports
 *
 * None
 *
 * ### Output Ports
 *
 * | Port Name   | Supported Types     | Description                                                          |
 * |-------------|---------------------|----------------------------------------------------------------------|
 * | `message`   | `chat-message`      | Outputs a chat message.                                              |
 */
export class BotMessageNodeImpl extends MessageNodeImpl {
  /**
   * Converts a serializable bot message into a MessageNode.
   * @param serializable - The bot message to be serialized into node form.
   * @returns A fully configured MessageNode specialized for bot messages.
   */
  static nodeFrom(serializable: BotMessage): MessageNode {
    return {
      id: getRecordId(),
      type: 'message',
      subType: 'bot',
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
        message: 'chat-message',
      },
    };
  }

  /**
   * Factory method to create a new instance of a BotMessageNode.
   * This method provides a straightforward way to instantiate a bot message node with default settings, suitable for integrating automated messaging processes.
   * @returns An instance of MessageNode prepared with a default BotMessage.
   */
  static create(): MessageNode {
    const botMessage = new BotMessage(scalarDefaults['string']);

    const node: MessageNode = BotMessageNodeImpl.nodeFrom(botMessage);

    return node;
  }

  static async deserialize(serialized: SerializedNode): Promise<MessageNode> {
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

    if (type !== 'message') {
      throw new Error(`CANNOT deserialize this type in message node: ${type}`);
    }

    const messageStr = JSON.stringify(data);
    const message = await load<BotMessage>(
      messageStr,
      globalSecretMap,
      globalImportMap
    );

    return {
      id,
      type,
      subType,
      registerArgs,
      data: message,
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
 * Implementation of a message node specifically designed for system-generated prompt messages.
 * This class processes and manages messages generated by system prompts, facilitating their integration
 * and routing within a larger messaging framework.
 *
 * ### Node Properties
 *
 * | Field       | Type            | Description                                                          |
 * |-------------|-----------------|----------------------------------------------------------------------|
 * | `type`      | `'message'`     | Indicates the node type as handling message operations.              |
 * | `subtype`   | `'prompt'`      | Specifies that the node is specialized for system prompt messages.   |
 * | `data`      | {@link SystemMessage} | The data structure used for system prompt message operations.     |
 *
 * ### Input Ports
 *
 * None
 *
 * ### Output Ports
 *
 * | Port Name   | Supported Types     | Description                                                          |
 * |-------------|---------------------|----------------------------------------------------------------------|
 * | `message`   | `chat-message`      | Outputs a chat message.                                              |
 */
export class SystemMessageNodeImpl extends MessageNodeImpl {
  /**
   * Converts a serializable system prompt message into a MessageNode.
   * @param serializable - The system message to be serialized into node form.
   * @returns A fully configured MessageNode specialized for system prompt messages.
   */
  static nodeFrom(serializable: BotMessage): MessageNode {
    return {
      id: getRecordId(),
      type: 'message',
      subType: 'prompt',
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
        message: 'chat-message',
      },
    };
  }

  /**
   * Factory method to create a new instance of a SystemMessageNode.
   * This method provides a straightforward way to instantiate a system message node with default settings,
   * suitable for integrating system-generated prompt messaging processes.
   *
   * @returns An instance of MessageNode prepared with a default SystemMessage.
   */
  static create(): MessageNode {
    const systemMessage = new SystemMessage(scalarDefaults['string']);

    const node: MessageNode = SystemMessageNodeImpl.nodeFrom(systemMessage);

    return node;
  }

  static async deserialize(serialized: SerializedNode): Promise<MessageNode> {
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

    if (type !== 'message') {
      throw new Error(`CANNOT deserialize this type in message node: ${type}`);
    }

    const messageStr = JSON.stringify(data);
    const message = await load<SystemMessage>(
      messageStr,
      globalSecretMap,
      globalImportMap
    );

    return {
      id,
      type,
      subType,
      registerArgs,
      data: message,
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
 * Implementation of a message node specifically designed for function-related messages.
 * This class handles messages that trigger or relate to specific functional operations within the system,
 * enabling structured and effective handling of function calls and their responses.
 *
 * ### Node Properties
 *
 * | Field       | Type                | Description                                                            |
 * |-------------|---------------------|------------------------------------------------------------------------|
 * | `type`      | `'message'`         | Indicates the node type as handling message operations.                |
 * | `subtype`   | `'function'`        | Specifies that the node is specialized for function-related messages.  |
 * | `data`      | {@link FunctionMessage} | The data structure used for function message operations.           |
 *
 * ### Input Ports
 *
 * None
 *
 * ### Output Ports
 *
 * | Port Name   | Supported Types     | Description                                                          |
 * |-------------|---------------------|----------------------------------------------------------------------|
 * | `message`   | `chat-message`      | Outputs a chat message.                                              |
 */
export class FunctionMessageNodeImpl extends MessageNodeImpl {
  /**
   * Converts a serializable function message into a MessageNode.
   * @param serializable - The function message to be serialized into node form.
   * @returns A fully configured MessageNode specialized for function messages.
   */
  static nodeFrom(serializable: BotMessage): MessageNode {
    return {
      id: getRecordId(),
      type: 'message',
      subType: 'function',
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
        message: 'chat-message',
      },
    };
  }

  /**
   * Factory method to create a new instance of a FunctionMessageNode.
   * This method provides a straightforward way to instantiate a function message node with default settings,
   * suitable for integrating function-related messaging processes.
   *
   * @returns An instance of MessageNode prepared with a default FunctionMessage.
   */
  static create(): MessageNode {
    const functionMessage = new FunctionMessage({
      content: scalarDefaults['string'],
      additionalKwargs: scalarDefaults['object'],
    });

    const node: MessageNode = FunctionMessageNodeImpl.nodeFrom(functionMessage);

    return node;
  }

  static async deserialize(serialized: SerializedNode): Promise<MessageNode> {
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

    if (type !== 'message') {
      throw new Error(`CANNOT deserialize this type in message node: ${type}`);
    }

    const messageStr = JSON.stringify(data);
    const message = await load<FunctionMessage>(
      messageStr,
      globalSecretMap,
      globalImportMap
    );

    return {
      id,
      type,
      subType,
      registerArgs,
      data: message,
      visualInfo,
      inputs,
      outputs,
      runtime,
      memory,
      outputSizes,
    };
  }
}
