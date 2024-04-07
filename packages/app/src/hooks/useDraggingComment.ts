import { useCallback } from 'react';

import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { produce } from 'immer';
import { useRecoilState, useRecoilValue } from 'recoil';

import { canvasPositionState } from '../state/canvas';
import {
  commentMapState,
  commentsState,
  draggingCommentsState,
  isDraggingCommentsOnlyState,
  isDraggingMultipleCommentsState,
  selectingCommentIdsState,
} from '../state/comment';
import {
  draggingNodesInCommentsState,
  nodeMapState,
  nodesState,
} from '../state/node';
import { GraphComment, Node } from '../types/studio.type';
import { isNotNull } from '../utils/safeTypes';

export function useDraggingComment(
  onCommentsChange: (cs: GraphComment[]) => void,
  onNodesChange: (ns: Node[]) => void,
) {
  const isDraggingMultipleComments = useRecoilValue(
    isDraggingMultipleCommentsState,
  );
  const isDraggingCommentsOnly = useRecoilValue(isDraggingCommentsOnlyState);
  const [selectingCommentIds, setSelectingCommentIds] = useRecoilState(
    selectingCommentIdsState,
  );
  const comments = useRecoilValue(commentsState);
  const commentMap = useRecoilValue(commentMapState);
  const nodes = useRecoilValue(nodesState);
  const nodeMap = useRecoilValue(nodeMapState);
  const canvasPosition = useRecoilValue(canvasPositionState);

  const [draggingComments, setDraggingComments] = useRecoilState(
    draggingCommentsState,
  );
  const [draggingNodes, setDraggingNodes] = useRecoilState(
    draggingNodesInCommentsState,
  );

  const onCommentStartDrag = useCallback(
    (e: DragStartEvent) => {
      const draggingCommentId: string = (e.active.id as string).replace(
        'comment-',
        '',
      );

      const commentsToDrag: GraphComment[] =
        isDraggingMultipleComments && selectingCommentIds.length > 0
          ? [...new Set([...selectingCommentIds, draggingCommentId])]
              .map((id) => commentMap[id])
              .filter(isNotNull)
          : [commentMap[draggingCommentId]].filter(isNotNull);
      const commentIdsToDrag: string[] =
        isDraggingMultipleComments && selectingCommentIds.length > 0
          ? [...selectingCommentIds, draggingCommentId]
          : [draggingCommentId];
      const associatedCommentIds: string[] = [];

      comments.forEach((c) => {
        const isSurrounding: boolean = commentsToDrag.some((comment) => {
          const topLeftInside =
            c.visualInfo.position.x >= comment.visualInfo.position.x &&
            c.visualInfo.position.y >= comment.visualInfo.position.y;
          const topRightInside =
            c.visualInfo.position.x + c.visualInfo.size.width <=
              comment.visualInfo.position.x + comment.visualInfo.size.width &&
            c.visualInfo.position.y >= comment.visualInfo.position.y;
          const bottomLeftInside =
            c.visualInfo.position.x >= comment.visualInfo.position.x &&
            c.visualInfo.position.y + c.visualInfo.size.height <=
              comment.visualInfo.position.y + comment.visualInfo.size.height;
          const bottomRightInside =
            c.visualInfo.position.x + c.visualInfo.size.width <=
              comment.visualInfo.position.x + comment.visualInfo.size.width &&
            c.visualInfo.position.y + c.visualInfo.size.height <=
              comment.visualInfo.position.y + comment.visualInfo.size.height;

          return (
            topLeftInside &&
            topRightInside &&
            bottomLeftInside &&
            bottomRightInside
          );
        });

        if (
          isSurrounding &&
          !commentIdsToDrag.includes(c.id) &&
          !associatedCommentIds.includes(c.id) &&
          isNotNull(commentMap[c.id])
        ) {
          commentsToDrag.push(c);
          associatedCommentIds.push(c.id);
        }
      });

      setDraggingComments(commentsToDrag);
      setSelectingCommentIds(
        isDraggingMultipleComments
          ? [
              ...new Set([
                ...selectingCommentIds,
                ...commentIdsToDrag,
                draggingCommentId,
              ]),
            ]
          : [...new Set([...commentIdsToDrag, draggingCommentId])],
      );

      const maxZIndexInComments: number = comments.reduce((maxVal, comment) => {
        const zIndex: number =
          comment.visualInfo.position.zIndex &&
          !Number.isNaN(comment.visualInfo.position.zIndex)
            ? comment.visualInfo.position.zIndex
            : 0;

        return Math.max(maxVal, zIndex);
      }, 0);

      onCommentsChange(
        comments.map((comment): GraphComment => {
          const isDragging: boolean = commentIdsToDrag.includes(comment.id);
          const isAssociated: boolean = associatedCommentIds.includes(
            comment.id,
          );

          return isDragging || isAssociated
            ? {
                ...comment,
                visualInfo: {
                  ...comment.visualInfo,
                  position: {
                    ...comment.visualInfo.position,
                    zIndex: maxZIndexInComments + (isAssociated ? 2 : 1),
                  },
                },
              }
            : comment;
        }),
      );

      if (!isDraggingCommentsOnly) {
        const nodesToDragInComments: Node[] = [];
        const nodeIdsToDragInComments: string[] = [];
        nodes.forEach((node) => {
          const intersects: boolean = commentsToDrag.some(
            (comment) =>
              !(
                node.visualInfo.position.x + node.visualInfo.size.width <
                  comment.visualInfo.position.x ||
                comment.visualInfo.position.x + comment.visualInfo.size.width <
                  node.visualInfo.position.x ||
                node.visualInfo.position.y + node.visualInfo.size.height <
                  comment.visualInfo.position.y ||
                comment.visualInfo.position.y + comment.visualInfo.size.height <
                  node.visualInfo.position.y
              ),
          );

          if (
            intersects &&
            !nodeIdsToDragInComments.includes(node.id) &&
            isNotNull(nodeMap[node.id])
          ) {
            nodesToDragInComments.push(node);
            nodeIdsToDragInComments.push(node.id);
          }
        });

        setDraggingNodes(nodesToDragInComments);

        const maxZIndexInNodes: number = nodes.reduce((maxVal, node) => {
          const zIndex: number =
            node.visualInfo.position.zIndex &&
            !Number.isNaN(node.visualInfo.position.zIndex)
              ? node.visualInfo.position.zIndex
              : 0;

          return Math.max(maxVal, zIndex);
        }, 0);

        onNodesChange(
          nodes.map((node): Node => {
            const isDragging: boolean = nodesToDragInComments.some(
              (n) => node.id === n.id,
            );

            return isDragging
              ? {
                  ...node,
                  visualInfo: {
                    ...node.visualInfo,
                    position: {
                      ...node.visualInfo.position,
                      zIndex: maxZIndexInNodes + 1,
                    },
                  },
                }
              : node;
          }),
        );
      }
    },
    [
      isDraggingMultipleComments,
      isDraggingCommentsOnly,
      selectingCommentIds,
      nodes,
      nodeMap,
      comments,
      commentMap,
      setSelectingCommentIds,
      setDraggingComments,
      setDraggingNodes,
      onCommentsChange,
      onNodesChange,
    ],
  );

  const onCommentEndDrag = useCallback(
    (e: DragEndEvent) => {
      if (draggingComments.length === 0) return;

      const draggingCommentIds: string[] = draggingComments.map(
        (comment) => comment.id,
      );
      const draggingNodeIds: string[] = draggingNodes.map((node) => node.id);

      const delta = {
        x: e.delta.x / canvasPosition.zoom,
        y: e.delta.y / canvasPosition.zoom,
      };

      setDraggingNodes([]);
      setDraggingComments([]);

      onCommentsChange(
        produce(comments, (draft) => {
          for (const commentId of draggingCommentIds) {
            const commentToChange = draft.find((c) => c.id === commentId);

            if (commentToChange) {
              commentToChange.visualInfo.position.x += delta.x;
              commentToChange.visualInfo.position.y += delta.y;
            }
          }
        }),
      );

      onNodesChange(
        produce(nodes, (draft) => {
          for (const nodeId of draggingNodeIds) {
            const nodeToChange = draft.find((n) => n.id === nodeId);

            if (nodeToChange) {
              nodeToChange.visualInfo.position.x += delta.x;
              nodeToChange.visualInfo.position.y += delta.y;
            }
          }
        }),
      );
    },
    [
      nodes,
      comments,
      draggingNodes,
      draggingComments,
      canvasPosition.zoom,
      setDraggingNodes,
      setDraggingComments,
      onCommentsChange,
      onNodesChange,
    ],
  );

  return {
    draggingComments,
    draggingNodes,
    onCommentStartDrag,
    onCommentEndDrag,
  };
}
