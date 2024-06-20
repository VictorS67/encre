import { useRecoilValue } from 'recoil';

import { ioDefFromNodeIdState } from '../state/node';
import { RecordId } from '../types/studio.type';

export function useNodeIO(nodeId: RecordId | undefined) {
  return useRecoilValue(ioDefFromNodeIdState(nodeId));
}
