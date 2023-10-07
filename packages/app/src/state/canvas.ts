import { atom } from 'recoil';

export type CanvasPosition = {
  x: number;
  y: number;
  zoom: number;
};

export type MousePosition = {
  x: number;
  y: number;
};

export const canvasPositionState = atom<CanvasPosition>({
  key: 'canvasPosition',
  default: { x: 0, y: 0, zoom: 1 },
});

export const lastMousePositionState = atom<MousePosition>({
  key: 'lastMousePosition',
  default: { x: 0, y: 0 },
});
