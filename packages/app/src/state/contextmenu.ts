import { atom, DefaultValue, selector } from 'recoil';

import { BuiltInNodeTypePairs } from '../types/studio.type';

export const showContextMenuState = atom<boolean>({
  key: 'showContextMenuState',
  default: false,
});

export const nodeTypePairsState = atom<BuiltInNodeTypePairs>({
  key: 'nodeTypePairsState',
  default: {} as BuiltInNodeTypePairs,
});

export const updateNodeTypePairsState = selector<BuiltInNodeTypePairs>({
  key: 'updateNodeTypePairsState',
  get: ({ get }) => {
    throw new Error('updateNodeTypePairsState should only be used to update');
  },
  set: ({ set, get }, newVal) => {
    if (newVal instanceof DefaultValue) return;

    const currMap = get(nodeTypePairsState);
    const updatedMap = { ...currMap, ...newVal };
    set(nodeTypePairsState, updatedMap);
  },
});
