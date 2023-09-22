import { inspect } from 'util';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../abstractions/impl/errors/apierror.js';
import logger from '../lib/logger.js';

export default function addErrorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err) {
    const status: number = err.status || StatusCodes.INTERNAL_SERVER_ERROR;

    logger.debug(`REQUEST HANDLING ERROR:\n
    ERROR:\n${JSON.stringify(err)}\n
    REQUEST HEADERS:\n${inspect(req.headers)}\n
    REQUEST PARAMS:\n${inspect(req.params)}\n
    REQUEST QUERY:\n${inspect(req.query)}\n
    BODY:\n${inspect(req.body)}`);

    const body: any = {
      fields: err.fields,
      message: err.message || 'An error occurred during the request.',
      name: err.name,
      status,
      stack: '',
    };

    // Don't send error stack trace to production env
    if (global.environment && global.environment.isDevEnvironment()) {
      body.stack = err.stack;
    }

    res.status(status);
    res.send(body);
  }
  next();
}
