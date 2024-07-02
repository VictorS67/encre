import { useCallback } from 'react';

import { useSetRecoilState } from 'recoil';

import { updateWireDataState } from '../state/wire';
import { WireData, WireType } from '../types/wire.type';

import { defaultWireOptions } from './useDraggingWire';

export function useChangeWireType() {
  const updateWireData = useSetRecoilState(updateWireDataState);

  return useCallback(
    (wireId: string, wireType: WireType) => {
      updateWireData({
        id: wireId,
        wireData: { wireType, wireOptions: defaultWireOptions[wireType] },
      });
    },
    [updateWireData],
  );
}
