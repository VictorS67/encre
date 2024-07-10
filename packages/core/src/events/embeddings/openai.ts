import {
  OpenAI as OpenAIClient,
  ClientOptions as OpenAIClientOptions,
} from 'openai';
import type { RequestOptions as OpenAIClientRequestOptions } from 'openai/core';
import { type SecretFields, type SerializedFields } from '../../load/keymap.js';
import { getEnvironmentVariables } from '../../utils/environment.js';
import { type EmbedResult } from '../output/provide/index.js';
import {
  BaseEmbeddings,
  type BaseEmbeddingsCallOptions,
  type BaseEmbeddingsParams,
} from './base.js';

/**
 * Parameters for the OpenAI embeddings, including model and API key specifics.
 */
export interface OpenAIEmbeddingsParams extends BaseEmbeddingsParams {
  /**
   * ID of the model to use. You can use the [List models]({@link https://platform.openai.com/docs/api-reference/models/list}}
   * API to see all of your avaliable models, or see our
   * [Model overview]({@link https://platform.openai.com/docs/models/overview}) for description of them.
   */
  modelName: string;

  /**
   * The number of dimensions the resulting output embeddings should have.
   * Only supported in `text-embedding-3` and later models.
   */
  dimensions?: number;

  /**
   * A unique identifier representing your end-user, which can help OpenAI to monitor
   * and detect abuse.
   *
   * [Learn more]({@link https://platform.openai.com/docs/guides/safety-best-practices})
   */
  user?: string;

  /**
   * API key to use when making requests to OpenAI. Defaults to the value of
   * `OPENAI_API_KEY` environment variable.
   */
  openAIApiKey?: string;

  /**
   * Timeout for the API requests.
   */
  timeout?: number;
}

/**
 * Call options for OpenAI embeddings, including format and additional request options.
 */
export interface OpenAIEmbeddingsCallOptions extends BaseEmbeddingsCallOptions {
  /**
   * Format of the encoding for the embeddings, either as 'float' or 'base64'.
   */
  encondingFormat?: 'float' | 'base64';

  /**
   * Additional options to pass to the underlying axios request.
   */
  options?: OpenAIClientRequestOptions;
}

/**
 * Class to handle embeddings via the OpenAI API, extending the base embeddings functionality.
 *
 * @example
 * ```typescript
 * const embeddings = new OpenAIEmbeddings({ modelName: 'text-embedding-ada-002' });
 * const options = { encondingFormat: 'float' };
 * const response = await embeddings.invoke('Hello!', options);
 * console.log(response);
 * ```
 */
export class OpenAIEmbeddings<
    CallOptions extends
      OpenAIEmbeddingsCallOptions = OpenAIEmbeddingsCallOptions,
  >
  extends BaseEmbeddings<CallOptions>
  implements OpenAIEmbeddingsParams
{
  _isSerializable = true;

  get _secrets(): SecretFields | undefined {
    return {
      openAIApiKey: 'OPENAI_API_KEY',
      organization: 'OPENAI_ORGANIZATION',
    };
  }

  get _aliases(): SerializedFields | undefined {
    return {
      modelName: 'model',
      openAIApiKey: 'openai_api_key',
    };
  }

  static _name(): string {
    return 'OpenAI';
  }

  _embeddingsType(): string {
    return 'openai';
  }

  /**
   * ID of the model to use. You can use the [List models]({@link https://platform.openai.com/docs/api-reference/models/list}}
   * API to see all of your avaliable models, or see our
   * [Model overview]({@link https://platform.openai.com/docs/models/overview}) for description of them.
   */
  modelName = 'text-embedding-ada-002';

  /**
   * The number of dimensions the resulting output embeddings should have.
   * Only supported in `text-embedding-3` and later models.
   */
  dimensions?: number | undefined;

  /**
   * A unique identifier representing your end-user, which can help OpenAI to monitor
   * and detect abuse.
   *
   * [Learn more]({@link https://platform.openai.com/docs/guides/safety-best-practices})
   */
  user?: string | undefined;

  /**
   * The max number of concurrent calls that can be made.
   * Defaults to 2.
   */
  maxConcurrency?: number | undefined;

  /**
   * The max number of retries that can be made for a single call.
   */
  maxRetries?: number | undefined;

  /**
   * Timeout for the API requests.
   */
  timeout?: number;

  /**
   * API key to use when making requests to OpenAI. Defaults to the value of
   * `OPENAI_API_KEY` environment variable.
   */
  openAIApiKey?: string;

  /**
   * Identifier for organization sometimes used in API requests。
   */
  organization?: string;

  /**
   * OpenAI API Client.
   * @internal
   */
  private _client: OpenAIClient;

  /**
   * OpenAI API request options.
   * @internal
   */
  private _clientOptions: OpenAIClientOptions;

  constructor(
    fields?: Partial<OpenAIEmbeddingsParams> & {
      configuration?: OpenAIClientOptions;
    }
  ) {
    fields = {
      modelName: fields?.modelName ?? 'text-embedding-ada-002',
      maxConcurrency: fields?.maxConcurrency ?? 2,
      maxRetries: fields?.maxRetries,
      dimensions: fields?.dimensions,
      user: fields?.user,
      timeout: fields?.timeout,
      ...fields,
    };

    super(fields);

    this.openAIApiKey =
      fields?.openAIApiKey ?? getEnvironmentVariables('OPENAI_API_KEY');

    if (!this.openAIApiKey) {
      throw new Error('OpenAI API Key not found');
    }

    this.modelName = fields?.modelName ?? this.modelName;

    this.maxConcurrency = fields?.maxConcurrency ?? 2;
    this.maxRetries = fields?.maxRetries;
    this.dimensions = fields?.dimensions;
    this.user = fields?.user;
    this.timeout = fields?.timeout;

    this.organization =
      fields?.configuration?.organization ??
      getEnvironmentVariables('OPENAI_ORGANIZATION');

    this._clientOptions = {
      apiKey: this.openAIApiKey,
      organization: this.organization,
      baseURL: fields?.configuration?.baseURL,
      dangerouslyAllowBrowser: true,
      defaultHeaders: fields?.configuration?.defaultHeaders,
      defaultQuery: fields?.configuration?.defaultQuery,
      ...fields?.configuration,
    };
  }

  /**
   * Retrieves the parameters required for creating an embedding with the OpenAI API.
   * This method extracts and prepares the parameters based on the model configurations
   * and any additional options specified in the call.
   *
   * @param options Optional serialized call options which may override default model settings.
   * @returns An object containing the necessary parameters for the OpenAI API request,
   *          excluding the 'input' parameter which is handled separately.
   */
  getParams(
    options?: this['SerializedCallOptions']
  ): Omit<OpenAIClient.EmbeddingCreateParams, 'input'> {
    return {
      model: this.modelName,
      dimensions: this.dimensions,
      encoding_format: options?.encondingFormat,
      user: this.user,
    };
  }

  _identifyParams(): Omit<OpenAIClient.EmbeddingCreateParams, 'input'> & {
    model_name: string;
  } & OpenAIClientOptions {
    return {
      model_name: this.modelName,
      ...this.getParams(),
      ...this._clientOptions,
    };
  }

  /**
   * Embeds a document using the OpenAI API.
   * @param document The document to embed.
   * @param options Serialized call options.
   * @returns A promise resolving to the embedding result.
   * @internal
   * @example
   * ```typescript
   * const embeddings = new OpenAIEmbeddings({ modelName: 'text-embedding-ada-002' });
   * const result = await embeddings._embed("Hello, world!", {});
   * console.log(result.embedding);
   * ```
   */
  async _embed(
    document: string,
    options: this['SerializedCallOptions']
  ): Promise<EmbedResult> {
    const params = this.getParams(options);

    const response = await this.completionWithRetry(
      {
        ...params,
        input: document,
      },
      {
        signal: options?.signal,
        ...options?.options,
      }
    );

    return {
      embedding: response.data[0].embedding,
      embedOutput: {
        tokenUsage: {
          promptTokens: response.usage.prompt_tokens,
          totalTokens: response.usage.total_tokens,
        },
      },
    };
  }

  /**
   * Handles retries for the embedding creation in case of failures.
   * @param request The embedding creation parameters.
   * @param options Optional client request configurations.
   * @returns A promise resolving to the embedding creation response.
   * @example
   * ```typescript
   * const embeddings = new OpenAIEmbeddings({ modelName: 'text-embedding-ada-002' });
   * const requestParams = { input: "Example document", model: "text-embedding-ada-002" };
   * const response = await embeddings.completionWithRetry(requestParams);
   * console.log(response.data[0].embedding);
   * ```
   */
  async completionWithRetry(
    request: OpenAIClient.EmbeddingCreateParams,
    options?: OpenAIClientRequestOptions
  ): Promise<OpenAIClient.Embeddings.CreateEmbeddingResponse> {
    const requestOptions: OpenAIClientRequestOptions =
      this._getRequestOptions(options);
    return this.caller.call(async () => {
      const res = await this._client.embeddings.create(request, requestOptions);
      return res;
    });
  }

  /**
   * Builds request options for the API call, merging default client options with
   * method-specific options.
   * @param options Optional additional request configurations.
   * @returns The combined request options.
   * @internal
   */
  private _getRequestOptions(
    options?: OpenAIClientRequestOptions
  ): OpenAIClientRequestOptions {
    if (!this._client) {
      const params = {
        ...this._clientOptions,
        timeout: this.timeout,
        maxRetries: 0,
      };

      if (!params.baseURL) {
        delete params.baseURL;
      }

      this._client = new OpenAIClient(params);
    }

    const requestOptions: OpenAIClientRequestOptions = {
      ...this._clientOptions,
      ...options,
    };

    return requestOptions;
  }
}
