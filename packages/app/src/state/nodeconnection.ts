import { DefaultValue, selector } from 'recoil';

import { graphState } from './graph';
import { NodeGraph } from '../types/graph.type';
import { NodeConnection } from '../types/studio.type';

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

export const connectionMapState = selector({
  key: 'connectionMapState',
  get: ({ get }) => {
    return get(connectionsState).reduce(
      (acc, connection) => {
        acc[connection.inputNodeId] ??= [];
        acc[connection.inputNodeId]!.push(connection);

        acc[connection.outputNodeId] ??= [];
        acc[connection.outputNodeId]!.push(connection);

        return acc;
      },
      {} as Record<string, NodeConnection[]>,
    );
  },
});
