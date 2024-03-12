import React, { FC, memo, useLayoutEffect } from 'react';

import clsx from 'clsx';
import { ErrorBoundary } from 'react-error-boundary';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { AdaptiveBezierWire } from './wires/AdaptiveBezierWire';
import { BezierWire } from './wires/BezierWire';
import { SmoothStepWire } from './wires/SmoothStepWire';
import { StraightWire } from './wires/StraightWire';
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
} from '../types/wire.type';

export const RenderedWire: FC<RenderedWireProps> = ({
  connection,
  nodeMap,
  portPositions,
  isSelected,
  isHighlighted,
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
  isSelected,
  isHighlighted,
}: WireControlProps) => {
  // const [selectingWireIds, setSelectingWireIds] = useRecoilState(
  //   selectingWireIdsState,
  // );
  const wireData: WireData | undefined = useRecoilValue(
    wireDataFromWireIdState(id),
  );

  // useLayoutEffect(() => {
  //   const oldIsSelected: boolean = selectingWireIds.includes(id);

  //   if (!isSelected && oldIsSelected) {
  //     setSelectingWireIds(selectingWireIds.filter((wId) => wId !== id));
  //   } else if (isSelected && !oldIsSelected) {
  //     setSelectingWireIds([...selectingWireIds, id]);
  //   }
  // }, [isSelected, selectingWireIds, setSelectingWireIds]);

  if (!wireData) {
    return (
      <AdaptiveBezierWire
        id={id}
        startX={startX}
        startY={startY}
        endX={endX}
        endY={endY}
        isSelected={isSelected}
        isHighlighted={isHighlighted}
        wireOptions={defaultWireOptions['adaptive-bezier']}
      />
    );
  }

  if (wireData.wireType === 'adaptive-bezier') {
    return (
      <AdaptiveBezierWire
        id={id}
        startX={startX}
        startY={startY}
        endX={endX}
        endY={endY}
        isSelected={isSelected}
        isHighlighted={isHighlighted}
        wireOptions={wireData?.wireOptions as AdaptiveBezierWireOptions}
      />
    );
  } else if (wireData.wireType === 'bezier') {
    return (
      <BezierWire
        id={id}
        startX={startX}
        startY={startY}
        endX={endX}
        endY={endY}
        isSelected={isSelected}
        isHighlighted={isHighlighted}
        wireOptions={wireData?.wireOptions as BezierWireOptions}
      />
    );
  } else if (wireData.wireType === 'smooth-step') {
    return (
      <SmoothStepWire
        id={id}
        startX={startX}
        startY={startY}
        endX={endX}
        endY={endY}
        isSelected={isSelected}
        isHighlighted={isHighlighted}
        wireOptions={wireData?.wireOptions as SmoothStepWireOptions}
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
      isSelected={isSelected}
      isHighlighted={isHighlighted}
      wireOptions={wireData?.wireOptions as StraightWireOptions}
    />
  );
};
