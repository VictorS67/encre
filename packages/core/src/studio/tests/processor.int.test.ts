import { setMaxListeners } from 'node:events';
import { describe, expect, test } from '@jest/globals';
import { OpenAIChat } from '../../events/inference/chat/llms/openai/chat.js';
import { StringPrompt } from '../../events/input/load/prompts/text.js';
import { RecordId } from '../../load/keymap.js';
import { getRecordId } from '../../utils/nanoid.js';
import { SubGraph } from '../graph.js';
import {
  GraphInputs,
  GraphProcessor,
  ProcessEvent,
  ProcessInputMap,
} from '../processor.js';
import { globalNodeRegistry } from '../registration/nodes.js';

class MockSingleWorkerGraph extends SubGraph {
  schedule(): Array<[string, RecordId[]]> {
    return [[getRecordId(), this.flattenNodes.map((n) => n.id)]];
  }
}

class MockTwoWorkersGraph extends SubGraph {
  schedule(): Array<[string, RecordId[]]> {
    const nodeIds = this.flattenNodes.map((n) => n.id);

    return [
      [getRecordId(), nodeIds.slice(0, Math.ceil(nodeIds.length / 2))],
      [getRecordId(), nodeIds.slice(Math.ceil(nodeIds.length / 2))],
    ];
  }
}

describe('GraphProcessor', () => {
  test('test simple node in graph', async () => {
    // const openAINode = globalNodeRegistry.createDynamic("chatlm", "openai");

    const openAINode = globalNodeRegistry.createDynamicRaw(
      new OpenAIChat({ modelName: 'gpt-3.5-turbo' })
    );

    const graph = new MockSingleWorkerGraph({
      nodes: [openAINode],
      connections: [],
    });

    const processor = new GraphProcessor(graph);

    const processInput: ProcessInputMap = {
      prompt: {
        type: 'string',
        value: 'Who are you?',
      },
    };

    const graphInputs: GraphInputs = Object.fromEntries([
      [openAINode.id, processInput],
    ]);

    processor.on(
      'newAbortController',
      (fields: { controller: AbortController }) => {
        setMaxListeners(100, fields.controller.signal);
      }
    );

    processor.processGraph(graphInputs);

    const pEvents: ProcessEvent[] = [];
    const pEventTypes: {
      type: ProcessEvent['#type'];
      isSubProcessor: ProcessEvent['isSubProcessor'];
    }[] = [];

    const pEventToIgnore: Array<ProcessEvent['#type']> = [
      'trace',
      'error',
      'newAbortController',
      'graphError',
      'nodeError',
    ];

    for await (const event of processor.events()) {
      if (!pEventToIgnore.includes(event['#type'])) {
        pEvents.push(event);

        pEventTypes.push({
          type: event['#type'],
          isSubProcessor: event['isSubProcessor'],
        });
      }
    }

    expect(pEvents).toMatchSnapshot();

    expect(pEventTypes).toStrictEqual([
      // [MASTER] openAINode processing
      {
        type: 'processInQueue',
        isSubProcessor: false,
      },
      // [MASTER] openAINode processing
      {
        type: 'nodeStart',
        isSubProcessor: false,
      },
      {
        type: 'nodeFinish',
        isSubProcessor: false,
      },
      // [MASTER] processing end
      {
        type: 'graphFinish',
        isSubProcessor: false,
      },
      {
        type: 'done',
        isSubProcessor: false,
      },
      {
        type: 'finish',
        isSubProcessor: false,
      },
    ]);
  });

  test('test simple chain with one worker in graph', async () => {
    // const stringPromptNode = globalNodeRegistry.createDynamic(
    //   "prompt",
    //   "string"
    // );

    // stringPromptNode.data = new StringPrompt("Who are you?");

    // const openAINode = globalNodeRegistry.createDynamic("chatlm", "openai");

    const stringPromptNode = globalNodeRegistry.createDynamicRaw(
      new StringPrompt('Who are you?')
    );

    const openAINode = globalNodeRegistry.createDynamicRaw(
      new OpenAIChat({ modelName: 'gpt-3.5-turbo' })
    );

    const graph = new MockSingleWorkerGraph({
      nodes: [stringPromptNode, openAINode],
      connections: [
        {
          fromNodeId: stringPromptNode.id,
          fromPortName: 'prompt',
          toNodeId: openAINode.id,
          toPortName: 'prompt',
        },
      ],
    });

    expect(graph.graphStartNodeIds).toStrictEqual([stringPromptNode.id]);
    expect(graph.graphEndNodeIds).toStrictEqual([openAINode.id]);

    const processor = new GraphProcessor(graph);

    const graphInputs: GraphInputs = {};

    processor.on(
      'newAbortController',
      (fields: { controller: AbortController }) => {
        setMaxListeners(100, fields.controller.signal);
      }
    );

    processor.processGraph(graphInputs);

    const pEvents: ProcessEvent[] = [];
    const pEventTypes: {
      type: ProcessEvent['#type'];
      isSubProcessor: ProcessEvent['isSubProcessor'];
    }[] = [];

    const pEventToIgnore: Array<ProcessEvent['#type']> = [
      'trace',
      'error',
      'newAbortController',
      'graphError',
      'nodeError',
    ];

    for await (const event of processor.events()) {
      if (!pEventToIgnore.includes(event['#type'])) {
        pEvents.push(event);

        pEventTypes.push({
          type: event['#type'],
          isSubProcessor: event['isSubProcessor'],
        });
      }
    }

    expect(pEvents).toMatchSnapshot();

    expect(pEventTypes).toStrictEqual([
      // [MASTER] stringPromptNode processing
      {
        type: 'processInQueue',
        isSubProcessor: false,
      },
      // [MASTER] stringPromptNode processing
      {
        type: 'nodeStart',
        isSubProcessor: false,
      },
      {
        type: 'nodeFinish',
        isSubProcessor: false,
      },
      // [MASTER] openAINode processing, emit subprocessor processing
      {
        type: 'processInQueue',
        isSubProcessor: false,
      },
      // [MASTER] processor check if stringPromptNode already processed or not
      {
        type: 'processInQueue',
        isSubProcessor: false,
      },
      // [MASTER] openAINode processing
      {
        type: 'nodeStart',
        isSubProcessor: false,
      },
      {
        type: 'nodeFinish',
        isSubProcessor: false,
      },
      // [MASTER] processing end
      {
        type: 'graphFinish',
        isSubProcessor: false,
      },
      {
        type: 'done',
        isSubProcessor: false,
      },
      {
        type: 'finish',
        isSubProcessor: false,
      },
    ]);
  });

  test('test simple chain with two worker in graph', async () => {
    // const stringPromptNode = globalNodeRegistry.createDynamic(
    //   "prompt",
    //   "string"
    // );

    // stringPromptNode.data = new StringPrompt("Who are you?");

    // const openAINode = globalNodeRegistry.createDynamic("chatlm", "openai");

    const stringPromptNode = globalNodeRegistry.createDynamicRaw(
      new StringPrompt('Who are you?')
    );

    const openAINode = globalNodeRegistry.createDynamicRaw(
      new OpenAIChat({ modelName: 'gpt-3.5-turbo' })
    );

    const graph = new MockTwoWorkersGraph({
      nodes: [stringPromptNode, openAINode],
      connections: [
        {
          fromNodeId: stringPromptNode.id,
          fromPortName: 'prompt',
          toNodeId: openAINode.id,
          toPortName: 'prompt',
        },
      ],
    });

    expect(graph.graphStartNodeIds).toStrictEqual([stringPromptNode.id]);
    expect(graph.graphEndNodeIds).toStrictEqual([openAINode.id]);

    const processor = new GraphProcessor(graph);

    const graphInputs: GraphInputs = {};

    processor.on(
      'newAbortController',
      (fields: { controller: AbortController }) => {
        setMaxListeners(100, fields.controller.signal);
      }
    );

    processor.processGraph(graphInputs);

    const pEvents: ProcessEvent[] = [];
    const pEventTypes: {
      type: ProcessEvent['#type'];
      isSubProcessor: ProcessEvent['isSubProcessor'];
    }[] = [];

    const pEventToIgnore: Array<ProcessEvent['#type']> = [
      'trace',
      'error',
      'newAbortController',
      'graphError',
      'nodeError',
    ];

    for await (const event of processor.events()) {
      if (!pEventToIgnore.includes(event['#type'])) {
        pEvents.push(event);

        pEventTypes.push({
          type: event['#type'],
          isSubProcessor: event['isSubProcessor'],
        });
      }
    }

    expect(pEvents).toMatchSnapshot();

    // We didn't map the processInQueue event from subprocessor to master,
    // therefore, we can only observe processInQueue event on master
    expect(pEventTypes).toStrictEqual([
      // [MASTER] stringPromptNode processing
      {
        type: 'processInQueue',
        isSubProcessor: false,
      },
      // [MASTER] stringPromptNode processing
      {
        type: 'nodeStart',
        isSubProcessor: false,
      },
      {
        type: 'nodeFinish',
        isSubProcessor: false,
      },
      // [MASTER] openAINode processing, emit subprocessor processing
      {
        type: 'processInQueue',
        isSubProcessor: false,
      },
      // [MASTER] subprocessor check if stringPromptNode already processed or not
      {
        type: 'processInQueue',
        isSubProcessor: false,
      },
      // [SUB] openAINode processing
      {
        type: 'nodeStart',
        isSubProcessor: true,
      },
      {
        type: 'nodeFinish',
        isSubProcessor: true,
      },
      // [MASTER] processing end
      {
        type: 'graphFinish',
        isSubProcessor: false,
      },
      {
        type: 'done',
        isSubProcessor: false,
      },
      {
        type: 'finish',
        isSubProcessor: false,
      },
    ]);
  });
});
