import React, { FC, useCallback, useMemo } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { NodeCanvas } from './NodeCanvas';
import { useContextMenuNodeGraphHandler } from '../hooks/useContextMenuNodeGraphHandler';
import { useStableCallback } from '../hooks/useStableCallback';
import { nodeMapState, nodesState, selectingNodeIdsState } from '../state/node';
import { connectionsState } from '../state/nodeconnection';
import { selectingWireIdsState, wireDataMapState } from '../state/wire';
import { Node } from '../types/studio.type';

export const NodeGraphBuilder: FC = () => {
  const [nodes, setNodes] = useRecoilState(nodesState);
  const [connections, setConnections] = useRecoilState(connectionsState);
  const setSelectingNodeIds = useSetRecoilState(selectingNodeIdsState);
  const setSelectingWireIds = useSetRecoilState(selectingWireIdsState);
  const contextMenuNodeGraphHandler = useContextMenuNodeGraphHandler();

  const onNodesChange = useStableCallback((newNodes: Node[]) => {
    setNodes(newNodes);
  });

  const onNodesSelect = useStableCallback(
    (newNodes: Node[], isMulti?: boolean) => {
      if (isMulti) {
        setSelectingNodeIds((nodeIds: string[]) => [
          ...new Set([...nodeIds, ...newNodes.map((n) => n.id)]),
        ]);
      } else {
        if (newNodes.length > 1) return;

        setSelectingNodeIds(newNodes.map((n) => n.id));
      }
    },
  );

  const onWiresSelect = useStableCallback(
    (newWireIds: string[], isMulti?: boolean) => {
      if (isMulti) {
        setSelectingWireIds((wireIds: string[]) => [
          ...new Set([...wireIds, ...newWireIds]),
        ]);
      } else {
        if (newWireIds.length > 1) return;

        setSelectingWireIds(newWireIds);
      }
    },
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
        onWiresSelect={onWiresSelect}
        onContextMenuSelect={contextMenuNodeGraphHandler}
      />
    </ErrorBoundary>
  );
};
