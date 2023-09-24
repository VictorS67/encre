import logger from '../../lib/logger.js';
import { BaseRouterKeys, Methods } from '../baserouter.constant.js';
import { IRouter } from '../baserouter.interface.js';

const Controller = (basePath: string): ClassDecorator => {
  return (target: any) => {
    Reflect.defineMetadata(BaseRouterKeys.BASE_PATH, basePath, target);
  };
};

const methodDecoratorFactory = (method: Methods) => {
  return (path: string): MethodDecorator => {
    return (target: any, propertyKey: string | symbol) => {
      const controllerClass = target.constructor;

      const routers: IRouter[] = Reflect.hasMetadata(
        BaseRouterKeys.ROUTERS,
        controllerClass
      )
        ? Reflect.getMetadata(BaseRouterKeys.ROUTERS, controllerClass)
        : [];

      logger.info(
        `method: ${method}, path: ${path}, handlerName: ${String(propertyKey)}`
      );
      routers.push({
        method,
        path,
        handlerName: propertyKey,
      });

      Reflect.defineMetadata(BaseRouterKeys.ROUTERS, routers, controllerClass);
    };
  };
};

const Get = methodDecoratorFactory(Methods.GET);
const Post = methodDecoratorFactory(Methods.POST);

export { Controller, Get, Post };
