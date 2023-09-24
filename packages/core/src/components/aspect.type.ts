import { Class, Func } from '../abstractions/types.type.js';
import { AdviceKey } from './aop.constant.js';

export type AspectCtx = {
  functionParams: any[];
  returnValue: unknown;
  error: any;
};

export type AdviceCtx = {
  adviceType: AdviceKey;
  cls: Class;
  method: Func;
  pointCutClassName: string;
  pointCutMethodName: string;
};

export type AdviceMap = Map<AdviceKey, AdviceCtx[]>;
