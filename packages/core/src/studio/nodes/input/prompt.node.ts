import { BasePrompt } from '../../../events/input/load/prompts/base.js';
import { ChatPrompt } from '../../../events/input/load/prompts/chat.js';
import { StringPrompt } from '../../../events/input/load/prompts/text.js';
import { scalarDefaults } from '../../data.js';
import {
  ProcessContext,
  ProcessInputMap,
  ProcessOutputMap,
} from '../../processor.js';
import { coerceToData } from '../../utils/coerce.js';
import { NodeImpl } from '../base.js';
import { SerializableNode } from '../index.js';

export type PromptNode = SerializableNode<'prompt', BasePrompt>;

export abstract class PromptNodeImpl extends NodeImpl<PromptNode> {
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

export class StringPromptNodeImpl extends PromptNodeImpl {
  static create(): PromptNode {
    const stringPrompt = new StringPrompt(scalarDefaults['string']);

    const node: PromptNode = {
      type: 'prompt',
      data: stringPrompt,
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

    return node;
  }
}

export class ChatPromptNodeImpl extends PromptNodeImpl {
  static create(): PromptNode {
    const chatPrompt = new ChatPrompt([]);

    const node: PromptNode = {
      type: 'prompt',
      data: chatPrompt,
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

    return node;
  }
}
