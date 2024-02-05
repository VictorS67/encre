import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

import { NodeGraph } from '../types/graph.type';

const { persistAtom } = recoilPersist({ key: 'graph' });

export const graphState = atom<NodeGraph>({
  key: 'graph',
  default: {
    nodes: [
      // TODO: remove this
      {
        id: '1',
        state: 'init',
        isDebug: false,
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
        metadata: {
          name: 'StringPrompt',
          abbreviation: 'SP',
          tags: ['chat'],
          inputs: ['input'],
          outputs: ['output'],
          options: ['a', 'b']
        },
        data: {
          inputs: {
            input: {
              type: 'string',
              value: 'xx'
            }
          },
          outputs: {
            output: {
              type: 'string',
              value: 'yy'
            }
          },
          
        }
        type: 'text',
        content:
          'Imagine a futuristic city where buildings are made of a shimmering, translucent material, and the streets are bustling with people and various types of vehicles, some of which float above the ground. The sky is dotted with drones and the occasional glimpse of a green park or garden can be seen between the structures. In the foreground, a diverse group of individuals is gathered around a holographic display, engaged in a lively discussion. The scene is set during the evening, with the city lights casting a warm glow over everything.',
      },
    ],
    connections: [],
  },
  effects: [persistAtom],
});
