import * as events from 'node:events';
import { type Data, dataTypes, scalarTypes } from '@encrejs/core/studio/data';
import { SubGraph } from '@encrejs/core/studio/graph';
import {
  type ProcessEvents,
  GraphProcessor,
  type GraphInputs,
  type GraphOutputs,
} from '@encrejs/core/studio/processor';
import type { NodeRegistry } from '@encrejs/core/studio/registration';
import { globalGuardrailRegistry } from '@encrejs/core/studio/registration/guardrails';
import { globalNodeRegistry } from '@encrejs/core/studio/registration/nodes';
import {
  audioTypes,
  extMap,
  fileTypes,
  imageTypes,
  UIDataTypesMap,
} from '@encrejs/core/studio/ui';
import { loadGraph } from '@encrejs/core/studio/utils/load';
import type { PascalCase } from 'type-fest';

import {
  getNodeStream,
  getProcessorEvents,
  getProcessorSSEStream,
  ProcessStreamEventFilter,
} from './streaming.js';

export type ProcessOptions = {
  inputs?: GraphInputs;
  context?: Record<string, Data>;
  registry?: NodeRegistry;
  abortSingal?: AbortSignal;
} & {
  [P in keyof ProcessEvents as `on${PascalCase<P>}`]?: (
    fields: ProcessEvents[P]
  ) => void;
};

export function createProcessor(graph: SubGraph, options?: ProcessOptions) {
  const { inputs = {}, context = {} } = options ?? {};

  if (options?.registry?.nodes) {
    graph.loadRegistry(options.registry.nodes);
  }

  const processor = new GraphProcessor(graph);

  if (options?.onStart) {
    processor.on('start', options.onStart);
  }

  if (options?.onNodeStart) {
    processor.on('nodeStart', options.onNodeStart);
  }

  if (options?.onNodeFinish) {
    processor.on('nodeFinish', options.onNodeFinish);
  }

  if (options?.onNodeError) {
    processor.on('nodeError', options.onNodeError);
  }

  if (options?.onNodeExcluded) {
    processor.on('nodeExcluded', options.onNodeExcluded);
  }

  if (options?.onRequireInput) {
    processor.on('requireInput', options.onRequireInput);
  }

  if (options?.onDone) {
    processor.on('done', options.onDone);
  }

  if (options?.onAbort) {
    processor.on('abort', options.onAbort);
  }

  if (options?.onGraphAbort) {
    processor.on('graphAbort', options.onGraphAbort);
  }

  options?.abortSingal?.addEventListener('abort', () => {
    processor.abort();
  });

  processor.on('newAbortController', ({ controller }) => {
    events.setMaxListeners(100, controller.signal);
  });

  return {
    processor,
    inputs,
    context,
    events: (filter: ProcessStreamEventFilter) =>
      getProcessorEvents(processor, filter),
    sseStream: (filter: ProcessStreamEventFilter) =>
      getProcessorSSEStream(processor, filter),
    nodeStream: (nodeIdOrTitle: string) =>
      getNodeStream(processor, nodeIdOrTitle),
    async run(): Promise<GraphOutputs> {
      const outputs = await processor.processGraph(inputs, {}, context);
      return outputs;
    },
  };
}

export async function runGraph(graph: SubGraph, options?: ProcessOptions) {
  const processor = createProcessor(graph, options);
  return processor.run();
}

export async function runGraphInFile(path: string, options?: ProcessOptions) {
  const graph = await loadGraph(path, undefined, options?.registry);
  return runGraph(graph, options);
}

export function getNodeRegistry() {
  return globalNodeRegistry;
}

export function getGuardrailRegistry() {
  return globalGuardrailRegistry;
}

export function getDataTypes() {
  return dataTypes;
}

export function getScalarTypes() {
  return scalarTypes;
}

export function getImageTypes() {
  return imageTypes;
}

export function getAudioTypes() {
  return audioTypes;
}

export function getFileTypes() {
  return fileTypes;
}

export function getUIDataTypesMap() {
  return UIDataTypesMap;
}

export function getExtMap() {
  return extMap;
}
