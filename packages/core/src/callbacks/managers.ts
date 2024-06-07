import { Callable } from "../record/callable.js";
import { tryJsonStringify } from "../utils/stringify.js";
import { BaseCallbackHandler, getHandler } from "./handlers.js";
import { BaseCallbackHooks } from "./hooks/base.js";
import { consumeCallback } from "./promise.js";

/**
 * Defines a callable callback metadata.
 */
export type CallbackMetadata = {
  [key: string]: unknown;
};

export interface BaseCallbackManagerParams {
  name: string | undefined;
  verbose: boolean;
  tags: string[];
  handlers: BaseCallbackHandler[];
  metadata: CallbackMetadata;
}

export type Callbacks =
  | BaseCallbackManager
  | BaseCallbackHandler[]
  | BaseCallbackHooks[];

export class BaseCallbackManager
  implements BaseCallbackManagerParams, BaseCallbackHooks
{
  name: string | undefined;

  verbose: boolean;

  tags: string[];

  handlers: BaseCallbackHandler[];

  metadata: CallbackMetadata;

  constructor(fields?: Partial<BaseCallbackManagerParams>) {
    this.name = fields?.name;
    this.verbose = fields?.verbose ?? false;
    this.tags = fields?.tags ?? [];
    this.handlers = fields?.handlers ?? [];
    this.metadata = fields?.metadata ?? {};
  }

  async beforeInvoke(callable: Callable, input: unknown): Promise<void> {
    if (this.verbose) {
      const name: string = this.name ?? callable._id[callable._id.length - 1];

      console.log(
        `[CALLBACK beforeInvoke] ${name} start with input: ${tryJsonStringify(
          input,
          "[input]"
        )}`
      );
    }

    await Promise.all(
      this.handlers.map((handler) =>
        consumeCallback(async () => {
          try {
            await handler.beforeInvoke?.(callable, input);
          } catch (e) {
            if (this.verbose) {
              console.error(
                `[CALLBACK beforeInvoke] handler ${handler.constructor.name} throws error: ${e}`
              );
            }

            if (handler.shouldRaiseError) {
              throw e;
            }
          }
        }, handler.shouldWait)
      )
    );
  }

  async afterInvoke(callable: Callable, output: unknown): Promise<void> {
    if (this.verbose) {
      const name: string = this.name ?? callable._id[callable._id.length - 1];

      console.log(
        `[CALLBACK afterInvoke] ${name} end with output: ${tryJsonStringify(
          output,
          "[output]"
        )}`
      );
    }

    await Promise.all(
      this.handlers.map((handler) =>
        consumeCallback(async () => {
          try {
            await handler.afterInvoke?.(callable, output);
          } catch (e) {
            if (this.verbose) {
              console.error(
                `[CALLBACK afterInvoke] handler ${handler.constructor.name} throws error: ${e}`
              );
            }

            if (handler.shouldRaiseError) {
              throw e;
            }
          }
        }, handler.shouldWait)
      )
    );
  }

  async onError(callable: Callable, error: Error | string): Promise<void> {
    if (this.verbose) {
      const name: string = this.name ?? callable._id[callable._id.length - 1];

      console.log(
        `[CALLBACK onError] ${name} throws error: ${error.toString()}`
      );
    }

    await Promise.all(
      this.handlers.map((handler) =>
        consumeCallback(async () => {
          try {
            await handler.onError?.(callable, error);
          } catch (e) {
            if (this.verbose) {
              console.error(
                `[CALLBACK onError] handler ${handler.constructor.name} throws error: ${e}`
              );
            }

            if (handler.shouldRaiseError) {
              throw e;
            }
          }
        }, handler.shouldWait)
      )
    );
  }

  addHandler(handler: BaseCallbackHandler): void {
    this.handlers.push(handler);
  }

  removeHandler(handler: BaseCallbackHandler): void {
    this.handlers = this.handlers.filter((h) => h !== handler);
  }

  static fromHooks(
    hooksArr: BaseCallbackHooks[],
    options?: Partial<Omit<BaseCallbackManagerParams, "handlers">>
  ): BaseCallbackManager {
    const manager: BaseCallbackManager = new this(options);

    hooksArr.forEach((hooks: BaseCallbackHooks) => {
      const handler: BaseCallbackHandler = BaseCallbackHandler.fromHooks(hooks);
      manager.addHandler(handler);
    });

    return manager;
  }

  static configure(
    callbacks?: Callbacks,
    name?: string,
    tags?: string[],
    metadata?: CallbackMetadata,
    options?: { verbose?: boolean }
  ): BaseCallbackManager | undefined {
    let manager: BaseCallbackManager | undefined;

    if (callbacks) {
      if (Array.isArray(callbacks)) {
        manager = new BaseCallbackManager();
        manager.handlers = callbacks.map(getHandler);
      } else {
        manager = callbacks;
      }
    }

    if (manager) {
      const verbose = options?.verbose;
      if (verbose) {
        manager.verbose = verbose;
      }
  
      manager.name = name;
      manager.tags = tags ?? [];
      manager.metadata = metadata ?? {};
    }

    return manager;
  }
}
