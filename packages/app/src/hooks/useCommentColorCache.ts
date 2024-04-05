import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useRecoilValue } from 'recoil';

import { commentsState } from '../state/comment';
import { CommentColorCache } from '../types/comment.type';

const GARBAGE_COLLECTION_INTERVAL = 100;

export function useCommentColorCache(): CommentColorCache {
  const comments = useRecoilValue(commentsState);

  const ref = useRef<Record<string, string>>({});
  const garbageCollectionCount = useRef(0);

  const set = useCallback((commentId: string, color: string) => {
    ref.current[commentId] = color;
  }, []);

  const get = useCallback((commentId: string) => {
    return ref.current[commentId];
  }, []);

  const has = useCallback((commentId: string) => {
    return commentId in ref.current;
  }, []);

  useEffect(() => {
    if (garbageCollectionCount.current++ % GARBAGE_COLLECTION_INTERVAL !== 0) {
      ref.current = comments.reduce(
        (acc, next) => {
          acc[next.id] = ref.current[next.id];
          return acc;
        },
        {} as Record<string, string>,
      );
    }
  }, [comments]);

  return useMemo(() => {
    return { set, get, has };
  }, [set, get, has]);
}
