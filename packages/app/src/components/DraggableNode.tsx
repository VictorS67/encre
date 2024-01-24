import React, { FC } from 'react';

import { useDraggable } from '@dnd-kit/core';
import { ErrorBoundary } from 'react-error-boundary';

import { VisualNode } from './VisualNode';
import { DraggableNodeProps } from '../types/node.type';

export const DraggableNode: FC<DraggableNodeProps> = ({
  node,
  connections = [],
  canvasZoom,
  isMinimized,
  isSelecting = false,
  onNodeSizeChange,
  onNodeSelect,
  onNodeMouseOver,
  onNodeMouseOut,
}: DraggableNodeProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: node.id });

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
        onNodeSizeChange={(width, height) =>
          onNodeSizeChange?.(node, width, height)
        }
        onNodeSelect={() => onNodeSelect?.(node)}
        onNodeMouseOver={onNodeMouseOver}
        onNodeMouseOut={onNodeMouseOut}
      />
    </ErrorBoundary>
  );
};
