// import 'reflect-metadata';
import http from 'http';
import { AddressInfo } from 'net';
import App from './app.js';
import Environment from './environments/environment.js';
import { setGlobalEnvironment } from './global.js';
import logger from './lib/logger.js';

const env: Environment = new Environment();
setGlobalEnvironment(env);

const app: App = new App();

let httpServer: http.Server;

function httpServerError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // handle specific error codes here
  throw error;
}

function httpServerListening(): void {
  const { port } = httpServer.address() as AddressInfo;
  logger.info(`HTTP listening on port ${port}`);
}

app
  .init()
  .then(() => {
    logger.info(`Start on ${env.env} environment`);
    app.express.set('port', env.port);

    httpServer = app.httpSever;
    httpServer.on('error', httpServerError);
    httpServer.on('listening', httpServerListening);
    httpServer.listen(env.port);
  })
  .catch((err: Error) => {
    logger.info('app.init error');
    logger.error(err.name);
    logger.error(err.message);
    logger.error(err.stack);
  });

process.on('unhandledRejection', (reason: Error) => {
  logger.error(`Unhandled Promise Rejection:\n
  reason:${reason.message}`);
  logger.error(reason.stack);
});
