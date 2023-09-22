import { existsSync, mkdirSync } from 'fs';
import { createStream } from 'rotating-file-stream';
import { Logger } from 'tslog';

const logDir = './logs';

if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

const stream = createStream(`${logDir}/tslog.log`, {
  size: '10B',
  interval: '1d',
  compress: 'gzip',
});

const logger = new Logger();

logger.attachTransport((logObj) => {
  stream.write(JSON.stringify(logObj) + '\n');
});

export default logger;
