import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

import { NodeGraph } from '../types/graph.type';
import {
  NodeInputPortDef,
  NodeOutputPortDef,
  ProcessInputMap,
  ProcessContext,
  ProcessOutputMap,
  NodeBody,
} from '../types/studio.type';

const { persistAtom } = recoilPersist({ key: 'graph' });

export const graphState = atom<NodeGraph>({
  key: 'graph',
  default: {
    nodes: [
      // TODO: remove this
      {
        id: '1',
        type: 'prompt',
        subType: 'string',
        title: 'StringPrompt',
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
            x: 100,
            y: 100,
            zIndex: 1,
          },
          size: {
            width: 300,
            height: 500,
          },
        },
        inputs: {},
        outputs: {
          prompt: ['string'],
        },
        setKwarg: function (key: string, value: unknown): void {
          throw new Error('Function not implemented.');
        },
        getInputPortDefs: function (): NodeInputPortDef[] {
          return [];
        },
        getOutputPortDefs: (): NodeOutputPortDef[] => {
          return [
            {
              id: '1',
              name: 'prompt',
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
            {
              type: 'context',
              text: [
                {
                  type: 'plain',
                  text: '6',
                },
              ],
              metadata: [
                {
                  type: 'code',
                  text: 'sub1: 1',
                  language: 'encre-code',
                  keywords: ['sub1'],
                  isHoldingValues: false,
                },
              ],
            },
            {
              type: 'context',
              text: [
                {
                  type: 'plain',
                  text: '7',
                },
              ],
              metadata: [
                {
                  type: 'code',
                  text: 'sub1: 2',
                  language: 'encre-code',
                  keywords: ['sub1'],
                  isHoldingValues: false,
                },
              ],
            },
            {
              type: 'code',
              text: 'attr7: ',
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
            {
              type: 'blob',
              blob: new Blob(['1']),
              size: 1,
              blobType: '',
            },
            {
              type: 'code',
              text: 'attr8: ',
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
            {
              type: 'message',
              content: [
                {
                  type: 'plain',
                  text: '8',
                },
              ],
              kwargs: [
                {
                  type: 'code',
                  text: '',
                  language: 'encre-code',
                  keywords: [],
                  isHoldingValues: false,
                },
              ],
              role: 'human',
              name: undefined,
            },
            {
              type: 'message',
              content: [
                {
                  type: 'plain',
                  text: '9',
                },
              ],
              kwargs: [
                {
                  type: 'code',
                  text: '',
                  language: 'encre-code',
                  keywords: [],
                  isHoldingValues: false,
                },
              ],
              role: 'assistant',
              name: undefined,
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
