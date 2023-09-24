import { Class } from '../../abstractions/types.type.js';
import { AOPKey, PointCutMethod } from '../aop.constant.js';
import { PointCutContainer } from '../pointcut.type.js';

class PointCut {
  private static _instance: PointCut;

  private _pointCutPropKey = `${AOPKey.POINT_CUT}_prop_key`;

  private constructor() {}

  public static getInstance(): PointCut {
    if (!PointCut._instance) {
      PointCut._instance = new PointCut();
    }

    return PointCut._instance;
  }

  public getPointCutContainer(
    pointCutClass: Class
  ): PointCutContainer | undefined {
    return Reflect.get(pointCutClass, this._pointCutPropKey);
  }

  public setPointCutContainer(
    pointCutClass: Class,
    pointCutContainer: PointCutContainer
  ): boolean {
    return Reflect.set(pointCutClass, this._pointCutPropKey, pointCutContainer);
  }

  public filterClassNames(
    targetClass: Class,
    methodName: string,
    pointCutClass: Class,
    pointCutMethod: string | string[]
  ): string[] {
    const pointCutMethods: string[] = [];
    if (typeof pointCutMethod === 'string' && pointCutMethod !== null) {
      pointCutMethods.push(pointCutMethod);
    } else {
      pointCutMethods.concat(pointCutMethod);
    }

    const newPointCutMethods: string[] = [];
    for (let i = 0; i < pointCutMethods.length; i++) {
      const pointCutMethodName: string = pointCutMethods[i];
      if (pointCutMethodName === PointCutMethod.ALL) {
        Reflect.ownKeys(pointCutClass.prototype).forEach(
          (actualMethodName: string | symbol) => {
            const actualMethodNameStr = String(actualMethodName);
            if (
              actualMethodNameStr !== 'constructor' &&
              !newPointCutMethods.includes(actualMethodNameStr) &&
              !(
                pointCutClass.name === targetClass.name &&
                actualMethodNameStr === methodName
              )
            ) {
              newPointCutMethods.push(actualMethodNameStr);
            }
          }
        );
      } else {
        newPointCutMethods.push(pointCutMethodName);
      }
    }

    return newPointCutMethods;
  }
}

export default PointCut.getInstance();
