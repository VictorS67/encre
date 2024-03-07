import React, { FC, useCallback, useMemo } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { useRecoilState, useRecoilValue } from 'recoil';

import { NodeCanvas } from './NodeCanvas';
import { useStableCallback } from '../hooks/useStableCallback';
import { isDraggingMultipleNodesState } from '../state/canvas';
import { nodeMapState, nodesState, selectingNodeIdsState } from '../state/node';
import { connectionsState } from '../state/nodeconnection';
import { Node } from '../types/studio.type';

export const NodeGraphBuilder: FC = () => {
  const [nodes, setNodes] = useRecoilState(nodesState);
  const [connections, setConnections] = useRecoilState(connectionsState);
  const [selectingNodeIds, setSelectingNodeIds] = useRecoilState(
    selectingNodeIdsState,
  );

  const nodeMap = useRecoilValue(nodeMapState);

  const onNodesChange = useStableCallback((newNodes: Node[]) => {
    setNodes(newNodes);
    // console.log(
    //   `onNodesChange: nodes: ${JSON.stringify(nodes.map((n) => n.id))}`,
    // );
  });

  const onNodesSelect = useCallback(
    (newNodes: Node[], isMulti?: boolean) => {
      // console.log(
      //   `onNodeStartDrag: selectingNodeIds: --- ${newNodes.map(
      //     (n) => n.id,
      //   )}, isDraggingMultipleNodes: ${isMulti}`,
      // );

      if (isMulti) {
        setSelectingNodeIds((nodeIds: string[]) =>
          [...new Set([...nodeIds, ...newNodes.map((n) => n.id)])].filter(
            (nodeId) => nodeMap[nodeId] !== null,
          ),
        );
      } else {
        if (newNodes.length > 1) return;

        setSelectingNodeIds(
          newNodes
            .map((n) => n.id)
            .filter((nodeId) => nodeMap[nodeId] !== null),
        );
      }

      // console.log(
      //   `onNodesSelect: selectingNodeIds: ${JSON.stringify(selectingNodeIds)}`,
      // );
    },
    [nodeMap],
  );

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
