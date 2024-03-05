import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';

import styled from '@emotion/styled';
import { orderBy } from 'lodash-es';
import { ErrorBoundary } from 'react-error-boundary';
import { useRecoilState, useRecoilValue } from 'recoil';

import { PartialWire, RenderedWire } from './Wire';
import { useCanvasPosition } from '../hooks/useCanvasPosition';
import { useStableCallback } from '../hooks/useStableCallback';
import { nodeIODefState, nodeMapState } from '../state/node';
import { draggingWireClosestPortState } from '../state/wire';
import { NodeInputPortDef } from '../types/studio.type';
import { WireLayerProps } from '../types/wire.type';

const WireLayerContainer = styled.svg`
  position: absolute;
  height: 100%;
  width: 100%;
  pointer-events: none;
  top: 0;
  left: 0;

  path {
    stroke-linecap: butt;
    fill: none;
    stroke: red;
  }

  .wire.highlighted {
    stroke: var(--primary-color);
    transition: stroke 0.2s ease-out;
  }
`;

export const WireLayer: FC<WireLayerProps> = ({
  connections,
  portPositions,
  draggingWire,
  isDraggingFromNode,
  highlightedNodeIds,
  highlightedPort,
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
  const { canvasPosition, clientToCanvasPosition } = useCanvasPosition();
  const mousePositionCanvas = clientToCanvasPosition(
    mousePosition.x,
    mousePosition.y,
  );

  const onMouseDownWire = useStableCallback((e: MouseEvent) => {
    console.log('onMouseDownWire');

    const { clientX, clientY } = e;
    setMousePosition({ x: clientX, y: clientY });
  });

  const onMouseMoveWire = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingFromNode && !draggingWire) {
        return;
      }

      const { clientX, clientY } = e;
      setMousePosition({ x: clientX, y: clientY });

      console.log(`onMouseMoveWire: x ${clientX}, y ${clientY}`);
      console.log(`isDraggingFromNode: ${isDraggingFromNode}`);
      console.log(`draggingWire: ${JSON.stringify(draggingWire)}`);

      if (draggingWire) {
        const hoverElements: Element[] = document
          .elementsFromPoint(clientX, clientY)
          .filter((el) => el.classList.contains('port-hover-area'));

        console.log(`updating closest port: ${hoverElements.length > 0}`);

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
            | string
            | undefined;
          const portName = closestHoverEl!.parentElement!.dataset.portname as
            | string
            | undefined;

          if (nodeId && portName) {
            const nodeIO = nodeIODefMap[nodeId!];
            const input: NodeInputPortDef = nodeIO!.inputDefs.find(
              (def) => def.nodeId === nodeId && def.name === portName,
            )!;

            console.log(
              `find closest port: nodeId: ${nodeId}, portName: ${portName}, portEl: ${JSON.stringify(
                closestHoverEl.parentElement?.dataset,
              )}`,
            );

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
      setClosestPort,
    ],
  );

  useEffect(() => {
    window.addEventListener('mousedown', onMouseDownWire, { capture: true });
    window.addEventListener('mousemove', onMouseMoveWire);
    return () => {
      window.removeEventListener('mousedown', onMouseDownWire, {
        capture: true,
      });
      window.removeEventListener('mousemove', onMouseMoveWire);
    };
  }, [onMouseDownWire, onMouseMoveWire]);

  // useLayoutEffect(() => {}, [
  //   draggingWire,
  //   mousePosition.x,
  //   mousePosition.y,
  //   setClosestPort,
  // ]);

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
                isSelected={false}
                isHighlighted={false}
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
          const isHighlightedNode: boolean | undefined =
            highlightedNodeIds?.includes(c.fromNodeId) ||
            highlightedNodeIds?.includes(c.toNodeId);

          const isHighlightedPort: boolean | undefined =
            highlightedPort &&
            (highlightedPort.isInput ? c.toNodeId : c.fromNodeId) ===
              highlightedPort.nodeId &&
            (highlightedPort.isInput ? c.toPortName : c.fromPortName) ===
              highlightedPort.portName;

          const isHighlighted: boolean =
            isHighlightedNode || isHighlightedPort || false;

          return (
            <ErrorBoundary
              fallback={<></>}
              key={`wire-${c.toNodeId}-${c.toPortName}`}
            >
              <RenderedWire
                connection={c}
                nodeMap={nodeMap}
                portPositions={portPositions}
                isSelected={false}
                isHighlighted={!!isHighlighted}
              />
            </ErrorBoundary>
          );
        })}
      </g>
    </WireLayerContainer>
  );
};
