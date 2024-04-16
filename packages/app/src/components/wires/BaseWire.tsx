import React, { FC, useLayoutEffect } from 'react';

import { useToggle } from 'ahooks';
import clsx from 'clsx';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { updateWireDataState, wireDataFromWireIdState } from '../../state/wire';
import { BaseWireProps, WireData } from '../../types/wire.type';
import { WirePort } from '../WirePort';

export const BaseWire: FC<BaseWireProps> = ({
  id,
  path,
  center,
  wireStyle,
  interactionWidth = 20,
  startMarker,
  endMarker,
  isSelected,
  isHighlighted,
  isHoveringPort,
  className,
}: BaseWireProps) => {
  return (
    <g opacity={isHighlighted || isSelected ? 1 : 0.5}>
      <path
        className={clsx(
          'wire',
          {
            selected: isSelected,
            highlighted: isHighlighted,
          },
          className?.split(' '),
        )}
        id={id}
        style={wireStyle}
        d={path}
        fill="none"
        strokeWidth={3}
        markerStart={startMarker}
        markerEnd={endMarker}
      />
      {interactionWidth && (
        <path
          id={id}
          d={path}
          fill="none"
          strokeOpacity={0}
          strokeWidth={interactionWidth}
          className="wire-interaction"
        />
      )}
      {center && (
        <WirePort
          id={id}
          centerX={center.centerX}
          centerY={center.centerY}
          isHighlighted={isHighlighted}
          isHoveringPort={isHoveringPort}
        />
      )}
    </g>
  );
};
