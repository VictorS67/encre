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
    isSelected,
    isHighlighted,
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
        isSelected={isSelected}
        isHighlighted={isHighlighted}
      />
    );
  },
);

SmoothStepWire.displayName = 'SmoothStepWire';
