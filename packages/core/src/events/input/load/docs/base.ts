import { BaseEvent, BaseEventParams } from '../../../base.js';
import { Context } from './context.js';

/**
 * Interface for defining a loader that is responsible for loading readable sources and returning them in a specified output format.
 * This loader is typically used for processing input data and transforming it into a structured context suitable for further processing.
 *
 * @template Input The type of input that the loader accepts.
 * @template Output The type of output that the loader produces, typically an array of Context objects.
 */
export interface DocLoader<Input = unknown, Output = Context[]> {
  /**
   * Loads data from the provided source and returns it as structured output.
   *
   * @param source The source input to load.
   * @returns A promise that resolves to the output, typically an array of contexts.
   */
  load(source: Input): Promise<Output>;
}

/**
 * Extends BaseEventParams to include options specific to document loaders, such as whether to split the context into chunks.
 * This interface is designed to provide customizable options for document loading processes.
 *
 * @extends BaseEventParams
 */
export interface BaseDocLoaderCallOptions extends BaseEventParams {
  /**
   * Optional flag indicating whether the loader should split the loaded context into separate chunks.
   * This can be useful for handling large datasets or distributing processing load.
   */
  shouldSplit?: boolean;
}

/**
 * Defines parameters for initializing BaseLoader instances, including all options from BaseDocLoaderCallOptions.
 * This interface is typically used to pass configuration options when creating new loader instances.
 *
 * @extends BaseDocLoaderCallOptions
 */
export interface BaseLoaderParams extends BaseDocLoaderCallOptions {}

/**
 * An abstract class that defines the framework for a document loader, capable of loading inputs and transforming them into a structured context.
 * Subclasses are expected to implement the specific logic for loading and processing the data based on the defined abstract methods.
 *
 * @template CallInput The type of input the loader accepts, defaulting to unknown.
 * @template CallOutput The type of output the loader produces, typically an array of Context objects.
 * @template CallOptions The options applicable to the loader, extending BaseDocLoaderCallOptions.
 */
export abstract class BaseLoader<
    CallInput = unknown,
    CallOutput = Context[],
    CallOptions extends BaseDocLoaderCallOptions = BaseDocLoaderCallOptions,
  >
  extends BaseEvent<CallInput, CallOutput, CallOptions>
  implements DocLoader<CallInput, CallOutput>
{
  /** @hidden */
  declare CallOptions: CallOptions;

  _eventNamespace(): string[] {
    return ['input', 'load', 'docs', this._docType()];
  }

  /**
   * Whether the loader should split the output into chunks.
   */
  shouldSplit?: boolean;

  constructor(fields?: BaseLoaderParams) {
    super(fields ?? {});

    this.shouldSplit = fields?.shouldSplit ?? false;
  }

  /**
   * Invokes the loading process with the given input and options.
   *
   * @param input The input data to load.
   * @param options Optional settings to customize the loading process.
   * @returns A Promise resolving to the output, typically an array of contexts.
   */
  async invoke(
    input: CallInput,
    options?: Partial<CallOptions>
  ): Promise<CallOutput> {
    this.shouldSplit = options?.shouldSplit ?? this.shouldSplit;

    return this.load(input);
  }

  /**
   * Defines the document type that this loader handles.
   *
   * @returns A string representing the document type.
   */
  abstract _docType(): string;

  /**
   * Define how sources are loaded.
   *
   * @param source The input source to be loaded.
   * @returns A Promise that resolves with the loaded output, as defined by CallOutput.
   */
  abstract load(source: CallInput): Promise<CallOutput>;
}
