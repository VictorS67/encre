import { types } from 'util';
import { Class, Func } from '../../abstractions/types.type.js';
import { AdviceKey } from '../aop.constant.js';
import { AdviceCtx, AdviceMap } from '../aspect.type.js';
import { PointCutContainer } from '../pointcut.type.js';
import pointcut from './pointcut.js';
import proxy from './proxy.js';

/**
 * Mark a method as a point-cut, allowing aspects be woven into the proxy object,
 * in order to modify the behavior of the method without altering its code.
 */
const PointCut = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => {
  const targetClass: Class = target.constructor;
  const originalMethod: Func = descriptor.value;
  const methodName = String(propertyKey);

  let pointCutContainer: PointCutContainer | undefined =
    pointcut.getPointCutContainer(targetClass);

  if (!pointCutContainer) {
    pointCutContainer = {};
    pointcut.setPointCutContainer(targetClass, pointCutContainer);
  }

  if (!pointCutContainer[methodName]) {
    pointCutContainer[methodName] = {
      method: originalMethod,
      adviceMap: new Map<AdviceKey, AdviceCtx[]>(),
    };
  } else {
    pointCutContainer[methodName].method = originalMethod;
  }

  pointcut.setPointCutContainer(targetClass, pointCutContainer);

  descriptor.value = (...args: any[]) => {
    const currPointCutContainer: PointCutContainer | undefined =
      pointcut.getPointCutContainer(targetClass);

    if (currPointCutContainer) {
      if (types.isAsyncFunction(originalMethod)) {
        return proxy.asyncProxyFunc(
          targetClass,
          methodName,
          currPointCutContainer[methodName],
          ...args
        );
      } else {
        return proxy.proxyFunc(
          targetClass,
          methodName,
          currPointCutContainer[methodName],
          ...args
        );
      }
    }

    return originalMethod(...args);
  };

  return descriptor;
};

/**
 * Mark a method as an advice, defining cross-cutting concerns
 * that can be dynamically woven into other classes at runtime.
 */
const adviceDecoratorFactory = (advice: AdviceKey) => {
  return (
    pointCutClass: Class,
    pointCutMethod: string | string[]
  ): MethodDecorator => {
    return (
      target: any,
      propertyKey: string | symbol,
      descriptor: PropertyDescriptor
    ) => {
      const targetClass: Class = target.constructor;
      const originalMethod: Func = descriptor.value;
      const methodName = String(propertyKey);

      let pointCutContainer: PointCutContainer | undefined =
        pointcut.getPointCutContainer(pointCutClass);

      if (!pointCutContainer) {
        pointCutContainer = {};
        pointcut.setPointCutContainer(pointCutClass, pointCutContainer);
      }

      const pointCutMethods: string[] = pointcut.filterClassNames(
        targetClass,
        methodName,
        pointCutClass,
        pointCutMethod
      );

      for (let j = 0; j < pointCutMethods.length; j++) {
        const pointCutMethodName: string = pointCutMethods[j];

        const adviceCtx: AdviceCtx = {
          adviceType: advice,
          cls: targetClass,
          method: originalMethod,
          pointCutClassName: pointCutClass.name,
          pointCutMethodName,
        };

        if (!pointCutContainer[pointCutMethodName]) {
          pointCutContainer[pointCutMethodName] = {
            method: (): void => {},
            adviceMap: new Map<AdviceKey, AdviceCtx[]>([
              [adviceCtx.adviceType, [adviceCtx]],
            ]),
          };
        } else {
          const adviceMap: AdviceMap =
            pointCutContainer[pointCutMethodName].adviceMap;

          let adviceCtxArr: AdviceCtx[] | undefined = adviceMap.get(
            adviceCtx.adviceType
          );
          if (!adviceCtxArr) {
            adviceCtxArr = [];
          }

          adviceCtxArr.push(adviceCtx);
          pointCutContainer[pointCutMethodName].adviceMap.set(
            adviceCtx.adviceType,
            adviceCtxArr
          );
        }

        pointcut.setPointCutContainer(pointCutClass, pointCutContainer);
      }

      return descriptor;
    };
  };
};

const Before = adviceDecoratorFactory(AdviceKey.BEFORE);
const Around = adviceDecoratorFactory(AdviceKey.AROUND);
const After = adviceDecoratorFactory(AdviceKey.AFTER);
const AfterReturning = adviceDecoratorFactory(AdviceKey.AFTER_RETURNING);
const afterThrowing = adviceDecoratorFactory(AdviceKey.AFTER_THROWING);
const afterFinally = adviceDecoratorFactory(AdviceKey.AFTER_FINALLY);

export {
  PointCut,
  Before,
  Around,
  After,
  AfterReturning,
  afterThrowing,
  afterFinally,
};
