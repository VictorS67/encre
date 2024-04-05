import { produce } from 'immer';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { useCanvasPosition } from './useCanvasPosition';
import { clipboardState } from '../state/clipboard';
import { nodesState, selectingNodeIdsState } from '../state/node';
import { connectionsState } from '../state/nodeconnection';
import {
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

    const oldNewNodeIdMap: Record<string, string> = {};

    const newNodes = clipboard.nodes.map((node) => {
      return produce(node, (draft) => {
        // TODO: change this to generate a new random RecordId from core
        const newNodeId = fakeId(17);
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

        // TODO: we don't need this when the core is ready
        draft.getBody = node.getBody;
        const inputDefs: NodeInputPortDef[] = node.getInputPortDefs([], {});
        const outputDefs: NodeOutputPortDef[] = node.getOutputPortDefs([], {});
        draft.getInputPortDefs = function (
          cs: NodeConnection[],
          ns: Record<string, Node>,
        ): NodeInputPortDef[] {
          return inputDefs.map((def) => ({
            ...def,
            nodeId: newNodeId,
          }));
        } as any;
        draft.getOutputPortDefs = function (
          cs: NodeConnection[],
          ns: Record<string, Node>,
        ): NodeOutputPortDef[] {
          return outputDefs.map((def) => ({
            ...def,
            nodeId: newNodeId,
          }));
        } as any;
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
