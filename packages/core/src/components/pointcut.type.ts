import { Func } from '../abstractions/types.type.js';
import { AdviceMap } from './aspect.type.js';

export type PointCutMap = {
  method: Func;
  adviceMap: AdviceMap;
};

/**
 * pointCutMethodName: string
 * pointCutMap: PointCutMap
 */
export type PointCutContainer = Record<string, PointCutMap>;
