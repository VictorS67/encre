import React, { FC, useRef, useState } from 'react';

import { useLatest } from 'ahooks';
import clsx from 'clsx';

import { SashProps } from '../types/splitpane.type';

export const Sash: FC<SashProps> = ({
  className,
  render,
  onStartDrag,
  onDragging,
  onEndDrag,
  ...otherProps
}) => {
  const timeout = useRef<number | null>(null);
  const [active, setActive] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const onDragStartLatest = useLatest(onStartDrag);
  const onDraggingLatest = useLatest(onDragging);
  const onDragEndLatest = useLatest(onEndDrag);

  const onMouseMoveRef = useRef<(e: React.MouseEvent) => void>(() => {});
  const onMouseUpRef = useRef<(e: React.MouseEvent) => void>(() => {});

  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDragStartLatest.current?.(e);

    onMouseMoveRef.current = (event) => onDraggingLatest.current?.(event);
    onMouseUpRef.current = (event) => onMouseUp(event);

    setIsDragging(true);

    window.addEventListener('mousemove', onMouseMoveRef.current as any, {
      passive: true,
      capture: true,
    });

    window.addEventListener('mouseup', onMouseUpRef.current as any, {
      capture: true,
    });
  };

  const onMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDragEndLatest.current?.(e);

    setIsDragging(false);

    window.removeEventListener('mousemove', onMouseMoveRef.current as any, {
      capture: true,
    });

    window.removeEventListener('mouseup', onMouseUpRef.current as any, {
      capture: true,
    });
  };

  return (
    <div
      className={clsx('sash', className)}
      {...otherProps}
      onMouseEnter={() => {
        timeout.current = window.setTimeout(() => {
          setActive(true);
        }, 150);
      }}
      onMouseLeave={() => {
        if (timeout.current) {
          setActive(false);
          window.clearTimeout(timeout.current);
        }
      }}
      onMouseDown={onMouseDown}
    >
      {render(isDragging || active)}
    </div>
  );
};
