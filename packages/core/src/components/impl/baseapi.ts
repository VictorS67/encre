import { Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../../lib/logger.js';
import { BaseRouterKeys } from '../baserouter.constant.js';
import { IRouter } from '../baserouter.interface.js';

/**
 * Provides services common to all API methods
 */
abstract class BaseApi {
  protected router: Router;

  protected constructor() {
    this.router = Router();
  }

  public register(): Router {
    const routers: IRouter[] = Reflect.getMetadata(
      BaseRouterKeys.ROUTERS,
      this.constructor
    );

    routers.forEach(({ method, path, handlerName }) => {
      this.router[method](path, this[String(handlerName)].bind(this));
    });

    return this.router;
  }

  /**
   * Global method to send API response
   */
  public send(res: Response, statusCode: number = StatusCodes.OK): void {
    let obj = {};
    obj = res.locals.data;
    if (
      global.environment.isProductionEnvironment() ||
      global.environment.isTestEnvironment()
    ) {
      logger.info(statusCode, JSON.stringify(obj));
    }
    res.status(statusCode).send(obj);
  }
}

export default BaseApi;
