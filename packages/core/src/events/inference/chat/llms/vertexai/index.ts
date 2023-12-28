import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { BaseLMCallOptions } from '../../base.js';

export type GeminiContentRole = 'model' | 'user';

export interface VertexAICallOptions extends BaseLMCallOptions {
  /**
   * The base Vertex AI endpoint to use for the request.
   * If not provided, the default regionalized endpoint
   * (i.e. us-central1-aiplatform.googleapis.com) will be used.
   */
  apiEndpoint?: string;
}

export interface GeminiSafetySetting {
  /**
   * The safety category to configure a threshold for.
   */
  category: HarmCategory;

  /**
   * The threshold for blocking responses that could belong to the specified
   * safety category based on probability.
   */
  threshold: HarmBlockThreshold;
}

export interface GeminiFunction {
  /**
   * The name of the function to call. Must start with a letter or an
   * underscore. Must be a-z, A-Z, 0-9, or contain underscores and dashes,
   * with a maximum length of 64.
   */
  name: string;

  /**
   * The description and purpose of the function. The model uses this to
   * decide how and whether to call the function. For the best results,
   * we recommend that you include a description.
   */
  description?: string;

  /**
   * The parameters of this function in a format that's compatible with
   * the OpenAPI schema format.
   *
   * @see https://spec.openapis.org/oas/v3.0.3#schema
   */
  parameters: {
    [key: string]: unknown;
  };
}

export interface GeminiTool {
  /**
   * One or more function declarations. Each function declaration contains
   * information about one function.
   */
  functionDeclarations: Array<GeminiFunction>;
}

export interface GeminiCallOptions extends VertexAICallOptions {
  /**
   * A piece of code that enables the system to interact with external systems
   * to perform an action, or set of actions, outside of knowledge and scope
   * of the model.
   */
  tools?: Array<GeminiTool>;

  /**
   * The Vertex AI Gemini API blocks unsafe content based on a list of safety
   * attributes and their configured blocking thresholds.
   */
  safetySettings: Array<GeminiSafetySetting>;
}

export interface VertexAITextCallOptions extends VertexAICallOptions {
  /**
   * This is default to `google`.
   */
  publisher: string;

  /**
   * Configure the parent resource.
   *
   * Formatting like this:
   * projects/${projectId}/locations/${location}/publishers/${publisher}/models/${modelName}
   */
  endpoint: string;
}

export interface VertexAIChatCallOptions extends VertexAITextCallOptions {}

export interface VertexAIBaseInput {
  /**
   * The temperature is used for sampling during the response generation,
   * which occurs when topP and topK are applied. Temperature controls the
   * degree of randomness in token selection. Lower temperatures are good
   * for prompts that require a more deterministic and less open-ended or
   * creative response, while higher temperatures can lead to more diverse
   * or creative results.
   *
   * A temperature of 0 is deterministic: the highest probability response
   * is always selected.
   *
   * Range: 0.0 - 1.0
   */
  temperature: number;

  /**
   * Top-P changes how the model selects tokens for output. Tokens are
   * selected from the most (see top-K) to least probable until the sum of
   * their probabilities equals the top-P value.
   *
   * For example, if tokens A, B, and C have a probability of 0.3, 0.2, and
   * 0.1 and the top-P value is 0.5, then the model will select either A or
   * B as the next token by using temperature and excludes C as a candidate.
   *
   * Specify a lower value for less random responses and a higher value for
   * more random responses.
   *
   * Range: 0.0 - 1.0
   */
  topP: number;

  /**
   * The number of response variations to return.
   *
   * This value must be 1.
   */
  candidateCount: number;

  /**
   * Maximum number of tokens that can be generated in the response. A token
   * is approximately four characters. 100 tokens correspond to roughly 60-80
   * words. Specify a lower value for shorter responses and a higher value for
   * potentially longer responses.
   *
   * Range: 1-2048
   */
  maxOutputTokens: number;

  /**
   * Streaming involves receiving responses to prompts as they are generated.
   * That is, as soon as the model generates output tokens, the output tokens
   * are sent.
   */
  streaming: boolean;

  /**
   * ID of the model to use. You can use the
   * {@link https://cloud.google.com/vertex-ai/docs/start/explore-models} API to
   * see all of your available models and the descriptions of them.
   *
   * Gemini model: {@link https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini#model_versions}
   * Text model: {@link https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/text#model_versions}
   * Chat model: {@link https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/text-chat#model_versions}
   */
  modelName: string;

  /**
   * Up to 5 sequences where the API will stop generating text if one of the
   * strings is encountered in the response. If a string appears multiple
   * times in the response, then the response truncates where it's first
   * encountered. The strings are case-sensitive.
   */
  stopSequences?: string[];

  googleApiKey?: string;

  /**
   * Holds any additional parameters that are valid to pass to
   * VertexAI models that are not explicitly specified on the class.
   */
  additionalKwargs?: Record<string, unknown>;
}

export enum GeminiMimeType {
  PNG = 'image/png',
  JPEG = 'image/jpeg',
  WEBP = 'image/webp',
  HEIC = 'image/heic',
  HEIF = 'image/heif',
}

export interface GeminiInlineData {
  /**
   * The media type of the image or video specified in the `data` fields.
   *
   * Maximum video length: 2 minutes.
   *
   * No limit on image resolution.
   */
  mimeType: GeminiMimeType;

  /**
   * The base64 encoding of the image or video to include inline in the prompt.
   * When including media inline, you must also specify {@link GeminiMimeType}.
   *
   * size limit: 20MB
   */
  data: string;
}

/**
 * Union field data can be only one of the following:
 * - text
 * - inlineData
 */
export interface GeminiInputPart {
  /**
   * The text instructions or chat dialogue to include in the prompt.
   */
  text?: string;

  /**
   * Serialized bytes data of the image or video. You can specify at most 1
   * image with {@link GeminiInlineData}. To specify up to 16 images, use
   * {@link GeminiFileData}.
   */
  inlineData?: GeminiInlineData;
}

export interface GeminiContent {
  /**
   * The role in a conversation associated with the content. Specifying a
   * role is required even in singleturn use cases.
   *
   * Acceptable values include the following:
   * - user: Specifies content that's sent by you.
   * - model: Specifies the model's response.
   */
  role: GeminiContentRole;

  /**
   * Ordered parts that make up the input. Parts may have different MIME types.
   */
  parts: Array<GeminiInputPart>;
}

export interface GeminiInput extends VertexAIBaseInput {
  /** Gemini contents to pass as a prefix to the prompt */
  contents: Array<GeminiContent>;
}

export interface VertexAITextInput extends VertexAIBaseInput {
  /**
   * Grounding lets you reference specific data when using language models.
   * When you ground a model, the model can reference internal, confidential,
   * and otherwise specific data from your repository and include the data in
   * the response. Only data stores from Vertex AI Search are supported.
   *
   * Path should follow format:
   * projects/{projectId}/locations/global/collections/{collection_name}/dataStores/{DATA_STORE_ID}
   */
  groundingConfig: string;

  /**
   * Returns the top logprobs most likely candidate tokens with their log
   * probabilities at each generation step. The chosen tokens and their log
   * probabilities at each step are always returned. The chosen token may or may
   * not be in the top logprobs most likely candidates.
   *
   * Range: 0 - 5
   */
  logprobs: number;

  /**
   * Positive values penalize tokens that already appear in the generated text,
   * increasing the probability of generating more diverse content.
   *
   * Acceptable values are -2.0 — 2.0.
   */
  presencePenalty: number;

  /**
   * Positive values penalize tokens that repeatedly appear in the generated text,
   * decreasing the probability of repeating content.
   *
   * Acceptable values are -2.0 — 2.0.
   */
  frequencyPenalty: number;

  /**
   * Mapping of token IDs to their bias values. The bias values are added to the logits
   * before sampling. Larger positive bias increases the probability of choosing the
   * token. Smaller negative bias decreases the probability of choosing the token.
   *
   * You can specify a maximum of 300 mappings. Each mapping can have a value of -100—100.
   */
  logitBias: Record<string, number>;

  /**
   * If true, the prompt is echoed in the generated text.
   */
  echo: boolean;
}

export interface VertexAIChatInput extends VertexAIBaseInput {
  /**
   * Grounding lets you reference specific data when using language models.
   * When you ground a model, the model can reference internal, confidential,
   * and otherwise specific data from your repository and include the data in
   * the response. Only data stores from Vertex AI Search are supported.
   *
   * Path should follow format:
   * projects/{project_id}/locations/global/collections/{collection_name}/dataStores/{DATA_STORE_ID}
   */
  groundingConfig: string;

  /**
   * Returns the top logprobs most likely candidate tokens with their log
   * probabilities at each generation step. The chosen tokens and their log
   * probabilities at each step are always returned. The chosen token may or may
   * not be in the top logprobs most likely candidates.
   *
   * Range: 0 - 5
   */
  logprobs: number;

  /**
   * Positive values penalize tokens that already appear in the generated text,
   * increasing the probability of generating more diverse content.
   *
   * Acceptable values are -2.0 — 2.0.
   */
  presencePenalty: number;

  /**
   * Positive values penalize tokens that repeatedly appear in the generated text,
   * decreasing the probability of repeating content.
   *
   * Acceptable values are -2.0 — 2.0.
   */
  frequencyPenalty: number;

  /**
   * Mapping of token IDs to their bias values. The bias values are added to the logits
   * before sampling. Larger positive bias increases the probability of choosing the
   * token. Smaller negative bias decreases the probability of choosing the token.
   *
   * You can specify a maximum of 300 mappings. Each mapping can have a value of -100—100.
   */
  logitBias: Record<string, number>;

  chatContexts: Array<VertexAIChatContext>;
}

export interface VertexAIChatExampleContext {
  content: string;
}

export interface VertexAIChatExample {
  input: VertexAIChatExampleContext;

  output: VertexAIChatExampleContext;
}

export interface VertexAIChatMessage {
  author: string;
  content: string;
}

export interface VertexAIChatContext {
  /**
   * Context shapes how the model responds throughout the conversation. For example,
   * you can use context to specify words the model can or cannot use, topics to focus
   * on or avoid, or the response format or style.
   */
  context: string;

  /**
   * Examples for the model to learn how to respond to the conversation.
   */
  examples: Array<VertexAIChatExample>;

  /**
   * Conversation history provided to the model in a structured alternate-author form.
   * Messages appear in chronological order: oldest first, newest last. When the
   * history of messages causes the input to exceed the maximum length, the oldest
   * messages are removed until the entire prompt is within the allowed limit.
   */
  messages: Array<VertexAIChatMessage>;
}

export function checkModelForGemini(modelName?: string): boolean {
  return (
    modelName !== undefined &&
    (modelName.startsWith('gemini-pro') ||
      modelName.startsWith('gemini-pro-vision'))
  );
}

export function checkModelForGeminiVision(modelName?: string): boolean {
  return (
    modelName !== undefined &&
    modelName.startsWith('gemini') &&
    modelName.includes('vision')
  );
}

export function checkModelForVertexAIChat(modelName?: string): boolean {
  return modelName !== undefined && modelName.startsWith('chat-bison');
}

/**
 * Generative AI SDK wrap the error in a very simple way. The error message is logged as the
 * following format:
 * `[${response.status} ${response.statusText}] ${message}`
 *
 * @see https://github.com/google/generative-ai-js/blob/2be48f8e5427f2f6191f24bcb8000b450715a0de/packages/main/src/requests/request.ts#L88C50-L88C50
 * @param e
 * @returns
 */
export function wrapGoogleGenerativeAIClientError(e: Error): Error {
  const ERR_REG_EXP = /\[([0-9]{3,}) (.*)\] (.*)/;

  let error: Error;

  const match: RegExpMatchArray | null = e.message.match(ERR_REG_EXP);

  if (match) {
    error = new Error(match[match.length - 1]);
    error.name = 'AbortError';
    error.stack = e.stack;
    return error;
  }

  return e;
}
