import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import ApiError from '../abstractions/impl/errors/apierror.js';
import BaseApi from '../components/impl/baseapi.js';
import { Controller, Get } from '../components/impl/baserouter.decorator.js';
import SystemService from '../services/impl/system.service.js';
import {
  ProcessInfo,
  SystemInfo,
  SystemUsageInfo,
  TimeInfo,
} from '../services/system.interface.js';

/**
 * System Status Controller
 */
@Controller('/')
class SystemController extends BaseApi {
  private _systemService: SystemService;

  constructor() {
    super();

    this._systemService = new SystemService();
  }

  @Get('/sysInfo')
  public getSystemInfo(
    req: Request<
      Record<string, never>,
      Record<string, never>,
      Record<string, never>,
      Record<string, never>
    >,
    res: Response,
    next: NextFunction
  ): void {
    try {
      const response: SystemInfo = this._systemService.getSystemInfo();
      res.locals.data = response;
      super.send(res);
    } catch (err: any) {
      next(err);
    }
  }

  @Get('/sysTime')
  public getSystemTime(
    req: Request<
      Record<string, never>,
      Record<string, never>,
      Record<string, never>,
      Record<string, never>
    >,
    res: Response,
    next: NextFunction
  ): void {
    try {
      const response: TimeInfo = this._systemService.getSystemTime();
      res.locals.data = response;
      super.send(res);
    } catch (err: any) {
      next(err);
    }
  }

  @Get('/error')
  public getError(
    req: Request<
      Record<string, never>,
      Record<string, never>,
      Record<string, never>,
      Record<string, never>
    >,
    res: Response,
    next: NextFunction
  ): void {
    try {
      throw new ApiError(ReasonPhrases.BAD_GATEWAY, StatusCodes.BAD_REQUEST);
    } catch (err: any) {
      next(err);
    }
  }

  @Get('/sysUsage')
  public getSystemUsage(
    req: Request<
      Record<string, never>,
      Record<string, never>,
      Record<string, never>,
      Record<string, never>
    >,
    res: Response,
    next: NextFunction
  ): void {
    try {
      const response: SystemUsageInfo = this._systemService.getSystemUsage();
      res.locals.data = response;
      super.send(res);
    } catch (err: any) {
      next(err);
    }
  }

  @Get('/processInfo')
  public getProcessInfo(
    req: Request<
      Record<string, never>,
      Record<string, never>,
      Record<string, never>,
      Record<string, never>
    >,
    res: Response,
    next: NextFunction
  ): void {
    try {
      const response: ProcessInfo = this._systemService.getProcessInfo();
      res.locals.data = response;
      super.send(res);
    } catch (err: any) {
      next(err);
    }
  }
}

export default SystemController;
