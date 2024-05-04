import {
  OpenAI as OpenAIClient,
  ClientOptions as OpenAIClientOptions,
} from "openai";
import type { RequestOptions as OpenAIClientRequestOptions } from "openai/core";
import {
  BaseEmbeddings,
  BaseEmbeddingsCallOptions,
  BaseEmbeddingsParams,
} from "./base.js";
import { EmbedResult } from "../output/provide/embedresult.js";
import { SecretFields, SerializedFields } from "../../load/keymap.js";
import { getEnvironmentVariables } from "../../utils/environment.js";

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

  timeout?: number;
}

export interface OpenAIEmbeddingsCallOptions extends BaseEmbeddingsCallOptions {
  encondingFormat?: "float" | "base64";

  /**
   * Additional options to pass to the underlying axios request.
   */
  options?: OpenAIClientRequestOptions;
}

export class OpenAIEmbeddings<
    CallOptions extends
      OpenAIEmbeddingsCallOptions = OpenAIEmbeddingsCallOptions,
  >
  extends BaseEmbeddings<CallOptions>
  implements OpenAIEmbeddingsParams
{
  _isSerializable: boolean = true;

  get _secrets(): SecretFields | undefined {
    return {
      openAIApiKey: "OPENAI_API_KEY",
      organization: "OPENAI_ORGANIZATION",
    };
  }

  get _aliases(): SerializedFields | undefined {
    return {
      modelName: "model",
      openAIApiKey: "openai_api_key",
    };
  }

  static _name(): string {
    return "OpenAI";
  }

  modelName: string = "text-embedding-ada-002";

  dimensions?: number | undefined;

  user?: string | undefined;

  maxConcurrency?: number | undefined;

  maxRetries?: number | undefined;

  timeout?: number;

  openAIApiKey?: string;

  organization?: string;

  private _client: OpenAIClient;

  private _clientOptions: OpenAIClientOptions;

  constructor(
    fields?: Partial<OpenAIEmbeddingsParams> & {
      configuration?: OpenAIClientOptions;
    }
  ) {
    fields = {
      modelName: fields?.modelName ?? "text-embedding-ada-002",
      maxConcurrency: fields?.maxConcurrency ?? 2,
      maxRetries: fields?.maxRetries,
      dimensions: fields?.dimensions,
      user: fields?.user,
      timeout: fields?.timeout,
      ...fields,
    };

    super(fields);

    this.openAIApiKey =
      fields?.openAIApiKey ?? getEnvironmentVariables("OPENAI_API_KEY");

    if (!this.openAIApiKey) {
      throw new Error("OpenAI API Key not found");
    }

    this.modelName = fields?.modelName ?? this.modelName;

    this.maxConcurrency = fields?.maxConcurrency ?? 2;
    this.maxRetries = fields?.maxRetries;
    this.dimensions = fields?.dimensions;
    this.user = fields?.user;
    this.timeout = fields?.timeout;

    this.organization =
      fields?.configuration?.organization ??
      getEnvironmentVariables("OPENAI_ORGANIZATION");

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

  getParams(
    options?: this["SerializedCallOptions"]
  ): Omit<OpenAIClient.EmbeddingCreateParams, "input"> {
    return {
      model: this.modelName,
      dimensions: this.dimensions,
      encoding_format: options?.encondingFormat,
      user: this.user,
    };
  }

  _identifyParams(): Omit<OpenAIClient.EmbeddingCreateParams, "input"> & {
    model_name: string;
  } & OpenAIClientOptions {
    return {
      model_name: this.modelName,
      ...this.getParams(),
      ...this._clientOptions,
    };
  }

  async _embed(
    document: string,
    options: this["SerializedCallOptions"]
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
      embeddings: response.data[0].embedding,
      embedOutput: {
        tokenUsage: {
          promptTokens: response.usage.prompt_tokens,
          totalTokens: response.usage.total_tokens,
        },
      },
    };
  }

  /**
   * Attempts to get embeddings from the OpenAIClient and retries if an error occurs.
   *
   * @param {OpenAIClient.EmbeddingCreateParams} request The request parameters.
   * @param {OpenAIClientRequestOptions} [options] Optional client request configurations.
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
