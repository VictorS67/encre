import React, { FC } from 'react';

import styled from '@emotion/styled';

import { WirePortProps } from '../types/port.type';

export const WirePort: FC<WirePortProps> = ({
  centerX,
  centerY,
  isSelected,
  isHighlighted,
  radius = 5,
  strokeWidth = 3,
  onMouseDown,
}: WirePortProps) => {
  return (
    <circle
      className={'wire-port'}
      cx={centerX}
      cy={centerY}
      r={radius}
      strokeWidth={strokeWidth}
      opacity={isHighlighted ? 1 : 0}
      stroke="transparent"
      fill={
        isHighlighted && isSelected
          ? 'var(--canvas-background-color)'
          : 'var(--primary-color)'
      }
      onMouseDown={onMouseDown}
    />
  );
};
