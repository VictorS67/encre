import { Request, Response, NextFunction } from 'express';
import type { Data, GraphInputs, ProcessOptions } from '@encrejs/api';
import type { ProcessStreamEventFilter } from '@encrejs/api/streaming';
import appService from '../../services/app/index.js';
import config from '../../config.js';

const run = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      userInputs: inputs,
      appPath,
      context,
      filter,
    } = req.body as {
      userInputs: GraphInputs;
      appPath?: string;
      context?: Record<string, Data>;
      filter?: ProcessStreamEventFilter;
    };

    const filePath: string =
      appPath ?? config.encreFilePath ?? config.projectRoot;
    const options: ProcessOptions = { inputs, context };

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Transfer-Encoding', 'chunked');

    for await (const chunk of appService.run(filePath, options, filter)) {
      const groups = /event: (?<event>.*)\ndata: (?<data>.*)\n\n/.exec(chunk)!
        .groups!;

      const eventName = groups.event!;
      const data = groups.data!;

      const chunkData = {
        ['#event']: eventName,
        ...JSON.parse(data),
      };

      res.write(`data: ${JSON.stringify(chunkData)}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    next(error);
  }
};

export default { run };
