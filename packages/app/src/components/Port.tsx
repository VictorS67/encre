import React, { FC, memo, useRef } from 'react';

import clsx from 'clsx';

import { PortProps } from '../types/port.type';

export const Port: FC<PortProps> = memo(
  ({ key, nodeId, title, definition, isInput, isConnected }: PortProps) => {
    const ref = useRef<HTMLDivElement>(null);

    return (
      <div
        key={key}
        className={clsx(
          'port',
          { connected: isConnected },
          {
            'input-port': isInput,
            'output-port': !isInput,
          },
        )}
      >
        <div ref={ref} className={clsx('port-circle')}></div>
        <div className={clsx('port-label')}>{title}</div>
      </div>
    );
  },
);

Port.displayName = 'Port';
