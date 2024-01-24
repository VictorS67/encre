import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

import { NodeGraph } from '../types/graph.type';

const { persistAtom } = recoilPersist({ key: 'graph' });

export const graphState = atom<NodeGraph>({
  key: 'graph',
  default: {
    nodes: [
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
            height: 175,
          },
        },
      },
    ],
    connections: [],
  },
  effects: [persistAtom],
});
