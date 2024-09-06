import React, { FC, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { useDraggable } from '@dnd-kit/core';
import { useRecoilValue } from 'recoil';

import { useRandomColor } from '../hooks/useRandomColor';
import { useStableCallback } from '../hooks/useStableCallback';
import { isOnlyDraggingCanvasState } from '../state/canvas';
import { DraggableCommentProps } from '../types/comment.type';

import { VisualComment } from './VisualComment';

export const DraggableComment: FC<DraggableCommentProps> = ({
  comment,
  canvasZoom,
  isMinimized,
  isSelecting = false,
  onCommentSizeChange,
  onCommentContentChange,
  onCommentSelect,
}: DraggableCommentProps) => {
  const isOnlyDraggingCanvas = useRecoilValue(isOnlyDraggingCanvasState);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `comment-${comment.id}`,
      disabled: isOnlyDraggingCanvas,
    });

  return (
    <ErrorBoundary
      fallback={<div>There is something wrong in VisualComment...</div>}
    >
      <VisualComment
        ref={setNodeRef}
        comment={comment}
        xDelta={transform ? transform.x / canvasZoom : 0}
        yDelta={transform ? transform.y / canvasZoom : 0}
        attributes={attributes}
        attributeListeners={listeners}
        isDragging={isDragging}
        isMinimized={isMinimized}
        isSelecting={isSelecting}
        canvasZoom={canvasZoom}
        onCommentSizeChange={useStableCallback(
          (width, height) => onCommentSizeChange?.(comment, width, height),
        )}
        onCommentContentChange={useStableCallback(
          (content) => onCommentContentChange?.(comment, content),
        )}
        onCommentSelect={useStableCallback(() => onCommentSelect?.(comment))}
      />
    </ErrorBoundary>
  );
};
