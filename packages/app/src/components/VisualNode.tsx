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
import { useMergeRefs } from '@floating-ui/react';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import clsx from 'clsx';
import { ErrorBoundary } from 'react-error-boundary';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { Icon } from './Icon';
import { NodeContentBody } from './NodeContentBody';
import { NodeContentBodyMask } from './NodeContentBodyMask';
import { NodePortGroup } from './NodePortGroup';
import { ResizeBox } from './ResizeBox';
import { useRipple } from '../hooks/useAnimation';
import { useCanvasPosition } from '../hooks/useCanvasPosition';
import { useStableCallback } from '../hooks/useStableCallback';
import { isOnlyDraggingCanvasState } from '../state/canvas';
import { pinningNodeIdsState } from '../state/node';
import { themeState } from '../state/settings';
import { draggingWireClosestPortState, draggingWireState } from '../state/wire';
import {
  MinimizedVisualNodeContentProps,
  VisualNodeContentProps,
  VisualNodeProps,
} from '../types/node.type';
import { getColorMode } from '../utils/colorMode';

const VisualNodeContainer = styled.div<{
  isCollapsed?: boolean;
}>`
  color: var(--text-color);
  background: var(--node-background-color);
  border-radius: 7px;
  border: 3px solid var(--primary-color);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  position: absolute;
  // overflow: hidden;
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
    background-color: ${(props) =>
      props.isCollapsed
        ? 'var(--canvas-background-color-1)'
        : 'var(--canvas-foreground-color-1)'};
  }
`;

const NodeContentContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .node-card {
    // background: var(--node-background-color);
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: flex-start;
    align-self: stretch;
    padding: 8px 10px;
    transition: all 100ms ease-out;
  }

  .node-card-info {
    background: var(--node-background-color);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    align-self: stretch;
    gap: 5px;
    border-top-left-radius: calc(7px - 3px);
    border-top-right-radius: calc(7px - 3px);
    position: relative;
  }

  .node-card-dragging-area {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
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
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 5px;
    cursor: pointer !important;
    z-index: 1;
  }

  .node-tooling.minimized {
    visibility: collapse;
  }

  .pin-tooling {
    opacity: 0;
  }

  .pin-tooling.pinned {
    opacity: 1;
  }

  .pin-tooling:hover {
    opacity: 1;
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
    background: var(--node-foreground-color);
    color: var(--text-color);
  }

  .node-title-grp {
    display: flex;
    align-self: stretch;
    align-items: center;
    gap: 3.5px;
  }

  .node-title {
    flex-grow: 1;
    align-self: strech;
    color: var(--text-color);
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    display: grid;
    place-items: flex-start;
    user-select: none;
    overflow: hidden;
    word-break: break-word;
    hyphens: auto;
  }

  .node-header.minimized {
    visibility: collapse;
  }

  .node-title.minimized {
    width: 100%;
    text-align: center;
    place-items: center;
  }

  .node-card-body {
    background: var(--node-foreground-color);
    flex-grow: 1;
    display: flex;
    align-self: stretch;
    border-bottom-right-radius: calc(7px - 3px);
    border-bottom-left-radius: calc(7px - 3px);
    overflow: hidden;
  }

  .node-card-body.collapsed {
    border-top: 2px solid var(--primary-color);
  }

  .node-card-body-collapse {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 8px;
  }

  .collapse-btn {
    width: 100%;
    height: 100%;
    position: relative;
    border-bottom: 2px solid var(--primary-color);
    cursor: pointer;
    opacity: 0;
  }

  .collapse-btn::after {
    content: '';
    position: absolute;
    bottom: 0px;
    left: 50%;
    margin-left: -10px;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 8px solid var(--primary-color);
    opacity: 0;
  }

  .collapse-btn:hover {
    opacity: 1;
  }

  .collapse-btn:hover::after {
    opacity: 1;
  }

  .node-minimize-content,
  .node-content {
    width: 100%;
    height: inherit;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-self: stretch;
    gap: 2px;
    padding: 8px 4px 8px 7px;
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
      isSelecting,
      isOverlay,
      isMinimized,
      isPinning,
      isCollapsed,
      scale,
      canvasZoom,
      onNodeSizeChange,
      onNodeSelect,
      onNodeMouseOver,
      onNodeMouseOut,
      onWireStartDrag,
      onWireEndDrag,
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
        zIndex: node.visualInfo.position.zIndex ?? 0,
        width: node.visualInfo.size.width,
        height: isCollapsed ? 70 + 10 : node.visualInfo.size.height,
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
      isCollapsed,
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
    });

    return (
      <VisualNodeContainer
        isCollapsed={isCollapsed}
        className={clsx('node', {
          dragged: isDragging,
          selected: isSelecting,
          overlayed: isOverlay,
          minimized: isMinimized,
        })}
        ref={nodeRef}
        style={style}
        {...attributes}
        data-nodeid={node.id}
        data-contextmenutype={`node-${node.type}-${node.subType}`}
        onMouseOver={(event) => onNodeMouseOver?.(event, node.id)}
        onMouseOut={(event) => onNodeMouseOut?.(event, node.id)}
        onClick={onNodeGrabClick}
      >
        <VisualNodeContent
          node={node}
          connections={connections}
          isMinimized={isMinimized}
          isPinning={isPinning}
          isCollapsed={isCollapsed}
          canvasZoom={canvasZoom}
          attributeListeners={attributeListeners}
          onNodeGrabClick={onNodeGrabClick}
          onNodeSizeChange={onNodeSizeChange}
          onWireStartDrag={onWireStartDrag}
          onWireEndDrag={onWireEndDrag}
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
    isPinning,
    isCollapsed,
    canvasZoom,
    attributeListeners,
    onNodeGrabClick,
    onNodeSizeChange,
    onWireStartDrag,
    onWireEndDrag,
  }: VisualNodeContentProps) => {
    const draggingWire = useRecoilValue(draggingWireState);
    const draggingWireClosestPort = useRecoilValue(
      draggingWireClosestPortState,
    );
    const setPinningNodeIds = useSetRecoilState(pinningNodeIdsState);

    const [nodeWidth, setNodeWidth] = useState<number>(300);
    const [nodeHeight, setNodeHeight] = useState<number>(500);
    const [startHeight, setStartHeight] = useState<number | undefined>();
    const [startWidth, setStartWidth] = useState<number | undefined>();
    const [startMouseX, setStartMouseX] = useState(0);
    const [startMouseY, setStartMouseY] = useState(0);
    const { clientToCanvasPosition } = useCanvasPosition();

    const [minCardHeight, hasMinCardHeight, minTitleStyling] = useMemo(() => {
      const numPorts: number = Math.max(
        node.inputs ? Object.keys(node.inputs).length : 0,
        node.outputs ? Object.keys(node.outputs).length : 0,
      );

      const minHeight: number = isCollapsed
        ? Number.MAX_SAFE_INTEGER
        : 70 + numPorts * 30 + 10 + 30;

      const hasMinHeight: boolean = minHeight >= node.visualInfo.size.height;

      const titleStyling: CSSProperties = isMinimized
        ? {
            fontSize: `${32 * (canvasZoom + 0.4)}px`,
            height: 50,
          }
        : {
            fontSize: '18px',
          };

      return [minHeight, hasMinHeight, titleStyling];
    }, [
      node.visualInfo.size.height,
      node.inputs,
      node.outputs,
      canvasZoom,
      isMinimized,
      isCollapsed,
    ]);

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

    const onResizeStart = useStableCallback((e: React.MouseEvent) => {
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
        onNodeSizeChange?.(
          Math.max(200, newWidth),
          minCardHeight === Number.MAX_SAFE_INTEGER
            ? undefined
            : Math.max(minCardHeight, newHeight),
        );

        setNodeWidth(Math.max(200, newWidth));
        if (minCardHeight !== Number.MAX_SAFE_INTEGER) {
          setNodeHeight(Math.max(minCardHeight, newHeight));
        }
      }
    });

    const onResizeExpand = useStableCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const [width, height] = getNodeCurrentDimensions(e.target as HTMLElement);

      onNodeSizeChange?.(undefined, height + 210);
      setNodeWidth(Math.max(200, width));
      setNodeHeight(height + 210);
    });

    const onResizeCollapse = useStableCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (minCardHeight !== Number.MAX_SAFE_INTEGER) {
        onNodeSizeChange?.(undefined, minCardHeight);
        setNodeHeight(minCardHeight);
      }
    });

    const onScrollNodeBody = useStableCallback((e: React.WheelEvent) => {
      e.stopPropagation();
    });

    const onTogglePinningNode = useStableCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setPinningNodeIds((prev) => {
        if (prev.includes(node.id)) {
          return prev.filter((n) => n !== node.id);
        }

        return [...prev, node.id];
      });
    });

    // TODO: add index (for example, node id) on the top left of the node.
    return (
      <NodeContentContainer>
        <div className="node-card-info">
          <div className="node-card-dragging-area" {...attributeListeners} />
          <div className={'node-card'}>
            {!isCollapsed && (
              <div className={clsx('node-header', { minimized: isMinimized })}>
                <div className="node-tag-grp">
                  {node.tags?.map((t) => (
                    <div className="node-tag" key={t}>
                      {t}
                    </div>
                  ))}
                </div>
                <div className="node-tooling">
                  <div
                    className={clsx('pin-tooling', {
                      pinned: isPinning,
                    })}
                    onClick={onTogglePinningNode}
                  >
                    {isPinning ? (
                      <Icon
                        icon={PushPinIcon}
                        width={'20px'}
                        height={'20px'}
                        fontSize={'20px'}
                        additionalStyles={css`
                          color: var(--text-color);
                        `}
                      />
                    ) : (
                      <Icon
                        icon={PushPinOutlinedIcon}
                        width={'20px'}
                        height={'20px'}
                        fontSize={'20px'}
                        additionalStyles={css`
                          color: var(--text-color);
                        `}
                      />
                    )}
                  </div>
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
            )}

            <div className="node-title-grp">
              <div
                className={clsx('node-title', { minimized: isMinimized })}
                style={minTitleStyling}
              >
                {node.title}
              </div>
              {isCollapsed && (
                <div
                  className={clsx('node-tooling', { minimized: isMinimized })}
                >
                  <div
                    className={clsx('pin-tooling', {
                      pinned: isPinning,
                    })}
                    onClick={onTogglePinningNode}
                  >
                    {isPinning ? (
                      <Icon
                        icon={PushPinIcon}
                        width={'20px'}
                        height={'20px'}
                        fontSize={'20px'}
                        additionalStyles={css`
                          color: var(--text-color);
                        `}
                      />
                    ) : (
                      <Icon
                        icon={PushPinOutlinedIcon}
                        width={'20px'}
                        height={'20px'}
                        fontSize={'20px'}
                        additionalStyles={css`
                          color: var(--text-color);
                        `}
                      />
                    )}
                  </div>
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
              )}
            </div>
          </div>

          <div style={{ width: '100%' }}>
            <ErrorBoundary fallback={<div />}>
              <NodePortGroup
                node={node}
                connections={connections}
                nodeWidth={node.visualInfo.size.width}
                draggingWire={draggingWire}
                draggingWireClosestPort={draggingWireClosestPort}
                isCollapsed={isCollapsed}
                onWireStartDrag={onWireStartDrag}
                onWireEndDrag={onWireEndDrag}
              />
            </ErrorBoundary>
          </div>
          {!isCollapsed && !hasMinCardHeight && (
            <div className="node-card-body-collapse">
              <div className="collapse-btn" onClick={onResizeCollapse} />
            </div>
          )}
        </div>

        {!isCollapsed && (
          <div
            className={clsx('node-card-body', {
              collapsed: hasMinCardHeight,
            })}
            onWheel={onScrollNodeBody}
          >
            <div
              className={isMinimized ? 'node-minimize-content' : 'node-content'}
            >
              <ErrorBoundary
                fallback={
                  <div>Something wrong when rendering node content body...</div>
                }
              >
                {hasMinCardHeight && (
                  <NodeContentBodyMask
                    height={26}
                    onExpandClick={onResizeExpand}
                  />
                )}
                <NodeContentBody node={node} />
              </ErrorBoundary>
            </div>
          </div>
        )}

        <ResizeBox onResizeStart={onResizeStart} onResizeMove={onResizeMove} />
      </NodeContentContainer>
    );
  },
);

VisualNodeContent.displayName = 'VisualNodeContent';
