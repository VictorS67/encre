import React, { FC } from 'react';

import { useRecoilState } from 'recoil';

import { useGlobalHotkey } from '../hooks/useGlobalHotkey';
import { isOnlyDraggingCanvasState } from '../state/canvas';

export const MouseIcon: FC = () => {
  const [isOnlyDraggingCanvas, setIsOnlyDraggingCanvas] = useRecoilState(
    isOnlyDraggingCanvasState,
  );

  useGlobalHotkey(
    'Space',
    (e: KeyboardEvent) => {
      e.preventDefault();
      setIsOnlyDraggingCanvas(true);
    },
    (e: KeyboardEvent) => {
      e.preventDefault();
      setIsOnlyDraggingCanvas(false);
    },
  );

  return null;
};
