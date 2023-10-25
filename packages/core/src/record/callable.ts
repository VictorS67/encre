import {
  RecordId,
  RecordType,
  SecretFields,
  SerializedFields,
  SerializedKeyAlias,
  keyToJson,
  mapKeyTypes,
  mapKeys,
} from '../load/keymap';
import {
  Serializable,
  Serialized,
  SerializedInputRecord,
} from '../load/serializable';
import { AsyncCallError, AsyncCaller } from '../utils/asyncCaller';

export type CallableConfigFields = {
  [key: string]: unknown;
};

export type CallableConfig = {
  /**
   * Name of the callable class.
   */
  name?: string;

  /**
   * Tags for this call and any sub-calls.
   */
  tags?: string[];

  /**
   * Metadata for this call and any sub-calls.
   */
  metadata?: CallableConfigFields;

  /**
   * Callbacks for this calls and any sub-calls.
   * TODO: Add callbacks.
   */
  callbacks?: any;
};

export type CallableFunc<CallInput, CallOutput> = (
  input: CallInput
) => CallOutput | Promise<CallOutput>;

export type CallableBindArgs<
  CallInput,
  CallOutput,
  CallOptions extends CallableConfig,
> = {
  bound: Callable<CallInput, CallOutput, CallOptions>;
  kwargs: Partial<CallOptions>;
  config: CallableConfig;
};

export type CallableEachArgs<
  CallInput,
  CallOutput,
  CallOptions extends CallableConfig,
> = {
  bound: Callable<CallInput, CallOutput, CallOptions>;
};

export type CallableBatchOptions = {
  maxConcurrency?: number;
  returnExceptions?: boolean;
};

export abstract class Callable<
  CallInput = unknown,
  CallOutput = unknown,
  CallOptions extends CallableConfig = CallableConfig,
> extends Serializable {
  _isCallable = true;

  abstract invoke(
    input: CallInput,
    options?: Partial<CallOptions>
  ): Promise<CallOutput>;

  protected async _callWithConfig<T extends CallInput>(
    func: (input: T) => Promise<CallOutput>,
    input: T,
    options?: Partial<CallOptions>
  ): Promise<CallOutput> {
    let output: CallOutput;

    /*eslint no-useless-catch: "warn"*/
    try {
      output = await func.bind(this)(input, options);
    } catch (e) {
      throw e;
    }

    return output;
  }

  protected async _batchWithConfig<T extends CallInput>(
    func: (
      input: T[],
      options?: Partial<CallOptions>[],
      batchOptions?: CallableBatchOptions
    ) => Promise<(CallOutput | Error)[]>,
    inputs: T[],
    options?: Partial<CallOptions> | Partial<CallOptions>[],
    batchOptions?: CallableBatchOptions
  ): Promise<(CallOutput | Error)[]> {
    const optionsList: Partial<CallOptions>[] = this._getOptionsList(
      options ?? {},
      inputs.length
    );

    let outputs: (CallOutput | Error)[];
    try {
      outputs = await func(inputs, optionsList, batchOptions);
    } catch (e) {
      throw e;
    }

    return outputs;
  }

  protected _getOptionsList(
    options?: Partial<CallOptions> | Partial<CallOptions>[],
    repeatTimes?: number
  ): Partial<CallOptions>[] {
    if (!options) return [];

    if (!Array.isArray(options)) {
      return Array.from({ length: repeatTimes || 1 }, () => options);
    }

    if (repeatTimes && options.length !== repeatTimes) {
      throw new Error(
        `Passed "options" must be an array with the same length as the inputs, but got ${options.length} options for ${repeatTimes} inputs`
      );
    }

    return options;
  }

  withConfig(
    config: CallableConfig
  ): CallableBind<CallInput, CallOutput, CallOptions> {
    return new CallableBind({ bound: this, kwargs: {}, config });
  }

  withFallbacks(fields: {
    fallbacks: Callable<CallInput, CallOutput>[];
  }): CallableWithFallbacks<CallInput, CallOutput> {
    return new CallableWithFallbacks<CallInput, CallOutput>({
      callable: this,
      fallbacks: fields.fallbacks,
    });
  }

  bind(
    kwargs: Partial<CallOptions>
  ): Callable<CallInput, CallOutput, CallOptions> {
    return new CallableBind({ bound: this, kwargs, config: {} });
  }

  map(): Callable<CallInput[], CallOutput[], CallOptions> {
    return new CallableEach({ bound: this });
  }

  /**
   * Batch calls invoke N times, where N is the length of inputs.
   * Subclasses would override this method with different arguments and returns.
   * @param inputs Array of inputs in each call in a batch.
   * @param options Either a single call options to apply to each call or an array of options for each call.
   * @param batchOptions.maxConcurrency Max number of calls to run at once.
   * @param batchOptions.returnExceptions Whether to return errors rather than throwing on the first error.
   * @returns An arrays of CallOutputs, or mixed CallOutputs and Errors (if returnExceptions is true).
   */
  async batch(
    inputs: CallInput[],
    options?: Partial<CallOptions> | Partial<CallOptions>[],
    batchOptions?: CallableBatchOptions & { returnExceptions?: false }
  ): Promise<CallOutput[]>;

  async batch(
    inputs: CallInput[],
    options?: Partial<CallOptions> | Partial<CallOptions>[],
    batchOptions?: CallableBatchOptions & { returnExceptions: true }
  ): Promise<(CallOutput | Error)[]>;

  async batch(
    inputs: CallInput[],
    options?: Partial<CallOptions> | Partial<CallOptions>[],
    batchOptions?: CallableBatchOptions
  ): Promise<(CallOutput | Error)[]>;

  async batch(
    inputs: CallInput[],
    options?: Partial<CallOptions> | Partial<CallOptions>[],
    batchOptions?: CallableBatchOptions
  ): Promise<(CallOutput | Error)[]> {
    const optionsList: Partial<CallOptions>[] = this._getOptionsList(
      options ?? {},
      inputs.length
    );

    const caller = new AsyncCaller({
      maxConcurrency: batchOptions?.maxConcurrency,
      onFailedAttempt: (e: AsyncCallError) => {
        throw e as Error;
      },
    });

    const batchCalls: Promise<CallOutput | Error>[] = inputs.map((input, i) =>
      caller.call(async () => {
        try {
          const result: CallOutput = await this.invoke(input, optionsList[i]);
          return result;
        } catch (e) {
          if (batchOptions?.returnExceptions) {
            return e as Error;
          }
          throw e as Error;
        }
      })
    );

    return Promise.all(batchCalls);
  }

  async toRecord(
    outputs: CallOutput,
    parent?: RecordId | undefined
  ): Promise<Serialized> {
    return super.toRecord(outputs, parent);
  }

  protected _splitCallableOptionsFromCallOptions(
    options: Partial<CallOptions> = {}
  ): [CallableConfig, Omit<Partial<CallOptions>, keyof CallableConfig>] {
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

    return [callableOptions, callOptionsCopy];
  }
}

export class CallableBind<
  CallInput,
  CallOutput,
  CallOptions extends CallableConfig,
> extends Callable<CallInput, CallOutput, CallOptions> {
  _isCallable = true;

  _isSerializable = true;

  _namespace: string[] = ['record', 'callable'];

  static _name(): string {
    return 'CallableBind';
  }

  bound: Callable<CallInput, CallOutput, CallOptions>;

  config: CallableConfig;

  protected kwargs: Partial<CallOptions>;

  constructor(fields: CallableBindArgs<CallInput, CallOutput, CallOptions>) {
    super(fields);
    this.bound = fields.bound;
    this.kwargs = fields.kwargs;
    this.config = fields.config;
  }

  protected _mergeConfig(config?: CallableConfig): Partial<CallOptions> {
    const configCopy: CallableConfig = { ...this.config };

    if (config) {
      for (const key of Object.keys(config)) {
        if (key === 'metadata') {
          configCopy[key] = { ...configCopy[key], ...config[key] };
        } else if (key === 'tags') {
          configCopy[key] = (configCopy[key] ?? []).concat(config[key] ?? []);
        } else {
          configCopy[key] = config[key] ?? configCopy[key];
        }
      }
    }

    return configCopy as Partial<CallOptions>;
  }

  bind(
    kwargs: Partial<CallOptions>
  ): CallableBind<CallInput, CallOutput, CallOptions> {
    return this.constructor({
      bound: this.bound,
      kwargs: { ...this.kwargs, ...kwargs },
      config: this.config,
    });
  }

  withConfig(
    config: CallableConfig
  ): CallableBind<CallInput, CallOutput, CallOptions> {
    return this.constructor({
      bound: this.bound,
      kwargs: this.kwargs,
      config: { ...this.config, ...config },
    });
  }

  async invoke(
    input: CallInput,
    options?: Partial<CallOptions> | undefined
  ): Promise<CallOutput> {
    return this.bound.invoke(
      input,
      this._mergeConfig({ ...options, ...this.kwargs })
    );
  }

  async batch(
    inputs: CallInput[],
    options?: Partial<CallOptions> | Partial<CallOptions>[],
    batchOptions?: CallableBatchOptions & { returnExceptions?: false }
  ): Promise<CallOutput[]>;

  async batch(
    inputs: CallInput[],
    options?: Partial<CallOptions> | Partial<CallOptions>[],
    batchOptions?: CallableBatchOptions & { returnExceptions: true }
  ): Promise<(CallOutput | Error)[]>;

  async batch(
    inputs: CallInput[],
    options?: Partial<CallOptions> | Partial<CallOptions>[],
    batchOptions?: CallableBatchOptions
  ): Promise<(CallOutput | Error)[]>;

  async batch(
    inputs: CallInput[],
    options?: Partial<CallOptions> | Partial<CallOptions>[],
    batchOptions?: CallableBatchOptions
  ): Promise<(CallOutput | Error)[]> {
    const mergedOptions = Array.isArray(options)
      ? options.map((option: Partial<CallOptions>) =>
          this._mergeConfig({ ...option, ...this.kwargs })
        )
      : this._mergeConfig({ ...options, ...this.kwargs });

    return this.batch(inputs, mergedOptions, batchOptions);
  }

  async toInputRecord(
    aliases: SerializedKeyAlias,
    secrets: SecretFields,
    kwargs: SerializedFields
  ): Promise<Serialized> {
    return {
      _grp: 2,
      _type: 'input_record',
      _id: this._id,
      _recordId: await this._getRecordId(),
      _kwargs: mapKeys(
        Object.keys(secrets).length
          ? this._removeSecret(kwargs, secrets)
          : kwargs,
        keyToJson,
        aliases
      ),
    };
  }

  async toEventRecord(
    aliases: SerializedKeyAlias,
    secrets: SecretFields,
    kwargs: SerializedFields,
    outputs: CallOutput,
    parent?: RecordId | undefined
  ): Promise<Serialized> {
    let serializedOutputs: SerializedFields;
    if (typeof outputs === 'object') {
      serializedOutputs = (outputs ?? {}) as SerializedFields;
    } else {
      serializedOutputs = (outputs ? { outputs } : {}) as SerializedFields;
    }

    const inputKwargs = (await this.toInputRecord(
      aliases,
      secrets,
      kwargs
    )) as SerializedInputRecord;

    const { _kwargs, ...args } = inputKwargs;

    const currCallableBindArgs = _kwargs as CallableBindArgs<
      CallInput,
      CallOutput,
      CallOptions
    >;

    const callableBindBound: Serialized =
      await currCallableBindArgs.bound.toRecord(outputs, parent);

    const callableBindKwargs: Partial<CallOptions> =
      currCallableBindArgs.kwargs;

    const callableBindConfig: SerializedFields = mapKeyTypes(
      Object.keys(secrets).length
        ? this._removeSecret(currCallableBindArgs.config, secrets)
        : currCallableBindArgs.config,
      keyToJson,
      aliases
    );

    return {
      _grp: 2,
      _type: 'event_record',
      _id: this._id,
      _recordId: await this._getRecordId(),
      _kwargs: mapKeys(
        Object.keys(secrets).length
          ? this._replaceSecret(kwargs, secrets)
          : kwargs,
        keyToJson,
        aliases
      ),
      _metadata: {
        _recordType: RecordType.EVENT,
        _secrets: await this._getSecretRecord(kwargs, secrets),
        _inputs: {
          ...args,
          _kwargs: {
            bound: callableBindBound,
            kwargs: callableBindKwargs,
            config: callableBindConfig,
          },
        },
        _outputs: (await this.toOutputRecord(
          aliases,
          secrets,
          serializedOutputs
        )) as SerializedFields,
        _parent: parent,
      },
    };
  }
}

export class CallableEach<
  CallInputItem,
  CallOutputItem,
  CallOptions extends CallableConfig,
> extends Callable<CallInputItem[], CallOutputItem[], CallOptions> {
  _isCallable = true;

  _isSerializable = true;

  _namespace: string[] = ['record', 'callable'];

  bound: Callable<CallInputItem, CallOutputItem, CallOptions>;

  constructor(
    fields: CallableEachArgs<CallInputItem, CallOutputItem, CallOptions>
  ) {
    super(fields);
    this.bound = fields.bound;
  }

  bind(kwargs: Partial<CallOptions>) {
    return new CallableEach({ bound: this.bound.bind(kwargs) });
  }

  async invoke(
    inputs: CallInputItem[],
    options?: Partial<CallOptions>
  ): Promise<CallOutputItem[]> {
    return this._callWithConfig(this._invoke, inputs, options);
  }

  async toRecord(
    outputs: CallOutputItem[],
    parent?: RecordId | undefined
  ): Promise<Serialized> {
    return super.toRecord(outputs, parent);
  }

  protected async _invoke(
    inputs: CallInputItem[],
    options?: Partial<CallOptions>
  ): Promise<CallOutputItem[]> {
    return this.bound.batch(inputs, options);
  }

  async toInputRecord(
    aliases: SerializedKeyAlias,
    secrets: SecretFields,
    kwargs: SerializedFields
  ): Promise<Serialized> {
    return {
      _grp: 2,
      _type: 'input_record',
      _id: this._id,
      _recordId: await this._getRecordId(),
      _kwargs: mapKeys(
        Object.keys(secrets).length
          ? this._removeSecret(kwargs, secrets)
          : kwargs,
        keyToJson,
        aliases
      ),
    };
  }

  async toEventRecord(
    aliases: SerializedKeyAlias,
    secrets: SecretFields,
    kwargs: SerializedFields,
    outputs: CallOutputItem[],
    parent?: RecordId | undefined
  ): Promise<Serialized> {
    const serializedOutputs: SerializedFields = { outputs };

    const inputKwargs = (await this.toInputRecord(
      aliases,
      secrets,
      kwargs
    )) as SerializedInputRecord;

    const { _kwargs, ...args } = inputKwargs;

    const currCallableEachArgs = _kwargs as CallableEachArgs<
      CallInputItem,
      CallOutputItem,
      CallOptions
    >;

    const callableBindBound: Serialized =
      await currCallableEachArgs.bound.toRecord(outputs[0], parent);

    return {
      _grp: 2,
      _type: 'event_record',
      _id: this._id,
      _recordId: await this._getRecordId(),
      _kwargs: mapKeys(
        Object.keys(secrets).length
          ? this._replaceSecret(kwargs, secrets)
          : kwargs,
        keyToJson,
        aliases
      ),
      _metadata: {
        _recordType: RecordType.EVENT,
        _secrets: await this._getSecretRecord(kwargs, secrets),
        _inputs: {
          ...args,
          _kwargs: {
            bound: callableBindBound,
          },
        },
        _outputs: (await this.toOutputRecord(
          aliases,
          secrets,
          serializedOutputs
        )) as SerializedFields,
        _parent: parent,
      },
    };
  }
}

export class CallableWithFallbacks<CallInput, CallOutput> extends Callable<
  CallInput,
  CallOutput
> {
  _namespace: string[] = ['record', 'callable'];

  _isCallable = true;

  _isSerializable = true;

  static _name(): string {
    return 'CallableWithFallbacks';
  }

  protected callable: Callable<CallInput, CallOutput>;

  protected fallbacks: Callable<CallInput, CallOutput>[];

  constructor(fields: {
    callable: Callable<CallInput, CallOutput>;
    fallbacks: Callable<CallInput, CallOutput>[];
  }) {
    super(fields);
    this.callable = fields.callable;
    this.fallbacks = fields.fallbacks;
  }

  *callables() {
    yield this.callable;
    for (const callable of this.fallbacks) {
      yield callable;
    }
  }

  async invoke(
    input: CallInput,
    options?: Partial<CallableConfig> | undefined
  ): Promise<CallOutput> {
    let firstError: Error | undefined;

    for (const callable of this.callables()) {
      try {
        const output: CallOutput = await callable.invoke(input, options);

        return output;
      } catch (e) {
        if (firstError === undefined) {
          firstError = e as Error;
        }
      }
    }

    if (firstError === undefined) {
      throw new Error('Fallbacks end without Error stored.');
    }

    throw firstError;
  }

  /**
   * Batch calls invoke N times, where N is the length of inputs.
   * Subclasses would override this method with different arguments and returns.
   * @param inputs Array of inputs in each call in a batch.
   * @param options Either a single call options to apply to each call or an array of options for each call.
   * @param batchOptions.maxConcurrency Max number of calls to run at once.
   * @param batchOptions.returnExceptions Whether to return errors rather than throwing on the first error.
   * @returns An arrays of CallOutputs, or mixed CallOutputs and Errors (if returnExceptions is true).
   */
  async batch(
    inputs: CallInput[],
    options?: Partial<CallableConfig> | Partial<CallableConfig>[],
    batchOptions?: CallableBatchOptions & { returnExceptions?: false }
  ): Promise<CallOutput[]>;

  async batch(
    inputs: CallInput[],
    options?: Partial<CallableConfig> | Partial<CallableConfig>[],
    batchOptions?: CallableBatchOptions & { returnExceptions: true }
  ): Promise<(CallOutput | Error)[]>;

  async batch(
    inputs: CallInput[],
    options?: Partial<CallableConfig> | Partial<CallableConfig>[],
    batchOptions?: CallableBatchOptions
  ): Promise<(CallOutput | Error)[]>;

  async batch(
    inputs: CallInput[],
    options?: Partial<CallableConfig> | Partial<CallableConfig>[],
    batchOptions?: CallableBatchOptions
  ): Promise<(CallOutput | Error)[]> {
    const optionsList: Partial<CallableConfig>[] = this._getOptionsList(
      options ?? {},
      inputs.length
    );

    let firstError: Error | undefined;

    for (const callable of this.callables()) {
      try {
        const outputs = await callable.batch(inputs, options, batchOptions);

        return outputs;
      } catch (e) {
        if (firstError === undefined) {
          firstError = e as Error;
        }
      }
    }

    if (firstError === undefined) {
      throw new Error('Fallbacks end without Error stored.');
    }

    throw firstError;
  }
}
