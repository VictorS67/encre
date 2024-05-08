import { CallableConfig } from '../../../record/callable.js';
import { BaseEvent, BaseEventParams } from '../../base.js';
import { Context } from '../../input/load/docs/context.js';

export interface BaseRetrieverCallOptions extends BaseEventParams {}

export interface BaseRetrieverParams extends BaseEventParams {}

export abstract class BaseRetriever<
    Source = unknown,
    Metadata = Record<string, unknown>,
    CallOptions extends BaseRetrieverCallOptions = BaseRetrieverCallOptions,
  >
  extends BaseEvent<Source, Context<Metadata>[], CallOptions>
  implements BaseRetrieverParams
{
  declare SerializedCallOptions: Omit<CallOptions, keyof CallableConfig>;

  _isSerializable = false;

  _eventNamespace(): string[] {
    return ['inference', 'retrieve', this._sourceType(), this._retrieverType()];
  }

  constructor(fields?: BaseRetrieverParams) {
    super(fields ?? {});
  }

  abstract _sourceType(): string;

  abstract _retrieverType(): string;

  async invoke(
    input: Source,
    options?: CallOptions
  ): Promise<Context<Metadata>[]> {
    const result: Context<Metadata>[] = await this.retrieve(
      input,
      options,
      options?.callbacks
    );

    return result;
  }

  abstract retrieve(
    query: Source,
    options?: CallOptions,
    callbacks?: any
  ): Promise<Context<Metadata>[]>;

  protected _splitCallableOptionsFromCallOptions(
    options: Partial<CallOptions> = {}
  ): [CallableConfig, this['SerializedCallOptions']] {
    const callableOptions: CallableConfig = {
      name: options.name,
      tags: options.tags,
      metadata: options.metadata,
      callbacks: options.callbacks,
    };

    const callOptionsCopy: Partial<CallOptions> = { ...options };
    delete callOptionsCopy.name;
    delete callOptionsCopy.tags;
    delete callOptionsCopy.metadata;
    delete callOptionsCopy.callbacks;

    return [callableOptions, callOptionsCopy as this['SerializedCallOptions']];
  }
}

export interface BaseTextRetrieverCallOptions
  extends BaseRetrieverCallOptions {}

export interface BaseTextRetrieverParams extends BaseRetrieverParams {}

export abstract class BaseTextRetriever<
    Metadata = Record<string, unknown>,
    CallOptions extends BaseRetrieverCallOptions = BaseRetrieverCallOptions,
  >
  extends BaseRetriever<string, Metadata, CallOptions>
  implements BaseTextRetrieverParams
{
  _sourceType(): string {
    return 'text';
  }

  abstract _retrieve(
    query: string,
    options: this['SerializedCallOptions']
  ): Promise<Context<Metadata>[]>;

  async retrieve(
    query: string,
    options?: CallOptions,
    callbacks?: any
  ): Promise<Context<Metadata>[]> {
    if (Array.isArray(query) || typeof query !== 'string') {
      throw new Error("Argument 'query' must be string");
    }

    const [callableOptions, serializedCallOptions] =
      this._splitCallableOptionsFromCallOptions(options);

    callableOptions.callbacks = callableOptions.callbacks ?? callbacks;

    return this._retrieve(query, serializedCallOptions);
  }
}

export interface BaseEmbeddingRetrieverCallOptions
  extends BaseRetrieverCallOptions {}

export interface BaseEmbeddingRetrieverParams extends BaseRetrieverParams {}

export abstract class BaseEmbeddingRetriever<
    Metadata = Record<string, unknown>,
    CallOptions extends BaseRetrieverCallOptions = BaseRetrieverCallOptions,
  >
  extends BaseRetriever<number[], Metadata, CallOptions>
  implements BaseTextRetrieverParams
{
  _sourceType(): string {
    return 'embedding';
  }

  abstract _retrieve(
    query: number[],
    options: this['SerializedCallOptions']
  ): Promise<Context<Metadata>[]>;

  async retrieve(
    query: number[],
    options?: CallOptions,
    callbacks?: any
  ): Promise<Context<Metadata>[]> {
    if (!Array.isArray(query) || typeof query[0] !== 'number') {
      throw new Error("Argument 'query' must be number array");
    }

    const [callableOptions, serializedCallOptions] =
      this._splitCallableOptionsFromCallOptions(options);

    callableOptions.callbacks = callableOptions.callbacks ?? callbacks;

    return this._retrieve(query, serializedCallOptions);
  }
}
