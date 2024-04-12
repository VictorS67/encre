import { useRecoilState, useRecoilValue } from 'recoil';

import {
  commentMapState,
  commentsState,
  selectingCommentIdsState,
} from '../state/comment';
import { GraphComment } from '../types/studio.type';
import { fakeId } from '../utils/fakeId';
import { isNotNull } from '../utils/safeTypes';

export function useDuplicateComments() {
  const [comments, setComments] = useRecoilState(commentsState);
  const commentMap = useRecoilValue(commentMapState);
  const [selectingCommentIds, setSelectingCommentIds] = useRecoilState(
    selectingCommentIdsState,
  );

  return (commentId: string) => {
    // const comment = commentMap[commentId];

    const commentIds: string[] = (
      selectingCommentIds.length > 0
        ? [...new Set([...selectingCommentIds, commentId])]
        : [commentId]
    ).filter(isNotNull);

    const oldNewCommentIdMap: Record<string, string> = {};
    const newComments = commentIds
      .map((nId) => {
        const comment = commentMap[nId];

        if (!comment) {
          return;
        }

        // TODO: change this to globalCommentRegistry.create() from core
        const newCommentId: string = fakeId(17);
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
