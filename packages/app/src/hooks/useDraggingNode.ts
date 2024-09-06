import { useCallback } from 'react';

import { DragEndEvent, DragMoveEvent, DragStartEvent } from '@dnd-kit/core';
import { produce } from 'immer';
import { useRecoilState, useRecoilValue } from 'recoil';

import {
  canvasPositionState,
  isDraggingMultipleNodesState,
  isOnlyDraggingCanvasState,
} from '../state/canvas';
import {
  draggingNodesState,
  nodeMapState,
  nodesState,
  selectingNodeIdsState,
} from '../state/node';
import { Node, RecordId } from '../types/studio.type';
import { isNotNull } from '../utils/safeTypes';

import { useStableCallback } from './useStableCallback';

export function useDraggingNode(onNodesChange: (ns: Node[]) => void) {
  const isDraggingMultipleNodes = useRecoilValue(isDraggingMultipleNodesState);
  const [selectingNodeIds, setSelectingNodeIds] = useRecoilState(
    selectingNodeIdsState,
  );
  const nodes = useRecoilValue(nodesState);
  const nodeMap = useRecoilValue(nodeMapState);
  const canvasPosition = useRecoilValue(canvasPositionState);

  const [draggingNodes, setDraggingNodes] = useRecoilState(draggingNodesState);

  const onNodeStartDrag = useCallback(
    (e: DragStartEvent) => {
      const draggingNodeId: RecordId = e.active.id as RecordId;

      const nodeIdsToDrag: RecordId[] =
        isDraggingMultipleNodes && selectingNodeIds.length > 0
          ? [...new Set([...selectingNodeIds, draggingNodeId])]
          : [draggingNodeId];

      const nodesToDrag: Node[] = nodeIdsToDrag
        .map((id) => nodeMap[id])
        .filter(isNotNull);

      setDraggingNodes(nodesToDrag);
      setSelectingNodeIds(nodeIdsToDrag);

      const maxZIndex: number = nodes.reduce((maxVal, node) => {
        const zIndex: number =
          node.visualInfo.position.zIndex &&
          !Number.isNaN(node.visualInfo.position.zIndex)
            ? node.visualInfo.position.zIndex
            : 0;

        return Math.max(maxVal, zIndex);
      }, 0);

      onNodesChange(
        nodes.map((node): Node => {
          const isDragging: boolean = nodeIdsToDrag.includes(node.id);

          return isDragging
            ? {
                ...node,
                visualInfo: {
                  ...node.visualInfo,
                  position: {
                    ...node.visualInfo.position,
                    zIndex: maxZIndex + 1,
                  },
                },
              }
            : node;
        }),
      );
    },
    [
      isDraggingMultipleNodes,
      selectingNodeIds,
      nodes,
      nodeMap,
      setSelectingNodeIds,
      setDraggingNodes,
      onNodesChange,
    ],
  );

  const onNodeEndDrag = useCallback(
    (e: DragEndEvent) => {
      if (draggingNodes.length === 0) return;

      const draggingNodeIds: string[] = draggingNodes.map((node) => node.id);

      const delta = {
        x: e.delta.x / canvasPosition.zoom,
        y: e.delta.y / canvasPosition.zoom,
      };

      setDraggingNodes([]);

      onNodesChange(
        produce(nodes, (draft) => {
          for (const nodeId of draggingNodeIds) {
            const nodeToChange = draft.find((n) => n.id === nodeId);

            if (nodeToChange) {
              console.log(
                `dragging nodes after: z-index: ${nodeToChange.visualInfo.position.zIndex}`,
              );

              nodeToChange.visualInfo.position.x += delta.x;
              nodeToChange.visualInfo.position.y += delta.y;
            }
          }
        }),
      );
    },
    [
      nodes,
      draggingNodes,
      canvasPosition.zoom,
      setDraggingNodes,
      onNodesChange,
    ],
  );

  return { draggingNodes, onNodeStartDrag, onNodeEndDrag };
}
