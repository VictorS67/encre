import React, {
  CSSProperties,
  FC,
  ForwardedRef,
  forwardRef,
  memo,
  useEffect,
  useMemo,
  useState,
} from 'react';

import styled from '@emotion/styled';
import clsx from 'clsx';
import { ErrorBoundary } from 'react-error-boundary';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { CommentContentBody } from './CommentContentBody';
import { ResizeBox } from './ResizeBox';
import { useCanvasPosition } from '../hooks/useCanvasPosition';
import { useRandomColor } from '../hooks/useRandomColor';
import { useStableCallback } from '../hooks/useStableCallback';
import { isOnlyDraggingCanvasState } from '../state/canvas';
import {
  commentContentFromCommentIdState,
  commentContentMapState,
  updateCommentContentState,
} from '../state/comment';
import {
  VisualCommentContentProps,
  VisualCommentProps,
} from '../types/comment.type';
import { GraphComment } from '../types/studio.type';

const VisualCommentContainer = styled.div`
  border-radius: 7px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  position: absolute;
  transition-timing-function: ease-out;
  transition-property: box-shadow, border-color;
  transform-origin: top left;

  &.selected::before {
    content: '';
    position: absolute;
    top: -8px;
    left: -8px;
    right: -8px;
    bottom: -8px;
    border: 2px solid var(--text-disabled-color);
    border-radius: calc(7px + 8px - 3px - 2px);
    box-sizing: border-box;
    z-index: -1;
  }

  .resize-box {
    width: 10px;
    height: 10px;
    cursor: nw-resize;
    position: absolute;
    right: 0;
    bottom: 0;
    border-top-left-radius: 10px;
    border-bottom-right-radius: calc(7px - 3px);
    background-color: var(--canvas-foreground-color-1);
  }
`;

const CommentContentContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  .comment-minimize-card,
  .comment-card {
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: flex-start;
    align-self: stretch;
    width: 100%;
    // margin: 8px 10px;
    transition: all 100ms ease-out;
  }

  .comment-card-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    align-self: stretch;
    gap: 5px;
    position: relative;
  }

  .comment-card-dragging-area {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }

  .comment-title-container {
    align-self: strech;
    color: var(--text-color);
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    display: grid;
    user-select: none;
    padding: 8px 10px;
  }

  .comment-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    hyphens: auto;
    flex-grow: 1;
    min-width: 0;
  }

  .comment-description {
    font-size: 11px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    hyphens: auto;
    flex-grow: 1;
    min-width: 0;
  }

  .comment-minimize-card > .comment-title-container > .comment-description {
    visibility: collapse;
  }

  .comment-minimize-card > .comment-title-container {
    width: 100%;
    text-align: center;
  }

  .comment-minimize-content,
  .comment-content {
    overflow-y: hidden;
    gap: 2px;
    padding: 8px 4px 8px 7px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-self: stretch;
    color: var(--text-color);
    font-size: 14px;
    line-height: 1.4;
  }

  .comment-minimize-content > * {
    visibility: hidden;
    align-self: stretch;
  }

  .comment-content-body {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
`;

/* eslint-disable react/prop-types */
export const VisualComment = memo(
  forwardRef<HTMLDivElement, VisualCommentProps>(function MyVisualNode(
    {
      comment,
      // commentColorCache,
      xDelta = 0,
      yDelta = 0,
      attributes,
      attributeListeners,
      isDragging,
      isSelecting,
      isOverlay,
      isMinimized,
      scale,
      canvasZoom,
      onCommentSizeChange,
      // onCommentColorChange,
      onCommentContentChange,
      onCommentSelect,
    }: VisualCommentProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) {
    const isOnlyDraggingCanvas = useRecoilValue(isOnlyDraggingCanvasState);
    const { pickRandomCommentColor } = useRandomColor();
    const commentContent = useRecoilValue(
      commentContentFromCommentIdState(comment.id),
    );
    const updateCommentContent = useSetRecoilState(updateCommentContentState);
    const [content, setContent] = useState<
      GraphComment['visualInfo']['content']
    >({});

    useEffect(() => {
      let shouldUpdate = false;
      let tempContent: GraphComment['visualInfo']['content'] = {};
      if (commentContent) {
        if (
          !commentContent.color ||
          comment.visualInfo.content?.color !== commentContent.color
        ) {
          tempContent.color =
            comment.visualInfo.content?.color ??
            (pickRandomCommentColor() as any);

          shouldUpdate = true;
        } else {
          tempContent.color = commentContent.color;
        }

        if (
          !commentContent.horitontal ||
          comment.visualInfo.content?.horitontal !== commentContent.horitontal
        ) {
          tempContent.horitontal =
            comment.visualInfo.content?.horitontal ?? 'start';

          shouldUpdate = true;
        } else {
          tempContent.horitontal = commentContent.horitontal;
        }

        if (
          !commentContent.vertical ||
          comment.visualInfo.content?.vertical !== commentContent.vertical
        ) {
          tempContent.vertical =
            comment.visualInfo.content?.vertical ?? 'start';

          shouldUpdate = true;
        } else {
          tempContent.vertical = commentContent.vertical;
        }
      } else {
        tempContent = {
          color:
            comment.visualInfo.content?.color ??
            (pickRandomCommentColor() as any),
          horitontal: comment.visualInfo.content?.horitontal ?? 'start',
          vertical: comment.visualInfo.content?.vertical ?? 'start',
        };

        shouldUpdate = true;
      }

      if (shouldUpdate) {
        onCommentContentChange?.(tempContent);
        updateCommentContent({ id: comment.id, commentContent: tempContent });
      }

      setContent(tempContent);
      // commentColorCache.set(comment.id, tempContent.color as any);
    }, [
      commentContent,
      comment.visualInfo.content?.color,
      comment.visualInfo.content?.horitontal,
      comment.visualInfo.content?.vertical,
      pickRandomCommentColor,
      // commentColorCache,
    ]);

    const style = useMemo(() => {
      // const color = commentColorCache.has(comment.id)
      //   ? commentColorCache.get(comment.id)
      //   : content?.color ?? 'yellow';

      const color =
        content?.color ?? comment.visualInfo.content?.color ?? 'yellow';

      const styling: CSSProperties = {
        opacity: isDragging ? '0' : '',
        transform: `translate(${comment.visualInfo.position.x + xDelta}px, ${
          comment.visualInfo.position.y + yDelta
        }px) scale(${scale ?? 1})`,
        zIndex: comment.visualInfo.position.zIndex ?? 0,
        width: comment.visualInfo.size.width,
        height: comment.visualInfo.size.height,
        backgroundColor: `var(--comment-background-${color}-color)`,
        border: `3px solid var(--comment-border-${color}-color)`,
      };

      return styling;
    }, [
      comment.visualInfo.position.x,
      comment.visualInfo.position.y,
      xDelta,
      yDelta,
      comment.visualInfo.size.width,
      comment.visualInfo.size.height,
      comment.visualInfo.position.zIndex,
      comment.visualInfo.content?.color,
      // commentColorCache,
      content,
      isDragging,
      scale,
    ]);

    // abstract away the difference between function and object refs.
    const commentRef = (instance: HTMLDivElement | null) => {
      if (typeof ref === 'function') {
        // refs are created by a callback function.
        ref(instance);
      } else if (ref) {
        // refs are created by `React.createRef()`.
        ref.current = instance;
      }
    };

    const onCommentGrabClick = useStableCallback((event: React.MouseEvent) => {
      if (isOnlyDraggingCanvas) return;

      event.stopPropagation();
      onCommentSelect?.();
    });

    return (
      <VisualCommentContainer
        className={clsx('comment', {
          dragged: isDragging,
          selected: isSelecting,
          overlayed: isOverlay,
          minimized: isMinimized,
        })}
        ref={commentRef}
        // color={content?.color ?? "yellow"}
        style={style}
        {...attributes}
        data-commentid={comment.id}
        data-contextmenutype={'comment'}
        onClick={onCommentGrabClick}
      >
        <VisualCommentContent
          comment={comment}
          isMinimized={isMinimized}
          canvasZoom={canvasZoom}
          attributeListeners={attributeListeners}
          onCommentSizeChange={onCommentSizeChange}
        />
      </VisualCommentContainer>
    );
  }),
);

/* eslint-disable react/prop-types */
const VisualCommentContent: FC<VisualCommentContentProps> = memo(
  ({
    comment,
    isMinimized,
    canvasZoom,
    attributeListeners,
    onCommentSizeChange,
  }: VisualCommentContentProps) => {
    const [commentWidth, setCommentWidth] = useState<number>(500);
    const [commentHeight, setCommentHeight] = useState<number>(500);
    const [startHeight, setStartHeight] = useState<number | undefined>();
    const [startWidth, setStartWidth] = useState<number | undefined>();
    const [startMouseX, setStartMouseX] = useState(0);
    const [startMouseY, setStartMouseY] = useState(0);
    const { clientToCanvasPosition } = useCanvasPosition();

    const minTitleStyling = useMemo(() => {
      const titleStyling: CSSProperties = isMinimized
        ? {
            fontSize: `${32 * (canvasZoom + 0.4)}px`,
            height: 50,
          }
        : {
            fontSize: '24px',
          };

      return titleStyling;
    }, [canvasZoom, isMinimized]);

    const contentTextStyle = useMemo(() => {
      const vAlignMap = {
        center: 'center',
        start: 'flex-start',
        end: 'flex-end',
      };

      const vAlign = comment.visualInfo.content?.vertical ?? 'start';

      const styling: CSSProperties = {
        justifyContent: vAlignMap[vAlign],
      };

      return styling;
    }, [comment.visualInfo.content?.vertical]);

    const getCommentCurrentDimensions = (
      elementorChild: HTMLElement,
    ): [number, number] => {
      const commentElement: HTMLElement | null =
        elementorChild.closest('.comment');

      if (!commentElement) {
        return [commentWidth, commentHeight];
      }

      const cssWidth: string = window.getComputedStyle(commentElement).width;
      const cssHeight: string = window.getComputedStyle(commentElement).height;

      return [parseInt(cssWidth, 10), parseInt(cssHeight, 10)];
    };

    const onResizeStart = useStableCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const [width, height] = getCommentCurrentDimensions(
        e.target as HTMLElement,
      );

      setStartWidth(width);
      setStartHeight(height);
      setStartMouseX(e.clientX);
      setStartMouseY(e.clientY);
    });

    const onResizeMove = useStableCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const mousePositionInCanvas = clientToCanvasPosition(
        startMouseX,
        startMouseY,
      );
      const newMousePositionInCanvas = clientToCanvasPosition(
        e.clientX,
        e.clientY,
      );

      const deltaX: number =
        newMousePositionInCanvas.x - mousePositionInCanvas.x;
      const deltaY: number =
        newMousePositionInCanvas.y - mousePositionInCanvas.y;

      const newWidth: number | undefined = startWidth
        ? startWidth + deltaX
        : startWidth;
      const newHeight: number | undefined = startHeight
        ? startHeight + deltaY
        : startHeight;

      if (
        newWidth &&
        newHeight &&
        (newWidth !== startWidth || newHeight !== startHeight)
      ) {
        onCommentSizeChange?.(newWidth, newHeight);
        setCommentWidth(newWidth);
        setCommentHeight(newHeight);
      }
    });

    // TODO: add index (for example, comment id) on the top left of the comment.
    return (
      <CommentContentContainer>
        <div className="comment-card-dragging-area" {...attributeListeners}>
          {comment.title && (
            <div className="comment-card-info">
              <div
                className={
                  isMinimized ? 'comment-minimize-card' : 'comment-card'
                }
              >
                <div
                  className="comment-title-container"
                  style={minTitleStyling}
                >
                  <span className="comment-title">{comment.title}</span>
                  {comment.description && (
                    <span className="comment-description">
                      {comment.description}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div
            className={
              isMinimized ? 'comment-minimize-content' : 'comment-content'
            }
            style={contentTextStyle}
          >
            <ErrorBoundary
              fallback={
                <div>
                  Something wrong when rendering comment content body...
                </div>
              }
            >
              <CommentContentBody comment={comment} />
            </ErrorBoundary>
          </div>
        </div>
        <ResizeBox onResizeStart={onResizeStart} onResizeMove={onResizeMove} />
      </CommentContentContainer>
    );
  },
);

VisualCommentContent.displayName = 'VisualCommentContent';
