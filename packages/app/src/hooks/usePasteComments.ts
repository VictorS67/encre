import { produce } from 'immer';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { useCanvasPosition } from './useCanvasPosition';
import { clipboardState } from '../state/clipboard';
import { commentsState, selectingCommentIdsState } from '../state/comment';
import { fakeId } from '../utils/fakeId';

export function usePasteComments() {
  const clipboard = useRecoilValue(clipboardState);
  const [comments, setComments] = useRecoilState(commentsState);
  const setSelectingCommentIds = useSetRecoilState(selectingCommentIdsState);

  const { clientToCanvasPosition } = useCanvasPosition();

  const pasteComments = (mousePosition: { x: number; y: number }) => {
    if (clipboard?.type !== 'comments') {
      return;
    }

    console.log(
      `paste: clipboard: comments: ${JSON.stringify(clipboard.comments)}`,
    );

    const canvasPosition = clientToCanvasPosition(
      mousePosition.x,
      mousePosition.y,
    );

    const boundingBoxOfCopiedComments = clipboard.comments.reduce(
      (acc, comment) => {
        return {
          minX: Math.min(acc.minX, comment.visualInfo.position.x),
          minY: Math.min(acc.minY, comment.visualInfo.position.y),
          maxX: Math.max(
            acc.maxX,
            comment.visualInfo.position.x +
              (comment.visualInfo.size.width ?? 200),
          ),
          maxY: Math.max(
            acc.maxY,
            comment.visualInfo.position.y +
              (comment.visualInfo.size.height ?? 200),
          ),
        };
      },
      {
        minX: Number.MAX_SAFE_INTEGER,
        minY: Number.MAX_SAFE_INTEGER,
        maxX: Number.MIN_SAFE_INTEGER,
        maxY: Number.MIN_SAFE_INTEGER,
      },
    );

    const oldNewCommentIdMap: Record<string, string> = {};

    const newComments = clipboard.comments.map((comment) => {
      return produce(comment, (draft) => {
        // TODO: change this to generate a new random RecordId from core
        const newCommentId = fakeId(17);
        oldNewCommentIdMap[comment.id] = newCommentId;

        draft.id = newCommentId;

        // Move the bounding box of all the copied comments,
        // align the top-left with the mouse position
        draft.visualInfo.position.x =
          canvasPosition.x +
          (comment.visualInfo.position.x - boundingBoxOfCopiedComments.minX);
        draft.visualInfo.position.y =
          canvasPosition.y +
          (comment.visualInfo.position.y - boundingBoxOfCopiedComments.minY);
      });
    });

    console.log(`paste: newComments: ${JSON.stringify(newComments)}`);

    setComments((ns) => [...ns, ...newComments]);
    setSelectingCommentIds(newComments.map((comment) => comment.id));
  };

  return pasteComments;
}
