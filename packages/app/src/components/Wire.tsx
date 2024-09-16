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
import { useNodeIO } from '../hooks/useNodeIO';
import { getWireColor } from 'packages/internal/src/constants/colorUtils';

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

  const { inputDefs: fromInputDefs, outputDefs: fromOutputDefs } = useNodeIO(connection.fromNodeId);
  const { inputDefs: toInputDefs, outputDefs: toOutputDefs } = useNodeIO(connection.toNodeId);

  // Compute the color of the wire based on the connected ports' datatypes
  const wireColor = useMemo(() => {
    const fromPortDef = fromOutputDefs.find(def => def.name === connection.fromPortName) ||
                        fromInputDefs.find(def => def.name === connection.fromPortName);
    const toPortDef = toInputDefs.find(def => def.name === connection.toPortName) ||
                      toOutputDefs.find(def => def.name === connection.toPortName);

    const fromDataType = Array.isArray(fromPortDef?.type) ? fromPortDef.type[0] : fromPortDef?.type || 'unknown';
    const toDataType = Array.isArray(toPortDef?.type) ? toPortDef.type[0] : toPortDef?.type || 'unknown';

    return getWireColor(fromDataType, toDataType);
  }, [connection, fromInputDefs, fromOutputDefs, toInputDefs, toOutputDefs]);

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
        wireColor={wireColor}
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
  wireColor,
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

  const wireStyle = { stroke: wireColor };

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
        style={wireStyle}
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
        style={wireStyle}
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
        style={wireStyle}
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
        style={wireStyle}
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
      style={wireStyle}
    />
  );
};
