import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

import styled from '@emotion/styled';
import { orderBy } from 'lodash-es';
import { ErrorBoundary } from 'react-error-boundary';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { PartialWire, RenderedWire } from './Wire';
import { useCanvasPosition } from '../hooks/useCanvasPosition';
import { useStableCallback } from '../hooks/useStableCallback';
import { showContextMenuState } from '../state/contextmenu';
import { nodeIODefState, nodeMapState } from '../state/node';
import {
  draggingWireClosestPortState,
  hoveringWireIdState,
  hoveringWirePortIdState,
  isSelectingMultiWiresState,
  selectingWireIdsState,
} from '../state/wire';
import { NodeInputPortDef, RecordId } from '../types/studio.type';
import { WireLayerProps } from '../types/wire.type';

const WireLayerContainer = styled.svg`
  position: absolute;
  height: 100%;
  width: 100%;
  pointer-events: none;
  top: 0;
  left: 0;
  z-index: 0;
  pointer-events: none;

  path {
    stroke-linecap: butt;
    fill: none;
    stroke: red;
    pointer-events: auto;
  }

  .wire.highlighted {
    stroke: var(--primary-color);

    stroke-dasharray: 5;
    animation: dashdraw 0.5s linear infinite;
  }

  .wire-port {
    stroke: var(--primary-color);
    pointer-events: auto;
  }

  @keyframes dashdraw {
    from {
      stroke-dashoffset: 10;
    }
  }
`;

export const WireLayer: FC<WireLayerProps> = ({
  connections,
  portPositions,
  draggingWire,
  isDraggingFromNode,
  highlightedNodeIds,
  highlightedPort,
  onWiresSelect,
}: WireLayerProps) => {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [closestPort, setClosestPort] = useRecoilState(
    draggingWireClosestPortState,
  );
  const nodeMap = useRecoilValue(nodeMapState);
  const nodeIODefMap = useRecoilValue(nodeIODefState);
  const showContextMenu = useRecoilValue(showContextMenuState);
  const isSelectingMultiWires = useRecoilValue(isSelectingMultiWiresState);
  const [selectingWireIds, setSelectingWireIds] = useRecoilState(
    selectingWireIdsState,
  );
  const [hoveringWireId, setHoveringWireId] =
    useRecoilState(hoveringWireIdState);
  const [hoveringWirePortId, setHoveringWirePortId] = useRecoilState(
    hoveringWirePortIdState,
  );
  const { canvasPosition, clientToCanvasPosition } = useCanvasPosition();
  const mousePositionCanvas = clientToCanvasPosition(
    mousePosition.x,
    mousePosition.y,
  );

  const selectingUniqueWireIds = useMemo(() => {
    const wireSet = new Set(selectingWireIds);

    return [...wireSet];
  }, [selectingWireIds]);

  const onWireSelect = useCallback(
    (wireId: string) => {
      onWiresSelect?.([wireId], isSelectingMultiWires);
    },
    [isSelectingMultiWires],
  );

  const onMouseDownWireLayer = useStableCallback((e: MouseEvent) => {
    if (!e.target || e.button !== 0 || showContextMenu) {
      return;
    }
    const clickingWire = (e.target as HTMLElement).closest('.wire-interaction');
    if (!clickingWire) {
      const { clientX, clientY } = e;
      setMousePosition({ x: clientX, y: clientY });
      setSelectingWireIds([]);
    } else {
      onWireSelect?.(clickingWire.id);
    }
  });

  const onMouseMoveWireLayer = useCallback(
    (e: MouseEvent) => {
      const { clientX, clientY } = e;

      if (!isDraggingFromNode && !draggingWire) {
        const hoveringEl = document.elementFromPoint(
          clientX,
          clientY,
        ) as HTMLElement;

        if (!hoveringEl) {
          return;
        }

        const hoveringWire = hoveringEl.closest('.wire-interaction');
        const hoveringWirePort = hoveringEl.closest('.wire-port');

        const wireId: string | undefined =
          hoveringWire?.id || hoveringWirePort?.id;

        if (!wireId) {
          setHoveringWireId(undefined);
          setHoveringWirePortId(undefined);
          return;
        }

        setHoveringWireId(wireId);

        if (hoveringWirePort) {
          setHoveringWirePortId(wireId);
        } else {
          setHoveringWirePortId(undefined);
        }

        return;
      }

      setHoveringWireId(undefined);
      setHoveringWirePortId(undefined);
      setMousePosition({ x: clientX, y: clientY });

      if (draggingWire) {
        const hoverElements: Element[] = document
          .elementsFromPoint(clientX, clientY)
          .filter((el) => el.classList.contains('port-hover-area'));

        if (hoverElements.length === 0) {
          setClosestPort(undefined);
        } else {
          const closestHoverEl = orderBy(hoverElements, (el) => {
            const elPosition: DOMRect = el.getBoundingClientRect();
            const elCenter = {
              x: elPosition.x + elPosition.width / 2,
              y: elPosition.y + elPosition.height / 2,
            };
            const distance = Math.sqrt(
              Math.pow(clientX - elCenter.x, 2) +
                Math.pow(clientY - elCenter.y, 2),
            );

            return distance;
          })[0] as HTMLElement;

          const nodeId = closestHoverEl!.parentElement!.dataset.nodeid as
            | RecordId
            | undefined;
          const portName = closestHoverEl!.parentElement!.dataset.portname as
            | string
            | undefined;

          if (nodeId && portName) {
            const nodeIO = nodeIODefMap[nodeId!];
            const input: NodeInputPortDef = nodeIO!.inputDefs.find(
              (def) => def.nodeId === nodeId && def.name === portName,
            )!;

            setClosestPort({
              nodeId,
              portName,
              input,
              portEl: closestHoverEl.parentElement!,
            });
            // setClosestPort(undefined);
          } else {
            setClosestPort(undefined);
          }
        }
      } else if (closestPort !== undefined) {
        setClosestPort(undefined);
      }
    },
    [
      draggingWire,
      isDraggingFromNode,
      nodeIODefMap,
      closestPort,
      hoveringWireId,
      hoveringWirePortId,
      setClosestPort,
      setHoveringWireId,
      setHoveringWirePortId,
    ],
  );

  useEffect(() => {
    window.addEventListener('mousedown', onMouseDownWireLayer, {
      capture: true,
    });
    window.addEventListener('mousemove', onMouseMoveWireLayer);
    return () => {
      window.removeEventListener('mousedown', onMouseDownWireLayer, {
        capture: true,
      });
      window.removeEventListener('mousemove', onMouseMoveWireLayer);
    };
  }, [onMouseDownWireLayer, onMouseMoveWireLayer]);

  return (
    <WireLayerContainer>
      <g
        transform={`scale(${canvasPosition.zoom}) translate(${canvasPosition.x}, ${canvasPosition.y})`}
      >
        {draggingWire && (
          <ErrorBoundary fallback={<></>} key="wire-dragging">
            {draggingWire.toNodeId && draggingWire.toPortName ? (
              <RenderedWire
                connection={{
                  fromNodeId: draggingWire.fromNodeId,
                  fromPortName: draggingWire.fromPortName,
                  toNodeId: draggingWire.toNodeId,
                  toPortName: draggingWire.toPortName,
                }}
                nodeMap={nodeMap}
                portPositions={portPositions}
              />
            ) : (
              <PartialWire
                connection={{
                  nodeId: draggingWire.fromNodeId,
                  portName: draggingWire.fromPortName,
                  toX: mousePositionCanvas.x,
                  toY: mousePositionCanvas.y,
                }}
                portPositions={portPositions}
              />
            )}
          </ErrorBoundary>
        )}
        {connections.map((c) => {
          const wireId = `wire-${c.fromNodeId}-${c.fromPortName}-${c.toNodeId}-${c.toPortName}`;

          const isHighlightedNode: boolean | undefined =
            highlightedNodeIds?.includes(c.fromNodeId) ||
            highlightedNodeIds?.includes(c.toNodeId);

          const isHighlightedPort: boolean | undefined =
            highlightedPort &&
            (highlightedPort.isInput ? c.toNodeId : c.fromNodeId) ===
              highlightedPort.nodeId &&
            (highlightedPort.isInput ? c.toPortName : c.fromPortName) ===
              highlightedPort.portName;

          const isHoveringWire: boolean =
            hoveringWireId !== undefined && hoveringWireId === wireId;

          const isHoveringWirePort: boolean =
            hoveringWirePortId !== undefined && hoveringWirePortId === wireId;

          const isHighlighted: boolean =
            isHighlightedNode ||
            isHighlightedPort ||
            isHoveringWire ||
            isHoveringWirePort;

          return (
            <ErrorBoundary
              fallback={<></>}
              key={`wire-${c.fromNodeId}-${c.fromPortName}-${c.toNodeId}-${c.toPortName}`}
            >
              <RenderedWire
                connection={c}
                nodeMap={nodeMap}
                portPositions={portPositions}
                isSelecting={selectingUniqueWireIds.includes(wireId)}
                isHighlighted={!!isHighlighted}
                isHoveringPort={!!isHoveringWirePort}
              />
            </ErrorBoundary>
          );
        })}
      </g>
    </WireLayerContainer>
  );
};
