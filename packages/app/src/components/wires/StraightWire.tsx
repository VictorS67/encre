import React, { FC, memo } from 'react';

import { BaseWire } from './BaseWire';
import { StraightWireProps, WireProps } from '../../types/wire.type';
import { getStraightPath } from '../../utils/wires/straight';

export const StraightWire: FC<WireProps<'straight'>> = memo(
  ({
    id,
    startX,
    startY,
    endX,
    endY,
    isSelecting,
    isHighlighted,
    isHoveringPort,
  }: StraightWireProps) => {
    const { path, centerX, centerY } = getStraightPath({
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

StraightWire.displayName = 'StraightWire';
