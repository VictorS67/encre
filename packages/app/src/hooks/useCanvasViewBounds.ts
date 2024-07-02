import { useLayoutEffect, useMemo, useState } from 'react';

import { CanvasPosition, CanvasViewBounds } from '../types/canvas.type';

import { useCanvasPosition } from './useCanvasPosition';

/**
 * Custom React hook that calculates and returns the bounds of a canvas view.
 * It leverages the window's dimensions and a function for transforming client
 * coordinates to canvas coordinates to determine the top, bottom, left, and
 * right bounds of the canvas view.
 *
 * The hook listens for window resize events to update the bounds accordingly.
 * It uses a combination of useState for tracking window size and useMemo for
 * calculating the bounds based on the window size and canvas position.
 *
 * @returns {CanvasViewBounds} An object representing the canvas view bounds,
 *                             including top, bottom, left, and right coordinates.
 *
 * Usage:
 * const canvasViewBounds = useCanvasViewBounds();
 * // canvasViewBounds: { top: number, bottom: number, left: number, right: number }
 */
export const useCanvasViewBounds = (): CanvasViewBounds => {
  const { clientToCanvasPosition } = useCanvasPosition();

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useLayoutEffect(() => {
    const onResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const bounds = useMemo(() => {
    const topLeft = clientToCanvasPosition(0, 0);
    const bottomRight = clientToCanvasPosition(
      windowSize.width,
      windowSize.height,
    );

    return {
      top: topLeft.y,
      bottom: bottomRight.y,
      left: topLeft.x,
      right: bottomRight.x,
    };
  }, [clientToCanvasPosition, windowSize.width, windowSize.height]);

  return bounds;
};

export function fitBoundsToViewport(nodeBounds: {
  x: number;
  y: number;
  width: number;
  height: number;
}): CanvasPosition {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Calculate the required zoom level
  const zoomX = viewportWidth / nodeBounds.width;
  const zoomY = viewportHeight / nodeBounds.height;
  const zoom = Math.min(zoomX, zoomY);

  // Calculate the required position
  const x =
    -nodeBounds.x + (viewportWidth - nodeBounds.width * zoom) / (2 * zoom);
  const y =
    -nodeBounds.y + (viewportHeight - nodeBounds.height * zoom) / (2 * zoom);

  return { x, y, zoom };
}
