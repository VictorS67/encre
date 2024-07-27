import {
  type ProcessOutputMap,
  type ProcessInputMap,
  type GraphOutputs,
  GraphProcessor,
} from '@encrejs/core/studio/processor';
import { getRecordId } from '@encrejs/core/utils/nanoid';
import { getNodeTitle } from './utils/node.js';

export type RecordId = ReturnType<typeof getRecordId>;

export type ProcessStreamEventFilter = {
  nodeStart?: (RecordId | string)[] | true;

  nodeFinish?: (RecordId | string)[] | true;

  done?: true;

  error?: true;
};

export type ProcessStreamEvents = {
  nodeStart: {
    nodeId: RecordId;
    nodeTitle: string;
    inputs: ProcessInputMap;
  };

  nodeFinish: {
    nodeId: RecordId;
    nodeTitle: string;
    outputs: ProcessOutputMap;
  };

  done: {
    graphOutput: GraphOutputs;
  };

  error: {
    error: string;
  };
};

export type ProcessStreamEvent = {
  [P in keyof ProcessStreamEvents]: { type: P } & ProcessStreamEvents[P];
}[keyof ProcessStreamEvents];

export async function* getProcessorEvents(
  processor: GraphProcessor,
  filter: ProcessStreamEventFilter
): AsyncGenerator<ProcessStreamEvent, void> {
  for await (const event of processor.events()) {
    if (event['#type'] === 'nodeStart') {
      if (
        filter.nodeStart === true ||
        filter.nodeStart?.includes(event.node.id) ||
        filter.nodeStart?.includes(getNodeTitle(event.node))
      ) {
        yield {
          type: 'nodeStart',
          nodeId: event.node.id,
          nodeTitle: getNodeTitle(event.node),
          inputs: event.inputs,
        };
      }
    } else if (event['#type'] === 'nodeFinish') {
      if (
        filter.nodeFinish === true ||
        filter.nodeFinish?.includes(event.node.id) ||
        filter.nodeFinish?.includes(getNodeTitle(event.node))
      ) {
        yield {
          type: 'nodeFinish',
          nodeId: event.node.id,
          nodeTitle: getNodeTitle(event.node),
          outputs: event.outputs,
        };
      }
    } else if (event['#type'] === 'done') {
      if (filter.done) {
        yield {
          type: 'done',
          graphOutput: event.results,
        };
      }
    } else if (event['#type'] === 'error') {
      if (filter.error) {
        yield {
          type: 'error',
          error:
            typeof event.error === 'string'
              ? event.error
              : event.error.toString(),
        };
      }
    }
  }
}

export function getProcessorSSEStream(
  processor: GraphProcessor,
  filter: ProcessStreamEventFilter
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  function sendEvent<T extends keyof ProcessStreamEvents>(
    controller: ReadableStreamDefaultController,
    type: T,
    data: ProcessStreamEvents[T]
  ) {
    const event = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
    controller.enqueue(encoder.encode(event));
  }

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of getProcessorEvents(processor, filter)) {
          sendEvent(controller, event.type, event);
        }
        controller.close();
      } catch (e) {
        controller.error(e);
      }
    },
  });
}

export function getNodeStream(
  processor: GraphProcessor,
  nodeIdOrTitle: RecordId | string
) {
  return new ReadableStream<RecordId | string>({
    async start(controller) {
      try {
        for await (const event of getProcessorEvents(processor, {
          nodeFinish: [nodeIdOrTitle],
        })) {
          // TODO: add for partial output from node processing result
          if (
            event.type === 'nodeFinish' &&
            (event.nodeId === nodeIdOrTitle ||
              event.nodeTitle === nodeIdOrTitle)
          ) {
            controller.close();
          }
        }

        controller.close();
      } catch (e) {
        controller.error(e);
      }
    },
  });
}
