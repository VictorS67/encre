import { useRecoilValue, useSetRecoilState } from 'recoil';

import { clipboardState } from '../state/clipboard';
import { nodeMapState, selectingNodeIdsState } from '../state/node';
import { connectionsState } from '../state/nodeconnection';
import { RecordId } from '../types/studio.type';
import { isNotNull } from '../utils/safeTypes';

export function useCopyNodes() {
  const selectingNodeIds = useRecoilValue(selectingNodeIdsState);
  const nodeMap = useRecoilValue(nodeMapState);
  const connections = useRecoilValue(connectionsState);
  const setClipboard = useSetRecoilState(clipboardState);

  return (additionalNodeId?: RecordId) => {
    const nodeIds = (
      selectingNodeIds.length > 0
        ? [...new Set([...selectingNodeIds, additionalNodeId])]
        : [additionalNodeId]
    ).filter(isNotNull);

    const copiedConnections = connections.filter(
      (c) => nodeIds.includes(c.fromNodeId) && nodeIds.includes(c.toNodeId),
    );

    setClipboard({
      type: 'nodes',
      nodes: nodeIds.map((id) => nodeMap[id]).filter(isNotNull),
      connections: copiedConnections,
    });
  };
}
