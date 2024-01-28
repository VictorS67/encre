import React, { FC, useRef } from 'react';

import { css } from '@emotion/react';
import { useLatest } from 'ahooks';

import { ReiszeBoxProps } from '../types/resizebox.type';

const styling = css`
  width: 10px;
  height: 100px;
  bottom: 0;
  cursor: ew-resize;
  position: absolute;
  right: 0;
  border-top-left-radius: 50px;
  border-bottom-right-radius: 50px;
  background-color: rgba(255, 255, 255, 0.25);
`;

export const ResizeBox: FC<ReiszeBoxProps> = ({
  onResizeStart,
  onResizeMove,
  onResizeEnd,
}) => {
  const onResizeStartLatest = useLatest(onResizeStart);
  const onResizeMoveLatest = useLatest(onResizeMove);
  const onResizeEndLatest = useLatest(onResizeEnd);

  const onResizeMoveRef = useRef<(e: React.MouseEvent) => void>(() => {});
  const onResizeMouseUpRef = useRef<(e: React.MouseEvent) => void>(() => {});

  return (
    <div
      style={{
        width: '10px',
        height: '10px',
        bottom: 0,
        cursor: 'nw-resize',
        position: 'absolute',
        right: 0,
        borderTopLeftRadius: '10px',
        // borderBottomRightRadius: '50px',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
      }}
    ></div>
  );
};
