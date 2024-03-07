import React, { FC } from 'react';

import { useRecoilState } from 'recoil';

import { useGlobalHotkey } from '../hooks/useGlobalHotkey';
import {
  isDraggingMultipleNodesState,
  isOnlyDraggingCanvasState,
} from '../state/canvas';

export const MouseIcon: FC = () => {
  const [isOnlyDraggingCanvas, setIsOnlyDraggingCanvas] = useRecoilState(
    isOnlyDraggingCanvasState,
  );

  const [isDraggingMultipleNodes, setIsDraggingMultipleNodes] = useRecoilState(
    isDraggingMultipleNodesState,
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

  useGlobalHotkey(
    ['ShiftLeft', 'ShiftRight'],
    (e: KeyboardEvent) => {
      e.preventDefault();
      setIsDraggingMultipleNodes(true);
    },
    (e: KeyboardEvent) => {
      e.preventDefault();
      setIsDraggingMultipleNodes(false);
    },
  );

  return null;
};
