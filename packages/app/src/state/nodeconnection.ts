import { DefaultValue, selector } from 'recoil';

import { graphState } from './graph';
import { NodeGraph } from '../types/graph.type';

export const connectionsState = selector({
  key: 'connections',
  get: ({ get }) => {
    return get(graphState).connections;
  },
  set: ({ set }, newVal) => {
    set(graphState, (oldVal: NodeGraph) => {
      return {
        ...oldVal,
        connections: newVal instanceof DefaultValue ? [] : newVal,
      };
    });
  },
});
