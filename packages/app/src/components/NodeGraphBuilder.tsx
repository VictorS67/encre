import React, { FC, useMemo } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { useRecoilState, useRecoilValue } from 'recoil';

import { NodeCanvas } from './NodeCanvas';
import { useStableCallback } from '../hooks/useStableCallback';
import { nodeMapState, nodesState, selectingNodeIdsState } from '../state/node';
import { connectionsState } from '../state/nodeconnection';
import { Node } from '../types/studio.type';

export const NodeGraphBuilder: FC = () => {
  const [nodes, setNodes] = useRecoilState(nodesState);
  const [connections, setConnections] = useRecoilState(connectionsState);
  const [selectingNodeIds, SetSelectingNodeIds] = useRecoilState(
    selectingNodeIdsState,
  );

  const nodeMap = useRecoilValue(nodeMapState);

  const onNodesChange = useStableCallback((newNodes: Node[]) => {
    setNodes(newNodes);
    // console.log(
    //   `onNodesChange: nodes: ${JSON.stringify(nodes.map((n) => n.id))}`,
    // );
  });

  const onNodesSelect = useStableCallback((newNodes: Node[]) => {
    SetSelectingNodeIds((nodeIds: string[]) =>
      [...new Set(...nodeIds, ...newNodes.map((n) => n.id))].filter(
        (nodeId) => nodeMap[nodeId] !== null,
      ),
    );

    // console.log(
    //   `onNodesSelect: selectingNodeIds: ${JSON.stringify(selectingNodeIds)}`,
    // );
  });

  return (
    <ErrorBoundary
      fallback={<div>There is something wrong in NodeCanvas...</div>}
    >
      <NodeCanvas
        nodes={nodes}
        connections={connections}
        onNodesChange={onNodesChange}
        onConnectionsChange={setConnections}
        onNodesSelect={onNodesSelect}
      />
    </ErrorBoundary>
  );
};
