/** @jsxImportSource @emotion/react */
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  DndContext,
  DragMoveEvent,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import { css } from '@emotion/react';
import {
  autoUpdate,
  offset,
  shift,
  useFloating,
  useMergeRefs,
} from '@floating-ui/react';
import { useBoolean, useThrottleFn } from 'ahooks';
import { produce } from 'immer';
import { CSSTransition } from 'react-transition-group';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { ContextMenu } from './ContextMenu';
import { DebugObserver, TimeTravelObserver } from './DebugObserver';
import { DraggableComment } from './DraggableComment';
import { DraggableNode } from './DraggableNode';
import { MouseIcon } from './MouseIcon';
import { VisualComment } from './VisualComment';
import { VisualNode } from './VisualNode';
import { WireLayer } from './WireLayer';
import { useCanvasPosition } from '../hooks/useCanvasPosition';
import { useCommentColorCache } from '../hooks/useCommentColorCache';
import { useContextMenu } from '../hooks/useContextMenu';
import { useDraggingComment } from '../hooks/useDraggingComment';
import { useDraggingNode } from '../hooks/useDraggingNode';
import { useDraggingWire } from '../hooks/useDraggingWire';
import { useNodePortPositions } from '../hooks/usePortPosition';
import { useStableCallback } from '../hooks/useStableCallback';
import {
  canvasPositionState,
  isDraggingMultipleNodesState,
  isOnlyDraggingCanvasState,
  lastMousePositionState,
} from '../state/canvas';
import {
  isDraggingMultipleCommentsState,
  selectingCommentIdsState,
} from '../state/comment';
import {
  collapsingNodeIdsState,
  hoveringNodeIdState,
  pinningNodeIdsState,
  selectingNodeIdsState,
} from '../state/node';
import { draggingWireClosestPortState } from '../state/wire';
import { NodeCanvasProps, type CanvasPosition } from '../types/canvas.type';
import { type ContextMenuConfigContextData } from '../types/contextmenu.type';
import { HighlightedPort } from '../types/port.type';
import { GraphComment, Node, NodeConnection } from '../types/studio.type';

const styles = css`
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-position: -1px -1px;
  z-index: 0;

  background-color: var(--canvas-background-color);
  background-image: linear-gradient(
      var(--canvas-foreground-color-1) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      var(--canvas-foreground-color-1) 1px,
      transparent 1px
    ),
    linear-gradient(var(--canvas-foreground-color-2) 1px, transparent 1px),
    linear-gradient(
      90deg,
      var(--canvas-foreground-color-2) 1px,
      transparent 1px
    ) !important;

  .canvas-contents {
    transform-origin: top left;
  }

  .node-connection-grp {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }

  .comment-grp {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
  }

  .context-menu-box {
    position: absolute;
    display: none;
  }

  .context-menu-box-enter {
    position: absolute;
    display: block;
    opacity: 0;
  }

  .context-menu-box-enter-active {
    position: absolute;
    opacity: 1;
    transition: opacity 100ms ease-out;
  }

  .context-menu-box-exit {
    position: absolute;
    opacity: 1;
  }

  .context-menu-box-exit-done {
    position: absolute;
    opacity: 0;
    left: -1000px;
  }

  .mouse-icon {
    position: fixed;
    pointer-events: none;
    z-index: 9999;

    .selection-box-indicator {
      width: 24px;
      height: 24px;
      cursor: grab;
      border: 2px dashed #ffffff;
    }
  }
`;

type MouseInfo = {
  x: number;
  y: number;
  target: EventTarget | undefined;
};

export const NodeCanvas: FC<NodeCanvasProps> = ({
  nodes,
  connections,
  comments,
  onNodesChange,
  onCommentsChange,
  onConnectionsChange,
  onNodesSelect,
  onCommentsSelect,
  onWiresSelect,
  onContextMenuSelect,
}) => {
  const { canvasPosition, canvasToClientPosition, clientToCanvasPosition } =
    useCanvasPosition();
  const {
    portPositions,
    canvasRef,
    recalculate: recalculatePortPositions,
  } = useNodePortPositions();

  const { setNodeRef } = useDroppable({ id: 'NodeCanvas' });
  const setCanvasRef = useMergeRefs([setNodeRef, canvasRef]);

  const setCanvasPosition = useSetRecoilState(canvasPositionState);
  const [lastMousePosition, setLastMousePosition] = useRecoilState(
    lastMousePositionState,
  );

  const isDraggingMultipleNodes = useRecoilValue(isDraggingMultipleNodesState);
  const [isOnlyDraggingCanvas, setIsOnlyDraggingCanvas] = useRecoilState(
    isOnlyDraggingCanvasState,
  );
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({
    x: 0,
    y: 0,
    canvasStartX: 0,
    canvasStartY: 0,
  });
  const { draggingNodes, onNodeStartDrag, onNodeEndDrag } =
    useDraggingNode(onNodesChange);
  const [hoveringNodeId, setHoveringNodeId] =
    useRecoilState(hoveringNodeIdState);
  const [selectingNodeIds, setSelectingNodeIds] = useRecoilState(
    selectingNodeIdsState,
  );
  const pinningNodeIds = useRecoilValue(pinningNodeIdsState);
  const collapsingNodeIds = useRecoilValue(collapsingNodeIdsState);

  const { draggingWire, onWireStartDrag, onWireEndDrag } =
    useDraggingWire(onConnectionsChange);
  // const [selectingWireIds, setSelectingWireIds] = useRecoilState(
  //   selectingWireIdsState,
  // );

  const [hoveringPort, setHoveringPort] = useState<
    HighlightedPort | undefined
  >();
  const hoveringPortTimeout = useRef<number | undefined>();
  const [
    hoveringShowPortInfo,
    { setTrue: showPortInfo, setFalse: hidePortInfo },
  ] = useBoolean(false);
  const closestPort = useRecoilValue(draggingWireClosestPortState);

  const isDraggingMultipleComments = useRecoilValue(
    isDraggingMultipleCommentsState,
  );
  const {
    draggingComments,
    draggingNodes: draggingNodesInComments,
    onCommentStartDrag,
    onCommentEndDrag,
  } = useDraggingComment(onCommentsChange, onNodesChange);
  const [selectingCommentIds, setSelectingCommentIds] = useRecoilState(
    selectingCommentIdsState,
  );

  const [isContextMenuDisabled, setIsContextMenuDisabled] = useState(true);

  const lastMouseInfoRef = useRef<MouseInfo>({
    x: -1000,
    y: 0,
    target: undefined,
  });

  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-end',
    whileElementsMounted: autoUpdate,
    middleware: [offset(5), shift({ crossAxis: true })],
  });

  const { setReference } = refs;

  const {
    contextMenuRef,
    showContextMenu,
    contextMenu,
    setShowContextMenu,
    setContextMenu,
    handleContextMenu,
  } = useContextMenu();

  const commentColorCache = useCommentColorCache();

  const nodesToDrag = useMemo(() => {
    return [...new Set([...draggingNodes, ...draggingNodesInComments])];
  }, [draggingNodes, draggingNodesInComments]);

  useEffect(() => {
    recalculatePortPositions();
  }, [recalculatePortPositions, collapsingNodeIds]);

  useEffect(() => {
    if (closestPort?.portName) {
      setHoveringPort({
        nodeId: closestPort.nodeId,
        portName: closestPort.portName,
        definition: closestPort.input,
        isInput: true,
      });
      setReference(closestPort.portEl);

      hoveringPortTimeout.current = window.setTimeout(() => {
        showPortInfo();
      }, 400);
    } else {
      setHoveringPort(undefined);
      hidePortInfo();
      if (hoveringPortTimeout.current) {
        window.clearTimeout(hoveringPortTimeout.current);
      }
    }
  }, [
    closestPort?.nodeId,
    closestPort?.portName,
    closestPort?.portEl,
    closestPort?.input,
    setReference,
  ]);

  const extractCanvasContextMenu: ContextMenuConfigContextData | null =
    useMemo(() => {
      if (contextMenu.data?.type.startsWith('comment')) {
        const commentId: string = contextMenu.data.element.dataset
          .commentid as string;

        return {
          type: 'comment',
          data: {
            commentId,
          },
          group: [],
        };
      } else if (contextMenu.data?.type.startsWith('node-')) {
        const nodeIdentifier: string = contextMenu.data.type.replace(
          'node-',
          '',
        );
        const nodeId: string = contextMenu.data.element.dataset
          .nodeid as string;

        const parts = nodeIdentifier.split('-');
        if (parts.length !== 2) {
          return {
            type: 'blankSpace',
            data: {},
            group: [],
          };
        }

        const [type, subType] = parts;
        return {
          type: 'node',
          data: {
            nodeId: nodeId,
            nodeType: type,
            nodeSubType: subType,
          },
          group: [],
        };
      } else if (contextMenu.data?.type.startsWith('wire-')) {
        const wireIdentifier: string = contextMenu.data.type.replace(
          'wire-',
          '',
        );
        const wireId: string = contextMenu.data.element.dataset
          .wireid as string;

        const parts = wireIdentifier.split('-');
        if (parts.length !== 4) {
          return {
            type: 'blankSpace',
            data: {},
            group: [],
          };
        }

        const [fromNodeId, fromPortName, toNodeId, toPortName] = parts;
        return {
          type: 'wire',
          data: {
            wireId,
            wireFromNodeId: fromNodeId,
            wireFromPortName: fromPortName,
            wireToNodeId: toNodeId,
            wireToPortName: toPortName,
          },
          group: [],
        };
      }

      return {
        type: 'blankSpace',
        data: {},
        group: [],
      };
    }, [contextMenu]);

  const canvasContextMenu = useStableCallback((event: React.MouseEvent) => {
    event.preventDefault();
    console.log(`x: ${event.clientX}, y: ${event.clientY}`);
    handleContextMenu(event);
  });

  const canvasMouseDown = useStableCallback((event: React.MouseEvent) => {
    // Check if main button (ususally the left button) is pressed
    if (event.button !== 0) return;

    event.preventDefault();

    const isClickingOnCanvas: boolean =
      (event.target as Element).className === event.currentTarget.className;

    if (isClickingOnCanvas) {
      onNodesSelect([]);
      onCommentsSelect([]);
    }

    // Check if only dragging canvas is true
    if (!isOnlyDraggingCanvas) return;

    // Check if canvas is mouse-down
    // if (
    //   (event.target as HTMLElement).classList.contains('my-canvas') === false
    // ) {
    //   return;
    // }

    // Cancel Context Menu
    setIsContextMenuDisabled(true);

    // Start dragging
    setIsDraggingCanvas(true);

    // Record start position
    setDragStart({
      x: event.clientX,
      y: event.clientY,
      canvasStartX: canvasPosition.x,
      canvasStartY: canvasPosition.y,
    });
  });

  const canvasMouseMove = useThrottleFn(
    (event: React.MouseEvent) => {
      // Check if only dragging canvas is true
      if (!isOnlyDraggingCanvas) return;

      // Record last mouse position
      setLastMousePosition({ x: event.clientX, y: event.clientY });
      lastMouseInfoRef.current = {
        x: event.clientX,
        y: event.clientY,
        target: event.target,
      };

      if (isDraggingCanvas) {
        // Compute dragging distance
        const dx: number = (event.clientX - dragStart.x) / canvasPosition.zoom;
        const dy: number = (event.clientY - dragStart.y) / canvasPosition.zoom;

        // Update new canvas position
        const position: CanvasPosition = {
          x: dragStart.canvasStartX + dx,
          y: dragStart.canvasStartY + dy,
          zoom: canvasPosition.zoom,
        };
        setCanvasPosition(position);
      }
    },
    { wait: 10 },
  );

  const canvasMouseUp = (event: React.MouseEvent) => {
    // Check if only dragging canvas is true
    if (!isOnlyDraggingCanvas) return;

    // End dragging
    setIsDraggingCanvas(false);
  };

  const isScrollable = (element: HTMLElement): boolean => {
    const style: CSSStyleDeclaration = window.getComputedStyle(element);
    const isVerticalScrollable: boolean =
      style.overflowY === 'auto' && element.scrollHeight > element.clientHeight;
    const isHorizontalScrollable: boolean =
      style.overflowX === 'auto' && element.scrollWidth > element.clientWidth;

    return isVerticalScrollable || isHorizontalScrollable;
  };

  const isAnyParentScrollable = (element: HTMLElement): boolean => {
    let currentNode: HTMLElement | null = element.parentElement;

    while (currentNode) {
      if (isScrollable(currentNode)) return true;

      currentNode = currentNode.parentElement;
    }

    return false;
  };

  // TODO: only zoom if ctrl hot key is pressed.
  const zoomDebounced = useThrottleFn(
    (
      target: HTMLElement,
      wheelDelta: number,
      clientX: number,
      clientY: number,
    ) => {
      // Check if mouse is placed on the background
      if (isAnyParentScrollable(target)) return;

      // compute new zoom
      const zoomSpeed = 0.025;
      const zoomFactor: number = wheelDelta < 0 ? 1 + zoomSpeed : 1 - zoomSpeed;
      const newZoom: number = canvasPosition.zoom * zoomFactor;

      // compute current mouse position in canvas space
      const currentMouseCanvasPosition = clientToCanvasPosition(
        clientX,
        clientY,
      );

      // compute distance between mouse and canvas position
      const dx: number = clientX / newZoom - canvasPosition.x;
      const dy: number = clientY / newZoom - canvasPosition.y;

      // cancel offset from current mouse position
      const posDiff = {
        x: dx - currentMouseCanvasPosition.x,
        y: dy - currentMouseCanvasPosition.y,
      };

      // compute the new canvas position
      const position: CanvasPosition = {
        x: canvasPosition.x + posDiff.x,
        y: canvasPosition.y + posDiff.y,
        zoom: newZoom,
      };

      setCanvasPosition(position);
    },
    { wait: 25 },
  );

  const handleZoom = useStableCallback((event: React.WheelEvent) => {
    // do not zoom if context menu is enabled
    if (isContextMenuDisabled) {
      zoomDebounced.run(
        event.target as HTMLElement,
        event.deltaY,
        event.clientX,
        event.clientY,
      );
    }
  });

  const nodeConnectionGroups: {
    node: Node;
    connections?: NodeConnection[];
  }[] = useMemo(() => {
    // make sure all of the connections are connected to at least one node.
    return nodes.map((node) => {
      const filteredConnections = connections.filter(
        (connection) =>
          connection.toNodeId === node.id || connection.fromNodeId === node.id,
      );

      return { node, filteredConnections };
    });
  }, [nodes, connections]);

  const draggingNodeConnections: NodeConnection[] = useMemo(() => {
    return nodesToDrag.flatMap((draggingNode: Node) =>
      connections.filter(
        (c: NodeConnection) =>
          c.toNodeId === draggingNode.id || c.fromNodeId === draggingNode.id,
      ),
    );
  }, [nodes, connections]);

  const selectingUniqueNodeIds = useMemo(() => {
    const nodeSet = new Set(selectingNodeIds);

    return [...nodeSet];
  }, [selectingNodeIds]);

  const selectingUniqueCommentIds = useMemo(() => {
    const commentSet = new Set(selectingCommentIds);

    return [...commentSet];
  }, [selectingCommentIds]);

  const onNodeSizeChange = (node: Node, width?: number, height?: number) => {
    onNodesChange(
      produce(nodes, (draft) => {
        const nodeToChange = draft.find((n) => n.id === node.id);

        if (nodeToChange) {
          if (width) {
            nodeToChange.visualInfo.size.width = width;
          }
          if (height) {
            nodeToChange.visualInfo.size.height = height;
          }
        }
      }),
    );
  };

  const onCommentSizeChange = (
    comment: GraphComment,
    width: number,
    height: number,
  ) => {
    onCommentsChange(
      produce(comments, (draft) => {
        const commentToChange = draft.find((c) => c.id === comment.id);

        if (commentToChange) {
          commentToChange.visualInfo.size.width = width;
          commentToChange.visualInfo.size.height = height;
        }
      }),
    );
  };

  const onCommentColorChange = (comment: GraphComment, color: string) => {
    onCommentsChange(
      produce(comments, (draft) => {
        const commentToChange = draft.find((c) => c.id === comment.id);

        if (commentToChange) {
          if (!commentToChange.visualInfo.content) {
            commentToChange.visualInfo.content = {
              color: color as any,
            };
          } else {
            commentToChange.visualInfo.content.color = color as any;
          }
        }
      }),
    );
  };

  const onCommentContentChange = (
    comment: GraphComment,
    content: GraphComment['visualInfo']['content'],
  ) => {
    onCommentsChange(
      produce(comments, (draft) => {
        const commentToChange = draft.find((c) => c.id === comment.id);

        if (commentToChange) {
          commentToChange.visualInfo.content = content;
        }
      }),
    );
  };

  const onNodeSelect = useCallback(
    (node: Node) => {
      onNodesSelect([node], isDraggingMultipleNodes);
    },
    [isDraggingMultipleNodes],
  );

  const onCommentSelect = useCallback(
    (comment: GraphComment) => {
      onCommentsSelect([comment], isDraggingMultipleComments);
    },
    [isDraggingMultipleComments],
  );

  const onNodeMouseOver = useStableCallback(
    (event: React.MouseEvent, nodeId: string) => {
      setHoveringNodeId(nodeId);
    },
  );

  const onNodeMouseOut = useStableCallback((event: React.MouseEvent) => {
    setHoveringNodeId(undefined);
  });

  const isMinimized: boolean = canvasPosition.zoom < 0.6;

  const onNodeMoveDrag = useCallback(
    (e: DragMoveEvent) => {
      recalculatePortPositions();
    },
    [recalculatePortPositions],
  );

  return (
    <div>
      <DebugOverlay enabled={true} />
      <DndContext
        onDragStart={(e) => {
          onNodeStartDrag(e);
          onCommentStartDrag(e);
        }}
        onDragEnd={(e) => {
          onNodeEndDrag(e);
          onCommentEndDrag(e);
        }}
        onDragMove={onNodeMoveDrag}
      >
        <div
          ref={setCanvasRef}
          css={styles}
          className="my-canvas"
          onContextMenu={canvasContextMenu}
          onMouseDown={canvasMouseDown}
          onMouseMove={canvasMouseMove.run}
          onMouseUp={canvasMouseUp}
          onMouseLeave={canvasMouseUp}
          onWheel={handleZoom}
          style={{
            backgroundPosition: `
            ${canvasPosition.x - 1}px ${canvasPosition.y - 1}px
            `,
            backgroundSize: `
            ${100 * canvasPosition.zoom}px ${100 * canvasPosition.zoom}px,
            ${100 * canvasPosition.zoom}px ${100 * canvasPosition.zoom}px,
            ${20 * canvasPosition.zoom}px ${20 * canvasPosition.zoom}px,
            ${20 * canvasPosition.zoom}px ${20 * canvasPosition.zoom}px
            `,
            cursor: isOnlyDraggingCanvas
              ? isDraggingCanvas
                ? 'grabbing'
                : 'grab'
              : 'inherit',
          }}
        >
          <MouseIcon />
          <div
            className="canvas-contents"
            style={{
              transform: `scale(${canvasPosition.zoom}, ${canvasPosition.zoom}) translate(${canvasPosition.x}px, ${canvasPosition.y}px) translateZ(-1px)`,
            }}
          >
            <div className="node-connection-grp">
              {nodeConnectionGroups.map((nodeConnectionGroup) => {
                const nodeToRender: Node = nodeConnectionGroup.node;
                const connectionsToRender: NodeConnection[] | undefined =
                  nodeConnectionGroup.connections;
                const isPinning: boolean = pinningNodeIds.includes(
                  nodeToRender.id,
                );
                const isCollapsing: boolean = collapsingNodeIds.includes(
                  nodeToRender.id,
                );

                if (nodesToDrag.some((n) => n.id === nodeToRender.id)) {
                  return null;
                }

                return (
                  <DraggableNode
                    key={nodeToRender.id}
                    node={nodeToRender}
                    connections={connectionsToRender}
                    canvasZoom={canvasPosition.zoom}
                    isMinimized={isMinimized}
                    isSelecting={selectingUniqueNodeIds.includes(
                      nodeToRender.id,
                    )}
                    isPinning={isPinning}
                    isCollapsed={isCollapsing}
                    onNodeSizeChange={onNodeSizeChange}
                    onNodeSelect={onNodeSelect}
                    onNodeMouseOver={onNodeMouseOver}
                    onNodeMouseOut={onNodeMouseOut}
                    onWireStartDrag={onWireStartDrag}
                    onWireEndDrag={onWireEndDrag}
                  />
                );
              })}
            </div>
            <div className="comment-grp">
              {comments.map((commentToRender) => {
                if (draggingComments.find((c) => c.id === commentToRender.id)) {
                  return null;
                }

                return (
                  <DraggableComment
                    key={commentToRender.id}
                    comment={commentToRender}
                    commentColorCache={commentColorCache}
                    canvasZoom={canvasPosition.zoom}
                    isMinimized={isMinimized}
                    isSelecting={selectingUniqueCommentIds.includes(
                      commentToRender.id,
                    )}
                    onCommentSizeChange={onCommentSizeChange}
                    onCommentColorChange={onCommentColorChange}
                    onCommentContentChange={onCommentContentChange}
                    onCommentSelect={onCommentSelect}
                  />
                );
              })}
            </div>
            <DragOverlay
              className="dragging-node-area"
              dropAnimation={null}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
              }}
              modifiers={[
                (args) => {
                  return {
                    x: args.transform.x / canvasPosition.zoom,
                    y: args.transform.y / canvasPosition.zoom,
                    scaleX: 1,
                    scaleY: 1,
                  };
                },
              ]}
            >
              <div className="node-connection-grp">
                {nodesToDrag.map((draggingNode: Node) => (
                  <VisualNode
                    key={draggingNode.id}
                    node={draggingNode}
                    connections={draggingNodeConnections}
                    isSelecting={selectingUniqueNodeIds.includes(
                      draggingNode.id,
                    )}
                    isOverlay
                    isMinimized={isMinimized}
                    isPinning={pinningNodeIds.includes(draggingNode.id)}
                    isCollapsed={collapsingNodeIds.includes(draggingNode.id)}
                    canvasZoom={canvasPosition.zoom}
                  />
                ))}
              </div>
              <div className="comment-grp">
                {draggingComments.map((draggingComment: GraphComment) => (
                  <VisualComment
                    key={draggingComment.id}
                    comment={draggingComment}
                    commentColorCache={commentColorCache}
                    isSelecting={selectingUniqueCommentIds.includes(
                      draggingComment.id,
                    )}
                    isOverlay
                    isMinimized={isMinimized}
                    canvasZoom={canvasPosition.zoom}
                  />
                ))}
              </div>
            </DragOverlay>
          </div>
          <WireLayer
            connections={connections}
            portPositions={portPositions}
            draggingWire={draggingWire}
            isDraggingFromNode={nodesToDrag.length > 0}
            highlightedNodeIds={selectingUniqueNodeIds}
            highlightedPort={hoveringPort}
            onWiresSelect={onWiresSelect}
          />
          <CSSTransition
            classNames="context-menu-box"
            nodeRef={contextMenuRef}
            in={showContextMenu && !!extractCanvasContextMenu}
            timeout={200}
            onEnter={() => {
              setIsContextMenuDisabled(false);
            }}
            onExit={() => {
              setContextMenu({ x: 0, y: 0, data: null });
              setIsContextMenuDisabled(true);
            }}
          >
            <ContextMenu
              ref={contextMenuRef}
              x={contextMenu.x}
              y={contextMenu.y}
              disabled={isContextMenuDisabled}
              context={extractCanvasContextMenu!}
              onSelect={onContextMenuSelect}
            ></ContextMenu>
          </CSSTransition>
        </div>
      </DndContext>
    </div>
  );
};

const debugStyles = css`
  position: absolute;
  top: 30px;
  left: 30px;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.03);
  color: var(--text-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 99999;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DebugOverlay: FC<{ enabled: boolean }> = ({ enabled }) => {
  const canvasPosition = useRecoilValue(canvasPositionState);

  const lastMousePosition = useRecoilValue(lastMousePositionState);

  const { clientToCanvasPosition } = useCanvasPosition();

  if (!enabled) {
    return null;
  }

  return (
    <div css={debugStyles}>
      <div>
        Translation:{' '}
        {`(${canvasPosition.x.toFixed(2)}, ${canvasPosition.y.toFixed(2)})`}
      </div>
      <div>Scale: {canvasPosition.zoom.toFixed(2)}</div>
      <div>
        Mouse Position:{' '}
        {`(${lastMousePosition.x.toFixed(2)}, ${lastMousePosition.y.toFixed(
          2,
        )})`}
      </div>
      <div>
        Translated Mouse Position:{' '}
        {`(${clientToCanvasPosition(
          lastMousePosition.x,
          lastMousePosition.y,
        ).x.toFixed(2)}, ${clientToCanvasPosition(
          lastMousePosition.x,
          lastMousePosition.y,
        ).y.toFixed(2)})`}
      </div>
    </div>
  );
};
