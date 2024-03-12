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
  Node,
  NodeInputPortDef,
  NodeOutputPortDef,
  ProcessInputMap,
  ProcessContext,
  ProcessOutputMap,
  NodeBody,
  NodeConnection,
} from '../types/studio.type';

const { persistAtom } = recoilPersist({ key: 'graph' });

export const graphState = atom<NodeGraph>({
  key: 'graph',
  default: {
    nodes: [
      // TODO: remove this
      //       {
      //         id: '1',
      //         type: 'prompt',
      //         subType: 'string',
      //         title: 'StringPrompt',
      //         name: 'StringPrompt',
      //         aliases: {},
      //         secrets: {},
      //         kwargs: {
      //           value: {
      //             type: 'string',
      //             value:
      //               'Imagine a futuristic city where buildings are made of a shimmering, translucent material, and the streets are bustling with people and various types of vehicles, some of which float above the ground. The sky is dotted with drones and the occasional glimpse of a green park or garden can be seen between the structures. In the foreground, a diverse group of individuals is gathered around a holographic display, engaged in a lively discussion. The scene is set during the evening, with the city lights casting a warm glow over everything.',
      //           },
      //         },
      //         visualInfo: {
      //           position: {
      //             x: 100,
      //             y: 100,
      //             zIndex: 1,
      //           },
      //           size: {
      //             width: 300,
      //             height: 500,
      //           },
      //         },
      //         inputs: {
      //           prompt: ['string'],
      //           prompt1: ['string'],
      //           prompt2: ['string'],
      //         },
      //         outputs: {
      //           prompt: ['string'],
      //           prompt1: ['string'],
      //           prompt2: ['string'],
      //         },
      //         setKwarg: function (key: string, value: unknown): void {
      //           throw new Error('Function not implemented.');
      //         },
      //         getInputPortDefs: function (
      //           connections: NodeConnection[],
      //           nodes: Record<string, Node>,
      //         ): NodeInputPortDef[] {
      //           return [
      //             {
      //               nodeId: '1',
      //               name: 'prompt',
      //               type: ['string'],
      //             },
      //             {
      //               nodeId: '1',
      //               name: 'prompt1',
      //               type: ['string'],
      //             },
      //             {
      //               nodeId: '1',
      //               name: 'prompt2',
      //               type: ['string'],
      //             },
      //           ];
      //         },
      //         getOutputPortDefs: (
      //           connections: NodeConnection[],
      //           nodes: Record<string, Node>,
      //         ): NodeOutputPortDef[] => {
      //           return [
      //             {
      //               nodeId: '1',
      //               name: 'prompt',
      //               type: ['string'],
      //             },
      //             {
      //               nodeId: '1',
      //               name: 'prompt1',
      //               type: ['string'],
      //             },
      //             {
      //               nodeId: '1',
      //               name: 'prompt2',
      //               type: ['string'],
      //             },
      //           ];
      //         },
      //         getBody: async (): Promise<NodeBody> => {
      //           return [
      //             {
      //               type: 'code',
      //               text: `attr1: "1"
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
      //               language: 'encre-code',
      //               keywords: [
      //                 'attr1',
      //                 'attr2',
      //                 'attr3',
      //                 'attr4',
      //                 'attr5',
      //                 'attr6',
      //                 'attr7',
      //                 'attr8',
      //               ],
      //               isHoldingValues: true,
      //             },
      //             {
      //               type: 'context',
      //               text: [
      //                 {
      //                   type: 'plain',
      //                   text: '6',
      //                 },
      //               ],
      //               metadata: [
      //                 {
      //                   type: 'code',
      //                   text: 'sub1: 1',
      //                   language: 'encre-code',
      //                   keywords: ['sub1'],
      //                   isHoldingValues: false,
      //                 },
      //               ],
      //             },
      //             {
      //               type: 'context',
      //               text: [
      //                 {
      //                   type: 'plain',
      //                   text: '7',
      //                 },
      //               ],
      //               metadata: [
      //                 {
      //                   type: 'code',
      //                   text: 'sub1: 2',
      //                   language: 'encre-code',
      //                   keywords: ['sub1'],
      //                   isHoldingValues: false,
      //                 },
      //               ],
      //             },
      //             {
      //               type: 'code',
      //               text: 'attr7: ',
      //               language: 'encre-code',
      //               keywords: [
      //                 'attr1',
      //                 'attr2',
      //                 'attr3',
      //                 'attr4',
      //                 'attr5',
      //                 'attr6',
      //                 'attr7',
      //                 'attr8',
      //               ],
      //               isHoldingValues: true,
      //             },
      //             {
      //               type: 'blob',
      //               blob: [
      //                 {
      //                   type: 'image',
      //                   mimeType: 'image/png',
      //                   data: new Uint8Array(
      //                     await (await (await fetch(myPng)).blob()).arrayBuffer(),
      //                   ),
      //                 },
      //                 {
      //                   type: 'image',
      //                   mimeType: 'image/jpeg',
      //                   data: new Uint8Array(
      //                     await (await (await fetch(myJpeg)).blob()).arrayBuffer(),
      //                   ),
      //                 },
      //                 {
      //                   type: 'image',
      //                   mimeType: 'image/gif',
      //                   data: new Uint8Array(
      //                     await (await (await fetch(myGif)).blob()).arrayBuffer(),
      //                   ),
      //                 },
      //                 {
      //                   type: 'image',
      //                   mimeType: 'image/svg+xml',
      //                   data: new Uint8Array(
      //                     await (await (await fetch(mySvg)).blob()).arrayBuffer(),
      //                   ),
      //                 },
      //                 {
      //                   type: 'file',
      //                   mimeType: 'text/plain',
      //                   data: new Uint8Array(await new Blob(['1']).arrayBuffer()),
      //                 },
      //                 {
      //                   type: 'file',
      //                   mimeType: 'text/html',
      //                   data: new Uint8Array(await new Blob(['1']).arrayBuffer()),
      //                 },
      //                 {
      //                   type: 'file',
      //                   mimeType: 'text/javascript',
      //                   data: new Uint8Array(await new Blob(['1']).arrayBuffer()),
      //                 },
      //                 {
      //                   type: 'file',
      //                   mimeType: 'text/css',
      //                   data: new Uint8Array(await new Blob(['1']).arrayBuffer()),
      //                 },
      //                 {
      //                   type: 'file',
      //                   mimeType: 'application/json',
      //                   data: new Uint8Array(await new Blob(['1']).arrayBuffer()),
      //                 },
      //                 {
      //                   type: 'file',
      //                   mimeType: 'application/pdf',
      //                   data: new Uint8Array(await new Blob(['1']).arrayBuffer()),
      //                 },
      //                 {
      //                   type: 'file',
      //                   mimeType: 'application/xml',
      //                   data: new Uint8Array(await new Blob(['1']).arrayBuffer()),
      //                 },
      //                 {
      //                   type: 'audio',
      //                   mimeType: 'audio/mp3',
      //                   data: new Uint8Array(
      //                     await (await (await fetch(myMp3)).blob()).arrayBuffer(),
      //                   ),
      //                 },
      //                 {
      //                   type: 'audio',
      //                   mimeType: 'audio/ogg',
      //                   data: new Uint8Array(
      //                     await (await (await fetch(myOgg)).blob()).arrayBuffer(),
      //                   ),
      //                 },
      //                 {
      //                   type: 'audio',
      //                   mimeType: 'audio/wav',
      //                   data: new Uint8Array(
      //                     await (await (await fetch(myWav)).blob()).arrayBuffer(),
      //                   ),
      //                 },
      //               ],
      //               size: 1,
      //               blobType: '',
      //             },
      //             {
      //               type: 'code',
      //               text: 'attr8: ',
      //               language: 'encre-code',
      //               keywords: [
      //                 'attr1',
      //                 'attr2',
      //                 'attr3',
      //                 'attr4',
      //                 'attr5',
      //                 'attr6',
      //                 'attr7',
      //                 'attr8',
      //               ],
      //               isHoldingValues: true,
      //             },
      //             {
      //               type: 'message',
      //               content: [
      //                 {
      //                   type: 'plain',
      //                   text: '8',
      //                 },
      //               ],
      //               kwargs: [
      //                 {
      //                   type: 'code',
      //                   text: '',
      //                   language: 'encre-code',
      //                   keywords: [],
      //                   isHoldingValues: false,
      //                 },
      //               ],
      //               role: 'human',
      //               name: undefined,
      //             },
      //             {
      //               type: 'message',
      //               content: [
      //                 {
      //                   type: 'plain',
      //                   text: '9',
      //                 },
      //               ],
      //               kwargs: [
      //                 {
      //                   type: 'code',
      //                   text: '',
      //                   language: 'encre-code',
      //                   keywords: [],
      //                   isHoldingValues: false,
      //                 },
      //               ],
      //               role: 'assistant',
      //               name: undefined,
      //             },
      //           ];
      //         },
      //         validateInputs: function (
      //           inputs?: ProcessInputMap | undefined,
      //         ): boolean {
      //           throw new Error('Function not implemented.');
      //         },
      //         process: function (
      //           inputs: ProcessInputMap,
      //           context: ProcessContext,
      //         ): Promise<ProcessOutputMap> {
      //           throw new Error('Function not implemented.');
      //         },
      //       },
      {
        id: '2',
        type: 'prompt',
        subType: 'string',
        title: '2',
        name: 'StringPrompt',
        aliases: {},
        secrets: {},
        kwargs: {
          value: {
            type: 'string',
            value:
              'Imagine a futuristic city where buildings are made of a shimmering, translucent material, and the streets are bustling with people and various types of vehicles, some of which float above the ground. The sky is dotted with drones and the occasional glimpse of a green park or garden can be seen between the structures. In the foreground, a diverse group of individuals is gathered around a holographic display, engaged in a lively discussion. The scene is set during the evening, with the city lights casting a warm glow over everything.',
          },
        },
        visualInfo: {
          position: {
            x: 500,
            y: 100,
            zIndex: 2,
          },
          size: {
            width: 300,
            height: 500,
          },
        },
        inputs: {
          a: ['string'],
          b: ['string'],
          c: ['string'],
        },
        outputs: {
          a: ['string'],
          b: ['string'],
          c: ['string'],
        },
        setKwarg: function (key: string, value: unknown): void {
          throw new Error('Function not implemented.');
        },
        getInputPortDefs: function (
          connections: NodeConnection[],
          nodes: Record<string, Node>,
        ): NodeInputPortDef[] {
          return [
            {
              nodeId: '2',
              name: 'a',
              type: ['string'],
            },
            {
              nodeId: '2',
              name: 'b',
              type: ['string'],
            },
            {
              nodeId: '2',
              name: 'c',
              type: ['string'],
            },
          ];
        },
        getOutputPortDefs: (
          connections: NodeConnection[],
          nodes: Record<string, Node>,
        ): NodeOutputPortDef[] => {
          return [
            {
              nodeId: '2',
              name: 'd',
              type: ['string'],
            },
            {
              nodeId: '2',
              name: 'e',
              type: ['string'],
            },
            {
              nodeId: '2',
              name: 'f',
              type: ['string'],
            },
          ];
        },
        getBody: async (): Promise<NodeBody> => {
          return [
            {
              type: 'code',
              text: `attr1: "1"
attr2: [2, 3]
attr3: true
attr4: [
  {
    "sub1": 1,
    "sub2": "2"
  },
  {
    "sub3": 3,
    "sub4": "4"
  }
]
attr6: `,
              language: 'encre-code',
              keywords: [
                'attr1',
                'attr2',
                'attr3',
                'attr4',
                'attr5',
                'attr6',
                'attr7',
                'attr8',
              ],
              isHoldingValues: true,
            },
          ];
        },
        validateInputs: function (
          inputs?: ProcessInputMap | undefined,
        ): boolean {
          throw new Error('Function not implemented.');
        },
        process: function (
          inputs: ProcessInputMap,
          context: ProcessContext,
        ): Promise<ProcessOutputMap> {
          throw new Error('Function not implemented.');
        },
      },
      {
        id: '3',
        type: 'prompt',
        subType: 'string',
        title: '3',
        name: 'StringPrompt',
        aliases: {},
        secrets: {},
        kwargs: {
          value: {
            type: 'string',
            value:
              'Imagine a futuristic city where buildings are made of a shimmering, translucent material, and the streets are bustling with people and various types of vehicles, some of which float above the ground. The sky is dotted with drones and the occasional glimpse of a green park or garden can be seen between the structures. In the foreground, a diverse group of individuals is gathered around a holographic display, engaged in a lively discussion. The scene is set during the evening, with the city lights casting a warm glow over everything.',
          },
        },
        visualInfo: {
          position: {
            x: 200,
            y: 200,
            zIndex: 2,
          },
          size: {
            width: 300,
            height: 500,
          },
        },
        inputs: {
          a: ['string'],
          b: ['string'],
          c: ['string'],
        },
        outputs: {
          a: ['string'],
          b: ['string'],
          c: ['string'],
        },
        setKwarg: function (key: string, value: unknown): void {
          throw new Error('Function not implemented.');
        },
        getInputPortDefs: function (
          connections: NodeConnection[],
          nodes: Record<string, Node>,
        ): NodeInputPortDef[] {
          return [
            {
              nodeId: '3',
              name: 'a',
              type: ['string'],
            },
            {
              nodeId: '3',
              name: 'b',
              type: ['string'],
            },
            {
              nodeId: '3',
              name: 'c',
              type: ['string'],
            },
          ];
        },
        getOutputPortDefs: (
          connections: NodeConnection[],
          nodes: Record<string, Node>,
        ): NodeOutputPortDef[] => {
          return [
            {
              nodeId: '3',
              name: 'd',
              type: ['string'],
            },
            {
              nodeId: '3',
              name: 'e',
              type: ['string'],
            },
            {
              nodeId: '3',
              name: 'f',
              type: ['string'],
            },
          ];
        },
        getBody: async (): Promise<NodeBody> => {
          return [
            {
              type: 'code',
              text: `attr1: "1"
attr2: [2, 3]
attr3: true
attr4: [
  {
    "sub1": 1,
    "sub2": "2"
  },
  {
    "sub3": 3,
    "sub4": "4"
  }
]
attr6: `,
              language: 'encre-code',
              keywords: [
                'attr1',
                'attr2',
                'attr3',
                'attr4',
                'attr5',
                'attr6',
                'attr7',
                'attr8',
              ],
              isHoldingValues: true,
            },
          ];
        },
        validateInputs: function (
          inputs?: ProcessInputMap | undefined,
        ): boolean {
          throw new Error('Function not implemented.');
        },
        process: function (
          inputs: ProcessInputMap,
          context: ProcessContext,
        ): Promise<ProcessOutputMap> {
          throw new Error('Function not implemented.');
        },
      },
      {
        id: '4',
        type: 'prompt',
        subType: 'string',
        title: '4',
        name: 'StringPrompt',
        aliases: {},
        secrets: {},
        kwargs: {
          value: {
            type: 'string',
            value:
              'Imagine a futuristic city where buildings are made of a shimmering, translucent material, and the streets are bustling with people and various types of vehicles, some of which float above the ground. The sky is dotted with drones and the occasional glimpse of a green park or garden can be seen between the structures. In the foreground, a diverse group of individuals is gathered around a holographic display, engaged in a lively discussion. The scene is set during the evening, with the city lights casting a warm glow over everything.',
          },
        },
        visualInfo: {
          position: {
            x: 300,
            y: 300,
            zIndex: 3,
          },
          size: {
            width: 300,
            height: 500,
          },
        },
        inputs: {
          a: ['string'],
          b: ['string'],
          c: ['string'],
        },
        outputs: {
          a: ['string'],
          b: ['string'],
          c: ['string'],
        },
        setKwarg: function (key: string, value: unknown): void {
          throw new Error('Function not implemented.');
        },
        getInputPortDefs: function (
          connections: NodeConnection[],
          nodes: Record<string, Node>,
        ): NodeInputPortDef[] {
          return [
            {
              nodeId: '4',
              name: 'a',
              type: ['string'],
            },
            {
              nodeId: '4',
              name: 'b',
              type: ['string'],
            },
            {
              nodeId: '4',
              name: 'c',
              type: ['string'],
            },
          ];
        },
        getOutputPortDefs: (
          connections: NodeConnection[],
          nodes: Record<string, Node>,
        ): NodeOutputPortDef[] => {
          return [
            {
              nodeId: '4',
              name: 'd',
              type: ['string'],
            },
            {
              nodeId: '4',
              name: 'e',
              type: ['string'],
            },
            {
              nodeId: '4',
              name: 'f',
              type: ['string'],
            },
          ];
        },
        getBody: async (): Promise<NodeBody> => {
          return [
            {
              type: 'code',
              text: `attr1: "1"
attr2: [2, 3]
attr3: true
attr4: [
  {
    "sub1": 1,
    "sub2": "2"
  },
  {
    "sub3": 3,
    "sub4": "4"
  }
]
attr6: `,
              language: 'encre-code',
              keywords: [
                'attr1',
                'attr2',
                'attr3',
                'attr4',
                'attr5',
                'attr6',
                'attr7',
                'attr8',
              ],
              isHoldingValues: true,
            },
          ];
        },
        validateInputs: function (
          inputs?: ProcessInputMap | undefined,
        ): boolean {
          throw new Error('Function not implemented.');
        },
        process: function (
          inputs: ProcessInputMap,
          context: ProcessContext,
        ): Promise<ProcessOutputMap> {
          throw new Error('Function not implemented.');
        },
      },
    ],
    connections: [],
  },
  effects: [persistAtom],
});
