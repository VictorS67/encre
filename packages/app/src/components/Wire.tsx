import React, {
  FC,
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import clsx from 'clsx';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { defaultWireOptions } from '../hooks/useDraggingWire';
import { getPortPosition } from '../hooks/usePortPosition';
import { nodeFromNodeIdState } from '../state/node';
import { selectingWireIdsState, wireDataFromWireIdState } from '../state/wire';
import {
  AdaptiveBezierWireOptions,
  BezierWireOptions,
  PartialWireProps,
  RenderedWireProps,
  SmoothStepWireOptions,
  StraightWireOptions,
  WireControlProps,
  WireData,
  WireOptions,
  WireType,
} from '../types/wire.type';

import { AdaptiveBezierWire } from './wires/AdaptiveBezierWire';
import { BaseWire } from './wires/BaseWire';
import { BezierWire } from './wires/BezierWire';
import { SmoothStepWire } from './wires/SmoothStepWire';
import { StraightWire } from './wires/StraightWire';

export const RenderedWire: FC<RenderedWireProps> = ({
  connection,
  nodeMap,
  portPositions,
  isSelecting = false,
  isHighlighted,
  isHoveringPort,
}: RenderedWireProps) => {
  const fromNode = nodeMap[connection.fromNodeId]!;
  const toNode = nodeMap[connection.toNodeId]!;

  if (!fromNode || !toNode) {
    return null;
  }

  const startPosition = getPortPosition(
    fromNode,
    connection.fromPortName,
    portPositions,
  );
  const endPosition = getPortPosition(
    toNode,
    connection.toPortName,
    portPositions,
    true,
  );

  return (
    <ErrorBoundary fallback={<></>}>
      <WireControl
        id={`wire-${fromNode.id}-${connection.fromPortName}-${toNode.id}-${connection.toPortName}`}
        startX={startPosition.x}
        startY={startPosition.y}
        endX={endPosition.x}
        endY={endPosition.y}
        isSelecting={isSelecting}
        isHighlighted={isHighlighted}
        isHoveringPort={isHoveringPort}
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

  const startPosition = getPortPosition(
    node,
    connection.portName,
    portPositions,
  );
  const endPosition = { x: connection.toX, y: connection.toY };

  return (
    <ErrorBoundary fallback={<></>}>
      <WireControl
        id={`wire-${node.id}-${connection.portName}-partial`}
        startX={startPosition.x}
        startY={startPosition.y}
        endX={endPosition.x}
        endY={endPosition.y}
      />
    </ErrorBoundary>
  );
};

export const WireControl: FC<WireControlProps> = ({
  id,
  startX,
  startY,
  endX,
  endY,
  isSelecting,
  isHighlighted,
  isHoveringPort,
}: WireControlProps) => {
  const wireData: WireData | undefined = useRecoilValue(
    wireDataFromWireIdState(id),
  );

  const [wireType, setWireType] = useState<WireType>('adaptive-bezier');
  const [wireOptions, setWireOptions] = useState<WireOptions | undefined>(
    defaultWireOptions['adaptive-bezier'],
  );

  useEffect(() => {
    if (wireData) {
      setWireType(wireData.wireType);
      setWireOptions(wireData.wireOptions);
    }
  }, [wireData]);

  if (!wireType) {
    return (
      <AdaptiveBezierWire
        id={id}
        startX={startX}
        startY={startY}
        endX={endX}
        endY={endY}
        isSelecting={isSelecting}
        isHighlighted={isHighlighted}
        isHoveringPort={isHoveringPort}
        wireOptions={wireOptions as AdaptiveBezierWireOptions}
      />
    );
  }

  if (wireType === 'adaptive-bezier') {
    return (
      <AdaptiveBezierWire
        id={id}
        startX={startX}
        startY={startY}
        endX={endX}
        endY={endY}
        isSelecting={isSelecting}
        isHighlighted={isHighlighted}
        isHoveringPort={isHoveringPort}
        wireOptions={wireOptions as AdaptiveBezierWireOptions}
      />
    );
  } else if (wireType === 'bezier') {
    return (
      <BezierWire
        id={id}
        startX={startX}
        startY={startY}
        endX={endX}
        endY={endY}
        isSelecting={isSelecting}
        isHighlighted={isHighlighted}
        isHoveringPort={isHoveringPort}
        wireOptions={wireOptions as BezierWireOptions}
      />
    );
  } else if (wireType === 'smooth-step') {
    return (
      <SmoothStepWire
        id={id}
        startX={startX}
        startY={startY}
        endX={endX}
        endY={endY}
        isSelecting={isSelecting}
        isHighlighted={isHighlighted}
        isHoveringPort={isHoveringPort}
        wireOptions={wireOptions as SmoothStepWireOptions}
      />
    );
  }

  return (
    <StraightWire
      id={id}
      startX={startX}
      startY={startY}
      endX={endX}
      endY={endY}
      isSelecting={isSelecting}
      isHighlighted={isHighlighted}
      isHoveringPort={isHoveringPort}
      wireOptions={wireOptions as StraightWireOptions}
    />
  );
};
