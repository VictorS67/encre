import type { NodeImpl } from '@encrejs/core/build/studio/nodes/base';
import { mapValues, keys, map } from "lodash-es";
import { DefaultValue, atom, selector, selectorFamily } from "recoil";

import { graphState } from "./graph";
import { connectionMapState } from "./nodeconnection";
import { NodeGraph } from "../types/graph.type";
import { NodeVisualContentData } from "../types/node.type";
import {
  // globalNodeRegistry,
  RecordId,
  CommentVisualInfo,
  GraphComment,
  Node,
  NodeConnection,
  NodeInputPortDef,
  NodeOutputPortDef,
  NodeRegistration,
} from "../types/studio.type";

export const nodeRegistryState = atom<NodeRegistration | undefined>({
  key: "nodeRegistryState",
  default: selectorFamily({
    key: "nodeRegistryState/default",
    get: () => async () => {
      // const { ipcRenderer } = window.require('electron');
      // try {
      //   const globalNodeRegistry =
      //     await ipcRenderer.invoke('globalNodeRegistry');
      //   return globalNodeRegistry;
      // } catch (e) {
      //   console.log(`failed to get globalNodeRegistry: ${e}`);
      //   return undefined;
      // }

      return undefined;
    },
  })(undefined),
});

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

export const nodeInstanceState = selectorFamily<
  NodeImpl<Node> | undefined,
  RecordId
>({
  key: "nodeInstanceState",
  get: (nodeId) => async () => {
    // const { ipcRenderer } = window.require("electron");

    // try {
    //   const globalNodeRegistry = await ipcRenderer.invoke("globalNodeRegistry");

    //   return globalNodeRegistry.createDynamicImpl(nodeId) as NodeImpl<Node>;
    // } catch (e) {
    //   return undefined;
    // }

    return undefined;
  },
});

export const nodeInstanceMapState = selector<
  Record<RecordId, NodeImpl<Node> | undefined>
>({
  key: "nodeInstanceMapState",
  get: ({ get }) => {
    const nodeMap = get(nodeMapState);

    return mapValues(nodeMap, (node) => undefined);

    // return Object.fromEntries(
    //   await Promise.all(
    //     Object.entries(nodeMap).map(async ([k, v]) => {
    // try {
    //   const globalNodeRegistry =
    //     await ipcRenderer.invoke('globalNodeRegistry');

    //   return [
    //     k,
    //     globalNodeRegistry.createDynamicImpl(v) as NodeImpl<Node>,
    //   ];
    // } catch (e) {
    //   return [k, undefined];
    // }
    //     }),
    //   ),
    // );
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

export const nodeIODefState = selector<
  Record<
    RecordId,
    {
      inputDefs: NodeInputPortDef[];
      outputDefs: NodeOutputPortDef[];
    }
  >
>({
  key: 'nodeIODefState',
  get: ({ get }) => {
    const nodeMap = get(nodeMapState);
    // const nodeInstanceMap = get(nodeInstanceMapState);
    const connectionMap = get(connectionMapState);

    const getIOFromNode = (node: Node) => {
      const connections: NodeConnection[] = connectionMap[node.id] ?? [];

      const nodeInstance = get(nodeInstanceState(node.id));

      const inputDefs: NodeInputPortDef[] =
        nodeInstance?.getInputPortDefs(connections, nodeMap) ?? [];
      const outputDefs: NodeOutputPortDef[] =
        nodeInstance?.getOutputPortDefs(connections, nodeMap) ?? [];

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
      ])
    );
  },
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
