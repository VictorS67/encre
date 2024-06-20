import { useCallback } from 'react';

import { useRecoilValue, useSetRecoilState } from 'recoil';

import {
  nodeVisualContentDataMapState,
  updateNodeVisualContentDataState,
} from '../state/node';
import { RecordId } from '../types/studio.type';

export function useChangeNodeVisualContent() {
  const nodeVisualContentDataMap = useRecoilValue(
    nodeVisualContentDataMapState,
  );
  const updateNodeVisualContentData = useSetRecoilState(
    updateNodeVisualContentDataState,
  );

  const updateNodeColor = useCallback(
    (nodeId: RecordId, color: string) => {
      const nodeVisualContentData = nodeVisualContentDataMap[nodeId];

      updateNodeVisualContentData({
        id: nodeId,
        nodeVisualContentData: {
          ...nodeVisualContentData,
          color: color as any,
        },
      });
    },
    [updateNodeVisualContentData, nodeVisualContentDataMap],
  );

  return {
    updateNodeColor,
  };
}
