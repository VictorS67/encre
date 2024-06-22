import {
  SerializableNode as Node,
  NodeConnection,
  NodeInputPortDef,
  NodeOutputPortDef,
} from '@encrejs/core';
import { globalNodeRegistry } from '@encrejs/core';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { nodeMapState, nodesState, selectingNodeIdsState } from '../state/node';
import { connectionsState } from '../state/nodeconnection';
// import { fakeId } from '../utils/fakeId';
import { RecordId } from '../types/studio.type';
import { isNotNull } from '../utils/safeTypes';

export function useDuplicateNodes() {
  const nodes = useRecoilValue(nodesState);
  const nodeMap = useRecoilValue(nodeMapState);
  const setNodes = useSetRecoilState(nodesState);
  const [connections, setConnections] = useRecoilState(connectionsState);
  const [selectingNodeIds, setSelectingNodeIds] = useRecoilState(
    selectingNodeIdsState,
  );

  return (nodeId: RecordId) => {
    // const node = nodeMap[nodeId];

    const nodeIds: RecordId[] = (
      selectingNodeIds.length > 0
        ? [...new Set([...selectingNodeIds, nodeId])]
        : [nodeId]
    ).filter(isNotNull);

    const oldNewNodeIdMap: Record<RecordId, RecordId> = {};
    const newNodes = nodeIds
      .map((nId) => {
        const node = nodeMap[nId];

        if (!node) {
          return;
        }

        const newNode: Node = globalNodeRegistry.createDynamic(
          node.type,
          node.subType,
          node.registerArgs,
        );

        return newNode;
      })
      .filter(isNotNull);

    setNodes((ns) => [...ns, ...newNodes]);
    setSelectingNodeIds(newNodes.map((node) => node.id));

    const innerNodeConnections = connections.filter(
      (c) => nodeIds.includes(c.fromNodeId) && nodeIds.includes(c.toNodeId),
    );

    const newNodeConnections: NodeConnection[] = innerNodeConnections
      .map((c) => {
        const fromNodeId = oldNewNodeIdMap[c.fromNodeId];
        const toNodeId = oldNewNodeIdMap[c.toNodeId];

        if (!fromNodeId || !toNodeId) {
          return undefined;
        }

        return {
          ...c,
          fromNodeId,
          toNodeId,
        };
      })
      .filter(isNotNull);

    setConnections((c) => [...c, ...newNodeConnections]);
  };
}
