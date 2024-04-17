import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { nodeMapState, nodesState, selectingNodeIdsState } from '../state/node';
import { connectionsState } from '../state/nodeconnection';
import {
  Node,
  NodeConnection,
  NodeInputPortDef,
  NodeOutputPortDef,
} from '../types/studio.type';
import { fakeId } from '../utils/fakeId';
import { isNotNull } from '../utils/safeTypes';

export function useDuplicateNodes() {
  const nodes = useRecoilValue(nodesState);
  const nodeMap = useRecoilValue(nodeMapState);
  const setNodes = useSetRecoilState(nodesState);
  const [connections, setConnections] = useRecoilState(connectionsState);
  const [selectingNodeIds, setSelectingNodeIds] = useRecoilState(
    selectingNodeIdsState,
  );

  return (nodeId: string) => {
    // const node = nodeMap[nodeId];

    const nodeIds: string[] = (
      selectingNodeIds.length > 0
        ? [...new Set([...selectingNodeIds, nodeId])]
        : [nodeId]
    ).filter(isNotNull);

    const oldNewNodeIdMap: Record<string, string> = {};
    const newNodes = nodeIds
      .map((nId) => {
        const node = nodeMap[nId];

        if (!node) {
          return;
        }

        // TODO: change this to globalNodeRegistry.create() from core
        const inputDefs: NodeInputPortDef[] = node.getInputPortDefs([], {});
        const outputDefs: NodeOutputPortDef[] = node.getOutputPortDefs([], {});
        const newNodeId: string = fakeId(17);
        oldNewNodeIdMap[nId] = newNodeId;

        const newNode: Node = {
          id: newNodeId,
          type: node.type,
          subType: node.subType,
          registerArgs: node.registerArgs,
          visualInfo: {
            ...node.visualInfo,
            position: {
              ...node.visualInfo.position,
              x: node.visualInfo.position.x + 100,
              y: node.visualInfo.position.y + 100,
            },
          },
          title: node.title,
          name: node.name,
          aliases: node.aliases,
          secrets: node.secrets,
          kwargs: node.kwargs,
          inputs: node.inputs,
          outputs: node.outputs,
          setKwarg: node.setKwarg,
          getBody: node.getBody,
          getInputPortDefs: function (
            cs: NodeConnection[],
            ns: Record<string, Node>,
          ): NodeInputPortDef[] {
            return inputDefs.map((def) => ({
              ...def,
              nodeId: newNodeId,
            }));
          },
          getOutputPortDefs: function (
            cs: NodeConnection[],
            ns: Record<string, Node>,
          ): NodeOutputPortDef[] {
            return outputDefs.map((def) => ({
              ...def,
              nodeId: newNodeId,
            }));
          },
          validateInputs: node.validateInputs,
          process: node.process,
        };

        return newNode;
      })
      .filter(isNotNull);

    setNodes((ns) => [...ns, ...newNodes]);
    setSelectingNodeIds(newNodes.map((node) => node.id));

    const innerNodeConnections = connections.filter(
      (c) => nodeIds.includes(c.fromNodeId) && nodeIds.includes(c.toNodeId),
    );

    const newNodeConnections: NodeConnection[] = innerNodeConnections
      .map((c) => {
        const fromNodeId = oldNewNodeIdMap[c.fromNodeId];
        const toNodeId = oldNewNodeIdMap[c.toNodeId];

        if (!fromNodeId || !toNodeId) {
          return undefined;
        }

        return {
          ...c,
          fromNodeId,
          toNodeId,
        };
      })
      .filter(isNotNull);

    setConnections((c) => [...c, ...newNodeConnections]);
  };
}
