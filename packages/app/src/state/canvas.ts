import { atom } from 'recoil';

import { CanvasPosition, MousePosition } from '../types/canvas.type';

export const canvasPositionState = atom<CanvasPosition>({
  key: 'canvasPosition',
  default: { x: 0, y: 0, zoom: 1 },
});

export const lastMousePositionState = atom<MousePosition>({
  key: 'lastMousePosition',
  default: { x: 0, y: 0 },
});

export const isOnlyDraggingCanvasState = atom<boolean>({
  key: 'isOnlyDraggingCanvas',
  default: false,
});
