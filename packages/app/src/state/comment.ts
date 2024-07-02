import { atom, DefaultValue, selector, selectorFamily } from 'recoil';

import { NodeGraph } from '../types/graph.type';
import { GraphComment, RecordId } from '../types/studio.type';

import { graphState } from './graph';

export const commentsState = selector({
  key: 'comments',
  get: ({ get }) => {
    return get(graphState).comments;
  },
  set: ({ set }, newVal) => {
    set(graphState, (oldVal: NodeGraph) => {
      return {
        ...oldVal,
        comments: newVal instanceof DefaultValue ? [] : newVal,
      };
    });
  },
});

export const commentMapState = selector({
  key: 'commentMapState',
  get: ({ get }) => {
    return get(commentsState).reduce(
      (acc, comment) => {
        acc[comment.id] = comment;
        return acc;
      },
      {} as Record<RecordId, GraphComment>,
    );
  },
});

export const commentContentMapState = atom<
  Record<RecordId, GraphComment['visualInfo']['content']>
>({
  key: 'commentContentMapState',
  default: {},
});

export const selectingCommentIdsState = atom<RecordId[]>({
  key: 'selectingCommentIdsState',
  default: [],
});

export const draggingCommentsState = atom<GraphComment[]>({
  key: 'draggingCommentsState',
  default: [],
});

export const isDraggingMultipleCommentsState = atom<boolean>({
  key: 'isDraggingMultipleCommentsState',
  default: false,
});

export const isDraggingCommentsOnlyState = atom<boolean>({
  key: 'isDraggingCommentsOnlyState',
  default: false,
});

export const commentColorsState = atom<{
  original: string[];
  remaining: string[];
}>({
  key: 'commentColorsState',
  default: {
    original: [
      'red',
      'orange',
      'gold',
      'yellow',
      'palmera',
      'green',
      'meadow',
      'cyan',
      'blue',
      'cornflower',
      'purple',
      'pink',
      'razzmatazz',
      'silver',
      'dark',
    ],
    remaining: [
      'red',
      'orange',
      'gold',
      'yellow',
      'palmera',
      'green',
      'meadow',
      'cyan',
      'blue',
      'cornflower',
      'purple',
      'pink',
      'razzmatazz',
      'silver',
      'dark',
    ],
  },
});

export const commentContentFromCommentIdState = selectorFamily<
  GraphComment['visualInfo']['content'] | undefined,
  RecordId | undefined
>({
  key: 'commentContentFromCommentIdState',
  get:
    (commentId: RecordId | undefined) =>
    ({ get }) => {
      return commentId ? get(commentContentMapState)[commentId] : undefined;
    },
});

export const updateCommentContentState = selector<{
  id: RecordId;
  commentContent: GraphComment['visualInfo']['content'];
}>({
  key: 'updateCommentContentState',
  get: ({ get }) => {
    throw new Error(
      'updateCommentContentState should only be used to update comment map',
    );
  },
  set: ({ set, get }, newVal) => {
    if (newVal instanceof DefaultValue) return;
    const id: RecordId = newVal.id;
    const commentContent: GraphComment['visualInfo']['content'] =
      newVal.commentContent;

    const currMap = get(commentContentMapState);
    const updatedMap = { ...currMap, [id]: commentContent };
    set(commentContentMapState, updatedMap);
  },
});

export const removeCommentContentState = selector<RecordId>({
  key: 'removeCommentContentState',
  get: ({ get }) => {
    throw new Error(
      'removeCommentContentState should only be used when removing from comment map',
    );
  },
  set: ({ set, get }, newVal) => {
    if (newVal instanceof DefaultValue) return;

    const id: RecordId = newVal;
    const currMap = get(commentContentMapState);

    if (currMap[id]) {
      const updatedMap = { ...currMap };
      delete updatedMap[id];
      set(commentContentMapState, updatedMap);
    }
  },
});
