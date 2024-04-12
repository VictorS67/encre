import { DefaultValue, atom, selector, selectorFamily } from 'recoil';

import { graphState } from './graph';
import { connectionMapState } from './nodeconnection';
import { NodeGraph } from '../types/graph.type';
import {
  CommentVisualInfo,
  GraphComment,
  Node,
  NodeConnection,
  NodeInputPortDef,
  NodeOutputPortDef,
} from '../types/studio.type';

export const nodesState = selector({
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

export const nodeMapState = selector({
  key: 'nodeMapState',
  get: ({ get }) => {
    return get(nodesState).reduce(
      (acc, node) => {
        acc[node.id] = node;
        return acc;
      },
      {} as Record<string, Node>,
    );
  },
});

export const selectingNodeIdsState = atom<string[]>({
  key: 'selectingNodeIdsState',
  default: [],
});

export const editingNodeIdState = atom<string | undefined>({
  key: 'selectingNodeIdState',
  default: undefined,
});

export const hoveringNodeIdState = atom<string | undefined>({
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

export const pinningNodeIdsState = atom<string[]>({
  key: 'pinningNodeIdsState',
  default: [],
});

export const collapsingNodeIdsState = atom<string[]>({
  key: 'collapsingNodeIdsState',
  default: [],
});

export const isPinnedState = selectorFamily<boolean, string>({
  key: 'isPinnedState',
  get:
    (nodeId: string) =>
    ({ get }) =>
      get(pinningNodeIdsState).includes(nodeId),
});

export const nodeIODefState = selector<
  Record<
    string,
    {
      inputDefs: NodeInputPortDef[];
      outputDefs: NodeOutputPortDef[];
    }
  >
>({
  key: 'nodeIODefState',
  get: ({ get }) => {
    // TODO: instead of getting it from the node, get it from nodeImpl
    const nodeMap = get(nodeMapState);
    const connectionMap = get(connectionMapState);

    const getIOFromNode = (node: Node) => {
      const connections: NodeConnection[] = connectionMap[node.id] ?? [];

      const inputDefs: NodeInputPortDef[] = node?.getInputPortDefs(
        connections,
        nodeMap,
      );
      const outputDefs: NodeOutputPortDef[] = node?.getOutputPortDefs(
        connections,
        nodeMap,
      );

      return inputDefs && outputDefs
        ? {
            inputDefs,
            outputDefs,
          }
        : { inputDefs: [], outputDefs: [] };
    };

    return Object.fromEntries(
      Object.entries(nodeMap).map(([nodeId, node]) => [
        nodeId,
        getIOFromNode(node),
      ]),
    );
  },
});

export const nodeFromNodeIdState = selectorFamily<
  Node | undefined,
  string | undefined
>({
  key: 'nodeFromNodeIdState',
  get:
    (nodeId: string | undefined) =>
    ({ get }) => {
      return nodeId ? get(nodeMapState)[nodeId] : undefined;
    },
});

export const ioDefFromNodeIdState = selectorFamily<
  {
    inputDefs: NodeInputPortDef[];
    outputDefs: NodeOutputPortDef[];
  },
  string | undefined
>({
  key: 'ioDefFromNodeIdState',
  get:
    (nodeId: string | undefined) =>
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
