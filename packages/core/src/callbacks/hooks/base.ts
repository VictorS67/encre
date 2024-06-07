import { Callable } from "../../record/callable.js";

export interface BaseCallbackHooks {
  beforeInvoke?(callable: Callable, input: unknown): Promise<any> | any;

  afterInvoke?(callable: Callable, output: unknown): Promise<any> | any;

  onError?(callable: Callable, error: Error | string): Promise<any> | any;
}
