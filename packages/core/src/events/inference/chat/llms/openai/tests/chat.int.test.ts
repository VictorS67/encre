import fs from 'fs';
import path from 'path';
import url from 'url';
import { describe, expect, test } from '@jest/globals';

import { FunctionMessage } from '../../../../../input/load/msgs/function.js';
import { HumanMessage } from '../../../../../input/load/msgs/human.js';
import { SystemMessage } from '../../../../../input/load/msgs/system.js';
import { ChatGenerationChunk } from '../../../../../output/provide/message.js';
import { OpenAIChat } from '../chat.js';
import {
  OpenAIChatCallOptions,
  OpenAIChatTool,
  OpenAIChatToolCall,
} from '../index.js';

describe('OpenAIChat', () => {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  test('test OpenAIChat text', async () => {
    const openaiChat = new OpenAIChat({
      openAIApiKey: OPENAI_API_KEY,
      modelName: 'gpt-4o-mini',
    });

    const messages = [new HumanMessage('Hello! Who are you?')];

    const promptTokenNumber: number = await OpenAIChat.getNumTokensInChat(
      openaiChat.modelName,
      messages
    );
    const llmResult = await openaiChat.invoke(messages);
    const completionTokenNumber: number =
      await OpenAIChat.getNumTokensInGenerations(
        openaiChat.modelName,
        llmResult.generations as ChatGenerationChunk[]
      );

    expect(llmResult).toMatchSnapshot();

    expect({
      completionTokens: completionTokenNumber,
      promptTokens: promptTokenNumber,
      totalTokens: promptTokenNumber + completionTokenNumber,
    }).toMatchSnapshot();
  });

  test('test OpenAIChat vision', async () => {
    const openaiChat = new OpenAIChat({
      openAIApiKey: OPENAI_API_KEY,
      modelName: 'gpt-4-vision-preview',
    });

    const filePath: string = path.resolve(
      path.dirname(url.fileURLToPath(import.meta.url)),
      './examples/timetable.png'
    );

    const landmarkImage1 = Buffer.from(
      fs.readFileSync(filePath).buffer
    ).toString('base64');

    const messages = [
      new HumanMessage({
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${landmarkImage1}`,
              detail: 'high',
            },
          },
          'what is shown in this image?',
        ],
      }),
    ];

    const promptTokenNumber: number = await OpenAIChat.getNumTokensInChat(
      openaiChat.modelName,
      messages
    );
    const llmResult = await openaiChat.invoke(messages);
    const completionTokenNumber: number =
      await OpenAIChat.getNumTokensInGenerations(
        openaiChat.modelName,
        llmResult.generations as ChatGenerationChunk[]
      );

    expect(llmResult).toMatchSnapshot();
    expect({
      completionTokens: completionTokenNumber,
      promptTokens: promptTokenNumber,
      totalTokens: promptTokenNumber + completionTokenNumber,
    }).toMatchSnapshot();
  });

  test('test OpenAIChat using single tool', async () => {
    const openaiChat = new OpenAIChat({
      openAIApiKey: OPENAI_API_KEY,
      modelName: 'gpt-4-turbo-preview',
    });

    const tools: OpenAIChatTool[] = [
      {
        type: 'function',
        function: {
          name: 'get_current_weather',
          description: 'Get the current weather',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: 'The city and state, e.g. San Francisco, CA',
              },
              format: {
                type: 'string',
                enum: ['celsius', 'fahrenheit'],
                description:
                  'The temperature unit to use. Infer this from the users location.',
              },
            },
            required: ['location', 'format'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'get_n_day_weather_forecast',
          description: 'Get an N-day weather forecast',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: 'The city and state, e.g. San Francisco, CA',
              },
              format: {
                type: 'string',
                enum: ['celsius', 'fahrenheit'],
                description:
                  'The temperature unit to use. Infer this from the users location.',
              },
              num_days: {
                type: 'integer',
                description: 'The number of days to forecast',
              },
            },
            required: ['location', 'format', 'num_days'],
          },
        },
      },
    ];

    const messages = [
      new SystemMessage({
        content:
          "Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous.",
      }),
      new HumanMessage({
        content: "I'm in San Francisco, CA. What's the weather like today?",
      }),
    ];

    const options: OpenAIChatCallOptions = { tools };

    const llmResult = await openaiChat.invoke(messages, options);

    const promptTokenNumber: number = await OpenAIChat.getNumTokensInChat(
      openaiChat.modelName,
      messages,
      tools
    );
    const completionTokenNumber: number =
      await OpenAIChat.getNumTokensInGenerations(
        openaiChat.modelName,
        llmResult.generations as ChatGenerationChunk[]
      );

    expect(llmResult).toMatchSnapshot();
    expect({
      completionTokens: completionTokenNumber,
      promptTokens: promptTokenNumber,
      totalTokens: promptTokenNumber + completionTokenNumber,
    }).toMatchSnapshot();
  });

  test('test OpenAIChat using multiple tools', async () => {
    const openaiChat = new OpenAIChat({
      openAIApiKey: OPENAI_API_KEY,
      modelName: 'gpt-4-turbo-preview',
    });

    const tools: OpenAIChatTool[] = [
      {
        type: 'function',
        function: {
          name: 'get_current_weather',
          description: 'Get the current weather',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: 'The city and state, e.g. San Francisco, CA',
              },
              format: {
                type: 'string',
                enum: ['celsius', 'fahrenheit'],
                description:
                  'The temperature unit to use. Infer this from the users location.',
              },
            },
            required: ['location', 'format'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'get_n_day_weather_forecast',
          description: 'Get an N-day weather forecast',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: 'The city and state, e.g. San Francisco, CA',
              },
              format: {
                type: 'string',
                enum: ['celsius', 'fahrenheit'],
                description:
                  'The temperature unit to use. Infer this from the users location.',
              },
              num_days: {
                type: 'integer',
                description: 'The number of days to forecast',
              },
            },
            required: ['location', 'format', 'num_days'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'get_n_day_weather_history',
          description: 'Get an N-day weather in the history',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: 'The city and state, e.g. San Francisco, CA',
              },
              format: {
                type: 'string',
                enum: ['celsius', 'fahrenheit'],
                description:
                  'The temperature unit to use. Infer this from the users location.',
              },
              num_days: {
                type: 'integer',
                description: 'The number of days before the current day',
              },
            },
            required: ['location', 'format', 'num_days'],
          },
        },
      },
    ];

    const messages = [
      new SystemMessage({
        content:
          "Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous.",
      }),
      new HumanMessage({
        content:
          'What is the weather going to be like in Glasgow, Scotland over the next 5 days? And what is the weather in Glasgow, Scotland currently?',
      }),
    ];

    const options: OpenAIChatCallOptions = { tools };

    const llmResult = await openaiChat.invoke(messages, options);

    const promptTokenNumber: number = await OpenAIChat.getNumTokensInChat(
      openaiChat.modelName,
      messages,
      tools
    );
    const completionTokenNumber: number =
      await OpenAIChat.getNumTokensInGenerations(
        openaiChat.modelName,
        llmResult.generations as ChatGenerationChunk[]
      );

    expect(llmResult).toMatchSnapshot();
    expect({
      completionTokens: completionTokenNumber,
      promptTokens: promptTokenNumber,
      totalTokens: promptTokenNumber + completionTokenNumber,
    }).toMatchSnapshot();
  });

  test('test OpenAIChat triggering local functions', async () => {
    const openaiChat = new OpenAIChat({
      openAIApiKey: OPENAI_API_KEY,
      modelName: 'gpt-4-turbo-preview',
    });

    const get_current_weather = (
      location: string,
      format: 'celsius' | 'fahrenheit'
    ) => {
      if (location.toLowerCase().includes('tokyo')) {
        return { location, temperature: '10', format };
      }

      if (location.toLowerCase().includes('san francisco')) {
        return { location, temperature: '72', format };
      }

      if (location.toLowerCase().includes('paris')) {
        return { location, temperature: '22', format };
      }

      return { location, temperature: 'unknown', format };
    };

    const tools: OpenAIChatTool[] = [
      {
        type: 'function',
        function: {
          name: 'get_current_weather',
          description: 'Get the current weather',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: 'The city and state, e.g. San Francisco, CA',
              },
              format: {
                type: 'string',
                enum: ['celsius', 'fahrenheit'],
                description:
                  'The temperature unit to use. Infer this from the users location.',
              },
            },
            required: ['location', 'format'],
          },
        },
      },
    ];

    const messages = [
      new SystemMessage({
        content:
          "Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous.",
      }),
      new HumanMessage({
        content: "What's the weather like in San Francisco, Tokyo, and Paris?",
      }),
    ];

    const options: OpenAIChatCallOptions = { tools };

    const firstAsk = await openaiChat.invoke(messages, options);
    expect(firstAsk).toMatchSnapshot();

    const generations = firstAsk.generations as ChatGenerationChunk[];
    messages.push(generations[0].message);

    const toolCalls = generations[0].message.additionalKwargs?.tool_calls;
    if (toolCalls) {
      const availableFunctions = {
        get_current_weather,
      };

      for (const tc of toolCalls as OpenAIChatToolCall[]) {
        const funcName = tc.function.name;
        const func = availableFunctions[funcName];
        const funcArgs = JSON.parse(tc.function.arguments);

        const funcRes = func(funcArgs['location'], funcArgs['format']);
        messages.push(
          new FunctionMessage({
            content: funcRes,
            name: funcName,
            additionalKwargs: { tool_call_id: tc.id },
          })
        );
      }
    }

    const promptTokenNumber: number = await OpenAIChat.getNumTokensInChat(
      openaiChat.modelName,
      messages
    );
    const secondAsk = await openaiChat.invoke(messages);
    const completionTokenNumber: number =
      await OpenAIChat.getNumTokensInGenerations(
        openaiChat.modelName,
        secondAsk.generations as ChatGenerationChunk[]
      );

    expect(secondAsk).toMatchSnapshot();
    expect({
      completionTokens: completionTokenNumber,
      promptTokens: promptTokenNumber,
      totalTokens: promptTokenNumber + completionTokenNumber,
    }).toMatchSnapshot();
  });

  test('test OpenAIChat triggering local functions with vison', async () => {
    // Currently, GPT-4 Turbo with vision does not support functions/tools, but we can use two models to do it
    const openaiChat = new OpenAIChat({
      openAIApiKey: OPENAI_API_KEY,
      modelName: 'gpt-4-vision-preview',
    });

    const get_current_weather = (
      location: string,
      format: 'celsius' | 'fahrenheit'
    ) => {
      if (location.toLowerCase().includes('moscow')) {
        return { location, temperature: '3', format };
      }

      if (location.toLowerCase().includes('edinburgh')) {
        return { location, temperature: '7', format };
      }

      if (location.toLowerCase().includes('bucharest')) {
        return { location, temperature: '12', format };
      }

      if (location.toLowerCase().includes('kiev')) {
        return { location, temperature: '9', format };
      }

      if (location.toLowerCase().includes('dublin')) {
        return { location, temperature: '6', format };
      }

      if (location.toLowerCase().includes('east midlands')) {
        return { location, temperature: '10', format };
      }

      if (location.toLowerCase().includes('sofia')) {
        return { location, temperature: '11', format };
      }

      if (location.toLowerCase().includes('london')) {
        return { location, temperature: '7', format };
      }

      if (location.toLowerCase().includes('newcastle')) {
        return { location, temperature: '3', format };
      }

      if (location.toLowerCase().includes('st petersburg')) {
        return { location, temperature: '24', format };
      }

      if (location.toLowerCase().includes('manchester')) {
        return { location, temperature: '7', format };
      }

      return { location, temperature: 'unknown', format };
    };

    const tools: OpenAIChatTool[] = [
      {
        type: 'function',
        function: {
          name: 'get_current_weather',
          description: 'Get the current weather',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: 'The city and state, e.g. San Francisco, CA',
              },
              format: {
                type: 'string',
                enum: ['celsius', 'fahrenheit'],
                description:
                  'The temperature unit to use. Infer this from the users location.',
              },
            },
            required: ['location', 'format'],
          },
        },
      },
    ];

    const filePath: string = path.resolve(
      path.dirname(url.fileURLToPath(import.meta.url)),
      './examples/timetable.png'
    );

    const landmarkImage1 = Buffer.from(
      fs.readFileSync(filePath).buffer
    ).toString('base64');

    const visionMessages = [
      new HumanMessage({
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${landmarkImage1}`,
              detail: 'high',
            },
          },
          'Please give me a list of destinations in a format of {city}, {country}'
        ],
      })
    ];

    const firstAsk = await openaiChat.invoke(visionMessages);
    expect(firstAsk).toMatchSnapshot();

    const generations1 = firstAsk.generations as ChatGenerationChunk[];

    const funcCallMessages = [
      new SystemMessage({
        content:
          "Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous.",
      }),
      // You CANNOT push the bot message from the vison model directly to a model that you want to 
      // call the function... I guess this could be the reason why vison does not support functions/tools
      new HumanMessage({
        content: generations1[0].message.content
      }),
      new HumanMessage({
        content:
          'I want to book a flight to the warmest place. Can you suggest where I should go to?',
      }),
    ];

    const options: OpenAIChatCallOptions = { tools };

    const anotherOpenAIChat = new OpenAIChat({
      openAIApiKey: OPENAI_API_KEY,
      modelName: 'gpt-4-turbo-preview',
    });

    const secondAsk = await anotherOpenAIChat.invoke(funcCallMessages, options);
    expect(secondAsk).toMatchSnapshot();

    const generations2 = secondAsk.generations as ChatGenerationChunk[];
    funcCallMessages.push(generations2[0].message);

    const toolCalls = generations2[0].message.additionalKwargs?.tool_calls;
    if (toolCalls) {
      const availableFunctions = {
        get_current_weather,
      };

      for (const tc of toolCalls as OpenAIChatToolCall[]) {
        const funcName = tc.function.name;
        const func = availableFunctions[funcName];
        const funcArgs = JSON.parse(tc.function.arguments);

        const funcRes = func(funcArgs['location'], funcArgs['format']);
        funcCallMessages.push(
          new FunctionMessage({
            content: funcRes,
            name: funcName,
            additionalKwargs: { tool_call_id: tc.id },
          })
        );
      }
    }

    const promptTokenNumber: number = await OpenAIChat.getNumTokensInChat(
      anotherOpenAIChat.modelName,
      funcCallMessages
    );
    const thirdAsk = await anotherOpenAIChat.invoke(funcCallMessages);
    const completionTokenNumber: number =
      await OpenAIChat.getNumTokensInGenerations(
        anotherOpenAIChat.modelName,
        thirdAsk.generations as ChatGenerationChunk[]
      );

    expect(thirdAsk).toMatchSnapshot();
    expect({
      completionTokens: completionTokenNumber,
      promptTokens: promptTokenNumber,
      totalTokens: promptTokenNumber + completionTokenNumber,
    }).toMatchSnapshot();
  });
});
