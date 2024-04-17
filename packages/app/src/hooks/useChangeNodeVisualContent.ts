import { useCallback } from 'react';

import { useRecoilValue, useSetRecoilState } from 'recoil';

import {
  nodeVisualContentDataMapState,
  updateNodeVisualContentDataState,
} from '../state/node';

export function useChangeNodeVisualContent() {
  const nodeVisualContentDataMap = useRecoilValue(
    nodeVisualContentDataMapState,
  );
  const updateNodeVisualContentData = useSetRecoilState(
    updateNodeVisualContentDataState,
  );

  const updateNodeColor = useCallback(
    (nodeId: string, color: string) => {
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
