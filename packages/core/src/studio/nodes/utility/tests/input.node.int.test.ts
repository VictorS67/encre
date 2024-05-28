import { setMaxListeners } from 'node:events';
import { describe, expect, jest, test } from '@jest/globals';

import { OpenAIChat } from '../../../../events/inference/chat/llms/openai/chat.js';
import { HumanMessage } from '../../../../events/input/load/msgs/human.js';
import { SystemMessage } from '../../../../events/input/load/msgs/system.js';
import { ChatPrompt } from '../../../../events/input/load/prompts/chat.js';
import { SubGraph } from '../../../graph.js';
import { BaseInput } from '../../../input.js';
import {
  GraphInputs,
  GraphProcessor,
  ProcessEvent,
} from '../../../processor.js';
import { globalNodeRegistry } from '../../../registration/nodes.js';
import { coerceToData } from '../../../utils/coerce.js';
import { PromptNode } from '../../input/prompt.node.js';

describe('test InputNodeImpl', () => {
  test('test using InputNode to listen user inputs', async () => {
    const chatPromptNode = globalNodeRegistry.createDynamicRaw(
      new ChatPrompt([
        new SystemMessage(
          'The following conversation is about writing fairy tales. You are given some topics, and your task is to write the fairy tale that based on those topics.'
        ),
      ])
    );

    const inputNode = globalNodeRegistry.createDynamicRaw(
      new BaseInput({ dataTypes: { prompt: ['string', 'chat-message[]'] } })
    );

    const openAIChatNode = globalNodeRegistry.createDynamicRaw(
      new OpenAIChat()
    );

    const graph = new SubGraph({
      nodes: [chatPromptNode, inputNode, openAIChatNode],
      connections: [
        {
          fromNodeId: chatPromptNode.id,
          fromPortName: 'prompt',
          toNodeId: inputNode.id,
          toPortName: 'prompt',
        },
        {
          fromNodeId: inputNode.id,
          fromPortName: 'prompt',
          toNodeId: openAIChatNode.id,
          toPortName: 'prompt',
        },
      ],
    });

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

        // Mock user providing input after the processor is requiring
        if (event['#type'] === 'requireInput') {
          processor.userInput(inputNode.id, {
            // This is the mocked user input to the InputNode
            prompt: coerceToData([
              ...(chatPromptNode as PromptNode).data.toChatMessages(),
              new HumanMessage('witch, princess'),
            ]),
          });
        }

        pEventTypes.push({
          type: event['#type'],
          isSubProcessor: event['isSubProcessor'],
        });
      }
    }

    expect(pEvents).toMatchSnapshot();
  });
});
