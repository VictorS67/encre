import { HTMLAttributes } from 'react';

import { GraphComment } from './studio.type';

export type DraggableCommentProps = {
  comment: GraphComment;
  commentColorCache: CommentColorCache;
  canvasZoom: number;
  isMinimized?: boolean;
  isSelecting?: boolean;
  onCommentSizeChange?: (
    comment: GraphComment,
    width: number,
    height: number,
  ) => void;
  onCommentColorChange?: (comment: GraphComment, color: string) => void;
  onCommentSelect?: (comment: GraphComment) => void;
};

export type VisualCommentProps = {
  comment: GraphComment;
  commentColorCache: CommentColorCache;
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
  onCommentColorChange?: (color: string) => void;
  onCommentSelect?: () => void;
};

export type VisualCommentContentProps = {
  comment: GraphComment;
  isMinimized?: boolean;
  canvasZoom: number;
  attributeListeners?: HTMLAttributes<HTMLDivElement>;
  onCommentSizeChange?: (width: number, height: number) => void;
};

export interface CommentColorCache {
  get: (commentId: string) => string;

  has: (commentId: string) => boolean;

  set: (commentId: string, color: string) => void;
}
