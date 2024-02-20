import {
  BaseChatLM,
  BaseLMInput,
  isLMInput,
} from '../../../../events/inference/chat/base.js';
import { OpenAIChat } from '../../../../events/inference/chat/llms/openai/chat.js';
import { OpenAIChatCallOptions } from '../../../../events/inference/chat/llms/openai/index.js';
import { GeminiChat } from '../../../../events/inference/chat/llms/vertexai/gemini/chat.js';
import { GeminiCallOptions } from '../../../../events/inference/chat/llms/vertexai/index.js';
import { BaseMessage } from '../../../../events/input/load/msgs/base.js';
import { LLMResult } from '../../../../events/output/provide/llmresult.js';
import { ChatGenerationChunk } from '../../../../events/output/provide/message.js';
import { Data } from '../../../data.js';
import {
  ProcessInputMap,
  ProcessContext,
  ProcessOutputMap,
} from '../../../processor.js';
import { coerceToData } from '../../../utils/coerce.js';
import { CallableNodeImpl } from '../../base.js';
import { CallableNode } from '../../index.js';

export type ChatLMNode = CallableNode<'chatlm', BaseChatLM>;

export abstract class ChatLMNodeImpl extends CallableNodeImpl<ChatLMNode> {
  protected async _preprocess(
    inputs: ProcessInputMap,
    context: ProcessContext
  ): Promise<BaseLMInput> {
    const prompt: Data | undefined = inputs['prompt'];

    if (
      !prompt ||
      !(prompt.type === 'string' || prompt.type === 'chat-message[]')
    ) {
      throw new Error(
        `${this.type} Node ${this.title} failed in preprocess because of invalid inputs.`
      );
    }

    return prompt.value;
  }

  protected async _postprocess(
    rawOutputs: LLMResult,
    context: ProcessContext
  ): Promise<ProcessOutputMap> {
    const { generations, llmOutput } = rawOutputs;
    const gen: ChatGenerationChunk = generations[0] as ChatGenerationChunk;

    const output: string = gen.output;
    const message: BaseMessage = gen.message;
    const info: Record<string, unknown> | undefined = gen.info;

    if (!llmOutput) {
      return {
        output: coerceToData(output),
        message: coerceToData(message),
        info: coerceToData(info),
        completionTokens: coerceToData(undefined),
        promptTokens: coerceToData(undefined),
        totalTokens: coerceToData(undefined),
      };
    }

    return {
      output: coerceToData(output),
      message: coerceToData(message),
      info: coerceToData(info),
      completionTokens: coerceToData(llmOutput['completionTokens']),
      promptTokens: coerceToData(llmOutput['promptTokens']),
      totalTokens: coerceToData(llmOutput['totalTokens']),
    };
  }

  async invoke<CallInput, CallOutput, CallOptions>(
    input: CallInput,
    options?: Partial<CallOptions> | undefined
  ): Promise<CallOutput> {
    if (!isLMInput(input)) {
      throw new Error(
        `${this.type} Node ${this.title} failed in invoke because of invalid inputs.`
      );
    }

    return this.data.invoke(input, options) as CallOutput;
  }
}

export class OpenAIChatNodeImpl extends ChatLMNodeImpl {
  static create(): ChatLMNode {
    const openaiChat = new OpenAIChat({
      modelName: 'gpt-3.5-turbo',
      maxTokens: 2048,
    });

    const node: ChatLMNode = {
      type: 'chatlm',
      subType: 'openai',
      data: openaiChat,
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
      inputs: {
        prompt: ['string', 'chat-message[]'],
      },
      outputs: {
        output: 'string',
        message: 'chat-message',
        info: ['object', 'unknown'],
        completionTokens: ['number', 'unknown'],
        promptTokens: ['number', 'unknown'],
        totalTokens: ['number', 'unknown'],
      },
    };

    return node;
  }

  async process(
    inputs: ProcessInputMap,
    context: ProcessContext
  ): Promise<ProcessOutputMap> {
    if (!this.validateInputs(inputs)) {
      throw new Error(`${this.type} Node ${this.title} has invalid inputs`);
    }

    const rawInputs: BaseLMInput = await this._preprocess(inputs, context);

    const rawOutputs: LLMResult = await this.invoke<
      BaseLMInput,
      LLMResult,
      OpenAIChatCallOptions
    >(rawInputs);

    return this._postprocess(rawOutputs, context);
  }
}

export class GeminiChatNodeImpl extends ChatLMNodeImpl {
  static create(): ChatLMNode {
    const geminiChat = new GeminiChat({
      modelName: 'gemini-pro-vision',
      maxOutputTokens: 2048,
    });

    const node: ChatLMNode = {
      type: 'chatlm',
      subType: 'gemini',
      data: geminiChat,
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
      inputs: {
        prompt: ['string', 'chat-message[]'],
      },
      outputs: {
        output: 'string',
        message: 'chat-message',
        info: ['object', 'unknown'],
        completionTokens: ['number', 'unknown'],
        promptTokens: ['number', 'unknown'],
        totalTokens: ['number', 'unknown'],
      },
    };

    return node;
  }

  async process(
    inputs: ProcessInputMap,
    context: ProcessContext
  ): Promise<ProcessOutputMap> {
    if (!this.validateInputs(inputs)) {
      throw new Error(`${this.type} Node ${this.title} has invalid inputs`);
    }

    const rawInputs: BaseLMInput = await this._preprocess(inputs, context);

    const rawOutputs: LLMResult = await this.invoke<
      BaseLMInput,
      LLMResult,
      GeminiCallOptions
    >(rawInputs);

    return this._postprocess(rawOutputs, context);
  }
}
