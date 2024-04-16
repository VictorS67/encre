import React, { FC, memo } from 'react';

import { BaseWire } from './BaseWire';
import { AdaptiveBezierWireProps, WireProps } from '../../types/wire.type';
import { getAdaptiveBezierPath } from '../../utils/wires/adaptiveBezier';

export const AdaptiveBezierWire: FC<WireProps<'adaptive-bezier'>> = memo(
  ({
    id,
    startX,
    startY,
    endX,
    endY,
    isSelected,
    isHighlighted,
    isHoveringPort,
  }: AdaptiveBezierWireProps) => {
    const { path, centerX, centerY } = getAdaptiveBezierPath({
      startX,
      startY,
      endX,
      endY,
    });

    return (
      <BaseWire
        id={id}
        path={path}
        center={{ centerX, centerY }}
        isSelected={isSelected}
        isHighlighted={isHighlighted}
        isHoveringPort={isHoveringPort}
      />
    );
  },
);

AdaptiveBezierWire.displayName = 'AdaptiveBezierWire';
