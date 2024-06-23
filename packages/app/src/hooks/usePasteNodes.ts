import { produce } from 'immer';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { useCanvasPosition } from './useCanvasPosition';
import { clipboardState } from '../state/clipboard';
import { nodesState, selectingNodeIdsState } from '../state/node';
import { connectionsState } from '../state/nodeconnection';
import {
  RecordId,
  // getRecordId,
  NodeConnection,
  NodeInputPortDef,
  NodeOutputPortDef,
} from '../types/studio.type';
import { fakeId } from '../utils/fakeId';
import { isNotNull } from '../utils/safeTypes';

export function usePasteNodes() {
  const clipboard = useRecoilValue(clipboardState);
  const [nodes, setNodes] = useRecoilState(nodesState);
  const setSelectingNodeIds = useSetRecoilState(selectingNodeIdsState);
  const setConnections = useSetRecoilState(connectionsState);

  const { clientToCanvasPosition } = useCanvasPosition();

  const pasteNodes = (mousePosition: { x: number; y: number }) => {
    if (clipboard?.type !== 'nodes') {
      return;
    }

    console.log(
      `paste: clipboard: nodes: ${JSON.stringify(
        clipboard.nodes,
      )}, connections: ${JSON.stringify(clipboard.connections)}`,
    );

    const canvasPosition = clientToCanvasPosition(
      mousePosition.x,
      mousePosition.y,
    );

    const boundingBoxOfCopiedNodes = clipboard.nodes.reduce(
      (acc, node) => {
        return {
          minX: Math.min(acc.minX, node.visualInfo.position.x),
          minY: Math.min(acc.minY, node.visualInfo.position.y),
          maxX: Math.max(
            acc.maxX,
            node.visualInfo.position.x + (node.visualInfo.size.width ?? 200),
          ),
          maxY: Math.max(
            acc.maxY,
            node.visualInfo.position.y + (node.visualInfo.size.height ?? 200),
          ),
        };
      },
      {
        minX: Number.MAX_SAFE_INTEGER,
        minY: Number.MAX_SAFE_INTEGER,
        maxX: Number.MIN_SAFE_INTEGER,
        maxY: Number.MIN_SAFE_INTEGER,
      },
    );

    const oldNewNodeIdMap: Record<RecordId, RecordId> = {};

    const newNodes = clipboard.nodes.map((node) => {
      return produce(node, (draft) => {
        const newNodeId = fakeId(17) as RecordId;
        oldNewNodeIdMap[node.id] = newNodeId;

        draft.id = newNodeId;

        // Move the bounding box of all the copied nodes,
        // align the top-left with the mouse position
        draft.visualInfo.position.x =
          canvasPosition.x +
          (node.visualInfo.position.x - boundingBoxOfCopiedNodes.minX);
        draft.visualInfo.position.y =
          canvasPosition.y +
          (node.visualInfo.position.y - boundingBoxOfCopiedNodes.minY);
      });
    });

    console.log(`paste: newNodes: ${JSON.stringify(newNodes)}`);

    setNodes((ns) => [...ns, ...newNodes]);
    setSelectingNodeIds(newNodes.map((node) => node.id));

    const newConnections: NodeConnection[] = clipboard.connections
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

    setConnections((connections) => [...connections, ...newConnections]);
  };

  return pasteNodes;
}
