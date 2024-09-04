import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import {
  nodeBodyMapState,
  nodeIODefState,
  nodeMapState,
  nodesState,
  selectingNodeIdsState,
  updateNodeBodyState,
  updateNodeIODefState,
} from '../state/node';
import { connectionsState } from '../state/nodeconnection';
import {
  RecordId,
  Node,
  NodeConnection,
  NodeInputPortDef,
  NodeOutputPortDef,
  // getRecordId,
} from '../types/studio.type';
import { fakeId } from '../utils/fakeId';
import { isNotNull } from '../utils/safeTypes';

export function useDuplicateNodes() {
  const nodes = useRecoilValue(nodesState);
  const nodeMap = useRecoilValue(nodeMapState);
  const nodeIODef = useRecoilValue(nodeIODefState);
  const nodeBodyMap = useRecoilValue(nodeBodyMapState);
  const setNodes = useSetRecoilState(nodesState);
  const updateNodeBody = useSetRecoilState(updateNodeBodyState);
  const updateNodeIODef = useSetRecoilState(updateNodeIODefState);
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

        const newNodeId: RecordId = fakeId(17) as RecordId;
        oldNewNodeIdMap[nId] = newNodeId;

        const newNode: Node = JSON.parse(JSON.stringify(node));

        newNode.id = newNodeId;
        newNode.visualInfo.position = {
          ...newNode.visualInfo.position,
          x: newNode.visualInfo.position.x + 30,
          y: newNode.visualInfo.position.y + 30,
        };

        updateNodeBody({ id: newNodeId, nodeBody: nodeBodyMap[nId] });
        updateNodeIODef({ id: newNodeId, io: nodeIODef[nId] });

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
