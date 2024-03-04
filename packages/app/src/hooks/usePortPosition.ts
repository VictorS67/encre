import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { useRecoilValue } from 'recoil';

import { nodeMapState } from '../state/node';
import { PortPositons } from '../types/port.type';
import { Node } from '../types/studio.type';

export function useNodePortPositons() {
  const [portPositions, setPortPositions] = useState<PortPositons>({});
  const nodeMap = useRecoilValue(nodeMapState);
  const canvasRef = useRef<HTMLDivElement>(null);

  const calculatePosition = useCallback(
    (el: HTMLDivElement, isOverlayNode: boolean) => {
      const nodeId = el.dataset.nodeid as string | undefined;
      const portName = el.dataset.portname as string | undefined;
      const portType = el.dataset.porttype as 'input' | 'output' | undefined;

      if (!nodeId || !portName || !portType) return null;

      const key = `${nodeId}-${portType}-${portName}`;
      const node = nodeMap[nodeId];
      if (!node) return null;

      let { x, y } = node.visualInfo.position;

      const positionFromNode = { left: 0, top: 0 };
      let currentElement: HTMLElement | null = el;

      while (currentElement && !currentElement.classList.contains('node')) {
        positionFromNode.left += currentElement.offsetLeft;
        positionFromNode.top += currentElement.offsetTop;
        currentElement = currentElement.offsetParent as HTMLElement | null;
      }

      if (isOverlayNode) {
        const overlayTransform: string | undefined = (
          el.closest('.node') as HTMLElement | null
        )?.style.transform;

        if (overlayTransform) {
          const match =
            /translate3d\((?:([\d.-]+)(?:px?)), *(?:([\d.-]+)(?:px?)), *(?:([\d.-]+)(?:px?))?\)/.exec(
              overlayTransform,
            );
          const [, deltaX, deltaY] = match ?? [];

          if (deltaX && deltaY) {
            x += parseFloat(deltaX || '0');
            y += parseFloat(deltaY || '0');
          }
        }
      }

      const precision = 10;
      const pos = {
        x:
          Math.round(
            (x + positionFromNode.left + el.offsetWidth / 2) * precision,
          ) / precision,
        y:
          Math.round(
            (y + positionFromNode.top + el.offsetHeight / 2) * precision,
          ) / precision,
      };

      return { key, pos };
    },
    [nodeMap],
  );

  const recalculate = useCallback(() => {
    if (!canvasRef.current) return;

    const portEls = canvasRef.current.querySelectorAll('.port-circle');

    let changed = false;
    const newPortPositions = { ...portPositions };

    portEls.forEach((el) => {
      const isOverlayNode: boolean = el.closest('.overlayed') !== null;
      const result = calculatePosition(el as HTMLDivElement, isOverlayNode);

      if (
        result &&
        (portPositions[result.key]?.x !== result.pos.x ||
          portPositions[result.key]?.y !== result.pos.y)
      ) {
        changed = true;
        newPortPositions[result.key] = result.pos;
      }
    });

    if (changed) {
      setPortPositions(newPortPositions);
    }
  }, [portPositions, calculatePosition]);

  useLayoutEffect(() => {
    recalculate();
  }, [recalculate]);

  return { portPositions, canvasRef, recalculate };
}

export function getPortPositon(
  node: Node,
  portName: string,
  portPositions: PortPositons,
  isInput?: boolean,
): { x: number; y: number } {
  if (!node) {
    return { x: 0, y: 0 };
  }

  if (portName) {
    const key = `${node.id}-${isInput ? 'input' : 'output'}-${portName}`;
    const portPosition = portPositions[key];

    if (portPosition) {
      return { x: portPosition.x, y: portPosition.y };
    } else {
      return {
        x: node.visualInfo.position.x + 100,
        y: node.visualInfo.position.y + 100,
      };
    }
  }

  return { x: 0, y: 0 };
}
