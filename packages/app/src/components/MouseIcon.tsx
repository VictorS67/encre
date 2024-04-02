import React, { FC } from 'react';

import { useRecoilState, useSetRecoilState } from 'recoil';

import { useGlobalHotkey } from '../hooks/useGlobalHotkey';
import {
  isDraggingMultipleNodesState,
  isOnlyDraggingCanvasState,
} from '../state/canvas';
import { isSelectingMultiWiresState } from '../state/wire';

export const MouseIcon: FC = () => {
  const setIsOnlyDraggingCanvas = useSetRecoilState(isOnlyDraggingCanvasState);
  const setIsDraggingMultipleNodes = useSetRecoilState(
    isDraggingMultipleNodesState,
  );
  const setIsSelectingMultiWires = useSetRecoilState(
    isSelectingMultiWiresState,
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
      setIsSelectingMultiWires(true);
    },
    (e: KeyboardEvent) => {
      e.preventDefault();
      setIsDraggingMultipleNodes(false);
      setIsSelectingMultiWires(false);
    },
  );

  return null;
};
