import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import { createStream } from 'rotating-file-stream';
import { Logger } from 'tslog';

const logDir = './logs';

if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

const stream = createStream('tslog.log', {
  size: '10M',
  interval: '1d',
  compress: 'gzip',
  path: path.join(logDir, ''),
});

const logger = new Logger();

logger.attachTransport((logObj) => {
  stream.write(JSON.stringify(logObj) + '\n');
});

export default logger;
