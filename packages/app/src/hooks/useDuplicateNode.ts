import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { nodeMapState, nodesState } from '../state/node';
import { connectionsState } from '../state/nodeconnection';
import {
  Node,
  NodeConnection,
  NodeInputPortDef,
  NodeOutputPortDef,
} from '../types/studio.type';
import { fakeId } from '../utils/fakeId';

export function useDuplicateNode() {
  const nodes = useRecoilValue(nodesState);
  const nodeMap = useRecoilValue(nodeMapState);
  const setNodes = useSetRecoilState(nodesState);
  const [connections, setConnections] = useRecoilState(connectionsState);

  return (nodeId: string) => {
    const node = nodeMap[nodeId];

    if (!node) {
      return;
    }

    // TODO: change this to globalNodeRegistry.create() from core
    const inputDefs: NodeInputPortDef[] = node.getInputPortDefs([], {});
    const outputDefs: NodeOutputPortDef[] = node.getOutputPortDefs([], {});
    const newNodeId: string = fakeId(17);
    const newNode: Node = {
      id: newNodeId,
      type: node.type,
      subType: node.subType,
      registerArgs: node.registerArgs,
      visualInfo: {
        ...node.visualInfo,
        position: {
          ...node.visualInfo.position,
          x: node.visualInfo.position.x,
          y: node.visualInfo.position.y + 200,
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

    setNodes((ns) => [...ns, newNode]);

    // Copy the connections to the from ports
    const oldNodeConnections = connections.filter(
      (c) => c.fromNodeId === nodeId,
    );
    const newNodeConnections = oldNodeConnections.map((c) => ({
      ...c,
      inputNodeId: newNode.id,
    }));
    setConnections((c) => [...c, ...newNodeConnections]);
  };
}
