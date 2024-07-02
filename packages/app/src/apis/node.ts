import { useCallback } from 'react';

import { useRecoilValue } from 'recoil';

import { send } from 'internal/src/fetch';

import { nodeMapState } from '../state/node';
import { connectionsState } from '../state/nodeconnection';
import {
  RecordId,
  UIContext,
  Node,
  NodeInputPortDef,
  NodeOutputPortDef,
  NodeConnection,
} from '../types/studio.type';

export function useCreateNode() {
  const createNode = useCallback(
    async (
      nodeType: string,
      nodeSubType: string,
      registerArgs?: Record<string, unknown>,
    ) => {
      const node = await send('get-node', {
        type: nodeType,
        subType: nodeSubType,
        registerArgs,
      });

      console.log(`create node: ${JSON.stringify(node)}`);

      if (!node.error) {
        return node;
      }

      return null;
    },
    [],
  );

  return { createNode };
}

export function useCreateNodeBody() {
  const nodeMap = useRecoilValue(nodeMapState);

  const createNodeBody = useCallback(
    async ({
      id,
      node,
      newNodeMap,
    }: {
      id?: RecordId;
      node?: Node;
      newNodeMap?: Record<RecordId, Node>;
    }): Promise<UIContext[]> => {
      let currNode: Node | undefined;
      const currNodeMap: Record<RecordId, Node> = newNodeMap ?? nodeMap;

      if (id) {
        currNode = currNodeMap[id];
      } else {
        currNode = node;
      }

      if (!currNode) {
        return [];
      }

      let body = await send('get-node-body', { node: currNode });

      console.log(`create-node-body: ${JSON.stringify(body)}`);

      if (!Array.isArray(body) && body.error) {
        body = [];
      }

      return body;
    },
    [nodeMap],
  );

  return { createNodeBody };
}

export function useCreateNodeIODefs() {
  const nodeMap = useRecoilValue(nodeMapState);
  const connections = useRecoilValue(connectionsState);

  const createNodeIODefs = useCallback(
    async ({
      id,
      node,
      newConnections,
      newNodeMap,
    }: {
      id?: RecordId;
      node?: Node;
      newConnections?: NodeConnection[];
      newNodeMap?: Record<RecordId, Node>;
    }): Promise<{
      inputDefs: NodeInputPortDef[];
      outputDefs: NodeOutputPortDef[];
    }> => {
      let currNode: Node | undefined;
      const currConnections: NodeConnection[] = newConnections ?? connections;
      const currNodeMap: Record<RecordId, Node> = newNodeMap ?? nodeMap;

      if (id) {
        currNode = currNodeMap[id];
      } else {
        currNode = node;
      }

      if (!currNode) {
        return {
          inputDefs: [],
          outputDefs: [],
        };
      }

      let io = await send('get-node-io', {
        node: currNode,
        nodeMap: currNodeMap,
        connections: currConnections,
      });

      console.log(`create-node-io: ${JSON.stringify(io)}`);

      if (!Array.isArray(io) && io.error) {
        io = {
          inputDefs: [],
          outputDefs: [],
        };
      }

      return io;
    },
    [nodeMap, connections],
  );

  return { createNodeIODefs };
}
