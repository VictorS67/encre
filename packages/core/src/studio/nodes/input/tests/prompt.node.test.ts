import { describe, expect, test } from '@jest/globals';
import { BotMessage, ChatMessage, HumanMessage, SystemMessage } from '../../../../events/input/load/msgs/index.js';
import { ChatPrompt, StringPrompt } from '../../../../events/input/load/prompts/index.js';
import { ArrayOf, ChatMessageData, StringData } from '../../../data.js';
import { ChatPromptNodeImpl, StringPromptNodeImpl } from '../prompt.node.js';

describe('test PromptNodeImpl', () => {
  test('test user input to string prompt', async () => {
    const stringPromptNode = StringPromptNodeImpl.create();
    const nodeImpl = new StringPromptNodeImpl(stringPromptNode);
    
    const input1 = 'The following conversation is about writing fairy tales. You are given some topics, and your task is to write the fairy tale that based on those topics.';
    const input2 = [
      'There are some topics for the fairy tales:',
      ' - Good vs. Evil',
      ' - The Quest',
      ' - Love and Romance'
    ];
    const input3 = "Each of these topics can be explored in countless ways, offering a rich tapestry for storytelling. If you're thinking of writing or discussing fairy tales, any of these themes could provide a robust foundation.";
    const input4 = [
      'The Rule of Three',
      'In a kingdom where events always unfolded in threes, a young tailor set out on three quests to find the enchanted fabric, stitch three legendary garments, and win the heart of the monarch, thus changing his fate forever.',
    ];

    const outputs = await nodeImpl.process({
      input1: { type: 'string', value: input1 },
      input2: { type: 'string[]', value: input2 },
      input3: { 
        type: 'chat-message', 
        value: new ChatMessage({ role: 'Note', content: input3 }),
      },
      input4: {
        type: 'chat-message[]', 
        value: [
          new HumanMessage(input4[0]),
          new BotMessage(input4[1]),
        ]
      }
    }, {});

    const expectedPrompt = [
      input1, 
      ...input2, 
      `Note: ${input3}`, 
      `Human: ${input4[0]}`,
      `AI: ${input4[1]}`,
    ].join('\n');

    expect((outputs.prompt as StringData).value).toBe(expectedPrompt);
  });

  test('test using string prompt stored data', async () => {    
    const input1 = 'The following conversation is about writing fairy tales. You are given some topics, and your task is to write the fairy tale that based on those topics.';
    const input2 = [
      'There are some topics for the fairy tales:',
      ' - Good vs. Evil',
      ' - The Quest',
      ' - Love and Romance'
    ];
    const input3 = "Each of these topics can be explored in countless ways, offering a rich tapestry for storytelling. If you're thinking of writing or discussing fairy tales, any of these themes could provide a robust foundation.";
    const input4 = [
      'The Rule of Three',
      'In a kingdom where events always unfolded in threes, a young tailor set out on three quests to find the enchanted fabric, stitch three legendary garments, and win the heart of the monarch, thus changing his fate forever.',
    ];

    const expectedPrompt = [
      input1, 
      ...input2, 
      `Note: ${input3}`, 
      `Human: ${input4[0]}`,
      `AI: ${input4[1]}`,
    ].join('\n');

    const stringPromptNode = StringPromptNodeImpl.nodeFrom(new StringPrompt(expectedPrompt));
    const nodeImpl = new StringPromptNodeImpl(stringPromptNode);

    const outputs = await nodeImpl.process(undefined, {});
    expect((outputs.prompt as StringData).value).toBe(expectedPrompt);
  });

  test('test user input to chat prompt', async () => {
    const chatPromptNode = ChatPromptNodeImpl.create();
    const nodeImpl = new ChatPromptNodeImpl(chatPromptNode);
    
    const input1 = `The following conversation is about writing fairy tales. You are given some topics, and your task is to write the fairy tale that based on those topics.
There are some topics for the fairy tales:
 - Good vs. Evil
 - The Quest
 - Love and Romance`;
    const input2 = "Each of these topics can be explored in countless ways, offering a rich tapestry for storytelling. If you're thinking of writing or discussing fairy tales, any of these themes could provide a robust foundation.";
    const input3 = [
      'The Rule of Three',
      'In a kingdom where events always unfolded in threes, a young tailor set out on three quests to find the enchanted fabric, stitch three legendary garments, and win the heart of the monarch, thus changing his fate forever.',
    ];
    const userInput = 'Riches and Poverty';

    const outputs = await nodeImpl.process({
      input1: { type: 'chat-message', value: new SystemMessage(input1) },
      input2: { 
        type: 'chat-message', 
        value: new ChatMessage({ role: 'Note', content: input2 }),
      },
      input3: {
        type: 'chat-message[]', 
        value: [
          new HumanMessage(input3[0]),
          new BotMessage(input3[1]),
        ]
      },
      userInput: {
        type: 'string',
        value: userInput,
      }
    }, {});

    const expectedMessages = [
      new SystemMessage(input1), 
      new ChatMessage({ role: 'Note', content: input2 }), 
      new HumanMessage(input3[0]), 
      new BotMessage(input3[1]),
      new HumanMessage(userInput),
    ];

    expect(
      JSON.parse(JSON.stringify((outputs.prompt as ArrayOf<ChatMessageData>).value))
    ).toStrictEqual(JSON.parse(JSON.stringify(expectedMessages)));
  });

  test('test using chat prompt stored data', async () => {
    const input1 = `The following conversation is about writing fairy tales. You are given some topics, and your task is to write the fairy tale that based on those topics.
There are some topics for the fairy tales:
 - Good vs. Evil
 - The Quest
 - Love and Romance`;
    const input2 = "Each of these topics can be explored in countless ways, offering a rich tapestry for storytelling. If you're thinking of writing or discussing fairy tales, any of these themes could provide a robust foundation.";
    const input3 = [
      'The Rule of Three',
      'In a kingdom where events always unfolded in threes, a young tailor set out on three quests to find the enchanted fabric, stitch three legendary garments, and win the heart of the monarch, thus changing his fate forever.',
    ];
    const userInput = 'Riches and Poverty';
    
    const expectedMessages = [
      new SystemMessage(input1), 
      new ChatMessage({ role: 'Note', content: input2 }), 
      new HumanMessage(input3[0]), 
      new BotMessage(input3[1]),
      new HumanMessage(userInput),
    ];

    const chatPromptNode = ChatPromptNodeImpl.nodeFrom(new ChatPrompt(expectedMessages));
    const nodeImpl = new ChatPromptNodeImpl(chatPromptNode);

    const outputs = await nodeImpl.process(undefined, {});
    expect(
      JSON.parse(JSON.stringify((outputs.prompt as ArrayOf<ChatMessageData>).value))
    ).toStrictEqual(JSON.parse(JSON.stringify(expectedMessages)));
  });
});