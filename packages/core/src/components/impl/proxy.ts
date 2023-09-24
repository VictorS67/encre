import { Class } from '../../abstractions/types.type.js';
import { AdviceKey } from '../aop.constant.js';
import { AdviceCtx, AdviceMap, AspectCtx } from '../aspect.type.js';
import { PointCutMap } from '../pointcut.type.js';
import aspect from './aspect.js';

class Proxy {
  private static _instance: Proxy;

  private constructor() {}

  public static getInstance(): Proxy {
    if (!Proxy._instance) {
      Proxy._instance = new Proxy();
    }

    return Proxy._instance;
  }

  public proxyFunc(
    pointCutCls: Class,
    pointCutMethodName: string,
    pointCutMap: PointCutMap,
    ...args: any[]
  ): unknown {
    const { method, adviceMap } = pointCutMap;

    const aspectCtx: AspectCtx = {
      functionParams: args,
      returnValue: null,
      error: null,
    };

    this._applyPreAspectFunc(
      aspectCtx,
      adviceMap,
      pointCutCls.name,
      pointCutMethodName
    );

    try {
      aspectCtx.returnValue = method.apply(pointCutCls, args);
    } catch (error: any) {
      if (adviceMap.has(AdviceKey.AFTER_THROWING)) {
        this._applyFunc(
          AdviceKey.AFTER_THROWING,
          aspectCtx,
          adviceMap,
          pointCutCls.name,
          pointCutMethodName
        );
      } else {
        throw error;
      }
    } finally {
      if (adviceMap.has(AdviceKey.AFTER_FINALLY)) {
        this._applyFunc(
          AdviceKey.AFTER_FINALLY,
          aspectCtx,
          adviceMap,
          pointCutCls.name,
          pointCutMethodName
        );
      }
    }

    this._applyPostAspectFunc(
      aspectCtx,
      adviceMap,
      pointCutCls.name,
      pointCutMethodName
    );

    return aspectCtx.returnValue;
  }

  public async asyncProxyFunc(
    pointCutCls: Class,
    pointCutMethodName: string,
    pointCutMap: PointCutMap,
    ...args: any[]
  ): Promise<unknown> {
    const { method, adviceMap } = pointCutMap;

    const aspectCtx: AspectCtx = {
      functionParams: args,
      returnValue: null,
      error: null,
    };

    this._applyPreAspectFunc(
      aspectCtx,
      adviceMap,
      pointCutCls.name,
      pointCutMethodName
    );

    try {
      aspectCtx.returnValue = await method.apply(pointCutCls, args);
    } catch (error: any) {
      if (adviceMap.has(AdviceKey.AFTER_THROWING)) {
        this._applyFunc(
          AdviceKey.AFTER_THROWING,
          aspectCtx,
          adviceMap,
          pointCutCls.name,
          pointCutMethodName
        );
      } else {
        throw error;
      }
    } finally {
      if (adviceMap.has(AdviceKey.AFTER_FINALLY)) {
        this._applyFunc(
          AdviceKey.AFTER_FINALLY,
          aspectCtx,
          adviceMap,
          pointCutCls.name,
          pointCutMethodName
        );
      }
    }

    this._applyPostAspectFunc(
      aspectCtx,
      adviceMap,
      pointCutCls.name,
      pointCutMethodName
    );

    return aspectCtx.returnValue;
  }

  private _applyPreAspectFunc(
    aspectCtx: AspectCtx,
    adviceMap: AdviceMap,
    pointCutClassName: string,
    pointCutMethodName: string
  ): void {
    if (adviceMap.has(AdviceKey.BEFORE)) {
      this._applyFunc(
        AdviceKey.BEFORE,
        aspectCtx,
        adviceMap,
        pointCutClassName,
        pointCutMethodName
      );
    }

    if (adviceMap.has(AdviceKey.AROUND)) {
      this._applyFunc(
        AdviceKey.AROUND,
        aspectCtx,
        adviceMap,
        pointCutClassName,
        pointCutMethodName
      );
    }
  }

  private _applyPostAspectFunc(
    aspectCtx: AspectCtx,
    adviceMap: AdviceMap,
    pointCutClassName: string,
    pointCutMethodName: string
  ): void {
    if (adviceMap.has(AdviceKey.AROUND)) {
      this._applyFunc(
        AdviceKey.AROUND,
        aspectCtx,
        adviceMap,
        pointCutClassName,
        pointCutMethodName
      );
    }

    if (adviceMap.has(AdviceKey.AFTER)) {
      this._applyFunc(
        AdviceKey.AFTER,
        aspectCtx,
        adviceMap,
        pointCutClassName,
        pointCutMethodName
      );
    }
  }

  private _applyFunc(
    adviceKey: AdviceKey,
    aspectCtx: AspectCtx,
    adviceMap: AdviceMap,
    pointCutClassName: string,
    pointCutMethodName: string
  ): void {
    adviceMap.get(adviceKey)?.forEach((advice: AdviceCtx) => {
      if (
        aspect.checkAdviceIncludePointCut(
          advice,
          pointCutClassName,
          pointCutMethodName
        )
      ) {
        advice.method.apply(advice.cls, aspectCtx.functionParams);
      }
    });
  }
}

export default Proxy.getInstance();
