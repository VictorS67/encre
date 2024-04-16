import { useRecoilValue } from 'recoil';

import { nodesToDragInCommentsState } from '../state/node';
import { CommentVisualInfo, GraphComment, Node } from '../types/studio.type';

export function useNodesToDragInComments(comments: GraphComment[]): Node[] {
  const commentVisualInfos: CommentVisualInfo[] = comments.map(
    (c) => c.visualInfo,
  );

  return useRecoilValue(nodesToDragInCommentsState(commentVisualInfos));
}
