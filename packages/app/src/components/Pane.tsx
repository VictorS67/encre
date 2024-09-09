import React, { FC } from 'react';

import { PaneProps } from '../types/splitpane.type';

export const Pane: FC<PaneProps> = ({
  children,
  style,
  className,
  role,
  title,
}) => {
  return (
    <div role={role} title={title} className={className} style={style}>
      {children}
    </div>
  );
};
