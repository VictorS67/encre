import { GraphComment } from '@encrejs/core/studio/comments';
import { getRecordId } from '@encrejs/core/utils/nanoid';
import { useRecoilState, useRecoilValue } from 'recoil';

import {
  commentMapState,
  commentsState,
  selectingCommentIdsState,
} from '../state/comment';
// import { fakeId } from '../utils/fakeId';
import { RecordId } from '../types/studio.type';
import { isNotNull } from '../utils/safeTypes';

export function useDuplicateComments() {
  const [comments, setComments] = useRecoilState(commentsState);
  const commentMap = useRecoilValue(commentMapState);
  const [selectingCommentIds, setSelectingCommentIds] = useRecoilState(
    selectingCommentIdsState,
  );

  return (commentId: RecordId) => {
    // const comment = commentMap[commentId];

    const commentIds: RecordId[] = (
      selectingCommentIds.length > 0
        ? [...new Set([...selectingCommentIds, commentId])]
        : [commentId]
    ).filter(isNotNull);

    const oldNewCommentIdMap: Record<RecordId, RecordId> = {};
    const newComments = commentIds
      .map((nId) => {
        const comment = commentMap[nId];

        if (!comment) {
          return;
        }

        // TODO: change this to globalCommentRegistry.create() from core
        const newCommentId: RecordId = getRecordId();
        oldNewCommentIdMap[nId] = newCommentId;

        const newComment: GraphComment = {
          ...comment,
          visualInfo: {
            ...comment.visualInfo,
            position: {
              ...comment.visualInfo.position,
              x: comment.visualInfo.position.x + 100,
              y: comment.visualInfo.position.y + 100,
            },
          },
          id: newCommentId,
        };

        return newComment;
      })
      .filter(isNotNull);

    setComments((ns) => [...ns, ...newComments]);
    setSelectingCommentIds(newComments.map((comment) => comment.id));
  };
}
