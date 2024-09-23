import { DefaultValue, atom, selector, selectorFamily } from 'recoil';

import { NodeGraph } from '../types/graph.type';
import { NodeVisualContentData } from '../types/node.type';
import {
  RecordId,
  CommentVisualInfo,
  Node,
  NodeInputPortDef,
  NodeOutputPortDef,
  UIContext,
} from '../types/studio.type';

import { graphState } from './graph';

export const nodesState = selector<Node[]>({
  key: 'nodes',
  get: ({ get }) => {
    return get(graphState).nodes;
  },
  set: ({ set }, newVal) => {
    set(graphState, (oldVal: NodeGraph) => {
      return {
        ...oldVal,
        nodes: newVal instanceof DefaultValue ? [] : newVal,
      };
    });
  },
});

export const nodeMapState = selector<Record<RecordId, Node>>({
  key: 'nodeMapState',
  get: ({ get }) => {
    return get(nodesState).reduce(
      (acc, node) => {
        acc[node.id] = node;
        return acc;
      },
      {} as Record<RecordId, Node>,
    );
  },
});

export const nodeBodyMapState = atom<Record<RecordId, UIContext[]>>({
  key: 'nodeBodyMapState',
  default: {},
});

export const nodeBodyFromNodeIdState = selectorFamily<
  UIContext[] | undefined,
  RecordId | undefined
>({
  key: 'nodeBodyFromNodeIdState',
  get:
    (nodeId: RecordId | undefined) =>
    ({ get }) => {
      return nodeId ? get(nodeBodyMapState)[nodeId] : undefined;
    },
});

export const updateNodeBodyState = selector<{
  id: RecordId;
  nodeBody: UIContext[];
}>({
  key: 'updateNodeBodyState',
  get: ({ get }) => {
    throw new Error(
      'updateNodeBodyState should only be used to update nodeBody map',
    );
  },
  set: ({ set, get }, newVal) => {
    if (newVal instanceof DefaultValue) return;
    const id: RecordId = newVal.id;
    const nodeBody: UIContext[] = newVal.nodeBody;

    const currMap = get(nodeBodyMapState);
    const updatedMap = { ...currMap, [id]: nodeBody };
    set(nodeBodyMapState, updatedMap);
  },
});

export const removeNodeBodyState = selector<RecordId>({
  key: 'removeNodeBodyState',
  get: ({ get }) => {
    throw new Error(
      'removeNodeBodyState should only be used to remove body from nodeBody map',
    );
  },
  set: ({ set, get }, newVal) => {
    if (newVal instanceof DefaultValue) return;

    const id: RecordId = newVal;
    const currMap = get(nodeBodyMapState);

    if (currMap[id]) {
      const updatedMap = { ...currMap };
      delete updatedMap[id];
      set(nodeBodyMapState, updatedMap);
    }
  },
});

export const nodeVisualContentDataMapState = atom<
  Record<RecordId, NodeVisualContentData>
>({
  key: 'nodeVisualContentDataMapState',
  default: {},
});

export const selectingNodeIdsState = atom<RecordId[]>({
  key: 'selectingNodeIdsState',
  default: [],
});

export const editingNodeIdState = atom<RecordId | undefined>({
  key: 'selectingNodeIdState',
  default: undefined,
});

export const hoveringNodeIdState = atom<RecordId | undefined>({
  key: 'hoveringNodeIdState',
  default: undefined,
});

export const draggingNodesState = atom<Node[]>({
  key: 'draggingNodesState',
  default: [],
});

export const draggingNodesInCommentsState = atom<Node[]>({
  key: 'draggingNodesInCommentsState',
  default: [],
});

export const pinningNodeIdsState = atom<RecordId[]>({
  key: 'pinningNodeIdsState',
  default: [],
});

export const collapsingNodeIdsState = atom<RecordId[]>({
  key: 'collapsingNodeIdsState',
  default: [],
});

export const isPinnedState = selectorFamily<boolean, RecordId>({
  key: 'isPinnedState',
  get:
    (nodeId: RecordId) =>
    ({ get }) =>
      get(pinningNodeIdsState).includes(nodeId),
});

export const nodeIODefState = atom<
  Record<
    RecordId,
    {
      inputDefs: NodeInputPortDef[];
      outputDefs: NodeOutputPortDef[];
    }
  >
>({
  key: 'nodeIODefState',
  default: {},
});

export const nodeFromNodeIdState = selectorFamily<
  Node | undefined,
  RecordId | undefined
>({
  key: 'nodeFromNodeIdState',
  get:
    (nodeId: RecordId | undefined) =>
    ({ get }) => {
      return nodeId ? get(nodeMapState)[nodeId] : undefined;
    },
});

export const updateNodeIODefState = selector<{
  id: RecordId;
  io: {
    inputDefs: NodeInputPortDef[];
    outputDefs: NodeOutputPortDef[];
  };
}>({
  key: 'updateNodeIODefState',
  get: ({ get }) => {
    throw new Error(
      'updateNodeIODefState should only be used to update nodeIODef map',
    );
  },
  set: ({ set, get }, newVal) => {
    if (newVal instanceof DefaultValue) return;
    const id: RecordId = newVal.id;
    const io = {
      inputDefs: newVal.io.inputDefs.map((i: NodeInputPortDef) => ({ ...i, nodeId: id })), 
      outputDefs: newVal.io.outputDefs.map((o: NodeOutputPortDef) => ({ ...o, nodeId: id })) 
    };

    const currMap = get(nodeIODefState);
    const updatedMap = { ...currMap, [id]: io };
    set(nodeIODefState, updatedMap);
  },
});

export const removeNodeIODefState = selector<RecordId>({
  key: 'removeNodeIODefState',
  get: ({ get }) => {
    throw new Error(
      'removeNodeIODefState should only be used to remove io from nodeIODef map',
    );
  },
  set: ({ set, get }, newVal) => {
    if (newVal instanceof DefaultValue) return;

    const id: RecordId = newVal;
    const currMap = get(nodeIODefState);

    if (currMap[id]) {
      const updatedMap = { ...currMap };
      delete updatedMap[id];
      set(nodeIODefState, updatedMap);
    }
  },
});

export const nodeVisualContentDataFromNodeIdState = selectorFamily<
  NodeVisualContentData | undefined,
  RecordId | undefined
>({
  key: 'nodeVisualContentDataFromNodeIdState',
  get:
    (nodeId: RecordId | undefined) =>
    ({ get }) => {
      return nodeId ? get(nodeVisualContentDataMapState)[nodeId] : undefined;
    },
});

export const ioDefFromNodeIdState = selectorFamily<
  {
    inputDefs: NodeInputPortDef[];
    outputDefs: NodeOutputPortDef[];
  },
  RecordId | undefined
>({
  key: 'ioDefFromNodeIdState',
  get:
    (nodeId: RecordId | undefined) =>
    ({ get }) => {
      return nodeId
        ? get(nodeIODefState)[nodeId]!
        : { inputDefs: [], outputDefs: [] };
    },
});

export const nodesToDragInCommentsState = selectorFamily<
  Node[],
  CommentVisualInfo[]
>({
  key: 'nodesToDragInCommentsState',
  get:
    (commentVisualInfos: CommentVisualInfo[]) =>
    ({ get }) => {
      const nodes: Node[] = [];

      get(nodesState).forEach((node) => {
        const intersects: boolean = commentVisualInfos.some(
          (comment) =>
            !(
              node.visualInfo.position.x + node.visualInfo.size.width <
                comment.position.x ||
              comment.position.x + comment.size.width <
                node.visualInfo.position.x ||
              node.visualInfo.position.y + node.visualInfo.size.height <
                comment.position.y ||
              comment.position.y + comment.size.height <
                node.visualInfo.position.y
            ),
        );

        if (intersects) {
          nodes.push(node);
        }
      });

      return nodes;
    },
});

export const updateNodeVisualContentDataState = selector<{
  id: RecordId;
  nodeVisualContentData: NodeVisualContentData;
}>({
  key: 'updateNodeVisualContentDataState',
  get: ({ get }) => {
    throw new Error(
      'updateNodeVisualContentDataState should only be used to update nodeVisualContentData map',
    );
  },
  set: ({ set, get }, newVal) => {
    if (newVal instanceof DefaultValue) return;
    const id: RecordId = newVal.id;
    const nodeVisualContentData: NodeVisualContentData =
      newVal.nodeVisualContentData;

    const currMap = get(nodeVisualContentDataMapState);
    const updatedMap = { ...currMap, [id]: nodeVisualContentData };
    set(nodeVisualContentDataMapState, updatedMap);
  },
});

export const removeNodeVisualContentDataState = selector<RecordId>({
  key: 'removeNodeVisualContentDataState',
  get: ({ get }) => {
    throw new Error(
      'updateNodeVisualContentDataState should only be used to remove nodeVisualContentData from nodeVisualContentData map',
    );
  },
  set: ({ set, get }, newVal) => {
    if (newVal instanceof DefaultValue) return;

    const id: RecordId = newVal;
    const currMap = get(nodeVisualContentDataMapState);

    if (currMap[id]) {
      const updatedMap = { ...currMap };
      delete updatedMap[id];
      set(nodeVisualContentDataMapState, updatedMap);
    }
  },
});
