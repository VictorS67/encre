import React, { FC, useCallback, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { useContextMenuNodeGraphHandler } from '../hooks/useContextMenuNodeGraphHandler';
import { useEditorClick } from '../hooks/useEditorClick';
import { useStableCallback } from '../hooks/useStableCallback';
import { commentsState, selectingCommentIdsState } from '../state/comment';
import { nodesState, selectingNodeIdsState } from '../state/node';
import { connectionsState } from '../state/nodeconnection';
import { selectingWireIdsState } from '../state/wire';
import { GraphComment, Node, RecordId } from '../types/studio.type';

import { NodeCanvas } from './NodeCanvas';

export const NodeGraphBuilder: FC = () => {
  const [nodes, setNodes] = useRecoilState(nodesState);
  const [connections, setConnections] = useRecoilState(connectionsState);
  const [comments, setComments] = useRecoilState(commentsState);
  const setSelectingNodeIds = useSetRecoilState(selectingNodeIdsState);
  const setSelectingCommentIds = useSetRecoilState(selectingCommentIdsState);
  const setSelectingWireIds = useSetRecoilState(selectingWireIdsState);
  const contextMenuNodeGraphHandler = useContextMenuNodeGraphHandler();

  const onNodesChange = useStableCallback((newNodes: Node[]) => {
    setNodes(newNodes);
  });

  const onCommentsChange = useStableCallback((newComments: GraphComment[]) => {
    setComments(newComments);
  });

  const onNodesSelect = useStableCallback(
    (newNodes: Node[], isMulti?: boolean) => {
      if (isMulti) {
        setSelectingNodeIds((nodeIds: RecordId[]) => [
          ...new Set([...nodeIds, ...newNodes.map((n) => n.id)]),
        ]);
      } else {
        if (newNodes.length > 1) return;

        setSelectingNodeIds(newNodes.map((n) => n.id));
      }
    },
  );

  const onCommentsSelect = useStableCallback(
    (newComments: GraphComment[], isMulti?: boolean) => {
      if (isMulti) {
        setSelectingCommentIds((commentIds: RecordId[]) => [
          ...new Set([...commentIds, ...newComments.map((c) => c.id)]),
        ]);
      } else {
        if (newComments.length > 1) return;

        setSelectingCommentIds(newComments.map((c) => c.id));
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
      <div>testing...</div>
      {/* <NodeCanvas
        nodes={nodes}
        connections={connections}
        comments={comments}
        onNodesChange={onNodesChange}
        onCommentsChange={onCommentsChange}
        onConnectionsChange={setConnections}
        onNodesSelect={onNodesSelect}
        onCommentsSelect={onCommentsSelect}
        onWiresSelect={onWiresSelect}
        onContextMenuSelect={contextMenuNodeGraphHandler}
      /> */}
    </ErrorBoundary>
  );
};
