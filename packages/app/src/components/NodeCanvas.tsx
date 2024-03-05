/** @jsxImportSource @emotion/react */
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';

import { DndContext, DragOverlay, useDroppable } from '@dnd-kit/core';
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
import { DraggableNode } from './DraggableNode';
import { MouseIcon } from './MouseIcon';
import { VisualNode } from './VisualNode';
import { WireLayer } from './WireLayer';
import { useCanvasPosition } from '../hooks/useCanvasPosition';
import { useContextMenu } from '../hooks/useContextMenu';
import { useDraggingNode } from '../hooks/useDraggingNode';
import { useDraggingWire } from '../hooks/useDraggingWire';
import { useGlobalHotkey } from '../hooks/useGlobalHotkey';
import { useNodePortPositons } from '../hooks/usePortPosition';
import { useStableCallback } from '../hooks/useStableCallback';
import {
  canvasPositionState,
  isOnlyDraggingCanvasState,
  lastMousePositionState,
} from '../state/canvas';
import { hoveringNodeIdState, selectingNodeIdsState } from '../state/node';
import { draggingWireClosestPortState } from '../state/wire';
import { NodeCanvasProps, type CanvasPosition } from '../types/canvas.type';
import { type ContextMenuConfigContextData } from '../types/contextmenu.type';
import { HighlightedPort } from '../types/port.type';
import { Node, NodeConnection } from '../types/studio.type';

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
    position: relative;
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
  onNodesChange,
  onConnectionsChange,
  onNodesSelect,
}) => {
  const { canvasPosition, canvasToClientPosition, clientToCanvasPosition } =
    useCanvasPosition();
  const {
    portPositions,
    canvasRef,
    recalculate: recalculatePortPositions,
  } = useNodePortPositons();

  const { setNodeRef } = useDroppable({ id: 'NodeCanvas' });
  const setCanvasRef = useMergeRefs([setNodeRef, canvasRef]);

  const setCanvasPosition = useSetRecoilState(canvasPositionState);
  const [lastMousePosition, setLastMousePosition] = useRecoilState(
    lastMousePositionState,
  );

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
  const [selectingNodeIds, SetSelectingNodeIds] = useRecoilState(
    selectingNodeIdsState,
  );

  const { draggingWire, onWireStartDrag, onWireEndDrag } =
    useDraggingWire(onConnectionsChange);

  const [hoveringPort, setHoveringPort] = useState<
    HighlightedPort | undefined
  >();
  const hoveringPortTimeout = useRef<number | undefined>();
  const [
    hoveringShowPortInfo,
    { setTrue: showPortInfo, setFalse: hidePortInfo },
  ] = useBoolean(false);
  const closestPort = useRecoilValue(draggingWireClosestPortState);

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

  useEffect(() => {
    recalculatePortPositions();
  }, [recalculatePortPositions]);

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

  const defaultCanvasContextMenu: ContextMenuConfigContextData | null =
    useMemo(() => {
      return {
        type: 'blankSpace',
        data: [],
      };
    }, [contextMenu]);

  const canvasContextMenu = useStableCallback((event: React.MouseEvent) => {
    event.preventDefault();
    console.log(`x: ${event.clientX}, y: ${event.clientY}`);
    handleContextMenu(event);
  });

  const canvasMouseDown = useStableCallback((event: React.MouseEvent) => {
    // Check if only dragging canvas is true
    if (!isOnlyDraggingCanvas) return;

    // Check if main button (ususally the left button) is pressed
    if (event.button !== 0) return;

    // Check if canvas is mouse-down
    // if (
    //   (event.target as HTMLElement).classList.contains('my-canvas') === false
    // ) {
    //   return;
    // }

    event.preventDefault();

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

      recalculatePortPositions();

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
    return draggingNodes.flatMap((draggingNode: Node) =>
      connections.filter(
        (c: NodeConnection) =>
          c.toNodeId === draggingNode.id || c.fromNodeId === draggingNode.id,
      ),
    );
  }, [nodes, connections]);

  const selectingUniqueNodeIds = useMemo(() => {
    const nodeSet = new Set(selectingNodeIds);

    if (hoveringNodeId && !hoveringPort) {
      nodeSet.add(hoveringNodeId);
    }

    // console.log(`selectingUniqueNodeIds: ${JSON.stringify([...nodeSet])}`);

    return [...nodeSet];
  }, [selectingNodeIds, hoveringNodeId, hoveringPort]);

  const onNodeSizeChange = (node: Node, width: number, height: number) => {
    onNodesChange(
      produce(nodes, (draft) => {
        const nodeToChange = draft.find((n) => n.id === node.id);

        console.log(
          `onNodeSizeChange - onNodesChange: nodeToChange: ${nodeToChange?.id}`,
        );

        if (nodeToChange) {
          nodeToChange.visualInfo.size.width = width;
          nodeToChange.visualInfo.size.height = height;
        }
      }),
    );

    console.log(
      `onNodeSizeChange: node: ${node.id}, width: ${width}, height: ${height}`,
    );
  };

  const onNodeSelect = (node: Node) => {
    onNodesSelect([node]);

    // console.log(`onNodeSelect: node: ${node.id}`);
  };

  const onNodeMouseOver = useStableCallback(
    (event: React.MouseEvent, nodeId: string) => {
      setHoveringNodeId(nodeId);

      // console.log(`onNodeMouseOver: nodeId: ${nodeId}`);
    },
  );

  const onNodeMouseOut = useStableCallback((event: React.MouseEvent) => {
    setHoveringNodeId(undefined);

    // console.log('onNodeMouseOut');
  });

  const isMinimized: boolean = canvasPosition.zoom < 0.6;

  return (
    <div>
      <DebugOverlay enabled={true} />
      <DndContext onDragStart={onNodeStartDrag} onDragEnd={onNodeEndDrag}>
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

                if (draggingNodes.some((n) => n.id === nodeToRender.id)) {
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
                    onNodeSizeChange={onNodeSizeChange}
                    onNodeSelect={onNodeSelect}
                    onNodeMouseOver={onNodeMouseOver}
                    onNodeMouseOut={onNodeMouseOut}
                    onWireStartDrag={onWireStartDrag}
                    onWireEndDrag={onWireEndDrag}
                  />
                  // TODO: render connections, consider duplicate connections
                );
              })}
            </div>
            <DragOverlay
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
              {draggingNodes.map((draggingNode: Node) => (
                <VisualNode
                  key={draggingNode.id}
                  node={draggingNode}
                  connections={draggingNodeConnections}
                  isOverlay
                  isMinimized={isMinimized}
                  canvasZoom={canvasPosition.zoom}
                />
              ))}
            </DragOverlay>
          </div>
          <WireLayer
            connections={connections}
            portPositions={portPositions}
            draggingWire={draggingWire}
            isDraggingFromNode={draggingNodes.length > 0}
            highlightedNodeIds={selectingUniqueNodeIds}
            highlightedPort={hoveringPort}
          />
          <CSSTransition
            classNames="context-menu-box"
            nodeRef={contextMenuRef}
            in={showContextMenu && !!defaultCanvasContextMenu}
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
              context={defaultCanvasContextMenu!}
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
