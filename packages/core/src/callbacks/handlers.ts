import { SerializedFields, SecretFields } from "../load/keymap.js";
import { Serializable } from "../load/serializable.js";
import { Callable } from "../record/callable.js";
import { BaseCallbackHooks } from "./hooks/base.js";

type FuncStr<T extends BaseCallbackHooks> = {
  [P in keyof T]: string;
};

export interface BaseCallbackHandlerParams extends BaseCallbackHooks {
  shouldRaiseError: boolean;
  shouldWait: boolean;
  hooks: FuncStr<BaseCallbackHooks>;
}

export abstract class BaseCallbackHandler
  extends Serializable
  implements BaseCallbackHandlerParams
{
  _isSerializable: boolean = true;

  _namespace: string[] = ["callbacks", "handlers"];

  static _name(): string {
    return this.name;
  }

  hooks: FuncStr<BaseCallbackHooks>;

  shouldRaiseError: boolean;

  shouldWait: boolean;

  get _secrets(): SecretFields | undefined {
    return undefined;
  }

  get _attributes(): SerializedFields | undefined {
    return undefined;
  }

  get _aliases(): SerializedFields | undefined {
    return undefined;
  }

  constructor(
    fields?: BaseCallbackHooks,
    options?: Omit<BaseCallbackHandlerParams, "hooks">
  ) {
    const _hooks: FuncStr<BaseCallbackHooks> = Object.fromEntries(
      Object.entries(fields ?? {}).map(([k, v]) => [k, v.toString()])
    );

    super({ hooks: _hooks, ...options });

    this.hooks = _hooks;
    this.shouldRaiseError = options?.shouldRaiseError ?? false;
    this.shouldWait = options?.shouldWait ?? false;

    Object.assign(this, fields ?? {});
  }

  beforeInvoke?(callable: Callable, input: unknown): Promise<any> | any;

  afterInvoke?(callable: Callable, output: unknown): Promise<any> | any;

  onError?(callable: Callable, error: Error | string): Promise<any> | any;

  static fromHooks(hooks: BaseCallbackHooks): BaseCallbackHandler {
    class Handler extends BaseCallbackHandler {
      constructor() {
        super(hooks);
      }
    }

    return new Handler();
  }
}

export function getHandler(
  handlerOrHooks: BaseCallbackHandler | BaseCallbackHooks
): BaseCallbackHandler {
  if ("hooks" in handlerOrHooks) {
    return handlerOrHooks;
  }

  return BaseCallbackHandler.fromHooks(handlerOrHooks);
}
