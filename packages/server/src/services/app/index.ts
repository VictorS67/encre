import {
  BaseGraph,
  createProcessor,
  loadGraph,
  ProcessOptions,
} from '@encrejs/api';
import { ProcessStreamEventFilter } from '@encrejs/api/streaming';
import { StatusCodes } from 'http-status-codes';

import { InternalError } from '../../exceptions/internal.js';
import { getErrorMessage } from '../../utils/getErrorMessage.js';

async function _getGraph(filePath: string): Promise<BaseGraph> {
  try {
    const graph = await loadGraph(filePath);

    return graph;
  } catch (error) {
    throw new InternalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `appService.getGraph: ${getErrorMessage(error)}`
    );
  }
}

function _getProcessor(
  graph: BaseGraph,
  options?: ProcessOptions
): ReturnType<typeof createProcessor> {
  try {
    const processor = createProcessor(graph, options);

    return processor;
  } catch (error) {
    throw new InternalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `appService.getProcessor: ${getErrorMessage(error)}`
    );
  }
}

async function* run(
  filePath: string,
  options?: ProcessOptions,
  filter?: ProcessStreamEventFilter
) {
  try {
    const graph = await _getGraph(filePath);

    const processor = _getProcessor(graph, options);

    for await (const chunk of processor.sseStream(filter ?? {})) {
      yield chunk;
    }
  } catch (error) {
    throw new InternalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `appService.run: ${getErrorMessage(error)}`
    );
  }
}

export default {
  run,
};
