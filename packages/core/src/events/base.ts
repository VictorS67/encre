import { CallbackMetadata } from "../callbacks/managers.js";
import { SerializedFields } from "../load/keymap.js";
import { Callable, CallableConfig } from "../record/callable.js";

/**
 * Extends the CallableConfig to include parameters specific to event handling.
 * This interface allows for the configuration of verbosity and other event-specific settings,
 * making it suitable for systems that require detailed control over event behavior and output.
 *
 * @extends CallableConfig
 */
export interface BaseEventParams extends CallableConfig {
  /**
   * Specifies whether the event should provide verbose output, such as detailed logs or response texts.
   * This can be useful for debugging or detailed monitoring of event handling processes.
   *
   * @experimental
   * not-implement yet
   */
  verbose?: boolean;
}

/**
 * An abstract base class for events that extends the Callable class with additional event-specific properties and behaviors.
 * This class is designed to be extended by more specific event implementations that define the actual logic to be executed when the event is triggered.
 *
 * @template CallInput Type of input accepted by the event callable.
 * @template CallOutput Type of output produced by the event callable.
 * @template CallOptions Configuration options for the callable, extending the base {@link CallableConfig}.
 *
 * @implements BaseEventParams Incorporates basic event parameters including verbosity.
 */
export abstract class BaseEvent<
    CallInput,
    CallOutput,
    CallOptions extends CallableConfig = CallableConfig,
  >
  extends Callable<CallInput, CallOutput, CallOptions>
  implements BaseEventParams
{
  _namespace: string[] = ["events", ...this._eventNamespace()];

  /**
   * Specifies whether the event should provide verbose output, such as detailed logs or response texts.
   * This can be useful for debugging or detailed monitoring of event handling processes.
   *
   * @experimental
   * not-implement yet
   */
  verbose: boolean;

  /**
   * The name of the callable, used for identification or logging.
   *
   * @experimental
   * not-implement yet
   */
  name?: string;

  /**
   * An array of strings used for categorizing or filtering callables.
   *
   * @experimental
   * not-implement yet
   */
  tags?: string[];

  /**
   * A dictionary containing metadata related to the callable, defined as {@link CallbackMetadata}.
   */
  metadata?: CallbackMetadata;

  /**
   * @experimental not-implemented yet
   */
  callbacks?: any;

  get _attributes(): SerializedFields | undefined {
    return {
      verbose: undefined,
      callbacks: undefined,
    };
  }

  constructor(fields: BaseEventParams) {
    super(fields);
    this.verbose = fields.verbose ?? false;
    this.tags = fields.tags ?? [];
    this.metadata = fields.metadata ?? {};
    this.callbacks = fields.callbacks;
  }

  /** @hidden */
  abstract _eventNamespace(): string[];
}
