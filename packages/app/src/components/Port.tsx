import React, { FC, memo, useRef } from 'react';

import clsx from 'clsx';

import { PortProps } from '../types/port.type';

export const Port: FC<PortProps> = memo(
  ({
    nodeId,
    title,
    definition,
    draggingDataType,
    isDragToEnabled,
    isClosestPortToWire,
    isInput,
    isConnected,
    onMouseDown,
    onMouseUp,
  }: PortProps) => {
    const ref = useRef<HTMLDivElement>(null);

    return (
      <div
        key={title}
        className={clsx(
          'port',
          { connected: isConnected, closest: isClosestPortToWire },
          {
            'input-port': isInput,
            'output-port': !isInput,
          },
        )}
      >
        <div
          ref={ref}
          className={clsx('port-circle')}
          onMouseDown={(e) => onMouseDown?.(e, title, isInput)}
          onMouseUp={(e) => onMouseUp?.(e, title)}
          data-nodeid={nodeId}
          data-portname={title}
          data-porttype={isInput ? 'input' : 'output'}
        >
          {isDragToEnabled && <div className={clsx('port-hover-area')} />}
        </div>
        <div className={clsx('port-label')}>{title}</div>
      </div>
    );
  },
);

Port.displayName = 'Port';
