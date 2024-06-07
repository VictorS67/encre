import {
  BaseCallbackManager,
  CallbackMetadata,
  Callbacks,
} from "../callbacks/managers.js";
import { BaseRule } from "../events/inference/validate/guardrails/base.js";
import {
  RecordId,
  RecordType,
  SecretFields,
  SerializedFields,
  SerializedKeyAlias,
  keyToJson,
  mapKeyTypes,
  mapKeys,
} from "../load/keymap.js";
import {
  Serializable,
  Serialized,
  SerializedInputRecord,
} from "../load/serializable.js";
import { AsyncCallError, AsyncCaller } from "../utils/asyncCaller.js";
import { shallowCopy } from "../utils/copy.js";
import { ReadableStreamAsyncIterable } from "../utils/stream.js";
import {
  configureCallbackManager,
  convertCallableLikeToCallable,
  convertLambdaFuncFromStr,
  isValidLambdaFunc,
} from "./utils.js";

/**
 * Represents the configuration for a callable object, containing options like name, tags, metadata,
 * and callbacks.
 */
export type CallableConfig = {
  /**
   * The name of the callable, used for identification or logging. not-implemented yet
   */
  name?: string;

  /**
   * An array of strings used for categorizing or filtering callables. not-implemented yet
   */
  tags?: string[];

  /**
   * A dictionary containing metadata related to the callable, defined as {@link CallbackMetadata}.
   */
  metadata?: CallbackMetadata;

  /**
   * not-implemented yet
   */
  callbacks?: Callbacks;
};

/**
 * Extends {@link CallableConfig} to include additional 'variables' used specifically for guardrail
 * rule validation in conditional callable scenarios.
 */
export type CallableIfConfig = CallableConfig & {
  /**
   * Additional variables that may be used to enhance or modify the behavior of the callable based on dynamic contexts.
   */
  variables?: Record<string, unknown>;
};

/**
 * A type union that defines various forms a callable can take: either as a {@link Callable} instance,
 * a function conforming to {@link CallableFunc}, or an object containing callable-like properties.
 *
 * @template CallInput The expected input type of the callable.
 * @template CallOutput The expected output type of the callable.
 */
export type CallableLike<CallInput = unknown, CallOutput = unknown> =
  | Callable<CallInput, CallOutput>
  | CallableFunc<CallInput, CallOutput>
  | { [key: string]: CallableLike<CallInput, CallOutput> };

/**
 * Represents a function type that acts like a callable, taking an input and optionally returning a
 * promise that resolves to an output.
 *
 * @template CallInput The type of input the function accepts.
 * @template CallOutput The type of output the function returns, which may be wrapped in a Promise.
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
  /**
   * The underlying callable to which this bind configuration will apply.
   */
  bound: Callable<CallInput, CallOutput, CallOptions>;

  /**
   * Keyword arguments for modifying the callable's configuration dynamically.
   */
  kwargs: Partial<CallOptions>;

  /**
   * Additional configuration applied to the callable.
   */
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
  /**
   * The callable bound to each item in the input array.
   */
  bound: Callable<CallInput, CallOutput, CallOptions>;
};

/**
 * Type for defining the argument structure for callable with fallbacks.
 */
export type CallableWithFallbacksArg<CallInput, CallOutput> = {
  /**
   * The primary callable to be invoked initially.
   */
  callable: Callable<CallInput, CallOutput>;

  /**
   * An array of fallback callables to be invoked in order if the primary callable fails.
   */
  fallbacks: Callable<CallInput, CallOutput>[];
};

/**
 * Options for batch processing in a callable.
 */
export type CallableBatchOptions = {
  /**
   * The maximum concurrency for running callables in batch
   */
  maxConcurrency?: number;

  /**
   * Whether to return errors rather than throwing on the first error.
   */
  returnExceptions?: boolean;
};

export type SerializedCallableFields = {
  [key: string]:
    | ReturnType<Serializable["getAttributes"]>
    | Record<string, ReturnType<Serializable["getAttributes"]>>
    | Array<ReturnType<Serializable["getAttributes"]>>
    | ReturnType<Callable["getAttributes"]>
    | Record<string, ReturnType<Callable["getAttributes"]>>
    | Array<ReturnType<Callable["getAttributes"]>>
    | undefined;
};

/**
 * Abstract base class for creating callable objects. A callable is an object that can be invoked
 * with an input to produce an output, resembling a function.
 *
 * @template CallInput Type of the input passed to the callable.
 * @template CallOutput Type of the output returned by the callable.
 * @template CallOptions Configuration options for the callable, extending {@link CallableConfig}.
 */
export abstract class Callable<
  CallInput = unknown,
  CallOutput = unknown,
  CallOptions extends CallableConfig = CallableConfig,
> extends Serializable {
  /**
   * Indicates if the instance is callable. If false, then the callable cannot be invoked.
   */
  _isCallable = true;

  /**
   * Checks if a given object is an instance of Callable.
   *
   * @param anything Object to be checked.
   * @returns True if the object is an instance of Callable, false otherwise.
   */
  static isCallable(anything: any): anything is Callable {
    return anything ? anything._isCallable : false;
  }

  /**
   * Abstract method to invoke the callable.
   *
   * @param input The input required to invoke the callable.
   * @param options Optional partial configuration for the callable.
   * @returns A promise resolving to the callable's output.
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
   * @hidden
   * @internal
   */
  protected async _callWithConfig<T extends CallInput>(
    func: (input: T) => Promise<CallOutput>,
    input: T,
    options?: Partial<CallOptions>
  ): Promise<CallOutput> {
    let output: CallOutput;

    const callbackManager: BaseCallbackManager | undefined =
      configureCallbackManager(options);

    await callbackManager?.beforeInvoke(this, input);

    /*eslint no-useless-catch: "warn"*/
    try {
      output = await func.bind(this)(input, options);
    } catch (e) {
      await callbackManager?.onError(this, e as Error);
      throw e;
    }

    await callbackManager?.afterInvoke(this, output);
    return output;
  }

  /**
   * Utility method to normalize the options array for batch processing.
   * Ensures that the options array matches the length of the inputs array.
   *
   * @param options (optional) Single or array of partial call options.
   * @param repeatTimes (optional) The number of times to repeat the single option if provided.
   * @returns An array of partial call options.
   * @throws Error if the options array length does not match the inputs length.
   * @hidden
   * @internal
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
   *
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

    const callbackManagers: (BaseCallbackManager | undefined)[] =
      optionsList.map(configureCallbackManager);

    const batchCalls: Promise<CallOutput | Error>[] = inputs.map((input, i) =>
      caller.call(async () => {
        try {
          await callbackManagers[i]?.beforeInvoke(this, input);

          const result: CallOutput = await this.invoke(input, optionsList[i]);

          await callbackManagers[i]?.afterInvoke(this, result);
          return result;
        } catch (e) {
          await callbackManagers[i]?.onError(this, e as Error);

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
   * @internal
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

  /** @hidden */
  protected _getCallableMetadata(): {
    type: string;
    callables?: SerializedCallableFields;
  } {
    return {
      type: "Callable",
    };
  }

  /** @hidden */
  protected _removeCallable(
    root: SerializedFields,
    callablesMap: SerializedCallableFields
  ): SerializedFields {
    const result: SerializedFields = shallowCopy(root);

    for (const [path, callable] of Object.entries(callablesMap)) {
      const [last, ...partsReverse] = path.split(".").reverse();

      let current: SerializedFields = result;
      for (const key of partsReverse.reverse()) {
        if (current[key] === undefined) {
          break;
        }

        current[key] = shallowCopy(current[key] as SerializedFields);
        current = current[key] as SerializedFields;
      }

      if (current[last] !== undefined) {
        if (path.split(".").length > 1) {
          delete result[path.split(".")[0]];
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

  /**
   * @hidden
   * @deprecated
   */
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
   * @hidden
   * @internal
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
 * Represents a bindable callable that can have configuration and arguments bound to it for future invocations.
 * This class allows for pre-configuring certain aspects of a callable's behavior before its actual invocation.
 *
 * @template CallInput Type of input accepted by the callable.
 * @template CallOutput Type of output produced by the callable.
 * @template CallOptions Configuration options extending {@link CallableConfig}.
 */
export class CallableBind<
  CallInput,
  CallOutput,
  CallOptions extends CallableConfig,
> extends Callable<CallInput, CallOutput, CallOptions> {
  _isCallable = true;

  _isSerializable = true;

  _namespace: string[] = ["record", "callable"];

  static _name(): string {
    return "CallableBind";
  }

  /**
   * The underlying callable to which this bind configuration will apply.
   */
  bound: Callable<CallInput, CallOutput, CallOptions>;

  /**
   * Additional configuration applied to the callable.
   */
  config: CallableConfig;

  /**
   * Keyword arguments for modifying the callable's configuration dynamically.
   */
  protected kwargs: Partial<CallOptions>;

  /**
   * Constructs an instance of CallableBind.
   * @param fields Configuration for creating a bound callable, including the base callable and any additional options.
   */
  constructor(fields: CallableBindArgs<CallInput, CallOutput, CallOptions>) {
    super(fields);
    this.bound = fields.bound;
    this.kwargs = fields.kwargs;
    this.config = fields.config;
  }

  /**
   * Merges the given configuration with the existing configuration.
   *
   * @param config An optional {@link CallableConfig} object to be merged with the current configuration.
   * @returns A merged configuration object as `Partial<CallOptions>`.
   * @hidden
   * @internal
   */
  protected _mergeConfig(config?: CallableConfig): Partial<CallOptions> {
    const configCopy: CallableConfig = { ...this.config };

    if (config) {
      for (const key of Object.keys(config)) {
        if (key === "metadata") {
          configCopy[key] = { ...configCopy[key], ...config[key] };
        } else if (key === "tags") {
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
   * Invokes the underlying callable with merged configuration and input options.
   *
   * @param input The input for the callable.
   * @param options Optional additional configuration for this specific invocation.
   * @returns A promise that resolves to the output of the callable.
   */
  async invoke(
    input: CallInput,
    options?: Partial<CallOptions> | undefined
  ): Promise<CallOutput> {
    return this._callWithConfig(
      this.bound.invoke,
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

  /**
   * @hidden
   * @internal
   */
  protected _getCallableMetadata(): {
    type: string;
    callables?: SerializedCallableFields;
  } {
    return {
      type: "CallableBind",
      callables: {
        bound: this.bound.getAttributes(),
      },
    };
  }

  /**
   * @hidden
   * @deprecated
   */
  async toInputRecord(
    aliases: SerializedKeyAlias,
    secrets: SecretFields,
    kwargs: SerializedFields
  ): Promise<Serialized> {
    return {
      _grp: 2,
      _type: "input_record",
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

  /**
   * @hidden
   * @deprecated
   */
  async toEventRecord(
    aliases: SerializedKeyAlias,
    secrets: SecretFields,
    kwargs: SerializedFields,
    outputs: CallOutput,
    parent?: RecordId | undefined
  ): Promise<Serialized> {
    let serializedOutputs: SerializedFields;
    if (typeof outputs === "object") {
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
      _type: "event_record",
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
 * Represents a Callable that utilizes a lambda function for its logic.
 * This specialized Callable allows for concise and direct execution of a function provided either as a string
 * representation or a function object.
 * It is particularly useful when a compact, stateless operation is needed inline.
 *
 * @template CallInput Type of input the lambda function will accept.
 * @template CallOutput Type of output the lambda function will produce.
 */
export class CallableLambda<CallInput, CallOutput> extends Callable<
  CallInput,
  CallOutput
> {
  _isCallable = true;

  _isSerializable = true;

  _namespace: string[] = ["record", "callable"];

  static _name(): string {
    return "CallableLambda";
  }

  /**
   * The lambda function as a string, which will be converted to a callable function during execution.
   */
  protected func: string;

  /**
   * Constructs a new instance of CallableLambda.
   *
   * @param fields Contains either a lambda function or its string representation, which will be used to handle invocations.
   * @throws Error if the provided function string is not a valid lambda function.
   */
  constructor(fields: { func: CallableFunc<CallInput, CallOutput> | string }) {
    let funcStr: string | undefined;

    if (typeof fields.func === "string") {
      if (!isValidLambdaFunc(fields.func)) {
        throw new Error("Function Str is not valid");
      }

      funcStr = fields.func;
    } else {
      funcStr = fields.func.toString();
    }

    super({ func: funcStr });

    this.func = funcStr;
  }

  /**
   * Converts the string representation of the lambda function back into a callable function.
   * @returns A function converted from the stored string, ready to be invoked.
   * @internal
   */
  private _func(): CallableFunc<CallInput, CallOutput> {
    return convertLambdaFuncFromStr(this.func) as CallableFunc<
      CallInput,
      CallOutput
    >;
  }

  /**
   * Static factory method to create a CallableLambda instance from a lambda function.
   * This method simplifies the instantiation process when directly passing a lambda function.
   *
   * @param func A lambda function.
   * @returns A new CallableLambda instance created using the provided lambda function.
   */
  static from<CallInput, CallOutput>(
    func: CallableFunc<CallInput, CallOutput>
  ): CallableLambda<CallInput, CallOutput> {
    return new CallableLambda({ func });
  }

  /**
   * Internal method to handle the actual invocation of the lambda function, applying any specified options.
   *
   * @param input The input for the lambda function.
   * @param options Optional callable configuration options.
   * @returns A promise that resolves to the output of the lambda function.
   * @throws An error if the lambda function execution fails.
   */
  async _invoke(
    input: CallInput,
    options?: Partial<CallableConfig>
  ): Promise<CallOutput> {
    let output: CallOutput | undefined;
    try {
      output = await this._func()(input);
    } catch {
      throw new Error("Function is not valid");
    }

    if (output && Callable.isCallable(output)) {
      output = (await output.invoke(input, options)) as CallOutput;
    }

    return output;
  }

  /**
   * Invokes the lambda function with the provided input and returns the result.
   * This method ensures that the function is called with the correct context and handled properly.
   *
   * @param input The input to pass to the lambda function.
   * @param options Optional callable configuration options, which may influence how the function executes.
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
      type: "CallableLambda",
    };
  }
}

/**
 * A Callable that manages a collection of other Callables, each associated with a specific key.
 * It allows simultaneous invocation of multiple Callables and aggregates their results into a
 * single record.
 *
 * @template CallInput Type of input that each callable within the map will accept.
 */
export class CallableMap<CallInput> extends Callable<
  CallInput,
  Record<string, unknown>
> {
  _isCallable = true;

  _isSerializable = true;

  _namespace: string[] = ["record", "callable"];

  static _name(): string {
    return "CallableMap";
  }

  /**
   * A mapping of keys to callable instances. Each key corresponds to a callable that will be
   * invoked with the same input.
   */
  protected steps: Record<string, Callable<CallInput>>;

  /**
   * Constructs a new CallableMap instance.
   * @param fields An object containing the initial mapping of callables.
   */
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

  /**
   * @hidden
   * @internal
   */
  protected _getCallableMetadata(): {
    type: string;
    callables?: SerializedCallableFields;
  } {
    return {
      type: "CallableMap",
      callables: {
        steps: Object.fromEntries(
          Object.entries(this.steps).map(([k, v]) => [k, v.getAttributes()])
        ),
      },
    };
  }
}

/**
 * A Callable extension that applies a given callable to each item in a collection of inputs.
 * This class is especially useful for batch operations where the same processing needs to be applied to each element in a list.
 *
 * @template CallInputItem Type of each individual input item that the callable will accept.
 * @template CallOutputItem Type of each individual output item that the callable will produce.
 * @template CallOptions Configuration options extending {@link CallableConfig}, applicable to each individual call.
 */
export class CallableEach<
  CallInputItem,
  CallOutputItem,
  CallOptions extends CallableConfig,
> extends Callable<CallInputItem[], CallOutputItem[], CallOptions> {
  _isCallable = true;

  _isSerializable = true;

  _namespace: string[] = ["record", "callable"];

  static _name(): string {
    return "CallableEach";
  }

  /**
   * The callable bound to each item in the input array.
   */
  bound: Callable<CallInputItem, CallOutputItem, CallOptions>;

  /**
   * Constructor for creating an instance of CallableEach.
   * @param fields Contains the bound callable, which is applied to each item in the input array.
   */
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
   * Invokes the callable for each item in the provided array of inputs.
   * Each invocation is independent, and this method aggregates the results into an array.
   *
   * @param inputs Array of input items, each will be passed individually to the bound callable.
   * @param options Optional configuration options applicable to each invocation.
   * @returns A promise that resolves to an array of results, where each result corresponds to an item in the input array.
   */
  async invoke(
    inputs: CallInputItem[],
    options?: Partial<CallOptions>
  ): Promise<CallOutputItem[]> {
    return this._callWithConfig(this._invoke, inputs, options);
  }

  /**
   * @hidden
   * @deprecated
   */
  async toRecord(
    outputs: CallOutputItem[],
    parent?: RecordId | undefined
  ): Promise<Serialized> {
    return super.toRecord(outputs, parent);
  }

  /** @internal */
  protected async _invoke(
    inputs: CallInputItem[],
    options?: Partial<CallOptions>
  ): Promise<CallOutputItem[]> {
    return this.bound.batch(inputs, options);
  }

  /**
   * @hidden
   * @internal
   */
  protected _getCallableMetadata(): {
    type: string;
    callables?: SerializedCallableFields;
  } {
    return {
      type: "CallableEach",
      callables: {
        bound: this.bound.getAttributes(),
      },
    };
  }

  /**
   * @hidden
   * @deprecated
   */
  async toInputRecord(
    aliases: SerializedKeyAlias,
    secrets: SecretFields,
    kwargs: SerializedFields
  ): Promise<Serialized> {
    return {
      _grp: 2,
      _type: "input_record",
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

  /**
   * @hidden
   * @deprecated
   */
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
      _type: "event_record",
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
 * A Callable extension that manages a primary callable along with a list of fallback callables.
 * This structure is used to attempt an operation with the primary callable first and then sequentially
 * try the fallback callables until one succeeds or all fail.
 *
 * @template CallInput Type of input the callable and its fallbacks will accept.
 * @template CallOutput Type of output the callable and its fallbacks will produce.
 */
export class CallableWithFallbacks<CallInput, CallOutput> extends Callable<
  CallInput,
  CallOutput
> {
  _isCallable = true;

  _isSerializable = true;

  _namespace: string[] = ["record", "callable"];

  static _name(): string {
    return "CallableWithFallbacks";
  }

  /**
   * The primary callable to be invoked initially.
   */
  protected callable: Callable<CallInput, CallOutput>;

  /**
   * An array of fallback callables to be invoked in order if the primary callable fails.
   */
  protected fallbacks: Callable<CallInput, CallOutput>[];

  /**
   * Constructs a new instance of CallableWithFallbacks with specified primary callable and fallbacks.
   * @param fields An object specifying the primary callable and a list of fallback callables.
   */
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
   * Invokes the primary callable with the given input, and on failure, tries each fallback callable in sequence.
   * If all callables fail, it rethrows the first encountered error.
   *
   * @param input The input for the callables.
   * @param options Optional callable configuration options, which may influence execution.
   * @returns A promise that resolves to the output of the first successful callable or rejects if all fail.
   * @throws Error if all callables fail, with the first error encountered being propagated.
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
      throw new Error("Fallbacks end without Error stored.");
    }

    throw firstError;
  }

  /**
   * Batch processes the input array by invoking the primary callable and fallbacks for each input.
   * This method applies the same fallback mechanism to each individual input in parallel.
   *
   * @param inputs Array of inputs to process.
   * @param options Optional configuration for each invocation or a single configuration for all.
   * @param batchOptions Optional settings for batch execution, such as concurrency limits and error handling strategies.
   * @returns A promise that resolves to an array of results or errors, based on the execution and batch options.
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
      throw new Error("Fallbacks end without Error stored.");
    }

    throw firstError;
  }

  /**
   * @hidden
   * @internal
   */
  protected _getCallableMetadata(): {
    type: string;
    callables?: SerializedCallableFields;
  } {
    return {
      type: "CallableWithFallbacks",
      callables: {
        callable: this.callable.getAttributes(),
        fallbacks: this.fallbacks.map((fallback) => fallback.getAttributes()),
      },
    };
  }

  /**
   * @hidden
   * @deprecated
   */
  async toInputRecord(
    aliases: SerializedKeyAlias,
    secrets: SecretFields,
    kwargs: SerializedFields
  ): Promise<Serialized> {
    return {
      _grp: 2,
      _type: "input_record",
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

  /**
   * @hidden
   * @deprecated
   */
  async toEventRecord(
    aliases: SerializedKeyAlias,
    secrets: SecretFields,
    kwargs: SerializedFields,
    outputs: CallOutput,
    parent?: RecordId | undefined
  ): Promise<Serialized> {
    let serializedOutputs: SerializedFields;
    if (typeof outputs === "object") {
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
      _type: "event_record",
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
 * Manages a sequence of Callables where the output of one callable serves as the input to the next.
 * This class facilitates creating pipelines of operations that process data in a sequential manner.
 *
 * @template CallInput Type of the initial input accepted by the sequence.
 * @template CallOutput Type of the final output produced by the sequence.
 */
export class CallableSequence<
  CallInput = unknown,
  CallOutput = unknown,
> extends Callable<CallInput, CallOutput> {
  _isCallable = true;

  _isSerializable = true;

  _namespace: string[] = ["record", "callable"];

  static _name(): string {
    return "CallableSequence";
  }

  /**
   * The first callable in the sequence.
   */
  protected first: Callable<CallInput>;

  /**
   * An array of intermediate callables that process data between the first and the last callable.
   */
  protected middle: Callable[] = [];

  /**
   * The last callable in the sequence, producing the final output.
   */
  protected last: Callable<unknown, CallOutput>;

  /**
   * Constructs a new CallableSequence.
   * @param fields An object specifying the first, middle, and last callables in the sequence.
   */
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
   *
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

  /**
   * @hidden
   * @internal
   */
  protected _getCallableMetadata(): {
    type: string;
    callables?: SerializedCallableFields;
  } {
    return {
      type: "CallableSequence",
      callables: {
        first: this.first.getAttributes(),
        middle: this.middle.map((mid) => mid.getAttributes()),
        last: this.last.getAttributes(),
      },
    };
  }
}

/**
 * Represents a conditional callable that decides which specific callable to execute based on a set of predefined rules.
 * This class facilitates the execution of different callables depending on the input and associated conditions, enhancing flexibility and control over logic flow.
 *
 * @template CallInput Type of input the callable will accept.
 * @template CallOutput Type of output the callable will produce, typically a record mapping keys to outputs of individual callables.
 * @template CallOptions Extends {@link CallableIfConfig} to include additional configuration specific to conditional execution.
 */
export class CallableIf<
  CallInput,
  CallOutput extends Record<string, unknown> = Record<string, unknown>,
  CallOptions extends CallableIfConfig = CallableIfConfig,
> extends Callable<CallInput, CallOutput, CallOptions> {
  /** @hidden */
  declare CallIfOptions: Omit<CallOptions, keyof CallableConfig>;

  _isCallable = true;

  _isSerializable = true;

  _namespace: string[] = ["record", "callable"];

  static _name(): string {
    return "CallableIf";
  }

  /**
   * A mapping of rules that determine whether the associated callable actions should be executed.
   */
  protected _rules: Record<string, BaseRule>;

  /**
   * A mapping of callables to be potentially executed, each associated with a specific rule.
   */
  protected _actions: Record<string, Callable<CallInput>>;

  /**
   * An optional default callable to be executed if no rules are satisfied.
   */
  protected _default?: Callable<CallInput>;

  /**
   * Constructs a new instance of CallableIf with specified rules, actions, and an optional default callable.
   *
   * @param fields An object containing the rules, actions, and optionally a default callable.
   * @throws Error if an action does not have a corresponding rule.
   */
  constructor(fields: {
    rules: Record<string, BaseRule>;
    actions: Record<string, CallableLike<CallInput>>;
    default?: CallableLike<CallInput>;
  }) {
    super(fields);

    this._rules = fields.rules;

    this._actions = {};
    for (const [k, v] of Object.entries(fields.actions)) {
      if (!this._rules[k]) {
        throw new Error(`CANNOT find rule of "${k}"`);
      }

      this._actions[k] = convertCallableLikeToCallable(v);
    }

    this._default = fields.default
      ? convertCallableLikeToCallable(fields.default)
      : undefined;
  }

  /**
   * Creates a new `CallableIf` instance from the specified rules and actions.
   *
   * @param {Record<string, BaseRule>} rules - The rules for the callable instance.
   * @param {Record<string, CallableLike<CallInput>>} actions - The actions for the
   * callable instance.
   * @param {CallableLike<CallInput> | undefined} default
   * @returns {CallableIf<CallInput>} A new instance of `CallableIf`.
   */
  static from<CallInput>(
    rules: Record<string, BaseRule>,
    actions: Record<string, CallableLike<CallInput>>,
    defaultCallable?: CallableLike<CallInput>
  ): CallableIf<CallInput> {
    return new CallableIf<CallInput>({
      rules,
      actions,
      default: defaultCallable,
    });
  }

  /**
   * Evaluates the rules with the given input and executes the associated callable if the rule is true.
   * If no rules are satisfied, the default callable is executed if it is defined.
   *
   * @param input The input for the callable.
   * @param options Optional additional options influencing the callable execution.
   * @returns A promise that resolves to the output of the executed callable, or the default output if no callable is executed.
   */
  async invoke(
    input: CallInput,
    options?: Partial<CallOptions> | undefined
  ): Promise<CallOutput> {
    const [callOptions, { variables }] =
      this._splitCallIfOptionsFromConfig(options);

    const ruleResults: Record<string, boolean> = {};
    const output: Record<string, unknown> = {};

    try {
      await Promise.all(
        Object.entries(this._rules).map(async ([k, rule]) => {
          ruleResults[k] = await rule.validate(input, variables);
        })
      );

      await Promise.all(
        Object.entries(this._actions).map(async ([k, callable]) => {
          output[k] = ruleResults[k]
            ? await callable.invoke(input, callOptions)
            : await this._default?.invoke(input, callOptions);
        })
      );
    } catch (e) {
      throw e;
    }

    return output as CallOutput;
  }

  /**
   * @hidden
   * @internal
   */
  protected _getCallableMetadata(): {
    type: string;
    callables?: SerializedCallableFields;
  } {
    return {
      type: "CallableIf",
      callables: {
        rules: Object.fromEntries(
          Object.entries(this._rules).map(([k, v]) => [k, v.getAttributes()])
        ),
        actions: Object.fromEntries(
          Object.entries(this._actions).map(([k, v]) => [k, v.getAttributes()])
        ),
        default: this._default?.getAttributes(),
      },
    };
  }

  /**
   * @hidden
   * @internal
   */
  private _splitCallIfOptionsFromConfig(
    options: Partial<CallOptions> = {}
  ): [CallableConfig, this["CallIfOptions"]] {
    const [callOptions, callIfOptions] =
      super._splitCallableOptionsFromCallOptions(options);

    return [callOptions, callIfOptions as this["CallIfOptions"]];
  }
}
