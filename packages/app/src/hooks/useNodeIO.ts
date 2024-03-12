import { useRecoilValue } from 'recoil';

import { ioDefFromNodeIdState } from '../state/node';

export function useNodeIO(nodeId: string | undefined) {
  return useRecoilValue(ioDefFromNodeIdState(nodeId));
}
