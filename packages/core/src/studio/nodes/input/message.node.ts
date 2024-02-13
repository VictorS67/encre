import {
  BaseMessage,
  BotMessage,
  ChatMessage,
  FunctionMessage,
  HumanMessage,
  SystemMessage,
} from '../../../events/input/load/msgs/base.js';
import { scalarDefaults } from '../../data.js';
import {
  ProcessInputMap,
  ProcessContext,
  ProcessOutputMap,
} from '../../processor.js';
import { coerceToData } from '../../utils/coerce.js';
import { NodeImpl } from '../base.js';
import { SerializableNode } from '../index.js';

export type MessageNode = SerializableNode<'message', BaseMessage>;

export abstract class MessageNodeImpl extends NodeImpl<MessageNode> {
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

export class ChatMessageNodeImpl extends MessageNodeImpl {
  static create(): MessageNode {
    const chatMessage = new ChatMessage({
      content: scalarDefaults['string'],
      role: 'human',
    });

    const node: MessageNode = {
      type: 'message',
      data: chatMessage,
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

    return node;
  }
}

export class HumanMessageNodeImpl extends MessageNodeImpl {
  static create(): MessageNode {
    const humanMessage = new HumanMessage(scalarDefaults['string']);

    const node: MessageNode = {
      type: 'message',
      data: humanMessage,
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

    return node;
  }
}

export class BotMessageNodeImpl extends MessageNodeImpl {
  static create(): MessageNode {
    const botMessage = new BotMessage(scalarDefaults['string']);

    const node: MessageNode = {
      type: 'message',
      data: botMessage,
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

    return node;
  }
}

export class SystemMessageNodeImpl extends MessageNodeImpl {
  static create(): MessageNode {
    const systemMessage = new SystemMessage(scalarDefaults['string']);

    const node: MessageNode = {
      type: 'message',
      data: systemMessage,
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

    return node;
  }
}

export class FunctionMessageNodeImpl extends MessageNodeImpl {
  static create(): MessageNode {
    const functionMessage = new FunctionMessage({
      content: scalarDefaults['string'],
      additionalKwargs: scalarDefaults['object'],
    });

    const node: MessageNode = {
      type: 'message',
      data: functionMessage,
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

    return node;
  }
}
