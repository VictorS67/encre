import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';

import { encreCache } from '../cache';
import {
  Context,
  EncreAppConfig,
  EncreAppHander,
  EncreAppInputHandler,
  EncreAppOutputHandler,
  EncreData,
  Message,
  ProcessStreamEventFilter,
} from '../types';
import { coerceEncreData } from '../utils';

const runGraphFetch = async (
  req: {
    url?: string;
    userInputs?: Record<string, Record<string, EncreData>>;
    appPath?: string;
    context?: Record<string, EncreData>;
    filter?: ProcessStreamEventFilter;
  },
  nodeCallbacks: {
    [key in string]: {
      onNodeStart?: (
        nodeId: string,
        nodeTitle: string,
        inputs: Record<string, EncreData>,
      ) => unknown;
      onNodeFinish?: (
        nodeId: string,
        nodeTitle: string,
        outputs: Record<string, EncreData>,
      ) => unknown;
    };
  },
  graphCallbacks: {
    onDone?: (
      graphOutput: Record<string, Record<string, EncreData>>,
    ) => unknown;
    onError?: (error: string) => unknown;
  },
) => {
  const url: string =
    req.url ?? process.env.ENCRE_STUDIO_URL ?? 'http://localhost:5127';
  const apiUrl = `${url}/api/v1/app/run`;

  const res = await fetch(apiUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      userInputs: req.userInputs ?? {},
      appPath: req.appPath,
      context: req.context,
      filter: req.filter,
    }),
  });

  if (res.status !== 200) {
    const statusText = res.statusText;
    throw new Error(
      `The Encre Studio API has encountered an error with a status code of ${res.status} and message ${statusText}`,
    );
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data;

          if (data === '[DONE]') {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);

            // console.log(`runGraphFetch: json: ${JSON.stringify(json)}`);
            // console.log(
            //   `nodeCallbacks: ${JSON.stringify(
            //     Object.keys(nodeCallbacks["ZSJ3g8tL6qsJU6R6c"])
            //   )}`
            // );

            if (json['#event'] === 'nodeStart') {
              const nodeId = json['nodeId'];

              // console.log(`nodeStart: nodeId: ${nodeId}`);

              const onNodeStart = nodeCallbacks[nodeId]?.onNodeStart;
              const text = onNodeStart?.(
                json['nodeId'],
                json['nodeTitle'],
                json['inputs'],
              );

              const metadata = {
                event: 'nodeStart',
                nodeId: json['nodeId'],
                nodeTitle: json['nodeTitle'],
              };

              const encodedText = `metadata: ${JSON.stringify(
                metadata,
              )}\ntext: ${JSON.stringify(text)}\n\n`;

              // console.log(`encodedText: ${encodedText}`);

              const queue = encoder.encode(encodedText);
              controller.enqueue(queue);
            } else if (json['#event'] === 'nodeFinish') {
              const nodeId = json['nodeId'];

              // console.log(`nodeFinish: nodeId: ${nodeId}`);

              const onNodeFinish = nodeCallbacks[nodeId]?.onNodeFinish;
              const text = onNodeFinish?.(
                json['nodeId'],
                json['nodeTitle'],
                json['outputs'],
              );

              const metadata = {
                event: 'nodeFinish',
                nodeId: json['nodeId'],
                nodeTitle: json['nodeTitle'],
              };

              const encodedText = `metadata: ${JSON.stringify(
                metadata,
              )}\ntext: ${JSON.stringify(text)}\n\n`;

              // console.log(`encodedText: ${encodedText}`);

              const queue = encoder.encode(encodedText);
              controller.enqueue(queue);
            } else if (json['#event'] === 'done') {
              const onDone = graphCallbacks.onDone;
              const text = onDone?.(json['graphOutput']);

              const metadata = {
                event: 'done',
              };

              const encodedText = `metadata: ${JSON.stringify(
                metadata,
              )}\ntext: ${JSON.stringify(text)}\n\n`;

              // console.log(`encodedText: ${encodedText}`);

              const queue = encoder.encode(encodedText);
              controller.enqueue(queue);
            } else if (json['#event'] === 'error') {
              const onError = graphCallbacks.onError;

              const text = onError?.(json['error']);

              const metadata = {
                event: 'error',
              };

              const encodedText = `metadata: ${JSON.stringify(
                metadata,
              )}\ntext: ${JSON.stringify(text)}\n\n`;

              // console.log(`encodedText: ${encodedText}`);

              const queue = encoder.encode(encodedText);
              controller.enqueue(queue);
            }
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        const str = decoder.decode(chunk);
        parser.feed(str);
      }
    },
  });
};

export const useAppHandler = () => {
  const cache = encreCache();

  const config = process.env.__ENCRE_APP_CONFIG as unknown as EncreAppConfig;
  const appUrl = process.env.ENCRE_STUDIO_URL ?? 'http://localhost:5127';
  const appPath = config.workflow ?? undefined;
  const handlerMap = config.handlers;

  const runGraph = async (req: { handler: string; value?: unknown }[]) => {
    const userInputs: Record<string, Record<string, EncreData>> = {};
    const nodeCallbacks: {
      [key in string]: {
        onNodeStart?: (
          nodeId: string,
          nodeTitle: string,
          inputs: Record<string, EncreData>,
        ) => unknown;
        onNodeFinish?: (
          nodeId: string,
          nodeTitle: string,
          outputs: Record<string, EncreData>,
        ) => unknown;
      };
    } = {};

    let graphCallbacks: {
      onDone?: (
        graphOutput: Record<string, Record<string, EncreData>>,
      ) => unknown;
      onError?: (error: string) => unknown;
    } = {};

    // console.log(`runGraph: req: ${JSON.stringify(req)}`);

    req.forEach(({ handler: h, value }) => {
      if (handlerMap[h]?.event === 'userInput') {
        const handler = handlerMap[h] as EncreAppInputHandler;

        userInputs[handler.nodeId] = {
          [handler.portName]: {
            type: handler.dataType,
            value,
          },
        };
      } else if (handlerMap[h]?.event === 'nodeOutput') {
        const handler = handlerMap[h] as EncreAppOutputHandler;

        nodeCallbacks[handler.nodeId] = {
          ...nodeCallbacks[handler.nodeId],
          onNodeFinish: (
            nodeId: string,
            nodeTitle: string,
            outputs: Record<string, EncreData>,
          ) => {
            // console.log(`### onNodeFinish: ${JSON.stringify(outputs)}`);

            return outputs[handler.portName]?.value;
          },
        };
      } else if (handlerMap[h]?.event === 'graphOutput') {
        const handler = handlerMap[h] as EncreAppOutputHandler;

        graphCallbacks = {
          ...graphCallbacks,
          onDone: (graphOutput: Record<string, Record<string, EncreData>>) => {
            // console.log(`onDone: ${JSON.stringify(graphOutput)}`);

            return graphOutput[handler.nodeId]?.[handler.portName]?.value;
          },
        };
      }
    });

    return runGraphFetch(
      { url: appUrl, userInputs, appPath },
      nodeCallbacks,
      graphCallbacks,
    );
  };

  const onAction = async (handler: string) => {
    const handlerData: EncreAppHander | undefined = handlerMap[handler];

    if (!handlerData || handlerData.handlerType !== 'action') {
      return;
    }

    const event: string = handlerData.event;
    const graphId: string = handlerData.graphId;
    const inputNodeIds: string[] = handlerData.graphInputs;
    const outputNodeIds: string[] = handlerData.graphOutputs;

    // console.log(`event: ${event}`);

    if (event === 'runGraph') {
      let request: { handler: string; value?: unknown }[] = [];

      for (let i = 0; i < inputNodeIds.length; i++) {
        const inputNodeId = inputNodeIds[i];

        if (cache.has(graphId, inputNodeId)) {
          const [inputHandler, storedData] = cache.get(graphId, inputNodeId)!;

          const inputHandlerData: EncreAppHander | undefined =
            handlerMap[inputHandler];
          if (!inputHandlerData || inputHandlerData.handlerType !== 'input') {
            continue;
          }

          const selectedValue = storedData[inputHandlerData.portName]?.value;
          if (selectedValue) {
            request.push({ handler: inputHandler, value: selectedValue });
          }
        }
      }

      const outputRequest: { handler: string; value?: unknown }[] =
        Object.entries(handlerMap)
          .filter(
            ([_, possibleHandlerData]) =>
              possibleHandlerData.handlerType === 'output' &&
              outputNodeIds.includes(possibleHandlerData.nodeId),
          )
          .map(([outputHandler, _]) => ({
            handler: outputHandler,
          }));

      request = [...request, ...outputRequest];

      // console.log(`request: ${JSON.stringify(request)}`);

      return runGraph(request);
    }
  };

  const onInput = async (handler: string, value: unknown) => {
    const handlerData: EncreAppHander | undefined = handlerMap[handler];

    // console.log(`onInputHandler: ${JSON.stringify(handlerData)}`);

    if (!handlerData || handlerData.handlerType !== 'input') {
      return;
    }

    const event: string = handlerData.event;
    const graphId: string = handlerData.graphId;
    const nodeId: string = handlerData.nodeId;
    const portName: string = handlerData.portName;
    const dataType = handlerData.dataType;
    if (event === 'userInput') {
      if (cache.has(graphId, nodeId)) {
        const [inputHandler, storedData] = cache.get(graphId, nodeId)!;

        if (inputHandler !== handler) {
          return;
        }

        cache.set(graphId, nodeId, [
          handler,
          { ...storedData, [portName]: { type: dataType, value } },
        ]);
      } else {
        cache.set(graphId, nodeId, [
          handler,
          { [portName]: { type: dataType, value } },
        ]);
      }

      // console.log(`cache: ${JSON.stringify(cache.get(graphId, nodeId))}`);
    }
  };

  const onOutput = async (
    handler: string,
    stream: ReadableStream,
    callbacks: {
      onRead?: (
        value: string | number | boolean | Context | Message | null | undefined,
      ) => void;
      onDone?: () => void;
      onError?: (error: Error) => void;
    },
  ) => {
    const handlerData: EncreAppHander | undefined = handlerMap[handler];

    // console.log(`onOutputHandler: ${JSON.stringify(handlerData)}`);

    if (!handlerData || handlerData.handlerType !== 'output') {
      return;
    }

    const event = handlerData.event;
    const nodeId: string = handlerData.nodeId;
    const dataType = handlerData.dataType;

    // console.log(`event: ${event}, nodeId: ${nodeId}`);

    try {
      const reader = stream.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();

        if (value) {
          const decodeValue = decoder.decode(value);

          // console.log(`decodedValue: ${decodeValue}`);

          const groups =
            /metadata: (?<metadata>.*)\ntext: (?<text>.*)\n\n/.exec(
              decodeValue,
            )!.groups!;

          const metadata = JSON.parse(groups.metadata!);
          const data = coerceEncreData(groups.text!, dataType);

          if (event === 'graphOutput' && metadata.event === 'done') {
            callbacks.onRead?.(data);
          } else if (
            event === 'nodeOutput' &&
            metadata.event === 'nodeFinish' &&
            metadata.nodeId === nodeId
          ) {
            callbacks.onRead?.(data);
          }
        }
        done = readerDone;
      }

      callbacks.onDone?.();
    } catch (e) {
      callbacks.onError?.(e as Error);
    }
  };

  return { onInput, onAction, onOutput };
};
