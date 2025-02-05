import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { BaseLMCallOptions } from '../../base.js';

export type GeminiContentRole = 'model' | 'user';

/**
 * Options specific to Vertex AI calls, extending the base language model call options.
 */
export interface VertexAICallOptions extends BaseLMCallOptions {
  /**
   * The base Vertex AI endpoint to use for the request.
   * If not provided, the default regionalized endpoint
   * (i.e. us-central1-aiplatform.googleapis.com) will be used.
   */
  apiEndpoint?: string;
}

/**
 * Settings to manage safety thresholds for content generated or processed by the model.
 * @example
 * ```typescript
 * const safetySetting: GeminiSafetySetting = {
 *   category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
 *   threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
 * };
 * ```
 */
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

/**
 * Defines a function that can be called by the model during its execution. Functions
 * allow the model to perform actions or fetch data as needed.
 * @example
 * ```typescript
 * const function: GeminiFunction = {
 *   name: 'get_current_weather',
 *   description: 'get weather in a given location',
 *   parameters: {
 *     type: FunctionDeclarationSchemaType.OBJECT,
 *     properties: {
 *       location: {type: FunctionDeclarationSchemaType.STRING},
 *       unit: {
 *         type: FunctionDeclarationSchemaType.STRING,
 *         enum: ['celsius', 'fahrenheit'],
 *       }
 *     },
 *     required: ['location']
 *   }
 * };
 * ```
 */
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

/**
 * Represents a collection of Gemini functions that can be utilized by the model.
 * @example
 * ```typescript
 * const tools: GeminiTool = {
 *   functionDeclarations: [
 *     {
 *       name: 'get_current_weather',
 *       description: 'get weather in a given location',
 *       parameters: {
 *         type: FunctionDeclarationSchemaType.OBJECT,
 *         properties: {
 *           location: {type: FunctionDeclarationSchemaType.STRING},
 *           unit: {
 *             type: FunctionDeclarationSchemaType.STRING,
 *             enum: ['celsius', 'fahrenheit'],
 *           }
 *         },
 *         required: ['location']
 *       }
 *     }
 *   ]
 * };
 * ```
 */
export interface GeminiTool {
  /**
   * One or more function declarations. Each function declaration contains
   * information about one function.
   */
  functionDeclarations: Array<GeminiFunction>;
}

/**
 * Configuration options for making calls to the Gemini model, including tools and
 * safety settings.
 */
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

/**
 * Base configuration options for calls to the Vertex AI models. This includes
 * settings that control how the AI generates responses, such as temperature and top-k.
 */
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
   * Top-K changes how the model selects tokens for output. A top-K of 1 means
   * the next selected token is the most probable among all tokens in the model's
   * vocabulary (also called greedy decoding), while a top-K of 3 means that
   * the next token is selected from among the three most probable tokens by
   * using temperature.
   *
   * For each token selection step, the top-K tokens with the highest probabilities
   * are sampled. Then tokens are further filtered based on top-P with the final
   * token selected using temperature sampling.
   *
   * Specify a lower value for less random responses and a higher value for more
   * random responses.
   *
   * Range: 1 - 40
   */
  topK: number;

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

  /**
   * API key to use when making requests to Gemini. Defaults to the value of
   * `GOOGLE_API_KEY` environment variable.
   */
  googleApiKey?: string;

  /**
   * Holds any additional parameters that are valid to pass to
   * VertexAI models that are not explicitly specified on the class.
   */
  additionalKwargs?: Record<string, unknown>;
}

/**
 * Enum representing supported MIME types for media files used in Gemini model interactions.
 * This includes various image and video formats.
 *
 * @enum
 */
export enum GeminiMimeType {
  PNG = 'image/png',
  JPEG = 'image/jpeg',
  WEBP = 'image/webp',
  HEIC = 'image/heic',
  HEIF = 'image/heif',
}

/**
 * Represents inline media data, such as images or videos, to be included directly in model
 * inputs. It includes the media type and the base64-encoded data.
 * @example
 * ```typescript
 * const inlineData: GeminiInlineData = {
 *   mimeType: GeminiMimeType.PNG,
 *   data: 'iVBORw0KGgoAAAANSUhEUgAAAAUA...'
 * };
 * ```
 */
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
 * Defines a part of the input for a Gemini model call, which can be either text
 * or inline data like images.
 * @example
 * ```typescript
 * const textData: GeminiInputPart = {
 *   text: "this is a text prompt"
 * };
 *
 * const imageData: GeminiInputPart = {
 *   inlineData: {
 *     mimeType: GeminiMimeType.PNG,
 *     data: 'iVBORw0KGgoAAAANSUhEUgAAAAUA...'
 *   }
 * };
 * ```
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

/**
 * Describes the content to be processed by the Gemini model, specifying the role
 * associated with the content and the parts that make up the input.
 * @example
 * ```typescript
 * const content: GeminiContent = {
 *   role: "user",
 *   parts: [
 *     {
 *       text: "please describe the picture."
 *     },
 *     {
 *       inlineData: {
 *         mimeType: GeminiMimeType.PNG,
 *         data: 'iVBORw0KGgoAAAANSUhEUgAAAAUA...'
 *       }
 *     }
 *   ]
 * };
 * ```
 */
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

/**
 * Overall input structure for a Gemini model call, incorporating various elements
 * like temperature, topP, and specific contents.
 */
export interface GeminiInput extends VertexAIBaseInput {
  /** Gemini contents to pass as a prefix to the prompt */
  contents: Array<GeminiContent>;
}

/**
 * Checks if a given model name is suitable for Gemini.
 *
 * @param modelName - The model name to check.
 * @returns True if the model is compatible with Gemini, false otherwise.
 */
export function checkModelForGemini(modelName?: string): boolean {
  return modelName !== undefined && modelName.startsWith('gemini-');
}

/**
 * Checks if a given model supports vision capabilities within the Gemini.
 *
 * @param modelName - The model name to check.
 * @returns True if the model supports vision features, false otherwise.
 */
export function checkModelForGeminiVision(modelName?: string): boolean {
  return (
    modelName !== undefined &&
    modelName.startsWith('gemini-') &&
    modelName.includes('vision')
  );
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
