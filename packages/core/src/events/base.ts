import { SerializedFields } from '../load/keymap';
import { Callable, CallableConfigFields, CallableConfig } from '../record/callable';

export interface BaseEventParams extends CallableConfig {
  /**
   * Whether to print out response text.
   */
  verbose?: boolean;
}

export abstract class BaseEvent<
    CallInput,
    CallOutput,
    CallOptions extends CallableConfig = CallableConfig,
  >
  extends Callable<CallInput, CallOutput, CallOptions>
  implements BaseEventParams {
  
  /**
   * Whether to print out response text.
   */
  verbose: boolean;

  name?: string;

  tags?: string[];

  metadata?: CallableConfigFields;

  callbacks?: any;

  get _attributes(): SerializedFields | undefined {
    return {
      verbose: undefined,
      callbacks: undefined
    };
  }

  constructor(fields: BaseEventParams) {
    super(fields);
    this.verbose = fields.verbose ?? false;
    this.tags = fields.tags ?? [];
    this.metadata = fields.metadata ?? {};
    this.callbacks = fields.callbacks;
  }
}
