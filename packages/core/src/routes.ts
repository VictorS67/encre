import { Handler, Router } from 'express';
import { BaseRouterKeys } from './components/baserouter.constant.js';
import SystemController from './controllers/system.controller.js';

const controllers = [SystemController];

export default function registerRoutes(): Router {
  const router = Router();

  controllers.forEach((controllerClass) => {
    const controller: { [handlerName: string]: Handler } =
      new controllerClass() as any;

    const basePath: string = Reflect.getMetadata(
      BaseRouterKeys.BASE_PATH,
      controllerClass
    );

    router.use(basePath, controller['register'].bind(controller)());
  });

  return router;
}
