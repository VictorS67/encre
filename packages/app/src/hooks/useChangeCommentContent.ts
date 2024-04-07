import { useCallback } from 'react';

import { useRecoilValue, useSetRecoilState } from 'recoil';

import {
  commentContentMapState,
  updateCommentContentState,
} from '../state/comment';

export function useChangeCommentContent() {
  // const updateWireData = useSetRecoilState(updateWireDataState);
  const commentContentMap = useRecoilValue(commentContentMapState);
  const updateCommentContent = useSetRecoilState(updateCommentContentState);

  const updateCommentColor = useCallback(
    (commentId: string, color: string) => {
      const commentContent = commentContentMap[commentId];

      updateCommentContent({
        id: commentId,
        commentContent: { ...commentContent, color: color as any },
      });
    },
    [updateCommentContent, commentContentMap],
  );

  const updateCommentVAlignment = useCallback(
    (commentId: string, vAlign: string) => {
      const commentContent = commentContentMap[commentId];

      updateCommentContent({
        id: commentId,
        commentContent: { ...commentContent, vertical: vAlign as any },
      });
    },
    [updateCommentContent, commentContentMap],
  );

  const updateCommentHAlignment = useCallback(
    (commentId: string, hAlign: string) => {
      const commentContent = commentContentMap[commentId];

      updateCommentContent({
        id: commentId,
        commentContent: { ...commentContent, horitontal: hAlign as any },
      });
    },
    [updateCommentContent, commentContentMap],
  );

  return {
    updateCommentColor,
    updateCommentVAlignment,
    updateCommentHAlignment,
  };
}
