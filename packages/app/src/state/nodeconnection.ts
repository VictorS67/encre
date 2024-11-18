import { DefaultValue, selector } from 'recoil';

import { NodeGraph } from '../types/graph.type';
import { NodeConnection } from '../types/studio.type';

import { graphState } from './graph';

export const connectionsState = selector({
  key: 'connections',
  get: ({ get }) => {
    return get(graphState).connections;
  },
  set: ({ set }, newVal: NodeConnection[] | DefaultValue) => {
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
        acc[connection.fromNodeId] ??= [];
        acc[connection.fromNodeId]!.push(connection);

        acc[connection.toNodeId] ??= [];
        acc[connection.toNodeId]!.push(connection);

        return acc;
      },
      {} as Record<string, NodeConnection[]>,
    );
  },
});
