import { DefaultValue, atom, selector, selectorFamily } from 'recoil';

import { DraggingWireClosestPort } from '../types/port.type';
import { DraggingWire, WireData } from '../types/wire.type';

export const draggingWireState = atom<DraggingWire | undefined>({
  key: 'draggingWireState',
  default: undefined,
});

export const draggingWireClosestPortState = atom<
  DraggingWireClosestPort | undefined
>({
  key: 'draggingWireClosestPortState',
  default: undefined,
});

export const wireDataMapState = atom<Record<string, WireData>>({
  key: 'wireMapState',
  default: {},
});

export const selectingWireIdsState = atom<string[]>({
  key: 'selectingWireIdsState',
  default: [],
});

export const hoveringWireIdState = atom<string | undefined>({
  key: 'hoveringWireIdState',
  default: undefined,
});

export const hoveringWirePortIdState = atom<string | undefined>({
  key: 'hoveringWirePortIdState',
  default: undefined,
});

export const wireDataFromWireIdState = selectorFamily<
  WireData | undefined,
  string | undefined
>({
  key: 'wireDataFromWireIdState',
  get:
    (wireId: string | undefined) =>
    ({ get }) => {
      return wireId ? get(wireDataMapState)[wireId] : undefined;
    },
});

export const updateWireDataState = selector<{ id: string; wireData: WireData }>(
  {
    key: 'updateWireDataState',
    get: ({ get }) => {
      throw new Error(
        'updateWireDataState should only be used to update wire map',
      );
    },
    set: ({ set, get }, newVal) => {
      if (newVal instanceof DefaultValue) return;
      const id: string = newVal.id;
      const wireData: WireData = newVal.wireData;

      const currMap = get(wireDataMapState);
      const updatedMap = { ...currMap, [id]: wireData };
      set(wireDataMapState, updatedMap);
    },
  },
);

export const removeWireDataState = selector<string>({
  key: 'removeWireDataState',
  get: ({ get }) => {
    throw new Error(
      'removeWireDataState should only be used to remove wire from wire map',
    );
  },
  set: ({ set, get }, newVal) => {
    if (newVal instanceof DefaultValue) return;

    const id: string = newVal;
    const currMap = get(wireDataMapState);

    if (currMap[id]) {
      const updatedMap = { ...currMap };
      delete updatedMap[id];
      set(wireDataMapState, updatedMap);
    }
  },
});
