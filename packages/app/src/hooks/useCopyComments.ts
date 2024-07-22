import { useRecoilValue, useSetRecoilState } from 'recoil';

import { clipboardState } from '../state/clipboard';
import { commentMapState, selectingCommentIdsState } from '../state/comment';
import { isNotNull } from '../utils/safeTypes';

export function useCopyComments() {
  const selectingCommentIds = useRecoilValue(selectingCommentIdsState);
  const commentMap = useRecoilValue(commentMapState);
  const setClipboard = useSetRecoilState(clipboardState);

  return (additionalCommentId?: string) => {
    const commentIds = (
      selectingCommentIds.length > 0
        ? [...new Set([...selectingCommentIds, additionalCommentId])]
        : [additionalCommentId]
    ).filter(isNotNull);

    setClipboard({
      type: 'comments',
      comments: commentIds.map((id) => commentMap[id]).filter(isNotNull),
    });
  };
}
