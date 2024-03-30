import {
  BaseLLM,
  BaseLMInput,
  isLMInput,
} from '../../../../events/inference/chat/base.js';
import { OpenAICallOptions } from '../../../../events/inference/chat/llms/openai/index.js';
import { OpenAI } from '../../../../events/inference/chat/llms/openai/text.js';
import { Gemini } from '../../../../events/inference/chat/llms/vertexai/gemini/text.js';
import { GeminiCallOptions } from '../../../../events/inference/chat/llms/vertexai/index.js';
import { Generation } from '../../../../events/output/provide/generation.js';
import { LLMResult } from '../../../../events/output/provide/llmresult.js';
import { getRecordId } from '../../../../utils/nanoid.js';
import { Data } from '../../../data.js';
import {
  ProcessInputMap,
  ProcessContext,
  ProcessOutputMap,
} from '../../../processor.js';
import { coerceToData } from '../../../utils/coerce.js';
import { CallableNodeImpl } from '../../base.js';
import { CallableNode } from '../../index.js';

export type LLMNode = CallableNode<'llm', BaseLLM>;

export abstract class LLMNodeImpl extends CallableNodeImpl<LLMNode> {
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
    const gen: Generation = generations[0];

    const output: string = gen.output as string;
    const info: Record<string, unknown> | undefined = gen.info;

    if (!llmOutput) {
      return {
        output: coerceToData(output),
        info: coerceToData(info),
        completionTokens: coerceToData(undefined),
        promptTokens: coerceToData(undefined),
        totalTokens: coerceToData(undefined),
      };
    }

    return {
      output: coerceToData(output),
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

export class OpenAINodeImpl extends LLMNodeImpl {
  static create(): LLMNode {
    const openai = new OpenAI({
      modelName: 'text-davinci-003',
      openAIApiKey: 'openai-secret-placeholder',
      maxTokens: 2048,
    });

    const node: LLMNode = {
      id: getRecordId(),
      type: 'llm',
      subType: 'openai',
      data: openai,
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
      OpenAICallOptions
    >(rawInputs);

    return this._postprocess(rawOutputs, context);
  }
}

export class GeminiNodeImpl extends LLMNodeImpl {
  static create(): LLMNode {
    const gemini = new Gemini({
      modelName: 'gemini-pro',
      googleApiKey: 'google-secret-placeholder',
      maxOutputTokens: 2048,
    });

    const node: LLMNode = {
      id: getRecordId(),
      type: 'llm',
      subType: 'gemini',
      data: gemini,
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
        info: 'object',
        completionTokens: 'number',
        promptTokens: 'number',
        totalTokens: 'number',
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
