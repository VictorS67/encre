import { Headers, RequestOptions } from '../../../../../utils/request.js';
import { BaseLMCallOptions } from '../../base.js';

export interface DashScopeHeader extends Headers {
  contentType: 'application/json' | 'text/event-stream';
  accept?: 'text/event-stream';
  authorization: string;
  dashScopeSSE?: 'enable';
}

export interface DashScopeCallOptions extends BaseLMCallOptions {
  options: RequestOptions;
}

export interface DashScopeBaseInput {
  /**
   * Random seed used for generation, to control randomness in model output.
   * Supports unsigned 64-bit integer. When using seed, the model will try to
   * generate the same or similar results, but currently does not guarantee
   * identical results each time.
   *
   * Default: 1234
   */
  seed: number;

  /**
   * Controls the degree of randomness and diversity. Specifically, the
   * temperature value controls the degree to which the probability distribution
   * of each candidate word is smoothed during text generation. A higher
   * temperature value reduces the peaks of the probability distribution,
   * allowing more low-probability words to be chosen, resulting in more
   * diverse outcomes; a lower temperature value enhances the peaks, making
   * high-probability words more likely to be chosen, resulting in more certain
   * outcomes.
   *
   * Range: [0.0, 2.0)
   * Default: 1.0
   */
  temperature: number;

  /**
   * Probability threshold for nucleus sampling during generation. For example,
   * a value of 0.8 means only keeping tokens whose cumulative probability is
   * equal to or greater than 0.8 for random sampling.
   *
   * The higher the value, the higher the randomness; the lower the value, the
   * lower the randomness. Default value 0.8.
   *
   * Note: the value should not be equal to or greater than 1.
   *
   * Range: [0.0, 1.0)
   */
  topP: number;

  /**
   * Size of the candidate set for sampling. For example, a value of 50 means
   * only the top 50 scoring tokens are included in the random sampling candidate
   * set. The larger the value, the higher the randomness; the smaller the value,
   * the higher the certainty.
   *
   * Note: If the top_k parameter is empty or its value is more than 100, the top_k
   * strategy is not enabled, and only the top_p strategy is effective.
   */
  topK: number;

  /**
   * Controls the repetitiveness in model generation. Increasing repetition_penalty
   * can reduce repetitiveness.
   *
   * 1.0 indicates no penalty.
   *
   * Default: 1.1
   */
  repetitionPenalty: number;

  /**
   * Limits the number of tokens the model generates. The max_tokens setting is
   * an upper limit, not necessarily the number of tokens that will be generated.
   * For qwen-14b-chat and qwen-7b-chat, the maximum and default values are both 1500;
   * for qwen-1.8b-chat, qwen-1.8b-longcontext-chat, and qwen-72b-chat, the maximum
   * and default values are both 2000.
   */
  maxTokens: number;

  /**
   * Streaming involves receiving responses to prompts as they are generated.
   * That is, as soon as the model generates output tokens, the output tokens
   * are sent.
   */
  streaming: boolean;

  /**
   * ID of the model to use. You can use the
   * {@link https://help.aliyun.com/zh/dashscope/developer-reference/model-square/} API to
   * see all of your available models and the descriptions of them.
   *
   * Qwen model: {@link https://help.aliyun.com/zh/dashscope/developer-reference/open-source-series-of-tongyi-qianwen/}
   */
  modelName: string;

  /**
   * Controls when to stop generation upon encountering certain content. If a string
   * is specified, the model will stop generating when it's about to generate the
   * specified string, and the generated result will not include the specified content.
   *
   * For example, if stop is set to "hello", it will stop when about to generate "hello".
   *
   * Additionally, the stop parameter supports passing in an array of strings to support
   * scenarios using multiple stops.
   */
  stopWords?: string[];

  dashscopeApiKey?: string;

  /**
   * Some models are equipped with an internet search service. This parameter controls 
   * whether the model references internet search results during text generation. The 
   * values are as follows:
   * 
   * - True: Internet search is enabled. The model will use the search results as reference 
   *         information during the text generation process, but it will make its own 
   *         determination based on its internal logic on whether to use the internet 
   *         search results.
   * - False (default): Internet search is disabled.
   * 
   * Models that are allowed internet search:
   * - `qwen-turbo`
   * - `qwen-plus`
   * - `qwen-max-1201`
   * - `qwen-max-longcontext`
   */
  enableSearch?: boolean;

  /**
   * Holds any additional parameters that are valid to pass to
   * VertexAI models that are not explicitly specified on the class.
   */
  additionalKwargs?: Record<string, unknown>;
}

export interface QwenImageData {
  /**
   * The URL of the image data. The image type support bmp, jpg, jpeg, png, tiff.
   */
  image: string;

  text: never;
}

export interface QwenTextData {
  image: never;

  /**
   * The text input
   */
  text: string;
}

export type QwenData = QwenImageData | QwenTextData;

export interface QwenChatMessage {
  role: 'system' | 'user' | 'assistant';

  content: string | QwenData[];
}

export interface QwenChatInput extends DashScopeBaseInput {
  messages: QwenChatMessage[];
}

export function checkModelForQwen(modelName?: string): boolean {
  return (
    modelName !== undefined &&
    (modelName.startsWith('qwen-') ||
      modelName.startsWith('qwen-vl-'))
  );
}

export function checkModelForQwenVL(modelName?: string): boolean {
  return (
    modelName !== undefined &&
    (modelName.startsWith('qwen-vl-v1') ||
      modelName.startsWith('qwen-vl-chat-v1'))
  );
}