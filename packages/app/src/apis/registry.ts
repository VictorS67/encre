import { useCallback } from 'react';

import { useSetRecoilState } from 'recoil';

import { send } from 'internal/src/fetch';

import { updateNodeTypePairsState } from '../state/contextmenu';
import { BuiltInNodeTypePairs } from '../types/studio.type';

export function useUpdateNodeBuiltInTypePairs() {
  const updateNodeTypePairs = useSetRecoilState(updateNodeTypePairsState);

  const updateNodeBuiltInTypePairs = useCallback(async () => {
    let nodeTypePairs = await send('get-registry-nodes-type-pairs');

    if (nodeTypePairs.error) {
      nodeTypePairs = {} as BuiltInNodeTypePairs;
    }

    console.log(`update node Type Pairs to: ${JSON.stringify(nodeTypePairs)}`);

    updateNodeTypePairs(nodeTypePairs);

    return nodeTypePairs;
  }, [updateNodeTypePairs]);

  return { updateNodeBuiltInTypePairs };
}
