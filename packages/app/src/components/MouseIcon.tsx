import React, { FC } from 'react';

import { useRecoilState, useSetRecoilState } from 'recoil';

import { useGlobalHotkey } from '../hooks/useGlobalHotkey';
import {
  isDraggingMultipleNodesState,
  isOnlyDraggingCanvasState,
} from '../state/canvas';
import {
  isDraggingCommentsOnlyState,
  isDraggingMultipleCommentsState,
} from '../state/comment';
import { isSelectingMultiWiresState } from '../state/wire';

export const MouseIcon: FC = () => {
  const setIsOnlyDraggingCanvas = useSetRecoilState(isOnlyDraggingCanvasState);
  const setIsDraggingMultipleNodes = useSetRecoilState(
    isDraggingMultipleNodesState,
  );
  const setIsDraggingMultipleComments = useSetRecoilState(
    isDraggingMultipleCommentsState,
  );
  const setIsDraggingCommentsOnly = useSetRecoilState(
    isDraggingCommentsOnlyState,
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
      setIsDraggingMultipleComments(true);
      setIsDraggingMultipleNodes(true);
      setIsSelectingMultiWires(true);
    },
    (e: KeyboardEvent) => {
      e.preventDefault();
      setIsDraggingMultipleComments(false);
      setIsDraggingMultipleNodes(false);
      setIsSelectingMultiWires(false);
    },
  );

  useGlobalHotkey(
    ['AltLeft', 'AltRight'],
    (e: KeyboardEvent) => {
      e.preventDefault();
      setIsDraggingCommentsOnly(true);
    },
    (e: KeyboardEvent) => {
      e.preventDefault();
      setIsDraggingCommentsOnly(false);
    },
  );

  return null;
};
