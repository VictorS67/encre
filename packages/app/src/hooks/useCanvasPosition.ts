import { useCallback } from 'react';

import { useRecoilValue } from 'recoil';

import { canvasPositionState } from '../state/canvas';
import { CanvasPosition } from '../types/canvas.type';

/**
 * canvasToClientPosition
 *
 * Generates a function to convert canvas coordinates to client coordinates
 * considering the current state of the canvas (position and zoom level).
 *
 * @param {CanvasPosition} canvasPosition - The current state of the canvas.
 * @returns {Function} - A function that takes two numbers (x, y) and returns
 * an object with converted x and y in client coordinates.
 *
 * @example
 * const positioningFn = canvasToClientPosition(currentCanvasPosition);
 * const clientPosition = positioningFn(10, 15);
 */
export const canvasToClientPosition = (canvasPosition: CanvasPosition) => {
  return (x: number, y: number) => {
    const clientX: number = (x + canvasPosition.x) * canvasPosition.zoom;
    const clientY: number = (y + canvasPosition.y) * canvasPosition.zoom;
    return { x: clientX, y: clientY };
  };
};

/**
 * clientToCanvasPosition
 *
 * Generates a function to convert client coordinates to canvas coordinates.
 *
 * @param {number} x - The x-coordinate in client space.
 * @param {number} y - The y-coordinate in client space.
 * @returns {Function} - A function that takes a CanvasPosition object as
 * parameter and returns an object with the converted x and y coordinates
 * in canvas space.
 *
 * @example
 * const positioningFn = clientToCanvasPosition(100, 150);
 * const canvasPosition = positioningFn(currentCanvasPosition);
 */
export const clientToCanvasPosition = (x: number, y: number) => {
  return (canvasPosition: CanvasPosition) => {
    const canvasX: number = x / canvasPosition.zoom - canvasPosition.x;
    const canvasY: number = y / canvasPosition.zoom - canvasPosition.y;
    return { x: canvasX, y: canvasY };
  };
};

/**
 * `useCanvasPosition` Hook
 *
 * A hook that provides utility functions for converting positions between
 * canvas and client coordinates, utilizing the current canvas state from
 * the `canvasPositionState`.
 *
 * @returns {Object} - An object containing:
 *   - `canvasPosition` (CanvasPosition): The current state of the canvas.
 *   - `canvasToClientPosition` (Function): A function converting a position
 *     from canvas to client coordinates.
 *   - `clientToCanvasPosition` (Function): A function converting a position
 *     from client to canvas coordinates.
 *
 * @example
 * const { canvasPos, canvasToClientPos, clientToCanvasPos } = useCanvasPosition();
 * const clientPos = canvasToClientPos(10, 15);
 * const canvasPos = clientToCanvasPos(100, 150);
 */
export function useCanvasPosition() {
  const canvasPosition = useRecoilValue(canvasPositionState);

  const canvasToClientPositionLocal = useCallback(
    (x: number, y: number) => {
      const positioningFn = canvasToClientPosition(canvasPosition);
      return positioningFn(x, y);
    },
    [canvasPosition],
  );

  const clientToCanvasPositionLocal = useCallback(
    (x: number, y: number) => {
      const positioningFn = clientToCanvasPosition(x, y);
      return positioningFn(canvasPosition);
    },
    [canvasPosition],
  );

  return {
    canvasPosition,
    canvasToClientPosition: canvasToClientPositionLocal,
    clientToCanvasPosition: clientToCanvasPositionLocal,
  };
}
