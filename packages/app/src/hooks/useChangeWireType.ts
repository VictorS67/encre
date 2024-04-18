import { useCallback } from 'react';

import { useSetRecoilState } from 'recoil';

import { defaultWireOptions } from './useDraggingWire';
import { updateWireDataState } from '../state/wire';
import { WireData, WireType } from '../types/wire.type';

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
