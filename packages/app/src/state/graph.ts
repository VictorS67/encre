import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

import mySvg from '../assets/compass.svg';
import myJpeg from '../assets/flower.jpg';
import myWav from '../assets/gettysburg.wav';
import myGif from '../assets/giphy.gif';
import myOgg from '../assets/radio.ogg';
import myMp3 from '../assets/sunflower.mp3';
import myPng from '../assets/timetable.png';
import { NodeGraph } from '../types/graph.type';
import {
  // globalNodeRegistry,
  Node,
  NodeInputPortDef,
  NodeOutputPortDef,
  NodeBody,
  NodeConnection,
} from '../types/studio.type';

const { persistAtom } = recoilPersist({ key: 'graph' });

export const graphState = atom<NodeGraph>({
  key: 'graph',
  default: {
    nodes: [
      // TODO: remove this
      // {
      //   id: '1',
      //   type: 'prompt',
      //   subType: 'string',
      //   title: 'StringPrompt',
      //   name: 'StringPrompt',
      //   aliases: {},
      //   secrets: {},
      //   kwargs: {
      //     value: {
      //       type: 'string',
      //       value:
      //         'Imagine a futuristic city where buildings are made of a shimmering, translucent material, and the streets are bustling with people and various types of vehicles, some of which float above the ground. The sky is dotted with drones and the occasional glimpse of a green park or garden can be seen between the structures. In the foreground, a diverse group of individuals is gathered around a holographic display, engaged in a lively discussion. The scene is set during the evening, with the city lights casting a warm glow over everything.',
      //     },
      //   },
      //   visualInfo: {
      //     position: {
      //       x: 100,
      //       y: 100,
      //       zIndex: 1,
      //     },
      //     size: {
      //       width: 300,
      //       height: 500,
      //     },
      //   },
      //   inputs: {
      //     prompt: ['string'],
      //     prompt1: ['string'],
      //     prompt2: ['string'],
      //   },
      //   outputs: {
      //     prompt: ['string'],
      //     prompt1: ['string'],
      //     prompt2: ['string'],
      //   },
      //   setKwarg: function (key: string, value: unknown): void {
      //     throw new Error('Function not implemented.');
      //   },
      //   getInputPortDefs: function (
      //     connections: NodeConnection[],
      //     nodes: Record<string, Node>,
      //   ): NodeInputPortDef[] {
      //     return [
      //       {
      //         nodeId: '1',
      //         name: 'prompt',
      //         type: ['string'],
      //       },
      //       {
      //         nodeId: '1',
      //         name: 'prompt1',
      //         type: ['string'],
      //       },
      //       {
      //         nodeId: '1',
      //         name: 'prompt2',
      //         type: ['string'],
      //       },
      //     ];
      //   },
      //   getOutputPortDefs: (
      //     connections: NodeConnection[],
      //     nodes: Record<string, Node>,
      //   ): NodeOutputPortDef[] => {
      //     return [
      //       {
      //         nodeId: '1',
      //         name: 'prompt',
      //         type: ['string'],
      //       },
      //       {
      //         nodeId: '1',
      //         name: 'prompt1',
      //         type: ['string'],
      //       },
      //       {
      //         nodeId: '1',
      //         name: 'prompt2',
      //         type: ['string'],
      //       },
      //     ];
      //   },
      //   getBody: async (): Promise<NodeBody> => {
      //     return [
      //       {
      //         type: 'code',
      //         text: `attr1: "1"
      // attr2: [2, 3]
      // attr3: true
      // attr4: [
      //   {
      //     "sub1": 1,
      //     "sub2": "2"
      //   },
      //   {
      //     "sub3": 3,
      //     "sub4": "4"
      //   }
      // ]
      // attr6: `,
      //         language: 'encre-code',
      //         keywords: [
      //           'attr1',
      //           'attr2',
      //           'attr3',
      //           'attr4',
      //           'attr5',
      //           'attr6',
      //           'attr7',
      //           'attr8',
      //         ],
      //         isHoldingValues: true,
      //       },
      //       {
      //         type: 'context',
      //         text: [
      //           {
      //             type: 'plain',
      //             text: '6',
      //           },
      //         ],
      //         metadata: [
      //           {
      //             type: 'code',
      //             text: 'sub1: 1',
      //             language: 'encre-code',
      //             keywords: ['sub1'],
      //             isHoldingValues: false,
      //           },
      //         ],
      //       },
      //       {
      //         type: 'context',
      //         text: [
      //           {
      //             type: 'plain',
      //             text: '7',
      //           },
      //         ],
      //         metadata: [
      //           {
      //             type: 'code',
      //             text: 'sub1: 2',
      //             language: 'encre-code',
      //             keywords: ['sub1'],
      //             isHoldingValues: false,
      //           },
      //         ],
      //       },
      //       {
      //         type: 'code',
      //         text: 'attr7: ',
      //         language: 'encre-code',
      //         keywords: [
      //           'attr1',
      //           'attr2',
      //           'attr3',
      //           'attr4',
      //           'attr5',
      //           'attr6',
      //           'attr7',
      //           'attr8',
      //         ],
      //         isHoldingValues: true,
      //       },
      //       {
      //         type: 'blob',
      //         blob: [
      //           {
      //             type: 'image',
      //             mimeType: 'image/png',
      //             data: new Uint8Array(
      //               await (await (await fetch(myPng)).blob()).arrayBuffer(),
      //             ),
      //           },
      //           {
      //             type: 'image',
      //             mimeType: 'image/jpeg',
      //             data: new Uint8Array(
      //               await (await (await fetch(myJpeg)).blob()).arrayBuffer(),
      //             ),
      //           },
      //           {
      //             type: 'image',
      //             mimeType: 'image/gif',
      //             data: new Uint8Array(
      //               await (await (await fetch(myGif)).blob()).arrayBuffer(),
      //             ),
      //           },
      //           {
      //             type: 'image',
      //             mimeType: 'image/svg+xml',
      //             data: new Uint8Array(
      //               await (await (await fetch(mySvg)).blob()).arrayBuffer(),
      //             ),
      //           },
      //           {
      //             type: 'file',
      //             mimeType: 'text/plain',
      //             data: new Uint8Array(await new Blob(['1']).arrayBuffer()),
      //           },
      //           {
      //             type: 'file',
      //             mimeType: 'text/html',
      //             data: new Uint8Array(await new Blob(['1']).arrayBuffer()),
      //           },
      //           {
      //             type: 'file',
      //             mimeType: 'text/javascript',
      //             data: new Uint8Array(await new Blob(['1']).arrayBuffer()),
      //           },
      //           {
      //             type: 'file',
      //             mimeType: 'text/css',
      //             data: new Uint8Array(await new Blob(['1']).arrayBuffer()),
      //           },
      //           {
      //             type: 'file',
      //             mimeType: 'application/json',
      //             data: new Uint8Array(await new Blob(['1']).arrayBuffer()),
      //           },
      //           {
      //             type: 'file',
      //             mimeType: 'application/pdf',
      //             data: new Uint8Array(await new Blob(['1']).arrayBuffer()),
      //           },
      //           {
      //             type: 'file',
      //             mimeType: 'application/xml',
      //             data: new Uint8Array(await new Blob(['1']).arrayBuffer()),
      //           },
      //           {
      //             type: 'audio',
      //             mimeType: 'audio/mp3',
      //             data: new Uint8Array(
      //               await (await (await fetch(myMp3)).blob()).arrayBuffer(),
      //             ),
      //           },
      //           {
      //             type: 'audio',
      //             mimeType: 'audio/ogg',
      //             data: new Uint8Array(
      //               await (await (await fetch(myOgg)).blob()).arrayBuffer(),
      //             ),
      //           },
      //           {
      //             type: 'audio',
      //             mimeType: 'audio/wav',
      //             data: new Uint8Array(
      //               await (await (await fetch(myWav)).blob()).arrayBuffer(),
      //             ),
      //           },
      //         ],
      //         size: 1,
      //         blobType: '',
      //       },
      //       {
      //         type: 'code',
      //         text: 'attr8: ',
      //         language: 'encre-code',
      //         keywords: [
      //           'attr1',
      //           'attr2',
      //           'attr3',
      //           'attr4',
      //           'attr5',
      //           'attr6',
      //           'attr7',
      //           'attr8',
      //         ],
      //         isHoldingValues: true,
      //       },
      //       {
      //         type: 'message',
      //         content: [
      //           {
      //             type: 'plain',
      //             text: '8',
      //           },
      //         ],
      //         kwargs: [
      //           {
      //             type: 'code',
      //             text: '',
      //             language: 'encre-code',
      //             keywords: [],
      //             isHoldingValues: false,
      //           },
      //         ],
      //         role: 'human',
      //         name: undefined,
      //       },
      //       {
      //         type: 'message',
      //         content: [
      //           {
      //             type: 'plain',
      //             text: '9',
      //           },
      //         ],
      //         kwargs: [
      //           {
      //             type: 'code',
      //             text: '',
      //             language: 'encre-code',
      //             keywords: [],
      //             isHoldingValues: false,
      //           },
      //         ],
      //         role: 'assistant',
      //         name: undefined,
      //       },
      //     ];
      //   },
      //   validateInputs: function (
      //     inputs?: ProcessInputMap | undefined,
      //   ): boolean {
      //     throw new Error('Function not implemented.');
      //   },
      //   process: function (
      //     inputs: ProcessInputMap,
      //     context: ProcessContext,
      //   ): Promise<ProcessOutputMap> {
      //     throw new Error('Function not implemented.');
      //   },
      // },
      // {
      //   id: "vyopwbzpnsanaan",
      //   type: "prompt",
      //   subType: "string",
      //   title: "BotA Prompt",
      //   name: "StringPrompt",
      //   aliases: {},
      //   secrets: {},
      //   kwargs: {
      //     value: {
      //       type: "string",
      //       value:
      //         "Imagine a futuristic city where buildings are made of a shimmering, translucent material, and the streets are bustling with people and various types of vehicles, some of which float above the ground. The sky is dotted with drones and the occasional glimpse of a green park or garden can be seen between the structures. In the foreground, a diverse group of individuals is gathered around a holographic display, engaged in a lively discussion. The scene is set during the evening, with the city lights casting a warm glow over everything.",
      //     },
      //   },
      //   visualInfo: {
      //     position: {
      //       x: 500,
      //       y: 100,
      //       zIndex: 2,
      //     },
      //     size: {
      //       width: 300,
      //       height: 500,
      //     },
      //   },
      //   inputs: {},
      //   outputs: {
      //     prompt: ["string"],
      //   },
      //   setKwarg: function (key: string, value: unknown): void {
      //     throw new Error("Function not implemented.");
      //   },
      //   getInputPortDefs: function (
      //     connections: NodeConnection[],
      //     nodes: Record<string, Node>
      //   ): NodeInputPortDef[] {
      //     return [];
      //   },
      //   getOutputPortDefs: (
      //     connections: NodeConnection[],
      //     nodes: Record<string, Node>
      //   ): NodeOutputPortDef[] => {
      //     return [
      //       {
      //         nodeId: "vyopwbzpnsanaan",
      //         name: "prompt",
      //         type: ["string"],
      //       },
      //     ];
      //   },
      //   getBody: async (): Promise<NodeBody> => {
      //     return [
      //       {
      //         type: "message",
      //         content: [
      //           {
      //             type: "plain",
      //             text: "You are a friend, aiming to promote well-being, guided by the Theory of Planned Behavior, which suggests that an individual's behavior is directly influenced by their intention, shaped by their attitudes towards the behavior, the subjective norms surrounding it, and their perceived control over the behavior. Your approach involves providing emotional through a direct communication style, while maintaining a positive tone throughout the interaction.",
      //           },
      //         ],
      //         kwargs: [
      //           {
      //             type: "code",
      //             text: "",
      //             language: "encre-code",
      //             keywords: [],
      //             isHoldingValues: false,
      //           },
      //         ],
      //         role: "system",
      //         name: undefined,
      //       },
      //     ];
      //   },
      //   validateInputs: function (
      //     inputs?: ProcessInputMap | undefined
      //   ): boolean {
      //     throw new Error("Function not implemented.");
      //   },
      //   process: function (
      //     inputs: ProcessInputMap,
      //     context: ProcessContext
      //   ): Promise<ProcessOutputMap> {
      //     throw new Error("Function not implemented.");
      //   },
      // },
      //       {
      //         id: "absdfoawbfaaoewp",
      //         type: "prompt",
      //         subType: "string",
      //         title: "BotB Prompt",
      //         name: "StringPrompt",
      //         aliases: {},
      //         secrets: {},
      //         kwargs: {
      //           value: {
      //             type: "string",
      //             value:
      //               "Imagine a futuristic city where buildings are made of a shimmering, translucent material, and the streets are bustling with people and various types of vehicles, some of which float above the ground. The sky is dotted with drones and the occasional glimpse of a green park or garden can be seen between the structures. In the foreground, a diverse group of individuals is gathered around a holographic display, engaged in a lively discussion. The scene is set during the evening, with the city lights casting a warm glow over everything.",
      //           },
      //         },
      //         visualInfo: {
      //           position: {
      //             x: 200,
      //             y: 200,
      //             zIndex: 2,
      //           },
      //           size: {
      //             width: 300,
      //             height: 500,
      //           },
      //         },
      //         inputs: {},
      //         outputs: {
      //           prompt: ["string"],
      //         },
      //         setKwarg: function (key: string, value: unknown): void {
      //           throw new Error("Function not implemented.");
      //         },
      //         getInputPortDefs: function (
      //           connections: NodeConnection[],
      //           nodes: Record<string, Node>
      //         ): NodeInputPortDef[] {
      //           return [];
      //         },
      //         getOutputPortDefs: (
      //           connections: NodeConnection[],
      //           nodes: Record<string, Node>
      //         ): NodeOutputPortDef[] => {
      //           return [
      //             {
      //               nodeId: "absdfoawbfaaoewp",
      //               name: "prompt",
      //               type: ["string"],
      //             },
      //           ];
      //         },
      //         getBody: async (): Promise<NodeBody> => {
      //           return [
      //             {
      //               type: "message",
      //               content: [
      //                 {
      //                   type: "plain",
      //                   text: "You are a student who feels generally positive about life. Recently, you've been managing your academic and personal responsibilities well, feeling confident in your ability to handle challenges. You seek to maintain or slightly improve your current state of well-being. During a conversation with a well-being improvement agent, you express interest in strategies that could further enhance your productivity and overall happiness without indicating any significant distress or issues.",
      //                 },
      //               ],
      //               kwargs: [
      //                 {
      //                   type: "code",
      //                   text: "",
      //                   language: "encre-code",
      //                   keywords: [],
      //                   isHoldingValues: false,
      //                 },
      //               ],
      //               role: "system",
      //               name: undefined,
      //             },
      //           ];
      //         },
      //         validateInputs: function (
      //           inputs?: ProcessInputMap | undefined
      //         ): boolean {
      //           throw new Error("Function not implemented.");
      //         },
      //         process: function (
      //           inputs: ProcessInputMap,
      //           context: ProcessContext
      //         ): Promise<ProcessOutputMap> {
      //           throw new Error("Function not implemented.");
      //         },
      //       },
      //       {
      //         id: "vbylbsauooanapw",
      //         type: "chatlm",
      //         subType: "openai",
      //         title: "OpenAIChat",
      //         name: "OpenAIChat",
      //         aliases: {},
      //         secrets: {},
      //         kwargs: {
      //           value: {
      //             type: "string",
      //             value:
      //               "Imagine a futuristic city where buildings are made of a shimmering, translucent material, and the streets are bustling with people and various types of vehicles, some of which float above the ground. The sky is dotted with drones and the occasional glimpse of a green park or garden can be seen between the structures. In the foreground, a diverse group of individuals is gathered around a holographic display, engaged in a lively discussion. The scene is set during the evening, with the city lights casting a warm glow over everything.",
      //           },
      //         },
      //         visualInfo: {
      //           position: {
      //             x: 300,
      //             y: 300,
      //             zIndex: 3,
      //           },
      //           size: {
      //             width: 300,
      //             height: 500,
      //           },
      //         },
      //         inputs: {
      //           prompt: ["string"],
      //         },
      //         outputs: {
      //           output: "string",
      //           message: "string",
      //           info: ["object", "unknown"],
      //           completionTokens: ["number", "unknown"],
      //           promptTokens: ["number", "unknown"],
      //           totalTokens: ["number", "unknown"],
      //         },
      //         setKwarg: function (key: string, value: unknown): void {
      //           throw new Error("Function not implemented.");
      //         },
      //         getInputPortDefs: function (
      //           connections: NodeConnection[],
      //           nodes: Record<string, Node>
      //         ): NodeInputPortDef[] {
      //           return [
      //             {
      //               nodeId: "vbylbsauooanapw",
      //               name: "prompt",
      //               type: ["string"],
      //             },
      //           ];
      //         },
      //         getOutputPortDefs: (
      //           connections: NodeConnection[],
      //           nodes: Record<string, Node>
      //         ): NodeOutputPortDef[] => {
      //           return [
      //             {
      //               nodeId: "vbylbsauooanapw",
      //               name: "output",
      //               type: ["string"],
      //             },
      //             {
      //               nodeId: "vbylbsauooanapw",
      //               name: "message",
      //               type: ["string"],
      //             },
      //             {
      //               nodeId: "vbylbsauooanapw",
      //               name: "info",
      //               type: ["object", "unknown"],
      //             },
      //             {
      //               nodeId: "vbylbsauooanapw",
      //               name: "completionTokens",
      //               type: ["number", "unknown"],
      //             },
      //             {
      //               nodeId: "vbylbsauooanapw",
      //               name: "promptTokens",
      //               type: ["number", "unknown"],
      //             },
      //             {
      //               nodeId: "vbylbsauooanapw",
      //               name: "totalTokens",
      //               type: ["number", "unknown"],
      //             },
      //           ];
      //         },
      //         getBody: async (): Promise<NodeBody> => {
      //           return [
      //             {
      //               type: "code",
      //               text: `modelName: 'gpt-4-turbo-preview'
      // temperature: 1
      // topP: 1
      // frequencyPenalty: 0
      // presencePenalty: 0
      // maxTokens: 2048
      // streaming: false`,
      //               language: "encre-code",
      //               keywords: [
      //                 "verbose",
      //                 "callbacks",
      //                 "modelName",
      //                 "temperature",
      //                 "topP",
      //                 "frequencyPenalty",
      //                 "presencePenalty",
      //                 "maxTokens",
      //                 "streaming",
      //                 "stopWords",
      //                 "logitBias",
      //                 "responseFormatType",
      //                 "seed",
      //                 "user",
      //                 "timeout",
      //                 "additionalKwargs",
      //               ],
      //             },
      //           ];
      //         },
      //         validateInputs: function (
      //           inputs?: ProcessInputMap | undefined
      //         ): boolean {
      //           throw new Error("Function not implemented.");
      //         },
      //         process: function (
      //           inputs: ProcessInputMap,
      //           context: ProcessContext
      //         ): Promise<ProcessOutputMap> {
      //           throw new Error("Function not implemented.");
      //         },
      //       },
      // globalNodeRegistry.createDynamic('prompt', 'string'),
    ],
    connections: [],
    comments: [
      //       {
      //         id: "hdafofndoiasn213nal",
      //         visualInfo: {
      //           position: {
      //             x: 100,
      //             y: 100,
      //             zIndex: 1,
      //           },
      //           size: {
      //             width: 500,
      //             height: 500,
      //           },
      //           content: {
      //             horitontal: "start",
      //             vertical: "start",
      //           },
      //         },
      //         title: "Aggregating data with the Merge node",
      //         description: "Aggregating data with the Merge node",
      //         type: "code",
      //         text: "this is a comment content.",
      //         language: "javascript",
      //       },
      //       {
      //         id: "bdsfbsidubfouis",
      //         visualInfo: {
      //           position: {
      //             x: 800,
      //             y: 800,
      //             zIndex: 1,
      //           },
      //           size: {
      //             width: 200,
      //             height: 200,
      //           },
      //           content: {
      //             horitontal: "start",
      //             vertical: "start",
      //           },
      //         },
      //         // title: "Aggregating data with the Merge node",
      //         // description: "Aggregating data with the Merge node",
      //         type: "code",
      //         text: `/* Some example CSS */
      // @import url("something.css");
      // body {
      //   margin: 0;
      //   padding: 3em 6em;
      //   font-family: tahoma, arial, sans-serif;
      //   color: #000;
      // }
      // #navigation a {
      //   font-weight: bold;
      //   text-decoration: none !important;
      // }
      // h1 {
      //   font-size: 2.5em;
      // }
      // h2 {
      //   font-size: 1.7em;
      // }
      // h1:before, h2:before {
      //   content: "some contents";
      // }
      // code {
      //   font-family: courier, monospace;
      //   font-size: 80%;
      //   color: #418A8A;
      // }`,
      //         language: "text/css",
      //       },
    ],
  },
  effects: [persistAtom],
});
