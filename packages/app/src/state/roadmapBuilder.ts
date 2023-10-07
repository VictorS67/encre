import { atom } from 'recoil';

export type CanvasPosition = {
  x: number;
  y: number;
  zoom: number;
  fromSaved?: boolean;
};

export const canvasPositionState = atom<CanvasPosition>({
  key: 'canvasPosition',
  default: { x: 0, y: 0, zoom: 1 },
});
