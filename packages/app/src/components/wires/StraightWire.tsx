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
    isSelected,
    isHighlighted,
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
        isSelected={isSelected}
        isHighlighted={isHighlighted}
      />
    );
  },
);

StraightWire.displayName = 'StraightWire';
