import React, { FC, useCallback, useEffect } from 'react';

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { useEditorClick } from '../hooks/useEditorClick';
import { useGlobalHotkey } from '../hooks/useGlobalHotkey';
import {
  isDraggingMultipleNodesState,
  isOnlyDraggingCanvasState,
} from '../state/canvas';
import {
  isDraggingCommentsOnlyState,
  isDraggingMultipleCommentsState,
} from '../state/comment';
import { editingCodeIdState } from '../state/editor';
import { editingNodeIdState } from '../state/node';
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
  const editingCodeId = useRecoilValue(editingCodeIdState);
  const editingNodeId = useRecoilValue(editingNodeIdState);

  useGlobalHotkey(
    'Space',
    useCallback(
      (e: KeyboardEvent) => {
        if (!editingNodeId) {
          e.preventDefault();
          setIsOnlyDraggingCanvas(true);
        }
      },
      [editingNodeId],
    ),
    useCallback(
      (e: KeyboardEvent) => {
        if (!editingNodeId) {
          e.preventDefault();
          setIsOnlyDraggingCanvas(false);
        }
      },
      [editingNodeId],
    ),
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
