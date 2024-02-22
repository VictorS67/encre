import { DefaultValue, atom, selector } from 'recoil';

import { graphState } from './graph';
import { NodeGraph } from '../types/graph.type';
import { Node } from '../types/studio.type';

export const nodesState = selector({
  key: 'nodes',
  get: ({ get }) => {
    return get(graphState).nodes;
  },
  set: ({ set }, newVal) => {
    set(graphState, (oldVal: NodeGraph) => {
      return {
        ...oldVal,
        nodes: newVal instanceof DefaultValue ? [] : newVal,
      };
    });
  },
});

export const nodeMapState = selector({
  key: 'nodeMapState',
  get: ({ get }) => {
    return get(nodesState).reduce(
      (acc, node) => {
        acc[node.id] = node;
        return acc;
      },
      {} as Record<string, Node>,
    );
  },
});

export const selectingNodeIdsState = atom<string[]>({
  key: 'selectingNodeIdsState',
  default: [],
});

export const editingNodeIdState = atom<string | undefined>({
  key: 'selectingNodeIdState',
  default: undefined,
});

export const hoveringNodeIdState = atom<string | undefined>({
  key: 'hoveringNodeIdState',
  default: undefined,
});

export const draggingNodesState = atom<Node[]>({
  key: 'draggingNodesState',
  default: [],
});
