import {
  SecretFields,
  SerializedFields,
} from '../../../../../../load/keymap.js';
import { getEnvironmentVariables } from '../../../../../../utils/environment.js';
import { LLMResult } from '../../../../../output/provide/llmresult.js';
import { BaseLLM, BaseLLMParams } from '../../../base.js';
import {
  DashScopeBaseInput,
  DashScopeCallOptions,
  DashScopeHeader,
  checkModelForQwen,
  checkModelForQwenVL,
} from '../index.js';

export class Qwen<
    CallOptions extends DashScopeCallOptions = DashScopeCallOptions,
  >
  extends BaseLLM<CallOptions>
  implements DashScopeBaseInput
{
  _isSerializable = true;

  get _secrets(): SecretFields | undefined {
    return {
      dashscopeApiKey: 'DASHSCOPE_API_KEY',
    };
  }

  static _name(): string {
    return 'Qwen';
  }

  /**
   * Support the following models:
   * - `qwen-72b-chat`: A 72 billion parameter chat model from Tongyi Qianwen,
   *        publicly released and human-aligned.
   * - `qwen-14b-chat`: A 14 billion parameter chat model from Tongyi Qianwen,
   *        publicly released and human-aligned.
   * - `qwen-7b-chat`: A 7 billion parameter chat model from Tongyi Qianwen,
   *        publicly released and human-aligned.
   * - `qwen-1.8b-longcontext-chat`: A 1.8 billion parameter chat model from
   *        Tongyi Qianwen, publicly released and human-aligned, designed for
   *        longer contexts.
   * - `qwen-1.8b-chat`: A 1.8 billion parameter chat model from Tongyi Qianwen,
   *        publicly released and human-aligned.
   * - `qwen-turbo`
   * - `qwen-plus`
   * - `qwen-max`
   * - `qwen-max-1201`
   * - `qwen-max-longcontext`
   */
  modelName = 'qwen-72b-chat';

  /**
   * Default: 1234
   */
  seed = 1234;

  /**
   * Default: 1.0
   */
  temperature = 1.0;

  /**
   * Default: 0.8
   */
  topP = 0.8;

  /**
   * Default: 0
   */
  topK = 0;

  /**
   * Default: 1.1
   */
  repetitionPenalty = 1.1;

  /**
   * Default and maximum for the following models:
   * - `qwen-72b-chat`: 2000
   * - `qwen-14b-chat`: 1500
   * - `qwen-7b-chat`: 1500
   * - `qwen-1.8b-longcontext-chat`: 2000
   * - `qwen-1.8b-chat`: 2000
   */
  maxTokens = 2000;

  /**
   * Whether the response comes with stream
   */
  streaming = true;

  stopWords?: string[];

  dashscopeApiKey?: string;

  additionalKwargs?: Record<string, unknown>;

  _llmType(): string {
    return 'qwen';
  }

  constructor(fields?: Partial<DashScopeBaseInput> & BaseLLMParams) {
    super(fields ?? {});

    this.dashscopeApiKey =
      fields?.dashscopeApiKey ?? getEnvironmentVariables('DASHSCOPE_API_KEY');

    if (!this.dashscopeApiKey) {
      throw new Error('DashScope API Key not found');
    }

    this.modelName = fields?.modelName ?? this.modelName;

    if (!checkModelForQwen(this.modelName)) {
      throw new Error('model is not valid for Qwen or QwenVL.');
    }

    if (checkModelForQwenVL(this.modelName)) {
      throw new Error('please use `QwenChat` for QwenVL model.');
    }

    this.maxTokens = fields?.maxTokens ?? 2000;

    if (
      this.maxTokens > 2000 &&
      [
        'qwen-72b-chat',
        'qwen-1.8b-longcontext-chat',
        'qwen-plus',
        'qwen-max-longcontext',
        'qwen-1.8b-chat',
        'qwen-max',
        'qwen-max-1201',
      ].includes(this.modelName)
    ) {
      console.warn(
        `${this.modelName} does not support output token larger than 2000, now using 2000 as maxTokens.`
      );
      this.maxTokens = 2000;
    } else if (
      this.maxTokens > 1500 &&
      ['qwen-14b-chat', 'qwen-7b-chat', 'qwen-turbo'].includes(this.modelName)
    ) {
      console.warn(
        `${this.modelName} does not support output token larger than 1500, now using 1500 as maxTokens.`
      );
      this.maxTokens = 1500;
    }

    this.seed = fields?.seed ?? this.seed;
    this.temperature = fields?.temperature ?? this.temperature;
    this.topP = fields?.topP ?? this.topP;
    this.topK = fields?.topK ?? this.topK;
    this.repetitionPenalty =
      fields?.repetitionPenalty ?? this.repetitionPenalty;

    this.additionalKwargs = fields?.additionalKwargs ?? {};

    this.stopWords = fields?.stopWords;
    this.streaming = fields?.streaming ?? this.streaming;
  }

  getParams(
    options?: this['SerializedCallOptions'] | undefined
  ): Record<string, unknown> {
    throw new Error('Method not implemented.');
  }

  _provide(
    prompt: string,
    options: this['SerializedCallOptions']
  ): Promise<LLMResult> {
    throw new Error('Method not implemented.');
  }

  getModelContextSize(modelName: string): number {
    switch (modelName) {
      case 'qwen-72b-chat':
      case 'qwen-1.8b-longcontext-chat':
      case 'qwen-plus':
        return 32000; // input: 30k; output: 2000;
      case 'qwen-max-longcontext':
        return 30000; // input: 28k; output: 2000;
      case 'qwen-1.8b-chat':
      case 'qwen-max':
      case 'qwen-max-1201':
        return 8000; // input: 6k; output: 2000;
      case 'qwen-14b-chat':
      case 'qwen-7b-chat':
      case 'qwen-turbo':
        return 7500; // input: 6k; output: 1500;
      default:
        throw new Error('model is not valid for Qwen.');
    }
  }

  // protected async _fetch(options: DashScopeCallOptions): Promise<Response | undefined> {
  //   const url = new URL(
  //     `https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation`
  //   );

  //   // https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation

  //   const headers: DashScopeHeader | undefined = options.options.headers

  //   const request = await fetch(url, {
  //     method: "POST",
  //     headers: 
  //   })
  // }
}
