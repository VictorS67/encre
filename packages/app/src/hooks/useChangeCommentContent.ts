import { useCallback } from 'react';

import { useRecoilValue, useSetRecoilState } from 'recoil';

import {
  commentContentMapState,
  updateCommentContentState,
} from '../state/comment';
import { RecordId } from '../types/studio.type';

export function useChangeCommentContent() {
  const commentContentMap = useRecoilValue(commentContentMapState);
  const updateCommentContent = useSetRecoilState(updateCommentContentState);

  const updateCommentColor = useCallback(
    (commentId: RecordId, color: string) => {
      const commentContent = commentContentMap[commentId];

      updateCommentContent({
        id: commentId,
        commentContent: { ...commentContent, color: color as any },
      });
    },
    [updateCommentContent, commentContentMap],
  );

  const updateCommentVAlignment = useCallback(
    (commentId: RecordId, vAlign: string) => {
      const commentContent = commentContentMap[commentId];

      updateCommentContent({
        id: commentId,
        commentContent: { ...commentContent, vertical: vAlign as any },
      });
    },
    [updateCommentContent, commentContentMap],
  );

  const updateCommentHAlignment = useCallback(
    (commentId: RecordId, hAlign: string) => {
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
