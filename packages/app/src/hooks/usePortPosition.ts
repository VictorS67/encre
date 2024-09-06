import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { useRecoilValue } from 'recoil';

import { nodeMapState } from '../state/node';
import { PortPositons } from '../types/port.type';
import { Node } from '../types/studio.type';

import { useStableCallback } from './useStableCallback';

export function useNodePortPositions() {
  const [portPositions, setPortPositions] = useState<PortPositons>({});
  const nodeMap = useRecoilValue(nodeMapState);
  const canvasRef = useRef<HTMLDivElement>(null);

  const calculatePortPosition = useStableCallback(
    (
      currNodeMap: Record<string, Node>,
      el: HTMLDivElement,
      isOverlayNode: boolean,
      seen: Set<string>,
    ) => {
      const nodeId = el.dataset.nodeid as string | undefined;
      const portType = el.dataset.porttype as 'input' | 'output' | undefined;
      const portName = el.dataset.portname as string | undefined;
      if (!nodeId || !portName || !portType) return null;

      const key = `${nodeId}-${portType}-${portName}`;
      if (seen.has(key)) return null;

      const node = currNodeMap[nodeId];
      if (!node) return null;

      const nodePosition = { left: 0, top: 0 };

      let { x, y } = node.visualInfo.position;
      let currEl: HTMLElement | null = el;
      while (currEl && !currEl.classList.contains('node')) {
        nodePosition.left += currEl.offsetLeft;
        nodePosition.top += currEl.offsetTop;
        currEl = currEl.offsetParent as HTMLElement | null;
      }

      if (isOverlayNode) {
        const overlayTransform: string | undefined = (
          el.closest('.dragging-node-area') as HTMLElement | null
        )?.style.transform;

        if (overlayTransform) {
          const match =
            /translate3d\(([\d.-]+)px, ([\d.-]+)px, ([\d.-]*)px\)/.exec(
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
            (x +
              nodePosition.left +
              (portType === 'output' ? el.offsetWidth / 0.8 : 0)) *
              precision,
          ) / precision,
        y:
          Math.round(
            (y + nodePosition.top + el.offsetHeight / 1.5) * precision,
          ) / precision,
      };

      seen.add(key);

      return { key, pos };
    },
  );

  const recalculate = useCallback(() => {
    if (!canvasRef.current) return;

    const portEls = canvasRef.current.querySelectorAll('.port-circle');

    let changed = false;
    const newPortPositions: PortPositons = { ...portPositions };
    const seen = new Set<string>();

    portEls.forEach((el) => {
      const isOverlayNode: boolean = el.closest('.overlayed') !== null;
      const result = calculatePortPosition(
        nodeMap,
        el as HTMLDivElement,
        isOverlayNode,
        seen,
      );

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
  }, [nodeMap, portPositions, canvasRef, setPortPositions]);

  useLayoutEffect(() => {
    recalculate();
  }, [recalculate]);

  return { portPositions, canvasRef, recalculate };
}

export function getPortPosition(
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
