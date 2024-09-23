import React, { useCallback, useMemo, useRef, useState } from 'react';

import { throttle } from 'lodash-es';

import { SplitPaneConfigs } from '../types/splitpane.type';

export function useDraggingSplitPane({
  sizes,
  paneLimitSizes,
  splitAxis,
  performanceMode,
  onStartDrag,
  onEndDrag,
  onSizesChange,
}: SplitPaneConfigs) {
  const axis = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cacheSizes = useRef<{
    sizes: (string | number)[];
    sashPosSizes: (string | number)[];
  }>({
    sizes: [],
    sashPosSizes: [],
  });

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const sashPosSizes = useMemo(
    () => sizes.reduce((a, b) => [...a, a[a.length - 1] + b], [0]),
    [...sizes],
  );

  const onDraggingStart = useCallback(
    (e: React.MouseEvent) => {
      document?.body?.classList?.add('non-user-select');
      axis.current = { x: e.pageX, y: e.pageY };
      cacheSizes.current = { sizes, sashPosSizes };
      setIsDragging(true);
      onStartDrag?.(e);
    },
    [onStartDrag, sizes, sashPosSizes],
  );

  const onDraggingEnd = useCallback(
    (e: React.MouseEvent) => {
      document?.body?.classList?.remove('non-user-select');
      axis.current = { x: e.pageX, y: e.pageY };
      cacheSizes.current = { sizes, sashPosSizes };
      setIsDragging(false);
      onEndDrag?.(e);
    },
    [onEndDrag, sizes, sashPosSizes],
  );

  const onDraggingMove = useCallback(
    (e: React.MouseEvent, i: number) => {
      const currAxis = { x: e.pageX, y: e.pageY };
      let distanceX = currAxis[splitAxis] - axis.current[splitAxis];

      const leftBorder = -Math.min(
        sizes[i] - paneLimitSizes[i][0],
        paneLimitSizes[i + 1][1] - sizes[i + 1],
      );

      const rightBorder = Math.min(
        sizes[i + 1] - paneLimitSizes[i][0],
        paneLimitSizes[i][1] - sizes[i],
      );

      if (distanceX < leftBorder) {
        distanceX = leftBorder;
      }

      if (distanceX > rightBorder) {
        distanceX = rightBorder;
      }

      const nextSizes = [...sizes];
      nextSizes[i] += distanceX;
      nextSizes[i + 1] -= distanceX;

      onSizesChange?.(nextSizes);

      axis.current = currAxis;
    },
    [onSizesChange, paneLimitSizes, sizes, splitAxis],
  );

  const paneFollow = !(performanceMode && isDragging);
  const paneSizes: (string | number)[] = paneFollow
    ? sizes
    : cacheSizes.current.sizes;
  const panePoses = paneFollow ? sashPosSizes : cacheSizes.current.sashPosSizes;

  return {
    isDragging,
    sashPosSizes,
    paneSizes,
    panePoses,
    onDraggingStart,
    onDraggingEnd,
    onDraggingMove,
  };
}

export function ensureSize(
  size: string | number | undefined,
  sum: number,
  defaultValue: number = Infinity,
) {
  if (typeof size === 'undefined') return defaultValue;
  if (typeof size === 'number') return size;
  try {
    if (size.endsWith('%')) {
      return sum * (parseFloat(size.replace('%', '')) / 100);
    }
    if (size.endsWith('px')) {
      return parseFloat(size.replace('px', ''));
    }
  } catch (error) {
    console.error('Error parsing size:', size, error);
  }
  return defaultValue;
}
