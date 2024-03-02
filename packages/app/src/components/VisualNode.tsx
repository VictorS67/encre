/** @jsxImportSource @emotion/react */
import React, {
  CSSProperties,
  FC,
  ForwardedRef,
  forwardRef,
  memo,
  useMemo,
  useState,
} from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import clsx from 'clsx';
import { ErrorBoundary } from 'react-error-boundary';
import { useRecoilValue } from 'recoil';

import { Icon } from './Icon';
import { NodeContentBody } from './NodeContentBody';
import { NodePortGroup } from './NodePortGroup';
import { ResizeBox } from './ResizeBox';
import { useCanvasPosition } from '../hooks/useCanvasPosition';
import { useStableCallback } from '../hooks/useStableCallback';
import { isOnlyDraggingCanvasState } from '../state/canvas';
import { themeState } from '../state/settings';
import {
  MinimizedVisualNodeContentProps,
  VisualNodeContentProps,
  VisualNodeProps,
} from '../types/node.type';
import { getColorMode } from '../utils/colorMode';

const VisualNodeContainer = styled.div`
  color: var(--text-color);
  background: var(--node-background-color);
  border-radius: 7px;
  display: flex;
  flex-direction: column;

  .resize-box {
    width: 10px;
    height: 10px;
    cursor: nw-resize;
    position: absolute;
    right: 0;
    bottom: 0;
    border-top-left-radius: 10px;
    background-color: var(--canvas-foreground-color-1);
  }
`;

const NodeContentContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .node-minimize-card,
  .node-card {
    background: var(--node-background-color);
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: flex-start;
    align-self: stretch;
    padding: 8px 10px;
    border-top-right-radius: 7px;
    border-top-left-radius: 7px;
  }

  .node-header {
    display: flex;
    align-self: stretch;
    align-items: center;
    gap: 3.5px;
    height: 20px;
  }

  .node-tooling {
    flex-grow: 0;
  }

  .node-tag-grp {
    display: flex;
    align-items: flex-start;
    gap: 3.5px;
    flex-grow: 1;
  }

  .node-tag {
    display: flex;
    padding: 3px 8px;
    align-items: center;
    border-radius: 12px;
    text-align: center;
    display: grid;
    place-items: center;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
    text-transform: lowercase;
    background: var(--node-forground-color);
    color: var(--text-color);
  }

  .node-title {
    align-self: strech;
    color: var(--text-color);
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    display: grid;
    place-items: center;
    height: 30px;
    user-select: none;
    overflow: hidden;
    word-break: break-word;
    hyphens: auto;
  }

  .node-minimize-card > .node-header {
    visibility: collapse;
  }

  .node-minimize-card > .node-title {
    width: 100%;
    text-align: center;
  }

  .node-minimize-content,
  .node-content {
    background: var(--node-forground-color);
    flex-grow: 1;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-self: stretch;
    gap: 2px;
    padding: 8px 4px 8px 7px;
    border-bottom-right-radius: 7px;
    border-bottom-left-radius: 7px;
  }

  .node-minimize-content > * {
    visibility: hidden;
    align-self: stretch;
  }

  .node-content-body {
    color: var(--text-color);
    font-size: 14px;
    line-height: 1.4;
  }
`;

/* eslint-disable react/prop-types */
export const VisualNode = memo(
  forwardRef<HTMLDivElement, VisualNodeProps>(function MyVisualNode(
    {
      node,
      connections = [],
      xDelta = 0,
      yDelta = 0,
      attributes,
      attributeListeners,
      isDragging,
      isMinimized,
      scale,
      canvasZoom,
      onNodeSizeChange,
      onNodeSelect,
      onNodeMouseOver,
      onNodeMouseOut,
    }: VisualNodeProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) {
    const isOnlyDraggingCanvas = useRecoilValue(isOnlyDraggingCanvasState);

    const style = useMemo(() => {
      const styling: CSSProperties = {
        opacity: isDragging ? '0' : '',
        transform: `translate(${node.visualInfo.position.x + xDelta}px, ${
          node.visualInfo.position.y + yDelta
        }px) scale(${scale ?? 1})`,
        zIndex: node.visualInfo.position.zIndex,
        width: node.visualInfo.size.width,
        height: node.visualInfo.size.height,
        border: '3px solid var(--primary-color)',
      };

      return styling;
    }, [
      node.visualInfo.position.x,
      node.visualInfo.position.y,
      xDelta,
      yDelta,
      node.visualInfo.size.width,
      node.visualInfo.size.height,
      node.visualInfo.position.zIndex,
      node.state,
      isDragging,
      scale,
    ]);

    // abstract away the difference between function and object refs.
    const nodeRef = (instance: HTMLDivElement | null) => {
      if (typeof ref === 'function') {
        // refs are created by a callback function.
        ref(instance);
      } else if (ref) {
        // refs are created by `React.createRef()`.
        ref.current = instance;
      }
    };

    const onNodeGrabClick = useStableCallback((event: React.MouseEvent) => {
      if (isOnlyDraggingCanvas) return;

      event.stopPropagation();
      onNodeSelect?.();

      console.log('onNodeGrabClick');
    });

    return (
      <VisualNodeContainer
        className={clsx('node', {
          minimized: isMinimized,
        })}
        ref={nodeRef}
        style={style}
        {...attributes}
        onMouseOver={(event) => onNodeMouseOver?.(event, node.id)}
        onMouseOut={(event) => onNodeMouseOut?.(event, node.id)}
      >
        <VisualNodeContent
          node={node}
          connections={connections}
          isMinimized={isMinimized}
          canvasZoom={canvasZoom}
          attributeListeners={attributeListeners}
          onNodeGrabClick={onNodeGrabClick}
          onNodeSizeChange={onNodeSizeChange}
        />
      </VisualNodeContainer>
    );
  }),
);

/* eslint-disable react/prop-types */
const VisualNodeContent: FC<VisualNodeContentProps> = memo(
  ({
    node,
    connections = [],
    isMinimized,
    canvasZoom,
    attributeListeners,
    onNodeGrabClick,
    onNodeSizeChange,
  }: VisualNodeContentProps) => {
    const theme = useRecoilValue(themeState);

    const [nodeWidth, setNodeWidth] = useState<number>(300);
    const [nodeHeight, setNodeHeight] = useState<number>(500);
    const [startHeight, setStartHeight] = useState<number | undefined>();
    const [startWidth, setStartWidth] = useState<number | undefined>();
    const [startMouseX, setStartMouseX] = useState(0);
    const [startMouseY, setStartMouseY] = useState(0);
    const { clientToCanvasPosition } = useCanvasPosition();

    const tagBorderStyling: CSSProperties = useMemo(() => {
      const colorMode = getColorMode();

      const styling: CSSProperties =
        colorMode === 'light'
          ? {
              border: '2px solid var(--primary-color)',
            }
          : {};

      return styling;
    }, [theme]);

    const [cardHeightStyling, minTitleStyling, minVisibilityStyling] =
      useMemo(() => {
        const numPorts: number =
          (node.inputs ? Object.keys(node.inputs).length : 0) +
          (node.outputs ? Object.keys(node.outputs).length : 0);

        const cardStyling: CSSProperties = {
          minHeight: 50,
        };

        const titleStyling: CSSProperties = isMinimized
          ? {
              fontSize: `${32 * (canvasZoom + 0.4)}px`,
              height: 50,
            }
          : {
              fontSize: '18px',
            };

        const visibilityStyling: CSSProperties = isMinimized
          ? { visibility: 'hidden' }
          : {};

        return [cardStyling, titleStyling, visibilityStyling];
      }, [node.inputs, node.outputs, canvasZoom, isMinimized]);

    const contentTopBorderStyling: CSSProperties = useMemo(() => {
      const colorMode = getColorMode();

      const styling: CSSProperties =
        colorMode === 'light'
          ? {
              borderTop: '2px solid var(--primary-color)',
            }
          : {};

      return styling;
    }, [theme]);

    const getNodeCurrentDimensions = (
      elementorChild: HTMLElement,
    ): [number, number] => {
      const nodeElement: HTMLElement | null = elementorChild.closest('.node');

      if (!nodeElement) {
        return [nodeWidth, nodeHeight];
      }

      const cssWidth: string = window.getComputedStyle(nodeElement).width;
      const cssHeight: string = window.getComputedStyle(nodeElement).height;

      return [parseInt(cssWidth, 10), parseInt(cssHeight, 10)];
    };

    const onReiszeStart = useStableCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const [width, height] = getNodeCurrentDimensions(e.target as HTMLElement);

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
        onNodeSizeChange?.(newWidth, newHeight);
        setNodeWidth(newWidth);
        setNodeHeight(newHeight);
      }
    });

    const onScrollNodeBody = useStableCallback((e: React.WheelEvent) => {
      e.stopPropagation();
    });

    // TODO: Add Input and Output circles
    return (
      <NodeContentContainer onClick={onNodeGrabClick}>
        <div {...attributeListeners} style={{ width: '100%' }}>
          <div
            className={isMinimized ? 'node-minimize-card' : 'node-card'}
            style={cardHeightStyling}
          >
            <div className="node-header">
              <div className="node-tag-grp">
                {node.tags?.map((t) => (
                  <div className="node-tag" key={t} style={tagBorderStyling}>
                    {t}
                  </div>
                ))}
              </div>
              <div className="node-tooling">
                <Icon
                  icon={PlayArrowRoundedIcon}
                  width={'20px'}
                  height={'20px'}
                  fontSize={'30px'}
                  additionalStyles={css`
                    color: var(--success-color);
                  `}
                />
              </div>
            </div>
            <div className="node-title" style={minTitleStyling}>
              {node.title}
            </div>
          </div>

          <div style={{ width: '100%' }}>
            <ErrorBoundary fallback={<div />}>
              <NodePortGroup
                node={node}
                connections={connections}
                nodeWidth={nodeWidth}
              />
            </ErrorBoundary>
          </div>
        </div>

        <div
          className={isMinimized ? 'node-minimize-content' : 'node-content'}
          style={contentTopBorderStyling}
          onWheel={onScrollNodeBody}
        >
          <ErrorBoundary
            fallback={
              <div>Something wrong when rendering node content body...</div>
            }
          >
            <NodeContentBody node={node} />
          </ErrorBoundary>
        </div>

        <ResizeBox onResizeStart={onReiszeStart} onResizeMove={onResizeMove} />
      </NodeContentContainer>
    );
  },
);

VisualNodeContent.displayName = 'VisualNodeContent';
