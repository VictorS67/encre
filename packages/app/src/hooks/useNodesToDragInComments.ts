import { GraphComment } from '@encrejs/core/studio/comments';
import { SerializableNode as Node } from '@encrejs/core/studio/nodes';
import { useRecoilValue } from 'recoil';

import { nodesToDragInCommentsState } from '../state/node';
import { CommentVisualInfo } from '../types/studio.type';

export function useNodesToDragInComments(comments: GraphComment[]): Node[] {
  const commentVisualInfos: CommentVisualInfo[] = comments.map(
    (c) => c.visualInfo,
  );

  return useRecoilValue(nodesToDragInCommentsState(commentVisualInfos));
}
