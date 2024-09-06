import { type BaseRule } from '../../events/inference/validate/guardrails/index.js';
import {
  Callable,
  type CallableConfig,
  type CallableIfConfig,
  type CallableLike,
  type SerializedCallableFields,
  convertCallableLikeToCallable
} from '../callable.js';

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

  _namespace: string[] = ['record', 'callable'];

  static _name(): string {
    return 'CallableIf';
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

    /*eslint no-useless-catch: "warn"*/
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
      type: 'CallableIf',
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
  ): [CallableConfig, this['CallIfOptions']] {
    const [callOptions, callIfOptions] =
      super._splitCallableOptionsFromCallOptions(options);

    return [callOptions, callIfOptions as this['CallIfOptions']];
  }
}
