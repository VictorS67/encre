import http from 'http';
import cors from 'cors';
import express, {
  Application,
  Request,
  Response,
  json,
  urlencoded,
} from 'express';
import helmet from 'helmet';
import { Func } from './abstractions/types.type.js';
import addErrorHandler from './middleware/errorhandler.js';

export default class App {
  public express!: Application;

  public httpSever!: http.Server;

  public async init(): Promise<void> {
    this.express = express();

    this.httpSever = http.createServer(this.express);

    // add all global middleware
    this.middleware();

    //TODO: Add router

    // add the middleware to handle error.
    // make sure to add if after registering routes method
    this.express.use(addErrorHandler);
  }

  /**
   * Add all middlewares
   */
  private middleware(): void {
    // use Helmet to protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately
    this.express.use(helmet({ contentSecurityPolicy: false }));

    // support application/json type post data with maximum size of 100 MB
    this.express.use(json({ limit: '100mb' }));

    // support application/x-www-form-urlencoded post data with maximum size of 100 MB
    this.express.use(urlencoded({ limit: '100mb', extended: true }));

    // add multiple CORS options
    const corsOptions = {
      origin: ['http://localhost:8080/server/core/'],
    };
    this.express.use(cors(corsOptions));
  }

  /**
   * Parse request header
   */
  private parseRequestHeader(req: Request, res: Response, next: Func): void {
    console.log('header access token: ', req.headers.access_token);
    next();
  }
}
