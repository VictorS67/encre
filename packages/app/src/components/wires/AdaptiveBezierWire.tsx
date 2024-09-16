import React, { FC, memo } from 'react';

import { AdaptiveBezierWireProps, WireProps } from '../../types/wire.type';
import { getAdaptiveBezierPath } from '../../utils/wires/adaptiveBezier';

import { BaseWire } from './BaseWire';

export const AdaptiveBezierWire: FC<WireProps<'adaptive-bezier'>> = memo(
  ({
    id,
    startX,
    startY,
    endX,
    endY,
    isSelecting,
    isHighlighted,
    isHoveringPort,
    style
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
        isSelecting={isSelecting}
        isHighlighted={isHighlighted}
        isHoveringPort={isHoveringPort}
        wireStyle={style}
      />
    );
  },
);

AdaptiveBezierWire.displayName = 'AdaptiveBezierWire';
