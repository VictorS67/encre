import {
  RecordId,
  RecordType,
  SecretFields,
  SerializedFields,
  SerializedKeyAlias,
  keyToJson,
  mapKeyTypes,
  mapKeys,
} from '../load/keymap.js';
import {
  Serializable,
  Serialized,
  SerializedInputRecord,
} from '../load/serializable.js';
import { AsyncCallError, AsyncCaller } from '../utils/asyncCaller.js';
import { shallowCopy } from '../utils/copy.js';
import { ReadableStreamAsyncIterable } from '../utils/stream.js';
import {
  convertCallableLikeToCallable,
  convertLambdaFuncFromStr,
  isValidLambdaFunc,
} from './utils.js';

/**
 * Type for defining fields in a callable configuration.
 */
export type CallableConfigFields = {
  [key: string]: unknown;
};

/**
 * Represents the configuration for a callable.
 * Includes properties such as name, tags, metadata, and callbacks.
 */
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

/**
 * Type definition for a callable-like structure. It can be a Callable instance,
 * a Callable function, or an object with callable-like properties.
 */
export type CallableLike<CallInput = unknown, CallOutput = unknown> =
  | Callable<CallInput, CallOutput>
  | CallableFunc<CallInput, CallOutput>
  | { [key: string]: CallableLike<CallInput, CallOutput> };

/**
 * Type definition for a function that behaves like a callable.
 */
export type CallableFunc<CallInput, CallOutput> = (
  input: CallInput
) => CallOutput | Promise<CallOutput>;

/**
 * Type for the arguments passed to the constructor of a {@link CallableBind}.
 */
export type CallableBindArgs<
  CallInput,
  CallOutput,
  CallOptions extends CallableConfig,
> = {
  bound: Callable<CallInput, CallOutput, CallOptions>;
  kwargs: Partial<CallOptions>;
  config: CallableConfig;
};

/**
 * Type for the arguments used in {@link CallableEach}.
 */
export type CallableEachArgs<
  CallInput,
  CallOutput,
  CallOptions extends CallableConfig,
> = {
  bound: Callable<CallInput, CallOutput, CallOptions>;
};

/**
 * Type for defining the argument structure for callable with fallbacks.
 */
export type CallableWithFallbacksArg<CallInput, CallOutput> = {
  callable: Callable<CallInput, CallOutput>;
  fallbacks: Callable<CallInput, CallOutput>[];
};

/**
 * Options for batch processing in a callable.
 */
export type CallableBatchOptions = {
  maxConcurrency?: number;
  returnExceptions?: boolean;
};

export type SerializedCallableFields = {
  [key: string]:
    | ReturnType<Callable['getAttributes']>
    | Record<string, ReturnType<Callable['getAttributes']>>
    | Array<ReturnType<Callable['getAttributes']>>;
};

/**
 * Abstract class representing a callable. A callable is an object that can be
 * "called" or invoked with an input to produce an output, potentially asynchronously.
 */
export abstract class Callable<
  CallInput = unknown,
  CallOutput = unknown,
  CallOptions extends CallableConfig = CallableConfig,
> extends Serializable {
  _isCallable = true;

  /**
   * Static method to check if a given object is an instance of Callable.
   */
  static isCallable(anything: any): anything is Callable {
    return anything ? anything._isCallable : false;
  }

  /**
   * Abstract method that must be implemented by subclasses.
   * Invokes the callable with the given input and options.
   *
   * @param input The input for the callable.
   * @param options (optional) Partial configuration options for the call.
   * @returns A promise that resolves to the output of the callable.
   */
  abstract invoke(
    input: CallInput,
    options?: Partial<CallOptions>
  ): Promise<CallOutput>;

  /**
   * Internal method for invoking a function with provided input and options.
   * Catches and rethrows any exceptions encountered during execution.
   *
   * @param func A function that takes input and returns a promise of CallOutput.
   * @param input The input to pass to the function.
   * @param options (optional) Partial configuration options for the function call.
   * @returns A promise that resolves to the output of the function.
   */
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

  /**
   * Internal method for batch processing a set of inputs with provided options.
   * Executes the function for each input in the batch, respecting the batch options.
   *
   * @param func The batch function to be executed.
   * @param inputs Array of inputs to process.
   * @param options (optional) Configuration options for each function call in the batch.
   * @param batchOptions (optional) Options for batch execution such as concurrency limits.
   * @returns A promise that resolves to an array of results (or errors, if specified).
   */
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

  /**
   * Utility method to normalize the options array for batch processing.
   * Ensures that the options array matches the length of the inputs array.
   *
   * @param options (optional) Single or array of partial call options.
   * @param repeatTimes (optional) The number of times to repeat the single option if provided.
   * @returns An array of partial call options.
   * @throws Error if the options array length does not match the inputs length.
   */
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

  /**
   * Creates a new {@link CallableBind} instance with the specified configuration.
   * This method allows reconfiguration of the callable instance.
   *
   * @param config The configuration to apply to the new callable instance.
   * @returns A new {@link CallableBind} instance with the given configuration.
   */
  withConfig(
    config: CallableConfig
  ): CallableBind<CallInput, CallOutput, CallOptions> {
    return new CallableBind({ bound: this, kwargs: {}, config });
  }

  /**
   * Creates a new {@link CallableWithFallbacks} instance with specified fallbacks.
   * This method allows defining fallback callables for error handling or retries.
   *
   * @param fields Object containing an array of fallback callables.
   * @returns A new {@link CallableWithFallbacks} instance with the specified fallbacks.
   */
  withFallbacks(fields: {
    fallbacks: Callable<CallInput, CallOutput>[];
  }): CallableWithFallbacks<CallInput, CallOutput> {
    return new CallableWithFallbacks<CallInput, CallOutput>({
      callable: this,
      fallbacks: fields.fallbacks,
    });
  }

  /**
   * Creates a new {@link CallableBind} instance with the specified keyword arguments.
   * This method allows partial reconfiguration of the callable instance.
   *
   * @param kwargs Partial keyword arguments for the callable configuration.
   * @returns A new {@link CallableBind} instance with the given keyword arguments.
   */
  bind(
    kwargs: Partial<CallOptions>
  ): Callable<CallInput, CallOutput, CallOptions> {
    return new CallableBind({ bound: this, kwargs, config: {} });
  }

  /**
   * Creates a new {@link CallableEach} instance for mapping inputs to outputs.
   * This method allows applying the callable to each input in an array of inputs.
   *
   * @returns A new {@link CallableEach} instance for mapping operation.
   */
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

  /**
   * Creates an async generator for streaming callable outputs.
   * This protected method is used internally for streaming operations.
   *
   * @param input The input for the callable.
   * @param options Optional additional options for the callable.
   * @returns An async generator yielding callable outputs.
   */
  async *_streamIterator(
    input: CallInput,
    options?: Partial<CallOptions>
  ): AsyncGenerator<CallOutput> {
    yield this.invoke(input, options);
  }

  /**
   * Creates a readable stream for the callable outputs.
   * This method allows streaming the outputs of the callable for continuous data.
   *
   * @param input The input for the callable.
   * @param options Optional additional options for the callable.
   * @returns A promise that resolves to a readable stream of callable outputs.
   */
  async stream(
    input: CallInput,
    options?: Partial<CallOptions>
  ): Promise<ReadableStreamAsyncIterable<CallOutput>> {
    return ReadableStreamAsyncIterable.withAsyncGenerator(
      this._streamIterator(input, options)
    );
  }

  /**
   * Chains the current callable with another callable, creating a sequence.
   * This method allows sequential execution of multiple callables.
   *
   * @param callableLike The next callable in the sequence.
   * @returns A new {@link CallableSequence} instance representing the chained callables.
   */
  pipe<NewCallOutput>(
    callableLike: CallableLike<CallOutput, NewCallOutput>
  ): CallableSequence<CallInput, NewCallOutput> {
    return new CallableSequence({
      first: this,
      last: convertCallableLikeToCallable(callableLike),
    });
  }

  protected _getCallableMetadata(): {
    type: string;
    callables?: SerializedCallableFields;
  } {
    return {
      type: 'Callable',
    };
  }

  protected _removeCallable(
    root: SerializedFields,
    callablesMap: SerializedCallableFields
  ): SerializedFields {
    const result: SerializedFields = shallowCopy(root);

    for (const [path, callable] of Object.entries(callablesMap)) {
      const [last, ...partsReverse] = path.split('.').reverse();

      let current: SerializedFields = result;
      for (const key of partsReverse.reverse()) {
        if (current[key] === undefined) {
          break;
        }

        current[key] = shallowCopy(current[key] as SerializedFields);
        current = current[key] as SerializedFields;
      }

      if (current[last] !== undefined) {
        if (path.split('.').length > 1) {
          delete result[path.split('.')[0]];
        } else {
          delete current[last];
        }
      }
    }

    return result;
  }

  getAttributes(): {
    aliases: SerializedKeyAlias;
    secrets: SecretFields;
    kwargs: SerializedFields;
    metadata: { type: string; callables?: SerializedCallableFields };
  } {
    const { aliases, secrets, kwargs } = super.getAttributes();

    const metadata = this._getCallableMetadata();

    const filteredKwargs =
      metadata.callables && Object.keys(metadata.callables).length
        ? this._removeCallable(kwargs, metadata.callables)
        : kwargs;

    return {
      aliases,
      secrets,
      kwargs: filteredKwargs,
      metadata,
    };
  }

  async toRecord(
    outputs: CallOutput,
    parent?: RecordId | undefined
  ): Promise<Serialized> {
    return super.toRecord(outputs, parent);
  }

  /**
   * Splits the combined callable and call options into separate objects.
   * This protected method is used internally for option management.
   *
   * @param options Combined callable and call options.
   * @returns Tuple of separated callable options and call options.
   */
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

/**
 * {@link CallableBind} class extends the functionality of the {@link Callable} class.
 * It represents a callable entity that can be bound with additional
 * configurations and arguments. This class is used to create callable
 * objects with specific bindings and configurations.
 *
 * Generics:
 * - `CallInput`: Type of input the callable will accept.
 * - `CallOutput`: Type of output the callable will produce.
 * - `CallOptions`: Type of options/configurations the callable will use.
 */
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

  /**
   * The bound callable instance.
   */
  bound: Callable<CallInput, CallOutput, CallOptions>;

  /**
   * Configuration for the callable.
   */
  config: CallableConfig;

  /**
   * Keyword arguments for additional configuration.
   */
  protected kwargs: Partial<CallOptions>;

  constructor(fields: CallableBindArgs<CallInput, CallOutput, CallOptions>) {
    super(fields);
    this.bound = fields.bound;
    this.kwargs = fields.kwargs;
    this.config = fields.config;
  }

  /**
   * Merges the given configuration with the existing configuration.
   * This method is protected and not intended for external use.
   *
   * @param config An optional {@link CallableConfig} object to be merged with the current configuration.
   * @returns A merged configuration object as `Partial<CallOptions>`.
   */
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

  /**
   * Creates a new instance of {@link CallableBind} with the provided keyword arguments.
   * This method allows for partial reconfiguration of the callable binding.
   *
   * @param kwargs Partial keyword arguments to be merged with the existing ones.
   * @returns A new instance of {@link CallableBind} with the merged keyword arguments.
   */
  bind(
    kwargs: Partial<CallOptions>
  ): CallableBind<CallInput, CallOutput, CallOptions> {
    return this.constructor({
      bound: this.bound,
      kwargs: { ...this.kwargs, ...kwargs },
      config: this.config,
    });
  }

  /**
   * Creates a new instance of {@link CallableBind} with the provided configuration.
   * This method allows for partial or complete reconfiguration of the callable.
   *
   * @param config The new configuration to apply.
   * @returns A new instance of {@link CallableBind} with the merged configuration.
   */
  withConfig(
    config: CallableConfig
  ): CallableBind<CallInput, CallOutput, CallOptions> {
    return this.constructor({
      bound: this.bound,
      kwargs: this.kwargs,
      config: { ...this.config, ...config },
    });
  }

  /**
   * Invokes the bound callable with the provided input and options.
   * Merges the provided options with the current keyword arguments and configuration.
   *
   * @param input The input for the callable.
   * @param options Optional keyword arguments for this specific invocation.
   * @returns A promise that resolves to the output of the callable.
   */
  async invoke(
    input: CallInput,
    options?: Partial<CallOptions> | undefined
  ): Promise<CallOutput> {
    return this.bound.invoke(
      input,
      this._mergeConfig({ ...options, ...this.kwargs })
    );
  }

  /**
   * Processes a batch of inputs, invoking the callable for each input in the batch.
   * Allows for individual options for each input in the batch.
   * Overloaded to handle different types of `batchOptions`.
   *
   * @param inputs An array of inputs to be processed in a batch.
   * @param options Optional keyword arguments for each input in the batch.
   * @param batchOptions Optional settings for batch processing.
   * @returns A promise that resolves to an array of outputs or errors.
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
    const mergedOptions = Array.isArray(options)
      ? options.map((option: Partial<CallOptions>) =>
          this._mergeConfig({ ...option, ...this.kwargs })
        )
      : this._mergeConfig({ ...options, ...this.kwargs });

    return this.batch(inputs, mergedOptions, batchOptions);
  }

  /**
   * Streams the output of the callable for the given input.
   * Useful for handling large or continuous data.
   *
   * @param input The input for the callable.
   * @param options Optional keyword arguments for this specific streaming.
   * @returns A promise that resolves to a readable stream of outputs.
   */
  async stream(
    input: CallInput,
    options?: Partial<CallOptions>
  ): Promise<ReadableStreamAsyncIterable<CallOutput>> {
    return this.bound.stream(
      input,
      this._mergeConfig({ ...options, ...this.kwargs })
    );
  }

  protected _getCallableMetadata(): {
    type: string;
    callables?: SerializedCallableFields;
  } {
    return {
      type: 'CallableBind',
      callables: {
        bound: this.bound.getAttributes(),
      },
    };
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
      _recordId: this._recordId,
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
      _recordId: this._recordId,
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

/**
 * {@link CallableLambda} class extends the {@link Callable} class, allowing the use of lambda functions.
 * It's a specialized version of {@link Callable} that uses JavaScript lambda functions for its logic.
 *
 * Generics:
 * - `CallInput`: Type of input the lambda function will accept.
 * - `CallOutput`: Type of output the lambda function will produce.
 */
export class CallableLambda<CallInput, CallOutput> extends Callable<
  CallInput,
  CallOutput
> {
  _isCallable = true;

  _isSerializable = true;

  _namespace: string[] = ['record', 'callable'];

  static _name(): string {
    return 'CallableLambda';
  }

  /**
   * Holds the string representation of the lambda function.
   */
  protected func: string;

  constructor(fields: { func: CallableFunc<CallInput, CallOutput> | string }) {
    let funcStr: string | undefined;

    if (typeof fields.func === 'string') {
      if (!isValidLambdaFunc(fields.func)) {
        throw new Error('Function Str is not valid');
      }

      funcStr = fields.func;
    } else {
      funcStr = fields.func.toString();
    }

    super({ func: funcStr });

    this.func = funcStr;
  }

  /**
   * Converts the stored function string back into a callable function.
   *
   * @returns A callable function derived from the stored string.
   */
  private _func(): CallableFunc<CallInput, CallOutput> {
    return convertLambdaFuncFromStr(this.func) as CallableFunc<
      CallInput,
      CallOutput
    >;
  }

  /**
   * Static method to create a {@link CallableLambda} instance from a lambda function.
   *
   * @param func A lambda function.
   * @returns A new {@link CallableLambda} instance created from the provided lambda function.
   */
  static from<CallInput, CallOutput>(
    func: CallableFunc<CallInput, CallOutput>
  ): CallableLambda<CallInput, CallOutput> {
    return new CallableLambda({ func });
  }

  /**
   * Internal method to invoke the lambda function with error handling.
   *
   * @param input The input for the lambda function.
   * @param options Optional callable configuration options.
   * @returns A promise that resolves to the output of the lambda function.
   * @throws An error if the lambda function is not valid or fails during execution.
   */
  async _invoke(
    input: CallInput,
    options?: Partial<CallableConfig>
  ): Promise<CallOutput> {
    let output: CallOutput | undefined;
    try {
      output = await this._func()(input);
    } catch {
      throw new Error('Function is not valid');
    }

    if (output && Callable.isCallable(output)) {
      output = (await output.invoke(input, options)) as CallOutput;
    }

    return output;
  }

  /**
   * Public method to invoke the lambda function. It uses `_callWithConfig` to apply callable configurations.
   *
   * @param input The input for the lambda function.
   * @param options Optional callable configuration options.
   * @returns A promise that resolves to the output of the lambda function.
   */
  async invoke(
    input: CallInput,
    options?: Partial<CallableConfig> | undefined
  ): Promise<CallOutput> {
    return this._callWithConfig(this._invoke, input, options);
  }

  protected _getCallableMetadata(): {
    type: string;
    callables?: SerializedCallableFields;
  } {
    return {
      type: 'CallableLambda',
    };
  }
}

/**
 * {@link CallableMap} class extends the {@link Callable} class for mapping multiple Callable instances.
 * It allows the execution of multiple callables in parallel and aggregates their results.
 *
 * Generics:
 * - `CallInput`: Type of input each callable in the map will accept.
 */
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

  /**
   * Holds the mapping of steps where each step is a callable.
   * The steps are a record with string keys and `Callable<CallInput>` values.
   */
  protected steps: Record<string, Callable<CallInput>>;

  constructor(fields: { steps: Record<string, CallableLike<CallInput>> }) {
    super(fields);

    this.steps = {};
    for (const [k, v] of Object.entries(fields.steps)) {
      this.steps[k] = convertCallableLikeToCallable(v);
    }
  }

  /**
   * Static method to create a {@link CallableMap} instance from a mapping of callables.
   *
   * @param steps A record of callable-like objects.
   * @returns A new {@link CallableMap} instance created from the provided mapping.
   */
  static from<CallInput>(
    steps: Record<string, CallableLike<CallInput>>
  ): CallableMap<CallInput> {
    return new CallableMap<CallInput>({ steps });
  }

  /**
   * Invokes all callables in the map with the given input, in parallel.
   * Aggregates and returns the results of all callables in a single record.
   *
   * @param input The input for each callable in the map.
   * @param options Optional callable configuration options.
   * @returns A promise that resolves to a record containing the outputs of all callables.
   * @throws Passes through any errors thrown by the individual callables.
   */
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

  protected _getCallableMetadata(): {
    type: string;
    callables?: SerializedCallableFields;
  } {
    return {
      type: 'CallableMap',
      callables: {
        steps: Object.fromEntries(
          Object.entries(this.steps).map(([k, v]) => [k, v.getAttributes()])
        ),
      },
    };
  }
}

/**
 * The {@link CallableEach} class extends {@link Callable} to handle batch operations by applying
 * a single Callable instance to each item in an input array.
 *
 * Generics:
 * - `CallInputItem`: Type of each input item the callable will accept.
 * - `CallOutputItem`: Type of each output item the callable will produce.
 * - `CallOptions`: Type of options/configurations the callable will use, extending CallableConfig.
 */
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

  /**
   * The bound Callable instance to which each input item is passed.
   */
  bound: Callable<CallInputItem, CallOutputItem, CallOptions>;

  constructor(
    fields: CallableEachArgs<CallInputItem, CallOutputItem, CallOptions>
  ) {
    super(fields);
    this.bound = fields.bound;
  }

  /**
   * Binds the given options to the callable and returns a new CallableEach instance.
   *
   * @param kwargs Partial keyword arguments for the callable configuration.
   * @returns A new CallableEach instance with the bound callable and given options.
   */
  bind(
    kwargs: Partial<CallOptions>
  ): CallableEach<CallInputItem, CallOutputItem, CallOptions> {
    return new CallableEach({ bound: this.bound.bind(kwargs) });
  }

  /**
   * Invokes the callable for each item in the input array.
   *
   * @param inputs An array of input items.
   * @param options Optional callable configuration options.
   * @returns A promise that resolves to an array of output items, one for each input.
   */
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

  protected _getCallableMetadata(): {
    type: string;
    callables?: SerializedCallableFields;
  } {
    return {
      type: 'CallableEach',
      callables: {
        bound: this.bound.getAttributes(),
      },
    };
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
      _recordId: this._recordId,
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
      _recordId: this._recordId,
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

/**
 * {@link CallableWithFallbacks} class extends Callable to provide fallback mechanisms.
 * It allows the execution of a primary callable and fallbacks in case of failure.
 *
 * Generics:
 * - `CallInput`: Type of input the callable and its fallbacks will accept.
 * - `CallOutput`: Type of output the callable and its fallbacks will produce.
 */
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

  /**
   * The primary callable to be invoked.
   */
  protected callable: Callable<CallInput, CallOutput>;

  /**
   * An array of fallback callables to be invoked if the primary callable fails.
   */
  protected fallbacks: Callable<CallInput, CallOutput>[];

  constructor(fields: CallableWithFallbacksArg<CallInput, CallOutput>) {
    super(fields);
    this.callable = fields.callable;
    this.fallbacks = fields.fallbacks;
  }

  /**
   * Generator function to iterate over the primary callable and fallbacks.
   *
   * @yields Each callable in the sequence (primary followed by fallbacks).
   */
  *callables() {
    yield this.callable;
    for (const callable of this.fallbacks) {
      yield callable;
    }
  }

  /**
   * Invokes the primary callable and falls back to the fallbacks in case of an error.
   * If all callables fail, rethrows the first error encountered.
   *
   * @param input The input for the callables.
   * @param options Optional callable configuration options.
   * @returns A promise that resolves to the output of the first successful callable.
   * @throws An error if all callables fail, throwing the first error encountered.
   */
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

  protected _getCallableMetadata(): {
    type: string;
    callables?: SerializedCallableFields;
  } {
    return {
      type: 'CallableWithFallbacks',
      callables: {
        callable: this.callable.getAttributes(),
        fallbacks: this.fallbacks.map((fallback) => fallback.getAttributes()),
      },
    };
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
      _recordId: this._recordId,
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
      _recordId: this._recordId,
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

/**
 * {@link CallableSequence} class extends {@link Callable} to create a sequence of callable operations.
 * It allows chaining multiple callables, where the output of one is the input to the next.
 *
 * Generics:
 * - `CallInput`: Type of input the first callable in the sequence will accept.
 * - `CallOutput`: Type of output the last callable in the sequence will produce.
 */
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

  /**
   * The first callable in the sequence.
   */
  protected first: Callable<CallInput>;

  /**
   * An array of callables that form the middle of the sequence.
   */
  protected middle: Callable[] = [];

  /**
   * The last callable in the sequence, producing the final output.
   */
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

  /**
   * Gets the sequence of callables as an array.
   *
   * @returns An array of callables including first, middle, and last.
   */
  get steps() {
    return [this.first, ...this.middle, this.last];
  }

  /**
   * Static method to check if a given object is an instance of {@link CallableSequence}.
   *
   * @param anything The object to check.
   * @returns True if the object is a {@link CallableSequence}, false otherwise.
   */
  static isCallableSequence(anything: any): anything is CallableSequence {
    return Array.isArray(anything.middle) && Callable.isCallable(anything);
  }

  /**
   * Static method to create a `CallableSequence` instance from an array of callable-like objects.
   *
   * @param callables An array of callable-like objects including first, optional middle, and last callables.
   * @returns A new `CallableSequence` instance created from the provided callable-like objects.
   */
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

  /**
   * Invokes the sequence of callables with the given input.
   * Each callable's output is passed as the input to the next callable.
   *
   * @param input The input for the first callable in the sequence.
   * @param options Optional callable configuration options.
   * @returns A promise that resolves to the output of the last callable in the sequence.
   * @throws An error if any callable in the sequence fails.
   */
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

  /**
   * Extends the current callable sequence by adding another callable or callable sequence to the end.
   * This method allows for dynamic extension of the callable sequence, maintaining the flow of data.
   *
   * @param callableLike The callable or callable sequence to be added to the end of the current sequence.
   * @returns A new CallableSequence instance representing the extended sequence.
   */
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

  protected _getCallableMetadata(): {
    type: string;
    callables?: SerializedCallableFields;
  } {
    return {
      type: 'CallableSequence',
      callables: {
        first: this.first.getAttributes(),
        middle: this.middle.map((mid) => mid.getAttributes()),
        last: this.last.getAttributes(),
      },
    };
  }
}
