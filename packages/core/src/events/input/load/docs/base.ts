import { BaseEvent, BaseEventParams } from '../../../base.js';
import { Context } from './context.js';

/**
 * Interface that defines the loader for loading readable source.
 */
export interface DocLoader<Input = unknown, Output = Context[]> {
  load(source: Input): Promise<Output>;
}

export interface BaseDocLoaderCallOptions extends BaseEventParams {
  /**
   * Whether the loader should split the context into chunks
   */
  shouldSplit?: boolean;
}

export interface BaseLoaderParams extends BaseDocLoaderCallOptions {}

/**
 * Abstract class that provides an abstract load() event from the Loader
 * interface.
 */
export abstract class BaseLoader<
    CallInput = unknown,
    CallOutput = Context[],
    CallOptions extends BaseDocLoaderCallOptions = BaseDocLoaderCallOptions,
  >
  extends BaseEvent<CallInput, CallOutput, CallOptions>
  implements DocLoader<CallInput, CallOutput>
{
  declare CallOptions: CallOptions;

  _namespace: string[] = ['input', 'load', 'docs'];

  shouldSplit?: boolean;

  constructor(fields?: BaseLoaderParams) {
    super(fields ?? {});

    this.shouldSplit = fields?.shouldSplit ?? false;
  }

  async invoke(
    input: CallInput,
    options?: Partial<CallOptions>
  ): Promise<CallOutput> {
    this.shouldSplit = options?.shouldSplit ?? this.shouldSplit;

    return this.load(input);
  }

  /**
   * Abstract method that loads the readable source.
   * @returns A Promise that resolves with an array of `Context` instances.
   */
  abstract load(source: CallInput): Promise<CallOutput>;
}
