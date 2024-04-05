import React, { FC } from 'react';

import { useDraggable } from '@dnd-kit/core';
import { ErrorBoundary } from 'react-error-boundary';
import { useRecoilValue } from 'recoil';

import { VisualNode } from './VisualNode';
import { useStableCallback } from '../hooks/useStableCallback';
import { isOnlyDraggingCanvasState } from '../state/canvas';
import { DraggableNodeProps } from '../types/node.type';

export const DraggableNode: FC<DraggableNodeProps> = ({
  node,
  connections = [],
  canvasZoom,
  isMinimized,
  isSelecting = false,
  isPinning,
  onNodeSizeChange,
  onNodeSelect,
  onNodeMouseOver,
  onNodeMouseOut,
  onWireStartDrag,
  onWireEndDrag,
}: DraggableNodeProps) => {
  const isOnlyDraggingCanvas = useRecoilValue(isOnlyDraggingCanvasState);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: node.id, disabled: isOnlyDraggingCanvas || isPinning });

  return (
    <ErrorBoundary
      fallback={<div>There is something wrong in VisualNode...</div>}
    >
      <VisualNode
        ref={setNodeRef}
        node={node}
        connections={connections}
        xDelta={transform ? transform.x / canvasZoom : 0}
        yDelta={transform ? transform.y / canvasZoom : 0}
        attributes={attributes}
        attributeListeners={listeners}
        isDragging={isDragging}
        isMinimized={isMinimized}
        isSelecting={isSelecting}
        isPinning={isPinning}
        canvasZoom={canvasZoom}
        onNodeSizeChange={useStableCallback(
          (width, height) => onNodeSizeChange?.(node, width, height),
        )}
        onNodeSelect={useStableCallback(() => onNodeSelect?.(node))}
        onNodeMouseOver={onNodeMouseOver}
        onNodeMouseOut={onNodeMouseOut}
        onWireStartDrag={onWireStartDrag}
        onWireEndDrag={onWireEndDrag}
      />
    </ErrorBoundary>
  );
};
