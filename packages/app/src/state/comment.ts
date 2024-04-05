import { atom, DefaultValue, selector } from 'recoil';

import { graphState } from './graph';
import { NodeGraph } from '../types/graph.type';
import { GraphComment } from '../types/studio.type';

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
      {} as Record<string, GraphComment>,
    );
  },
});

export const selectingCommentIdsState = atom<string[]>({
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
