import { atom } from 'recoil';

import { DraggingWireClosestPort } from '../types/port.type';
import { NodeInputPortDef } from '../types/studio.type';
import { DraggingWire } from '../types/wire.type';

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
