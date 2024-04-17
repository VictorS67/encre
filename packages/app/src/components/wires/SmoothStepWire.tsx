import React, { FC, memo } from 'react';

import { BaseWire } from './BaseWire';
import { SmoothStepWireProps, WireProps } from '../../types/wire.type';
import { getStepPath } from '../../utils/wires/step';

export const SmoothStepWire: FC<WireProps<'smooth-step'>> = memo(
  ({
    id,
    startX,
    startY,
    endX,
    endY,
    isSelecting,
    isHighlighted,
    isHoveringPort,
  }: SmoothStepWireProps) => {
    const { path, centerX, centerY } = getStepPath({
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
      />
    );
  },
);

SmoothStepWire.displayName = 'SmoothStepWire';
