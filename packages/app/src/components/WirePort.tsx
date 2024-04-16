import React, { FC } from 'react';

import styled from '@emotion/styled';

import { WirePortProps } from '../types/port.type';

export const WirePort: FC<WirePortProps> = ({
  id,
  centerX,
  centerY,
  isHighlighted,
  isHoveringPort,
  radius = 5,
  strokeWidth = 3,
  onMouseDown,
}: WirePortProps) => {
  return (
    <circle
      id={id}
      className={'wire-port'}
      data-wireid={id}
      data-contextmenutype={id}
      cx={centerX}
      cy={centerY}
      r={radius}
      strokeWidth={strokeWidth}
      opacity={isHighlighted ? 1 : 0}
      stroke="transparent"
      fill={
        isHoveringPort
          ? 'var(--canvas-background-color)'
          : 'var(--primary-color)'
      }
      onMouseDown={onMouseDown}
    />
  );
};
