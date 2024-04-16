import { HTMLAttributes } from 'react';

import { ColorCache } from './canvas.type';
import { GraphComment } from './studio.type';

export type DraggableCommentProps = {
  comment: GraphComment;
  // commentColorCache: ColorCache;
  canvasZoom: number;
  isMinimized?: boolean;
  isSelecting?: boolean;
  onCommentSizeChange?: (
    comment: GraphComment,
    width: number,
    height: number,
  ) => void;
  // onCommentColorChange?: (comment: GraphComment, color: string) => void;
  onCommentContentChange?: (
    comment: GraphComment,
    content: GraphComment['visualInfo']['content'],
  ) => void;
  onCommentSelect?: (comment: GraphComment) => void;
};

export type VisualCommentProps = {
  comment: GraphComment;
  // commentColorCache: ColorCache;
  xDelta?: number;
  yDelta?: number;
  attributes?: HTMLAttributes<HTMLDivElement>;
  attributeListeners?: HTMLAttributes<HTMLDivElement>;
  isDragging?: boolean;
  isOverlay?: boolean;
  isMinimized?: boolean;
  isSelecting?: boolean;
  scale?: number;
  canvasZoom: number;
  onCommentSizeChange?: (width: number, height: number) => void;
  onCommentContentChange?: (
    content: GraphComment['visualInfo']['content'],
  ) => void;
  // onCommentColorChange?: (color: string) => void;
  onCommentSelect?: () => void;
};

export type VisualCommentContentProps = {
  comment: GraphComment;
  isMinimized?: boolean;
  canvasZoom: number;
  attributeListeners?: HTMLAttributes<HTMLDivElement>;
  onCommentSizeChange?: (width: number, height: number) => void;
};
