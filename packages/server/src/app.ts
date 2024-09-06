import fs from 'node:fs';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';

import config from './config.js';
import encreAPIRouter from './routes/index.js';
import errorMiddleware from './utils/errorMiddleware.js';

export class App {
  app: express.Application;

  constructor() {
    this.app = express();
  }

  async configure() {
    this.app.disable('x-powered-by');

    this.app.use(cors());

    this.app.use(
      rateLimit({
        windowMs: 60 * 1000,
        max: 500,
        legacyHeaders: false,
        standardHeaders: true,
      })
    );

    this.app.use(
      bodyParser.json({ limit: `${config.upload!.fileSizeLimitMB}mb` })
    );

    this.app.use(
      bodyParser.raw({
        type: 'application/actual-sync',
        limit: `${config.upload!.fileSizeSyncLimitMB}mb`,
      })
    );

    this.app.use((req, res, next) => {
      res.set('Cross-Origin-Opener-Policy', 'same-origin');
      res.set('Cross-Origin-Embedder-Policy', 'require-corp');
      next();
    });

    this.app.use(express.static(config.webRoot, { index: false }));

    this.app.get('/', (req, res) =>
      res.sendFile(config.webRoot + '/index.html')
    );

    this.app.use('/api/v1', encreAPIRouter);

    this.app.use(errorMiddleware);
  }
}

function parseHTTPSConfig(value: string) {
  if (value.startsWith('-----BEGIN')) {
    return value;
  }
  return fs.readFileSync(value);
}

let app: App | undefined;

export default async function run() {
  app = new App();

  await app.configure();

  if (config.https) {
    const https = await import('node:https');
    const httpsOptions = {
      ...config.https,
      key: parseHTTPSConfig(config.https.key),
      cert: parseHTTPSConfig(config.https.cert),
    };
    https
      .createServer(httpsOptions, app.app)
      .listen(config.port, config.hostname);
  } else {
    app.app.listen(config.port, config.hostname);
  }

  console.log('Listening on ' + config.hostname + ':' + config.port + '...');
}

export function getInstance(): App | undefined {
  return app;
}
