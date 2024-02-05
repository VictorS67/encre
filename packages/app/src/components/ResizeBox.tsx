import React, { FC, useRef } from 'react';

import { useLatest } from 'ahooks';

import { ReiszeBoxProps } from '../types/resizebox.type';

export const ResizeBox: FC<ReiszeBoxProps> = ({
  onResizeStart,
  onResizeMove,
  onResizeEnd,
}) => {
  const onResizeStartLatest = useLatest(onResizeStart);
  const onResizeMoveLatest = useLatest(onResizeMove);
  const onResizeEndLatest = useLatest(onResizeEnd);

  const onResizeMouseMoveRef = useRef<(e: React.MouseEvent) => void>(() => {});
  const onResizeMouseUpRef = useRef<(e: React.MouseEvent) => void>(() => {});

  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onResizeStartLatest.current?.(e);

    onResizeMouseMoveRef.current = (event) =>
      onResizeMoveLatest.current?.(event);
    onResizeMouseUpRef.current = (event) => onMouseUp(event);

    window.addEventListener('mousemove', onResizeMouseMoveRef.current as any, {
      passive: true,
      capture: true,
    });

    window.addEventListener('mouseup', onResizeMouseUpRef.current as any, {
      capture: true,
    });
  };

  const onMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    onResizeEndLatest.current?.(e);

    window.removeEventListener(
      'mousemove',
      onResizeMouseMoveRef.current as any,
      {
        capture: true,
      },
    );

    window.removeEventListener('mouseup', onResizeMouseUpRef.current as any, {
      capture: true,
    });
  };

  return <div className="resize-box" onMouseDown={onMouseDown}></div>;
};
