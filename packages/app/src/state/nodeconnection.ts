import { NodeConnection } from '@encrejs/core/studio/nodes';
import { DefaultValue, selector } from 'recoil';

import { graphState } from './graph';
import { NodeGraph } from '../types/graph.type';
import { RecordId } from '../types/studio.type';

export const connectionsState = selector<NodeConnection[]>({
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

export const connectionMapState = selector<Record<RecordId, NodeConnection[]>>({
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
      {} as Record<RecordId, NodeConnection[]>,
    );
  },
});
