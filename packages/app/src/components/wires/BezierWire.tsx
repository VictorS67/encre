import React, { FC, memo } from 'react';

import { BezierWireProps, WireProps } from '../../types/wire.type';
import { getBezierPath } from '../../utils/wires/bezier';

import { BaseWire } from './BaseWire';

export const BezierWire: FC<WireProps<'bezier'>> = memo(
  ({
    id,
    startX,
    startY,
    endX,
    endY,
    isSelecting,
    isHighlighted,
    isHoveringPort,
    wireOptions,
  }: BezierWireProps) => {
    const { path, centerX, centerY } = getBezierPath({
      startX,
      startY,
      endX,
      endY,
      curvature: wireOptions?.curvature,
    });

    return (
      <BaseWire
        id={id}
        path={path}
        center={{ centerX, centerY }}
        isSelecting={isSelecting}
        isHighlighted={isHighlighted}
        isHoveringPort={isHoveringPort}
      />
    );
  },
);

BezierWire.displayName = 'BezierWire';
