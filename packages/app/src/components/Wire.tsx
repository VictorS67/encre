import React, { FC, memo } from 'react';

import clsx from 'clsx';
import { ErrorBoundary } from 'react-error-boundary';
import { useRecoilValue } from 'recoil';

import { getPortPositon } from '../hooks/usePortPosition';
import { nodeFromNodeIdState } from '../state/node';
import {
  PartialWireProps,
  RenderedWireProps,
  WireProps,
} from '../types/wire.type';

export const RenderedWire: FC<RenderedWireProps> = ({
  connection,
  nodeMap,
  portPositions,
  isSelected,
  isHighlighted,
}: RenderedWireProps) => {
  const inputNode = nodeMap[connection.inputNodeId]!;
  const outputNode = nodeMap[connection.outputNodeId]!;

  if (!inputNode || !outputNode) {
    return null;
  }

  const startPosition = getPortPositon(
    outputNode,
    connection.outputName,
    portPositions,
  );
  const endPosition = getPortPositon(
    inputNode,
    connection.outputName,
    portPositions,
    true,
  );

  return (
    <ErrorBoundary fallback={<></>}>
      <Wire
        startX={startPosition.x}
        startY={startPosition.y}
        endX={endPosition.x}
        endY={endPosition.y}
        isSelected={isSelected}
        isHighlighted={isHighlighted}
      />
    </ErrorBoundary>
  );
};

export const PartialWire: FC<PartialWireProps> = ({
  connection,
  portPositions,
}: PartialWireProps) => {
  const node = useRecoilValue(nodeFromNodeIdState(connection.nodeId));

  if (!node) {
    return null;
  }

  const startPosition = getPortPositon(
    node,
    connection.portName,
    portPositions,
  );
  const endPosition = { x: connection.toX, y: connection.toY };

  return (
    <ErrorBoundary fallback={<></>}>
      <Wire
        startX={startPosition.x}
        startY={startPosition.y}
        endX={endPosition.x}
        endY={endPosition.y}
      />
    </ErrorBoundary>
  );
};

export const Wire: FC<WireProps> = memo(
  ({ startX, startY, endX, endY, isSelected, isHighlighted }: WireProps) => {
    const deltaX = Math.abs(endX - startX);
    const offsetDistance =
      startX <= endX ? deltaX * 0.5 : Math.abs(endY - startY) * 0.6;

    const isToLeft = startX > endX;

    const curveX1 = startX + offsetDistance;
    const curveY1 = startY;
    const curveX2 = endX - offsetDistance;
    const curveY2 = endY;

    const middleY = (endY + startY) / 2;

    const wirePath =
      startX <= endX
        ? `M${startX},${startY} C${curveX1},${curveY1} ${curveX2},${curveY2} ${endX},${endY}`
        : `M${startX},${startY} C${curveX1},${curveY1} ${curveX1},${middleY} ${startX},${middleY} ` +
          `L${endX},${middleY} C${curveX2},${middleY} ${curveX2},${curveY2} ${endX},${endY}`;

    return (
      <path
        className={clsx('wire', {
          selected: isSelected,
          highlighted: isHighlighted,
          toleft: isToLeft,
        })}
        d={wirePath}
      />
    );
  },
);

Wire.displayName = 'Wire';
