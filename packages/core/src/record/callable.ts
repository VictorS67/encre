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
import { ReadableStreamAsyncIterable } from '../utils/stream';
import { convertCallableLikeToCallable } from './utils';

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

export type CallableLike<CallInput = unknown, CallOutput = unknown> =
  | Callable<CallInput, CallOutput>
  | CallableFunc<CallInput, CallOutput>
  | { [key: string]: CallableLike<CallInput, CallOutput> };

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

export type CallableWithFallbacksArg<CallInput, CallOutput> = {
  callable: Callable<CallInput, CallOutput>;
  fallbacks: Callable<CallInput, CallOutput>[];
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

  static isCallable(anything: any): anything is Callable {
    return anything ? anything._isCallable : false;
  }

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

  async *_streamIterator(
    input: CallInput,
    options?: Partial<CallOptions>
  ): AsyncGenerator<CallOutput> {
    yield this.invoke(input, options);
  }

  async stream(
    input: CallInput,
    options?: Partial<CallOptions>
  ): Promise<ReadableStreamAsyncIterable<CallOutput>> {
    return ReadableStreamAsyncIterable.withAsyncGenerator(
      this._streamIterator(input, options)
    );
  }

  pipe<NewCallOutput>(
    callableLike: CallableLike<CallOutput, NewCallOutput>
  ): CallableSequence<CallInput, NewCallOutput> {
    return new CallableSequence({
      first: this,
      last: convertCallableLikeToCallable(callableLike),
    });
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

  async stream(
    input: CallInput,
    options?: Partial<CallOptions>
  ): Promise<ReadableStreamAsyncIterable<CallOutput>> {
    return this.bound.stream(
      input,
      this._mergeConfig({ ...options, ...this.kwargs })
    );
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

export class CallableLambda<CallInput, CallOutput> extends Callable<
  CallInput,
  CallOutput
> {
  _isCallable = true;

  _namespace: string[] = ['record', 'callable'];

  static _name(): string {
    return 'CallableLambda';
  }

  protected func: CallableFunc<CallInput, CallOutput>;

  constructor(fields: { func: CallableFunc<CallInput, CallOutput> }) {
    super(fields);
    this.func = fields.func;
  }

  static from<CallInput, CallOutput>(
    func: CallableFunc<CallInput, CallOutput>
  ): CallableLambda<CallInput, CallOutput> {
    return new CallableLambda({ func });
  }

  async _invoke(
    input: CallInput,
    options?: Partial<CallableConfig>
  ): Promise<CallOutput> {
    let output: CallOutput = await this.func(input);

    if (output && Callable.isCallable(output)) {
      output = (await output.invoke(input, options)) as CallOutput;
    }

    return output;
  }

  async invoke(
    input: CallInput,
    options?: Partial<CallableConfig> | undefined
  ): Promise<CallOutput> {
    return this._callWithConfig(this._invoke, input, options);
  }
}

export class CallableMap<CallInput> extends Callable<
  CallInput,
  Record<string, unknown>
> {
  _isCallable = true;

  _isSerializable = true;

  _namespace: string[] = ['record', 'callable'];

  static _name(): string {
    return 'CallableMap';
  }

  protected steps: Record<string, Callable<CallInput>>;

  constructor(fields: { steps: Record<string, CallableLike<CallInput>> }) {
    super(fields);

    this.steps = {};
    for (const [k, v] of Object.entries(fields.steps)) {
      this.steps[k] = convertCallableLikeToCallable(v);
    }
  }

  static from<CallInput>(
    steps: Record<string, CallableLike<CallInput>>
  ): CallableMap<CallInput> {
    return new CallableMap<CallInput>({ steps });
  }

  async invoke(
    input: CallInput,
    options?: Partial<CallableConfig> | undefined
  ): Promise<Record<string, unknown>> {
    const output: Record<string, unknown> = {};

    try {
      await Promise.all(
        Object.entries(this.steps).map(async ([k, callable]) => {
          output[k] = await callable.invoke(input, options);
        })
      );
    } catch (e) {
      throw e;
    }

    return output;
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

  static _name(): string {
    return 'CallableEach';
  }

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

  constructor(fields: CallableWithFallbacksArg<CallInput, CallOutput>) {
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

    const currCallableWithFallbacksArgs = _kwargs as CallableWithFallbacksArg<
      CallInput,
      CallOutput
    >;

    const callable: Serialized =
      await currCallableWithFallbacksArgs.callable.toRecord(outputs, parent);
    const fallbacks: Serialized[] = await Promise.all(
      currCallableWithFallbacksArgs.fallbacks.map((fallback) =>
        fallback.toRecord(outputs, parent)
      )
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
            callable: callable,
            fallbacks: [...fallbacks],
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

export class CallableSequence<
  CallInput = unknown,
  CallOutput = unknown,
> extends Callable<CallInput, CallOutput> {
  _isCallable = true;

  _isSerializable = true;

  _namespace: string[] = ['record', 'callable'];

  static _name(): string {
    return 'CallableSequence';
  }

  protected first: Callable<CallInput>;

  protected middle: Callable[] = [];

  protected last: Callable<unknown, CallOutput>;

  constructor(fields: {
    first: Callable<CallInput>;
    middle?: Callable[];
    last: Callable<unknown, CallOutput>;
  }) {
    super(fields);
    this.first = fields.first;
    this.middle = fields.middle ?? this.middle;
    this.last = fields.last;
  }

  get steps() {
    return [this.first, ...this.middle, this.last];
  }

  static isCallableSequence(anything: any): anything is CallableSequence {
    return Array.isArray(anything.middle) && Callable.isCallable(anything);
  }

  static from<CallInput, CallOutput>([first, ...callables]: [
    CallableLike<CallInput>,
    ...CallableLike[],
    CallableLike<unknown, CallOutput>,
  ]): CallableSequence<CallInput, CallOutput> {
    return new CallableSequence<CallInput, CallOutput>({
      first: convertCallableLikeToCallable(first),
      middle: callables.slice(0, -1).map(convertCallableLikeToCallable),
      last: convertCallableLikeToCallable(
        callables[callables.length - 1] as CallableLike<unknown, CallOutput>
      ),
    });
  }

  async invoke(
    input: CallInput,
    options?: Partial<CallableConfig> | undefined
  ): Promise<CallOutput> {
    let nextInput: unknown = input;
    let finalOutput: CallOutput;

    try {
      const initialSteps = [this.first, ...this.middle];
      for (let i = 0; i < initialSteps.length; i += 1) {
        const step: Callable = initialSteps[i];
        nextInput = await step.invoke(nextInput, options);
      }

      finalOutput = await this.last.invoke(nextInput, options);
    } catch (e) {
      throw e as Error;
    }

    return finalOutput;
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

    let nextInputs: unknown[] = inputs;
    let finalOutputs: (CallOutput | Error)[];
    try {
      const initialSteps = [this.first, ...this.middle];
      for (let i = 0; i < initialSteps.length; i += 1) {
        const step: Callable = initialSteps[i];
        nextInputs = await step.batch(nextInputs, options, batchOptions);
      }

      finalOutputs = await this.last.batch(nextInputs, options, batchOptions);
    } catch (e) {
      throw e as Error;
    }

    return finalOutputs;
  }

  pipe<NewCallOutput>(
    callableLike: CallableLike<CallOutput, NewCallOutput>
  ): CallableSequence<CallInput, NewCallOutput> {
    if (CallableSequence.isCallableSequence(callableLike)) {
      return new CallableSequence({
        first: this.first,
        middle: this.middle.concat([
          this.last,
          (callableLike as CallableSequence<CallOutput, NewCallOutput>).first,
          ...(callableLike as CallableSequence<CallOutput, NewCallOutput>)
            .middle,
        ]),
        last: (callableLike as CallableSequence<CallOutput, NewCallOutput>)
          .last,
      });
    }

    return new CallableSequence({
      first: this.first,
      middle: [...this.middle, this.last],
      last: convertCallableLikeToCallable(callableLike),
    });
  }
}
