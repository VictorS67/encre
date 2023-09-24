import { PointCutMethod } from '../aop.constant.js';
import { AdviceCtx } from '../aspect.type.js';

class Aspect {
  private static _instance: Aspect;

  private constructor() {}

  public static getInstance(): Aspect {
    if (!Aspect._instance) {
      Aspect._instance = new Aspect();
    }

    return Aspect._instance;
  }

  public checkAdviceIncludePointCut(
    advice: AdviceCtx,
    pointCutClassName: string,
    pointCutMethodName: string
  ): boolean {
    if (advice.pointCutClassName !== pointCutClassName) {
      return false;
    }

    return (
      advice.pointCutMethodName === PointCutMethod.ALL ||
      advice.pointCutMethodName === pointCutMethodName
    );
  }
}

export default Aspect.getInstance();
