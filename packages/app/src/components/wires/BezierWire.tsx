import React, { FC, memo } from 'react';

import { BaseWire } from './BaseWire';
import { BezierWireProps, WireProps } from '../../types/wire.type';
import { getBezierPath } from '../../utils/wires/bezier';

export const BezierWire: FC<WireProps<'bezier'>> = memo(
  ({
    id,
    startX,
    startY,
    endX,
    endY,
    isSelected,
    isHighlighted,
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
        isSelected={isSelected}
        isHighlighted={isHighlighted}
      />
    );
  },
);

BezierWire.displayName = 'BezierWire';
